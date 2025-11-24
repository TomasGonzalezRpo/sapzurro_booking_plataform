// src/components/UserDashboard.jsx

import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import UserSidebar from "./UserSidebar";
import UserDashboardHeader from "./UserDashboardHeader";
import MisReservasContent from "./MisReservasContent";
import MiPerfilContent from "./MiPerfilContent";

const UserDashboard = ({ onBackToHome }) => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState("reservas");

  // si no hay usuario, mostrar mensaje de acceso denegado
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 mb-6">
            Debes iniciar sesión para acceder a tu dashboard
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

  // decidir qué componente mostrar según la vista activa
  const renderContent = () => {
    switch (activeView) {
      case "reservas":
        return <MisReservasContent />;
      case "perfil":
        return <MiPerfilContent />;
      default:
        return <MisReservasContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* sidebar con navegación del usuario */}
      <UserSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onBackToHome={onBackToHome}
      />

      {/* área principal: header + contenido */}
      <div className="flex-1 flex flex-col">
        <UserDashboardHeader />
        <main className="flex-1 p-8 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default UserDashboard;
