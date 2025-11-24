// backend/controllers/ReservasController.js
const { sequelize } = require("../models/index"); // Importamos la instancia de Sequelize para consultas SQL directas

// ============================================================
// FUNCIONES CRUD Y LÓGICA DE RESERVAS
// ============================================================

// =============== CREAR RESERVA (genérica para cualquier servicio) ===============
exports.crearReserva = async (req, res) => {
  try {
    // Verificar si el usuario está logueado (req.user viene del middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Debe iniciar sesión para completar la reserva",
      });
    } // Desestructuramos los datos de la reserva del cuerpo de la solicitud

    const {
      tipo_servicio, // 'hotel', 'actividad', 'restaurante', 'ruta'
      id_servicio,
      nombre_servicio,
      fecha_inicio,
      fecha_fin,
      cantidad_personas,
      cantidad_habitaciones,
      descripcion_servicio,
      precio_unitario,
      cantidad,
      precio_total,
      notas_admin,
    } = req.body;

    const id_usuario = req.user.id_usuario; // Obtenemos el ID del usuario logueado

    console.log("📝 Datos recibidos para crear reserva:", {
      tipo_servicio,
      nombre_servicio,
      fecha_inicio,
      fecha_fin,
      cantidad_personas,
      precio_unitario,
      precio_total,
      notas_admin,
    }); // Validar datos requeridos

    if (
      !tipo_servicio ||
      !nombre_servicio ||
      !fecha_inicio ||
      !cantidad_personas ||
      precio_unitario === undefined ||
      precio_total === undefined
    ) {
      console.error("❌ Faltan datos requeridos:", {
        tipo_servicio: !!tipo_servicio,
        nombre_servicio: !!nombre_servicio,
        fecha_inicio: !!fecha_inicio,
        cantidad_personas: !!cantidad_personas,
        precio_unitario: precio_unitario !== undefined,
        precio_total: precio_total !== undefined,
      });
      return res.status(400).json({
        success: false,
        message: "Faltan datos requeridos para la reserva",
        campos_faltantes: {
          tipo_servicio: !!tipo_servicio,
          nombre_servicio: !!nombre_servicio,
          fecha_inicio: !!fecha_inicio,
          cantidad_personas: !!cantidad_personas,
          precio_unitario: precio_unitario !== undefined,
          precio_total: precio_total !== undefined,
        },
      });
    } // Validar que el tipo de servicio sea uno de los permitidos

    const tiposValidos = ["hotel", "actividad", "restaurante", "ruta"];
    if (!tiposValidos.includes(tipo_servicio)) {
      return res.status(400).json({
        success: false,
        message: "Tipo de servicio inválido",
      });
    } // Ejecutar la consulta SQL directa para insertar la reserva

    const [result] = await sequelize.query(
      `INSERT INTO reservas (
        id_usuario,
        tipo_servicio,
        id_servicio,
        nombre_servicio,
        fecha_inicio,
        fecha_fin,
        cantidad_personas,
        cantidad_habitaciones,
        descripcion_servicio,
        precio_unitario,
        cantidad,
        precio_total,
        estado,
        notas_admin
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      {
        // Reemplazos para prevenir inyección SQL
        replacements: [
          id_usuario,
          tipo_servicio,
          id_servicio || null, // Puede ser nulo
          nombre_servicio,
          fecha_inicio,
          fecha_fin || null, // Puede ser nulo
          cantidad_personas,
          cantidad_habitaciones || 1,
          descripcion_servicio || null, // Puede ser nulo
          precio_unitario,
          cantidad || 1,
          precio_total,
          "confirmada", // Estado inicial
          notas_admin || null, // Puede ser nulo
        ],
      }
    ); // El resultado de la inserción directa puede ser un array con el ID

    const idReservaCreada = Array.isArray(result) ? result[0] : result;

    console.log(
      `✅ Reserva ${tipo_servicio} creada: ID ${idReservaCreada} para usuario ${id_usuario}`
    ); // Respuesta exitosa

    return res.status(201).json({
      success: true,
      message: "Reserva creada exitosamente",
      id_reserva: idReservaCreada,
    });
  } catch (error) {
    console.error("❌ Error en crearReserva:", error);
    return res.status(500).json({
      success: false,
      message: "Error al procesar la reserva",
      error: error.message,
    });
  }
};

// =============== OBTENER TODAS LAS RESERVAS (ADMIN) ===============
exports.obtenerTodasLasReservas = async (req, res) => {
  try {
    // Filtros opcionales por query params
    const { tipo_servicio, estado } = req.query; // Consulta SQL para obtener todas las reservas con datos del usuario

    let query = `
      SELECT 
        r.*,
        u.usuario,
        p.nombres,
        p.apellidos,
        p.correo,
        p.telefono
      FROM reservas r
      LEFT JOIN usuario u ON r.id_usuario = u.id_usuario
      LEFT JOIN persona p ON u.id_persona = p.id_persona
      WHERE 1=1
    `;

    const replacements = []; // Añadir filtro por tipo de servicio si se proporciona

    if (tipo_servicio) {
      query += ` AND r.tipo_servicio = ?`;
      replacements.push(tipo_servicio);
    } // Añadir filtro por estado si se proporciona

    if (estado) {
      query += ` AND r.estado = ?`;
      replacements.push(estado);
    }

    query += ` ORDER BY r.fecha_reserva DESC`; // Ordenar por fecha de creación descendente // Ejecutar la consulta

    const [reservas] = await sequelize.query(query, { replacements }); // Respuesta con el listado de reservas

    return res.status(200).json({
      success: true,
      total: reservas.length,
      reservas,
    });
  } catch (error) {
    console.error("❌ Error en obtenerTodasLasReservas:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener reservas",
    });
  }
};

// =============== OBTENER MIS RESERVAS (USUARIO) ===============
exports.obtenerMisReservas = async (req, res) => {
  try {
    // Verificación de autenticación
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Debe iniciar sesión",
      });
    }

    const id_usuario = req.user.id_usuario; // ID del usuario logueado
    const { tipo_servicio } = req.query; // Filtro opcional // Consulta base para obtener solo las reservas del usuario actual

    let query = `SELECT * FROM reservas WHERE id_usuario = ?`;
    const replacements = [id_usuario]; // Aplicar filtro por tipo de servicio si se proporciona

    if (tipo_servicio) {
      query += ` AND tipo_servicio = ?`;
      replacements.push(tipo_servicio);
    }

    query += ` ORDER BY fecha_reserva DESC`;

    const [reservas] = await sequelize.query(query, { replacements }); // Respuesta con el listado de reservas del usuario

    return res.status(200).json({
      success: true,
      total: reservas.length,
      reservas,
    });
  } catch (error) {
    console.error("❌ Error en obtenerMisReservas:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener reservas",
    });
  }
};

// =============== OBTENER UNA RESERVA POR ID ===============
exports.obtenerReserva = async (req, res) => {
  try {
    const { id_reserva } = req.params; // ID de la reserva a buscar // Consultar la reserva por su ID

    const [reservas] = await sequelize.query(
      `SELECT * FROM reservas WHERE id_reserva = ?`,
      { replacements: [id_reserva] }
    );

    if (reservas.length === 0) {
      // Si no se encuentra, devolver 404
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada",
      });
    } // Devolver el primer y único resultado

    return res.status(200).json({
      success: true,
      reserva: reservas[0],
    });
  } catch (error) {
    console.error("❌ Error en obtenerReserva:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener reserva",
    });
  }
};

// =============== ACTUALIZAR ESTADO DE RESERVA ===============
exports.actualizarEstadoReserva = async (req, res) => {
  try {
    const { id_reserva } = req.params; // ID de la reserva
    const { estado, notas_admin } = req.body; // Nuevo estado y notas // Validar que el estado sea uno de los permitidos

    if (!["pendiente", "confirmada", "cancelada"].includes(estado)) {
      return res.status(400).json({
        success: false,
        message: "Estado inválido",
      });
    } // 1. Verificar si la reserva existe

    const [reservas] = await sequelize.query(
      `SELECT * FROM reservas WHERE id_reserva = ?`,
      { replacements: [id_reserva] }
    );

    if (reservas.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada",
      });
    } // 2. Construir y ejecutar la consulta de actualización

    let updateQuery = `UPDATE reservas SET estado = ?`;
    const replacements = [estado];

    if (notas_admin !== undefined) {
      // Incluir notas_admin si se proporciona (puede ser null)
      updateQuery += `, notas_admin = ?`;
      replacements.push(notas_admin);
    }

    updateQuery += ` WHERE id_reserva = ?`;
    replacements.push(id_reserva);

    await sequelize.query(updateQuery, { replacements });

    console.log(`✅ Reserva ${id_reserva} actualizada a estado: ${estado}`);

    return res.status(200).json({
      success: true,
      message: "Estado actualizado exitosamente",
    });
  } catch (error) {
    console.error("❌ Error en actualizarEstadoReserva:", error);
    return res.status(500).json({
      success: false,
      message: "Error al actualizar reserva",
    });
  }
};

// =============== CANCELAR RESERVA ===============
exports.cancelarReserva = async (req, res) => {
  try {
    const { id_reserva } = req.params; // ID de la reserva a cancelar // 1. Verificar si la reserva existe

    const [reservas] = await sequelize.query(
      `SELECT * FROM reservas WHERE id_reserva = ?`,
      { replacements: [id_reserva] }
    );

    if (reservas.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada",
      });
    } // 2. Actualizar el estado a 'cancelada'

    await sequelize.query(
      `UPDATE reservas SET estado = 'cancelada' WHERE id_reserva = ?`,
      { replacements: [id_reserva] }
    );

    console.log(`✅ Reserva ${id_reserva} cancelada`);

    return res.status(200).json({
      success: true,
      message: "Reserva cancelada exitosamente",
    });
  } catch (error) {
    console.error("❌ Error en cancelarReserva:", error);
    return res.status(500).json({
      success: false,
      message: "Error al cancelar reserva",
    });
  }
};

// =============== ELIMINAR RESERVA ===============
exports.eliminarReserva = async (req, res) => {
  try {
    const { id_reserva } = req.params; // ID de la reserva a eliminar // 1. Verificar si la reserva existe

    const [reservas] = await sequelize.query(
      `SELECT * FROM reservas WHERE id_reserva = ?`,
      { replacements: [id_reserva] }
    );

    if (reservas.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada",
      });
    } // 2. Ejecutar la eliminación

    await sequelize.query(`DELETE FROM reservas WHERE id_reserva = ?`, {
      replacements: [id_reserva],
    });

    console.log(`✅ Reserva ${id_reserva} eliminada`);

    return res.status(200).json({
      success: true,
      message: "Reserva eliminada exitosamente",
    });
  } catch (error) {
    console.error("❌ Error en eliminarReserva:", error);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar reserva",
    });
  }
};

// =============== OBTENER ESTADÍSTICAS ===============
exports.obtenerEstadisticas = async (req, res) => {
  try {
    // Consulta para calcular estadísticas agrupadas por tipo de servicio
    const [stats] = await sequelize.query(`
      SELECT 
        COUNT(*) as total_reservas,
        SUM(CASE WHEN estado = 'confirmada' THEN 1 ELSE 0 END) as reservas_confirmadas,
        SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as reservas_pendientes,
        SUM(CASE WHEN estado = 'cancelada' THEN 1 ELSE 0 END) as reservas_canceladas,
        SUM(precio_total) as ingresos_totales,
        tipo_servicio
      FROM reservas
      GROUP BY tipo_servicio
    `); // Respuesta con las estadísticas

    return res.status(200).json({
      success: true,
      estadisticas: stats,
    });
  } catch (error) {
    console.error("❌ Error en obtenerEstadisticas:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
    });
  }
};
