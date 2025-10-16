import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { load, save } from "../services/store.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, firstName, lastName, password } = req.body || {};
  if (!email || !firstName || !lastName || !password) return res.status(400).json({ error: "email, nombre, apellido y password requeridos" });

  const users = await load("users");
  if (users.find(u => u.email === email)) return res.status(409).json({ error: "El usuario con ese email ya existe" });

  const id = randomUUID();
  const hash = await bcrypt.hash(password, 10);
  users.push({ id, email, firstName, lastName, password: hash });
  await save("users", users);
  res.status(201).json({ id, email });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  const users = await load("users");
  const u = users.find(x => x.email === email);
  if (!u || !(await bcrypt.compare(password, u.password))) return res.status(401).json({ error: "Credenciales incorrectas" });

  const token = jwt.sign({ sub: u.id, email: u.email }, process.env.JWT_SECRET, { expiresIn: "2h" });
  res.json({ token });
});

export default router;
