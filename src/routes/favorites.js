import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { load, save } from "../services/store.js";
import { getMovie } from "../services/tmdb.js";

const router = Router();
router.use(requireAuth);

const randomSuggestionScore = () => Math.floor(Math.random() * 100);

// GET lista de pelis
router.get("/", async (req, res) => {
  const all = await load("favorites");
  const mine = all.filter(f => f.userId === req.user.sub);
  const detailed = await Promise.all(
    mine.map(async f => {
      if (f.movie) {
        return { ...f.movie, addedAt: f.addedAt, suggestionScore: randomSuggestionScore() };
      }
      const movie = await getMovie(f.movieId);
      return { ...movie, addedAt: f.addedAt, suggestionScore: randomSuggestionScore() };
    })
  );
  detailed.sort((a, b) => b.suggestionScore - a.suggestionScore);
  res.json(detailed);
});

// POST agregar (por id)
router.post("/", async (req, res) => {
  const movieId = Number(req.body?.movieId);
  if (!Number.isInteger(movieId)) return res.status(400).json({ error: "movieId inválido" });

  const favs = await load("favorites");
  const exists = favs.some(
    f => f.userId === req.user.sub && (f.movieId === movieId || f.movie?.id === movieId)
  );
  if (exists) return res.status(409).json({ error: "ya está en favoritos" });

  let movie;
  try {
    movie = await getMovie(movieId);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: "película no encontrada" });
    }
    throw error;
  }

  const entry = { userId: req.user.sub, addedAt: new Date().toISOString(), movie };
  favs.push(entry);
  await save("favorites", favs);
  res.status(201).json({ ...movie, addedAt: entry.addedAt });
});

export default router;