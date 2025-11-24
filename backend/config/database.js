// backend/config/database.js
const { Sequelize, DataTypes } = require("sequelize");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Inicializamos Sequelize para conectar con la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME, // Nombre de la base de datos
  process.env.DB_USER, // Usuario de la base de datos
  process.env.DB_PASSWORD, // Contraseña de la base de datos
  {
    host: process.env.DB_HOST, // Host de la base de datos
    dialect: "mysql", // Usamos MySQL
    logging: console.log, // Para ver las consultas SQL en la consola
    port: process.env.DB_PORT, // Puerto de la base de datos
  }
);

// Objeto para exportar la configuración de la BD
const db = {};
db.sequelize = sequelize; // Exportamos la instancia de Sequelize
db.DataTypes = DataTypes; // Exportamos DataTypes

// Inicializamos la aplicación de Express
const app = express();

// Configuración de CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Permitir peticiones desde el frontend
  credentials: true, // Esto es para permitir cookies y headers de autorización
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Métodos HTTP permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Permitir estos encabezados
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Usamos el middleware CORS

// Middleware para que Express pueda leer JSON y datos de formularios
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Requerimos JWT para la autenticación
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret"; // Secreto para firmar tokens

// Función middleware para verificar el token del usuario
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // Obtener el header Authorization
  const token = authHeader && authHeader.split(" ")[1]; // Extraer el token de "Bearer <token>"

  if (!token) {
    // Si no hay token, el usuario no está autenticado
    return res.status(401).json({
      success: false,
      message: "Debe iniciar sesión para completar la reserva",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("❌ Token inválido:", err.message); // Si el token no es válido o está expirado
      return res.status(403).json({
        success: false,
        message: "Token inválido o expirado",
      });
    }
    req.user = user; // Guardamos los datos del usuario en la petición
    console.log("✅ Token válido para usuario:", user.username);
    next(); // Continuar con la siguiente función (la ruta)
  });
};

db.app = app; // Exportamos la instancia de Express
db.authenticateToken = authenticateToken; // Exportamos el middleware de autenticación

module.exports = db; // Exportar todo el objeto db
