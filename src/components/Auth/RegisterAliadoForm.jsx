// src/components/Auth/RegisterAliadoForm.jsx
import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  MapPin,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const INITIAL_FORM = {
  nombres: "",
  apellidos: "",
  tipo_documento: "CC",
  numero_documento: "",
  correo: "",
  telefono: "",
  direccion: "",
  username: "",
  password: "",
  confirmPassword: "",
  nombreNegocio: "",
  tipoNegocio: "",
  descripcionNegocio: "",
};

const DOC_OPTIONS = [
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "TI", label: "Tarjeta de Identidad" },
  { value: "PASAPORTE", label: "Pasaporte" },
];

const BUSINESS_OPTIONS = [
  { value: "", label: "Selecciona un tipo" },
  { value: "Hoteles", label: "🏨 Hotel / Hospedaje" },
  { value: "Restaurantes", label: "🍽️ Restaurante" },
  { value: "Tours", label: "🏄 Tours / Actividades" },
  { value: "Lanchas", label: "🚤 Transporte / Lanchas" },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterAliadoForm = ({ onRegisterAliado, onSwitchToLogin }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (field, value) =>
    setFormData((s) => ({ ...s, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const {
      nombres,
      apellidos,
      correo,
      username,
      password,
      confirmPassword,
      nombreNegocio,
      tipoNegocio,
      numero_documento,
    } = formData;

    if (
      !nombres ||
      !apellidos ||
      !correo ||
      !username ||
      !password ||
      !nombreNegocio ||
      !tipoNegocio ||
      !numero_documento
    ) {
      setError("Por favor completa todos los campos obligatorios");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!emailRegex.test(correo)) {
      setError("Por favor ingresa un correo válido");
      return;
    }

    try {
      const result = await onRegisterAliado(formData);
      if (result.success) {
        setSuccess(result.message);
        setFormData(INITIAL_FORM); // Limpiar formulario
        setTimeout(() => onSwitchToLogin(), 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Error inesperado al registrar el aliado");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full mb-4">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">
          Registro de Aliados
        </h2>
        <p className="text-gray-600 mt-2">Inscribe tu negocio en Sapzurro</p>
      </div>

      {/* Info aprobación */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <strong>⏳ Proceso de aprobación:</strong> Tu solicitud será revisada
          por nuestro equipo en las próximas 24-48 horas. Te notificaremos por
          correo una vez sea aprobada.
        </p>
      </div>

      {/* Mensajes */}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos personales */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <User className="w-5 h-5 text-cyan-600" />
            <span>Datos Personales</span>
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              label="Nombres"
              required
              value={formData.nombres}
              onChange={(v) => handleChange("nombres", v)}
              placeholder="Juan"
            />
            <InputField
              label="Apellidos"
              required
              value={formData.apellidos}
              onChange={(v) => handleChange("apellidos", v)}
              placeholder="Pérez"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de documento
              </label>
              <select
                value={formData.tipo_documento}
                onChange={(e) => handleChange("tipo_documento", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                {DOC_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <InputField
              label="Número de documento"
              required
              value={formData.numero_documento}
              onChange={(v) => handleChange("numero_documento", v)}
              placeholder="1234567890"
            />
          </div>

          <InputField
            label="Correo electrónico"
            required
            type="email"
            value={formData.correo}
            onChange={(v) => handleChange("correo", v)}
            placeholder="negocio@email.com"
          />
          <InputField
            label="Teléfono"
            value={formData.telefono}
            onChange={(v) => handleChange("telefono", v)}
            placeholder="3001234567"
          />
          <InputField
            label="Dirección"
            value={formData.direccion}
            onChange={(v) => handleChange("direccion", v)}
            placeholder="Calle principal, Sapzurro"
          />
        </div>

        {/* Datos del negocio */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <span>Datos del Negocio</span>
          </h3>

          <InputField
            label="Nombre del negocio"
            required
            value={formData.nombreNegocio}
            onChange={(v) => handleChange("nombreNegocio", v)}
            placeholder="Hotel Paraíso del Mar"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de negocio <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.tipoNegocio}
              onChange={(e) => handleChange("tipoNegocio", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              {BUSINESS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del negocio
            </label>
            <textarea
              value={formData.descripcionNegocio}
              onChange={(e) =>
                handleChange("descripcionNegocio", e.target.value)
              }
              placeholder="Describe tu negocio, servicios que ofreces, etc."
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Credenciales */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Lock className="w-5 h-5 text-cyan-600" />
            <span>Credenciales de Acceso</span>
          </h3>

          <InputField
            label="Nombre de usuario"
            required
            value={formData.username}
            onChange={(v) => handleChange("username", v)}
            placeholder="hotelparaiso"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              label="Contraseña"
              required
              type="password"
              value={formData.password}
              onChange={(v) => handleChange("password", v)}
              placeholder="••••••••"
            />
            <InputField
              label="Confirmar contraseña"
              required
              type="password"
              value={formData.confirmPassword}
              onChange={(v) => handleChange("confirmPassword", v)}
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
        >
          Enviar Solicitud
        </button>
      </form>

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

/* --- pequeños helpers locales --- */
function InputField({ label, required, value, onChange, placeholder, type }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type || "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />
    </div>
  );
}

export default RegisterAliadoForm;
