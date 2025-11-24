const db = require("../config/database"); // Importamos el objeto de conexión a la base de datos (que contiene la instancia de Sequelize y DataTypes)

// ============================================================
// DEFINICIÓN DEL MODELO PERSONA
// ============================================================

const Persona = db.sequelize.define(
  "Persona", // Nombre del modelo (usado internamente por Sequelize)
  {
    // Definición de los atributos (columnas) de la tabla 'persona'

    // Clave Primaria: id_persona
    id_persona: {
      type: db.DataTypes.INTEGER, // Tipo de dato: entero
      primaryKey: true, // Indica que es la clave primaria
      autoIncrement: true, // Indica que es autoincremental
    }, // Nombres de la persona

    nombres: {
      type: db.DataTypes.STRING(100), // Cadena de hasta 100 caracteres
      allowNull: false, // No puede ser nulo
    }, // Apellidos de la persona

    apellidos: {
      type: db.DataTypes.STRING(100), // Cadena de hasta 100 caracteres
      allowNull: false, // No puede ser nulo
    }, // Tipo de documento (Enumeración de valores permitidos)

    tipo_documento: {
      type: db.DataTypes.ENUM("CC", "CE", "TI", "PASAPORTE"), // Solo permite uno de estos valores
      allowNull: false, // No puede ser nulo
    }, // Número de identificación

    numero_documento: {
      type: db.DataTypes.STRING(20),
      allowNull: false, // No puede ser nulo
    }, // Correo electrónico

    correo: {
      type: db.DataTypes.STRING(100),
      allowNull: false, // No puede ser nulo
    }, // Teléfono de contacto (Opcional)

    telefono: {
      type: db.DataTypes.STRING(20),
      allowNull: true, // Puede ser nulo
    }, // Dirección residencial (Opcional)

    direccion: {
      type: db.DataTypes.STRING(150),
      allowNull: true, // Puede ser nulo
    }, // Estado de la Persona (Activo/Inactivo)

    estado: {
      type: db.DataTypes.TINYINT, // Entero pequeño
      defaultValue: 1, // Valor por defecto es 1 (Activo)
      allowNull: false, // No puede ser nulo
    },
  },
  {
    // Opciones del Modelo (Configuration)

    tableName: "persona", // Nombre real de la tabla en la base de datos
    timestamps: false, // Desactivar las columnas createdAt y updatedAt
    freezeTableName: true, // Evita que Sequelize pluralice automáticamente el nombre de la tabla // Definición de Índices
    indexes: [
      {
        unique: true, // El número de documento debe ser único
        fields: ["numero_documento"],
      },
      {
        unique: true, // El correo electrónico debe ser único
        fields: ["correo"],
      },
    ],
  }
);

// Exportamos el modelo para que pueda ser utilizado en otros archivos
module.exports = Persona;
