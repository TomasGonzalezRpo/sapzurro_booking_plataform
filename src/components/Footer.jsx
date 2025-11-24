import React from "react";
import { Waves } from "lucide-react";

const Footer = () => {
  return (
    // footer principal
    <footer className="bg-gradient-to-r from-cyan-700 to-blue-700 text-white py-12 px-4">
      <div className="container mx-auto text-center">
        {/* logo y nombre */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Waves className="w-8 h-8" />
          <h3 className="text-2xl font-bold">Sapzurro</h3>
        </div>

        {/* lema */}
        <p className="text-cyan-100 mb-4">Tu puerta al paraíso caribeño</p>

        {/* copyright */}
        <p className="text-cyan-200 text-sm">
          © 2025 Sapzurro Turismo. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
