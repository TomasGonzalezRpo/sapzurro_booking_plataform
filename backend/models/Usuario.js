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
    },
    estado: {
      type: db.DataTypes.TINYINT,
      defaultValue: 1,
      allowNull: false,
    }, // CLAVES FORÁNEAS
    id_persona: {
      type: db.DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Un usuario solo puede estar asociado a una persona (1:1)
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
  },
  {
    tableName: "usuario",
    timestamps: false,
    freezeTableName: true,
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
    },
  }
);

module.exports = Usuario;
