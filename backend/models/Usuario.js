const db = require("../config/database"); // Importamos el objeto de conexión a la base de datos (Sequelize y DataTypes)
const bcrypt = require("bcrypt"); // Importamos bcrypt para hashear las contraseñas

// ============================================================
// DEFINICIÓN DEL MODELO USUARIO
// ============================================================

const Usuario = db.sequelize.define(
  "Usuario", // Nombre del modelo
  {
    // Definición de los atributos (columnas) de la tabla 'usuario'

    // Clave Primaria: id_usuario
    id_usuario: {
      type: db.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    }, // Nombre de usuario (login)

    usuario: {
      type: db.DataTypes.STRING(50),
      unique: true, // Debe ser único en la tabla
      allowNull: false,
    }, // Contraseña (guardada hasheada)

    password: {
      type: db.DataTypes.STRING(255), // String largo para almacenar el hash
      allowNull: false,
      field: "contrasena", // Especifica que el nombre de la columna en la BD es 'contrasena'
    }, // Estado del Usuario (Activo/Inactivo)

    estado: {
      type: db.DataTypes.TINYINT,
      defaultValue: 1, // Valor por defecto es 1 (Activo)
      allowNull: false,
    }, // Clave Foránea: id_persona (Relación 1:1 con Persona)

    id_persona: {
      type: db.DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Un usuario solo puede estar asociado a una persona, y viceversa
      references: {
        model: "persona", // Nombre de la tabla a la que referencia
        key: "id_persona", // Clave primaria de la tabla referenciada
      },
    }, // Clave Foránea: id_perfil (Rol) (Relación N:1 con Perfil)

    id_perfil: {
      type: db.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "perfil", // Nombre de la tabla a la que referencia
        key: "id_perfil",
      },
    }, // Campo para almacenar el token de recuperación de contraseña

    resetPasswordToken: {
      type: db.DataTypes.STRING(255),
      allowNull: true,
    }, // Campo para almacenar la fecha/hora de expiración del token (timestamp)

    resetPasswordExpires: {
      type: db.DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    // Opciones del Modelo

    tableName: "usuario", // Nombre real de la tabla en la base de datos
    timestamps: false, // Desactivar las columnas createdAt y updatedAt
    freezeTableName: true, // Evitar la pluralización del nombre de la tabla // Ganchos (Hooks) para lógica antes/después de operaciones de BD
    hooks: {
      // Hook que se ejecuta ANTES de crear un nuevo registro de usuario
      beforeCreate: async (usuario) => {
        // Solo hashear si se proporcionó una contraseña
        if (usuario.password) {
          // Generar una "sal" (salt) para mejorar la seguridad del hash
          const salt = await bcrypt.genSalt(10); // Aplicar el hash a la contraseña usando la sal
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      }, // NOTA: Se eliminan hooks de actualización para evitar re-hashear una contraseña // que ya viene hasheada desde el AuthController/UpdateController.
    },
  }
);

// Exportamos el modelo para que pueda ser utilizado en otros archivos
module.exports = Usuario;
