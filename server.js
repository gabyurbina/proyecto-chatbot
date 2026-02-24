require("dotenv").config();
console.log("ESTE ES MI SERVER CORRECTO");

const express = require("express");
const cors = require("cors");
const path = require("path");
const dialogflow = require("@google-cloud/dialogflow");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Cliente Dialogflow
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, "credenciales.json");
const sessionClient = new dialogflow.SessionsClient();

// Ruta del chatbot
app.post("/preguntar", async (req, res) => {
  const pregunta = req.body.pregunta;

  if (!pregunta) {
    return res.json({ respuesta: "No se recibió ninguna pregunta." });
  }

  try {
    const sessionId = uuidv4();
    const sessionPath = sessionClient.projectAgentSessionPath(
      "gabrielaurbina-proyecto-web1",
      sessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: pregunta,
          languageCode: "es",
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.json({ respuesta: result.fulfillmentText });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ respuesta: "Error al conectar con Dialogflow." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});