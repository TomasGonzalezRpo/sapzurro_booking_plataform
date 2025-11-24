import React, { useState, useEffect } from "react";
// Usamos el hook de autenticación para obtener el usuario
import { useAuth } from "./contexts/AuthContext";
// Importamos todos los componentes de la interfaz pública
import Header from "./components/Header";
import Hero from "./components/Hero";
import HotelesSection from "./components/HotelesSection";
import RestaurantesSection from "./components/RestaurantesSection";
import Footer from "./components/Footer";
import AuthModal from "./components/Auth/AuthModal";
// Importamos los paneles para las vistas especiales
import AdminPanel from "./components/Admin/AdminPanel";
import UserDashboard from "./components/Usuarios/UserDashboard"; // Componente para el perfil de usuario normal
import ResetPasswordForm from "./components/Auth/ResetPasswordForm";
import ActivitiesCard from "./components/ActivitiesCard.jsx";
import RutaCard from "./components/RutaCard.jsx";
import RutaDetailModal from "./components/RutaDetailModal";
// Importamos los datos de las actividades y rutas
import { activities } from "./data/Activities.js";
import { rutasTuristicas } from "./data/rutasData.js";
import { Compass } from "lucide-react"; // Icono de brújula

// Este es el componente principal de la aplicación
const App = () => {
  // Obtenemos la información del usuario logueado
  const { user } = useAuth(); // --- Estados de la Aplicación --- // Estado para guardar la ruta turística que el usuario quiere ver en detalle

  const [selectedRuta, setSelectedRuta] = useState(null); // Estado para el menú de navegación en móvil
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para saber en qué sección estamos (para resaltar en el menú)
  const [activeSection, setActiveSection] = useState("inicio"); // Estado para cambiar el estilo del Header al hacer scroll
  const [isScrolled, setIsScrolled] = useState(false); // Estado para activar la vista del Panel de Administración
  const [isAdminView, setIsAdminView] = useState(false); // Estado para activar la vista del Dashboard de Usuario
  const [isUserDashboardView, setIsUserDashboardView] = useState(false); // Estado para mostrar el formulario de restablecer contraseña (por URL)
  const [showResetPassword, setShowResetPassword] = useState(false); // Hook para revisar la URL y mostrar el formulario de restablecimiento

  useEffect(() => {
    const path = window.location.pathname;
    setShowResetPassword(path === "/reset-password");
  }, []); // Hook para crear funciones globales en el objeto `window` (para usarlas desde otros componentes)

  useEffect(() => {
    // Función para ir al panel de admin
    window.goToAdmin = () => setIsAdminView(true); // Función para volver a la página pública
    window.goToHome = () => {
      setIsAdminView(false);
      setIsUserDashboardView(false);
    }; // Función para ir al dashboard del usuario normal
    window.goToUserDashboard = () => {
      setIsUserDashboardView(true);
    }; // Limpiamos las funciones cuando el componente se desmonte

    return () => {
      delete window.goToAdmin;
      delete window.goToHome;
      delete window.goToUserDashboard;
    };
  }, []); // Hook para detectar el scroll y cambiar el estilo del Header

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll); // Limpieza de eventos
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Función para ir a una sección al hacer clic en un item del menú

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false); // Cierra el menú en móvil
    const el = document.getElementById(sectionId); // Scroll suave hasta la sección
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }; // Abre el modal de detalle de ruta

  const handleOpenRutaModal = (ruta) => {
    setSelectedRuta(ruta);
  }; // Cierra el modal de detalle de ruta

  const handleCloseRutaModal = () => {
    setSelectedRuta(null);
  }; // Definición de los elementos del menú de navegación

  const menuItems = [
    { id: "inicio", label: "Inicio" },
    { id: "hoteles", label: "Hoteles" },
    { id: "restaurantes", label: "Restaurantes" },
    { id: "actividades", label: "Actividades" },
    { id: "rutas", label: "Rutas" },
    { id: "flora-fauna", label: "Flora y Fauna" },
    { id: "clima", label: "Clima" },
    { id: "sobre-sapzurro", label: "Sobre Sapzurro" },
  ]; // Si la URL es de restablecer contraseña, solo mostramos ese formulario

  if (showResetPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 flex items-center justify-center p-4">
               {" "}
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-8">
                    <ResetPasswordForm />       {" "}
        </div>
             {" "}
      </div>
    );
  } // Si estamos en la vista de Admin, mostramos el Panel de Administración

  if (isAdminView) {
    return <AdminPanel onBackToHome={() => setIsAdminView(false)} />;
  } // Si estamos en la vista de Dashboard de Usuario, mostramos ese componente

  if (isUserDashboardView) {
    return (
      <UserDashboard
        onBackToHome={() => {
          // Nos aseguramos de volver a la vista principal
          setIsAdminView(false);
          setIsUserDashboardView(false);
        }}
      />
    );
  } // --- Renderizado de la Aplicación Pública ---

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50">
            {/* Cabecera de la página */}
           {" "}
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        isScrolled={isScrolled}
        menuItems={menuItems}
      />
            {/* Sección principal (banner grande) */}
            <Hero scrollToSection={scrollToSection} />     {" "}
      {/* Secciones de contenido */}
            <HotelesSection />
            <RestaurantesSection />     {" "}
      {/* ------------------------------------------ */}     {" "}
      {/* SECCIÓN DE ACTIVIDADES (Contenido dinámico) */}     {" "}
      {/* ------------------------------------------ */}     {" "}
      <section id="actividades" className="py-20 px-4 bg-gray-50">
               {" "}
        <div className="container mx-auto">
                   {" "}
          <div className="text-center mb-12">
                       {" "}
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            Actividades en Sapzurro            {" "}
            </h2>
                       {" "}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Descubre experiencias únicas en uno de los paraísos
              naturales más               impresionantes del Caribe colombiano  
                       {" "}
            </p>
                     {" "}
          </div>
                    {/* Grid para mostrar las tarjetas de actividades */}       
           {" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                       {" "}
            {Array.isArray(activities) && activities.length > 0 ? (
              activities.map((activity) => (
                <ActivitiesCard key={activity.name} activity={activity} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                                No hay actividades disponibles.              {" "}
              </div>
            )}
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </section>
            {/* ------------------------------------------ */}     {" "}
      {/* SECCIÓN DE RUTAS TURÍSTICAS (Contenido dinámico) */}     {" "}
      {/* ------------------------------------------ */}     {" "}
      <section id="rutas" className="py-20 px-4 bg-white">
               {" "}
        <div className="container mx-auto">
                   {" "}
          <div className="text-center mb-12">
                       {" "}
            <h2 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center space-x-3">
                            <Compass className="w-8 h-8 text-cyan-600" />       
                    <span>Rutas Turísticas</span>           {" "}
            </h2>
                       {" "}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Explora Sapzurro con paquetes todo incluido y tours
              guiados por               las zonas más emblemáticas.            {" "}
            </p>
                     {" "}
          </div>
                    {/* Grid para mostrar las tarjetas de rutas */}         {" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                       {" "}
            {Array.isArray(rutasTuristicas) && rutasTuristicas.length > 0 ? (
              rutasTuristicas.map((ruta) => (
                <RutaCard
                  key={ruta.id}
                  ruta={ruta}
                  onTitleClick={handleOpenRutaModal} // Pasa la función para abrir el modal de detalle
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                                No hay rutas disponibles en este momento.      
                       {" "}
              </div>
            )}
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </section>
           {" "}
      {/* Renderizamos las secciones 'dummy' para los items del menú que faltan */}
           {" "}
      {menuItems // Filtramos los que ya tenemos (hoteles, restaurantes, actividades y rutas) y los primeros 3
        .filter((mi) => mi.id !== "actividades" && mi.id !== "rutas")
        .slice(3)
        .map((item) => (
          <section
            key={item.id}
            id={item.id}
            className="py-20 px-4"
            style={{ minHeight: "400px" }}
          >
                       {" "}
            <div className="container mx-auto">
                           {" "}
              <div className="text-center">
                               {" "}
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                                    {item.label}               {" "}
                </h2>
                               {" "}
                <p className="text-gray-600">Sección en desarrollo...</p>       
                     {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </section>
        ))}
            {/* Pie de página */}
            <Footer />      {/* Modal de autenticación (Login/Registro) */}
            <AuthModal />     {" "}
      {/* Modal que muestra los detalles de la ruta seleccionada */}
           {" "}
      <RutaDetailModal ruta={selectedRuta} onClose={handleCloseRutaModal} />   {" "}
    </div>
  );
};

export default App;
