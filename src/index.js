import express from "express";
import "dotenv/config";
import auth from "./routes/auth.js";

const app = express();
app.use(express.json());
app.get("/health", (_, res) => res.json({ ok: true }));
app.use("/auth", auth);

app.listen(3000, () => console.log("API on :3000"));
