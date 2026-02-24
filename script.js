async function enviarPregunta() {

    const input = document.getElementById("pregunta");
    const pregunta = input.value.trim();
    const respuestaDiv = document.getElementById("respuesta");

    if (!pregunta) {
        respuestaDiv.innerHTML = "<div class='mensaje-error'>⚠️ Escribe una pregunta.</div>";
        return;
    }

    respuestaDiv.innerText = "🤖 Escribiendo...";

    try {

        const response = await fetch("/api/preguntar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ pregunta })
        });

        const data = await response.json();

        if (data.respuesta) {
            respuestaDiv.innerText = data.respuesta;
        } else {
            respuestaDiv.innerText = "No se obtuvo respuesta.";
        }

    } catch (error) {
        respuestaDiv.innerText = "❌ Error al conectar con el servidor.";
    }

    input.value = "";
}