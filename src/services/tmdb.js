import axios from "axios";

if (!process.env.TMDB_API_KEY) {
  throw new Error("Falta TMDB_API_KEY en .env");
}

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: { api_key: process.env.TMDB_API_KEY }
});

const pick = m => ({
  id: m.id,
  title: m.title,
  overview: m.overview,
  poster_path: m.poster_path,
  release_date: m.release_date,
  vote_average: m.vote_average
});

export async function searchMovies(q) {
  const { data } = await api.get("/search/movie", { params: { query: q } });
  return data.results.map(pick);
}
export async function popularMovies() {
  const { data } = await api.get("/movie/popular");
  return data.results.map(pick);
}
export async function getMovie(id) {
  const { data } = await api.get(`/movie/${id}`);
  return pick(data);
}
