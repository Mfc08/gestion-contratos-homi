export async function handler(event) {

  try {

    const { pregunta } = JSON.parse(event.body);

    const API_KEY = process.env.GEMINI_API_KEY;

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
      API_KEY;

    const res = await fetch(url, {
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
Eres un asistente experto en gestión de contratos hospitalarios.

Responde claro y breve.

Pregunta:
${pregunta}
                `
              }
            ]
          }
        ]
      })
    });

    const data = await res.json();

    console.log("GEMINI RAW:", JSON.stringify(data));

    const respuesta =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.error?.message ||
      "No se pudo obtener respuesta";

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
