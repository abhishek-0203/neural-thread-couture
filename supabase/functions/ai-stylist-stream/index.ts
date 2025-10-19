import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  socket.onopen = () => {
    console.log("WebSocket connection established");
    socket.send(JSON.stringify({ type: "connected", message: "Connected to AI Stylist" }));
  };

  socket.onmessage = async (event) => {
    try {
      const { message, userProfile, conversationHistory } = JSON.parse(event.data);
      
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

      const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openAIApiKey) {
        socket.send(JSON.stringify({ type: "error", error: "OpenAI API key not configured" }));
        return;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-5-2025-08-07',
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
            { role: 'user', content: message }
          ],
          max_completion_tokens: 800,
          stream: true
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        socket.send(JSON.stringify({ type: "error", error: `OpenAI API error: ${errorData}` }));
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        socket.send(JSON.stringify({ type: "error", error: "No response body" }));
        return;
      }

      socket.send(JSON.stringify({ type: "start" }));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              socket.send(JSON.stringify({ type: "done" }));
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                socket.send(JSON.stringify({ type: "delta", content }));
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error in ai-stylist-stream:', err);
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      socket.send(JSON.stringify({ type: "error", error: message }));
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };

  return response;
});
