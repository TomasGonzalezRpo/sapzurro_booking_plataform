// backend/controllers/AuthController.js
const bcrypt = require("bcrypt"); // Para encriptar contraseñas
const jwt = require("jsonwebtoken"); // Para generar tokens
const crypto = require("crypto"); // Para generar tokens seguros
const { Usuario, Persona, Perfil } = require("../models/index"); // Importamos los modelos
const emailService = require("../services/emailService"); // Para enviar correos

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret"; // El secreto para JWT
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"; // Tiempo de expiración del token

// Función para armar el objeto de usuario que se devuelve al frontend
const buildUserPayload = (usuarioInstance) => {
  if (!usuarioInstance) return null; // Si no hay usuario, devolver null
  const persona = usuarioInstance.personaInfo || {};
  const perfil = usuarioInstance.perfil || {};
  return {
    id_usuario: usuarioInstance.id_usuario,
    username: usuarioInstance.usuario,
    id_perfil: usuarioInstance.id_perfil,
    rol: perfil.nombre || "Usuario", // Nombre del perfil o rol
    nombres: persona.nombres || "",
    apellidos: persona.apellidos || "",
    correo: persona.correo || "",
    estado: usuarioInstance.estado,
  };
};

/* =============== REGISTRO =============== */
exports.register = async (req, res) => {
  const sequelize = Usuario.sequelize;
  const t = await sequelize.transaction(); // Iniciamos una transacción para que todo vaya junto
  try {
    console.log("AuthController.register payload:", req.body); // Ver lo que llegó // Desestructuramos los datos del body

    const {
      usuario,
      password,
      contrasena,
      nombres,
      apellidos,
      correo,
      telefono,
      direccion,
      tipo_documento,
      numero_documento,
      id_perfil,
    } = req.body;

    const plainPassword = password || contrasena; // Aceptar 'password' o 'contrasena' // Validamos que los campos obligatorios existan

    if (!usuario || !plainPassword || !nombres || !apellidos || !correo) {
      await t.rollback(); // Deshacer si falta algo
      return res.status(400).json({
        success: false,
        message:
          "Faltan campos obligatorios (usuario, contraseña, nombres, apellidos, correo).",
      });
    } // 1. Verificar si el nombre de usuario ya existe

    const existingUser = await Usuario.findOne({
      where: { usuario },
      transaction: t,
    });
    if (existingUser) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "El nombre de usuario ya está en uso.",
      });
    } // 2. Verificar si ya existe una persona con ese correo

    const existingPersona = await Persona.findOne({
      where: { correo },
      transaction: t,
    });
    if (existingPersona) {
      // Revisar si esa persona ya tiene un usuario asociado
      const usuarioRelacionado = await Usuario.findOne({
        where: { id_persona: existingPersona.id_persona },
        transaction: t,
      });
      if (usuarioRelacionado) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "Ya existe un usuario asociado a ese correo.",
        });
      }
    } // 3. Crear la Persona si no existe (o usar la existente)

    let personaInstance = existingPersona;
    if (!personaInstance) {
      personaInstance = await Persona.create(
        {
          nombres,
          apellidos,
          correo,
          telefono: telefono || null,
          direccion: direccion || null,
          tipo_documento: tipo_documento || "",
          numero_documento: numero_documento || "",
          estado: 1, // Persona activa
        },
        { transaction: t }
      );
    } // Encriptamos la contraseña

    const hashed = await bcrypt.hash(plainPassword, 10); // 4. Crear el Usuario

    const nuevoUsuario = await Usuario.create(
      {
        usuario,
        password: hashed,
        id_persona: personaInstance.id_persona,
        id_perfil: id_perfil || 2, // Por defecto, perfil 2 (cliente/usuario)
        estado: 1, // Usuario activo
        provider: "local", // Indica que se registró localmente
      },
      { transaction: t }
    );

    await t.commit(); // Confirmamos la transacción // 5. Buscar el usuario recién creado con toda la información

    const usuarioFull = await Usuario.findByPk(nuevoUsuario.id_usuario, {
      include: [
        { model: Persona, as: "personaInfo" },
        { model: Perfil, as: "perfil" },
      ],
      attributes: { exclude: ["password"] }, // No devolver el hash de la contraseña
    });

    const payload = buildUserPayload(usuarioFull); // Creamos el objeto de respuesta // Generamos el Token
    const token = jwt.sign(
      { id_usuario: payload.id_usuario, username: payload.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    ); // Respuesta de éxito

    return res.status(201).json({
      success: true,
      message: "Usuario creado correctamente",
      user: payload,
      token,
    });
  } catch (error) {
    await t.rollback(); // Deshacemos la transacción si hay error
    console.error("AuthController.register error:", error); // Imprimir el error
    if (error.name === "SequelizeUniqueConstraintError") {
      // Manejar errores de campos duplicados (ej: usuario duplicado)
      const msg =
        error.errors?.map((e) => e.message).join("; ") || "Valor duplicado";
      return res.status(400).json({ success: false, message: msg });
    }
    return res.status(500).json({
      success: false,
      message: error?.message || "Error interno al crear usuario.",
    });
  }
};

/* =============== LOGIN =============== */
exports.login = async (req, res) => {
  try {
    // Obtenemos datos del body
    const { correo, password, contrasena, usuario: usuarioInput } = req.body;
    const plainPassword = password || contrasena; // El identificador puede ser correo o nombre de usuario
    const identifier =
      correo || usuarioInput || req.body.username || req.body.email; // Validamos que hayan enviado los datos necesarios

    if (!identifier || !plainPassword) {
      return res
        .status(400)
        .json({ message: "Debe proporcionar correo/usuario y contraseña." });
    }

    let usuario = null;
    if (correo) {
      // Buscar primero por correo
      const persona = await Persona.findOne({ where: { correo } });
      if (persona) {
        // Si existe la persona, buscar su usuario asociado con sus datos de perfil
        usuario = await Usuario.findOne({
          where: { id_persona: persona.id_persona },
          include: [
            { model: Persona, as: "personaInfo" },
            { model: Perfil, as: "perfil" },
          ],
        });
      }
    } // Si no se encontró por correo, intentar buscar por nombre de usuario

    if (!usuario) {
      usuario = await Usuario.findOne({
        where: { usuario: identifier },
        include: [
          { model: Persona, as: "personaInfo" },
          { model: Perfil, as: "perfil" },
        ],
      });
    }

    if (!usuario) {
      // Si no se encuentra el usuario, credenciales inválidas
      return res.status(400).json({ message: "Credenciales inválidas." });
    } // Comparar la contraseña ingresada con el hash guardado

    const match = await bcrypt.compare(plainPassword, usuario.password);
    if (!match) {
      // Si no coinciden, contraseña incorrecta
      return res.status(401).json({ message: "Contraseña incorrecta." });
    } // Verificar si el usuario está activo (estado = 1)

    if (usuario.estado !== 1) {
      return res.status(403).json({ message: "Usuario inactivo." });
    } // Construir payload y generar token

    const payload = buildUserPayload(usuario);
    const token = jwt.sign(
      { id_usuario: payload.id_usuario, username: payload.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    ); // Respuesta exitosa con datos de usuario y token

    return res.status(200).json({ user: payload, token });
  } catch (error) {
    console.error("AuthController.login error:", error); // Imprimir error
    return res
      .status(500)
      .json({ message: "Error al autenticar", error: error.message });
  }
};

/* =============== REGISTRO ALIADO =============== */
exports.registerAliado = async (req, res) => {
  const sequelize = Usuario.sequelize;
  const t = await sequelize.transaction(); // Iniciar transacción
  try {
    // Obtener datos del aliado
    const {
      usuario,
      password,
      contrasena,
      nombres,
      apellidos,
      correo,
      telefono,
      direccion,
      tipo_documento,
      numero_documento,
      nombreNegocio,
      tipoNegocio,
      descripcionNegocio,
    } = req.body;

    const plainPassword = password || contrasena; // Validar campos obligatorios para el registro de aliado

    if (
      !usuario ||
      !plainPassword ||
      !nombres ||
      !apellidos ||
      !correo ||
      !nombreNegocio ||
      !tipoNegocio
    ) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios para registro de aliado.",
      });
    } // 1. Verificar nombre de usuario

    const userExists = await Usuario.findOne({
      where: { usuario },
      transaction: t,
    });
    if (userExists) {
      await t.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Nombre de usuario ya existe." });
    } // 2. Verificar correo

    const personaExist = await Persona.findOne({
      where: { correo },
      transaction: t,
    });
    if (personaExist) {
      // Si existe la persona, verificar que no tenga usuario activo
      const usuarioRelacionado = await Usuario.findOne({
        where: { id_persona: personaExist.id_persona },
        transaction: t,
      });
      if (usuarioRelacionado) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "Ya existe un usuario asociado a ese correo.",
        });
      }
    } // 3. Crear el registro de Persona

    const nuevaPersona = await Persona.create(
      {
        nombres,
        apellidos,
        correo,
        telefono: telefono || null,
        direccion: direccion || null,
        tipo_documento: tipo_documento || "",
        numero_documento: numero_documento || "",
        estado: 1, // Persona activa
      },
      { transaction: t }
    ); // Encriptar la contraseña

    const hashed = await bcrypt.hash(plainPassword, 10); // 4. Crear el Usuario para el aliado

    await Usuario.create(
      {
        usuario,
        password: hashed,
        id_persona: nuevaPersona.id_persona,
        id_perfil: 3, // Perfil 3 es para Aliados
        estado: 0, // Estado 0: Pendiente de aprobación
        provider: "local",
      },
      { transaction: t }
    );

    // Aquí iría la lógica para guardar la info del negocio (se omite si no hay un modelo Negocio)

    await t.commit(); // Confirmamos la transacción // Respuesta de éxito (pendiente de aprobación)

    return res.status(201).json({
      success: true,
      message: "Solicitud de aliado enviada. Pendiente de aprobación.",
    });
  } catch (error) {
    await t.rollback(); // Deshacemos la transacción
    console.error("AuthController.registerAliado error:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      // Error de duplicidad
      const msg =
        error.errors?.map((e) => e.message).join("; ") || "Valor duplicado";
      return res.status(400).json({ success: false, message: msg });
    }
    return res.status(500).json({
      success: false,
      message: error.message || "Error al registrar aliado",
    });
  }
};

/* =============== RECUPERACIÓN DE CONTRASEÑA =============== */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email requerido" }); // Buscar si existe una persona con ese correo

    const persona = await Persona.findOne({ where: { correo: email } });
    if (!persona) {
      // Responder siempre con éxito (para no dar pistas sobre emails existentes)
      return res.status(200).json({
        success: true,
        message:
          "Si existe una cuenta con ese correo, recibirás un enlace de recuperación.",
      });
    } // Buscar el usuario asociado a esa persona

    const usuario = await Usuario.findOne({
      where: { id_persona: persona.id_persona },
      include: [{ model: Persona, as: "personaInfo" }],
    });

    if (!usuario) {
      // Responder con éxito si no hay usuario (caso borde)
      return res.status(200).json({
        success: true,
        message:
          "Si existe una cuenta con ese correo, recibirás un enlace de recuperación.",
      });
    } // Generar un token de recuperación aleatorio

    const rawToken = crypto.randomBytes(32).toString("hex"); // Hashear el token antes de guardarlo en la base de datos
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const expires = Date.now() + 60 * 60 * 1000; // Expira en 1 hora // Guardar el token hasheado y la expiración en el usuario

    usuario.resetPasswordToken = hashedToken;
    usuario.resetPasswordExpires = expires;
    await usuario.save(); // Construir el enlace que se enviará por correo

    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    const recoveryLink = `${FRONTEND_URL}/reset-password?token=${rawToken}&email=${encodeURIComponent(
      email
    )}`; // Llamar al servicio de correo para enviar el email

    try {
      const userName =
        usuario.personaInfo?.nombres || usuario.usuario || "Usuario";
      await emailService.sendRecoveryEmail(email, recoveryLink, userName);
      console.log("✅ Correo de recuperación enviado a:", email);
    } catch (emailError) {
      console.error("⚠️ Error enviando correo:", emailError.message);
    } // Respuesta final (siempre positiva)

    return res.status(200).json({
      success: true,
      message:
        "Si la cuenta existe, recibirás un correo con instrucciones de recuperación.",
    });
  } catch (error) {
    console.error("AuthController.forgotPassword error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error interno al generar enlace" });
  }
};

/* =============== RESTABLECER CONTRASEÑA =============== */
exports.resetPassword = async (req, res) => {
  try {
    // Obtener los datos del body
    const { token, email, newPassword } = req.body;
    if (!token || !email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos (token, email, newPassword).",
      });
    } // 1. Buscar la persona por email

    const persona = await Persona.findOne({ where: { correo: email } });
    if (!persona) {
      return res
        .status(400)
        .json({ success: false, message: "Token inválido o expirado." });
    } // 2. Buscar el usuario asociado

    const usuario = await Usuario.findOne({
      where: { id_persona: persona.id_persona },
      include: [{ model: Persona, as: "personaInfo" }],
    }); // 3. Verificar si el usuario tiene un token de recuperación

    if (!usuario || !usuario.resetPasswordToken) {
      return res
        .status(400)
        .json({ success: false, message: "Token inválido o expirado." });
    } // 4. Hashear el token recibido para compararlo con el guardado

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    if (hashedToken !== usuario.resetPasswordToken) {
      return res
        .status(400)
        .json({ success: false, message: "Token inválido." });
    } // 5. Verificar si el token ha expirado

    if (
      !usuario.resetPasswordExpires ||
      Date.now() > Number(usuario.resetPasswordExpires)
    ) {
      // Limpiar token expirado y notificar
      usuario.resetPasswordToken = null;
      usuario.resetPasswordExpires = null;
      await usuario.save();
      return res
        .status(400)
        .json({ success: false, message: "Token expirado." });
    } // 6. Si todo está OK, encriptar y actualizar la nueva contraseña

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    usuario.password = hashedPassword; // Limpiar el token y la fecha de expiración
    usuario.resetPasswordToken = null;
    usuario.resetPasswordExpires = null;
    await usuario.save(); // Respuesta de éxito

    return res.status(200).json({
      success: true,
      message: "Contraseña restablecida correctamente.",
    });
  } catch (error) {
    console.error("AuthController.resetPassword error:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno al restablecer contraseña.",
    });
  }
};
