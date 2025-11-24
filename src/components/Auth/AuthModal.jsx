import React, { useState } from "react";
// Importamos el icono para cerrar el modal
import { X } from "lucide-react";
// Usamos el contexto para acceder a funciones de auth y el estado del modal
import { useAuth } from "../../contexts/AuthContext";
// Importamos los cuatro formularios posibles
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import RegisterAliadoForm from "./RegisterAliadoForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

// Este componente es el modal de autenticación que maneja login, registro, etc.
const AuthModal = () => {
  // Obtenemos las variables y funciones que necesitamos del contexto de autenticación
  const {
    isAuthModalOpen, // Para saber si el modal debe estar abierto
    closeAuthModal, // Función para cerrarlo
    login, // La función real de login
    registerUser, // La función real de registro de usuario normal
    registerAliado, // La función real de registro de aliado
  } = useAuth(); // El estado para saber qué formulario mostrar dentro del modal
  const [currentView, setCurrentView] = useState("login"); // Puede ser 'login', 'register', 'registerAliado', 'forgotPassword' // Si el modal no debe estar abierto, no renderizamos nada

  if (!isAuthModalOpen) return null; // Función para cerrar el modal

  const handleClose = () => {
    closeAuthModal(); // Damos un tiempo (delay) para que el modal se cierre antes de resetear la vista a 'login'
    setTimeout(() => setCurrentView("login"), 300);
  };

  return (
    // El fondo gris oscuro que cubre toda la pantalla (backdrop)
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           {" "}
      <div // El contenedor del formulario
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative" // Evita que al hacer clic en el formulario se cierre el modal
        onClick={(e) => e.stopPropagation()}
      >
                {/* Botón para cerrar el modal */}       {" "}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-all z-10"
        >
                    <X className="w-5 h-5 text-gray-600" />       {" "}
        </button>
               {" "}
        {/* Contenido principal donde se muestra el formulario activo */}       {" "}
        <div className="p-8">
                    {/* Muestra el LoginForm si la vista es 'login' */}         {" "}
          {currentView === "login" && (
            <LoginForm
              onLogin={login}
              onSwitchToRegister={() => setCurrentView("register")} // Función para cambiar a Registro
              onSwitchToForgotPassword={() => setCurrentView("forgotPassword")} // Función para cambiar a Olvidé Contraseña
            />
          )}
                    {/* Muestra el RegisterForm si la vista es 'register' */}   
               {" "}
          {currentView === "register" && (
            <RegisterForm
              onRegister={registerUser}
              onSwitchToLogin={() => setCurrentView("login")} // Función para volver a Login
              onSwitchToRegisterAliado={() => setCurrentView("registerAliado")} // Función para cambiar a Registro Aliado
            />
          )}
                   {" "}
          {/* Muestra el RegisterAliadoForm si la vista es 'registerAliado' */} 
                 {" "}
          {currentView === "registerAliado" && (
            <RegisterAliadoForm
              onRegisterAliado={registerAliado}
              onSwitchToLogin={() => setCurrentView("login")} // Función para volver a Login
            />
          )}
                   {" "}
          {/* Muestra el ForgotPasswordForm si la vista es 'forgotPassword' */} 
                 {" "}
          {currentView === "forgotPassword" && (
            <ForgotPasswordForm
              onSwitchToLogin={() => setCurrentView("login")} // Función para volver a Login
            />
          )}
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default AuthModal;
