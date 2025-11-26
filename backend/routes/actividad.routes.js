// backend/routes/actividad.routes.js
const express = require("express");
const router = express.Router();
const actividadController = require("../controllers/ActividadNuevaController");
const db = require("../config/database"); // Para middleware de autenticación

// ====================================================================
// RUTAS DE ACTIVIDADES ECOTURÍSTICAS (CRUD)
// ====================================================================

// GET /api/actividades - Obtener todas las actividades (REQUIERE ADMIN)
router.get("/", db.authenticateToken, actividadController.getAllActividades);

// GET /api/actividades/estado/:estado - Obtener actividades por estado (Pendiente, Confirmada, Completada, Cancelada)
router.get(
  "/estado/:estado",
  db.authenticateToken,
  actividadController.getActividadesPorEstado
);

// GET /api/actividades/visitante/:id_persona - Obtener actividades de un visitante específico
router.get(
  "/visitante/:id_persona",
  db.authenticateToken,
  actividadController.getActividadesPorVisitante
);

// GET /api/actividades/ruta/:id_ruta - Obtener actividades de una ruta específica
router.get(
  "/ruta/:id_ruta",
  db.authenticateToken,
  actividadController.getActividadesPorRuta
);

// GET /api/actividades/:id - Obtener actividad por ID (REQUIERE ADMIN)
router.get("/:id", db.authenticateToken, actividadController.getActividadById);

// POST /api/actividades - Crear nueva actividad (REQUIERE ADMIN)
router.post("/", db.authenticateToken, actividadController.createActividad);

// PUT /api/actividades/:id - Actualizar actividad (REQUIERE ADMIN)
router.put("/:id", db.authenticateToken, actividadController.updateActividad);

// DELETE /api/actividades/:id - Eliminar actividad (REQUIERE ADMIN)
router.delete(
  "/:id",
  db.authenticateToken,
  actividadController.deleteActividad
);

module.exports = router;
