import React, { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HotelesSection from "./components/HotelesSection";
import RestaurantesSection from "./components/RestaurantesSection";
import Footer from "./components/Footer";
import AuthModal from "./components/Auth/AuthModal";
import AdminPanel from "./components/Admin/AdminPanel";
import ResetPasswordForm from "./components/Auth/ResetPasswordForm";

const App = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Detectar si estamos en la ruta /reset-password
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/reset-password") {
      setShowResetPassword(true);
    } else {
      setShowResetPassword(false);
    }
  }, []);

  // Mostrar función global para cambiar a vista admin
  useEffect(() => {
    window.goToAdmin = () => setIsAdminView(true);
    window.goToHome = () => setIsAdminView(false);

    return () => {
      delete window.goToAdmin;
      delete window.goToHome;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const menuItems = [
    { id: "inicio", label: "Inicio" },
    { id: "hoteles", label: "Hoteles" },
    { id: "restaurantes", label: "Restaurantes" },
    { id: "actividades", label: "Actividades" },
    { id: "flora-fauna", label: "Flora y Fauna" },
    { id: "clima", label: "Clima" },
    { id: "sobre-sapzurro", label: "Sobre Sapzurro" },
  ];

  // 🆕 Si está en /reset-password, mostrar SOLO el formulario de reset
  if (showResetPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-8">
          <ResetPasswordForm />
        </div>
      </div>
    );
  }

  // Si está en vista admin se muestra AdminPanel
  if (isAdminView) {
    return <AdminPanel onBackToHome={() => setIsAdminView(false)} />;
  }

  // Vista pública normal
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50">
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        isScrolled={isScrolled}
      />

      <Hero scrollToSection={scrollToSection} />

      <HotelesSection />

      <RestaurantesSection />

      {/* Placeholder Sections */}
      {menuItems.slice(3).map((item) => (
        <section
          key={item.id}
          id={item.id}
          className="py-20 px-4"
          style={{ minHeight: "400px" }}
        >
          <div className="container mx-auto">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                {item.label}
              </h2>
              <p className="text-gray-600">Sección en desarrollo...</p>
            </div>
          </div>
        </section>
      ))}

      <Footer />

      {/* Modal de autenticación */}
      <AuthModal />
    </div>
  );
};

export default App;
