// backend/controllers/PersonaController.js

// Importamos el modelo Persona para interactuar con la base de datos
const Persona = require("../models/Persona");

// ============================================================
// FUNCIONES CRUD BÁSICAS PARA EL MODELO PERSONA
// ============================================================

// 1. LEER TODOS (GET)
exports.getAllPersonas = async (req, res) => {
  try {
    // Buscamos todos los registros de personas
    const personas = await Persona.findAll();
    res.status(200).json(personas); // Devolvemos la lista de personas
  } catch (error) {
    // Manejo de errores de servidor
    res
      .status(500)
      .json({ message: "Error al obtener personas", error: error.message });
  }
};

// 2. CREAR (POST)
exports.createPersona = async (req, res) => {
  try {
    // Validamos que al menos existan los campos obligatorios
    if (!req.body.nombres || !req.body.numero_documento) {
      return res
        .status(400)
        .json({ message: "Los campos nombre y documento son obligatorios." });
    } // Creamos un nuevo registro de persona con los datos del body

    const nuevaPersona = await Persona.create(req.body);
    res.status(201).json(nuevaPersona); // Devolvemos el objeto creado
  } catch (error) {
    // Error de validación, duplicado o base de datos
    res
      .status(400)
      .json({ message: "Error al crear persona", error: error.message });
  }
};

// 3. ACTUALIZAR (PUT)
exports.updatePersona = async (req, res) => {
  const { id } = req.params; // Obtenemos el ID de la persona a actualizar
  try {
    // Actualizamos los datos, Sequelize devuelve la cantidad de filas afectadas
    const [updatedRows] = await Persona.update(req.body, {
      where: { id_persona: id }, // Condición para actualizar
    });

    if (updatedRows) {
      // Si se actualizó una fila, la buscamos y la devolvemos
      const personaActualizada = await Persona.findByPk(id);
      res.status(200).json(personaActualizada);
    } else {
      // Si no se actualizó, la persona no existe
      res.status(404).json({ message: "Persona no encontrada" });
    }
  } catch (error) {
    // Error de servidor
    res
      .status(500)
      .json({ message: "Error al actualizar persona", error: error.message });
  }
};

// 4. ELIMINAR (DELETE)
exports.deletePersona = async (req, res) => {
  const { id } = req.params; // ID de la persona a eliminar
  try {
    // Eliminamos la persona y guardamos el número de filas eliminadas
    const deletedRows = await Persona.destroy({
      where: { id_persona: id },
    });

    if (deletedRows) {
      // 204 No Content: éxito sin devolver cuerpo
      res.status(204).send();
    } else {
      // Si no se eliminó, no existe
      res.status(404).json({ message: "Persona no encontrada" });
    }
  } catch (error) {
    // Error de integridad referencial o de servidor
    res.status(500).json({
      message: "Error al eliminar persona (puede tener registros asociados)",
      error: error.message,
    });
  }
};
