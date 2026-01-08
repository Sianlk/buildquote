import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { projectId, drawingType, geometry } = await req.json();

    if (!projectId || !drawingType || !geometry) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: projectId, drawingType, geometry' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { length_m, width_m, height_m, floor_area_sqm, wall_type, roof_type, foundation_type, windows, doors, rooms } = geometry;

    // Create detailed prompt based on drawing type
    let systemPrompt = `You are an expert architectural CAD draughtsman following UK BS 1192 standards. Generate clean, accurate SVG drawings for construction projects. 
    
Key requirements:
- Use proper architectural symbols and conventions
- Include dimensions in meters
- Follow UK Building Regulations conventions
- Include scale reference (1:100 or as appropriate)
- Use proper line weights: thick for walls, medium for doors/windows, thin for dimensions
- Include a title block with project details
- Add North arrow for floor plans
- Include section markers where appropriate

The SVG must be self-contained with embedded styles. Use a viewBox appropriate for A3/A4 printing.`;

    let userPrompt = '';

    if (drawingType === 'floor_plan') {
      userPrompt = `Generate a detailed floor plan SVG for an extension with these specifications:

DIMENSIONS:
- Length: ${length_m}m
- Width: ${width_m}m  
- Floor Area: ${floor_area_sqm}m²
- Ceiling Height: ${height_m}m

CONSTRUCTION:
- Wall Type: ${wall_type} (typically 300mm cavity wall with insulation)
- Foundation: ${foundation_type}

OPENINGS:
- Windows: ${JSON.stringify(windows || [])}
- Doors: ${JSON.stringify(doors || [])}

${rooms ? `ROOMS: ${JSON.stringify(rooms)}` : ''}

Create a professional floor plan showing:
1. All walls with proper thickness (outer walls 300mm, inner walls 100mm)
2. Window openings with glazing indication
3. Door swings with proper arcs
4. Room labels if applicable
5. Overall dimensions and internal dimensions
6. Scale bar (1:50)
7. North arrow
8. Title block with "Floor Plan - ${floor_area_sqm}m² Extension"

Return ONLY valid SVG code, no explanation.`;
    } else if (drawingType === 'elevation_front') {
      userPrompt = `Generate a front elevation SVG for an extension with these specifications:

DIMENSIONS:
- Width: ${width_m}m
- Height to eaves: ${height_m}m
- Roof Type: ${roof_type}

OPENINGS:
- Windows: ${JSON.stringify(windows || [])}
- Doors: ${JSON.stringify(doors || [])}

Create a professional front elevation showing:
1. Ground level with hatching
2. Wall finish (rendered/brick indication)
3. All windows with glazing bars
4. External doors
5. Roof profile with ${roof_type} design
6. Gutters and downpipes
7. DPC line indication
8. Vertical dimensions (floor to ceiling, overall height)
9. Horizontal dimensions
10. Scale bar (1:50)
11. Title block with "Front Elevation"

Return ONLY valid SVG code, no explanation.`;
    } else if (drawingType === 'elevation_side') {
      userPrompt = `Generate a side elevation SVG for an extension with these specifications:

DIMENSIONS:
- Length: ${length_m}m
- Height to eaves: ${height_m}m
- Roof Type: ${roof_type}

OPENINGS:
- Windows: ${JSON.stringify(windows || [])}

Create a professional side elevation showing:
1. Ground level with hatching
2. Wall finish indication
3. Any side windows
4. Roof profile meeting existing building
5. Dimensions
6. Scale bar (1:50)
7. Title block with "Side Elevation"

Return ONLY valid SVG code, no explanation.`;
    } else if (drawingType === 'section') {
      userPrompt = `Generate a building section SVG for an extension with these specifications:

DIMENSIONS:
- Width: ${width_m}m
- Height: ${height_m}m
- Foundation: ${foundation_type}
- Wall Type: ${wall_type}
- Roof Type: ${roof_type}

Create a professional building section showing:
1. Foundation detail (${foundation_type})
2. Floor construction (typical 150mm concrete slab with insulation)
3. Wall construction layers (inner leaf, insulation, outer leaf)
4. Wall plate and roof structure
5. Insulation zones hatched
6. Ventilation paths
7. DPC and DPM positions
8. Dimensions for all elements
9. Building Regs Part L U-values annotation:
   - Floor: 0.18 W/m²K
   - Wall: 0.18 W/m²K
   - Roof: 0.13 W/m²K
10. Scale bar (1:20)
11. Title block with "Section A-A"

Return ONLY valid SVG code, no explanation.`;
    } else if (drawingType === 'site_plan') {
      userPrompt = `Generate a site plan SVG showing the extension position:

DIMENSIONS:
- Extension: ${length_m}m x ${width_m}m (${floor_area_sqm}m²)

Create a professional site plan showing:
1. Outline of existing dwelling (indicative rectangle)
2. Extension position with hatching
3. Boundary lines
4. North arrow
5. Access path indication
6. Dimension to boundaries (typical 1m minimum)
7. Scale bar (1:200)
8. Title block with "Site Plan"
9. Key/legend

Return ONLY valid SVG code, no explanation.`;
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid drawingType. Use: floor_plan, elevation_front, elevation_side, section, site_plan' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating ${drawingType} for project ${projectId}`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    let svgContent = data.choices?.[0]?.message?.content || '';
    
    // Clean up the response - extract just the SVG
    const svgMatch = svgContent.match(/<svg[\s\S]*<\/svg>/i);
    if (svgMatch) {
      svgContent = svgMatch[0];
    }

    // Generate geometry hash for caching
    const geometryHash = btoa(JSON.stringify({ length_m, width_m, height_m, wall_type, roof_type })).substring(0, 32);

    // Store in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: drawing, error: dbError } = await supabase
      .from('cad_drawings')
      .insert({
        project_id: projectId,
        drawing_type: drawingType,
        svg_content: svgContent,
        geometry_hash: geometryHash,
        project_type: geometry.project_type || 'single_storey_rear',
        is_watermarked: true,
        metadata: {
          generated_at: new Date().toISOString(),
          dimensions: { length_m, width_m, height_m },
          model: 'google/gemini-2.5-flash'
        }
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Still return the SVG even if DB save fails
    }

    console.log(`Successfully generated ${drawingType} drawing`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        svgContent,
        drawingId: drawing?.id,
        drawingType,
        geometryHash
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in generate-cad function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate CAD drawing';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
