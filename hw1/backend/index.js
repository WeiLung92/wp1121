import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// Routes
import diaryRouter from "./routes/diary.js";

dotenv.config();

const app = express();
app.use(bodyParser.json())
app.use(cors());

// To make the code more readable, we will use `router` to handle each resource.
app.use("/api/diarys", diaryRouter);

app.get("/heartbeat", (_, res) => {
  return res.send({ message: "Hello World!" });
});

app.post('/heartbeat', (req, res) => {
  res.send('Received a POST HTTP method');
});

app.put('/heartbeat', (req, res) => {
  res.send('Received a PUT HTTP method');
});

app.delete('/heartbeat', (req, res) => {
  res.send('Received a DELETE HTTP method');
});

app.post('/heartbeat/users', (req, res) => {
  res.send('POST HTTP method on users resource');
});
  
app.put('/heartbeat/users/:userId', (req, res) => {
  res.send(
    `PUT HTTP method on users/${req.params.userId} resource`,
  );
});

const port = process.env.PORT || 8000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // We move app.listen() here to make sure that the server is started after the connection to the database is established.
    app.listen(port, () =>
      console.log(`Server running on port http://localhost:${port}`),
    );
    // If the connection is successful, we will see this message in the console.
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    // Catch any errors that occurred while starting the server
    console.log(error.message);
  });


 