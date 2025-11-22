// backend/routes/reservas.routes.js
const express = require("express");
const router = express.Router();
const ReservasController = require("../controllers/ReservasController");

// 🔑 Importar middleware de autenticación desde server.js
// Lo haremos diferente: el middleware se aplicará en server.js

// POST /api/reservas - Crear nueva reserva (REQUIERE AUTENTICACIÓN)
router.post("/", ReservasController.crearReserva);

// GET /api/reservas - Obtener mis reservas (REQUIERE AUTENTICACIÓN)
router.get("/", ReservasController.obtenerMisReservas);

// GET /api/reservas/:id_reserva - Obtener una reserva específica
router.get("/:id_reserva", ReservasController.obtenerReserva);

// DELETE /api/reservas/:id_reserva - Cancelar una reserva (REQUIERE AUTENTICACIÓN)
router.delete("/:id_reserva", ReservasController.cancelarReserva);

module.exports = router;
