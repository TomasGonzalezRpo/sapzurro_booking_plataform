const db = require("../config/database"); // Importamos la configuración de la conexión a la base de datos (Sequelize)

// ============================================================
// IMPORTACIÓN DE MODELOS
// ============================================================

// Importar todos los modelos definidos
const Perfil = require("./Perfil");
const Persona = require("./Persona");
const Usuario = require("./Usuario");

// ============================================================
// DEFINICIÓN DE RELACIONES ENTRE MODELOS (ASOCIACIONES)
// ============================================================

// 1. Usuario <-> Persona (Relación 1:1)
// Un Usuario pertenece a UNA Persona
Usuario.belongsTo(Persona, {
  foreignKey: "id_persona", // La clave foránea está en la tabla Usuario
  as: "personaInfo", // Alias para incluir la Persona cuando se busca un Usuario
});
// Una Persona tiene UN Usuario asociado
Persona.hasOne(Usuario, {
  foreignKey: "id_persona",
  as: "usuarioInfo", // Alias para incluir el Usuario cuando se busca una Persona
});

// 2. Usuario <-> Perfil (Rol) (Relación N:1)
// Un Usuario pertenece a UN Perfil (Rol)
Usuario.belongsTo(Perfil, {
  foreignKey: "id_perfil", // La clave foránea está en la tabla Usuario
  as: "perfil", // Alias usado para incluir el Perfil cuando se busca un Usuario
});
// Un Perfil (Rol) puede tener MUCHOS Usuarios
Perfil.hasMany(Usuario, {
  foreignKey: "id_perfil",
  as: "usuarios", // Alias para incluir los Usuarios cuando se busca un Perfil
});

// ============================================================
// EXPORTACIÓN
// ============================================================

// Exporta la configuración de la base de datos (db) y todos los Modelos
module.exports = {
  ...db, // Esto típicamente incluye la instancia de sequelize
  Perfil,
  Persona,
  Usuario,
};
