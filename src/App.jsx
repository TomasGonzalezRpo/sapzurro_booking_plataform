// src/App.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HotelesSection from "./components/HotelesSection";
import RestaurantesSection from "./components/RestaurantesSection";
import Footer from "./components/Footer";
import AuthModal from "./components/Auth/AuthModal";
import AdminPanel from "./components/Admin/AdminPanel";
import UserDashboard from "./components/Usuarios/UserDashboard"; // 🔑 IMPORTAR
import ResetPasswordForm from "./components/Auth/ResetPasswordForm";
import ActivitiesCard from "./components/ActivitiesCard.jsx";
import RutaCard from "./components/RutaCard.jsx";
import RutaDetailModal from "./components/RutaDetailModal";
import { activities } from "./data/Activities.js";
import { rutasTuristicas } from "./data/rutasData.js";
import { Compass } from "lucide-react";

const App = () => {
  const { user } = useAuth();

  // Estados para rutas
  const [selectedRuta, setSelectedRuta] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isUserDashboardView, setIsUserDashboardView] = useState(false); // 🔑 NUEVO
  const [showResetPassword, setShowResetPassword] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    setShowResetPassword(path === "/reset-password");
  }, []);

  // 🔑 FUNCIONES GLOBALES PARA NAVEGACIÓN
  useEffect(() => {
    window.goToAdmin = () => setIsAdminView(true);
    window.goToHome = () => {
      setIsAdminView(false);
      setIsUserDashboardView(false);
    };
    window.goToUserDashboard = () => {
      setIsUserDashboardView(true);
    };

    return () => {
      delete window.goToAdmin;
      delete window.goToHome;
      delete window.goToUserDashboard;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Manejadores del modal de ruta
  const handleOpenRutaModal = (ruta) => {
    setSelectedRuta(ruta);
  };

  const handleCloseRutaModal = () => {
    setSelectedRuta(null);
  };

  const menuItems = [
    { id: "inicio", label: "Inicio" },
    { id: "hoteles", label: "Hoteles" },
    { id: "restaurantes", label: "Restaurantes" },
    { id: "actividades", label: "Actividades" },
    { id: "rutas", label: "Rutas" },
    { id: "flora-fauna", label: "Flora y Fauna" },
    { id: "clima", label: "Clima" },
    { id: "sobre-sapzurro", label: "Sobre Sapzurro" },
  ];

  // Mostrar solo el reset password cuando corresponda
  if (showResetPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-8">
          <ResetPasswordForm />
        </div>
      </div>
    );
  }

  // 🔑 MOSTRAR ADMIN PANEL
  if (isAdminView) {
    return <AdminPanel onBackToHome={() => setIsAdminView(false)} />;
  }

  // 🔑 MOSTRAR USER DASHBOARD
  if (isUserDashboardView) {
    return (
      <UserDashboard
        onBackToHome={() => {
          setIsAdminView(false);
          setIsUserDashboardView(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50">
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        isScrolled={isScrolled}
        menuItems={menuItems}
      />
      <Hero scrollToSection={scrollToSection} />
      <HotelesSection />
      <RestaurantesSection />

      {/* ------------------------------------------ */}
      {/* SECCIÓN DE ACTIVIDADES */}
      {/* ------------------------------------------ */}
      <section id="actividades" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Actividades en Sapzurro
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre experiencias únicas en uno de los paraísos naturales más
              impresionantes del Caribe colombiano
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.isArray(activities) && activities.length > 0 ? (
              activities.map((activity) => (
                <ActivitiesCard key={activity.name} activity={activity} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No hay actividades disponibles.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------ */}
      {/* NUEVA SECCIÓN DE RUTAS TURÍSTICAS */}
      {/* ------------------------------------------ */}
      <section id="rutas" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center space-x-3">
              <Compass className="w-8 h-8 text-cyan-600" />
              <span>Rutas Turísticas</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explora Sapzurro con paquetes todo incluido y tours guiados por
              las zonas más emblemáticas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(rutasTuristicas) && rutasTuristicas.length > 0 ? (
              rutasTuristicas.map((ruta) => (
                <RutaCard
                  key={ruta.id}
                  ruta={ruta}
                  onTitleClick={handleOpenRutaModal}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No hay rutas disponibles en este momento.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Renderiza placeholders para los items que no hemos implementado. */}
      {menuItems
        .filter((mi) => mi.id !== "actividades" && mi.id !== "rutas")
        .slice(3)
        .map((item) => (
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
      <AuthModal />

      {/* Modal de detalle de ruta */}
      <RutaDetailModal ruta={selectedRuta} onClose={handleCloseRutaModal} />
    </div>
  );
};

export default App;
