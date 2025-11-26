// backend/controllers/AlojamientoController.js
const Alojamiento = require("../models/Alojamiento");

// 1. OBTENER TODOS LOS ALOJAMIENTOS (GET)
exports.getAllAlojamientos = async (req, res) => {
  try {
    const alojamientos = await Alojamiento.findAll({
      where: { estado: 1 },
      order: [["nombre", "ASC"]],
    });
    res.status(200).json({
      success: true,
      total: alojamientos.length,
      data: alojamientos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener alojamientos",
      error: error.message,
    });
  }
};

// 2. OBTENER ALOJAMIENTO POR ID (GET)
exports.getAlojamientoById = async (req, res) => {
  try {
    const { id } = req.params;
    const alojamiento = await Alojamiento.findByPk(id);

    if (!alojamiento) {
      return res.status(404).json({
        success: false,
        message: "Alojamiento no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: alojamiento,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener alojamiento",
      error: error.message,
    });
  }
};

// 3. CREAR ALOJAMIENTO (POST)
exports.createAlojamiento = async (req, res) => {
  try {
    const { nombre, direccion, telefono, correo, valor, observaciones } =
      req.body;

    // Validar campos requeridos
    if (!nombre || !direccion || !telefono || !correo || valor === undefined) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos",
        campos_requeridos: [
          "nombre",
          "direccion",
          "telefono",
          "correo",
          "valor",
        ],
      });
    }

    const nuevoAlojamiento = await Alojamiento.create({
      nombre,
      direccion,
      telefono,
      correo,
      valor,
      observaciones,
      estado: 1,
    });

    res.status(201).json({
      success: true,
      message: "Alojamiento creado exitosamente",
      data: nuevoAlojamiento,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error al crear alojamiento",
      error: error.message,
    });
  }
};

// 4. ACTUALIZAR ALOJAMIENTO (PUT)
exports.updateAlojamiento = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      direccion,
      telefono,
      correo,
      valor,
      observaciones,
      estado,
    } = req.body;

    const alojamiento = await Alojamiento.findByPk(id);

    if (!alojamiento) {
      return res.status(404).json({
        success: false,
        message: "Alojamiento no encontrado",
      });
    }

    // Actualizar solo los campos proporcionados
    if (nombre) alojamiento.nombre = nombre;
    if (direccion) alojamiento.direccion = direccion;
    if (telefono) alojamiento.telefono = telefono;
    if (correo) alojamiento.correo = correo;
    if (valor !== undefined) alojamiento.valor = valor;
    if (observaciones) alojamiento.observaciones = observaciones;
    if (estado !== undefined) alojamiento.estado = estado;

    await alojamiento.save();

    res.status(200).json({
      success: true,
      message: "Alojamiento actualizado exitosamente",
      data: alojamiento,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar alojamiento",
      error: error.message,
    });
  }
};

// 5. ELIMINAR/DESACTIVAR ALOJAMIENTO (DELETE)
exports.deleteAlojamiento = async (req, res) => {
  try {
    const { id } = req.params;

    const alojamiento = await Alojamiento.findByPk(id);

    if (!alojamiento) {
      return res.status(404).json({
        success: false,
        message: "Alojamiento no encontrado",
      });
    }

    // Desactivar en lugar de eliminar (soft delete)
    alojamiento.estado = 0;
    await alojamiento.save();

    res.status(200).json({
      success: true,
      message: "Alojamiento desactivado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar alojamiento",
      error: error.message,
    });
  }
};

// 6. OBTENER ALOJAMIENTOS ACTIVOS (GET)
exports.getAlojamientosActivos = async (req, res) => {
  try {
    const alojamientos = await Alojamiento.findAll({
      where: { estado: 1 },
      attributes: ["id_alojamiento", "nombre", "valor", "correo", "telefono"],
      order: [["nombre", "ASC"]],
    });

    res.status(200).json({
      success: true,
      total: alojamientos.length,
      data: alojamientos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener alojamientos activos",
      error: error.message,
    });
  }
};
