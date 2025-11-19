// src/components/ActivitiesCard.jsx

import React, { useState } from "react";
import {
  Star,
  MapPin,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check,
  Info,
  X,
  Calendar,
  Shield,
  Heart,
  // ÍCONOS CORREGIDOS DE ACTIVIDADES
  Waves, // Usado para IconoBuceo
  Mountain, // Usado para IconoSenderismo
  Sailboat, // Usado para IconoKayak
  Feather, // Usado para IconoFauna
} from "lucide-react";

// Función para mapear el string 'icon' a un componente Lucide
const getIconComponent = (iconName) => {
  switch (iconName) {
    case "IconoBuceo":
      return Waves;
    case "IconoSenderismo":
      return Mountain;
    case "IconoKayak":
      return Sailboat;
    case "IconoFauna":
      return Feather;
    default:
      return Heart; // Fallback
  }
};

const ActivitiesCard = ({ activity }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reservaStep, setReservaStep] = useState(1);
  const [reservaData, setReservaData] = useState({
    fecha: "",
    participantes: 1,
    horario: "",
  });

  const categoryIcons = {
    acuaticas: "🌊",
    senderismo: "🥾",
    nocturnas: "🌙",
    aventura: "⚡",
    cultural: "🏛",
    relax: "😌",
  };

  const difficultyColors = {
    Baja: "bg-green-100 text-green-800",
    Media: "bg-yellow-100 text-yellow-800",
    Alta: "bg-red-100 text-red-800",
  };

  // Componente de ícono dinámico
  const IconComponent = getIconComponent(activity.icon);

  // Asegura que images.length sea seguro (usa activity.imagenes)
  const imageCount = activity.imagenes ? activity.imagenes.length : 0;

  // Calificación formateada (aseguramos un decimal)
  const formattedRating = activity.calificacion
    ? activity.calificacion.toFixed(1)
    : "N/A";

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % imageCount);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + imageCount) % imageCount);
  };

  const handleReservar = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setReservaStep(1);
    }
  };

  const nextStep = () => {
    if (reservaStep < 3) setReservaStep(reservaStep + 1);
  };

  const prevStep = () => {
    if (reservaStep > 1) setReservaStep(reservaStep - 1);
  };

  const confirmarReserva = () => {
    alert("Debe iniciar sesión para completar la reserva");
  };

  return (
    // 1. Contenedor principal
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
      {/* Carrusel de imágenes */}
      <div className="relative h-64 bg-gradient-to-br overflow-hidden group">
        {/* Lógica de la imagen */}
        {imageCount > 0 ? (
          // Si hay imágenes, usa la URL de la imagen
          <img
            src={activity.imagenes[currentImageIndex]}
            alt={`${activity.name} - Foto ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        ) : (
          // Placeholder (usando el color definido en Activities.js)
          <div
            className={`absolute inset-0 bg-gradient-to-br ${activity.color} flex items-center justify-center`}
          >
            <div className="text-center text-white">
              <IconComponent className="w-16 h-16 text-white/50 mb-2" />
              <p className="text-sm opacity-75">{activity.name}</p>
            </div>
          </div>
        )}

        {/* Botones de navegación (si hay más de 1 imagen) */}
        {imageCount > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {activity.imagenes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Calificación (Usa activity.calificacion) */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full flex items-center space-x-1 z-10">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-gray-800">{formattedRating}</span>
        </div>

        {/* Contador de imagen */}
        {imageCount > 0 && (
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm z-10">
            {currentImageIndex + 1} / {imageCount}
          </div>
        )}

        {/* Badge de categoría */}
        {/* Nota: Asumimos que activity.category existe para mostrar el badge */}
        <div className="absolute top-16 left-4 bg-cyan-500 text-white px-3 py-1 rounded-full text-sm font-medium capitalize z-10">
          {activity.category}
        </div>
      </div>

      {/* 2. Contenido */}
      <div className="p-6 flex flex-col flex-grow">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="w-full text-left group"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-cyan-600 transition-colors flex items-center justify-between">
            {activity.name}
            <Info className="w-5 h-5 text-cyan-600 group-hover:scale-110 transition-transform" />
          </h3>
        </button>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {activity.description}
        </p>

        {/* Información rápida */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{activity.duration}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{activity.location}</span>
          </div>
        </div>

        {/* Dificultad */}
        <div className="mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              difficultyColors[activity.difficulty]
            }`}
          >
            Dificultad: {activity.difficulty}
          </span>
        </div>

        {/* Incluye */}
        <div className="flex flex-wrap gap-2 mb-4">
          {activity.includes.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm"
            >
              <Check className="w-3 h-3" />
              <span>{item}</span>
            </div>
          ))}
          {activity.includes.length > 3 && (
            <div className="flex items-center bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
              +{activity.includes.length - 3} más
            </div>
          )}
        </div>

        {/* Precio */}
        <div className="mt-auto mb-4">
          <p className="text-3xl font-bold text-cyan-600">
            ${activity.price.toLocaleString("es-CO")}
          </p>
          <p className="text-sm text-gray-500">Por persona</p>
        </div>

        <button
          onClick={handleReservar}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
        >
          <span>{isExpanded ? "Cerrar reserva" : "Reservar actividad"}</span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>
      {/* Modal de información completa */}
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
                  <h2 className="text-3xl font-bold mb-2">{activity.name}</h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                      <span className="font-semibold">
                        {formattedRating} / 5.0
                      </span>
                    </div>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm capitalize">
                      {activity.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowInfo(false)}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Descripción completa
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {activity.fullDescription}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-cyan-50 rounded-lg">
                  <Clock className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-800">Duración</p>
                  <p className="text-sm text-gray-600">{activity.duration}</p>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <Users className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-800">Grupo</p>
                  <p className="text-sm text-gray-600">
                    Hasta {activity.maxParticipants} personas
                  </p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-800">Dificultad</p>
                  <p className="text-sm text-gray-600">{activity.difficulty}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-800">Ubicación</p>
                  <p className="text-sm text-gray-600">{activity.location}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Incluye
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {activity.includes.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 text-gray-700"
                    >
                      <Check className="w-5 h-5 text-emerald-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Ideal para
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activity.idealFor.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {activity.requirements && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Requisitos
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {activity.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => {
                  setShowInfo(false);
                  setIsExpanded(true);
                }}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg text-lg"
              >
                Reservar actividad
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Formulario de reserva expandible */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white p-6">
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

          {reservaStep === 1 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Selecciona la fecha
              </h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de la actividad
                </label>
                <input
                  type="date"
                  value={reservaData.fecha}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setReservaData({
                      ...reservaData,
                      fecha: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horario preferido
                </label>
                <select
                  value={reservaData.horario}
                  onChange={(e) =>
                    setReservaData({ ...reservaData, horario: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">Selecciona un horario</option>
                  <option value="mañana">Mañana (8:00 AM - 12:00 PM)</option>
                  <option value="tarde">Tarde (1:00 PM - 5:00 PM)</option>
                  <option value="noche">Noche (6:00 PM - 10:00 PM)</option>
                </select>
              </div>

              <button
                onClick={nextStep}
                disabled={!reservaData.fecha || !reservaData.horario}
                className="w-full bg-cyan-500 text-white py-3 rounded-lg font-semibold hover:bg-cyan-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </div>
          )}

          {reservaStep === 2 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Detalles de participantes
              </h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de participantes
                </label>
                <input
                  type="number"
                  min="1"
                  max={activity.maxParticipants}
                  value={reservaData.participantes}
                  onChange={(e) =>
                    setReservaData({
                      ...reservaData,
                      participantes: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Máximo {activity.maxParticipants} participantes por grupo
                </p>
              </div>

              {/* Bloque de botones */}
              <div className="flex justify-center">
                <div className="flex space-x-3 w-full max-w-sm">
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!reservaData.participantes}
                    className="flex-1 bg-cyan-500 text-white py-3 rounded-lg font-semibold hover:bg-cyan-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            </div>
          )}

          {reservaStep === 3 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Confirmar reserva
              </h4>

              <div className="bg-white rounded-lg p-4 space-y-3 border border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Actividad:</span>
                  <span className="font-semibold text-gray-800">
                    {activity.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(reservaData.fecha).toLocaleDateString("es-CO")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horario:</span>
                  <span className="font-semibold text-gray-800 capitalize">
                    {reservaData.horario}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Participantes:</span>
                  <span className="font-semibold text-gray-800">
                    {reservaData.participantes}
                  </span>
                </div>

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">
                      Total:
                    </span>
                    <span className="text-2xl font-bold text-cyan-600">
                      $
                      {(
                        activity.price * reservaData.participantes
                      ).toLocaleString("es-CO")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bloque de botones */}
              <div className="flex justify-center">
                <div className="flex space-x-3 w-full max-w-sm">
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={confirmarReserva}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>Confirmar reserva</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivitiesCard;
