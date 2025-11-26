// backend/controllers/TipoPersonaController.js
const TipoPersona = require("../models/TipoPersona");

// 1. OBTENER TODOS LOS TIPOS DE PERSONAS (GET)
exports.getAllTiposPersona = async (req, res) => {
  try {
    const tipos = await TipoPersona.findAll({
      where: { estado: 1 },
      order: [["nombre", "ASC"]],
    });

    res.status(200).json({
      success: true,
      total: tipos.length,
      data: tipos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener tipos de personas",
      error: error.message,
    });
  }
};

// 2. OBTENER TIPO DE PERSONA POR ID (GET)
exports.getTipoPersonaById = async (req, res) => {
  try {
    const { id } = req.params;
    const tipo = await TipoPersona.findByPk(id);

    if (!tipo) {
      return res.status(404).json({
        success: false,
        message: "Tipo de persona no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: tipo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener tipo de persona",
      error: error.message,
    });
  }
};

// 3. CREAR TIPO DE PERSONA (POST)
exports.createTipoPersona = async (req, res) => {
  try {
    const { nombre, descripcion, observaciones } = req.body;

    // Validar campo requerido
    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: "El nombre es obligatorio",
      });
    }

    // Verificar que no exista otro con el mismo nombre
    const existente = await TipoPersona.findOne({
      where: { nombre },
    });

    if (existente) {
      return res.status(409).json({
        success: false,
        message: "Ya existe un tipo de persona con ese nombre",
      });
    }

    const nuevoTipo = await TipoPersona.create({
      nombre,
      descripcion,
      observaciones,
      estado: 1,
    });

    res.status(201).json({
      success: true,
      message: "Tipo de persona creado exitosamente",
      data: nuevoTipo,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error al crear tipo de persona",
      error: error.message,
    });
  }
};

// 4. ACTUALIZAR TIPO DE PERSONA (PUT)
exports.updateTipoPersona = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, observaciones, estado } = req.body;

    const tipo = await TipoPersona.findByPk(id);

    if (!tipo) {
      return res.status(404).json({
        success: false,
        message: "Tipo de persona no encontrado",
      });
    }

    // Si cambio el nombre, verificar que sea único
    if (nombre && nombre !== tipo.nombre) {
      const existente = await TipoPersona.findOne({
        where: { nombre },
      });
      if (existente) {
        return res.status(409).json({
          success: false,
          message: "Ya existe otro tipo de persona con ese nombre",
        });
      }
      tipo.nombre = nombre;
    }

    // Actualizar otros campos
    if (descripcion) tipo.descripcion = descripcion;
    if (observaciones) tipo.observaciones = observaciones;
    if (estado !== undefined) tipo.estado = estado;

    await tipo.save();

    res.status(200).json({
      success: true,
      message: "Tipo de persona actualizado exitosamente",
      data: tipo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar tipo de persona",
      error: error.message,
    });
  }
};

// 5. ELIMINAR/DESACTIVAR TIPO DE PERSONA (DELETE)
exports.deleteTipoPersona = async (req, res) => {
  try {
    const { id } = req.params;

    const tipo = await TipoPersona.findByPk(id);

    if (!tipo) {
      return res.status(404).json({
        success: false,
        message: "Tipo de persona no encontrado",
      });
    }

    // Soft delete
    tipo.estado = 0;
    await tipo.save();

    res.status(200).json({
      success: true,
      message: "Tipo de persona desactivado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar tipo de persona",
      error: error.message,
    });
  }
};

// 6. OBTENER TIPOS DE PERSONAS ACTIVOS (GET)
exports.getTiposPersonaActivos = async (req, res) => {
  try {
    const tipos = await TipoPersona.findAll({
      where: { estado: 1 },
      attributes: ["id_tipo_persona", "nombre", "descripcion"],
      order: [["nombre", "ASC"]],
    });

    res.status(200).json({
      success: true,
      total: tipos.length,
      data: tipos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener tipos activos",
      error: error.message,
    });
  }
};
