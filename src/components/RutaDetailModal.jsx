// src/components/RutaDetailModal.jsx

import React, { useState } from "react"; // Importamos useState
import {
  X,
  Clock,
  DollarSign,
  MapPin,
  Check,
  Compass,
  ChevronLeft, // Importamos los iconos de navegación
  ChevronRight,
} from "lucide-react";

const RutaDetailModal = ({ ruta, onClose }) => {
  // ⬅️ NUEVO ESTADO: Índice de la imagen actual para el carrusel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Si la ruta no está definida, no renderizamos el modal
  if (!ruta) return null;

  // ⬅️ LÓGICA DEL CARRUSEL: Funciones para navegar
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % ruta.imagenes.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + ruta.imagenes.length) % ruta.imagenes.length
    );
  };
  // ----------------------------------------------------

  return (
    // Fondo oscuro y cierre al hacer clic fuera
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Contenedor del Modal */}
      <div
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera y Botón de Cierre */}
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              {ruta.nombre}
            </h2>
            <p className="text-xl text-cyan-600 font-semibold">
              {ruta.subtitulo}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 ml-4 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido Principal (Detalles) */}
        <div className="p-6 space-y-6">
          {/* ⬅️ ZONA DEL CARRUSEL REPLICADA */}
          {ruta.imagenes && ruta.imagenes.length > 0 && (
            <div className="h-96 rounded-lg overflow-hidden relative group">
              {/* Imagen visible: usa el índice actual */}
              <img
                src={ruta.imagenes[currentImageIndex]}
                alt={`${ruta.nombre} - Foto ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
              />

              {/* Botones de navegación (solo si hay más de 1 imagen) */}
              {ruta.imagenes.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Indicadores de página */}
              {ruta.imagenes.length > 1 && (
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
            </div>
          )}
          {/* ---------------------------------------------------- */}

          {/* Descripción Detallada */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Descripción General
            </h3>
            <p className="text-gray-700 whitespace-pre-line">
              {ruta.descripcion}
            </p>
          </section>

          {/* Detalles Clave (Duración y Precio) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-cyan-50 rounded-lg flex items-center space-x-3">
              <Clock className="w-6 h-6 text-cyan-700" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Duración Total
                </p>
                <p className="text-lg font-bold text-cyan-800">
                  {ruta.duracion}
                </p>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg flex items-center space-x-3">
              <DollarSign className="w-6 h-6 text-green-700" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Precio desde
                </p>
                <p className="text-lg font-bold text-green-800">
                  ${ruta.precio.toLocaleString("es-CO")}
                </p>
              </div>
            </div>
          </div>

          {/* Ideal Para */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Ideal Para
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-gray-700">
              {ruta.idealPara.map((item, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Simulación del botón de reserva en el modal */}
          <div className="pt-4">
            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg">
              Continuar a Reserva
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RutaDetailModal;
