const Perfil = require("../models/Perfil");

// 1. LEER TODOS (GET)
exports.getAllPerfiles = async (req, res) => {
  try {
    const perfiles = await Perfil.findAll();
    res.status(200).json(perfiles);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener perfiles", error: error.message });
  }
};

// 2. CREAR (POST)
exports.createPerfil = async (req, res) => {
  try {
    if (!req.body.nombre) {
      return res
        .status(400)
        .json({ message: "El nombre del perfil es obligatorio." });
    }

    const nuevoPerfil = await Perfil.create(req.body);
    res.status(201).json(nuevoPerfil);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al crear perfil", error: error.message });
  }
};

// 3. ACTUALIZAR (PUT)
exports.updatePerfil = async (req, res) => {
  const { id } = req.params;
  try {
    const [updatedRows] = await Perfil.update(req.body, {
      where: { id_perfil: id },
    });

    if (updatedRows) {
      const perfilActualizado = await Perfil.findByPk(id);
      res.status(200).json(perfilActualizado);
    } else {
      res.status(404).json({ message: "Perfil no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar perfil", error: error.message });
  }
};

// 4. ELIMINAR (DELETE)
exports.deletePerfil = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRows = await Perfil.destroy({
      where: { id_perfil: id },
    });

    if (deletedRows) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Perfil no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar perfil", error: error.message });
  }
};
