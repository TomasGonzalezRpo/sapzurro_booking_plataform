const { Usuario, Persona, Perfil } = require("../models/index");
const crypto = require("crypto");

// Opciones reutilizables para incluir relaciones y excluir password
const baseFindOptions = {
  include: [
    { model: Persona, as: "personaInfo" },
    { model: Perfil, as: "perfil" },
  ],
  attributes: { exclude: ["password"] },
};

// 1. LEER TODOS (GET)
exports.getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      include: [
        { model: Persona, as: "personaInfo" },
        { model: Perfil, as: "perfil" },
      ],
      attributes: { exclude: ["password"] },
    });

    // Transformar formato para frontend (username, nombres, apellidos, correo, rol)
    const usuariosAdaptados = usuarios.map((u) => ({
      id_usuario: u.id_usuario,
      username: u.usuario,
      nombres: u.personaInfo?.nombres || "",
      apellidos: u.personaInfo?.apellidos || "",
      correo: u.personaInfo?.correo || "",
      id_perfil: u.id_perfil,
      rol: u.perfil?.nombre || "Desconocido",
      provider: "local",
      estado: u.estado,
    }));

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(usuariosAdaptados);
  } catch (error) {
    console.error("getAllUsuarios error:", error);
    return res.status(500).json({
      message: "Error al obtener usuarios",
      error: error.message,
    });
  }
};

// 2. CREAR (POST) - versión defensiva con logging y valores por defecto no nulos
exports.createUsuario = async (req, res) => {
  const sequelize = Usuario.sequelize;
  const t = await sequelize.transaction();
  try {
    // Compatibilidad de nombres: frontend puede enviar username/contrasena
    const username = req.body.username || req.body.usuario;
    const password = req.body.contrasena || req.body.password;
    let id_persona = req.body.id_persona;
    const id_perfil = req.body.id_perfil;
    const estado = typeof req.body.estado !== "undefined" ? req.body.estado : 1;

    // Campos de persona potenciales
    let {
      nombres,
      apellidos,
      correo,
      telefono,
      direccion,
      tipo_documento,
      numero_documento,
    } = req.body;

    // --- Forzar valores NO NULL explícitamente para evitar notNull Violation ---
    // Si vienen null o undefined, los convertimos a string vacío (o a null cuando corresponda)
    tipo_documento =
      tipo_documento === undefined || tipo_documento === null
        ? ""
        : tipo_documento;
    numero_documento =
      numero_documento === undefined || numero_documento === null
        ? ""
        : numero_documento;
    nombres = nombres === undefined || nombres === null ? "" : nombres;
    apellidos = apellidos === undefined || apellidos === null ? "" : apellidos;
    correo = correo === undefined || correo === null ? "" : correo;
    telefono = telefono === undefined ? null : telefono;
    direccion = direccion === undefined ? null : direccion;

    // LOG para depuración: muestra lo que recibimos y los valores que usaremos para crear Persona
    console.log("createUsuario - req.body:", {
      username,
      password: password ? "[REDACTED]" : password,
      id_persona,
      id_perfil,
      estado,
      nombres,
      apellidos,
      correo,
      tipo_documento,
      numero_documento,
    });

    // Validación mínima: necesitamos username, password y id_perfil (o datos de persona para crearla)
    if (!username || !password || !id_perfil) {
      if (!id_persona && !(nombres && apellidos && correo)) {
        await t.rollback();
        return res.status(400).json({
          message:
            "Campos obligatorios incompletos (username/contrasena o id_persona, id_perfil).",
        });
      }
    }

    // Si no se proporcionó id_persona, crear persona nueva con valores no nulos por defecto
    if (!id_persona) {
      // Antes de crear: mostrar payload exacto que vamos a enviar a Persona.create
      const personaPayload = {
        nombres,
        apellidos,
        correo,
        telefono,
        direccion,
        tipo_documento,
        numero_documento,
        estado:
          typeof req.body.persona_estado !== "undefined"
            ? req.body.persona_estado
            : 1,
      };
      console.log(
        "createUsuario - creando Persona con payload:",
        personaPayload
      );

      const nuevaPersona = await Persona.create(personaPayload, {
        transaction: t,
      });
      id_persona = nuevaPersona.id_persona;
    } else {
      // Verificar que la persona proporcionada exista
      const personaExistente = await Persona.findByPk(id_persona);
      if (!personaExistente) {
        await t.rollback();
        return res
          .status(400)
          .json({ message: "id_persona proporcionado no existe." });
      }
    }

    // Verificar que el perfil exista
    const perfilExistente = await Perfil.findByPk(id_perfil);
    if (!perfilExistente) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "id_perfil proporcionado no existe." });
    }

    // Crear el usuario
    const nuevoUsuario = await Usuario.create(
      {
        usuario: username,
        password: password,
        id_persona,
        id_perfil,
        estado,
      },
      { transaction: t }
    );

    await t.commit();

    // Recuperar usuario con relaciones para devolver al frontend
    const usuarioCreado = await Usuario.findByPk(
      nuevoUsuario.id_usuario,
      baseFindOptions
    );

    res.setHeader("Cache-Control", "no-store");
    return res.status(201).json(usuarioCreado);
  } catch (error) {
    await t.rollback();
    console.error("createUsuario error:", error);

    // Devolver detalles de validación al frontend para depurar
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Error de validación al crear persona/usuario.",
        details: error.errors.map((e) => ({
          path: e.path,
          message: e.message,
        })),
      });
    }

    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        message: "FK inválida: id_persona o id_perfil no existen.",
        error: error.message,
      });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Valor duplicado (usuario o id_persona ya existe).",
        details: error.errors,
      });
    }

    return res.status(500).json({
      message: "Error al crear usuario",
      error: error.message,
    });
  }
};

// 3. ACTUALIZAR (PUT)
exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const sequelize = Usuario.sequelize;
  const t = await sequelize.transaction();
  try {
    const user = await Usuario.findByPk(id, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Mapear campos del frontend a los nombres de columna del modelo
    const updatableFields = {
      usuario: req.body.username || req.body.usuario,
      password: req.body.contrasena || req.body.password,
      id_persona: req.body.id_persona,
      id_perfil: req.body.id_perfil,
      estado:
        typeof req.body.estado !== "undefined" ? req.body.estado : undefined,
    };

    // Aplicar cambios solo a campos presentes
    Object.keys(updatableFields).forEach((key) => {
      if (typeof updatableFields[key] !== "undefined") {
        user[key] = updatableFields[key];
      }
    });

    // Guardar user (dispara hooks si existen)
    await user.save({ transaction: t });

    // Actualizar persona asociada si vienen campos
    const personaFields = {};
    if (typeof req.body.nombres !== "undefined")
      personaFields.nombres = req.body.nombres;
    if (typeof req.body.apellidos !== "undefined")
      personaFields.apellidos = req.body.apellidos;
    if (typeof req.body.correo !== "undefined")
      personaFields.correo = req.body.correo;
    if (typeof req.body.telefono !== "undefined")
      personaFields.telefono = req.body.telefono;
    if (typeof req.body.direccion !== "undefined")
      personaFields.direccion = req.body.direccion;
    if (typeof req.body.tipo_documento !== "undefined")
      personaFields.tipo_documento = req.body.tipo_documento;
    if (typeof req.body.numero_documento !== "undefined")
      personaFields.numero_documento = req.body.numero_documento;

    if (Object.keys(personaFields).length > 0) {
      const personaId = user.id_persona;
      if (personaId) {
        await Persona.update(personaFields, {
          where: { id_persona: personaId },
          transaction: t,
        });
      }
    }

    await t.commit();

    const usuarioActualizado = await Usuario.findByPk(id, baseFindOptions);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(usuarioActualizado);
  } catch (error) {
    await t.rollback();
    console.error("updateUsuario error:", error);
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        message: "FK inválida al actualizar (id_persona / id_perfil).",
        error: error.message,
      });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message:
          "Violación unique al actualizar (usuario o id_persona ya existe).",
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

// 4. ELIMINAR (DELETE)
exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRows = await Usuario.destroy({
      where: { id_usuario: id },
    });

    res.setHeader("Cache-Control", "no-store");

    if (deletedRows) {
      return res.status(204).send();
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

// 5. RECUPERAR CONTRASEÑA
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const persona = await Persona.findOne({ where: { correo: email } });

    if (!persona) {
      return res.status(200).json({
        message: "Procesado. Si el correo existe, el enlace será enviado.",
        recoveryLink: null,
      });
    }

    const user = await Usuario.findOne({
      where: { id_persona: persona.id_persona },
    });

    if (!user) {
      return res.status(200).json({
        message: "Procesado. Si el correo existe, el enlace será enviado.",
        recoveryLink: null,
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiration = Date.now() + 3600000;

    user.resetPasswordToken = token;
    user.resetPasswordExpires = tokenExpiration;
    await user.save();

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
