import React, { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import RegisterAliadoForm from "./RegisterAliadoForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

const AuthModal = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    login,
    registerUser,
    registerAliado,
  } = useAuth();
  const [currentView, setCurrentView] = useState("login"); // 'login', 'register', 'registerAliado', 'forgotPassword'

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    closeAuthModal();
    // Resetear a login después de un delay
    setTimeout(() => setCurrentView("login"), 300);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-all z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Contenido del modal */}
        <div className="p-8">
          {currentView === "login" && (
            <LoginForm
              onLogin={login}
              onSwitchToRegister={() => setCurrentView("register")}
              onSwitchToForgotPassword={() => setCurrentView("forgotPassword")}
            />
          )}

          {currentView === "register" && (
            <RegisterForm
              onRegister={registerUser}
              onSwitchToLogin={() => setCurrentView("login")}
              onSwitchToRegisterAliado={() => setCurrentView("registerAliado")}
            />
          )}

          {currentView === "registerAliado" && (
            <RegisterAliadoForm
              onRegisterAliado={registerAliado}
              onSwitchToLogin={() => setCurrentView("login")}
            />
          )}

          {currentView === "forgotPassword" && (
            <ForgotPasswordForm
              onSwitchToLogin={() => setCurrentView("login")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
