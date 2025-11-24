// src/controllers/ActivitiesController.js

import { activities } from "../data/Activities.js"; // Traemos la lista de actividades

// Función para obtener todas las actividades
const getActivities = async (req, res) => {
  try {
    // Devolver la lista de actividades en formato JSON
    res.json({
      success: true,
      data: activities, // La data de las actividades
      count: activities.length, // Cuantas actividades hay
    });
  } catch (error) {
    // Si algo falla, devolver un error 500
    res.status(500).json({
      success: false,
      message: "Error al obtener actividades",
      error: error.message,
    });
  }
};

// Función para buscar una actividad por su ID o nombre
const getActivityById = async (req, res) => {
  try {
    const { id } = req.params; // Obtenemos el ID de los parámetros de la URL // Buscamos la actividad en la lista

    const activity = activities.find(
      (act) => act.name === id || act.name.toLowerCase() === id.toLowerCase() // Compara por nombre y también ignorando mayúsculas
    );

    if (!activity) {
      // Si no la encuentra, devuelve un error 404
      return res.status(404).json({
        success: false,
        message: "Actividad no encontrada",
      });
    } // Si la encuentra, devuelve la actividad

    res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    // Si hay un error de servidor
    res.status(500).json({
      success: false,
      message: "Error al obtener la actividad",
      error: error.message,
    });
  }
};

// Función para verificar si la actividad está disponible
const checkAvailability = async (req, res) => {
  try {
    // Obtenemos los datos que envía el usuario
    const { id, fecha, horario, cantidad_personas } = req.body; // Buscamos la actividad por ID o nombre

    const activity = activities.find(
      (act) => act.name === id || act.name.toLowerCase() === id.toLowerCase()
    );

    if (!activity) {
      // Si no existe, error 404
      return res.status(404).json({
        success: false,
        message: "Actividad no encontrada",
      });
    } // Revisamos que la cantidad de personas no exceda el máximo

    if (cantidad_personas > activity.maxParticipants) {
      // Si excede, error 400
      return res.status(400).json({
        success: false,
        message: `La cantidad de personas (${cantidad_personas}) excede el máximo permitido (${activity.maxParticipants})`,
        maxAllowed: activity.maxParticipants,
      });
    } // Validamos que la fecha no sea en el pasado

    const fechaReserva = new Date(fecha); // Convertimos la fecha del body a objeto Date
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Ponemos la hora de hoy a 00:00:00

    if (fechaReserva < hoy) {
      // Si la fecha es pasada, error 400
      return res.status(400).json({
        success: false,
        message: "La fecha de la reserva no puede ser en el pasado",
      });
    } // Si todo está OK, decimos que está disponible

    res.json({
      success: true,
      available: true,
      message: "La actividad está disponible",
      activity: {
        name: activity.name,
        price: activity.price,
        totalPrice: activity.price * cantidad_personas, // Calculamos el precio total
      },
    });
  } catch (error) {
    // Error de servidor
    res.status(500).json({
      success: false,
      message: "Error al verificar disponibilidad",
      error: error.message,
    });
  }
};

// Función para obtener todos los detalles de una actividad
const getActivityDetails = async (req, res) => {
  try {
    const { id } = req.params; // ID o nombre de la actividad // Buscamos la actividad

    const activity = activities.find(
      (act) => act.name === id || act.name.toLowerCase() === id.toLowerCase()
    );

    if (!activity) {
      // Error 404 si no existe
      return res.status(404).json({
        success: false,
        message: "Actividad no encontrada",
      });
    } // Sacamos la propiedad 'imagenes' para no devolver los imports

    const { imagenes, ...activityData } = activity; // Devolvemos el resto de los detalles

    res.json({
      success: true,
      data: {
        ...activityData, // Todos los datos de la actividad
        imageCount: imagenes ? imagenes.length : 0, // Contamos cuántas imágenes tiene
      },
    });
  } catch (error) {
    // Error de servidor
    res.status(500).json({
      success: false,
      message: "Error al obtener detalles de la actividad",
      error: error.message,
    });
  }
};

// Función para validar los datos antes de hacer una reserva real
const validateActivityReservation = async (req, res) => {
  try {
    // Obtenemos todos los datos que vienen en el body
    const {
      id_servicio, // El ID de la actividad que queremos reservar
      fecha_inicio,
      cantidad_personas,
      precio_unitario,
      precio_total,
    } = req.body; // Buscamos la actividad

    const activity = activities.find(
      (act) =>
        act.name === id_servicio ||
        act.name.toLowerCase() === id_servicio.toLowerCase()
    );

    if (!activity) {
      // Error si no se encuentra
      return res.status(404).json({
        success: false,
        message: "Actividad no encontrada",
      });
    } // Validamos que haya al menos 1 persona

    if (cantidad_personas < 1) {
      return res.status(400).json({
        success: false,
        message: "Cantidad de personas debe ser al menos 1",
      });
    } // Validamos el límite máximo de personas

    if (cantidad_personas > activity.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: `Cantidad de personas excede el máximo: ${activity.maxParticipants}`,
        maxAllowed: activity.maxParticipants,
      });
    } // Creamos un objeto Date para validar la fecha

    const fecha = new Date(fecha_inicio);
    if (isNaN(fecha.getTime())) {
      // Si no es una fecha válida
      return res.status(400).json({
        success: false,
        message: "Formato de fecha inválido",
      });
    }

    const ahora = new Date();
    if (fecha < ahora) {
      // Si la fecha es en el pasado
      return res.status(400).json({
        success: false,
        message: "La fecha no puede ser en el pasado",
      });
    } // Validamos que el precio total sea correcto

    const precioEsperado = activity.price * cantidad_personas;
    if (precio_total !== precioEsperado) {
      return res.status(400).json({
        success: false,
        message: `Precio total incorrecto. Esperado: ${precioEsperado}, Recibido: ${precio_total}`,
        expectedPrice: precioEsperado,
      });
    } // Validamos que el precio unitario sea correcto

    if (precio_unitario !== activity.price) {
      return res.status(400).json({
        success: false,
        message: `Precio unitario incorrecto. Esperado: ${activity.price}, Recibido: ${precio_unitario}`,
        expectedPrice: activity.price,
      });
    } // Todo validado, enviamos un OK

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
    // Error de servidor
    res.status(500).json({
      success: false,
      message: "Error validando reserva",
      error: error.message,
    });
  }
};

// Exportamos todas las funciones para que se puedan usar en las rutas
export {
  getActivities,
  getActivityById,
  checkAvailability,
  getActivityDetails,
  validateActivityReservation,
};
