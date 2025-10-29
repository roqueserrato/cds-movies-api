import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const allUsers = await load("users");
    const foundUser = allUsers.find(u => u.id === req.user.sub);

    if (!foundUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { email, firstName, lastName } = foundUser;
    res.json({ email, firstName, lastName });
  } catch (err) {
    console.error("Error al obtener información del usuario:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
