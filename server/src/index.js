import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

import { authRouter } from "./routes/auth.js";
import { scenariosRouter } from "./routes/scenarios.js";
import { userRouter } from "./routes/users.js";
import { taskRouter } from "./routes/tasks.js";
import { uploadRouter } from "./routes/upload.js";

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// Routes
app.use("/auth", authRouter);
app.use("/scenarios", scenariosRouter);
app.use("/users", userRouter);
app.use("/tasks", taskRouter);
app.use("/upload", uploadRouter);

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sgnario-aid.4zibt9s.mongodb.net/sgnario-aid?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

// Get the default connection
const db = mongoose.connection;

// Listen for the "connected" event
db.on("connected", () => {
    console.log("Mongoose connection is successful!");
});

// Listen for the "error" event
db.on("error", (err) => {
    console.error("Mongoose connection error:", err);
});

// Listen for the "disconnected" event
db.on("disconnected", () => {
    console.log("Mongoose connection disconnected");
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
