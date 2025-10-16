import { Router } from "express";
import { searchMovies, popularMovies, getMovie } from "../services/tmdb.js";

const router = Router();

router.get("/search", async (req, res) => {
  const q = (req.query.query || "").trim();
  if (!q) return res.status(400).json({ error: "query requerida" });
  res.json(await searchMovies(q));
});

router.get("/popular", async (_req, res) => {
  res.json(await popularMovies());
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "id inválido" });
  res.json(await getMovie(id));
});

export default router;
