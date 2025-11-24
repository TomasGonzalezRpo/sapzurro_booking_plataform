// backend/routes/perfil.routes.js
const express = require("express");
const router = express.Router(); // Crea una instancia de Router de Express
const perfilController = require("../controllers/PerfilController"); // Importa el controlador de Perfiles
const db = require("../config/database"); // Importar para acceder al middleware de autenticación (db.authenticateToken)

// ============================================================
// RUTAS DE USUARIO LOGUEADO (Protegidas)
// Requieren que el usuario esté autenticado para acceder
// ============================================================

// GET /api/perfiles/mi-perfil
// Obtener MIS DATOS de perfil/persona (usuario logueado)
router.get(
  "/mi-perfil",
  db.authenticateToken, // 🔒 Middleware para verificar el JWT del usuario
  perfilController.obtenerMiDatos
);

// PUT /api/perfiles/mi-perfil
// Actualizar MIS DATOS de perfil/persona (usuario logueado)
router.put(
  "/mi-perfil",
  db.authenticateToken, // 🔒 Middleware para verificar el JWT del usuario
  perfilController.actualizarMisDatos
);

// ============================================================
// RUTAS DE ADMINISTRACIÓN DE PERFILES (Asumidas como solo para Admin)
// Nota: En un sistema real, estas también deberían llevar un middleware
// para verificar si el usuario logueado tiene rol de "Admin" (e.g., db.isAdmin)
// ============================================================

// GET /api/perfiles
// Obtener todos los perfiles disponibles (roles)
router.get("/", perfilController.getAllPerfiles);

// POST /api/perfiles
// Crear un nuevo perfil (nuevo rol, ej: "Editor")
router.post("/", perfilController.createPerfil);

// PUT /api/perfiles/:id
// Actualizar la información de un perfil específico por ID
router.put("/:id", perfilController.updatePerfil);

// DELETE /api/perfiles/:id
// Eliminar un perfil por ID
router.delete("/:id", perfilController.deletePerfil);

// Exportamos el router para su uso en el archivo principal de la aplicación
module.exports = router;
