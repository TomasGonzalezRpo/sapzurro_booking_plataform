import React, { useState } from "react";
import { Mail, Lock, AlertCircle } from "lucide-react";
// 🎯 Importar el hook de autenticación
import { useAuth } from "../../contexts/AuthContext"; // Asegúrate de que la ruta sea correcta

const LoginForm = ({ onSwitchToRegister, onSwitchToForgotPassword }) => {
  // 🎯 Obtener la función de login y el estado de carga del contexto
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    // 🎯 Hacer la función asíncrona
    e.preventDefault();
    setError("");

    // Validaciones básicas
    if (!formData.email || !formData.password) {
      setError("Por favor completa todos los campos");
      return;
    }

    // ❌ ELIMINAR la simulación de usuariosPrueba y su lógica de búsqueda.

    try {
      // 🎯 Llama a la función de login del contexto
      await login(formData.email, formData.password);

      // Si es exitoso, el contexto (AuthContext.jsx) se encargó de cerrar el modal y establecer el usuario.
    } catch (err) {
      // 🎯 Captura el error de la autenticación (ej: correo/contraseña incorrectos)
      setError(err.message || "Error al iniciar sesión. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h2>
        <p className="text-gray-600 mt-2">Accede a tu cuenta de Sapzurro</p>
      </div>

      {/* ❌ RECOMENDACIÓN: Eliminar el div de 'Usuarios de prueba' antes de la entrega final */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-blue-800 mb-2">
          👤 Usuarios de prueba (para la simulación de AuthContext):
        </p>
        <div className="text-xs text-blue-700 space-y-1">
          <p>
            <strong>Admin:</strong> test@admin.com / 123
          </p>
          <p>
            <strong>Inactivo (Error):</strong> inactivo@test.com / clave123
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              disabled={loading} // 🎯 Deshabilitar mientras carga
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading} // 🎯 Deshabilitar mientras carga
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={onSwitchToForgotPassword}
            className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading} // 🎯 Deshabilitar si está cargando
          className={`w-full text-white py-3 rounded-lg font-semibold transition-all shadow-md ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 hover:shadow-lg"
          }`}
        >
          {/* 🎯 Mostrar estado de carga */}
          {loading ? "Iniciando Sesión..." : "Iniciar Sesión"}
        </button>
      </form>

      <div className="text-center text-sm text-gray-600">
        ¿No tienes cuenta?{" "}
        <button
          onClick={onSwitchToRegister}
          className="text-cyan-600 hover:text-cyan-700 font-semibold"
        >
          Regístrate aquí
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
