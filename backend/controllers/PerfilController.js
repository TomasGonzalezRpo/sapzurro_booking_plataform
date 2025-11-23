// backend/controllers/PerfilController.js
const Perfil = require("../models/Perfil");
const Persona = require("../models/Persona");
const Usuario = require("../models/Usuario");

// ============================================================
// 🔑 NUEVAS FUNCIONES (Protegidas - requieren autenticación)
// ============================================================

// 🔒 OBTENER MIS DATOS (Usuario logueado)
exports.obtenerMiDatos = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;

    console.log(`📋 Obteniendo datos para usuario: ${id_usuario}`);

    // 1️⃣ Buscar Usuario con sus relaciones
    const usuario = await Usuario.findByPk(id_usuario, {
      attributes: [
        "id_usuario",
        "usuario",
        "estado",
        "id_persona",
        "id_perfil",
      ],
      include: [
        {
          model: Persona,
          as: "personaInfo", // 🔑 ALIAS CORRECTO
          attributes: [
            "id_persona",
            "nombres",
            "apellidos",
            "tipo_documento",
            "numero_documento",
            "correo",
            "telefono",
            "direccion",
            "estado",
          ],
        },
        {
          model: Perfil,
          as: "perfil", // 🔑 ALIAS CORRECTO
          attributes: ["id_perfil", "nombre", "descripcion"],
        },
      ],
    });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    console.log("✅ Datos obtenidos correctamente");

    return res.status(200).json({
      success: true,
      datos: {
        id_usuario: usuario.id_usuario,
        usuario: usuario.usuario,
        estado: usuario.estado,
        persona: usuario.personaInfo, // 🔑 USA EL ALIAS
        perfil: usuario.perfil, // 🔑 USA EL ALIAS
      },
    });
  } catch (error) {
    console.error("❌ Error en obtenerMiDatos:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener datos personales",
      error: error.message,
    });
  }
};

// 🔒 ACTUALIZAR MIS DATOS (Usuario logueado)
exports.actualizarMisDatos = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const { nombres, apellidos, correo, telefono, direccion } = req.body;

    console.log(`📝 Actualizando datos para usuario: ${id_usuario}`);

    // 1️⃣ Buscar Usuario
    const usuario = await Usuario.findByPk(id_usuario);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // 2️⃣ Actualizar Persona
    await Persona.update(
      {
        nombres: nombres || undefined,
        apellidos: apellidos || undefined,
        correo: correo || undefined,
        telefono: telefono || undefined,
        direccion: direccion || undefined,
      },
      {
        where: { id_persona: usuario.id_persona },
      }
    );

    console.log("✅ Datos actualizados correctamente");

    // 3️⃣ Retornar datos actualizados
    const usuarioActualizado = await Usuario.findByPk(id_usuario, {
      attributes: [
        "id_usuario",
        "usuario",
        "estado",
        "id_persona",
        "id_perfil",
      ],
      include: [
        {
          model: Persona,
          as: "personaInfo", // 🔑 ALIAS CORRECTO
          attributes: [
            "id_persona",
            "nombres",
            "apellidos",
            "tipo_documento",
            "numero_documento",
            "correo",
            "telefono",
            "direccion",
            "estado",
          ],
        },
        {
          model: Perfil,
          as: "perfil", // 🔑 ALIAS CORRECTO
          attributes: ["id_perfil", "nombre", "descripcion"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Datos actualizados exitosamente",
      datos: {
        id_usuario: usuarioActualizado.id_usuario,
        usuario: usuarioActualizado.usuario,
        estado: usuarioActualizado.estado,
        persona: usuarioActualizado.personaInfo, // 🔑 USA EL ALIAS
        perfil: usuarioActualizado.perfil, // 🔑 USA EL ALIAS
      },
    });
  } catch (error) {
    console.error("❌ Error en actualizarMisDatos:", error);
    return res.status(500).json({
      success: false,
      message: "Error al actualizar datos",
      error: error.message,
    });
  }
};

// ============================================================
// FUNCIONES EXISTENTES (sin cambios)
// ============================================================

// 1. LEER TODOS (GET)
exports.getAllPerfiles = async (req, res) => {
  try {
    const perfiles = await Perfil.findAll();
    res.status(200).json(perfiles);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener perfiles", error: error.message });
  }
};

// 2. CREAR (POST)
exports.createPerfil = async (req, res) => {
  try {
    if (!req.body.nombre) {
      return res
        .status(400)
        .json({ message: "El nombre del perfil es obligatorio." });
    }

    const nuevoPerfil = await Perfil.create(req.body);
    res.status(201).json(nuevoPerfil);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al crear perfil", error: error.message });
  }
};

// 3. ACTUALIZAR (PUT)
exports.updatePerfil = async (req, res) => {
  const { id } = req.params;
  try {
    const [updatedRows] = await Perfil.update(req.body, {
      where: { id_perfil: id },
    });

    if (updatedRows) {
      const perfilActualizado = await Perfil.findByPk(id);
      res.status(200).json(perfilActualizado);
    } else {
      res.status(404).json({ message: "Perfil no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar perfil", error: error.message });
  }
};

// 4. ELIMINAR (DELETE)
exports.deletePerfil = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRows = await Perfil.destroy({
      where: { id_perfil: id },
    });

    if (deletedRows) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Perfil no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar perfil", error: error.message });
  }
};
