import React from "react";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Shield,
  Home,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const AdminSidebar = ({ activeView, setActiveView, onBackToHome }) => {
  const { logout } = useAuth();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "perfiles", label: "Gestión de Perfiles", icon: Shield },
    { id: "personas", label: "Gestión de Personas", icon: Users },
    { id: "usuarios", label: "Gestión de Usuarios", icon: UserCog },
  ];

  const handleVolverSitio = () => {
    if (window.goToHome) {
      window.goToHome();
    }
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-cyan-400">Sapzurro</h1>
        <p className="text-sm text-gray-400 mt-1">Panel de Administración</p>
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
                  ? "bg-cyan-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer del sidebar */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <button
          onClick={handleVolverSitio}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-all"
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Volver al sitio</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
