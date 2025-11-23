// src/components/RutaDetailModal.jsx

import React, { useState } from "react";
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

  // Si la ruta no está definida, no renderizamos el modal
  if (!ruta) return null;

  // 🔑 LÓGICA DEL CARRUSEL
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % ruta.imagenes.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + ruta.imagenes.length) % ruta.imagenes.length
    );
  };

  // 🔑 MANEJAR CLIC EN BOTÓN DE RESERVA
  const handleReservarClick = () => {
    setShowReservationForm(!showReservationForm);
    if (!showReservationForm) {
      setError(null); // Limpiar errores
    }
  };

  // 🔑 FUNCIÓN DE CONFIRMACIÓN DE RESERVA
  const confirmarReserva = async () => {
    // 1️⃣ VERIFICAR QUE ESTÉ AUTENTICADO
    if (!isAuthenticated || !user) {
      openAuthModal();
      return;
    }

    // 2️⃣ VALIDAR DATOS BÁSICOS
    if (!reservaData.fecha || !reservaData.cantidad_personas) {
      setError("Por favor completa todos los campos requeridos");
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
          },
        }
      );

      // 5️⃣ ÉXITO
      if (response.data.success) {
        alert(
          `✅ Reserva confirmada!\nID: ${response.data.id_reserva}\n\nRuta: ${
            ruta.nombre
          }\nFecha: ${new Date(reservaData.fecha).toLocaleDateString(
            "es-CO"
          )}\nPersonas: ${reservaData.cantidad_personas}\nTotal: $${(
            ruta.precio * reservaData.cantidad_personas
          ).toLocaleString("es-CO")}\n\nRecuerda tu ID para futuras consultas.`
        );

        // Limpiar formulario
        setReservaData({
          fecha: "",
          cantidad_personas: 1,
          comentarios: "",
        });
        setShowReservationForm(false);
        onClose(); // Cerrar modal
      }
    } catch (err) {
      // 6️⃣ MANEJAR ERRORES
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

  const getMinFecha = () => {
    return new Date().toISOString().split("T")[0];
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera y Botón de Cierre */}
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-start z-10">
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

        {/* Contenido Principal */}
        <div className="p-6 space-y-6">
          {/* Carrusel */}
          {ruta.imagenes && ruta.imagenes.length > 0 && (
            <div className="h-96 rounded-lg overflow-hidden relative group">
              <img
                src={ruta.imagenes[currentImageIndex]}
                alt={`${ruta.nombre} - Foto ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
              />

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

          {/* Descripción Detallada */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Descripción General
            </h3>
            <p className="text-gray-700 whitespace-pre-line">
              {ruta.descripcion}
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
                  {ruta.duracion}
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

          {/* 🔑 FORMULARIO DE RESERVA EXPANDIBLE */}
          <section className="border-t pt-6">
            <button
              onClick={handleReservarClick}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg flex items-center justify-center space-x-2"
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

            {/* 🔑 FORMULARIO EXPANDIBLE */}
            {showReservationForm && (
              <div className="mt-6 p-6 bg-gray-50 rounded-xl space-y-4">
                {/* 🔑 MOSTRAR ERRORES */}
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
                        cantidad_personas: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                      ${ruta.precio.toLocaleString("es-CO")}
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
                        ruta.precio * reservaData.cantidad_personas
                      ).toLocaleString("es-CO")}
                    </span>
                  </div>
                </div>

                {/* Botones de acción */}
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

export default RutaDetailModal;
