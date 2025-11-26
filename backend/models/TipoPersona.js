// backend/models/TipoPersona.js
const db = require("../config/database");

const TipoPersona = db.sequelize.define(
  "TipoPersona",
  {
    id_tipo_persona: {
      type: db.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: db.DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: "Ej: Local, Nacional, Extranjero, Grupo, Individual",
    },
    descripcion: {
      type: db.DataTypes.TEXT,
      allowNull: true,
      comment: "Descripción del tipo de visitante",
    },
    observaciones: {
      type: db.DataTypes.TEXT,
      allowNull: true,
      comment: "Características específicas de este tipo",
    },
    estado: {
      type: db.DataTypes.TINYINT,
      defaultValue: 1,
      allowNull: false,
      comment: "1=Activo, 0=Desactivado",
    },
  },
  {
    tableName: "tipo_persona",
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = TipoPersona;
