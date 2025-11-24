// src/components/RutaDetailModal.jsx

import React, { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext"; // 🔑 IMPORTAR useAuth
import axios from "axios";
import {
  X,
  Clock,
  DollarSign,
  MapPin,
  Check,
  Compass,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";

/**
 * RutaDetailModal
 *
 * Modal con información detallada de una ruta y formulario de reserva.
 *
 * Props:
 * - ruta (object): objeto con la información de la ruta (id, nombre, subtitulo, descripcion, imagenes[], duracion, precio, idealPara[])
 * - onClose (function): función para cerrar el modal
 *
 * Mejoras incluidas:
 * - Validaciones defensivas (manejo de propiedades inexistentes)
 * - Indicadores de carga y mensajes de error visibles para el usuario
 * - Accesibilidad: roles, aria-labels, teclado para acciones importantes
 * - Prevención de propagación en el modal (click fuera cierra, click dentro no)
 */

const RutaDetailModal = ({ ruta, onClose }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth(); // 🔑 OBTENER USER
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [loading, setLoading] = useState(false); // 🔑 NUEVO
  const [error, setError] = useState(null); // 🔑 NUEVO
  const [reservaData, setReservaData] = useState({
    fecha: "",
    cantidad_personas: 1,
    comentarios: "",
  });

  // Si la ruta no está definida, no renderizamos el modal (defensivo)
  if (!ruta) return null;

  const imageCount = (ruta.imagenes && ruta.imagenes.length) || 0;

  // 🔑 LÓGICA DEL CARRUSEL (defensiva)
  const nextImage = (e) => {
    // si el evento viene del botón, prevenir propagación
    e?.stopPropagation();
    if (imageCount <= 1) return;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageCount);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    if (imageCount <= 1) return;
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + imageCount) % imageCount
    );
  };

  // 🔑 MANEJAR CLIC EN BOTÓN DE RESERVA (muestra/oculta el formulario)
  const handleReservarClick = () => {
    setShowReservationForm((s) => !s);
    if (!showReservationForm) {
      setError(null); // Limpiar errores al abrir
    }
  };

  // 🔑 FUNCIÓN DE CONFIRMACIÓN DE RESERVA
  const confirmarReserva = async () => {
    // 1️⃣ VERIFICAR QUE ESTÉ AUTENTICADO
    if (!isAuthenticated || !user) {
      openAuthModal?.();
      return;
    }

    // 2️⃣ VALIDAR DATOS BÁSICOS
    if (!reservaData.fecha || !reservaData.cantidad_personas) {
      setError("Por favor completa todos los campos requeridos.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 3️⃣ PREPARAR DATOS DE LA RESERVA
      const payload = {
        tipo_servicio: "ruta",
        id_servicio: ruta.id,
        nombre_servicio: ruta.nombre,
        fecha_inicio: reservaData.fecha,
        fecha_fin: null, // Las rutas no tienen fecha_fin
        cantidad_personas: reservaData.cantidad_personas,
        descripcion_servicio: ruta.descripcion,
        precio_unitario: ruta.precio,
        cantidad: 1,
        precio_total: ruta.precio * reservaData.cantidad_personas,
        notas_admin: reservaData.comentarios || "Sin comentarios especiales",
      };

      // 4️⃣ ENVIAR AL BACKEND
      const response = await axios.post(
        "http://localhost:5000/api/reservas",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("sapzurro_token")}`,
          },
        }
      );

      // 5️⃣ ÉXITO
      if (response.data?.success) {
        alert(
          `✅ Reserva confirmada!\nID: ${response.data.id_reserva}\n\nRuta: ${
            ruta.nombre
          }\nFecha: ${new Date(reservaData.fecha).toLocaleDateString(
            "es-CO"
          )}\nPersonas: ${reservaData.cantidad_personas}\nTotal: $${(
            ruta.precio * reservaData.cantidad_personas
          ).toLocaleString("es-CO")}\n\nRecuerda tu ID para futuras consultas.`
        );

        // Limpiar formulario y cerrar modal
        setReservaData({
          fecha: "",
          cantidad_personas: 1,
          comentarios: "",
        });
        setShowReservationForm(false);
        onClose?.();
      } else {
        setError(response.data?.message || "No se pudo confirmar la reserva.");
      }
    } catch (err) {
      // 6️⃣ MANEJAR ERRORES (mostrar mensaje util al usuario)
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Error al procesar la reserva";
      setError(errorMsg);
      console.error("Error en reserva:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fecha mínima (hoy) para el input date
  const getMinFecha = () => {
    const hoy = new Date();
    // Añadir timezone-local safe (convertir a YYYY-MM-DD)
    const iso = new Date(
      hoy.getTime() - hoy.getTimezoneOffset() * 60000
    ).toISOString();
    return iso.split("T")[0];
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`ruta-modal-title-${ruta.id}`}
      onClick={onClose} // click en el backdrop cierra
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // evitar que clicks internos cierren
      >
        {/* Cabecera y Botón de Cierre */}
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-start z-10">
          <div>
            <h2
              id={`ruta-modal-title-${ruta.id}`}
              className="text-3xl font-bold text-gray-900 mb-1"
            >
              {ruta.nombre}
            </h2>
            {ruta.subtitulo && (
              <p className="text-xl text-cyan-600 font-semibold">
                {ruta.subtitulo}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-2 ml-4 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido Principal */}
        <div className="p-6 space-y-6">
          {/* Carrusel (si hay imágenes) */}
          {imageCount > 0 ? (
            <div className="h-96 rounded-lg overflow-hidden relative group">
              <img
                src={ruta.imagenes[currentImageIndex]}
                alt={`${ruta.nombre} - Foto ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
              />

              {imageCount > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    aria-label="Imagen anterior"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    aria-label="Siguiente imagen"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* indicadores */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-1 z-10">
                    {ruta.imagenes.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "bg-white"
                            : "bg-white/50"
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="h-96 rounded-lg bg-gray-100 flex items-center justify-center">
              <Compass className="w-20 h-20 text-gray-400" />
            </div>
          )}

          {/* Descripción Detallada */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Descripción General
            </h3>
            <p className="text-gray-700 whitespace-pre-line">
              {ruta.descripcion || "Descripción no disponible."}
            </p>
          </section>

          {/* Detalles Clave */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-cyan-50 rounded-lg flex items-center space-x-3">
              <Clock className="w-6 h-6 text-cyan-700" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Duración Total
                </p>
                <p className="text-lg font-bold text-cyan-800">
                  {ruta.duracion || "N/A"}
                </p>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg flex items-center space-x-3">
              <DollarSign className="w-6 h-6 text-green-700" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Precio por persona
                </p>
                <p className="text-lg font-bold text-green-800">
                  ${Number(ruta.precio || 0).toLocaleString("es-CO")}
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
              {ruta.idealPara && ruta.idealPara.length > 0 ? (
                ruta.idealPara.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">
                  No hay información disponible.
                </li>
              )}
            </ul>
          </section>

          {/* 🔑 FORMULARIO DE RESERVA EXPANDIBLE */}
          <section className="border-t pt-6">
            <button
              onClick={handleReservarClick}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg flex items-center justify-center space-x-2"
              aria-expanded={showReservationForm}
              aria-controls={`reserva-section-${ruta.id}`}
            >
              <span>
                {showReservationForm
                  ? "Cerrar Formulario"
                  : "Continuar a Reserva"}
              </span>
              {showReservationForm ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {/* FORMULARIO EXPANDIBLE */}
            {showReservationForm && (
              <div
                id={`reserva-section-${ruta.id}`}
                className="mt-6 p-6 bg-gray-50 rounded-xl space-y-4"
              >
                {/* ERRORES */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-semibold">Error:</p>
                    <p>{error}</p>
                  </div>
                )}

                {/* Fecha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de la ruta *
                  </label>
                  <input
                    type="date"
                    value={reservaData.fecha}
                    min={getMinFecha()}
                    onChange={(e) =>
                      setReservaData({ ...reservaData, fecha: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    aria-required="true"
                  />
                </div>

                {/* Cantidad de personas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad de personas *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={reservaData.cantidad_personas}
                    onChange={(e) =>
                      setReservaData({
                        ...reservaData,
                        cantidad_personas: parseInt(e.target.value || "1", 10),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    aria-required="true"
                  />
                </div>

                {/* Comentarios */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentarios (opcional)
                  </label>
                  <textarea
                    value={reservaData.comentarios}
                    onChange={(e) =>
                      setReservaData({
                        ...reservaData,
                        comentarios: e.target.value,
                      })
                    }
                    placeholder="Ej: Requisitos especiales, alergias, preguntas..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Resumen de precio */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Precio unitario:</span>
                    <span className="font-semibold">
                      ${Number(ruta.precio || 0).toLocaleString("es-CO")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Personas:</span>
                    <span className="font-semibold">
                      {reservaData.cantidad_personas}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">
                      Total estimado:
                    </span>
                    <span className="text-2xl font-bold text-cyan-600">
                      $
                      {(
                        Number(ruta.precio || 0) *
                        (reservaData.cantidad_personas || 0)
                      ).toLocaleString("es-CO")}
                    </span>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleReservarClick}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmarReserva}
                    disabled={
                      loading ||
                      !reservaData.fecha ||
                      !reservaData.cantidad_personas
                    }
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin">⏳</div>
                        <span>Procesando...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Confirmar reserva</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

RutaDetailModal.propTypes = {
  ruta: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    nombre: PropTypes.string,
    subtitulo: PropTypes.string,
    descripcion: PropTypes.string,
    imagenes: PropTypes.arrayOf(PropTypes.string),
    duracion: PropTypes.string,
    precio: PropTypes.number,
    idealPara: PropTypes.arrayOf(PropTypes.string),
  }),
  onClose: PropTypes.func.isRequired,
};

RutaDetailModal.defaultProps = {
  ruta: {
    id: null,
    nombre: "Ruta",
    subtitulo: "",
    descripcion: "",
    imagenes: [],
    duracion: "N/A",
    precio: 0,
    idealPara: [],
  },
};

export default RutaDetailModal;
