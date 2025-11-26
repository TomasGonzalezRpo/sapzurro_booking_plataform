// src/controllers/ActivitiesController.js

import { activities } from "../data/Activities.js";

// OBTENER TODAS LAS ACTIVIDADES
const getActivities = async (req, res) => {
  try {
    res.json({
      success: true,
      data: activities,
      count: activities.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener actividades",
      error: error.message,
    });
  }
};

// OBTENER ACTIVIDAD POR ID O NOMBRE
const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar por nombre o por id
    const activity = activities.find(
      (act) => act.name === id || act.name.toLowerCase() === id.toLowerCase()
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Actividad no encontrada",
      });
    }

    res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener la actividad",
      error: error.message,
    });
  }
};

// VALIDAR DISPONIBILIDAD DE ACTIVIDAD
// (Útil para futuras integraciones con calendario/disponibilidad)
const checkAvailability = async (req, res) => {
  try {
    const { id, fecha, horario, cantidad_personas } = req.body;

    // 1️Buscar la actividad
    const activity = activities.find(
      (act) => act.name === id || act.name.toLowerCase() === id.toLowerCase()
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Actividad no encontrada",
      });
    }

    // 2️Validar cantidad de personas
    if (cantidad_personas > activity.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: `La cantidad de personas (${cantidad_personas}) excede el máximo permitido (${activity.maxParticipants})`,
        maxAllowed: activity.maxParticipants,
      });
    }

    // 3️Validar fecha (no en el pasado)
    const fechaReserva = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaReserva < hoy) {
      return res.status(400).json({
        success: false,
        message: "La fecha de la reserva no puede ser en el pasado",
      });
    }

    // 4️ Si llegó aquí, está disponible
    res.json({
      success: true,
      available: true,
      message: "La actividad está disponible",
      activity: {
        name: activity.name,
        price: activity.price,
        totalPrice: activity.price * cantidad_personas,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al verificar disponibilidad",
      error: error.message,
    });
  }
};

// OBTENER DETALLES DE UNA ACTIVIDAD (COMPLETO)
const getActivityDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = activities.find(
      (act) => act.name === id || act.name.toLowerCase() === id.toLowerCase()
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Actividad no encontrada",
      });
    }

    // Retornar detalles completos sin las imágenes (ya que son imports)
    const { imagenes, ...activityData } = activity;

    res.json({
      success: true,
      data: {
        ...activityData,
        imageCount: imagenes ? imagenes.length : 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener detalles de la actividad",
      error: error.message,
    });
  }
};

// VALIDAR DATOS DE RESERVA DE ACTIVIDAD
// (Llamado antes de crear la reserva)
const validateActivityReservation = async (req, res) => {
  try {
    const {
      id_servicio,
      fecha_inicio,
      cantidad_personas,
      precio_unitario,
      precio_total,
    } = req.body;

    const activity = activities.find(
      (act) =>
        act.name === id_servicio ||
        act.name.toLowerCase() === id_servicio.toLowerCase()
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Actividad no encontrada",
      });
    }

    if (cantidad_personas < 1) {
      return res.status(400).json({
        success: false,
        message: "Cantidad de personas debe ser al menos 1",
      });
    }

    if (cantidad_personas > activity.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: `Cantidad de personas excede el máximo: ${activity.maxParticipants}`,
        maxAllowed: activity.maxParticipants,
      });
    }

    const fecha = new Date(fecha_inicio);
    if (isNaN(fecha.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Formato de fecha inválido",
      });
    }

    const ahora = new Date();
    if (fecha < ahora) {
      return res.status(400).json({
        success: false,
        message: "La fecha no puede ser en el pasado",
      });
    }

    const precioEsperado = activity.price * cantidad_personas;
    if (precio_total !== precioEsperado) {
      return res.status(400).json({
        success: false,
        message: `Precio total incorrecto. Esperado: ${precioEsperado}, Recibido: ${precio_total}`,
        expectedPrice: precioEsperado,
      });
    }

    if (precio_unitario !== activity.price) {
      return res.status(400).json({
        success: false,
        message: `Precio unitario incorrecto. Esperado: ${activity.price}, Recibido: ${precio_unitario}`,
        expectedPrice: activity.price,
      });
    }

    res.json({
      success: true,
      valid: true,
      message: "Reserva de actividad válida",
      activity: {
        name: activity.name,
        price: activity.price,
        maxParticipants: activity.maxParticipants,
        date: fecha.toLocaleDateString("es-CO"),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error validando reserva",
      error: error.message,
    });
  }
};

export {
  getActivities,
  getActivityById,
  checkAvailability,
  getActivityDetails,
  validateActivityReservation,
};
