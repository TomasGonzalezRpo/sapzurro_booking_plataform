// backend/routes/auth.routes.js
const express = require("express");
const router = express.Router(); // Creamos una instancia de Router de Express

const AuthController = require("../controllers/AuthController"); // Importamos el controlador que maneja la lógica de autenticación

// ============================================================
// RUTAS DE AUTENTICACIÓN (Rutas públicas)
// Estas rutas apuntan a funciones específicas dentro del AuthController
// ============================================================

// POST /api/auth/login
// Iniciar sesión del usuario
router.post("/login", AuthController.login);

// POST /api/auth/register
// Registro de nuevos usuarios (típicamente clientes/consumidores)
router.post("/register", AuthController.register);

// POST /api/auth/register-aliado
// Registro específico para 'aliados' o socios (puede tener lógica diferente)
router.post("/register-aliado", AuthController.registerAliado);

// POST /api/auth/forgot-password
// Solicita un enlace/token para restablecer la contraseña (paso 1)
router.post("/forgot-password", AuthController.forgotPassword);

// POST /api/auth/reset-password
// Restablece la contraseña usando el token y la nueva contraseña (paso 2)
router.post("/reset-password", AuthController.resetPassword);

// Exportamos el router para que pueda ser montado en el archivo principal (server.js o index.js)
module.exports = router;
