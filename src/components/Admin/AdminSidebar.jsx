import React from "react";
// Importamos todos los iconos que necesitamos para el menú
import {
  LayoutDashboard,
  Users,
  UserCog,
  Shield,
  Home,
  LogOut,
  Calendar,
} from "lucide-react";
// Importamos la función para cerrar la sesión
import { useAuth } from "../../contexts/AuthContext";

// Este es el componente de la barra lateral del administrador
const AdminSidebar = ({ activeView, setActiveView, onBackToHome }) => {
  // Obtenemos la función de logout del hook
  const { logout } = useAuth(); // Creamos la lista de elementos del menú (es un array de objetos)

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard }, // Vista principal
    { id: "reservas", label: "Gestión de Reservas", icon: Calendar }, // CRUD de Reservas
    { id: "perfiles", label: "Gestión de Perfiles", icon: Shield }, // CRUD de Perfiles
    { id: "personas", label: "Gestión de Personas", icon: Users }, // CRUD de Personas
    { id: "usuarios", label: "Gestión de Usuarios", icon: UserCog }, // CRUD de Usuarios
  ]; // Función para manejar el clic del botón de "Volver al sitio"

  const handleVolverSitio = () => {
    // Usa la función global si existe para ir al inicio
    if (window.goToHome) {
      window.goToHome();
    }
  };

  return (
    // La barra lateral con un color oscuro
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
            {/* Logo de la aplicación */}     {" "}
      <div className="p-6 border-b border-gray-700">
                <h1 className="text-2xl font-bold text-cyan-400">Sapzurro</h1> 
             {" "}
        <p className="text-sm text-gray-400 mt-1">Panel de Administración</p>   
         {" "}
      </div>
            {/* Navegación principal (la parte que se estira) */}     {" "}
      <nav className="flex-1 p-4 space-y-2">
                {/* Mapeamos el array de `menuItems` para crear los botones */} 
             {" "}
        {menuItems.map((item) => {
          // Guardamos el componente de icono en una variable (por la forma en que se importa)
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)} // Al hacer clic, cambia la vista // Ponemos la clase de color cian si es la vista activa
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeView === item.id
                  ? "bg-cyan-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
                            <Icon className="w-5 h-5" />{" "}
              {/* Muestra el icono */}             {" "}
              <span className="font-medium">{item.label}</span>{" "}
              {/* Muestra el texto del menú */}           {" "}
            </button>
          );
        })}
             {" "}
      </nav>
            {/* Sección de botones al final (Footer) */}     {" "}
      <div className="p-4 border-t border-gray-700 space-y-2">
                {/* Botón para ir al sitio web público */}       {" "}
        <button
          onClick={handleVolverSitio}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-all"
        >
                    <Home className="w-5 h-5" />         {" "}
          <span className="font-medium">Volver al sitio</span>       {" "}
        </button>
               {" "}
        {/* Botón para cerrar la sesión (es rojo para que se vea importante) */}
               {" "}
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-all"
        >
                    <LogOut className="w-5 h-5" />         {" "}
          <span className="font-medium">Cerrar sesión</span>       {" "}
        </button>
             {" "}
      </div>
         {" "}
    </aside>
  );
};

export default AdminSidebar;
