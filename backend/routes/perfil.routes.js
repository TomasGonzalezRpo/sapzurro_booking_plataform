const express = require("express");
const router = express.Router();
const perfilController = require("../controllers/PerfilController");

router.get("/", perfilController.getAllPerfiles);
router.post("/", perfilController.createPerfil);
router.put("/:id", perfilController.updatePerfil);
router.delete("/:id", perfilController.deletePerfil);

module.exports = router;
