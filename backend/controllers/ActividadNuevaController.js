// backend/controllers/ActividadNuevaController.js
const {
  Actividad,
  Persona,
  TipoActividad,
  Alojamiento,
  Ruta,
} = require("../models/index");

// 1. OBTENER TODAS LAS ACTIVIDADES REGISTRADAS (GET)
exports.getAllActividades = async (req, res) => {
  try {
    const actividades = await Actividad.findAll({
      include: [
        {
          model: Persona,
          as: "visitante",
          attributes: [
            "id_persona",
            "nombres",
            "apellidos",
            "correo",
            "telefono",
          ],
        },
        {
          model: TipoActividad,
          as: "tipoActividad",
          attributes: ["id_tipo_actividad", "nombre", "codigo"],
        },
        {
          model: Alojamiento,
          as: "alojamiento",
          attributes: ["id_alojamiento", "nombre"],
        },
        {
          model: Ruta,
          as: "ruta",
          attributes: ["id_ruta", "nombre", "duracion"],
        },
      ],
      order: [["fecha", "DESC"]],
    });

    res.status(200).json({
      success: true,
      total: actividades.length,
      data: actividades,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener actividades",
      error: error.message,
    });
  }
};

// 2. OBTENER ACTIVIDAD POR ID (GET)
exports.getActividadById = async (req, res) => {
  try {
    const { id } = req.params;

    const actividad = await Actividad.findByPk(id, {
      include: [
        { model: Persona, as: "visitante" },
        { model: TipoActividad, as: "tipoActividad" },
        { model: Alojamiento, as: "alojamiento" },
        { model: Ruta, as: "ruta" },
      ],
    });

    if (!actividad) {
      return res.status(404).json({
        success: false,
        message: "Actividad no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: actividad,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener actividad",
      error: error.message,
    });
  }
};

// 3. CREAR ACTIVIDAD (POST)
exports.createActividad = async (req, res) => {
  try {
    const {
      id_persona,
      id_tipo_actividad,
      id_alojamiento,
      id_ruta,
      fecha,
      hora,
      observaciones,
      total_pagar,
    } = req.body;

    // Validar campos requeridos
    if (
      !id_persona ||
      !id_tipo_actividad ||
      !id_ruta ||
      !fecha ||
      !hora ||
      total_pagar === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos",
        campos_requeridos: [
          "id_persona",
          "id_tipo_actividad",
          "id_ruta",
          "fecha",
          "hora",
          "total_pagar",
        ],
      });
    }

    // Verificar que existan los registros relacionados
    const persona = await Persona.findByPk(id_persona);
    if (!persona) {
      return res.status(404).json({
        success: false,
        message: "Persona no encontrada",
      });
    }

    const tipoActividad = await TipoActividad.findByPk(id_tipo_actividad);
    if (!tipoActividad) {
      return res.status(404).json({
        success: false,
        message: "Tipo de actividad no encontrado",
      });
    }

    const ruta = await Ruta.findByPk(id_ruta);
    if (!ruta) {
      return res.status(404).json({
        success: false,
        message: "Ruta no encontrada",
      });
    }

    // Validar alojamiento si se proporciona
    if (id_alojamiento) {
      const alojamiento = await Alojamiento.findByPk(id_alojamiento);
      if (!alojamiento) {
        return res.status(404).json({
          success: false,
          message: "Alojamiento no encontrado",
        });
      }
    }

    // Crear la actividad
    const nuevaActividad = await Actividad.create({
      id_persona,
      id_tipo_actividad,
      id_alojamiento: id_alojamiento || null,
      id_ruta,
      fecha,
      hora,
      observaciones,
      total_pagar,
      estado: "Pendiente",
    });

    // Retornar con relaciones incluidas
    const actividadConRelaciones = await Actividad.findByPk(
      nuevaActividad.id_actividad,
      {
        include: [
          { model: Persona, as: "visitante" },
          { model: TipoActividad, as: "tipoActividad" },
          { model: Alojamiento, as: "alojamiento" },
          { model: Ruta, as: "ruta" },
        ],
      }
    );

    res.status(201).json({
      success: true,
      message: "Actividad registrada exitosamente",
      data: actividadConRelaciones,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error al crear actividad",
      error: error.message,
    });
  }
};

// 4. ACTUALIZAR ACTIVIDAD (PUT)
exports.updateActividad = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_persona,
      id_tipo_actividad,
      id_alojamiento,
      id_ruta,
      fecha,
      hora,
      observaciones,
      total_pagar,
      estado,
    } = req.body;

    const actividad = await Actividad.findByPk(id);

    if (!actividad) {
      return res.status(404).json({
        success: false,
        message: "Actividad no encontrada",
      });
    }

    // Validar estados permitidos
    const estadosValidos = [
      "Pendiente",
      "Confirmada",
      "Completada",
      "Cancelada",
    ];
    if (estado && !estadosValidos.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: "Estado inválido",
        estadosValidos,
      });
    }

    // Actualizar campos
    if (id_persona) actividad.id_persona = id_persona;
    if (id_tipo_actividad) actividad.id_tipo_actividad = id_tipo_actividad;
    if (id_alojamiento !== undefined) actividad.id_alojamiento = id_alojamiento;
    if (id_ruta) actividad.id_ruta = id_ruta;
    if (fecha) actividad.fecha = fecha;
    if (hora) actividad.hora = hora;
    if (observaciones) actividad.observaciones = observaciones;
    if (total_pagar !== undefined) actividad.total_pagar = total_pagar;
    if (estado) actividad.estado = estado;

    await actividad.save();

    // Retornar con relaciones
    const actividadActualizada = await Actividad.findByPk(id, {
      include: [
        { model: Persona, as: "visitante" },
        { model: TipoActividad, as: "tipoActividad" },
        { model: Alojamiento, as: "alojamiento" },
        { model: Ruta, as: "ruta" },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Actividad actualizada exitosamente",
      data: actividadActualizada,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar actividad",
      error: error.message,
    });
  }
};

// 5. ELIMINAR ACTIVIDAD (DELETE)
exports.deleteActividad = async (req, res) => {
  try {
    const { id } = req.params;

    const actividad = await Actividad.findByPk(id);

    if (!actividad) {
      return res.status(404).json({
        success: false,
        message: "Actividad no encontrada",
      });
    }

    await actividad.destroy();

    res.status(200).json({
      success: true,
      message: "Actividad eliminada exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar actividad",
      error: error.message,
    });
  }
};

// 6. OBTENER ACTIVIDADES POR ESTADO (GET)
exports.getActividadesPorEstado = async (req, res) => {
  try {
    const { estado } = req.params;

    const estadosValidos = [
      "Pendiente",
      "Confirmada",
      "Completada",
      "Cancelada",
    ];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: "Estado inválido",
        estadosValidos,
      });
    }

    const actividades = await Actividad.findAll({
      where: { estado },
      include: [
        { model: Persona, as: "visitante" },
        { model: TipoActividad, as: "tipoActividad" },
        { model: Alojamiento, as: "alojamiento" },
        { model: Ruta, as: "ruta" },
      ],
      order: [["fecha", "DESC"]],
    });

    res.status(200).json({
      success: true,
      estado,
      total: actividades.length,
      data: actividades,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener actividades",
      error: error.message,
    });
  }
};

// 7. OBTENER ACTIVIDADES POR VISITANTE (GET)
exports.getActividadesPorVisitante = async (req, res) => {
  try {
    const { id_persona } = req.params;

    const actividades = await Actividad.findAll({
      where: { id_persona },
      include: [
        { model: Persona, as: "visitante" },
        { model: TipoActividad, as: "tipoActividad" },
        { model: Alojamiento, as: "alojamiento" },
        { model: Ruta, as: "ruta" },
      ],
      order: [["fecha", "DESC"]],
    });

    res.status(200).json({
      success: true,
      total: actividades.length,
      data: actividades,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener actividades",
      error: error.message,
    });
  }
};

// 8. OBTENER ACTIVIDADES POR RUTA (GET)
exports.getActividadesPorRuta = async (req, res) => {
  try {
    const { id_ruta } = req.params;

    const actividades = await Actividad.findAll({
      where: { id_ruta },
      include: [
        { model: Persona, as: "visitante" },
        { model: TipoActividad, as: "tipoActividad" },
        { model: Alojamiento, as: "alojamiento" },
        { model: Ruta, as: "ruta" },
      ],
      order: [["fecha", "DESC"]],
    });

    res.status(200).json({
      success: true,
      total: actividades.length,
      data: actividades,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener actividades",
      error: error.message,
    });
  }
};
