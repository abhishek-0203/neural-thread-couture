import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userProfile, conversationHistory } = await req.json();
    
    const systemPrompt = `You are Nova, an AI fashion stylist for Neural Threads platform. 

User Profile Information:
- Name: ${userProfile.name}
- Body Type: Height ${userProfile.height || 'unknown'}cm, Weight ${userProfile.weight || 'unknown'}kg
- Body Shape: ${userProfile.body_shape || 'not specified'}
- Style Preferences: ${userProfile.fashion_interests?.join(', ') || 'not specified'}
- Location: ${userProfile.location}
- Gender: ${userProfile.gender || 'not specified'}

Your Role:
- Provide personalized fashion advice based on their body measurements, style preferences, and location
- Suggest specific outfit combinations and explain why they work for their body type
- Consider climate and cultural preferences based on their location
- Be encouraging and positive while giving practical, actionable advice
- Ask relevant questions to better understand their needs

Communication Style:
- Friendly, professional, and encouraging
- Use fashion terminology appropriately but explain complex concepts
- Provide specific brand recommendations when relevant
- Consider budget-friendly options
- Always explain the reasoning behind your suggestions`;

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('Lovable API key not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: message }
        ],
        max_completion_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('AI Stylist response generated successfully');
    
    return new Response(JSON.stringify({ 
      response: data.choices[0].message.content,
      usage: data.usage
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error in ai-stylist function:', err);
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return new Response(JSON.stringify({ 
      error: message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});