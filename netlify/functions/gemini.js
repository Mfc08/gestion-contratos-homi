export async function handler(event) {

  try {

    const { pregunta, contratos } = JSON.parse(event.body || "{}");

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          respuesta: "Falta GEMINI_API_KEY en Netlify"
        })
      };
    }

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

    const payload = {
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
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": API_KEY
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    console.log("FULL RESPONSE:", JSON.stringify(data));

    if (data.error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          respuesta: "ERROR API: " + data.error.message
        })
      };
    }

    const respuesta =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return {
      statusCode: 200,
      body: JSON.stringify({
        respuesta: respuesta || "Sin respuesta de Gemini"
      })
    };

  } catch (err) {

    return {
      statusCode: 500,
      body: JSON.stringify({
        respuesta: "ERROR BACKEND: " + err.message
      })
    };
  }
}
