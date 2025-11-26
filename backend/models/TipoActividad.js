// backend/models/TipoActividad.js
const db = require("../config/database");

const TipoActividad = db.sequelize.define(
  "TipoActividad",
  {
    id_tipo_actividad: {
      type: db.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: db.DataTypes.STRING(20),
      unique: true,
      allowNull: false,
      comment: "Código identificador único (ej: ACT001, ACT002)",
    },
    nombre: {
      type: db.DataTypes.STRING(100),
      allowNull: false,
    },
    imagen: {
      type: db.DataTypes.STRING(255),
      allowNull: true,
      comment: "URL o ruta de la imagen",
    },
    observaciones: {
      type: db.DataTypes.TEXT,
      allowNull: true,
    },
    valor: {
      type: db.DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    estado: {
      type: db.DataTypes.TINYINT,
      defaultValue: 1,
      allowNull: false,
    },
  },
  {
    tableName: "tipo_actividad",
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = TipoActividad;
