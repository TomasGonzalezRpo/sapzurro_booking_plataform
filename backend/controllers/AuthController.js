// backend/controllers/AuthController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Usuario, Persona, Perfil } = require("../models/index");
const emailService = require("../services/emailService");

// ✅ Configuración de Seguridad
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Helper: construir payload de usuario para consistencia entre Login y Registro
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

    // Validar si el nombre de usuario ya existe
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

    // Validar si la persona/correo ya existe
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
        { transaction: t },
      );
    }

    console.log(`📝 Registrando usuario: ${usuario} con password plana.`);

    const nuevoUsuario = await Usuario.create(
      {
        usuario,
        password: plainPassword, // El modelo se encarga del hasheo en beforeCreate
        id_persona: personaInstance.id_persona,
        id_perfil: id_perfil || 2,
        estado: 1,
        provider: "local",
      },
      { transaction: t },
    );

    await t.commit();

    // Recuperar usuario con asociaciones para el payload
    const usuarioFull = await Usuario.findByPk(nuevoUsuario.id_usuario, {
      include: [
        { model: Persona, as: "personaInfo" },
        { model: Perfil, as: "perfil" },
      ],
      attributes: { exclude: ["password", "contrasena"] },
    });

    const payload = buildUserPayload(usuarioFull);
    const token = jwt.sign(
      { id_usuario: payload.id_usuario, username: payload.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    return res.status(201).json({
      success: true,
      message: "Usuario creado correctamente",
      user: payload,
      token,
    });
  } catch (error) {
    if (t) await t.rollback();
    console.error("❌ AuthController.register error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error al crear usuario.",
    });
  }
};

/* =============== LOGIN (CON DEPURACIÓN) =============== */
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

    console.log("\n--- 🔐 INICIO PROCESO LOGIN ---");
    console.log("🔍 Identificador:", identifier);

    const sequelize = Usuario.sequelize;
    // Seleccionamos contrasena as password_hash para manejar el alias correctamente
    let query = `
      SELECT 
        u.id_usuario, u.usuario, u.contrasena as password_hash, 
        u.estado, u.id_persona, u.id_perfil,
        p.nombres, p.apellidos, p.correo,
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

    if (!results || results.length === 0) {
      console.log("❌ Usuario no encontrado en DB.");
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    const usuario = results[0];

    // 🛑 BLOQUE DE DEPURACIÓN (Mantenido según tu solicitud)
    console.log("---------------------------------");
    console.log("🔑 Password enviada (texto plano):", plainPassword);
    console.log("📦 Hash recuperado de DB:", usuario.password_hash);
    console.log("---------------------------------");

    // Comparar contra el hash usando bcrypt
    const match = await bcrypt.compare(
      plainPassword,
      usuario.password_hash || "",
    );

    if (!match) {
      console.log("❌ FALLÓ BCRYPT: La contraseña no coincide con el hash.");
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    if (usuario.estado !== 1) {
      console.log("❌ Usuario inactivo.");
      return res.status(403).json({ message: "Usuario inactivo." });
    }

    const payload = {
      id_usuario: usuario.id_usuario,
      username: usuario.usuario,
      id_perfil: usuario.id_perfil,
      rol: usuario.rol || "Usuario",
      nombres: usuario.nombres || "",
      correo: usuario.correo || "",
    };

    const token = jwt.sign(
      { id_usuario: payload.id_usuario, username: payload.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    console.log("✅ Login exitoso para:", usuario.usuario);
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
      nombreNegocio,
    } = req.body;
    const plainPassword = password || contrasena;

    if (!usuario || !plainPassword || !nombres || !correo || !nombreNegocio) {
      await t.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Faltan campos obligatorios." });
    }

    const nuevaPersona = await Persona.create(
      { nombres, apellidos, correo, estado: 1, id_tipo_persona: 1 },
      { transaction: t },
    );

    await Usuario.create(
      {
        usuario,
        password: plainPassword,
        id_persona: nuevaPersona.id_persona,
        id_perfil: 3, // Perfil Aliado
        estado: 0, // Inicia inactivo hasta aprobación
        provider: "local",
      },
      { transaction: t },
    );

    await t.commit();
    return res
      .status(201)
      .json({ success: true, message: "Solicitud enviada correctamente." });
  } catch (error) {
    if (t) await t.rollback();
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* =============== RECUPERACIÓN =============== */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const persona = await Persona.findOne({ where: { correo: email } });

    if (!persona) {
      return res.status(200).json({
        success: true,
        message: "Si el correo existe, recibirás un enlace.",
      });
    }

    const usuario = await Usuario.findOne({
      where: { id_persona: persona.id_persona },
    });
    if (!usuario)
      return res
        .status(200)
        .json({ success: true, message: "Instrucciones enviadas." });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    usuario.resetPasswordToken = hashedToken;
    usuario.resetPasswordExpires = Date.now() + 3600000; // 1 hora de validez
    await usuario.save();

    const recoveryLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${rawToken}&email=${email}`;
    await emailService.sendRecoveryEmail(
      email,
      recoveryLink,
      persona.nombres || usuario.usuario,
    );

    return res
      .status(200)
      .json({ success: true, message: "Correo enviado correctamente." });
  } catch (error) {
    console.error("❌ ForgotPassword error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error al generar enlace." });
  }
};

/* =============== RESTABLECER =============== */
exports.resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const persona = await Persona.findOne({ where: { correo: email } });
    const usuario = await Usuario.findOne({
      where: {
        id_persona: persona?.id_persona,
        resetPasswordToken: hashedToken,
      },
    });

    if (
      !usuario ||
      !usuario.resetPasswordExpires ||
      usuario.resetPasswordExpires < Date.now()
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Token inválido o expirado." });
    }

    // Hasheamos manualmente aquí para asegurar la actualización directa
    usuario.password = newPassword;
    usuario.resetPasswordToken = null;
    usuario.resetPasswordExpires = null;
    await usuario.save();

    return res.status(200).json({
      success: true,
      message: "Contraseña actualizada correctamente.",
    });
  } catch (error) {
    console.error("❌ ResetPassword error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error al restablecer la contraseña." });
  }
};
