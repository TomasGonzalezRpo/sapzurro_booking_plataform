const express = require("express"); // Framework web para Node.js
const cors = require("cors"); // Middleware para habilitar CORS (aunque se usa una implementación manual)
const jwt = require("jsonwebtoken"); // Librería para trabajar con JSON Web Tokens
require("dotenv").config(); // Cargar variables de entorno del archivo .env

// Importar la instancia de Sequelize de la carpeta de modelos
const { sequelize } = require("./models/index");

// Importar rutas
const perfilRoutes = require("./routes/perfil.routes");
const personaRoutes = require("./routes/persona.routes");
const usuarioRoutes = require("./routes/usuario.routes");
const authRoutes = require("./routes/auth.routes");
const reservasRoutes = require("./routes/reservas.routes");

const app = express();
const PORT = process.env.PORT || 5000; // Obtiene el puerto de .env o usa 5000 por defecto
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret"; // Secreto para JWT

// ====================================================================
// CONFIGURACIÓN DE MIDDLEWARE GLOBAL
// ====================================================================

// ✅ MIDDLEWARE CORS MANUAL
// Configuración explícita de CORS para permitir peticiones desde el frontend (http://localhost:5173)
app.use((req, res, next) => {
  const origin = "http://localhost:5173"; // Permite solo peticiones desde este origen
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true"); // Importante para cookies/sesiones (si se usaran)
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS" // Métodos HTTP permitidos
  ); // Manejo de Headers: Permite los headers que el cliente envíe

  const requestHeaders = req.headers["access-control-request-headers"];
  if (requestHeaders) {
    res.header("Access-Control-Allow-Headers", requestHeaders);
  } else {
    // Headers mínimos predeterminados
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type,Authorization,Cache-Control,Pragma,X-Requested-With"
    );
  } // Responder a peticiones pre-vuelo (OPTIONS) con éxito

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Middleware para parsear el cuerpo de las peticiones como JSON
app.use(express.json());
// Middleware para parsear peticiones con datos codificados en URL (form-data)
app.use(express.urlencoded({ extended: true }));

// ====================================================================
// MIDDLEWARE DE AUTENTICACIÓN (JWT)
// ====================================================================

// ✅ FUNCIÓN MIDDLEWARE: Verifica y decodifica el token JWT
const authenticateToken = (req, res, next) => {
  // Extrae el header de autorización ("Bearer TOKEN")
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("🔐 Verificando token...");

  if (!token) {
    console.log("❌ No hay token");
    return res.status(401).json({
      // 401 Unauthorized
      success: false,
      message: "Debe iniciar sesión para completar la reserva",
    });
  } // Verifica el token con el secreto

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("❌ Token inválido:", err.message);
      return res.status(403).json({
        // 403 Forbidden (token existe pero es inválido/expirado)
        success: false,
        message: "Token inválido o expirado",
      });
    }
    req.user = user; // Adjunta el payload del usuario decodificado a la petición
    console.log("✅ Token válido para usuario:", user.username);
    next(); // Continúa a la siguiente ruta/middleware
  });
};

// Se inyecta la función de autenticación como método de Sequelize para usarla en routes/*.js
sequelize.authenticateToken = authenticateToken;

// ====================================================================
// Mapeo de Rutas
// ====================================================================

// Rutas sin protección JWT (acceso libre)
app.use("/api/perfiles", perfilRoutes);
app.use("/api/personas", personaRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/auth", authRoutes); // Contiene login, register, forgot/reset password

// 🔒 RUTAS PROTEGIDAS: Se aplica el middleware `authenticateToken` a todo el módulo de rutas de reservas
app.use("/api/reservas", authenticateToken, reservasRoutes);

// 🔍 Ruta de prueba (para verificar que el servidor está corriendo)
app.get("/health", (req, res) => {
  res.json({ status: "✅ Servidor funcionando", time: new Date() });
});

// ====================================================================
// Manejo de errores global
// ====================================================================

app.use((err, req, res, next) => {
  console.error("❌ Error no manejado:", err);
  res.status(500).json({
    // 500 Internal Server Error
    success: false,
    message: "Error interno del servidor", // Mostrar el mensaje de error solo en modo desarrollo para depuración
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ====================================================================
// Inicialización del Servidor y Base de Datos
// ====================================================================

const startServer = async () => {
  try {
    // 1. Probar la conexión a la base de datos
    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL establecida correctamente."); // 2. Sincronizar modelos (crea tablas si no existen)

    await sequelize.sync({ alter: false }); // Usar `alter: true` con precaución, `alter: false` es más seguro
    console.log(
      "🛠️ Modelos (Perfil, Persona, Usuario) sincronizados con la base de datos."
    ); // 3. Iniciar el servidor Express

    app.listen(PORT, () => {
      console.log(
        `\n🚀 Servidor Express corriendo en http://localhost:${PORT}`
      );
      console.log(`🔐 CORS configurado para: http://localhost:5173`);
      console.log(`\n📋 Rutas disponibles:`);
      console.log(`   ✅ GET  /health`);
      console.log(`   ✅ POST /api/auth/login`);
      console.log(`   ✅ POST /api/auth/register`);
      console.log(`   ✅ GET  /api/usuarios`);
      console.log(`   ✅ GET  /api/personas`);
      console.log(`   ✅ GET  /api/perfiles`);
      console.log(`   🔒 POST /api/reservas (protegida)`);
      console.log(`   🔒 GET  /api/reservas (protegida)`);
      console.log(`   🔒 GET  /api/reservas/:id (protegida)`);
      console.log(`   🔒 DELETE /api/reservas/:id (protegida)\n`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error.message);
    process.exit(1); // Sale del proceso con error
  }
};

startServer(); // Ejecutar la función de inicio del servidor
