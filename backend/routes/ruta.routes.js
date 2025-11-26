// backend/routes/ruta.routes.js
const express = require("express");
const router = express.Router();
const rutaController = require("../controllers/RutaController");
const db = require("../config/database"); // Para middleware de autenticación

// ====================================================================
// RUTAS DE RUTAS ECOTURÍSTICAS (CRUD)
// ====================================================================

// GET /api/rutas - Obtener todas las rutas activas
router.get("/", rutaController.getAllRutas);

// GET /api/rutas/activas - Obtener solo rutas activas (para formularios)
router.get("/activas", rutaController.getRutasActivas);

// GET /api/rutas/duracion/:duracion - Obtener rutas por duración (ej: "2 horas", "3 días")
router.get("/duracion/:duracion", rutaController.getRutasPorDuracion);

// GET /api/rutas/:id - Obtener ruta por ID
router.get("/:id", rutaController.getRutaById);

// POST /api/rutas - Crear nueva ruta (REQUIERE ADMIN)
router.post("/", db.authenticateToken, rutaController.createRuta);

// PUT /api/rutas/:id - Actualizar ruta (REQUIERE ADMIN)
router.put("/:id", db.authenticateToken, rutaController.updateRuta);

// DELETE /api/rutas/:id - Eliminar/Desactivar ruta (REQUIERE ADMIN)
router.delete("/:id", db.authenticateToken, rutaController.deleteRuta);

module.exports = router;
