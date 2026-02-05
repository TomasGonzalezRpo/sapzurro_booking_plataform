// backend/models/Usuario.js
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
    // El campo 'password' mapea a la columna 'contrasena' en la base de datos
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
      beforeSave: async (usuario) => {
        // Solo hashear si el campo password ha cambiado Y NO es ya un hash
        if (usuario.changed("password")) {
          // Si el password ya empieza con el prefijo de bcrypt, no lo vuelvas a hashear
          if (!usuario.password.startsWith("$2b$")) {
            console.log("🔒 Hasheando contraseña plana en el Modelo...");
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);
          } else {
            console.log(
              "⏭️ La contraseña ya es un hash, saltando doble hasheo.",
            );
          }
        }
      },
    },
  },
);

module.exports = Usuario;
