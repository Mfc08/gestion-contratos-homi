async function enviarPregunta() {

    const input = document.getElementById("aiPregunta");
    const pregunta = input.value.trim();
    if (!pregunta) return;

    const mensajes = document.getElementById("aiMensajes");

    mensajes.innerHTML += `<div style="text-align:right;margin:10px 0"><b>Tú:</b><br>${pregunta}</div>`;

    input.value = "";

    mensajes.innerHTML += `<div id="loadingAI" style="color:#60A5FA">Pensando...</div>`;
    mensajes.scrollTop = mensajes.scrollHeight;

    try {

        const res = await fetch("/.netlify/functions/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                pregunta,
                contratos: CONTRATOS_RAW
            })
        });

        const data = await res.json();

        document.getElementById("loadingAI").remove();

        mensajes.innerHTML += `<div style="margin:10px 0"><b>IA:</b><br>${data.respuesta}</div>`;
        mensajes.scrollTop = mensajes.scrollHeight;

    } catch (e) {

        document.getElementById("loadingAI").remove();
        mensajes.innerHTML += `<div style="color:red">Error consultando IA</div>`;
    }
}
