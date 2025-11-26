// backend/models/Actividad.js
const db = require("../config/database");

const Actividad = db.sequelize.define(
  "Actividad",
  {
    id_actividad: {
      type: db.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_persona: {
      type: db.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "persona",
        key: "id_persona",
      },
      comment: "Persona visitante que realiza la actividad",
    },
    id_tipo_actividad: {
      type: db.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tipo_actividad",
        key: "id_tipo_actividad",
      },
    },
    id_alojamiento: {
      type: db.DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "alojamiento",
        key: "id_alojamiento",
      },
      comment: "Alojamiento donde se hospeda el visitante",
    },
    id_ruta: {
      type: db.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ruta",
        key: "id_ruta",
      },
    },
    fecha: {
      type: db.DataTypes.DATE,
      allowNull: false,
    },
    hora: {
      type: db.DataTypes.TIME,
      allowNull: false,
    },
    observaciones: {
      type: db.DataTypes.TEXT,
      allowNull: true,
    },
    total_pagar: {
      type: db.DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Total a pagar por la actividad",
    },
    estado: {
      type: db.DataTypes.ENUM(
        "Pendiente",
        "Confirmada",
        "Completada",
        "Cancelada"
      ),
      defaultValue: "Pendiente",
      allowNull: false,
    },
  },
  {
    tableName: "actividad",
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Actividad;
