// backend/routes/perfil.routes.js
const express = require("express");
const router = express.Router();
const perfilController = require("../controllers/PerfilController");
const db = require("../config/database"); // 🔑 IMPORTAR PARA ACCEDER AL MIDDLEWARE

// 🔒 RUTAS PROTEGIDAS (requieren autenticación)

// GET /api/perfiles/mi-perfil - Obtener MIS DATOS (usuario logueado)
router.get("/mi-perfil", db.authenticateToken, perfilController.obtenerMiDatos);

// PUT /api/perfiles/mi-perfil - Actualizar MIS DATOS (usuario logueado)
router.put(
  "/mi-perfil",
  db.authenticateToken,
  perfilController.actualizarMisDatos
);

// 👮 RUTAS SOLO ADMIN

// GET /api/perfiles - Obtener todos los perfiles
router.get("/", perfilController.getAllPerfiles);

// POST /api/perfiles - Crear nuevo perfil
router.post("/", perfilController.createPerfil);

// PUT /api/perfiles/:id - Actualizar perfil por ID
router.put("/:id", perfilController.updatePerfil);

// DELETE /api/perfiles/:id - Eliminar perfil
router.delete("/:id", perfilController.deletePerfil);

module.exports = router;
