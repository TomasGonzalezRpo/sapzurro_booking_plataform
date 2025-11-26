// backend/routes/tipo-actividad.routes.js
const express = require("express");
const router = express.Router();
const tipoActividadController = require("../controllers/TipoActividadController");
const db = require("../config/database"); // Para middleware de autenticación

// ====================================================================
// RUTAS DE TIPOS DE ACTIVIDADES (CRUD)
// ====================================================================

// GET /api/tipos-actividad - Obtener todos los tipos de actividades activos
router.get("/", tipoActividadController.getAllTiposActividad);

// GET /api/tipos-actividad/activos - Obtener solo tipos activos (para formularios)
router.get("/activos", tipoActividadController.getTiposActivos);

// GET /api/tipos-actividad/codigo/:codigo - Obtener tipo de actividad por código
router.get("/codigo/:codigo", tipoActividadController.getTipoActividadByCodigo);

// GET /api/tipos-actividad/:id - Obtener tipo de actividad por ID
router.get("/:id", tipoActividadController.getTipoActividadById);

// POST /api/tipos-actividad - Crear nuevo tipo de actividad (REQUIERE ADMIN)
router.post(
  "/",
  db.authenticateToken,
  tipoActividadController.createTipoActividad
);

// PUT /api/tipos-actividad/:id - Actualizar tipo de actividad (REQUIERE ADMIN)
router.put(
  "/:id",
  db.authenticateToken,
  tipoActividadController.updateTipoActividad
);

// DELETE /api/tipos-actividad/:id - Eliminar/Desactivar tipo de actividad (REQUIERE ADMIN)
router.delete(
  "/:id",
  db.authenticateToken,
  tipoActividadController.deleteTipoActividad
);

module.exports = router;
