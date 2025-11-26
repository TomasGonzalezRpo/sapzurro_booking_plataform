// backend/routes/tipo-persona.routes.js
const express = require("express");
const router = express.Router();
const tipoPersonaController = require("../controllers/TipoPersonaController");
const db = require("../config/database");

// ====================================================================
// RUTAS DE TIPOS DE PERSONAS (CRUD)
// ====================================================================

// GET /api/tipos-persona - Obtener todos los tipos de personas activos
router.get("/", tipoPersonaController.getAllTiposPersona);

// GET /api/tipos-persona/activos - Obtener solo tipos activos (para formularios)
router.get("/activos", tipoPersonaController.getTiposPersonaActivos);

// GET /api/tipos-persona/:id - Obtener tipo de persona por ID
router.get("/:id", tipoPersonaController.getTipoPersonaById);

// POST /api/tipos-persona - Crear nuevo tipo de persona (REQUIERE ADMIN)
router.post("/", db.authenticateToken, tipoPersonaController.createTipoPersona);

// PUT /api/tipos-persona/:id - Actualizar tipo de persona (REQUIERE ADMIN)
router.put(
  "/:id",
  db.authenticateToken,
  tipoPersonaController.updateTipoPersona
);

// DELETE /api/tipos-persona/:id - Eliminar/Desactivar tipo de persona (REQUIERE ADMIN)
router.delete(
  "/:id",
  db.authenticateToken,
  tipoPersonaController.deleteTipoPersona
);

module.exports = router;
