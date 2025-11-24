// src/components/RutaCard.jsx

import React, { useState } from "react";
import {
  Clock,
  Check,
  ChevronDown,
  Compass,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/**
 * RutaCard
 *
 * Tarjeta que representa una ruta turística.
 *
 * Props:
 * - ruta: objeto con datos de la ruta (ver estructura esperada abajo)
 * - onTitleClick: función (ruta) => void que abre un modal o panel con detalles
 *
 * Estructura mínima esperada de `ruta`:
 * {
 *   id,
 *   nombre,
 *   subtitulo,
 *   descripcion,
 *   duracion,
 *   precio,
 *   calificacion,
 *   etiqueta,           // p. ej. 'playas', 'selva', 'ecoturismo', 'cultural'
 *   imagenes: [url,...],
 *   imagenPlaceholder: { color: "from-..." } // opcional, para fallback visual
 *   idealPara: ['parejas', 'familias', ...]
 * }
 *
 * Notas:
 * - Todos los clics relevantes (título y botón) llaman a onTitleClick(ruta)
 *   y NO se propagan desde los controles del carrusel (prev/next).
 * - El componente es defensivo: maneja ausencia de imágenes y ausencia de campos.
 */

const RutaCard = ({ ruta = {}, onTitleClick = () => {} }) => {
  // Estado del carrusel: índice de la imagen mostrada actualmente
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // --- helpers de navegación del carrusel (detienen propagación) ---
  const nextImage = (e) => {
    e.stopPropagation(); // evita que el click propague y dispare onTitleClick
    const len = (ruta.imagenes && ruta.imagenes.length) || 0;
    if (len === 0) return;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % len);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    const len = (ruta.imagenes && ruta.imagenes.length) || 0;
    if (len === 0) return;
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + len) % len);
  };

  // --- helper para color de etiqueta según tipo ---
  const getEtiquetaColor = (etiqueta = "") => {
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

  // Formateo defensivo de rating (si existe)
  const formattedRating =
    typeof ruta.calificacion === "number"
      ? ruta.calificacion.toFixed(1)
      : "N/A";

  // Seguridad: longitud de imágenes (0 si no existe)
  const imageCount = (ruta.imagenes && ruta.imagenes.length) || 0;

  return (
    <div
      className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 flex flex-col h-full"
      role="article"
      aria-labelledby={`ruta-title-${ruta.id || Math.random()}`}
    >
      {/* ---------- CARRUSEL DE IMÁGENES ---------- */}
      <div className="relative h-48 overflow-hidden group">
        {/* Imagen principal o placeholder */}
        {imageCount > 0 ? (
          <img
            src={ruta.imagenes[currentImageIndex]}
            alt={
              ruta.nombre
                ? `${ruta.nombre} - Foto ${currentImageIndex + 1}`
                : `Foto ${currentImageIndex + 1}`
            }
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
            aria-hidden={false}
          />
        ) : (
          <div
            className={`absolute inset-0 flex items-center justify-center ${
              ruta.imagenPlaceholder?.color || "bg-gray-300"
            }`}
            aria-hidden="true"
          >
            <Compass className="w-16 h-16 text-white/50" />
          </div>
        )}

        {/* botones prev/next (solo si hay más de 1 imagen) */}
        {imageCount > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Imagen anterior"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextImage}
              aria-label="Siguiente imagen"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* indicadores (puntos) */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-1 z-10">
              {ruta.imagenes.map((_, index) => (
                <div
                  key={index}
                  aria-hidden="true"
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                ></div>
              ))}
            </div>
          </>
        )}

        {/* Etiqueta (top-left) */}
        <span
          className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full ${getEtiquetaColor(
            ruta.etiqueta || ""
          )} z-10`}
        >
          {(ruta.etiqueta || "OTRO").toUpperCase()}
        </span>

        {/* Calificación (top-right) */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1 z-10">
          <Award className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-gray-800 text-sm">
            {formattedRating}
          </span>
        </div>
      </div>

      {/* ---------- CONTENIDO ---------- */}
      <div className="p-6 flex flex-col flex-grow">
        {/* TÍTULO: dispara la apertura de detalles en el padre */}
        <div
          onClick={() => onTitleClick(ruta)}
          className="cursor-pointer flex items-center justify-between group mb-1"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            // accesibilidad: permitir Enter / Space para abrir detalle
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onTitleClick(ruta);
            }
          }}
          aria-label={`Ver detalles de ${ruta.nombre}`}
        >
          <h3
            id={`ruta-title-${ruta.id || ""}`}
            className="text-xl font-bold text-gray-800 group-hover:text-cyan-700 transition-colors"
          >
            {ruta.nombre || "Ruta sin título"}
          </h3>

          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-cyan-600 flex-shrink-0" />
        </div>

        {/* subtítulo y descripción corta */}
        <p className="text-sm text-cyan-600 font-semibold mb-3">
          {ruta.subtitulo || ""}
        </p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {ruta.descripcion || "Descripción no disponible."}
        </p>

        {/* Detalles rápidos */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-cyan-600" />
            <span>Duración: {ruta.duracion || "N/A"}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
            <span>💰</span>
            <span>
              Precio desde: $
              {(typeof ruta.precio === "number"
                ? ruta.precio
                : parseInt(ruta.precio || 0)
              ).toLocaleString("es-CO")}{" "}
              por persona
            </span>
          </div>

          {/* idealPara: mostrar hasta 2 etiquetas */}
          {(ruta.idealPara || []).slice(0, 2).map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 text-xs text-gray-500"
            >
              <Check className="w-3 h-3 text-green-500" />
              <span>Ideal para: {item}</span>
            </div>
          ))}
        </div>

        {/* Botón principal: abre modal/detalle en el padre */}
        <button
          onClick={() => onTitleClick(ruta)}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 mt-auto"
          aria-label={`Ver detalles y reservar ${ruta.nombre}`}
        >
          <span>Ver Detalles y Reservar</span>
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default RutaCard;
