const db = require("../config/database");

const Persona = db.sequelize.define(
  "Persona",
  {
    id_persona: {
      type: db.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
      unique: true,
      allowNull: false,
    },
    correo: {
      type: db.DataTypes.STRING(100),
      unique: true,
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
  }
);

module.exports = Persona;
