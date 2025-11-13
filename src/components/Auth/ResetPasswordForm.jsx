// src/components/Auth/ResetPasswordForm.jsx
import React, { useState, useEffect } from "react";
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import axios from "axios";

const ResetPasswordForm = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");

  // Obtener token y email de los parámetros de URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    const emailParam = params.get("email");

    setToken(tokenParam || "");
    setEmail(emailParam || "");

    if (!tokenParam || !emailParam) {
      setError("Enlace inválido o expirado");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
    if (!/[A-Z]/.test(password)) {
      return "Debe incluir al menos una mayúscula";
    }
    if (!/[a-z]/.test(password)) {
      return "Debe incluir al menos una minúscula";
    }
    if (!/[0-9]/.test(password)) {
      return "Debe incluir al menos un número";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validaciones
    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Por favor completa ambos campos");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          token,
          email,
          newPassword: formData.newPassword,
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setFormData({ newPassword: "", confirmPassword: "" });

        // Redirigir a home después de 3 segundos
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } else {
        setError(response.data.message || "Error al restablecer contraseña");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError(
        err.response?.data?.message ||
          "Error al restablecer la contraseña. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  // Si no hay token o email, mostrar error
  if (!token || !email) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Enlace Inválido</h2>
          <p className="text-gray-600 mt-2">
            El enlace de recuperación es inválido o ha expirado.
          </p>
        </div>
        <button
          onClick={() => (window.location.href = "/")}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-full mb-4">
          <Lock className="w-8 h-8 text-cyan-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">
          Restablecer Contraseña
        </h2>
        <p className="text-gray-600 mt-2">
          Crea una nueva contraseña segura para tu cuenta
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              ¡Contraseña Actualizada!
            </h3>
            <p className="text-sm text-green-700">
              Tu contraseña ha sido restablecida exitosamente. Serás redirigido
              al inicio de sesión en unos momentos...
            </p>
          </div>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nueva Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={loading}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Mínimo 8 caracteres, con mayúscula, minúscula y número
            </p>
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={loading}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-lg font-semibold transition-all shadow-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 hover:shadow-lg"
            }`}
          >
            {loading ? "Actualizando..." : "Actualizar Contraseña"}
          </button>

          {/* Link volver */}
          <button
            type="button"
            onClick={() => (window.location.href = "/")}
            className="w-full text-gray-600 hover:text-gray-800 transition-colors py-2 font-medium"
          >
            Volver al inicio
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordForm;
