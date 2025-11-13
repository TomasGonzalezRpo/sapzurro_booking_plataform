const db = require("../config/database");
const bcrypt = require("bcrypt");

const Usuario = db.sequelize.define(
  "Usuario",
  {
    id_usuario: {
      type: db.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario: {
      type: db.DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    password: {
      type: db.DataTypes.STRING(255),
      allowNull: false,
      field: "contrasena",
    },
    estado: {
      type: db.DataTypes.TINYINT,
      defaultValue: 1,
      allowNull: false,
    },
    id_persona: {
      type: db.DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "persona",
        key: "id_persona",
      },
    },
    id_perfil: {
      type: db.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "perfil",
        key: "id_perfil",
      },
    },
    resetPasswordToken: {
      type: db.DataTypes.STRING(255),
      allowNull: true,
    },
    resetPasswordExpires: {
      type: db.DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    tableName: "usuario",
    timestamps: false,
    freezeTableName: true,
    hooks: {
      // Solo hashear en creación
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
      // NO hashear en actualización (porque ya viene hasheado desde AuthController)
      // beforeUpdate, beforeSave y beforeBulkUpdate se ELIMINAN
    },
  }
);

module.exports = Usuario;
