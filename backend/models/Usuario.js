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
      field: "contrasena", // <--- ¡MODIFICACIÓN CLAVE! Mapea 'password' a la columna 'contrasena'
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
    }, // 🎯 NUEVO: Campo para la Expiración del Token (en milisegundos Unix)
    resetPasswordExpires: {
      type: db.DataTypes.BIGINT, // Usamos BIGINT o DATE, BIGINT es común para milisegundos
      allowNull: true,
    },
  },
  {
    tableName: "usuario",
    timestamps: false,
    freezeTableName: true,
    hooks: {
      // hashing en creación
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      }, // hashing para actualizaciones por instancia (se dispara con instance.save())
      beforeUpdate: async (usuario) => {
        if (
          typeof usuario.changed === "function" &&
          usuario.changed("password")
        ) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      }, // cobertura adicional: antes de save (create + update por instancia)
      beforeSave: async (usuario) => {
        if (
          typeof usuario.changed === "function" &&
          usuario.changed("password")
        ) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      }, // si usas Model.update(...) sin individualHooks, aquí se intercepta
      beforeBulkUpdate: async (options) => {
        if (options.attributes && options.attributes.password) {
          const salt = await bcrypt.genSalt(10);
          options.attributes.password = await bcrypt.hash(
            options.attributes.password,
            salt
          );
        }
      },
    },
  }
);

module.exports = Usuario;
