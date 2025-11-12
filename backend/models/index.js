const db = require("../config/database");

// Importar todos los modelos
const Perfil = require("./Perfil");
const Persona = require("./Persona");
const Usuario = require("./Usuario");

// 1. Usuario <-> Persona (Relación 1:1)
Usuario.belongsTo(Persona, {
  foreignKey: "id_persona",
  as: "personaInfo", // Alias usado en el controlador
});
Persona.hasOne(Usuario, {
  foreignKey: "id_persona",
  as: "usuarioInfo",
});

// 2. Usuario <-> Perfil (Relación N:1)
Usuario.belongsTo(Perfil, {
  foreignKey: "id_perfil",
  as: "perfil", // Alias usado en el controlador
});
Perfil.hasMany(Usuario, {
  foreignKey: "id_perfil",
  as: "usuarios",
});

// Exporta todos los modelos
module.exports = {
  ...db,
  Perfil,
  Persona,
  Usuario,
};
