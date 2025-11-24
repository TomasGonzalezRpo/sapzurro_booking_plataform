const { Usuario, Persona, Perfil } = require("../models/index");
const crypto = require("crypto"); // Módulo nativo de Node.js para criptografía (usado en recuperación)

// ============================================================
// ADAPTADOR Y CONFIGURACIÓN BASE
// ============================================================

// Opciones reutilizables para incluir relaciones y excluir password
const baseFindOptions = {
  include: [
    // Incluimos la relación Persona
    { model: Persona, as: "personaInfo" }, // Incluimos la relación Perfil (Rol)
    { model: Perfil, as: "perfil" },
  ],
  attributes: { exclude: ["password"] }, // Nunca devolver la contraseña
};

/**
 * adaptUsuario: normaliza una instancia/objeto Usuario devuelto por Sequelize
 * Unifica la estructura de salida para el frontend.
 */
function adaptUsuario(u) {
  if (!u) return null; // Tomar dataValues si es una instancia de Sequelize

  const raw = u.dataValues ? u.dataValues : u; // Lógica flexible para encontrar los datos de la Persona

  const personaCandidates = [
    raw.personaInfo,
    raw.persona,
    raw.Persona,
    raw.Person,
    (raw.dataValues && raw.dataValues.personaInfo) || undefined,
  ].filter(Boolean);

  const persona = personaCandidates.length > 0 ? personaCandidates[0] : null; // Extraer nombres y apellidos de la Persona

  const nombres =
    (persona && (persona.nombres ?? persona.firstName ?? persona.first_name)) ||
    raw.nombres ||
    "";
  const apellidos =
    (persona && (persona.apellidos ?? persona.lastName ?? persona.last_name)) ||
    raw.apellidos ||
    ""; // Concatenar nombre completo

  const computedFullName = [nombres, apellidos]
    .filter(Boolean)
    .join(" ")
    .trim(); // Extraer correo

  const correo =
    (persona && (persona.correo ?? persona.email)) ||
    raw.correo ||
    raw.email ||
    ""; // Extraer el nombre del Perfil (rol)

  const rol = raw.perfil?.nombre ?? raw.rol ?? "Desconocido"; // Devolver el objeto unificado

  return {
    id_usuario: raw.id_usuario ?? raw.id ?? null,
    username: raw.usuario ?? raw.username ?? "",
    nombres: nombres || "",
    apellidos: apellidos || "",
    fullName: computedFullName || (raw.usuario ?? raw.username ?? ""),
    correo,
    id_perfil: raw.id_perfil ?? null,
    rol,
    provider: raw.provider ?? "local", // Por defecto, estado es 1 (activo)
    estado:
      typeof raw.estado !== "undefined" && raw.estado !== null ? raw.estado : 1,
  };
}

// ============================================================
// FUNCIONES CRUD BÁSICAS DE USUARIO
// ============================================================

/* 1. LEER TODOS (GET) */
exports.getAllUsuarios = async (req, res) => {
  try {
    // Buscar todos los usuarios con sus relaciones (Persona y Perfil)
    const usuarios = await Usuario.findAll(baseFindOptions); // Adaptar y normalizar el formato de salida para cada usuario

    const usuariosAdaptados = usuarios.map((u) => adaptUsuario(u));

    res.setHeader("Cache-Control", "no-store"); // Prevenir cacheo en el cliente
    return res.status(200).json(usuariosAdaptados);
  } catch (error) {
    console.error("getAllUsuarios error:", error);
    return res.status(500).json({
      message: "Error al obtener usuarios",
      error: error.message,
    });
  }
};

/* 2. CREAR (POST) */
exports.createUsuario = async (req, res) => {
  const sequelize = Usuario.sequelize; // Iniciar una transacción para asegurar atomicidad (si falla algo, se deshace todo)
  const t = await sequelize.transaction();
  try {
    // 1. Preparar datos del Usuario
    const username = req.body.username || req.body.usuario;
    const password = req.body.contrasena || req.body.password;
    let id_persona = req.body.id_persona;
    const id_perfil = req.body.id_perfil;
    const estado = typeof req.body.estado !== "undefined" ? req.body.estado : 1; // 2. Preparar datos de la Persona (si no se proporciona id_persona)

    let {
      nombres,
      apellidos,
      correo,
      telefono,
      direccion,
      tipo_documento,
      numero_documento,
    } = req.body; // Normalización de campos nulos/vacíos para Persona

    tipo_documento = tipo_documento ?? "";
    numero_documento = numero_documento ?? "";
    nombres = nombres ?? "";
    apellidos = apellidos ?? "";
    correo = correo ?? "";
    telefono = telefono ?? null;
    direccion = direccion ?? null; // 3. Validar campos obligatorios

    if (!username || !password || !id_perfil) {
      // Si falta persona y no hay id_persona, fallar
      if (!id_persona && !(nombres && apellidos && correo)) {
        await t.rollback();
        return res.status(400).json({
          message:
            "Campos obligatorios incompletos (username/contrasena o id_persona, id_perfil).",
        });
      }
    } // 4. Manejo de Persona

    if (!id_persona) {
      // Si no hay id_persona, crear una nueva Persona
      const personaPayload = {
        nombres,
        apellidos,
        correo,
        telefono,
        direccion,
        tipo_documento,
        numero_documento,
        estado: req.body.persona_estado ?? 1,
      };

      const nuevaPersona = await Persona.create(personaPayload, {
        transaction: t, // Ejecutar dentro de la transacción
      });
      id_persona = nuevaPersona.id_persona;
    } else {
      // Si hay id_persona, verificar que exista
      const personaExistente = await Persona.findByPk(id_persona, {
        transaction: t,
      });
      if (!personaExistente) {
        await t.rollback();
        return res
          .status(400)
          .json({ message: "id_persona proporcionado no existe." });
      }
    } // 5. Verificar que el Perfil exista

    const perfilExistente = await Perfil.findByPk(id_perfil, {
      transaction: t,
    });
    if (!perfilExistente) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "id_perfil proporcionado no existe." });
    } // 6. Crear el Usuario

    const nuevoUsuario = await Usuario.create(
      {
        usuario: username,
        password: password,
        id_persona,
        id_perfil,
        estado,
      },
      { transaction: t } // Ejecutar dentro de la transacción
    ); // 7. Commit: confirmar todos los cambios si todo salió bien

    await t.commit(); // 8. Recuperar y devolver el usuario creado con sus relaciones

    const usuarioCreadoRaw = await Usuario.findByPk(
      nuevoUsuario.id_usuario,
      baseFindOptions
    );

    res.setHeader("Cache-Control", "no-store");
    return res.status(201).json(adaptUsuario(usuarioCreadoRaw));
  } catch (error) {
    // Rollback: deshacer todos los cambios si algo falló
    await t.rollback();
    console.error("createUsuario error:", error); // Manejo específico de errores de Sequelize

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Error de validación al crear persona/usuario.",
        details: error.errors.map((e) => ({
          path: e.path,
          message: e.message,
        })),
      });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Valor duplicado (usuario o id_persona/correo ya existe).",
        details: error.errors,
      });
    } // Error genérico

    return res.status(500).json({
      message: "Error al crear usuario",
      error: error.message,
    });
  }
};

/* 3. ACTUALIZAR (PUT) */
exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const sequelize = Usuario.sequelize;
  const t = await sequelize.transaction(); // Iniciar transacción
  try {
    // 1. Buscar el usuario existente
    const user = await Usuario.findByPk(id, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "Usuario no encontrado" });
    } // 2. Actualizar campos de Usuario

    const updatableFields = {
      usuario: req.body.username || req.body.usuario,
      password: req.body.contrasena || req.body.password,
      id_persona: req.body.id_persona,
      id_perfil: req.body.id_perfil,
      estado: req.body.estado,
    }; // Sobreescribir solo los campos que vienen definidos en el body

    Object.keys(updatableFields).forEach((key) => {
      if (typeof updatableFields[key] !== "undefined") {
        user[key] = updatableFields[key];
      }
    });

    await user.save({ transaction: t }); // Guardar cambios de Usuario // 3. Actualizar campos de Persona (si vienen en el body)

    const personaFields = {};
    if (Object.prototype.hasOwnProperty.call(req.body, "nombres"))
      personaFields.nombres = req.body.nombres;
    if (Object.prototype.hasOwnProperty.call(req.body, "apellidos"))
      personaFields.apellidos = req.body.apellidos;
    if (Object.prototype.hasOwnProperty.call(req.body, "correo"))
      personaFields.correo = req.body.correo;
    if (Object.prototype.hasOwnProperty.call(req.body, "telefono"))
      personaFields.telefono = req.body.telefono;
    if (Object.prototype.hasOwnProperty.call(req.body, "direccion"))
      personaFields.direccion = req.body.direccion;
    if (Object.prototype.hasOwnProperty.call(req.body, "tipo_documento"))
      personaFields.tipo_documento = req.body.tipo_documento;
    if (Object.prototype.hasOwnProperty.call(req.body, "numero_documento"))
      personaFields.numero_documento = req.body.numero_documento;

    if (Object.keys(personaFields).length > 0) {
      const personaId = user.id_persona;
      if (personaId) {
        // Actualizar la Persona asociada
        await Persona.update(personaFields, {
          where: { id_persona: personaId },
          transaction: t, // Dentro de la transacción
        });
      }
    }

    await t.commit(); // Confirmar cambios // 4. Devolver el usuario actualizado y normalizado

    const usuarioActualizadoRaw = await Usuario.findByPk(id, baseFindOptions);

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(adaptUsuario(usuarioActualizadoRaw));
  } catch (error) {
    await t.rollback();
    console.error("updateUsuario error:", error); // Manejo de errores específicos
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message:
          "Violación unique al actualizar (usuario o id_persona/correo ya existe).",
        details: error.errors,
      });
    }
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Error de validación al actualizar.",
        details: error.errors.map((e) => ({
          path: e.path,
          message: e.message,
        })),
      });
    }
    return res
      .status(500)
      .json({ message: "Error al actualizar usuario", error: error.message });
  }
};

/* 4. ELIMINAR (DELETE) */
exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    // Eliminar el usuario por ID
    const deletedRows = await Usuario.destroy({
      where: { id_usuario: id },
    });

    res.setHeader("Cache-Control", "no-store");

    if (deletedRows) {
      return res.status(204).send(); // Éxito, sin contenido
    } else {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("deleteUsuario error:", error);
    return res
      .status(500)
      .json({ message: "Error al eliminar usuario", error: error.message });
  }
};

// ============================================================
// FUNCIONES DE AUTENTICACIÓN Y RECUPERACIÓN
// ============================================================

/* 5. RECUPERAR CONTRASEÑA (Solicitud de enlace) */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Buscar la Persona por correo
    const persona = await Persona.findOne({ where: { correo: email } }); // Importante: Responder con éxito (200) incluso si no se encuentra el correo por seguridad

    if (!persona) {
      return res.status(200).json({
        message: "Procesado. Si el correo existe, el enlace será enviado.",
        recoveryLink: null,
      });
    } // 2. Buscar el Usuario asociado a esa Persona

    const user = await Usuario.findOne({
      where: { id_persona: persona.id_persona },
    });

    if (!user) {
      return res.status(200).json({
        message: "Procesado. Si el correo existe, el enlace será enviado.",
        recoveryLink: null,
      });
    } // 3. Generar token y tiempo de expiración

    const token = crypto.randomBytes(32).toString("hex"); // Token criptográfico
    const tokenExpiration = Date.now() + 3600000; // 1 hora de validez // 4. Guardar token y expiración en la base de datos

    user.resetPasswordToken = token;
    user.resetPasswordExpires = tokenExpiration;
    await user.save(); // 5. Crear el enlace de recuperación (en un entorno real, aquí se enviaría un email)

    const recoveryLink = `http://localhost:5173/reset-password?token=${token}&email=${email}`;

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      message: "Link generado con éxito.",
      recoveryLink: recoveryLink,
    });
  } catch (error) {
    console.error("forgotPassword error:", error);
    return res.status(500).json({
      message: "Error interno del servidor al procesar la solicitud.",
      error: error.message,
    });
  }
};

/* 6. RESETEAR CONTRASEÑA (Validar token y cambiar password) */
exports.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body; // 1. Validar datos de entrada

    if (!email || !token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos obligatorios: email, token o nueva contraseña.",
      });
    } // 2. Buscar la Persona y el Usuario asociados

    const persona = await Persona.findOne({ where: { correo: email } });
    if (!persona) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado.",
      });
    }
    const user = await Usuario.findOne({
      where: { id_persona: persona.id_persona },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado.",
      });
    } // 3. Validar el token

    if (user.resetPasswordToken !== token) {
      return res.status(400).json({
        success: false,
        message: "Token inválido.",
      });
    } // 4. Validar expiración

    if (Date.now() > user.resetPasswordExpires) {
      return res.status(400).json({
        success: false,
        message: "Token expirado.",
      });
    } // 5. Actualizar contraseña y limpiar campos de recuperación

    user.password = newPassword; // El hook de Sequelize se encargará de hashear
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Contraseña restablecida correctamente.",
    });
  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno al restablecer la contraseña.",
      error: error.message,
    });
  }
};
