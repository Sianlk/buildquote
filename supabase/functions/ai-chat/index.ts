import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are BuildQuote AI, a helpful assistant for UK property professionals, landlords, and tradespeople.

You specialize in:
- HMO (House in Multiple Occupation) licensing requirements
- UK Renters' Rights Act 2025 (effective May 1, 2026)
- Building regulations and compliance
- Trade job pricing (plumbing, electrical, carpentry)
- EPC (Energy Performance Certificate) requirements
- Awaab's Law and damp/mould standards
- Landlord obligations and tenant rights
- Property tax and finance (MTD, SPVs)

Key 2026 Updates:
- Section 21 "no-fault" evictions abolished May 1, 2026
- All tenancies become Assured Periodic Tenancies (rolling monthly)
- Rent can only increase once per year via Section 13 notice
- Tenants have statutory right to request pets (28-day response required)
- National PRS Database launching late 2026
- Civil penalties for housing offenses increased to £40,000
- HMO minimum bedroom: 6.51m² (1 person), 10.22m² (2 persons)

Always provide accurate, professional guidance. Recommend consulting qualified professionals for specific legal or technical advice.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    
    if (!apiKey) {
      // Return helpful fallback if no API key
      return new Response(
        JSON.stringify({ 
          response: generateFallbackResponse(message)
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + (context ? `\n\nAdditional context: ${context}` : "") },
          { role: "user", content: message }
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || generateFallbackResponse(message);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("AI Chat error:", error);
    return new Response(
      JSON.stringify({ 
        response: generateFallbackResponse("") 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function generateFallbackResponse(query: string): string {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("hmo") || lowerQuery.includes("licensing")) {
    return `**HMO Licensing Requirements (2026):**

• **Mandatory HMO Licence**: Required for 5+ people from 2+ households
• **Minimum Room Sizes**: 6.51m² (1 person), 10.22m² (2 persons)
• **Kitchen**: 7m² for up to 5 people, 10m² for 6-10
• **Bathrooms**: 1 per 5 tenants minimum
• **Additional Licensing**: Many councils now require licences for 3-4 tenant properties

Need specific help? Contact us at hello@buildquote.uk`;
  }

  if (lowerQuery.includes("renters") || lowerQuery.includes("section 21")) {
    return `**Renters' Rights Act 2025 (Effective May 1, 2026):**

• **Section 21 Abolished**: No-fault evictions banned
• **Assured Periodic Tenancies**: All tenancies become rolling monthly
• **Rent Increases**: Once per year via Section 13 notice
• **Bidding Wars Banned**: Cannot accept above advertised rent
• **Pets**: Tenants can request pets; landlords must respond within 28 days

Use our Compliance tools for detailed guidance.`;
  }

  if (lowerQuery.includes("pricing") || lowerQuery.includes("quote") || lowerQuery.includes("trade")) {
    return `**Trade Pricing Help:**

BuildQuote provides accurate UK trade pricing for:
• Plumbing (pipes, fittings, boilers, bathrooms)
• Electrical (wiring, consumer units, lighting)
• Carpentry (doors, skirting, kitchens)

Our pricing uses current 2026 UK trade rates with regional adjustments. Use the Trade Jobs feature to generate quotes.`;
  }

  return `Thank you for your question. BuildQuote can help with:

• **HMO Licensing** - Room sizes, kitchen/bathroom ratios
• **Renters Rights Act 2025** - Section 21 abolition, new rules
• **Trade Pricing** - Accurate UK trade & retail rates
• **EPC & Compliance** - Energy efficiency requirements

For specific help, contact us at hello@buildquote.uk`;
}
