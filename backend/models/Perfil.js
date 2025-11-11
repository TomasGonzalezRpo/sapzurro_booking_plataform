const db = require("../config/database");

const Perfil = db.sequelize.define(
  "Perfil",
  {
    id_perfil: {
      type: db.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: db.DataTypes.STRING(50),
      allowNull: false,
    },
    descripcion: {
      type: db.DataTypes.STRING(200),
      allowNull: true,
    },
    estado: {
      type: db.DataTypes.TINYINT,
      defaultValue: 1,
      allowNull: false,
    },
  },
  {
    tableName: "perfil",
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Perfil;
