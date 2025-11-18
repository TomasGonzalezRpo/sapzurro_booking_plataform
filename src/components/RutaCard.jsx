// src/components/RutaCard.jsx

import React, { useState } from "react";
import {
  Clock,
  MapPin,
  Check,
  ChevronDown,
  ChevronUp,
  Compass,
  Award,
  ChevronLeft, // <-- NUEVA IMPORTACIÓN
  ChevronRight, // <-- NUEVA IMPORTACIÓN
} from "lucide-react";

const RutaCard = ({ ruta }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // 1. ESTADO PARA EL CARRUSEL
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleReservar = () => {
    setIsExpanded(!isExpanded);
  };

  // 2. FUNCIONES DE NAVEGACIÓN
  const nextImage = (e) => {
    e.stopPropagation(); // Evita que se dispare el evento del botón de reserva
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % ruta.imagenes.length);
  };

  const prevImage = (e) => {
    e.stopPropagation(); // Evita que se dispare el evento del botón de reserva
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + ruta.imagenes.length) % ruta.imagenes.length
    );
  };

  // ... (Tu función getEtiquetaColor se mantiene igual)
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
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 flex flex-col h-full">
      {/* 3. CARRUSEL DE IMÁGENES */}
      <div className="relative h-48 overflow-hidden group">
        {/* Imagen principal */}
        {ruta.imagenes && ruta.imagenes.length > 0 ? (
          <img
            src={ruta.imagenes[currentImageIndex]}
            alt={`${ruta.nombre} - Foto ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        ) : (
          // Placeholder si no hay imágenes
          <div
            className={`absolute inset-0 bg-gradient-to-br ${ruta.imagenPlaceholder.color} flex items-center justify-center`}
          >
            <Compass className="w-16 h-16 text-white/50" />
          </div>
        )}

        {/* Botón de navegación IZQUIERDA */}
        {ruta.imagenes && ruta.imagenes.length > 1 && (
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Botón de navegación DERECHA */}
        {ruta.imagenes && ruta.imagenes.length > 1 && (
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Indicadores de página */}
        {ruta.imagenes && ruta.imagenes.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-1 z-10">
            {ruta.imagenes.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              ></div>
            ))}
          </div>
        )}

        {/* Etiqueta y Calificación (se mantienen igual) */}
        <span
          className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full ${getEtiquetaColor(
            ruta.etiqueta
          )} z-10`}
        >
          {ruta.etiqueta.toUpperCase()}
        </span>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1 z-10">
          <Award className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-gray-800 text-sm">4.8</span>
        </div>
      </div>

      {/* Contenido (se mantiene igual) */}
      <div className="p-6 flex flex-col flex-grow">
        {/* ... (el resto del contenido, duración, precio, etc., se mantiene igual) ... */}
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
            <span>Duración: {ruta.duracion}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
            <span>💰</span>
            <span>
              Precio desde: ${ruta.precio.toLocaleString("es-CO")} por persona
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

export default RutaCard;
