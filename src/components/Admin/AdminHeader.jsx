import React from "react";
// Importamos los iconos que necesitamos
import { Bell, Settings } from "lucide-react";
// Importamos la función para obtener la info del usuario
import { useAuth } from "../../contexts/AuthContext";

// Este componente es la cabecera (header) de la página de administración
const AdminHeader = () => {
  // Usamos el hook de autenticación para saber quién es el usuario
  const { user } = useAuth();

  return (
    // El div principal que actúa como la barra de navegación superior
    <header className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
           {" "}
      <div className="flex items-center justify-between">
                {/* Sección del título principal */}       {" "}
        <div>
                   {" "}
          <h2 className="text-2xl font-bold text-gray-800">
                        Panel de Administración          {" "}
          </h2>
                   {" "}
          <p className="text-sm text-gray-500">
                        Gestiona todo el sistema de Sapzurro          {" "}
          </p>
                 {" "}
        </div>
                {/* Contenedor para los iconos y el perfil del usuario */}     
         {" "}
        <div className="flex items-center space-x-4">
                    {/* Botón de Notificaciones */}         {" "}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                        <Bell className="w-6 h-6" />           {" "}
            {/* El punto rojo que indica que hay notificaciones nuevas */}     
                 {" "}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                     {" "}
          </button>
                    {/* Botón de Configuración */}         {" "}
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                        <Settings className="w-6 h-6" />         {" "}
          </button>
                    {/* Contenedor de la información del usuario */}         {" "}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                       {" "}
            {/* Avatar o foto del usuario (círculo con iniciales) */}           {" "}
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                           {" "}
              <span className="text-white font-bold">
                               {" "}
                {/* Muestra la primera letra del nombre y la primera del apellido */}
                                {user?.nombres?.charAt(0)}               {" "}
                {user?.apellidos?.charAt(0)}             {" "}
              </span>
                         {" "}
            </div>
                        {/* Nombre y Rol del usuario */}           {" "}
            <div>
                           {" "}
              <p className="text-sm font-semibold text-gray-800">
                                {/* Muestra el nombre completo */}             
                  {user?.nombres} {user?.apellidos}             {" "}
              </p>
                            <p className="text-xs text-gray-500">{user?.rol}</p>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </header>
  );
};

export default AdminHeader;
