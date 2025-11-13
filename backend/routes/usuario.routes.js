// backend/routes/usuario.routes.js
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/UsuarioController");

// ====================================================================
// RUTAS DE USUARIOS (CRUD - Mapeadas bajo /api/usuarios en server.js)
// ====================================================================

router.get("/", usuarioController.getAllUsuarios);
router.post("/", usuarioController.createUsuario);
router.put("/:id", usuarioController.updateUsuario);
router.delete("/:id", usuarioController.deleteUsuario);

module.exports = router;
