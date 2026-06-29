export default async (req) => {

  try {

    const { pregunta } = await req.json();

    const API_KEY = process.env.GEMINI_API_KEY;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

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

Responde claro y directo.

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

    console.log("RESPUESTA GEMINI:", JSON.stringify(data));

    const respuesta =
      data?.candidates?.[0]?.content?.parts?.[0]?.text
      || data?.error?.message
      || "No se pudo generar respuesta";

    return new Response(JSON.stringify({
      respuesta
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {

    return new Response(JSON.stringify({
      respuesta: "Error en función Gemini"
    }), {
      headers: { "Content-Type": "application/json" }
    });

  }

};
