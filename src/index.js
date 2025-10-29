import express from "express";
import "dotenv/config";
import auth from "./routes/auth.js";
import movies from "./routes/movies.js";
import favorites from "./routes/favorites.js";
import information from "./routes/information.js";

const app = express();
app.use(express.json());

app.get("/health", (_, res) => res.json({ ok: true }));
app.use("/auth", auth);
app.use("/movies", movies);
app.use("/favorites", favorites);
app.use("/information", information);

app.listen(3000, () => console.log("API on :3000"));
