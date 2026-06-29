export async function handler(event) {

  try {

    const body = JSON.parse(event.body || "{}");

    const pregunta = body.pregunta || "";
    const contratos = body.contratos || [];

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          respuesta: "ERROR: Falta API KEY en Netlify"
        })
      };
    }

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

    const response = await fetch(url, {
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
Eres un asistente experto en contratos hospitalarios.

REGLAS:
- Usa SOLO los contratos dados
- Responde corto y claro
- Si falta info, dilo

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

    const data = await response.json();

    console.log("GEMINI RESPONSE:", JSON.stringify(data));

    // 👇 SEGURIDAD TOTAL (nunca undefined)
    const respuesta =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.error?.message ||
      "Sin respuesta del modelo";

    return {
      statusCode: 200,
      body: JSON.stringify({ respuesta })
    };

  } catch (error) {

    return {
      statusCode: 200,
      body: JSON.stringify({
        respuesta: "ERROR BACKEND: " + error.message
      })
    };

  }
}
