import React from "react";
import { Bell, Settings } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const AdminHeader = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Panel de Administración
          </h2>
          <p className="text-sm text-gray-500">
            Gestiona todo el sistema de Sapzurro
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notificaciones */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Configuración */}
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all">
            <Settings className="w-6 h-6" />
          </button>

          {/* Usuario */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {user?.nombres?.charAt(0)}
                {user?.apellidos?.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {user?.nombres} {user?.apellidos}
              </p>
              <p className="text-xs text-gray-500">{user?.rol}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
