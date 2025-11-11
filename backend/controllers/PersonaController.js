const Persona = require("../models/Persona");

// 1. LEER TODOS (GET)
exports.getAllPersonas = async (req, res) => {
  try {
    const personas = await Persona.findAll();
    res.status(200).json(personas);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener personas", error: error.message });
  }
};

// 2. CREAR (POST)
exports.createPersona = async (req, res) => {
  try {
    if (!req.body.nombres || !req.body.numero_documento) {
      return res
        .status(400)
        .json({ message: "Los campos nombre y documento son obligatorios." });
    }

    const nuevaPersona = await Persona.create(req.body);
    res.status(201).json(nuevaPersona);
  } catch (error) {
    // Manejo de errores de validación o duplicados (documento, correo)
    res
      .status(400)
      .json({ message: "Error al crear persona", error: error.message });
  }
};

// 3. ACTUALIZAR (PUT)
exports.updatePersona = async (req, res) => {
  const { id } = req.params;
  try {
    const [updatedRows] = await Persona.update(req.body, {
      where: { id_persona: id },
    });

    if (updatedRows) {
      const personaActualizada = await Persona.findByPk(id);
      res.status(200).json(personaActualizada);
    } else {
      res.status(404).json({ message: "Persona no encontrada" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar persona", error: error.message });
  }
};

// 4. ELIMINAR (DELETE)
exports.deletePersona = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRows = await Persona.destroy({
      where: { id_persona: id },
    });

    if (deletedRows) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Persona no encontrada" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar persona (puede tener registros asociados)",
      error: error.message,
    });
  }
};
