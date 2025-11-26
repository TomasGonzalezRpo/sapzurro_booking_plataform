// backend/controllers/AuthController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Usuario, Persona, Perfil } = require("../models/index");
const emailService = require("../services/emailService");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Helper: construir payload de usuario
const buildUserPayload = (usuarioInstance) => {
  if (!usuarioInstance) return null;
  const persona = usuarioInstance.personaInfo || {};
  const perfil = usuarioInstance.perfil || {};
  return {
    id_usuario: usuarioInstance.id_usuario,
    username: usuarioInstance.usuario,
    id_perfil: usuarioInstance.id_perfil,
    rol: perfil.nombre || "Usuario",
    nombres: persona.nombres || "",
    apellidos: persona.apellidos || "",
    correo: persona.correo || "",
    estado: usuarioInstance.estado,
  };
};

/* =============== REGISTRO =============== */
exports.register = async (req, res) => {
  const sequelize = Usuario.sequelize;
  const t = await sequelize.transaction();
  try {
    console.log("AuthController.register payload:", req.body);

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
      id_tipo_persona,
    } = req.body;

    const plainPassword = password || contrasena;

    if (!usuario || !plainPassword || !nombres || !apellidos || !correo) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message:
          "Faltan campos obligatorios (usuario, contraseña, nombres, apellidos, correo).",
      });
    }

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
    }

    const existingPersona = await Persona.findOne({
      where: { correo },
      transaction: t,
    });
    if (existingPersona) {
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
    }

    let personaInstance = existingPersona;
    if (!personaInstance) {
      personaInstance = await Persona.create(
        {
          id_tipo_persona: id_tipo_persona || 1,
          nombres,
          apellidos,
          correo,
          telefono: telefono || null,
          direccion: direccion || null,
          tipo_documento: tipo_documento || "",
          numero_documento: numero_documento || "",
          estado: 1,
        },
        { transaction: t }
      );
    }

    // ✅ NO hashear aquí, el modelo lo hace en beforeCreate
    const nuevoUsuario = await Usuario.create(
      {
        usuario,
        password: plainPassword, // ← Enviar sin hashear
        id_persona: personaInstance.id_persona,
        id_perfil: id_perfil || 2,
        estado: 1,
        provider: "local",
      },
      { transaction: t }
    );

    await t.commit();

    const usuarioFull = await Usuario.findByPk(nuevoUsuario.id_usuario, {
      include: [
        { model: Persona, as: "personaInfo" },
        { model: Perfil, as: "perfil" },
      ],
      attributes: { exclude: ["password"] },
    });

    const payload = buildUserPayload(usuarioFull);

    const token = jwt.sign(
      { id_usuario: payload.id_usuario, username: payload.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      success: true,
      message: "Usuario creado correctamente",
      user: payload,
      token,
    });
  } catch (error) {
    await t.rollback();
    console.error("AuthController.register error:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
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
    const { correo, password, contrasena, usuario: usuarioInput } = req.body;
    const plainPassword = password || contrasena;
    const identifier =
      correo || usuarioInput || req.body.username || req.body.email;

    if (!identifier || !plainPassword) {
      return res
        .status(400)
        .json({ message: "Debe proporcionar correo/usuario y contraseña." });
    }

    console.log("🔐 Login intent - identifier:", identifier);

    // ✅ USAR SQL DIRECTO en lugar de Sequelize
    const sequelize = Usuario.sequelize;

    let query = `
      SELECT 
        u.id_usuario,
        u.usuario,
        u.contrasena as password,
        u.estado,
        u.id_persona,
        u.id_perfil,
        p.nombres,
        p.apellidos,
        p.correo,
        p.telefono,
        p.direccion,
        pf.nombre as rol
      FROM usuario u
      LEFT JOIN persona p ON u.id_persona = p.id_persona
      LEFT JOIN perfil pf ON u.id_perfil = pf.id_perfil
      WHERE u.usuario = ? OR p.correo = ?
      LIMIT 1
    `;

    const results = await sequelize.query(query, {
      replacements: [identifier, identifier],
      type: sequelize.QueryTypes.SELECT,
    });

    console.log("📊 Query results:", results);

    if (!results || results.length === 0) {
      console.log("❌ Usuario no encontrado:", identifier);
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    const usuario = results[0];
    console.log("✅ Usuario encontrado:", usuario.usuario);

    // Comparar contraseña
    const match = await bcrypt.compare(plainPassword, usuario.password);
    if (!match) {
      console.log("❌ Contraseña incorrecta para:", usuario.usuario);
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    if (usuario.estado !== 1) {
      console.log("❌ Usuario inactivo:", usuario.usuario);
      return res.status(403).json({ message: "Usuario inactivo." });
    }

    console.log("✅ Login exitoso para:", usuario.usuario);

    const payload = {
      id_usuario: usuario.id_usuario,
      username: usuario.usuario,
      id_perfil: usuario.id_perfil,
      rol: usuario.rol || "Usuario",
      nombres: usuario.nombres || "",
      apellidos: usuario.apellidos || "",
      correo: usuario.correo || "",
      estado: usuario.estado,
    };

    const token = jwt.sign(
      { id_usuario: payload.id_usuario, username: payload.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({ user: payload, token });
  } catch (error) {
    console.error("❌ AuthController.login error:", error);
    return res
      .status(500)
      .json({ message: "Error al autenticar", error: error.message });
  }
};

/* =============== REGISTRO ALIADO =============== */
exports.registerAliado = async (req, res) => {
  const sequelize = Usuario.sequelize;
  const t = await sequelize.transaction();
  try {
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
      id_tipo_persona,
      nombreNegocio,
      tipoNegocio,
      descripcionNegocio,
    } = req.body;

    const plainPassword = password || contrasena;

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
    }

    const userExists = await Usuario.findOne({
      where: { usuario },
      transaction: t,
    });
    if (userExists) {
      await t.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Nombre de usuario ya existe." });
    }

    const personaExist = await Persona.findOne({
      where: { correo },
      transaction: t,
    });
    if (personaExist) {
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
    }

    const nuevaPersona = await Persona.create(
      {
        id_tipo_persona: id_tipo_persona || 1,
        nombres,
        apellidos,
        correo,
        telefono: telefono || null,
        direccion: direccion || null,
        tipo_documento: tipo_documento || "",
        numero_documento: numero_documento || "",
        estado: 1,
      },
      { transaction: t }
    );

    // ✅ NO hashear aquí, el modelo lo hace en beforeCreate
    await Usuario.create(
      {
        usuario,
        password: plainPassword, // ← Enviar sin hashear
        id_persona: nuevaPersona.id_persona,
        id_perfil: 3,
        estado: 0,
        provider: "local",
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Solicitud de aliado enviada. Pendiente de aprobación.",
    });
  } catch (error) {
    await t.rollback();
    console.error("AuthController.registerAliado error:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
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
        .json({ success: false, message: "Email requerido" });

    const persona = await Persona.findOne({ where: { correo: email } });
    if (!persona) {
      return res.status(200).json({
        success: true,
        message:
          "Si existe una cuenta con ese correo, recibirás un enlace de recuperación.",
      });
    }

    const usuario = await Usuario.findOne({
      where: { id_persona: persona.id_persona },
      include: [{ model: Persona, as: "personaInfo" }],
    });

    if (!usuario) {
      return res.status(200).json({
        success: true,
        message:
          "Si existe una cuenta con ese correo, recibirás un enlace de recuperación.",
      });
    }

    // Generar token de recuperación
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const expires = Date.now() + 60 * 60 * 1000;

    usuario.resetPasswordToken = hashedToken;
    usuario.resetPasswordExpires = expires;
    await usuario.save();

    // Construir enlace de recuperación
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    const recoveryLink = `${FRONTEND_URL}/reset-password?token=${rawToken}&email=${encodeURIComponent(
      email
    )}`;

    // 📧 ENVIAR CORREO DESDE BACKEND
    try {
      const userName =
        usuario.personaInfo?.nombres || usuario.usuario || "Usuario";
      await emailService.sendRecoveryEmail(email, recoveryLink, userName);
      console.log("✅ Correo de recuperación enviado a:", email);
    } catch (emailError) {
      console.error("⚠️ Error enviando correo:", emailError.message);
    }

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
    const { token, email, newPassword } = req.body;
    if (!token || !email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos (token, email, newPassword).",
      });
    }

    const persona = await Persona.findOne({ where: { correo: email } });
    if (!persona) {
      return res
        .status(400)
        .json({ success: false, message: "Token inválido o expirado." });
    }

    const usuario = await Usuario.findOne({
      where: { id_persona: persona.id_persona },
      include: [{ model: Persona, as: "personaInfo" }],
    });

    if (!usuario || !usuario.resetPasswordToken) {
      return res
        .status(400)
        .json({ success: false, message: "Token inválido o expirado." });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    if (hashedToken !== usuario.resetPasswordToken) {
      return res
        .status(400)
        .json({ success: false, message: "Token inválido." });
    }

    if (
      !usuario.resetPasswordExpires ||
      Date.now() > Number(usuario.resetPasswordExpires)
    ) {
      usuario.resetPasswordToken = null;
      usuario.resetPasswordExpires = null;
      await usuario.save();
      return res
        .status(400)
        .json({ success: false, message: "Token expirado." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    usuario.password = hashedPassword;
    usuario.resetPasswordToken = null;
    usuario.resetPasswordExpires = null;
    await usuario.save();

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
