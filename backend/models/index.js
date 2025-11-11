const db = require("../config/database");

// Importar todos los modelos
const Perfil = require("./Perfil");
const Persona = require("./Persona");
const Usuario = require("./Usuario");

// 1. Usuario <-> Persona (Relación 1:1)
Usuario.belongsTo(Persona, {
  foreignKey: "id_persona",
  targetKey: "id_persona",
  as: "personaInfo",
});
Persona.hasOne(Usuario, {
  foreignKey: "id_persona",
  sourceKey: "id_persona",
  as: "usuarioInfo",
});

// 2. Usuario <-> Perfil (Relación N:1)
Usuario.belongsTo(Perfil, {
  foreignKey: "id_perfil",
  targetKey: "id_perfil",
  as: "perfil",
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
