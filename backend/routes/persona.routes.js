const express = require("express");
const router = express.Router();
const personaController = require("../controllers/PersonaController");

router.get("/", personaController.getAllPersonas);
router.post("/", personaController.createPersona);
router.put("/:id", personaController.updatePersona);
router.delete("/:id", personaController.deletePersona);

module.exports = router;
