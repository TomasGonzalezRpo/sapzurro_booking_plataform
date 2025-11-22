// backend/controllers/ReservasController.js
const { sequelize } = require("../models/index");

// 🔑 Crear tabla de reservas si no existe
const createReservasTable = async () => {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS reservas (
        id_reserva INT PRIMARY KEY AUTO_INCREMENT,
        id_usuario INT NOT NULL,
        id_hotel VARCHAR(100),
        hotel_nombre VARCHAR(255) NOT NULL,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        tipo_habitacion VARCHAR(100) NOT NULL,
        cantidad_habitaciones INT NOT NULL DEFAULT 1,
        cantidad_huespedes INT NOT NULL,
        precio_por_noche DECIMAL(10, 2) NOT NULL,
        precio_total DECIMAL(10, 2) NOT NULL,
        estado ENUM('pendiente', 'confirmada', 'cancelada') DEFAULT 'confirmada',
        fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
        INDEX idx_usuario (id_usuario),
        INDEX idx_fecha (fecha_reserva)
      );
    `);
    console.log("✅ Tabla de reservas creada o ya existe");
  } catch (error) {
    console.error("❌ Error al crear tabla de reservas:", error.message);
  }
};

// Ejecutar al cargar el módulo
createReservasTable();

// =============== CREAR RESERVA ===============
exports.crearReserva = async (req, res) => {
  try {
    // 🔑 VERIFICAR QUE HAYA USUARIO AUTENTICADO
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Debe iniciar sesión para completar la reserva",
      });
    }

    const {
      id_hotel,
      hotel_nombre,
      check_in,
      check_out,
      tipo_habitacion,
      cantidad_habitaciones,
      cantidad_huespedes,
      precio_por_noche,
      precio_total,
      estado,
    } = req.body;

    const id_usuario = req.user.id_usuario;

    // Validar datos requeridos
    if (
      !check_in ||
      !check_out ||
      !tipo_habitacion ||
      !hotel_nombre ||
      !precio_total
    ) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos requeridos para la reserva",
      });
    }

    // Validar que check_out sea después de check_in
    if (new Date(check_out) <= new Date(check_in)) {
      return res.status(400).json({
        success: false,
        message: "La fecha de check-out debe ser después de check-in",
      });
    }

    // Insertar en base de datos
    const [result] = await sequelize.query(
      `INSERT INTO reservas (
        id_usuario,
        id_hotel,
        hotel_nombre,
        check_in,
        check_out,
        tipo_habitacion,
        cantidad_habitaciones,
        cantidad_huespedes,
        precio_por_noche,
        precio_total,
        estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          id_usuario,
          id_hotel || null,
          hotel_nombre,
          check_in,
          check_out,
          tipo_habitacion,
          cantidad_habitaciones || 1,
          cantidad_huespedes,
          precio_por_noche,
          precio_total,
          estado || "confirmada",
        ],
      }
    );

    const id_reserva = result;

    console.log(
      `✅ Reserva creada: ID ${id_reserva} para usuario ${id_usuario}`
    );

    return res.status(201).json({
      success: true,
      message: "Reserva creada exitosamente",
      id_reserva: id_reserva,
      reserva: {
        id_reserva,
        id_usuario,
        hotel_nombre,
        check_in,
        check_out,
        tipo_habitacion,
        cantidad_habitaciones,
        cantidad_huespedes,
        precio_total,
        estado: estado || "confirmada",
      },
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

// =============== OBTENER RESERVAS DEL USUARIO ===============
exports.obtenerMisReservas = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Debe iniciar sesión",
      });
    }

    const id_usuario = req.user.id_usuario;

    const [reservas] = await sequelize.query(
      `SELECT * FROM reservas WHERE id_usuario = ? ORDER BY fecha_reserva DESC`,
      { replacements: [id_usuario] }
    );

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
    const { id_reserva } = req.params;

    const [reservas] = await sequelize.query(
      `SELECT * FROM reservas WHERE id_reserva = ?`,
      { replacements: [id_reserva] }
    );

    if (reservas.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada",
      });
    }

    const reserva = reservas[0];

    // Verificar que el usuario sea el propietario
    if (req.user && reserva.id_usuario !== req.user.id_usuario) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para ver esta reserva",
      });
    }

    return res.status(200).json({
      success: true,
      reserva,
    });
  } catch (error) {
    console.error("❌ Error en obtenerReserva:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener reserva",
    });
  }
};

// =============== CANCELAR RESERVA ===============
exports.cancelarReserva = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Debe iniciar sesión",
      });
    }

    const { id_reserva } = req.params;

    // Verificar que existe y que pertenece al usuario
    const [reservas] = await sequelize.query(
      `SELECT * FROM reservas WHERE id_reserva = ?`,
      { replacements: [id_reserva] }
    );

    if (reservas.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada",
      });
    }

    const reserva = reservas[0];
    if (reserva.id_usuario !== req.user.id_usuario) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para cancelar esta reserva",
      });
    }

    // Actualizar estado a cancelada
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
