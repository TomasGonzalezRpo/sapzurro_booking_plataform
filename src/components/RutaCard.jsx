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
 * Componente que representa una tarjeta individual de ruta turística.
 * La tarjeta ahora usa onTitleClick (pasado por props) para abrir un modal de detalle
 * en el componente padre.
 * * @param {object} props - Propiedades del componente.
 * @param {object} props.ruta - Objeto con los datos de la ruta turística.
 * @param {function} props.onTitleClick - Función para abrir el modal de detalle.
 */
const RutaCard = ({ ruta, onTitleClick }) => {
  // Mantenemos solo el estado del carrusel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e) => {
    // Detiene la propagación para evitar que el clic en el botón active onTitleClick
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % ruta.imagenes.length);
  };

  const prevImage = (e) => {
    // Detiene la propagación para evitar que el clic en el botón active onTitleClick
    e.stopPropagation();
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + ruta.imagenes.length) % ruta.imagenes.length
    );
  };

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

  // Aseguramos que la calificación sea un número con un decimal, si existe
  const formattedRating = ruta.calificacion
    ? ruta.calificacion.toFixed(1)
    : "N/A";

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 flex flex-col h-full">
      {/* Carrusel de imágenes */}
      <div className="relative h-48 overflow-hidden group">
        {/* Imagen principal */}
        {ruta.imagenes && ruta.imagenes.length > 0 ? (
          <img
            src={ruta.imagenes[currentImageIndex]}
            alt={`${ruta.nombre} - Foto ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        ) : (
          // Placeholder si no hay imágenes (mantenido como seguro)
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

        {/* Etiqueta y Calificación (MODIFICADO) */}
        <span
          className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full ${getEtiquetaColor(
            ruta.etiqueta
          )} z-10`}
        >
          {ruta.etiqueta.toUpperCase()}
        </span>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1 z-10">
          <Award className="w-4 h-4 fill-amber-400 text-amber-400" />
          {/* ⬅️ USO DE LA PROPIEDAD DINÁMICA DE CALIFICACIÓN */}
          <span className="font-semibold text-gray-800 text-sm">
            {formattedRating}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 flex flex-col flex-grow">
        {/* TÍTULO: Ahora dispara el modal de detalle */}
        <div
          onClick={() => onTitleClick(ruta)} // Llama a la función que abre el modal
          className="cursor-pointer flex items-center justify-between group mb-1"
        >
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-cyan-700 transition-colors">
            {ruta.nombre}
          </h3>
          {/* Icono de información o de expansión (puedes usar una lupa o un info) */}
          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-cyan-600 flex-shrink-0" />
        </div>

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

        {/* Botón de Reserva/Detalle: Ahora abre el modal */}
        <button
          onClick={() => onTitleClick(ruta)} // Llama a la función que abre el modal
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 mt-auto"
        >
          <span>Ver Detalles y Reservar</span>
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
      {/* El formulario/detalles expandibles internos se eliminan ya que se usa el modal. */}
    </div>
  );
};

export default RutaCard;
