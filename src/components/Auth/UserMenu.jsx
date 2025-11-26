import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Calendar,
  Settings,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // Determinar color del badge según el rol
  const getBadgeColor = () => {
    switch (user.rol) {
      case "Administrador":
      case "Admin":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "Aliado":
        return "bg-emerald-100 text-emerald-700 border-emerald-300";
      default:
        return "bg-blue-100 text-blue-700 border-blue-300";
    }
  };

  // Verificar si es admin (acepta "Admin" o "Administrador")
  const isAdmin = user.rol === "Administrador" || user.rol === "Admin";
  const isAliado = user.rol === "Aliado";
  const isAdminOrAliado = isAdmin || isAliado;

  return (
    <div className="relative" ref={menuRef}>
      {/* Botón del menú */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-white hover:bg-gray-50 px-4 py-2 rounded-full border-2 border-gray-200 transition-all shadow-sm hover:shadow-md"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-gray-800">
            {user.nombres} {user.apellidos}
          </p>
          <p className="text-xs text-gray-500">{user.rol}</p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-600 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
          {/* Header del menú */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  {user.nombres} {user.apellidos}
                </p>
                <p className="text-sm text-gray-500">{user.correo}</p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full border ${getBadgeColor()}`}
                >
                  {user.rol}
                </span>
              </div>
            </div>
          </div>

          {/* Opciones del menú */}
          <div className="py-2">
            {/* Panel de control (solo para Admin y Aliado) */}
            {isAdminOrAliado && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (window.goToAdmin) {
                    window.goToAdmin();
                  }
                }}
                className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all flex items-center space-x-3 group"
              >
                <LayoutDashboard className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-gray-800">Panel de Control</p>
                  <p className="text-xs text-gray-500">
                    Gestiona tu {isAdmin ? "plataforma" : "negocio"}
                  </p>
                </div>
              </button>
            )}

            {/* Mi Perfil */}
            <button
              onClick={() => {
                setIsOpen(false);
                if (window.goToUserDashboard) {
                  window.goToUserDashboard("perfil");
                }
              }}
              className="w-full px-4 py-3 text-left hover:bg-cyan-50 transition-all flex items-center space-x-3 group"
            >
              <Settings className="w-5 h-5 text-cyan-600 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-medium text-gray-800">Mi Perfil</p>
                <p className="text-xs text-gray-500">
                  Ver y editar información
                </p>
              </div>
            </button>

            {/* Mis Reservas */}
            <button
              onClick={() => {
                setIsOpen(false);
                if (window.goToUserDashboard) {
                  window.goToUserDashboard("reservas");
                }
              }}
              className="w-full px-4 py-3 text-left hover:bg-cyan-50 transition-all flex items-center space-x-3 group"
            >
              <Calendar className="w-5 h-5 text-cyan-600 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-medium text-gray-800">Mis Reservas</p>
                <p className="text-xs text-gray-500">
                  Ver historial de reservas
                </p>
              </div>
            </button>
          </div>

          {/* Cerrar sesión */}
          <div className="border-t border-gray-200 pt-2">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left hover:bg-red-50 transition-all flex items-center space-x-3 group"
            >
              <LogOut className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-medium text-red-600">Cerrar Sesión</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
