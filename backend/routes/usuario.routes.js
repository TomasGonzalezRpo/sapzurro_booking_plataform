// backend/routes/usuario.routes.js
const express = require("express");
const router = express.Router(); // Crea una instancia de Router de Express
const usuarioController = require("../controllers/UsuarioController"); // Importa el controlador que maneja la lógica CRUD para Usuario

// ====================================================================
// RUTAS DE USUARIOS (CRUD - Mapeadas bajo /api/usuarios en server.js)
// NOTA: Estas rutas típicamente requieren permisos de Administrador.
// Se deberían proteger con un middleware (e.g., db.authenticateToken, db.isAdmin)
// ====================================================================

// GET /api/usuarios
// Obtener la lista de todos los usuarios
router.get("/", usuarioController.getAllUsuarios);

// POST /api/usuarios
// Crear un nuevo usuario
router.post("/", usuarioController.createUsuario);

// PUT /api/usuarios/:id
// Actualizar la información de un usuario específico por ID
router.put("/:id", usuarioController.updateUsuario);

// DELETE /api/usuarios/:id
// Eliminar un usuario específico por ID
router.delete("/:id", usuarioController.deleteUsuario);

// Exportamos el router para que pueda ser utilizado en la aplicación principal
module.exports = router;
