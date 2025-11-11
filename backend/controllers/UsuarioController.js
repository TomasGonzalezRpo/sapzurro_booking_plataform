const { Usuario, Persona, Perfil } = require("../models/index");

// Función de consulta
const baseFindOptions = {
  include: [
    { model: Persona, as: "personaInfo" },
    { model: Perfil, as: "perfil" },
  ],
  attributes: { exclude: ["password"] },
};

// 1. LEER TODOS (GET)
exports.getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll(baseFindOptions);
    res.status(200).json(usuarios);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener usuarios", error: error.message });
  }
};

// 2. CREAR (POST)
exports.createUsuario = async (req, res) => {
  try {
    if (
      !req.body.usuario ||
      !req.body.password ||
      !req.body.id_persona ||
      !req.body.id_perfil
    ) {
      return res.status(400).json({
        message:
          "Campos obligatorios incompletos (usuario, password, id_persona, id_perfil).",
      });
    }

    const nuevoUsuario = await Usuario.create(req.body);

    // Devolver el objeto creado (incluyendo info relacionada, sin password)
    const usuarioCreado = await Usuario.findByPk(
      nuevoUsuario.id_usuario,
      baseFindOptions
    );

    res.status(201).json(usuarioCreado);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(400).json({
      message:
        "Error de validación: El usuario o la persona ya podrían estar registrados.",
      error: error.message,
    });
  }
};

// 3. ACTUALIZAR (PUT)
exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    // Ejecuta el hook beforeUpdate si la contraseña cambia
    const [updatedRows] = await Usuario.update(req.body, {
      where: { id_usuario: id },
      individualHooks: true,
    });

    if (updatedRows) {
      // Devolver el objeto actualizado
      const usuarioActualizado = await Usuario.findByPk(id, baseFindOptions);
      res.status(200).json(usuarioActualizado);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al actualizar usuario", error: error.message });
  }
};

// 4. ELIMINAR (DELETE)
exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRows = await Usuario.destroy({
      where: { id_usuario: id },
    });

    if (deletedRows) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar usuario", error: error.message });
  }
};
