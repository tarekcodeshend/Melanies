// messages.js
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// Replace this URI with your actual MongoDB connection string
const uri = "mongodb+srv://manolya2019:POp8nralbkVzAlTy@cluster0.pzycuyg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let cachedClient = null;

app.use(express.json()); // Middleware to parse JSON

async function connectToDatabase() {
    if (!cachedClient) {
        cachedClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await cachedClient.connect();
    }
    return cachedClient.db("chatDB").collection("messages");
}

// GET endpoint to retrieve messages
app.get('/messages', async (req, res) => {
    const collection = await connectToDatabase();
    const messages = await collection.find().sort({ timestamp: 1 }).toArray();
    res.status(200).json(messages);
});

// POST endpoint to send a message
app.post('/messages', async (req, res) => {
    const { user, text } = req.body;
    const collection = await connectToDatabase();
    const message = { user, text, timestamp: new Date() };
    await collection.insertOne(message);
    res.status(201).json({ message: "Message sent!" });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
