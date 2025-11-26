// backend/models/Alojamiento.js
const db = require("../config/database");

const Alojamiento = db.sequelize.define(
  "Alojamiento",
  {
    id_alojamiento: {
      type: db.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: db.DataTypes.STRING(100),
      allowNull: false,
    },
    direccion: {
      type: db.DataTypes.STRING(200),
      allowNull: false,
    },
    telefono: {
      type: db.DataTypes.STRING(20),
      allowNull: false,
    },
    correo: {
      type: db.DataTypes.STRING(100),
      allowNull: false,
    },
    valor: {
      type: db.DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    observaciones: {
      type: db.DataTypes.TEXT,
      allowNull: true,
    },
    estado: {
      type: db.DataTypes.TINYINT,
      defaultValue: 1,
      allowNull: false,
    },
  },
  {
    tableName: "alojamiento",
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Alojamiento;
