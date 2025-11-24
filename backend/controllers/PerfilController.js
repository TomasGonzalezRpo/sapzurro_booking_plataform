// backend/controllers/PerfilController.js
const Perfil = require("../models/Perfil"); // Importamos el modelo Perfil
const Persona = require("../models/Persona"); // Importamos el modelo Persona
const Usuario = require("../models/Usuario"); // Importamos el modelo Usuario

// ============================================================
// FUNCIONES DE PERFIL DE USUARIO (Acceso propio)
// ============================================================

// Función para obtener los datos del usuario que está logueado
exports.obtenerMiDatos = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario; // Obtenemos el ID del token (middleware de autenticación)

    console.log(`📋 Obteniendo datos para usuario: ${id_usuario}`); // Buscar el usuario por su ID

    const usuario = await Usuario.findByPk(id_usuario, {
      // Seleccionamos solo los campos que queremos del usuario
      attributes: [
        "id_usuario",
        "usuario",
        "estado",
        "id_persona",
        "id_perfil",
      ],
      include: [
        {
          model: Persona, // Incluimos los datos de la persona
          as: "personaInfo", // El alias que definimos en el modelo // Seleccionamos los campos de la persona
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
          model: Perfil, // Incluimos el perfil (rol)
          as: "perfil", // El alias que definimos en el modelo
          attributes: ["id_perfil", "nombre", "descripcion"],
        },
      ],
    });

    if (!usuario) {
      // Si no lo encuentra (no debería pasar si el token es válido)
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    console.log("✅ Datos obtenidos correctamente"); // Devolvemos todos los datos juntos

    return res.status(200).json({
      success: true,
      datos: {
        id_usuario: usuario.id_usuario,
        usuario: usuario.usuario,
        estado: usuario.estado,
        persona: usuario.personaInfo, // Accedemos a los datos de la persona
        perfil: usuario.perfil, // Accedemos a los datos del perfil
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

// Función para actualizar los datos personales del usuario logueado
exports.actualizarMisDatos = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario; // ID del usuario autenticado // Campos que pueden ser actualizados
    const { nombres, apellidos, correo, telefono, direccion } = req.body;

    console.log(`📝 Actualizando datos para usuario: ${id_usuario}`); // 1. Buscar el usuario

    const usuario = await Usuario.findByPk(id_usuario);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    } // 2. Actualizar la tabla Persona con los nuevos datos

    await Persona.update(
      {
        // Solo actualiza si el campo existe en el body
        nombres: nombres || undefined,
        apellidos: apellidos || undefined,
        correo: correo || undefined,
        telefono: telefono || undefined,
        direccion: direccion || undefined,
      },
      {
        where: { id_persona: usuario.id_persona }, // Usamos el id_persona del usuario
      }
    );

    console.log("✅ Datos actualizados correctamente"); // 3. Buscar y devolver los datos actualizados (usamos la misma lógica que `obtenerMiDatos`)

    const usuarioActualizado = await Usuario.findByPk(id_usuario, {
      // Seleccionamos solo los campos que queremos del usuario
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
          as: "personaInfo", // Incluimos Persona
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
          as: "perfil", // Incluimos Perfil
          attributes: ["id_perfil", "nombre", "descripcion"],
        },
      ],
    }); // Respuesta de éxito

    return res.status(200).json({
      success: true,
      message: "Datos actualizados exitosamente",
      datos: {
        id_usuario: usuarioActualizado.id_usuario,
        usuario: usuarioActualizado.usuario,
        estado: usuarioActualizado.estado,
        persona: usuarioActualizado.personaInfo,
        perfil: usuarioActualizado.perfil,
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
// FUNCIONES CRUD DE PERFILES (Administración)
// ============================================================

// 1. LEER TODOS (GET)
exports.getAllPerfiles = async (req, res) => {
  try {
    // Buscar todos los perfiles en la base de datos
    const perfiles = await Perfil.findAll();
    res.status(200).json(perfiles); // Devolver la lista
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener perfiles", error: error.message });
  }
};

// 2. CREAR (POST)
exports.createPerfil = async (req, res) => {
  try {
    // Validar que el nombre del perfil no esté vacío
    if (!req.body.nombre) {
      return res
        .status(400)
        .json({ message: "El nombre del perfil es obligatorio." });
    } // Crear un nuevo registro en la tabla Perfil

    const nuevoPerfil = await Perfil.create(req.body);
    res.status(201).json(nuevoPerfil); // Devolver el perfil creado
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al crear perfil", error: error.message });
  }
};

// 3. ACTUALIZAR (PUT)
exports.updatePerfil = async (req, res) => {
  const { id } = req.params; // Obtener el ID del parámetro
  try {
    // Actualizar el registro donde id_perfil coincida con el ID
    const [updatedRows] = await Perfil.update(req.body, {
      where: { id_perfil: id },
    });

    if (updatedRows) {
      // Si se actualizó, buscar y devolver el perfil actualizado
      const perfilActualizado = await Perfil.findByPk(id);
      res.status(200).json(perfilActualizado);
    } else {
      // Si no se actualizó, es porque no existe
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
  const { id } = req.params; // Obtener el ID
  try {
    // Eliminar el registro
    const deletedRows = await Perfil.destroy({
      where: { id_perfil: id },
    });

    if (deletedRows) {
      // Devolver código 204 (No Content) si se eliminó
      res.status(204).send();
    } else {
      // Si no se eliminó, es porque no existe
      res.status(404).json({ message: "Perfil no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar perfil", error: error.message });
  }
};
