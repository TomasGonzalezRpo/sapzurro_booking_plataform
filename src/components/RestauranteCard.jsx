// src/components/RestauranteCard.jsx

import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import {
  Star,
  Wifi,
  UtensilsCrossed,
  Clock,
  Phone,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check,
  Info,
  X,
  ExternalLink,
  Award,
} from "lucide-react";

/**
 * RestauranteCard
 *
 * Componente que muestra la tarjeta de un restaurante con:
 * - Carrusel de imágenes
 * - Información corta (tipo de cocina, horarios, rango de precios)
 * - Modal con información completa
 * - Formulario multi-step para reservar mesa (3 pasos)
 *
 * Props:
 * - restaurante: objeto con la información del restaurante (id, nombre, imagenes, calificacion, etc.)
 *
 * Dependencias:
 * - useAuth() para obtener user, isAuthenticated y openAuthModal
 * - axios para llamar a /api/reservas
 *
 * Nota: asume que el backend devuelve { success, id_reserva } al crear reserva.
 */

const RestauranteCard = ({ restaurante }) => {
  // auth (usuario + helpers)
  const { user, isAuthenticated, openAuthModal } = useAuth();

  // Estados UI
  const [isExpanded, setIsExpanded] = useState(false); // muestra/oculta el formulario expandible
  const [showInfo, setShowInfo] = useState(false); // modal info completa
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // índice del carrusel
  const [reservaStep, setReservaStep] = useState(1); // paso del wizard (1..3)
  const [loading, setLoading] = useState(false); // estado cuando se procesa la reserva
  const [error, setError] = useState(null); // mensaje de error a mostrar

  // Datos del formulario de reserva
  const [reservaData, setReservaData] = useState({
    fecha: "",
    hora: "",
    personas: 2,
    ocasionEspecial: false,
    tipoOcasion: "",
    comentarios: "",
  });

  // --- Helpers: horarios disponibles (puede depender del restaurante) ---
  const horariosDisponibles = () => {
    const horarios = [];

    // si el restaurante abre para desayuno, añadimos franjas matutinas
    if (restaurante.ofreceDesayuno) {
      horarios.push("7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM");
    }

    // franjas comunes de almuerzo y cena
    horarios.push("12:00 PM", "1:00 PM", "2:00 PM");
    horarios.push("6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM");

    return horarios;
  };

  // --- Carrusel: siguiente / anterior imagen ---
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % restaurante.imagenes.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + restaurante.imagenes.length) % restaurante.imagenes.length
    );
  };

  // Abrir / cerrar formulario expandible (reserva inline)
  const handleReservar = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setReservaStep(1);
      setError(null);
    }
  };

  // Navegación entre pasos del wizard
  const nextStep = () => {
    if (reservaStep < 3) setReservaStep(reservaStep + 1);
  };

  const prevStep = () => {
    if (reservaStep > 1) setReservaStep(reservaStep - 1);
  };

  // --- Función principal: confirmar reserva ---
  const confirmarReserva = async () => {
    // 1) Si no está autenticado, abrir modal de login/registro
    if (!isAuthenticated || !user) {
      openAuthModal();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Construimos el payload que envía la app al backend.
      // Nota: el backend espera campos como tipo_servicio, nombre_servicio, fecha_inicio, cantidad_personas, etc.
      const payload = {
        tipo_servicio: "restaurante",
        id_servicio: restaurante.id,
        nombre_servicio: restaurante.nombre,
        fecha_inicio: reservaData.fecha,
        fecha_fin: null,
        cantidad_personas: reservaData.personas,
        cantidad_habitaciones: null,
        descripcion_servicio: `${reservaData.hora} - ${
          reservaData.ocasionEspecial
            ? reservaData.tipoOcasion
            : "Sin ocasión especial"
        }`,
        precio_unitario: 0,
        cantidad: 1,
        precio_total: 0,
      };

      // Añadimos las notas/comentarios si el usuario las indicó
      if (reservaData.comentarios) {
        payload.notas_admin = reservaData.comentarios;
      }

      // Debug en consola (útil en desarrollo)
      console.log("🚀 PAYLOAD FINAL ENVIADO:", payload);

      // Petición al backend (POST /api/reservas)
      const response = await axios.post(
        "http://localhost:5000/api/reservas",
        payload
      );

      console.log("✅ Respuesta del servidor:", response.data);

      // Éxito: alert y limpieza del formulario
      if (response.data.success) {
        alert(
          `✅ Reserva confirmada!\nID: ${
            response.data.id_reserva
          }\n\nRestaurante: ${restaurante.nombre}\nFecha: ${new Date(
            reservaData.fecha
          ).toLocaleDateString("es-CO")}\nHora: ${
            reservaData.hora
          }\nPersonas: ${reservaData.personas}`
        );

        // limpiar formulario y cerrar sección de reserva
        setReservaData({
          fecha: "",
          hora: "",
          personas: 2,
          ocasionEspecial: false,
          tipoOcasion: "",
          comentarios: "",
        });
        setIsExpanded(false);
      } else {
        // si backend devuelve success=false, mostrar mensaje provisto
        setError(response.data.message || "Error al confirmar la reserva");
      }
    } catch (err) {
      // Manejo de errores: mostrar mensaje amigable (y loguear)
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

  // Fecha mínima permitida (hoy)
  const getMinFecha = () => {
    return new Date().toISOString().split("T")[0];
  };

  // ---------------------------
  // RENDERIZADO del componente
  // ---------------------------
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
      {/* Badge de aliado (si aplica) */}
      {restaurante.esAliado && (
        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 flex items-center justify-center space-x-2">
          <Award className="w-4 h-4" />
          <span className="text-sm font-semibold">Restaurante Aliado</span>
        </div>
      )}

      {/* Carrusel de imágenes */}
      <div className="relative h-64 overflow-hidden group">
        <img
          src={restaurante.imagenes[currentImageIndex].url}
          alt={restaurante.imagenes[currentImageIndex].desc}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        />

        {/* Overlay con info breve */}
        <div className="absolute inset-0 bg-black/40 transition-all duration-500 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <UtensilsCrossed className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium opacity-50">
              {restaurante.imagenes[currentImageIndex].desc}
            </p>
          </div>
        </div>

        {/* Controles del carrusel (prev/next) */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
          aria-label="Siguiente imagen"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Indicadores de página del carrusel */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {restaurante.imagenes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? "bg-white w-6" : "bg-white/50"
              }`}
              aria-label={`Ir a la imagen ${index + 1}`}
            />
          ))}
        </div>

        {/* Rating y contador de imagen */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full flex items-center space-x-1 z-10">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-gray-800">
            {restaurante.calificacion}
          </span>
        </div>

        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm z-10">
          {currentImageIndex + 1} / {restaurante.imagenes.length}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-6 flex flex-col flex-grow">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="w-full text-left group"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-cyan-600 transition-colors flex items-center justify-between">
            {restaurante.nombre}
            <Info className="w-5 h-5 text-cyan-600 group-hover:scale-110 transition-transform" />
          </h3>
        </button>

        <p className="text-gray-600 mb-4">{restaurante.descripcion}</p>

        {/* Datos rápidos */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <UtensilsCrossed className="w-4 h-4 text-cyan-600" />
            <span>{restaurante.tipoCocina}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-cyan-600" />
            <span>{restaurante.horarios}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
            <span>💰</span>
            <span>{restaurante.rangoPrecios}</span>
          </div>
        </div>

        {/* Si es aliado, mostrar platos destacados */}
        {restaurante.esAliado && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Platos destacados:
            </p>
            <div className="space-y-1">
              {restaurante.menuDestacado.slice(0, 3).map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.plato}</span>
                  <span className="font-semibold text-cyan-600">
                    ${item.precio.toLocaleString("es-CO")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botón para abrir/cerrar el formulario de reserva inline */}
        <button
          onClick={handleReservar}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 mt-auto"
        >
          <span>{isExpanded ? "Cerrar reserva" : "Reservar mesa"}</span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Modal con información completa */}
      {showInfo && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowInfo(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {restaurante.nombre}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                    <span className="font-semibold">
                      {restaurante.calificacion} / 5.0
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowInfo(false)}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all"
                  aria-label="Cerrar información"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Sobre el restaurante
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {restaurante.descripcionCompleta}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 bg-cyan-50 p-4 rounded-lg">
                  <Clock className="w-6 h-6 text-cyan-600" />
                  <div>
                    <p className="text-sm text-gray-600">Horario</p>
                    <p className="font-semibold text-gray-800">
                      {restaurante.horarios}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-cyan-50 p-4 rounded-lg">
                  <Phone className="w-6 h-6 text-cyan-600" />
                  <div>
                    <p className="text-sm text-gray-600">Contacto</p>
                    <p className="font-semibold text-gray-800">
                      {restaurante.telefono}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Chef / Especialidad
                </h3>
                <p className="text-gray-600">{restaurante.chefEspecialidad}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {restaurante.esAliado
                    ? "Menú Destacado (70%)"
                    : "Algunos platos (30%)"}
                </h3>
                <div className="space-y-3">
                  {restaurante.menuDestacado.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:border-cyan-500 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.plato}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.categoria}
                          </p>
                        </div>
                        <p className="text-xl font-bold text-cyan-600">
                          ${item.precio.toLocaleString("es-CO")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">
                      ¿Quieres ver el menú completo?
                    </p>
                    <p className="text-sm text-gray-600">
                      Descarga o visualiza nuestro menú completo
                    </p>
                  </div>
                  <a
                    href={restaurante.linkMenu}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md flex items-center space-x-2"
                  >
                    <span>Ver menú</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowInfo(false);
                  setIsExpanded(true);
                }}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg text-lg"
              >
                Reservar mesa ahora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario expandible de reserva (inline) */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white p-6">
          {/* Mensaje de error general */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Indicador de pasos */}
          <div className="flex items-center justify-center mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    reservaStep >= step
                      ? "bg-cyan-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-12 h-1 ${
                      reservaStep > step ? "bg-cyan-500" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Paso 1: fecha y hora */}
          {reservaStep === 1 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Selecciona fecha y hora
              </h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora
                </label>
                <select
                  value={reservaData.hora}
                  onChange={(e) =>
                    setReservaData({ ...reservaData, hora: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">Selecciona una hora</option>
                  {horariosDisponibles().map((hora, index) => (
                    <option key={index} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de personas
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={reservaData.personas}
                  onChange={(e) =>
                    setReservaData({
                      ...reservaData,
                      personas: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={nextStep}
                disabled={!reservaData.fecha || !reservaData.hora}
                className="w-full bg-cyan-500 text-white py-3 rounded-lg font-semibold hover:bg-cyan-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </div>
          )}

          {/* Paso 2: ocasión especial + comentarios */}
          {reservaStep === 2 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                ¿Es una ocasión especial?
              </h4>

              <div className="flex items-center space-x-4 mb-4">
                <button
                  onClick={() =>
                    setReservaData({
                      ...reservaData,
                      ocasionEspecial: false,
                      tipoOcasion: "",
                    })
                  }
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                    !reservaData.ocasionEspecial
                      ? "bg-cyan-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  No
                </button>
                <button
                  onClick={() =>
                    setReservaData({ ...reservaData, ocasionEspecial: true })
                  }
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                    reservaData.ocasionEspecial
                      ? "bg-cyan-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Sí
                </button>
              </div>

              {reservaData.ocasionEspecial && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de ocasión
                  </label>
                  <select
                    value={reservaData.tipoOcasion}
                    onChange={(e) =>
                      setReservaData({
                        ...reservaData,
                        tipoOcasion: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="Cumpleaños">Cumpleaños</option>
                    <option value="Aniversario">Aniversario</option>
                    <option value="Cena de negocios">Cena de negocios</option>
                    <option value="Celebración familiar">
                      Celebración familiar
                    </option>
                    <option value="Cita romántica">Cita romántica</option>
                    <option value="Graduación">Graduación</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentarios adicionales (opcional)
                </label>
                <textarea
                  value={reservaData.comentarios}
                  onChange={(e) =>
                    setReservaData({
                      ...reservaData,
                      comentarios: e.target.value,
                    })
                  }
                  placeholder="Alergias, preferencias de mesa, etc."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={prevStep}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Atrás
                </button>
                <button
                  onClick={nextStep}
                  disabled={
                    reservaData.ocasionEspecial && !reservaData.tipoOcasion
                  }
                  className="flex-1 bg-cyan-500 text-white py-3 rounded-lg font-semibold hover:bg-cyan-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Paso 3: confirmación y envío */}
          {reservaStep === 3 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Confirmar reserva
              </h4>

              <div className="bg-white rounded-lg p-4 space-y-3 border border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Restaurante:</span>
                  <span className="font-semibold text-gray-800">
                    {restaurante.nombre}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(reservaData.fecha).toLocaleDateString("es-CO")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hora:</span>
                  <span className="font-semibold text-gray-800">
                    {reservaData.hora}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Personas:</span>
                  <span className="font-semibold text-gray-800">
                    {reservaData.personas}
                  </span>
                </div>
                {reservaData.ocasionEspecial && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ocasión especial:</span>
                    <span className="font-semibold text-cyan-600">
                      {reservaData.tipoOcasion}
                    </span>
                  </div>
                )}
                {reservaData.comentarios && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-600 mb-1">Comentarios:</p>
                    <p className="text-gray-800">{reservaData.comentarios}</p>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={prevStep}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Atrás
                </button>
                <button
                  onClick={confirmarReserva}
                  disabled={loading}
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
        </div>
      )}
    </div>
  );
};

export default RestauranteCard;
