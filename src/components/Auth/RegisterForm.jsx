// src/components/Auth/RegisterForm.jsx
import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const RegisterForm = ({
  onRegister,
  onSwitchToLogin,
  onSwitchToRegisterAliado,
}) => {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    tipo_documento: "CC",
    numero_documento: "",
    correo: "",
    telefono: "",
    username: "",
    password: "",
    confirmPassword: "",
    id_tipo_persona: 1, // ← NUEVO: Default Local
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Tipos de personas disponibles
  const tiposPersona = [
    { id: 1, nombre: "Local", descripcion: "Visitante local de Sapzurro" },
    { id: 2, nombre: "Visitante Nacional", descripcion: "Turista colombiano" },
    {
      id: 3,
      nombre: "Visitante Extranjero",
      descripcion: "Turista internacional",
    },
    { id: 4, nombre: "Grupo", descripcion: "Más de 3 personas" },
    {
      id: 5,
      nombre: "Escuela/Universidad",
      descripcion: "Estudiantes en excursión",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones
    if (
      !formData.nombres ||
      !formData.apellidos ||
      !formData.correo ||
      !formData.username ||
      !formData.password
    ) {
      setError("Por favor completa todos los campos obligatorios");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setError("Por favor ingresa un correo válido");
      return;
    }

    try {
      // Llamada asíncrona a onRegister
      const result = await onRegister(formData);

      if (result.success) {
        setSuccess(result.message || "Usuario creado con éxito");
        // Limpiar formulario
        setFormData({
          nombres: "",
          apellidos: "",
          tipo_documento: "CC",
          numero_documento: "",
          correo: "",
          telefono: "",
          username: "",
          password: "",
          confirmPassword: "",
          id_tipo_persona: 1,
        });
      } else {
        setError(result.message || "Error al crear usuario");
      }
    } catch (err) {
      console.error("Error en el registro:", err);
      setError("Ocurrió un error al crear el usuario");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800">Crear Cuenta</h2>
        <p className="text-gray-600 mt-2">Únete a la comunidad de Sapzurro</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de Persona - NUEVO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ¿Qué tipo de visitante eres? <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.id_tipo_persona}
            onChange={(e) =>
              setFormData({
                ...formData,
                id_tipo_persona: parseInt(e.target.value),
              })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            {tiposPersona.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre} - {tipo.descripcion}
              </option>
            ))}
          </select>
        </div>

        {/* Nombres y Apellidos */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombres <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.nombres}
                onChange={(e) =>
                  setFormData({ ...formData, nombres: e.target.value })
                }
                placeholder="Juan"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apellidos <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.apellidos}
              onChange={(e) =>
                setFormData({ ...formData, apellidos: e.target.value })
              }
              placeholder="Pérez"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tipo y Número de Documento */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de documento
            </label>
            <select
              value={formData.tipo_documento}
              onChange={(e) =>
                setFormData({ ...formData, tipo_documento: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="PASAPORTE">Pasaporte</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de documento
            </label>
            <input
              type="text"
              value={formData.numero_documento}
              onChange={(e) =>
                setFormData({ ...formData, numero_documento: e.target.value })
              }
              placeholder="1234567890"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={formData.correo}
              onChange={(e) =>
                setFormData({ ...formData, correo: e.target.value })
              }
              placeholder="tu@email.com"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) =>
                setFormData({ ...formData, telefono: e.target.value })
              }
              placeholder="3001234567"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de usuario <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="juanperez"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Contraseñas */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
        >
          Crear Cuenta
        </button>
      </form>

      {/* Botón para aliados */}
      <div className="border-t pt-4">
        <button
          onClick={onSwitchToRegisterAliado}
          className="w-full bg-gradient-to-r from-emerald-100 to-cyan-100 border-2 border-emerald-300 text-emerald-700 py-3 rounded-lg font-semibold hover:from-emerald-200 hover:to-cyan-200 transition-all flex items-center justify-center space-x-2"
        >
          <span>🏨</span>
          <span>¿Tienes un negocio en Sapzurro? Inscríbelo con nosotros</span>
        </button>
      </div>

      <div className="text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{" "}
        <button
          onClick={onSwitchToLogin}
          className="text-cyan-600 hover:text-cyan-700 font-semibold"
        >
          Inicia sesión aquí
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
