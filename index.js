import express from "express";
import { Client } from "@gradio/client";
import axios from "axios";
import cors from 'cors';

const app = express();
const port = 5001;

// Enable CORS
app.use(cors());

app.use(express.json()); // To parse JSON request body

app.post("/speech-to-text", async (req, res) => {
    const { url } = req.body; // Get the audio URL from the request body

    if (!url) {
        return res.status(400).json({ error: "Audio URL is required." });
    }

    try {
        // Fetch the audio file from the provided URL
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const audioFile = Buffer.from(response.data);

        // Connect to the Gradio client
        const client = await Client.connect("dindizz/tamilspeechtotext");

        // Predict the text from audio
        const result = await client.predict("/predict", {
            audio: audioFile, // Directly use the audio buffer
        });

        // Send the result back to the client
        res.json({ transcription: result.data });
        console.log(result.data)
    } catch (error) {
        console.error("Error processing audio:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:5001`);
});
