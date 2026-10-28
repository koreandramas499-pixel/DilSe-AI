export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (request.method !== "POST") {
      return new Response("DilSe AI is running", {
        headers: cors,
      });
    }

    try {
      const { messages } = await request.json();

      const response = await fetch(
        "https://api.openai.com/v1/responses",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4.1-mini",
            instructions:
              "You are Priya, a friendly AI companion. Reply naturally and warmly in the user's language, especially Marathi, Hindi, or Hinglish. Be helpful, thoughtful, and conversational. You are an AI, not a real person.",
            input: messages,
            max_output_tokens: 500,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return new Response(
          JSON.stringify({ error: "AI request failed. Check API billing and configuration." }),
          {
            status: 502,
            headers: {
              ...cors,
              "Content-Type": "application/json",
            },
          }
        );
      }

      return new Response(
        JSON.stringify({
          reply: data.output_text || "माफ कर, पुन्हा एकदा सांगशील का?",
        }),
        {
          headers: {
            ...cors,
            "Content-Type": "application/json",
          },
        }
      );
    } catch {
      return new Response(
        JSON.stringify({ error: "Request process करता आला नाही." }),
        {
          status: 400,
          headers: {
            ...cors,
            "Content-Type": "application/json",
          },
        }
      );
    }
  },
};
