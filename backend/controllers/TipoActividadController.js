// backend/controllers/TipoActividadController.js
const TipoActividad = require("../models/TipoActividad");

// 1. OBTENER TODOS LOS TIPOS DE ACTIVIDADES (GET)
exports.getAllTiposActividad = async (req, res) => {
  try {
    const tipos = await TipoActividad.findAll({
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
      message: "Error al obtener tipos de actividades",
      error: error.message,
    });
  }
};

// 2. OBTENER TIPO DE ACTIVIDAD POR ID (GET)
exports.getTipoActividadById = async (req, res) => {
  try {
    const { id } = req.params;
    const tipo = await TipoActividad.findByPk(id);

    if (!tipo) {
      return res.status(404).json({
        success: false,
        message: "Tipo de actividad no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: tipo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener tipo de actividad",
      error: error.message,
    });
  }
};

// 3. OBTENER POR CÓDIGO (GET)
exports.getTipoActividadByCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    const tipo = await TipoActividad.findOne({
      where: { codigo, estado: 1 },
    });

    if (!tipo) {
      return res.status(404).json({
        success: false,
        message: "Tipo de actividad no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: tipo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener tipo de actividad",
      error: error.message,
    });
  }
};

// 4. CREAR TIPO DE ACTIVIDAD (POST)
exports.createTipoActividad = async (req, res) => {
  try {
    const { codigo, nombre, imagen, observaciones, valor } = req.body;

    // Validar campos requeridos
    if (!codigo || !nombre || valor === undefined) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos",
        campos_requeridos: ["codigo", "nombre", "valor"],
      });
    }

    // Verificar que el código sea único
    const existente = await TipoActividad.findOne({ where: { codigo } });
    if (existente) {
      return res.status(409).json({
        success: false,
        message: "El código ya existe",
      });
    }

    const nuevoTipo = await TipoActividad.create({
      codigo,
      nombre,
      imagen,
      observaciones,
      valor,
      estado: 1,
    });

    res.status(201).json({
      success: true,
      message: "Tipo de actividad creado exitosamente",
      data: nuevoTipo,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error al crear tipo de actividad",
      error: error.message,
    });
  }
};

// 5. ACTUALIZAR TIPO DE ACTIVIDAD (PUT)
exports.updateTipoActividad = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, nombre, imagen, observaciones, valor, estado } = req.body;

    const tipo = await TipoActividad.findByPk(id);

    if (!tipo) {
      return res.status(404).json({
        success: false,
        message: "Tipo de actividad no encontrado",
      });
    }

    // Si cambio el código, verificar que sea único
    if (codigo && codigo !== tipo.codigo) {
      const existente = await TipoActividad.findOne({
        where: { codigo },
      });
      if (existente) {
        return res.status(409).json({
          success: false,
          message: "El código ya existe",
        });
      }
      tipo.codigo = codigo;
    }

    // Actualizar solo los campos proporcionados
    if (nombre) tipo.nombre = nombre;
    if (imagen) tipo.imagen = imagen;
    if (observaciones) tipo.observaciones = observaciones;
    if (valor !== undefined) tipo.valor = valor;
    if (estado !== undefined) tipo.estado = estado;

    await tipo.save();

    res.status(200).json({
      success: true,
      message: "Tipo de actividad actualizado exitosamente",
      data: tipo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar tipo de actividad",
      error: error.message,
    });
  }
};

// 6. ELIMINAR/DESACTIVAR TIPO DE ACTIVIDAD (DELETE)
exports.deleteTipoActividad = async (req, res) => {
  try {
    const { id } = req.params;

    const tipo = await TipoActividad.findByPk(id);

    if (!tipo) {
      return res.status(404).json({
        success: false,
        message: "Tipo de actividad no encontrado",
      });
    }

    // Desactivar en lugar de eliminar (soft delete)
    tipo.estado = 0;
    await tipo.save();

    res.status(200).json({
      success: true,
      message: "Tipo de actividad desactivado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar tipo de actividad",
      error: error.message,
    });
  }
};

// 7. OBTENER TIPOS ACTIVOS (GET)
exports.getTiposActivos = async (req, res) => {
  try {
    const tipos = await TipoActividad.findAll({
      where: { estado: 1 },
      attributes: ["id_tipo_actividad", "codigo", "nombre", "valor", "imagen"],
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
