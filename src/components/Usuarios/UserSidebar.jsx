// src/components/UserSidebar.jsx

import React from "react";
import { Calendar, User, Home, LogOut, Waves } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const UserSidebar = ({ activeView, setActiveView, onBackToHome }) => {
  const { logout } = useAuth();

  const menuItems = [
    { id: "reservas", label: "Mis Reservas", icon: Calendar },
    { id: "perfil", label: "Mi Perfil", icon: User },
  ];

  const handleVolverSitio = () => {
    if (window.goToHome) {
      window.goToHome();
    }
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-cyan-600 to-blue-700 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-cyan-500/30">
        <div className="flex items-center space-x-2 mb-2">
          <Waves className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Sapzurro</h1>
        </div>
        <p className="text-sm text-cyan-100">Mi Dashboard</p>
      </div>

      {/* Menú */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeView === item.id
                  ? "bg-white text-cyan-600 shadow-lg font-semibold"
                  : "text-cyan-100 hover:bg-cyan-500/20"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer del sidebar */}
      <div className="p-4 border-t border-cyan-500/30 space-y-2">
        <button
          onClick={handleVolverSitio}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-cyan-100 hover:bg-cyan-500/20 transition-all"
        >
          <Home className="w-5 h-5" />
          <span>Volver al sitio</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-200 hover:bg-red-500/20 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;
