// backend/models/index.js
const db = require("../config/database");

// Importar todos los modelos
const Perfil = require("./Perfil");
const TipoPersona = require("./TipoPersona");
const Persona = require("./Persona");
const Usuario = require("./Usuario");
const Alojamiento = require("./Alojamiento");
const Ruta = require("./Ruta");
const TipoActividad = require("./TipoActividad");
const Actividad = require("./Actividad");

// ===== RELACIONES EXISTENTES =====

// 1. Usuario <-> Persona (Relación 1:1)
Usuario.belongsTo(Persona, {
  foreignKey: "id_persona",
  as: "personaInfo",
  targetKey: "id_persona",
});
Persona.hasOne(Usuario, {
  foreignKey: "id_persona",
  as: "usuarioInfo",
  sourceKey: "id_persona",
});

// 2. Usuario <-> Perfil (Relación N:1)
Usuario.belongsTo(Perfil, {
  foreignKey: "id_perfil",
  as: "perfil",
  targetKey: "id_perfil",
});
Perfil.hasMany(Usuario, {
  foreignKey: "id_perfil",
  as: "usuarios",
  sourceKey: "id_perfil",
});

// ===== RELACIÓN NUEVA: TIPO_PERSONA =====

// 3. Persona <-> TipoPersona (Relación N:1)
Persona.belongsTo(TipoPersona, {
  foreignKey: "id_tipo_persona",
  as: "tipoPersona",
  targetKey: "id_tipo_persona",
});
TipoPersona.hasMany(Persona, {
  foreignKey: "id_tipo_persona",
  as: "personas",
  sourceKey: "id_tipo_persona",
});

// ===== RELACIONES DE ACTIVIDADES =====

// 4. Actividad <-> Persona (Relación N:1)
Actividad.belongsTo(Persona, {
  foreignKey: "id_persona",
  as: "visitante",
  targetKey: "id_persona",
});
Persona.hasMany(Actividad, {
  foreignKey: "id_persona",
  as: "actividades",
  sourceKey: "id_persona",
});

// 5. Actividad <-> TipoActividad (Relación N:1)
Actividad.belongsTo(TipoActividad, {
  foreignKey: "id_tipo_actividad",
  as: "tipoActividad",
  targetKey: "id_tipo_actividad",
});
TipoActividad.hasMany(Actividad, {
  foreignKey: "id_tipo_actividad",
  as: "actividades",
  sourceKey: "id_tipo_actividad",
});

// 6. Actividad <-> Alojamiento (Relación N:1)
Actividad.belongsTo(Alojamiento, {
  foreignKey: "id_alojamiento",
  as: "alojamiento",
  targetKey: "id_alojamiento",
});
Alojamiento.hasMany(Actividad, {
  foreignKey: "id_alojamiento",
  as: "actividades",
  sourceKey: "id_alojamiento",
});

// 7. Actividad <-> Ruta (Relación N:1)
Actividad.belongsTo(Ruta, {
  foreignKey: "id_ruta",
  as: "ruta",
  targetKey: "id_ruta",
});
Ruta.hasMany(Actividad, {
  foreignKey: "id_ruta",
  as: "actividades",
  sourceKey: "id_ruta",
});

// Exporta todos los modelos
module.exports = {
  ...db,
  Perfil,
  TipoPersona,
  Persona,
  Usuario,
  Alojamiento,
  Ruta,
  TipoActividad,
  Actividad,
};
