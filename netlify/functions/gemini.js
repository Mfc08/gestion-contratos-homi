
export default async (req) => {

  try {

    const { pregunta } = await req.json();

    const API_KEY = process.env.GEMINI_API_KEY;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
Eres un asistente experto en gestión hospitalaria y contratos.

Responde de forma clara, breve y profesional.

Pregunta del usuario:
${pregunta}
                `
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta";

    return new Response(JSON.stringify({
      respuesta: texto
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {

    return new Response(JSON.stringify({
      respuesta: "Error en la IA"
    }), {
      headers: { "Content-Type": "application/json" }
    });

  }

};
