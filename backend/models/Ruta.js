// backend/models/Ruta.js
const db = require("../config/database");

const Ruta = db.sequelize.define(
  "Ruta",
  {
    id_ruta: {
      type: db.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: db.DataTypes.STRING(100),
      allowNull: false,
    },
    duracion: {
      type: db.DataTypes.STRING(50),
      allowNull: false,
      comment: "Ej: 2 horas, 3 días, etc",
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
    tableName: "ruta",
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Ruta;
