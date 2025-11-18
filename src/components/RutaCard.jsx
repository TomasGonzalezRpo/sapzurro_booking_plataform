// src/components/RutaCard.jsx

import React, { useState } from "react";
import {
  Clock,
  MapPin,
  Check,
  ChevronDown,
  ChevronUp,
  Compass, // Importación correcta
  Award,
} from "lucide-react";

const RutaCard = ({ ruta }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReservar = () => {
    // Lógica para abrir modal de reserva o expandir el formulario
    setIsExpanded(!isExpanded);
  };

  // Define un color para la etiqueta basada en el tipo (similar a tus otras tarjetas)
  const getEtiquetaColor = (etiqueta) => {
    switch (etiqueta.toLowerCase()) {
      case "playas":
        return "bg-blue-500";
      case "selva":
        return "bg-green-600";
      case "ecoturismo":
        return "bg-lime-600";
      case "cultural":
        return "bg-purple-600";
      default:
        return "bg-gray-500";
    }
  };

  return (
    // Contenedor principal: Usar flex flex-col h-full para forzar la altura
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 flex flex-col h-full">
      {/* Carrusel de imágenes (Placeholder) */}
      <div className="relative h-48 overflow-hidden group">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${ruta.imagenPlaceholder.color} flex items-center justify-center`}
        >
          <Compass className="w-16 h-16 text-white/50" />{" "}
          {/* <--- CORREGIDO: Usando Compass */}
        </div>
        {/* Etiqueta */}
        <span
          className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full ${getEtiquetaColor(
            ruta.etiqueta
          )}`}
        >
          {ruta.etiqueta.toUpperCase()}
        </span>
        {/* Calificación */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
          <Award className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-gray-800 text-sm">4.8</span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{ruta.nombre}</h3>
        <p className="text-sm text-cyan-600 font-semibold mb-3">
          {ruta.subtitulo}
        </p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {ruta.descripcion}
        </p>

        {/* Detalles rápidos */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-cyan-600" />
            <span>Duración: **{ruta.duracion}**</span>
          </div>
          <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
            <span>💰</span>
            <span>
              Precio desde: **${ruta.precio.toLocaleString("es-CO")}** por
              persona
            </span>
          </div>
          {ruta.idealPara.slice(0, 2).map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 text-xs text-gray-500"
            >
              <Check className="w-3 h-3 text-green-500" />
              <span>Ideal para: {item}</span>
            </div>
          ))}
        </div>

        {/* Botón de Reserva con mt-auto */}
        <button
          onClick={handleReservar}
          // mt-auto empuja el botón al fondo del contenedor flex-grow
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 mt-auto"
        >
          <span>{isExpanded ? "Cerrar detalles" : "Reservar ruta"}</span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>
      {/* Formulario/detalles expandibles */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <h4 className="font-semibold mb-2">Detalles de la Ruta</h4>
          <p className="text-sm text-gray-600">
            Formulario de reserva de ruta o más información.
          </p>
        </div>
      )}
    </div>
  );
};

export default RutaCard; // ¡Importante para la importación en App.jsx!
