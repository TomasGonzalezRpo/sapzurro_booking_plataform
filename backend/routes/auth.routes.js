// backend/routes/auth.routes.js
const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const UsuarioController = require("../controllers/UsuarioController");

// Rutas de autenticación
router.post("/login", AuthController.login); // POST /api/auth/login
router.post("/register", AuthController.register); // POST /api/auth/register
router.post("/register-aliado", AuthController.registerAliado); // POST /api/auth/register-aliado

// Nota: forgot-password ya lo implementaste en UsuarioController.forgotPassword
// Si quieres exponerlo también aquí (bajo /api/auth/forgot-password), puedes:
router.post("/forgot-password", UsuarioController.forgotPassword);

module.exports = router;
