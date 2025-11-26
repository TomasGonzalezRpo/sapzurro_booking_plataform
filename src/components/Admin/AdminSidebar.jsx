import React from "react";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Shield,
  Home,
  LogOut,
  Calendar,
  Bed,
  MapPin,
  Activity,
  Compass,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const AdminSidebar = ({ activeView, setActiveView, onBackToHome }) => {
  const { logout } = useAuth();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "reservas", label: "Gestión de Reservas", icon: Calendar },
    { id: "perfiles", label: "Gestión de Perfiles", icon: Shield },
    { id: "personas", label: "Gestión de Personas", icon: Users },
    { id: "usuarios", label: "Gestión de Usuarios", icon: UserCog },
  ];

  const ecoturismItems = [
    { id: "alojamientos", label: "Alojamientos", icon: Bed },
    { id: "rutas", label: "Rutas Ecoturísticas", icon: Compass },
    { id: "tipos-actividades", label: "Tipos de Actividades", icon: Activity },
    { id: "actividades", label: "Actividades", icon: MapPin },
  ];

  const handleVolverSitio = () => {
    if (window.goToHome) {
      window.goToHome();
    }
  };

  const MenuItem = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveView(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
        activeView === id
          ? "bg-cyan-600 text-white shadow-lg"
          : "text-gray-300 hover:bg-gray-700"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700 sticky top-0 bg-gray-900">
        <h1 className="text-2xl font-bold text-cyan-400">Sapzurro</h1>
        <p className="text-sm text-gray-400 mt-1">Panel de Administración</p>
      </div>

      {/* Menú */}
      <nav className="flex-1 p-4 space-y-2">
        {/* Sección Principal */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase px-4 py-2 mb-2">
            Gestión General
          </p>
          {menuItems.map((item) => (
            <MenuItem key={item.id} {...item} />
          ))}
        </div>

        {/* Sección Ecoturismo */}
        <div className="pt-6">
          <p className="text-xs font-semibold text-gray-400 uppercase px-4 py-2 mb-2">
            Ecoturismo
          </p>
          {ecoturismItems.map((item) => (
            <MenuItem key={item.id} {...item} />
          ))}
        </div>
      </nav>

      {/* Footer del sidebar */}
      <div className="p-4 border-t border-gray-700 space-y-2 sticky bottom-0 bg-gray-800">
        {/* Mi Perfil y Mis Reservas */}
        <button
          onClick={() => {
            if (window.goToUserDashboard) {
              window.goToUserDashboard("perfil");
            }
          }}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-cyan-300 hover:bg-cyan-900/20 transition-all"
        >
          <UserCog className="w-5 h-5" />
          <span className="font-medium text-sm">Mi Perfil</span>
        </button>

        <button
          onClick={() => {
            if (window.goToUserDashboard) {
              window.goToUserDashboard("reservas");
            }
          }}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-cyan-300 hover:bg-cyan-900/20 transition-all"
        >
          <Calendar className="w-5 h-5" />
          <span className="font-medium text-sm">Mis Reservas</span>
        </button>

        <button
          onClick={handleVolverSitio}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-all"
        >
          <Home className="w-5 h-5" />
          <span className="font-medium text-sm">Volver al sitio</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
