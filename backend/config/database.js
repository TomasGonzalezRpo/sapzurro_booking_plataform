// backend/config/database.js
const { Sequelize, DataTypes } = require("sequelize");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// ===== SEQUELIZE (Base de datos) =====
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: console.log,
    port: process.env.DB_PORT,
  }
);

const db = {};
db.sequelize = sequelize;
db.DataTypes = DataTypes;

// ===== EXPRESS APP =====
const app = express();

// ✅ CONFIGURACIÓN CORS CORRECTA
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true, // 🔑 PERMITIR CREDENCIALES
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], // 🔑 PERMITIR Authorization header
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware de parseo
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ MIDDLEWARE DE AUTENTICACIÓN
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

  if (!token) {
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
    req.user = user; // Guardar usuario decodificado
    console.log("✅ Token válido para usuario:", user.username);
    next();
  });
};

db.app = app;
db.authenticateToken = authenticateToken;

module.exports = db;
