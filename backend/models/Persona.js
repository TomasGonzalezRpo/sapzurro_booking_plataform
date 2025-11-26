// backend/models/Persona.js
const db = require("../config/database");

const Persona = db.sequelize.define(
  "Persona",
  {
    id_persona: {
      type: db.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_tipo_persona: {
      type: db.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tipo_persona",
        key: "id_tipo_persona",
      },
      comment: "FK a tipo_persona (Local, Nacional, Extranjero, etc.)",
    },
    nombres: {
      type: db.DataTypes.STRING(100),
      allowNull: false,
    },
    apellidos: {
      type: db.DataTypes.STRING(100),
      allowNull: false,
    },
    tipo_documento: {
      type: db.DataTypes.ENUM("CC", "CE", "TI", "PASAPORTE"),
      allowNull: false,
    },
    numero_documento: {
      type: db.DataTypes.STRING(20),
      allowNull: false,
    },
    correo: {
      type: db.DataTypes.STRING(100),
      allowNull: false,
    },
    telefono: {
      type: db.DataTypes.STRING(20),
      allowNull: true,
    },
    direccion: {
      type: db.DataTypes.STRING(150),
      allowNull: true,
    },
    estado: {
      type: db.DataTypes.TINYINT,
      defaultValue: 1,
      allowNull: false,
    },
  },
  {
    tableName: "persona",
    timestamps: false,
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["numero_documento"],
      },
      {
        unique: true,
        fields: ["correo"],
      },
      {
        fields: ["id_tipo_persona"],
      },
    ],
  }
);

module.exports = Persona;
