// backend/routes/auth.routes.js
const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");

// Rutas de autenticación
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/register-aliado", AuthController.registerAliado);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

module.exports = router;
