import React, { useState } from "react";
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const ForgotPasswordForm = ({ onSwitchToLogin }) => {
  const { recoverCredentials, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    // 🎯 Hacer la función asíncrona
    e.preventDefault();
    setError("");
    setSuccess(false);

    // 1. Validaciones de UI
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError("Por favor ingresa tu correo electrónico");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Por favor ingresa un correo válido");
      return;
    }

    // 2. Llamada a la lógica real del contexto
    try {
      await recoverCredentials(email);

      // Si la llamada es exitosa, mostrar mensaje de éxito.
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Ocurrió un error al intentar la recuperación.");
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onSwitchToLogin}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Volver al inicio de sesión</span>
      </button>

      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-full mb-4">
          <Mail className="w-8 h-8 text-cyan-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">
          ¿Olvidaste tu contraseña?
        </h2>
        <p className="text-gray-600 mt-2">
          No te preocupes, te enviaremos tu usuario y contraseña.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              ¡Correo enviado!
            </h3>
            {/* 🎯 Mensaje que cumple con el requisito del parcial */}
            <p className="text-sm text-green-700">
              Su **usuario y contraseña** fue enviado al correo registrado:{" "}
              <strong>{email}</strong>
            </p>
            <p className="text-sm text-green-700 mt-2">
              Por favor revisa tu bandeja de entrada y tu carpeta de spam.
            </p>
          </div>

          <button
            onClick={onSwitchToLogin}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
          >
            Volver al inicio de sesión
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                // 🎯 Deshabilitar mientras esté cargando
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Ingresa el correo con el que te registraste
            </p>
          </div>

          <button
            type="submit"
            // 🎯 Deshabilitar si está cargando
            disabled={loading}
            className={`w-full text-white py-3 rounded-lg font-semibold transition-all shadow-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 hover:shadow-lg"
            }`}
          >
            {/* 🎯 Mostrar estado de carga */}
            {loading ? "Enviando..." : "Enviar usuario y contraseña"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
