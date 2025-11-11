import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import Dashboard from "./Dashboard";
import PerfilManagement from "./CRUD/PerfilManagement";
import PersonaManagement from "./CRUD/PersonaManagement";
import UsuarioManagement from "./CRUD/UsuarioManagement";

const AdminPanel = ({ onBackToHome }) => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState("dashboard");

  // Verificar que sea administrador
  if (!user || user.rol !== "Administrador") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 mb-6">
            No tienes permisos para acceder al panel de administración
          </p>
          <button
            onClick={() => {
              if (window.goToHome) {
                window.goToHome();
              }
            }}
            className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition-all"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Renderizar vista según activeView
  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "perfiles":
        return <PerfilManagement />;
      case "personas":
        return <PersonaManagement />;
      case "usuarios":
        return <UsuarioManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <AdminSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onBackToHome={onBackToHome}
      />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AdminHeader />

        {/* Contenido */}
        <main className="flex-1 p-8 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminPanel;
