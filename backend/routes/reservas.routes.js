// backend/routes/reservas.routes.js
const express = require("express");
const router = express.Router();
const ReservasController = require("../controllers/ReservasController");

// POST /api/reservas - Crear nueva reserva (REQUIERE AUTENTICACIÓN)
router.post("/", ReservasController.crearReserva);

// GET /api/reservas - Obtener mis reservas (REQUIERE AUTENTICACIÓN)
router.get("/", ReservasController.obtenerMisReservas);

// GET /api/reservas/admin/todas - Obtener todas las reservas (REQUIERE AUTENTICACIÓN)
router.get("/admin/todas", ReservasController.obtenerTodasLasReservas);

// GET /api/reservas/:id_reserva - Obtener una reserva específica
router.get("/:id_reserva", ReservasController.obtenerReserva);

// PUT /api/reservas/:id_reserva/estado - Actualizar estado de reserva
router.put("/:id_reserva/estado", ReservasController.actualizarEstadoReserva);

// DELETE /api/reservas/:id_reserva - Cancelar una reserva (REQUIERE AUTENTICACIÓN)
router.delete("/:id_reserva", ReservasController.cancelarReserva);

module.exports = router;
