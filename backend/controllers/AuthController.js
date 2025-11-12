// backend/controllers/AuthController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Usuario, Persona, Perfil } = require("../models/index");

// Carga SECRET desde env
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"; // opcional

// Helper: construir payload de usuario (lo que devolveremos al frontend)
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

// POST /api/auth/register
exports.register = async (req, res) => {
  const sequelize = Usuario.sequelize;
  const t = await sequelize.transaction();
  try {
    const {
      usuario, // username
      password, // posible nombre
      contrasena, // posible nombre alterno
      nombres,
      apellidos,
      correo,
      telefono,
      direccion,
      id_perfil, // opcional (si no viene, 2)
    } = req.body;

    // aceptar password o contrasena
    const plainPassword = password || contrasena;

    // validaciones básicas
    if (!usuario || !plainPassword || !nombres || !apellidos || !correo) {
      await t.rollback();
      return res.status(400).json({
        message:
          "Faltan campos obligatorios (usuario, password/contrasena, nombres, apellidos, correo).",
      });
    }

    // proteger contra duplicados: usuario o persona con mismo correo
    const existingUser = await Usuario.findOne({ where: { usuario } });
    if (existingUser) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "El nombre de usuario ya está en uso." });
    }

    const existingPersona = await Persona.findOne({ where: { correo } });
    if (existingPersona) {
      // si existe persona con ese correo, podemos tomar su id_persona (si ya hay usuario asociado, error)
      const usuarioRelacionado = await Usuario.findOne({
        where: { id_persona: existingPersona.id_persona },
      });
      if (usuarioRelacionado) {
        await t.rollback();
        return res
          .status(400)
          .json({ message: "Ya existe un usuario asociado a ese correo." });
      }
      // usaremos existingPersona.id_persona
    }

    // 1) Crear/obtener Persona
    let id_persona_final;
    const personaExist = await Persona.findOne({ where: { correo } });
    if (personaExist) {
      id_persona_final = personaExist.id_persona;
    } else {
      const personaPayload = {
        nombres,
        apellidos,
        correo,
        telefono: telefono || null,
        direccion: direccion || null,
        // Si tu modelo Persona exige tipo_documento y numero_documento NOT NULL,
        // puedes rellenarlos con empty strings o pedirlos en el frontend.
        tipo_documento: req.body.tipo_documento || "",
        numero_documento: req.body.numero_documento || "",
        estado: 1,
      };
      const nuevaPersona = await Persona.create(personaPayload, {
        transaction: t,
      });
      id_persona_final = nuevaPersona.id_persona;
    }

    // 2) Crear Usuario (hash password) -> guardamos en campo `contrasena`
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(plainPassword, salt);

    const usuarioPayload = {
      usuario,
      // aquí usamos 'contrasena' (es la columna que tienes en la DB)
      contrasena: hashed,
      id_persona: id_persona_final,
      id_perfil: id_perfil || 2,
      estado: 1,
    };

    const nuevoUsuario = await Usuario.create(usuarioPayload, {
      transaction: t,
    });

    await t.commit();

    // cargar relaciones para devolver datos
    const usuarioFull = await Usuario.findByPk(nuevoUsuario.id_usuario, {
      include: [
        { model: Persona, as: "personaInfo" },
        { model: Perfil, as: "perfil" },
      ],
      // Excluir contrasena/ password por seguridad
      attributes: { exclude: ["contrasena", "password"] },
    });

    const payload = buildUserPayload(usuarioFull);

    // opcional: generar token
    const token = jwt.sign(
      { id_usuario: payload.id_usuario, username: payload.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({ user: payload, token });
  } catch (error) {
    await t.rollback();
    console.error("AuthController.register error:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ message: "Valor duplicado", details: error.errors });
    }
    return res
      .status(500)
      .json({ message: "Error al registrar usuario", error: error.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    // Aceptar tanto 'correo' como 'usuario' en el mismo campo de input del frontend.
    // Y aceptar 'password' o 'contrasena' como nombre de campo de la contraseña.
    const { correo, password, contrasena, usuario: usuarioInput } = req.body;
    const plainPassword = password || contrasena;
    const identifier =
      correo || usuarioInput || req.body.username || req.body.email;

    if (!identifier || !plainPassword) {
      return res
        .status(400)
        .json({ message: "Debe proporcionar correo/usuario y contraseña." });
    }

    // 1) Si se proporcionó correo, buscar Persona -> Usuario por id_persona
    let usuario = null;
    if (correo) {
      const persona = await Persona.findOne({ where: { correo } });
      if (persona) {
        usuario = await Usuario.findOne({
          where: { id_persona: persona.id_persona },
          include: [
            { model: Persona, as: "personaInfo" },
            { model: Perfil, as: "perfil" },
          ],
        });
      }
    }

    // 2) Si no encontramos por correo, intentar por nombre de usuario (campo usuario)
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
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    // ⚙️ Verificar contraseña con el campo real en DB: 'contrasena'
    const storedHash = usuario.contrasena || usuario.password || "";
    const match = await bcrypt.compare(plainPassword, storedHash);
    if (!match) {
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    if (usuario.estado !== 1) {
      return res.status(403).json({ message: "Usuario inactivo." });
    }

    const payload = buildUserPayload(usuario);
    const token = jwt.sign(
      { id_usuario: payload.id_usuario, username: payload.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({ user: payload, token });
  } catch (error) {
    console.error("AuthController.login error:", error);
    return res
      .status(500)
      .json({ message: "Error al autenticar", error: error.message });
  }
};

// POST /api/auth/register-aliado
exports.registerAliado = async (req, res) => {
  try {
    // Lógica simple: crear registro y marcar como 'pendiente' para revisión por admin
    // Puedes reutilizar register() o crear un flujo diferente.
    // Aquí haremos una versión simplificada que crea persona y usuario con id_perfil = 3 (Aliado) y estado = 0 (pendiente)
    const {
      usuario,
      password,
      contrasena,
      nombres,
      apellidos,
      correo,
      telefono,
      direccion,
      empresa_info,
    } = req.body;

    const plainPassword = password || contrasena;

    if (!usuario || !plainPassword || !nombres || !apellidos || !correo) {
      return res.status(400).json({
        message: "Faltan campos obligatorios para registro de aliado.",
      });
    }

    // Evitar duplicados
    const userExists = await Usuario.findOne({ where: { usuario } });
    if (userExists)
      return res.status(400).json({ message: "Nombre de usuario ya existe." });

    // Crear persona (sin transaction por simplicidad; puedes usarla si quieres)
    const nuevaPersona = await Persona.create({
      nombres,
      apellidos,
      correo,
      telefono: telefono || null,
      direccion: direccion || null,
      tipo_documento: req.body.tipo_documento || "",
      numero_documento: req.body.numero_documento || "",
      estado: 1,
    });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(plainPassword, salt);

    const nuevoUsuario = await Usuario.create({
      usuario,
      contrasena: hashed,
      id_persona: nuevaPersona.id_persona,
      id_perfil: 3, // Aliado
      estado: 0, // pendiente / inactivo hasta aprobación
    });

    // Aquí podrías enviar notificación al admin o guardar company info

    return res.status(201).json({
      message: "Solicitud de aliado enviada. Pendiente de aprobación.",
    });
  } catch (error) {
    console.error("AuthController.registerAliado error:", error);
    return res
      .status(500)
      .json({ message: "Error al registrar aliado", error: error.message });
  }
};
