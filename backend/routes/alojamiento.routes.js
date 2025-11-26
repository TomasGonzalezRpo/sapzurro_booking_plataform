// backend/routes/alojamiento.routes.js
const express = require("express");
const router = express.Router();
const alojamientoController = require("../controllers/AlojamientoController");
const db = require("../config/database"); // Para middleware de autenticación

// ====================================================================
// RUTAS DE ALOJAMIENTOS (CRUD)
// ====================================================================

// GET /api/alojamientos - Obtener todos los alojamientos activos
router.get("/", alojamientoController.getAllAlojamientos);

// GET /api/alojamientos/activos - Obtener solo alojamientos activos (para formularios)
router.get("/activos", alojamientoController.getAlojamientosActivos);

// GET /api/alojamientos/:id - Obtener alojamiento por ID
router.get("/:id", alojamientoController.getAlojamientoById);

// POST /api/alojamientos - Crear nuevo alojamiento (REQUIERE ADMIN)
router.post("/", db.authenticateToken, alojamientoController.createAlojamiento);

// PUT /api/alojamientos/:id - Actualizar alojamiento (REQUIERE ADMIN)
router.put(
  "/:id",
  db.authenticateToken,
  alojamientoController.updateAlojamiento
);

// DELETE /api/alojamientos/:id - Eliminar/Desactivar alojamiento (REQUIERE ADMIN)
router.delete(
  "/:id",
  db.authenticateToken,
  alojamientoController.deleteAlojamiento
);

module.exports = router;
