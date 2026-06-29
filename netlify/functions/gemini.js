export async function handler(event) {

  try {

    const body = event.body ? JSON.parse(event.body) : {};

    const pregunta = body.pregunta || "";
    const contratos = body.contratos || [];

    const API_KEY = process.env.GEMINI_API_KEY;

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": API_KEY
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
Eres un asistente de contratos hospitalarios.

CONTRATOS:
${JSON.stringify(contratos)}

PREGUNTA:
${pregunta}
                `
              }
            ]
          }
        ]
      })
    });

    const data = await res.json();

    const respuesta =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.error?.message ||
      "Sin respuesta";

    return {
      statusCode: 200,
      body: JSON.stringify({ respuesta })
    };

  } catch (err) {

    return {
      statusCode: 200,
      body: JSON.stringify({
        respuesta: "ERROR BACKEND: " + err.message
      })
    };
  }
}
