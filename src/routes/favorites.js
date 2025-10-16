import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { load, save } from "../services/store.js";
import { getMovie } from "../services/tmdb.js";

const router = Router();
router.use(requireAuth);

// GET lista (expandida con datos de TMDB)
router.get("/", async (req, res) => {
  const all = await load("favorites");
  const mine = all.filter(f => f.userId === req.user.sub);
  const detailed = await Promise.all(
    mine.map(async f => ({ addedAt: f.addedAt, movie: await getMovie(f.movieId) }))
  );
  res.json(detailed);
});

// POST agregar { movieId }
router.post("/", async (req, res) => {
  const movieId = Number(req.body?.movieId);
  if (!Number.isInteger(movieId)) return res.status(400).json({ error: "movieId inválido" });

  const favs = await load("favorites");
  const exists = favs.some(f => f.userId === req.user.sub && f.movieId === movieId);
  if (exists) return res.status(409).json({ error: "ya está en favoritos" });

  favs.push({ userId: req.user.sub, movieId, addedAt: new Date().toISOString() });
  await save("favorites", favs);
  res.status(201).json({ ok: true });
});

// DELETE /favorites/:movieId
router.delete("/:movieId", async (req, res) => {
  const movieId = Number(req.params.movieId);
  if (!Number.isInteger(movieId)) return res.status(400).json({ error: "movieId inválido" });

  const favs = await load("favorites");
  const next = favs.filter(f => !(f.userId === req.user.sub && f.movieId === movieId));
  if (next.length === favs.length) return res.status(404).json({ error: "no estaba en favoritos" });

  await save("favorites", next);
  res.json({ ok: true });
});

export default router;