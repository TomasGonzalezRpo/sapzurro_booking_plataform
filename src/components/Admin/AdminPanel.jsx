import React, { useState } from "react";
// Importamos la función para saber quién es el usuario logueado
import { useAuth } from "../../contexts/AuthContext";
// Importamos todos los componentes que forman el panel
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import Dashboard from "./Dashboard";
// Importamos las vistas CRUD para cada tabla
import PerfilManagement from "./CRUD/PerfilManagement";
import PersonaManagement from "./CRUD/PersonaManagement";
import UsuarioManagement from "./CRUD/UsuarioManagement";
import ReservasManagement from "./CRUD/ReservasManagement";

// Este es el componente principal que une todas las partes del panel
const AdminPanel = ({ onBackToHome }) => {
  // Obtenemos el usuario de la sesión
  const { user } = useAuth(); // Usamos un estado para saber qué sección del menú se está viendo. Por defecto, el dashboard.
  const [activeView, setActiveView] = useState("dashboard"); // --- Bloque de Seguridad --- // Verificamos si el usuario no existe o si no es "Administrador"

  if (!user || user.rol !== "Administrador") {
    // Si no tiene permisos, mostramos este mensaje de error bonito
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
               {" "}
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
                   {" "}
          <h2 className="text-2xl font-bold text-red-600 mb-4">
                        Acceso Denegado          {" "}
          </h2>
                   {" "}
          <p className="text-gray-600 mb-6">
                        No tienes permisos para acceder al panel de
            administración          {" "}
          </p>
                   {" "}
          <button
            onClick={() => {
              // Esto es para volver a la página de inicio, creo que es global
              if (window.goToHome) {
                window.goToHome();
              }
            }}
            className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition-all"
          >
                        Volver al inicio          {" "}
          </button>
                 {" "}
        </div>
             {" "}
      </div>
    );
  } // Función que decide qué componente mostrar según el valor de `activeView`

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />; // La página principal con gráficos
      case "perfiles":
        return <PerfilManagement />; // Gestionar los perfiles
      case "personas":
        return <PersonaManagement />; // Gestionar las personas
      case "usuarios":
        return <UsuarioManagement />; // Gestionar los accesos de usuarios
      case "reservas":
        return <ReservasManagement />; // Gestionar las reservas de los clientes
      default:
        return <Dashboard />; // Si no encuentra nada, vuelve al dashboard
    }
  }; // El diseño principal del panel de administrador

  return (
    <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar (menú lateral) */}
           {" "}
      <AdminSidebar
        activeView={activeView}
        setActiveView={setActiveView} // Pasa la función para cambiar la vista
        onBackToHome={onBackToHome}
      />
            {/* Contenedor para el header y el contenido que cambia */}     {" "}
      <div className="flex-1 flex flex-col">
                {/* Header (barra superior) */}
                <AdminHeader />       {" "}
        {/* Área principal donde se muestra la vista seleccionada */}       {" "}
        <main className="flex-1 p-8 overflow-y-auto">{renderContent()}</main>   
         {" "}
      </div>
         {" "}
    </div>
  );
};

export default AdminPanel;
