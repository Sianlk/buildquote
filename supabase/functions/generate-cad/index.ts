import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Architectural symbols and drawing helpers
const ELECTRICAL_SYMBOLS = {
  socket_double: '⊠⊠',
  socket_single: '⊠',
  switch_1g: '○',
  switch_2g: '○○',
  switch_dimmer: '◐',
  ceiling_rose: '⊕',
  downlight: '●',
  smoke_detector: '⊗SD',
  co_detector: '⊗CO',
  consumer_unit: '▣CU',
  thermostat: '◎T',
  extractor_fan: '⊛F',
  tv_point: '⊠TV',
  data_point: '⊠D',
  usb_socket: '⊠U',
  outside_light: '○E',
  pir_sensor: '◐PIR',
};

const PLUMBING_SYMBOLS = {
  basin: 'oval basin symbol',
  wc: 'WC plan symbol',
  bath: 'rectangular bath',
  shower_tray: 'shower tray square',
  radiator: 'radiator rectangle',
  boiler: 'boiler symbol',
  hot_water_cylinder: 'cylinder symbol',
  kitchen_sink: 'double sink symbol',
  washing_machine: 'WM square',
  dishwasher: 'DW square',
  underfloor_heating: 'UFH zone hatching',
};

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
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { projectId, drawingType, geometry } = await req.json();

    if (!drawingType || !geometry) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: drawingType, geometry' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const isStandalone = !projectId || projectId.startsWith('standalone-');
    const { 
      length_m, width_m, height_m, floor_area_sqm, wall_type, wall_thickness,
      roof_type, foundation_type, foundation_details, windows, doors, rooms,
      electrical, plumbing, buildingRegs, structural 
    } = geometry;

    // Enhanced system prompt for professional architectural drawings - OPTIMIZED FOR NO TEXT OVERLAP
    const systemPrompt = `You are an expert UK architectural CAD draughtsman with 20+ years experience creating construction drawings to BS 1192:2007+A2:2016 and BS EN ISO 7200 standards.

CRITICAL LAYOUT REQUIREMENTS - PREVENT TEXT OVERLAP:
1. Generate ONLY valid, complete SVG code - no text explanations
2. TEXT SPACING RULES (CRITICAL):
   - Minimum 15px vertical spacing between text elements
   - Dimension text positioned 25px OUTSIDE dimension lines
   - Room labels positioned at CENTER of room with 20px padding from walls
   - Door/window labels placed 30px away from the element
   - Never stack more than 2 text elements vertically
   - Use font-size: 10px for dimensions, 12px for room names, 8px for annotations
   - All text must have white/light background rectangles for readability
   
3. DIMENSION LINE LAYOUT:
   - External dimensions: 40px offset from building outline
   - Second tier dimensions: 70px offset (chain dimensions)
   - Internal room dimensions: centered within rooms, not on walls
   - Use extension lines that stop 5px before wall face
   - Arrowheads or ticks at 45°, 8px length
   
4. SYMBOL PLACEMENT:
   - Electrical symbols: minimum 50px apart
   - Plumbing symbols: accurate to fixture size, labels offset 15px
   - Door swings: 90° arc, never overlapping adjacent doors
   - Window indication: centered in opening
   
5. Use proper architectural line weights: 
   - Walls: stroke-width: 3 (0.5mm)
   - Doors/Windows: stroke-width: 2 (0.35mm)
   - Dimensions: stroke-width: 1 (0.25mm)
   - Hidden lines: dashed, stroke-width: 1
   
6. Standard symbols per BS 1635 and BS 8541
7. Dimensions in millimeters, text at 2.5mm height (scaled)
8. North arrow (↑N) top-left with clear spacing
9. Scale bar with 1m increments, bottom of drawing
10. Title block bottom right: 120x60px area, drawing title, scale, date, revision

FIXTURE & FITTING DETAILS TO INCLUDE:
- Kitchen: worktop outline, sink position, hob symbol, fridge space, dishwasher
- Bathroom: WC (plan symbol 400x700), basin (oval 500x400), bath (1700x700), shower tray
- Living areas: furniture zone indicators, TV point, radiator positions
- Bedrooms: wardrobe zone, bed space indicator
- All rooms: door furniture side, switch positions at 1200mm AFL

DOOR REPRESENTATION:
- Show door leaf as arc (90° swing), line weight 2
- Door frame as thick rectangle
- Indicate swing direction with arrow
- Standard widths: 826mm, 926mm internal; 838mm, 914mm external
- Label: "D1", "D2" etc with dimension below

WINDOW REPRESENTATION:
- Double lines for frame (frame thickness 70mm typical)
- Glazing line in center
- Opening direction indicator (triangle)
- Sill line projection on external side
- Label: "W1 1200x1050" format

SVG SPECIFICATIONS:
- viewBox: "0 0 1200 800" for A3 landscape at 1:50
- Use <defs> for reusable symbols (doors, windows, electrical, plumbing)
- Group elements: <g id="walls">, <g id="dimensions">, <g id="fixtures">, <g id="labels">
- Labels layer rendered LAST to appear on top
- Embedded stylesheet in <style> tag
- Add subtle grid lines at 1000mm intervals (stroke: #eee)
- Clean, well-organized, commented code`;

    let userPrompt = '';
    const scale = 50; // 1:50 scale
    const svgWidth = 1200;
    const svgHeight = 800;
    const margin = 100;

    // Build room details string
    const roomDetails = rooms?.map((r: any) => 
      `- ${r.name}: ${r.length}m x ${r.width}m (${(r.length * r.width).toFixed(1)}m²)
        Windows: ${r.windows?.map((w: any) => `${w.type} ${w.width}x${w.height}m x${w.quantity}`).join(', ') || 'none'}
        Doors: ${r.doors?.map((d: any) => `${d.type} ${d.width}m ${d.swing}-swing`).join(', ') || 'none'}
        Electrical: ${r.electrical?.map((e: any) => `${e.type} x${e.quantity}`).join(', ') || 'none'}
        Plumbing: ${r.plumbing?.map((p: any) => `${p.type} x${p.quantity}`).join(', ') || 'none'}
        Flooring: ${r.flooring || 'not specified'}
        Heating: ${r.heating || 'radiator'}`
    ).join('\n') || 'Single open-plan space';

    if (drawingType === 'floor_plan') {
      userPrompt = `Generate a professional floor plan SVG drawing for a UK ${geometry.project_type?.replace(/_/g, ' ')} extension.

OVERALL DIMENSIONS:
- External Length: ${length_m}m (${length_m * 1000}mm)
- External Width: ${width_m}m (${width_m * 1000}mm)
- Floor Area: ${floor_area_sqm}m²
- Ceiling Height: ${height_m}m

CONSTRUCTION SPECIFICATION:
- Wall Construction: ${wall_type} (${wall_thickness}mm thickness, U-value ${structural?.wall_uValue || 0.18} W/m²K)
- Foundation: ${foundation_type} (${foundation_details?.depth || '1000mm'} deep, ${foundation_details?.width || '600mm'} wide)

ROOM LAYOUT:
${roomDetails}

DRAWING REQUIREMENTS:
1. Show all walls with correct thickness - external ${wall_type === 'cavity' ? '300mm' : '200mm'}, internal 100mm
2. Each door with 90° swing arc showing opening direction
3. Windows with double-line frame and glazing indication
4. All electrical symbols positioned correctly:
   - Sockets at appropriate positions
   - Light switches beside doors (handle side)
   - Ceiling lights centered or as specified
   - Smoke detectors in circulation areas
5. Plumbing fixtures with standard BS symbols
6. Dimension strings:
   - Overall external dimensions
   - Internal room dimensions
   - Window/door positions from corners
7. Room labels with area in m²
8. North arrow top-left
9. Scale bar showing 0-1-2-3m
10. Title block: "FLOOR PLAN - ${geometry.project_type?.replace(/_/g, ' ').toUpperCase()}", Scale 1:50
11. Grid lines A-B-C and 1-2-3 for reference
12. DPC line indication

BUILDING REGS ANNOTATIONS:
${buildingRegs?.passes?.join('\n') || 'Standard compliance'}

Generate complete SVG with viewBox="0 0 ${svgWidth} ${svgHeight}".
Return ONLY the SVG code, no explanation.`;

    } else if (drawingType === 'elevation_front') {
      userPrompt = `Generate a professional front elevation SVG for a UK ${geometry.project_type?.replace(/_/g, ' ')}.

DIMENSIONS:
- Width: ${width_m}m
- Height to Eaves: ${height_m}m
- Roof Type: ${roof_type}

OPENINGS:
${windows?.map((w: any) => `- Window: ${w.width}x${w.height}m ${w.type || 'casement'}`).join('\n') || '- Standard windows'}
${doors?.filter((d: any) => d.room).map((d: any) => `- ${d.type} door: ${d.width}x${d.height}m`).join('\n') || '- External door 900x2100mm'}

DRAWING REQUIREMENTS:
1. Ground level with hatch pattern
2. DPC line at 150mm
3. Wall finish indication (render/brick texture)
4. Windows with:
   - Frame profile
   - Glazing bars (if applicable)
   - Opening lights indicated
   - Cill and lintel
5. External door with:
   - Frame detail
   - Panel indication
   - Threshold
6. Roof:
   - ${roof_type} profile at correct pitch
   - Ridge line
   - Eaves detail with gutter
   - Fascia and soffit
7. Rainwater goods:
   - Gutter (half-round or square)
   - Downpipe position
8. Dimensions:
   - Overall height
   - Floor to window head/cill
   - Eaves height
   - Window widths
9. Material annotations
10. Title block: "FRONT ELEVATION", Scale 1:50

Generate complete SVG with viewBox="0 0 ${svgWidth} ${svgHeight}".`;

    } else if (drawingType === 'elevation_side') {
      userPrompt = `Generate a professional side elevation SVG for a UK ${geometry.project_type?.replace(/_/g, ' ')}.

DIMENSIONS:
- Length: ${length_m}m
- Height: ${height_m}m
- Roof: ${roof_type}

Show junction with existing building, roof slope, windows if any, and full dimensions.
Title block: "SIDE ELEVATION", Scale 1:50

Generate complete SVG with viewBox="0 0 ${svgWidth} ${svgHeight}".`;

    } else if (drawingType === 'section') {
      userPrompt = `Generate a professional building section SVG for a UK ${geometry.project_type?.replace(/_/g, ' ')}.

DIMENSIONS:
- Width: ${width_m}m
- Height: ${height_m}m
- Foundation: ${foundation_type}
- Wall: ${wall_type}
- Roof: ${roof_type}

SECTION REQUIREMENTS:
1. Foundation detail:
   - ${foundation_type} at ${foundation_details?.depth || '1000mm'} depth
   - Concrete specification
   - DPM indication
2. Floor construction:
   - 150mm concrete slab
   - 100mm insulation (U-value annotation)
   - 65mm screed
   - Floor finish
3. Wall construction (cut through):
   - Inner leaf (block)
   - Cavity with insulation
   - Outer leaf
   - Wall ties indication
   - DPC at 150mm
4. Roof construction:
   - Rafters/joists
   - Insulation between/over
   - Ceiling
   - Ventilation path
   - Fascia/soffit
5. Annotations:
   - U-values for each element
   - Material specifications
   - Dimension strings
6. Insulation zones with hatching
7. Ventilation arrows

BUILDING REGS U-VALUES:
- Floor: ${structural?.floor_uValue || 0.13} W/m²K
- Wall: ${structural?.wall_uValue || 0.18} W/m²K  
- Roof: ${structural?.roof_uValue || 0.11} W/m²K

Title block: "SECTION A-A", Scale 1:20

Generate complete SVG with viewBox="0 0 ${svgWidth} ${svgHeight}".`;

    } else if (drawingType === 'electrical_layout') {
      userPrompt = `Generate a professional electrical layout plan SVG for a UK ${geometry.project_type?.replace(/_/g, ' ')}.

FLOOR PLAN BASE:
- Length: ${length_m}m, Width: ${width_m}m
- Rooms: ${rooms?.map((r: any) => r.name).join(', ') || 'Open plan'}

ELECTRICAL REQUIREMENTS:
${rooms?.map((r: any) => 
  `${r.name}:\n${r.electrical?.map((e: any) => `  - ${e.type}: ${e.quantity} no.`).join('\n') || '  Standard provisions'}`
).join('\n') || 'Standard domestic installation'}

DRAWING REQUIREMENTS:
1. Floor plan outline (thin line)
2. All electrical symbols per BS EN 60617:
   - Socket outlets with "2G" label
   - Light switches with gang indication
   - Ceiling roses/downlights
   - Smoke/CO detectors with "SD"/"CO"
   - Consumer unit position
3. Circuit indication:
   - Lighting circuit (dashed)
   - Ring main (solid)
   - Radials (dot-dash)
4. Cable routes
5. Switch-to-light connections
6. Legend/key for all symbols
7. Notes:
   - "All work to BS 7671"
   - "RCD protection to all circuits"
   - Socket heights 450mm AFL (Part M)
8. Title block: "ELECTRICAL LAYOUT", Scale 1:50

Generate complete SVG with viewBox="0 0 ${svgWidth} ${svgHeight}".`;

    } else if (drawingType === 'plumbing_layout') {
      userPrompt = `Generate a professional plumbing/heating layout SVG for a UK ${geometry.project_type?.replace(/_/g, ' ')}.

FLOOR PLAN BASE:
- Length: ${length_m}m, Width: ${width_m}m

PLUMBING FIXTURES:
${rooms?.map((r: any) => 
  `${r.name}:\n${r.plumbing?.map((p: any) => `  - ${p.type}: ${p.quantity} no.`).join('\n') || '  No plumbing'}\n  Heating: ${r.heating || 'radiator'}`
).join('\n') || 'Standard provisions'}

DRAWING REQUIREMENTS:
1. Floor plan outline
2. Sanitary fixtures with BS symbols:
   - WC with cistern
   - Basin with waste
   - Bath/shower
3. Pipework:
   - Hot water (red, 15/22mm)
   - Cold water (blue, 15/22mm)
   - Waste (green, 32/40/110mm)
4. Heating:
   - Radiator positions with sizes
   - UFH zones (if applicable)
   - Boiler position
   - Flow/return
5. Annotations:
   - Pipe sizes
   - Falls on waste
   - Valve positions
6. Legend for pipe types
7. Notes:
   - "Hot water 48°C max (TMV)"
   - "All to Building Regs Part G/H"
8. Title block: "PLUMBING & HEATING LAYOUT", Scale 1:50

Generate complete SVG with viewBox="0 0 ${svgWidth} ${svgHeight}".`;

    } else if (drawingType === 'structural_details') {
      userPrompt = `Generate a professional structural details sheet SVG for a UK ${geometry.project_type?.replace(/_/g, ' ')}.

PROJECT DATA:
- Span: ${length_m}m x ${width_m}m
- Foundation: ${foundation_type}
- Walls: ${wall_type}
- Roof: ${roof_type}
- Steel Required: ${structural?.steelRequired ? 'Yes' : 'No'}
- Load Bearing Walls: ${structural?.loadBearing ? 'Yes' : 'No'}

DETAILS TO SHOW:
1. Foundation Section (1:20):
   - ${foundation_type} detail
   - Depth: ${foundation_details?.depth || '1000mm'}
   - Width: ${foundation_details?.width || '600mm'}
   - Reinforcement if required
   
2. Wall-Floor Junction (1:10):
   - DPM/DPC detail
   - Cavity tray
   - Insulation continuity

3. Lintel Detail (1:10):
   - Steel lintel for openings >1200mm
   - Bearing 150mm each end
   - Cavity closer

4. ${structural?.steelRequired ? `Steel Beam Detail (1:10):
   - Preliminary size: 152x89 UB (verify with engineer)
   - Padstones 215x215x215
   - Fire protection if required` : 'Timber joist span tables reference'}

5. Eaves Detail (1:10):
   - Rafter to wall plate
   - Soffit ventilation
   - Insulation

ANNOTATIONS:
- All dimensions in mm
- Material specifications
- Reference to structural engineer's calculations
- Building Regs compliance notes

Title block: "STRUCTURAL DETAILS", Various Scales

Generate complete SVG with viewBox="0 0 ${svgWidth} ${svgHeight}".`;

    } else if (drawingType === 'site_plan') {
      userPrompt = `Generate a professional site plan SVG for a UK ${geometry.project_type?.replace(/_/g, ' ')}.

EXTENSION SIZE:
- ${length_m}m x ${width_m}m = ${floor_area_sqm}m²

REQUIREMENTS:
1. Existing dwelling outline (hatched)
2. Extension position (solid fill)
3. Site boundaries
4. North arrow (prominent)
5. Distance to boundaries (minimum 1m)
6. Access paths
7. Drainage routes
8. Scale bar (1:200)
9. Key/legend
10. Title block: "SITE PLAN", Scale 1:200

Generate complete SVG with viewBox="0 0 ${svgWidth} ${svgHeight}".`;

    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid drawingType' }),
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
        max_tokens: 16000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    let svgContent = data.choices?.[0]?.message?.content || '';
    
    // Extract SVG
    const svgMatch = svgContent.match(/<svg[\s\S]*<\/svg>/i);
    if (svgMatch) {
      svgContent = svgMatch[0];
    }

    // Generate hash
    const geometryHash = btoa(JSON.stringify({ length_m, width_m, height_m, wall_type, roof_type, drawingType })).substring(0, 32);

    // Save to database using service role for write operations
    const supabaseServiceUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseServiceUrl, supabaseServiceKey);

    const { data: savedDrawing, error: dbError } = await supabase
      .from('cad_drawings')
      .insert({
        project_id: isStandalone ? null : projectId,
        drawing_type: drawingType,
        svg_content: svgContent,
        geometry_hash: geometryHash,
        project_type: geometry.project_type || 'single_storey_rear',
        is_watermarked: true,
        metadata: {
          generated_at: new Date().toISOString(),
          dimensions: { length_m, width_m, height_m },
          rooms: rooms?.length || 0,
          electrical_points: electrical?.length || 0,
          plumbing_fixtures: plumbing?.length || 0,
          building_regs: buildingRegs,
          model: 'google/gemini-2.5-flash'
        }
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
    }

    console.log(`Successfully generated ${drawingType} drawing`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        svgContent,
        drawingId: savedDrawing?.id,
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
