const express = require('express');
const PlayHT = require("playht");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Initialize PlayHT API with your credentials
PlayHT.init({
  userId: "BiSrSjpYVPM7ieJ9MjD2PzITvbj2",
  apiKey: "e02224a1bd224bd9a1d93b14598c0aea",
});

// Endpoint to stream audio
app.get('/stream-audio', async (req, res) => {
  const streamingOptions = {
    voiceEngine: "PlayHT2.0-turbo",
    voiceId: "s3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json",
    sampleRate: 44100,
    outputFormat: 'mp3',
    speed: 1,
  };

  const text = "Hey, this is Jennifer from Play. Please hold on a moment, let me just um pull up your details real quick.";
  const stream = await PlayHT.stream(text, streamingOptions);

  res.setHeader('Content-Type', 'audio/mpeg');

  stream.on("data", (chunk) => {
    res.write(chunk);
  });

  stream.on("end", () => {
    res.end();
  });

  stream.on("error", (error) => {
    res.status(500).send("Error streaming audio");
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

