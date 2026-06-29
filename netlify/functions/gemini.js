export async function handler(event) {

  try {

    const { pregunta, contratos } = JSON.parse(event.body);

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
Eres un asistente experto en gestión de contratos hospitalarios.

REGLAS:
- Usa los contratos que te doy abajo.
- Calcula días de vencimiento si es necesario.
- Responde claro y corto.

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ respuesta })
    };

  } catch (err) {

    return {
      statusCode: 500,
      body: JSON.stringify({
        respuesta: "Error en función Gemini"
      })
    };

  }
}
