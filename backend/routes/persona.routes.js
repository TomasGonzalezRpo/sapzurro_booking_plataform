const express = require("express");
const router = express.Router(); // Crea una instancia de Router de Express
const personaController = require("../controllers/PersonaController"); // Importa el controlador que maneja la lógica CRUD para Persona

// ============================================================
// RUTAS CRUD PARA LA ENTIDAD PERSONA
// Estas rutas típicamente se montan bajo un prefijo como /api/personas
// ============================================================

// GET /api/personas
// Obtener todos los registros de personas
router.get("/", personaController.getAllPersonas);

// POST /api/personas
// Crear un nuevo registro de persona
router.post("/", personaController.createPersona);

// PUT /api/personas/:id
// Actualizar un registro de persona específico usando su ID
router.put("/:id", personaController.updatePersona);

// DELETE /api/personas/:id
// Eliminar un registro de persona específico usando su ID
router.delete("/:id", personaController.deletePersona);

// Exportamos el router para que pueda ser utilizado en el archivo principal de la aplicación
module.exports = router;
