// backend/controllers/RutaController.js
const Ruta = require("../models/Ruta");

// 1. OBTENER TODAS LAS RUTAS (GET)
exports.getAllRutas = async (req, res) => {
  try {
    const rutas = await Ruta.findAll({
      where: { estado: 1 },
      order: [["nombre", "ASC"]],
    });

    res.status(200).json({
      success: true,
      total: rutas.length,
      data: rutas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener rutas",
      error: error.message,
    });
  }
};

// 2. OBTENER RUTA POR ID (GET)
exports.getRutaById = async (req, res) => {
  try {
    const { id } = req.params;
    const ruta = await Ruta.findByPk(id);

    if (!ruta) {
      return res.status(404).json({
        success: false,
        message: "Ruta no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: ruta,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener ruta",
      error: error.message,
    });
  }
};

// 3. CREAR RUTA (POST)
exports.createRuta = async (req, res) => {
  try {
    const { nombre, duracion, observaciones, valor } = req.body;

    // Validar campos requeridos
    if (!nombre || !duracion || valor === undefined) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos",
        campos_requeridos: ["nombre", "duracion", "valor"],
      });
    }

    const nuevaRuta = await Ruta.create({
      nombre,
      duracion,
      observaciones,
      valor,
      estado: 1,
    });

    res.status(201).json({
      success: true,
      message: "Ruta creada exitosamente",
      data: nuevaRuta,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error al crear ruta",
      error: error.message,
    });
  }
};

// 4. ACTUALIZAR RUTA (PUT)
exports.updateRuta = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, duracion, observaciones, valor, estado } = req.body;

    const ruta = await Ruta.findByPk(id);

    if (!ruta) {
      return res.status(404).json({
        success: false,
        message: "Ruta no encontrada",
      });
    }

    // Actualizar solo los campos proporcionados
    if (nombre) ruta.nombre = nombre;
    if (duracion) ruta.duracion = duracion;
    if (observaciones) ruta.observaciones = observaciones;
    if (valor !== undefined) ruta.valor = valor;
    if (estado !== undefined) ruta.estado = estado;

    await ruta.save();

    res.status(200).json({
      success: true,
      message: "Ruta actualizada exitosamente",
      data: ruta,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar ruta",
      error: error.message,
    });
  }
};

// 5. ELIMINAR/DESACTIVAR RUTA (DELETE)
exports.deleteRuta = async (req, res) => {
  try {
    const { id } = req.params;

    const ruta = await Ruta.findByPk(id);

    if (!ruta) {
      return res.status(404).json({
        success: false,
        message: "Ruta no encontrada",
      });
    }

    // Desactivar en lugar de eliminar (soft delete)
    ruta.estado = 0;
    await ruta.save();

    res.status(200).json({
      success: true,
      message: "Ruta desactivada exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar ruta",
      error: error.message,
    });
  }
};

// 6. OBTENER RUTAS ACTIVAS (GET)
exports.getRutasActivas = async (req, res) => {
  try {
    const rutas = await Ruta.findAll({
      where: { estado: 1 },
      attributes: ["id_ruta", "nombre", "duracion", "valor"],
      order: [["nombre", "ASC"]],
    });

    res.status(200).json({
      success: true,
      total: rutas.length,
      data: rutas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener rutas activas",
      error: error.message,
    });
  }
};

// 7. OBTENER RUTAS POR DURACIÓN (GET)
exports.getRutasPorDuracion = async (req, res) => {
  try {
    const { duracion } = req.params;

    const rutas = await Ruta.findAll({
      where: {
        duracion,
        estado: 1,
      },
      order: [["nombre", "ASC"]],
    });

    res.status(200).json({
      success: true,
      duracion,
      total: rutas.length,
      data: rutas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener rutas por duración",
      error: error.message,
    });
  }
};
