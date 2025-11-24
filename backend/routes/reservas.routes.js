// backend/routes/reservas.routes.js
const express = require("express");
const router = express.Router(); // Crea una instancia de Router de Express
const ReservasController = require("../controllers/ReservasController"); // Importa el controlador de Reservas

// NOTA: En un proyecto real, todas estas rutas DEBEN incluir un middleware
// de autenticación (e.g., db.authenticateToken) para verificar el JWT
// y, para las rutas 'admin', un middleware de autorización (e.g., db.isAdmin).

// ============================================================
// RUTAS DE RESERVA PARA USUARIOS AUTENTICADOS
// ============================================================

// POST /api/reservas
// Crear una nueva reserva.
router.post("/", ReservasController.crearReserva);

// GET /api/reservas
// Obtener SOLO las reservas del usuario que está logueado (Mis Reservas).
router.get("/", ReservasController.obtenerMisReservas);

// DELETE /api/reservas/:id_reserva
// Cancelar/Eliminar una reserva específica (solo si pertenece al usuario logueado).
router.delete("/:id_reserva", ReservasController.cancelarReserva);

// ============================================================
// RUTAS ESPECÍFICAS Y ADMINISTRATIVAS
// ============================================================

// GET /api/reservas/admin/todas
// Obtener TODAS las reservas del sistema (Ruta exclusiva para Administradores).
router.get("/admin/todas", ReservasController.obtenerTodasLasReservas);

// GET /api/reservas/:id_reserva
// Obtener los detalles de una reserva específica por su ID.
router.get("/:id_reserva", ReservasController.obtenerReserva);

// PUT /api/reservas/:id_reserva/estado
// Actualizar el estado de una reserva (ej: de Pendiente a Confirmada/Cancelada).
// Usualmente requiere permisos administrativos.
router.put("/:id_reserva/estado", ReservasController.actualizarEstadoReserva);

// Exportamos el router para su uso en el archivo principal de la aplicación
module.exports = router;
