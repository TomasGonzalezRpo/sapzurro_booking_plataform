const db = require("../config/database"); // Importamos el objeto de conexión a la base de datos (que contiene la instancia de Sequelize y DataTypes)

// ============================================================
// DEFINICIÓN DEL MODELO PERFIL
// ============================================================

const Perfil = db.sequelize.define(
  "Perfil", // Nombre del modelo (usado internamente por Sequelize)
  {
    // Definición de los atributos (columnas) de la tabla 'perfil'

    // Clave Primaria: id_perfil
    id_perfil: {
      type: db.DataTypes.INTEGER, // Tipo de dato: entero
      primaryKey: true, // Indica que es la clave primaria
      autoIncrement: true, // Indica que es autoincremental
    }, // Nombre del Perfil (ej: Administrador, Cliente)

    nombre: {
      type: db.DataTypes.STRING(50), // Cadena de hasta 50 caracteres
      allowNull: false, // No puede ser nulo (campo obligatorio)
    }, // Descripción detallada del Perfil

    descripcion: {
      type: db.DataTypes.STRING(200), // Cadena de hasta 200 caracteres
      allowNull: true, // Puede ser nulo
    }, // Estado del Perfil (Activo/Inactivo)

    estado: {
      type: db.DataTypes.TINYINT, // Entero pequeño (generalmente 1 para activo, 0 para inactivo)
      defaultValue: 1, // Valor por defecto es 1 (Activo)
      allowNull: false, // No puede ser nulo
    },
  },
  {
    // Opciones del Modelo (Configuration)

    tableName: "perfil", // Nombre real de la tabla en la base de datos
    timestamps: false, // Desactivar las columnas createdAt y updatedAt
    freezeTableName: true, // Evita que Sequelize pluralice automáticamente el nombre de la tabla
  }
);

// Exportamos el modelo para que pueda ser utilizado en otros archivos (ej: index.js de modelos)
module.exports = Perfil;
