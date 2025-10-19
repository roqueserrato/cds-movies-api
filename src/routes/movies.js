import { Router } from "express";
import { searchMovies, popularMovies, getMovie } from "../services/tmdb.js";
import { requireAuth } from "../middlewares/auth.js";


const router = Router();

router.get("/search", async (req, res) => {
  const q = (req.query.query || "").trim();
  if (!q) return res.status(400).json({ error: "query requerida" });
  res.json(await searchMovies(q));
});

router.get("/suggestions", requireAuth, async (req, res) => {
  const keyword = (req.query.keyword || "").trim();
  const movies = keyword ? await searchMovies(keyword) : await popularMovies();
  const suggestions = movies
    .map(movie => ({
      ...movie,
      suggestionScore: Math.floor(Math.random() * 100)
    }))
    .sort((a, b) => b.suggestionScore - a.suggestionScore);
  res.json(suggestions);
});


router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "id inválido" });
  res.json(await getMovie(id));
});

export default router;
