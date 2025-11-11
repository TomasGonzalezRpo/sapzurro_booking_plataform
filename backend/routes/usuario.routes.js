const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/UsuarioController");

router.get("/", usuarioController.getAllUsuarios);
router.post("/", usuarioController.createUsuario);
router.put("/:id", usuarioController.updateUsuario);
router.delete("/:id", usuarioController.deleteUsuario);

module.exports = router;
