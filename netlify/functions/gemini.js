import { GoogleGenAI } from "@google/genai";

export default async (req, context) => {
  try {

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Método no permitido" }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const { pregunta } = await req.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const respuesta = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Eres un asistente experto en gestión de contratos hospitalarios.

Debes responder de forma profesional, clara y breve.

Pregunta del usuario:

${pregunta}
`
    });

    return new Response(
      JSON.stringify({
        respuesta: respuesta.text
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {

    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  }
};
