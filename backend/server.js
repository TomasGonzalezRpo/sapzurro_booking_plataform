// backend/server.js
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { sequelize } = require("./models/index");

const perfilRoutes = require("./routes/perfil.routes");
const personaRoutes = require("./routes/persona.routes");
const usuarioRoutes = require("./routes/usuario.routes");
const authRoutes = require("./routes/auth.routes");
const reservasRoutes = require("./routes/reservas.routes");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

// ✅ MIDDLEWARE CORS MANUAL (funciona mejor que la librería cors)
app.use((req, res, next) => {
  const origin = "http://localhost:5173";
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );

  // Permitir todos los headers que el cliente solicita
  const requestHeaders = req.headers["access-control-request-headers"];
  if (requestHeaders) {
    res.header("Access-Control-Allow-Headers", requestHeaders);
  } else {
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type,Authorization,Cache-Control,Pragma,X-Requested-With"
    );
  }

  // Responder a peticiones OPTIONS
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MIDDLEWARE DE AUTENTICACIÓN
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

  console.log("🔐 Verificando token...");
  console.log("Authorization header:", authHeader ? "Presente" : "Ausente");

  if (!token) {
    console.log("❌ No hay token");
    return res.status(401).json({
      success: false,
      message: "Debe iniciar sesión para completar la reserva",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("❌ Token inválido:", err.message);
      return res.status(403).json({
        success: false,
        message: "Token inválido o expirado",
      });
    }
    req.user = user;
    console.log("✅ Token válido para usuario:", user.username);
    next();
  });
};

// ====================================================================
// Mapeo de Rutas
// ====================================================================

app.use("/api/perfiles", perfilRoutes);
app.use("/api/personas", personaRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/auth", authRoutes);

// 🔒 RUTAS PROTEGIDAS
app.use("/api/reservas", authenticateToken, reservasRoutes);

// 🔍 Ruta de prueba (para verificar que el servidor está corriendo)
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
      "🛠️ Modelos (Perfil, Persona, Usuario) sincronizados con la base de datos."
    );

    app.listen(PORT, () => {
      console.log(
        `\n🚀 Servidor Express corriendo en http://localhost:${PORT}`
      );
      console.log(`🔐 CORS configurado para: http://localhost:5173`);
      console.log(`\n📋 Rutas disponibles:`);
      console.log(`   ✅ GET  /health`);
      console.log(`   ✅ POST /api/auth/login`);
      console.log(`   ✅ POST /api/auth/register`);
      console.log(`   ✅ GET  /api/usuarios`);
      console.log(`   ✅ GET  /api/personas`);
      console.log(`   ✅ GET  /api/perfiles`);
      console.log(`   🔒 POST /api/reservas (protegida)`);
      console.log(`   🔒 GET  /api/reservas (protegida)`);
      console.log(`   🔒 GET  /api/reservas/:id (protegida)`);
      console.log(`   🔒 DELETE /api/reservas/:id (protegida)\n`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error.message);
    process.exit(1);
  }
};

startServer();
