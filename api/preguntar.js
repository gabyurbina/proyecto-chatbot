import dialogflow from "@google-cloud/dialogflow";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ respuesta: "Método no permitido" });
  }

  const pregunta = req.body.pregunta;

  if (!pregunta) {
    return res.status(400).json({ respuesta: "No se recibió ninguna pregunta." });
  }

  try {

    const sessionClient = new dialogflow.SessionsClient({
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
      }
    });

    const sessionId = uuidv4();

    const sessionPath = sessionClient.projectAgentSessionPath(
      process.env.PROJECT_ID,
      sessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: pregunta,
          languageCode: "es"
        }
      }
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.status(200).json({ respuesta: result.fulfillmentText });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ respuesta: "Error al conectar con Dialogflow." });
  }
}