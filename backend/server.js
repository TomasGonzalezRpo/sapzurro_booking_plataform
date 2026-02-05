// backend/server.js
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { sequelize } = require("./models/index");

// ====================================================================
// IMPORTAR TODAS LAS RUTAS
// ====================================================================
const perfilRoutes = require("./routes/perfil.routes");
const personaRoutes = require("./routes/persona.routes");
const usuarioRoutes = require("./routes/usuario.routes");
const authRoutes = require("./routes/auth.routes");
const reservasRoutes = require("./routes/reservas.routes");

// NUEVAS RUTAS
const tipoPersonaRoutes = require("./routes/tipo-persona.routes");
const alojamientoRoutes = require("./routes/alojamiento.routes");
const rutaRoutes = require("./routes/ruta.routes");
const tipoActividadRoutes = require("./routes/tipo-actividad.routes");
const actividadRoutes = require("./routes/actividad.routes");

const app = express();
const PORT = process.env.PORT || 5000;

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

// ====================================================================
// MIDDLEWARE CORS MANUAL
// ====================================================================
app.use((req, res, next) => {
  const origin = "http://localhost:5173";
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  );

  const requestHeaders = req.headers["access-control-request-headers"];
  if (requestHeaders) {
    res.header("Access-Control-Allow-Headers", requestHeaders);
  } else {
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type,Authorization,Cache-Control,Pragma,X-Requested-With",
    );
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====================================================================
// MIDDLEWARE DE AUTENTICACIÓN (REFORZADO)
// ====================================================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Extraer token y limpiar valores nulos o falsos del frontend
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  console.log("🔐 Verificando token...");
  console.log("Authorization header:", authHeader ? "Presente" : "Ausente");

  if (
    !token ||
    token === "null" ||
    token === "undefined" ||
    token.startsWith("mock_token")
  ) {
    console.log("❌ Token inválido o ausente");
    return res.status(401).json({
      success: false,
      message: "Debe iniciar sesión para completar la acción",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("❌ Token inválido:", err.message);
      return res.status(403).json({
        success: false,
        message:
          err.name === "TokenExpiredError"
            ? "Sesión expirada"
            : "Token inválido o expirado",
      });
    }
    req.user = user;
    console.log(
      "✅ Token válido para usuario:",
      user.username || user.id_usuario,
    );
    next();
  });
};

// ====================================================================
// Mapeo de Rutas
// ====================================================================

// RUTAS PÚBLICAS
app.use("/api/perfiles", perfilRoutes);
app.use("/api/personas", personaRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/reservas", authenticateToken, reservasRoutes);

app.use("/api/tipos-persona", authenticateToken, tipoPersonaRoutes);
app.use("/api/alojamientos", authenticateToken, alojamientoRoutes);
app.use("/api/rutas", authenticateToken, rutaRoutes);
app.use("/api/tipos-actividad", authenticateToken, tipoActividadRoutes);
app.use("/api/actividades", authenticateToken, actividadRoutes);

// Ruta de prueba
app.get("/health", (req, res) => {
  res.json({ status: "✅ Servidor funcionando", time: new Date() });
});

// ====================================================================
// Manejo de errores
// ====================================================================
app.use((err, req, res, next) => {
  console.error("❌ Error no manejado:", err);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL establecida correctamente.");

    await sequelize.sync({ alter: false });
    console.log(
      "🛠️ Modelos sincronizados con la base de datos (Perfil, TipoPersona, Persona, Usuario, Alojamiento, Ruta, TipoActividad, Actividad).",
    );

    app.listen(PORT, () => {
      console.log(
        `\n🚀 Servidor Express corriendo en http://localhost:${PORT}`,
      );
      console.log(`🔐 CORS configurado para: http://localhost:5173`);
      console.log(`\n📋 Rutas disponibles:\n`);

      console.log(`   🔓 PÚBLICAS:`);
      console.log(`   ✅ GET  /health`);
      console.log(`   ✅ POST /api/auth/login`);
      console.log(`   ✅ POST /api/auth/register`);
      console.log(`   ✅ GET  /api/usuarios`);
      console.log(`   ✅ GET  /api/personas`);
      console.log(`   ✅ GET  /api/perfiles`);

      console.log(`\n   🔒 PROTEGIDAS (requieren autenticación):`);
      console.log(`   🔒 GET/POST  /api/reservas`);
      console.log(`   🔒 GET/PUT/DELETE /api/reservas/:id`);

      console.log(`\n   🔒 GESTIÓN DE TIPOS DE PERSONAS:`);
      console.log(`   🔒 GET  /api/tipos-persona`);
      console.log(`   🔒 GET  /api/tipos-persona/activos`);
      console.log(`   🔒 GET  /api/tipos-persona/:id`);
      console.log(`   🔒 POST /api/tipos-persona`);
      console.log(`   🔒 PUT  /api/tipos-persona/:id`);
      console.log(`   🔒 DELETE /api/tipos-persona/:id`);
      console.log(`   🔒 GET  /api/alojamientos`);
      console.log(`   🔒 GET  /api/alojamientos/activos`);
      console.log(`   🔒 GET  /api/alojamientos/:id`);
      console.log(`   🔒 POST /api/alojamientos`);
      console.log(`   🔒 PUT  /api/alojamientos/:id`);
      console.log(`   🔒 DELETE /api/alojamientos/:id`);

      console.log(`\n   🔒 GESTIÓN DE RUTAS:`);
      console.log(`   🔒 GET  /api/rutas`);
      console.log(`   🔒 GET  /api/rutas/activas`);
      console.log(`   🔒 GET  /api/rutas/duracion/:duracion`);
      console.log(`   🔒 GET  /api/rutas/:id`);
      console.log(`   🔒 POST /api/rutas`);
      console.log(`   🔒 PUT  /api/rutas/:id`);
      console.log(`   🔒 DELETE /api/rutas/:id`);

      console.log(`\n   🔒 GESTIÓN DE TIPOS DE ACTIVIDADES:`);
      console.log(`   🔒 GET  /api/tipos-actividad`);
      console.log(`   🔒 GET  /api/tipos-actividad/activos`);
      console.log(`   🔒 GET  /api/tipos-actividad/codigo/:codigo`);
      console.log(`   🔒 GET  /api/tipos-actividad/:id`);
      console.log(`   🔒 POST /api/tipos-actividad`);
      console.log(`   🔒 PUT  /api/tipos-actividad/:id`);
      console.log(`   🔒 DELETE /api/tipos-actividad/:id`);

      console.log(`\n   🔒 GESTIÓN DE ACTIVIDADES ECOTURÍSTICAS:`);
      console.log(`   🔒 GET  /api/actividades`);
      console.log(`   🔒 GET  /api/actividades/estado/:estado`);
      console.log(`   🔒 GET  /api/actividades/visitante/:id_persona`);
      console.log(`   🔒 GET  /api/actividades/ruta/:id_ruta`);
      console.log(`   🔒 GET  /api/actividades/:id`);
      console.log(`   🔒 POST /api/actividades`);
      console.log(`   🔒 PUT  /api/actividades/:id`);
      console.log(`   🔒 DELETE /api/actividades/:id\n`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error.message);
    process.exit(1);
  }
};

startServer();
