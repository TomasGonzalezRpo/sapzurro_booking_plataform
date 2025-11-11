import React from "react";
import { Menu, X, Waves, User as UserIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext"; // desde src/components -> ../contexts
import UserMenu from "./Auth/UserMenu";

const Header = ({
  isMenuOpen,
  setIsMenuOpen,
  activeSection,
  scrollToSection,
  isScrolled,
}) => {
  // debug
  let auth;
  try {
    auth = useAuth();
  } catch (err) {
    console.error("useAuth error en Header:", err);
    auth = { user: null, openAuthModal: () => {} };
  }

  const { user, openAuthModal } = auth;

  const menuItems = [
    { id: "inicio", label: "Inicio" },
    { id: "hoteles", label: "Hoteles" },
    { id: "restaurantes", label: "Restaurantes" },
    { id: "actividades", label: "Actividades" },
    { id: "flora-fauna", label: "Flora y Fauna" },
    { id: "clima", label: "Clima" },
    { id: "sobre-sapzurro", label: "Sobre Sapzurro" },
  ];

  // LOG TEMPORAL
  // console.log("Header render - user:", user);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => scrollToSection("inicio")}
          >
            <Waves className="w-8 h-8 text-cyan-600" />
            <div>
              <h1 className="text-2xl font-bold text-cyan-700">Sapzurro</h1>
              <p className="text-xs text-cyan-600">Chocó, Colombia</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-colors hover:text-cyan-600 ${
                  activeSection === item.id ? "text-cyan-600" : "text-gray-700"
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* botón de ingreso o UserMenu */}
            {user ? (
              <UserMenu />
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md"
                aria-label="Ingresar"
              >
                <UserIcon className="w-4 h-4" />
                <span>Ingresar</span>
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-gray-700 hover:text-cyan-600 transition-colors"
            aria-label="Abrir menú"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-cyan-100 text-cyan-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </button>
            ))}

            {user ? (
              <UserMenu />
            ) : (
              <button
                onClick={() => {
                  openAuthModal();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all"
                aria-label="Ingresar (mobile)"
              >
                <UserIcon className="w-4 h-4" />
                <span>Ingresar</span>
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
