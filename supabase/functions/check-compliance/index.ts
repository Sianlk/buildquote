import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// UK Building Regulations compliance rules
const BUILDING_REGS = {
  partL: {
    name: 'Part L - Conservation of Fuel and Power',
    checks: [
      { id: 'u_value_walls', name: 'Wall U-Value', threshold: 0.18, unit: 'W/m²K', description: 'External walls must achieve U-value ≤ 0.18 W/m²K' },
      { id: 'u_value_floor', name: 'Floor U-Value', threshold: 0.18, unit: 'W/m²K', description: 'Ground floor must achieve U-value ≤ 0.18 W/m²K' },
      { id: 'u_value_roof', name: 'Roof U-Value', threshold: 0.13, unit: 'W/m²K', description: 'Roof must achieve U-value ≤ 0.13 W/m²K' },
      { id: 'u_value_windows', name: 'Window U-Value', threshold: 1.4, unit: 'W/m²K', description: 'Windows must achieve U-value ≤ 1.4 W/m²K' },
      { id: 'u_value_doors', name: 'Door U-Value', threshold: 1.4, unit: 'W/m²K', description: 'External doors must achieve U-value ≤ 1.4 W/m²K' },
      { id: 'glazing_area', name: 'Glazing Area Limit', threshold: 25, unit: '%', description: 'Total glazed area should not exceed 25% of floor area for extensions' },
    ]
  },
  partB: {
    name: 'Part B - Fire Safety',
    checks: [
      { id: 'escape_window', name: 'Escape Window', description: 'Habitable rooms above ground floor require escape windows (min 450mm x 450mm clear opening)' },
      { id: 'fire_door', name: 'Fire Door Requirements', description: 'FD30 fire doors required to protected escape routes' },
      { id: 'smoke_detection', name: 'Smoke Detection', description: 'Smoke alarms required on each floor, heat detector in kitchen' },
      { id: 'escape_route', name: 'Escape Route', description: 'Travel distance to exit must not exceed 9m (single direction) or 18m (alternative exits)' },
    ]
  },
  partK: {
    name: 'Part K - Protection from Falling',
    checks: [
      { id: 'stair_pitch', name: 'Stair Pitch', threshold: 42, unit: 'degrees', description: 'Maximum stair pitch 42° for private stairs' },
      { id: 'handrail_height', name: 'Handrail Height', min: 900, max: 1000, unit: 'mm', description: 'Handrails required between 900-1000mm from pitch line' },
      { id: 'guarding_height', name: 'Guarding Height', threshold: 1100, unit: 'mm', description: 'Minimum guarding height 1100mm for balconies/galleries' },
    ]
  },
  partM: {
    name: 'Part M - Access',
    checks: [
      { id: 'door_width', name: 'Door Width', threshold: 775, unit: 'mm', description: 'Minimum clear opening width 775mm for doorways' },
      { id: 'level_threshold', name: 'Level Threshold', threshold: 15, unit: 'mm', description: 'Maximum threshold height 15mm at principal entrance' },
    ]
  },
  permittedDevelopment: {
    name: 'Permitted Development Rights',
    checks: [
      { id: 'pd_rear_single', name: 'Single Storey Rear Depth', attached: 3, detached: 4, unit: 'm', description: 'Max depth from rear wall: 3m (attached) or 4m (detached)' },
      { id: 'pd_height_eaves', name: 'Eaves Height', threshold: 3, unit: 'm', description: 'Maximum eaves height 3m' },
      { id: 'pd_height_overall', name: 'Overall Height', threshold: 4, unit: 'm', description: 'Maximum overall height 4m (single storey)' },
      { id: 'pd_side_width', name: 'Side Extension Width', threshold: 50, unit: '%', description: 'Side extension must not exceed 50% of original house width' },
      { id: 'pd_boundary_distance', name: 'Boundary Distance', threshold: 2, unit: 'm', description: 'Extensions over 1m high must be 2m from boundary' },
      { id: 'pd_floor_area', name: 'Floor Area Limit', threshold: 50, unit: '%', description: 'Extensions must not exceed 50% of original curtilage' },
    ]
  }
};

interface ComplianceResult {
  checkName: string;
  regulation: string;
  passed: boolean;
  status: 'pass' | 'fail' | 'warning' | 'info';
  details: string;
  aiExplanation?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check - verify JWT before expensive AI operations
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: authError } = await authClient.auth.getClaims(token);
    if (authError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log(`Authenticated user: ${userId}`);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const { projectId, geometry, projectType } = await req.json();

    if (!projectId || !geometry) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: projectId, geometry' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { length_m, width_m, height_m, floor_area_sqm, wall_type, roof_type, windows, doors, electrical_points } = geometry;
    const results: ComplianceResult[] = [];

    // Calculate glazing area percentage
    const totalGlazingArea = (windows || []).reduce((sum: number, w: any) => sum + (w.width * w.height), 0);
    const glazingPercentage = floor_area_sqm > 0 ? (totalGlazingArea / floor_area_sqm) * 100 : 0;

    // Part L Checks
    results.push({
      checkName: 'Wall Insulation U-Value',
      regulation: 'Part L',
      passed: wall_type === 'cavity' || wall_type === 'sips' || wall_type === 'icf' || wall_type === 'timber_frame',
      status: (wall_type === 'cavity' || wall_type === 'sips' || wall_type === 'icf' || wall_type === 'timber_frame') ? 'pass' : 'warning',
      details: `Wall type: ${wall_type}. ${wall_type === 'cavity' ? 'Cavity wall with proper insulation typically achieves 0.18 W/m²K.' : 'Verify U-value calculation with SAP assessment.'}`,
    });

    results.push({
      checkName: 'Roof Insulation U-Value',
      regulation: 'Part L',
      passed: true,
      status: 'pass',
      details: `${roof_type} roof specified. Ensure 300mm mineral wool or equivalent for 0.13 W/m²K compliance.`,
    });

    results.push({
      checkName: 'Glazing Area Ratio',
      regulation: 'Part L',
      passed: glazingPercentage <= 25,
      status: glazingPercentage <= 25 ? 'pass' : 'warning',
      details: `Glazed area: ${glazingPercentage.toFixed(1)}% of floor area. ${glazingPercentage > 25 ? 'Exceeds 25% notional limit - SAP calculation required to demonstrate compliance.' : 'Within acceptable limits.'}`,
    });

    // Part B Fire Safety Checks
    const hasUpperFloor = projectType?.includes('double') || projectType?.includes('loft');
    results.push({
      checkName: 'Escape Windows',
      regulation: 'Part B',
      passed: !hasUpperFloor || (windows && windows.length > 0),
      status: hasUpperFloor ? (windows && windows.length > 0 ? 'pass' : 'fail') : 'info',
      details: hasUpperFloor 
        ? 'Upper floor habitable rooms require escape windows. Ensure min 450mm x 450mm clear opening, max 1100mm sill height.'
        : 'Ground floor extension - escape window not mandatory but recommended.',
    });

    results.push({
      checkName: 'Smoke Detection',
      regulation: 'Part B',
      passed: true,
      status: 'warning',
      details: 'Interlinked smoke alarms required on all floors. Heat detector required if kitchen included. Specify LD2 system for loft conversions.',
    });

    // Permitted Development Checks
    const isSingleStorey = projectType?.includes('single') || height_m <= 3;
    
    results.push({
      checkName: 'Extension Depth (PD)',
      regulation: 'Permitted Development',
      passed: isSingleStorey && length_m <= 4,
      status: length_m <= 3 ? 'pass' : (length_m <= 4 ? 'warning' : 'fail'),
      details: `Depth: ${length_m}m. ${length_m <= 3 ? 'Within 3m limit for attached properties.' : length_m <= 4 ? 'Within 4m limit for detached properties only. Verify property type.' : 'Exceeds PD limits - planning permission required.'}`,
    });

    results.push({
      checkName: 'Eaves Height (PD)',
      regulation: 'Permitted Development',
      passed: height_m <= 3,
      status: height_m <= 3 ? 'pass' : 'fail',
      details: `Eaves height: ${height_m}m. ${height_m <= 3 ? 'Within 3m PD limit.' : 'Exceeds 3m limit - planning permission required.'}`,
    });

    results.push({
      checkName: 'Floor Area Limit',
      regulation: 'Permitted Development',
      passed: floor_area_sqm <= 50,
      status: floor_area_sqm <= 50 ? 'pass' : 'warning',
      details: `Floor area: ${floor_area_sqm}m². ${floor_area_sqm <= 50 ? 'Within typical PD limits.' : 'May exceed 50% of original curtilage - verify against site measurements.'}`,
    });

    // Part K Checks (if stairs involved)
    if (projectType?.includes('loft') || hasUpperFloor) {
      results.push({
        checkName: 'Stair Requirements',
        regulation: 'Part K',
        passed: true,
        status: 'warning',
        details: 'Loft conversion requires compliant stair: max 42° pitch, min 220mm going, max 220mm rise. Handrails 900-1000mm from pitch line.',
      });
    }

    // Part M Access Checks
    const hasComplientDoors = doors && doors.some((d: any) => d.width >= 0.775);
    results.push({
      checkName: 'Door Width Accessibility',
      regulation: 'Part M',
      passed: hasComplientDoors !== false,
      status: hasComplientDoors ? 'pass' : 'warning',
      details: `${hasComplientDoors ? 'Door widths meet 775mm minimum.' : 'Verify door widths meet 775mm clear opening for accessibility.'}`,
    });

    // Generate AI explanation for complex checks if API available
    if (LOVABLE_API_KEY) {
      try {
        const failedChecks = results.filter(r => r.status === 'fail' || r.status === 'warning');
        
        if (failedChecks.length > 0) {
          const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash',
              messages: [
                { 
                  role: 'system', 
                  content: 'You are a UK Building Control Officer providing clear, helpful explanations of building regulation requirements. Be concise but thorough.' 
                },
                { 
                  role: 'user', 
                  content: `For a ${floor_area_sqm}m² extension project, provide brief remediation advice for these compliance issues:\n\n${failedChecks.map(c => `- ${c.checkName} (${c.regulation}): ${c.details}`).join('\n')}\n\nProvide actionable steps to achieve compliance.` 
                }
              ],
              max_tokens: 1000,
            }),
          });

          if (response.ok) {
            const aiData = await response.json();
            const aiAdvice = aiData.choices?.[0]?.message?.content || '';
            
            // Add AI advice to overall summary
            results.push({
              checkName: 'Compliance Guidance',
              regulation: 'AI Advisory',
              passed: true,
              status: 'info',
              details: 'See detailed AI-generated compliance guidance below.',
              aiExplanation: aiAdvice,
            });
          }
        }
      } catch (aiError) {
        console.error('AI explanation error:', aiError);
      }
    }

    // Calculate overall compliance score
    const passCount = results.filter(r => r.passed).length;
    const totalChecks = results.filter(r => r.status !== 'info').length;
    const complianceScore = totalChecks > 0 ? Math.round((passCount / totalChecks) * 100) : 100;

    // Save results to database using service role for write operations
    const supabaseServiceUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseServiceUrl, supabaseServiceKey);

    // Clear old compliance reports for this project
    await supabase.from('compliance_reports').delete().eq('project_id', projectId);

    // Insert new reports
    const reportsToInsert = results.map(r => ({
      project_id: projectId,
      check_name: r.checkName,
      regulation: r.regulation,
      passed: r.passed,
      status: r.status,
      details: r.details,
      ai_explanation: r.aiExplanation || null,
    }));

    const { error: dbError } = await supabase
      .from('compliance_reports')
      .insert(reportsToInsert);

    if (dbError) {
      console.error('Database error:', dbError);
    }

    console.log(`Compliance check completed for project ${projectId}: ${complianceScore}% compliant`);

    return new Response(
      JSON.stringify({
        success: true,
        complianceScore,
        results,
        summary: {
          total: totalChecks,
          passed: passCount,
          warnings: results.filter(r => r.status === 'warning').length,
          failed: results.filter(r => r.status === 'fail').length,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in check-compliance function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to check compliance';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
