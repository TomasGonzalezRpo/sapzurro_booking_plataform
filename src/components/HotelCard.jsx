import React, { useState } from "react";
import {
  Star,
  Wifi,
  Coffee,
  UtensilsCrossed,
  Wind,
  Waves,
  Sun,
  MapPin,
  Tv,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check,
  Info,
  X,
} from "lucide-react";

const HotelCard = ({ hotel }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reservaStep, setReservaStep] = useState(1);
  const [reservaData, setReservaData] = useState({
    checkIn: "",
    checkOut: "",
    huespedes: 1,
    tipoHabitacion: "",
    cantidadHabitaciones: 1,
  });

  const amenityIcons = {
    Wifi: <Wifi className="w-4 h-4" />,
    Desayuno: <Coffee className="w-4 h-4" />,
    Restaurante: <UtensilsCrossed className="w-4 h-4" />,
    "Aire acondicionado": <Wind className="w-4 h-4" />,
    "Vista al mar": <Waves className="w-4 h-4" />,
    Piscina: <Waves className="w-4 h-4" />,
    Bar: <Coffee className="w-4 h-4" />,
    "Cocina compartida": <UtensilsCrossed className="w-4 h-4" />,
    Terraza: <Sun className="w-4 h-4" />,
    Tours: <MapPin className="w-4 h-4" />,
    Kayaks: <Waves className="w-4 h-4" />,
    Tv: <Tv className="w-4 h-4" />,
    Biblioteca: <Coffee className="w-4 h-4" />,
    "Acceso a playa": <Waves className="w-4 h-4" />,
    "Huerta orgánica": <Sun className="w-4 h-4" />,
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % hotel.imagenes.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + hotel.imagenes.length) % hotel.imagenes.length
    );
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

  const getMinCheckOut = () => {
    if (!reservaData.checkIn) return "";
    const checkInDate = new Date(reservaData.checkIn);
    checkInDate.setDate(checkInDate.getDate() + 1);
    return checkInDate.toISOString().split("T")[0];
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Carrusel de imágenes */}
      <div className="relative h-64 bg-gradient-to-br overflow-hidden group">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${hotel.imagenes[currentImageIndex].color} transition-all duration-500`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <Waves className="w-16 h-16 mx-auto mb-2 opacity-50" />
              <p className="text-sm opacity-75">
                {hotel.imagenes[currentImageIndex].desc}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {hotel.imagenes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? "bg-white w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>

        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full flex items-center space-x-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-gray-800">
            {hotel.calificacion}
          </span>
        </div>

        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
          {currentImageIndex + 1} / {hotel.imagenes.length}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="w-full text-left group"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-cyan-600 transition-colors flex items-center justify-between">
            {hotel.nombre}
            <Info className="w-5 h-5 text-cyan-600 group-hover:scale-110 transition-transform" />
          </h3>
        </button>

        <p className="text-gray-600 mb-4">{hotel.descripcion}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {hotel.amenidades.slice(0, 4).map((amenidad, index) => (
            <div
              key={index}
              className="flex items-center space-x-1 bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-sm"
            >
              {amenityIcons[amenidad]}
              <span>{amenidad}</span>
            </div>
          ))}
          {hotel.amenidades.length > 4 && (
            <div className="flex items-center bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
              +{hotel.amenidades.length - 4} más
            </div>
          )}
        </div>

        <div className="mb-4">
          <p className="text-3xl font-bold text-cyan-600">
            ${hotel.precioDesde.toLocaleString("es-CO")}
          </p>
          <p className="text-sm text-gray-500">Desde esta tarifa por noche</p>
        </div>

        <button
          onClick={handleReservar}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
        >
          <span>{isExpanded ? "Cerrar reserva" : "Reservar ahora"}</span>
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
                  <h2 className="text-3xl font-bold mb-2">{hotel.nombre}</h2>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                    <span className="font-semibold">
                      {hotel.calificacion} / 5.0
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
                  Sobre el hotel
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {hotel.descripcionCompleta}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Amenidades
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {hotel.amenidades.map((amenidad, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 bg-cyan-50 text-cyan-700 px-4 py-2 rounded-lg"
                    >
                      {amenityIcons[amenidad]}
                      <span className="font-medium">{amenidad}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Servicios adicionales
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {hotel.servicios.map((servicio, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 text-gray-700"
                    >
                      <Check className="w-5 h-5 text-emerald-500" />
                      <span>{servicio}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Tipos de habitación
                </h3>
                <div className="space-y-3">
                  {hotel.tiposHabitacion.map((tipo, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:border-cyan-500 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {tipo.tipo}
                          </p>
                          <p className="text-sm text-gray-500">
                            {tipo.disponibles} habitaciones disponibles
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-cyan-600">
                          ${tipo.precio.toLocaleString("es-CO")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowInfo(false);
                  setIsExpanded(true);
                }}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg text-lg"
              >
                Reservar ahora
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
                Selecciona las fechas
              </h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in
                </label>
                <input
                  type="date"
                  value={reservaData.checkIn}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setReservaData({
                      ...reservaData,
                      checkIn: e.target.value,
                      checkOut: "",
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out
                  {reservaData.checkIn && (
                    <span className="text-cyan-600 ml-2">
                      (después del{" "}
                      {new Date(reservaData.checkIn).toLocaleDateString(
                        "es-CO"
                      )}
                      )
                    </span>
                  )}
                </label>
                <input
                  type="date"
                  value={reservaData.checkOut}
                  min={getMinCheckOut()}
                  disabled={!reservaData.checkIn}
                  onChange={(e) =>
                    setReservaData({ ...reservaData, checkOut: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {!reservaData.checkIn && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selecciona primero la fecha de check-in
                  </p>
                )}
              </div>

              <button
                onClick={nextStep}
                disabled={!reservaData.checkIn || !reservaData.checkOut}
                className="w-full bg-cyan-500 text-white py-3 rounded-lg font-semibold hover:bg-cyan-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </div>
          )}

          {reservaStep === 2 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Detalles de la reserva
              </h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de habitación
                </label>
                <select
                  value={reservaData.tipoHabitacion}
                  onChange={(e) =>
                    setReservaData({
                      ...reservaData,
                      tipoHabitacion: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">Selecciona un tipo</option>
                  {hotel.tiposHabitacion.map((tipo, index) => (
                    <option key={index} value={tipo.tipo}>
                      {tipo.tipo} - ${tipo.precio.toLocaleString("es-CO")} (
                      {tipo.disponibles} disponibles)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad de habitaciones
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={reservaData.cantidadHabitaciones}
                  onChange={(e) =>
                    setReservaData({
                      ...reservaData,
                      cantidadHabitaciones: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de huéspedes
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={reservaData.huespedes}
                  onChange={(e) =>
                    setReservaData({
                      ...reservaData,
                      huespedes: parseInt(e.target.value),
                    })
                  }
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
                  disabled={!reservaData.tipoHabitacion}
                  className="flex-1 bg-cyan-500 text-white py-3 rounded-lg font-semibold hover:bg-cyan-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
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
                  <span className="text-gray-600">Hotel:</span>
                  <span className="font-semibold text-gray-800">
                    {hotel.nombre}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(reservaData.checkIn).toLocaleDateString("es-CO")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(reservaData.checkOut).toLocaleDateString("es-CO")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo de habitación:</span>
                  <span className="font-semibold text-gray-800">
                    {reservaData.tipoHabitacion}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Habitaciones:</span>
                  <span className="font-semibold text-gray-800">
                    {reservaData.cantidadHabitaciones}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Huéspedes:</span>
                  <span className="font-semibold text-gray-800">
                    {reservaData.huespedes}
                  </span>
                </div>

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">
                      Total estimado:
                    </span>
                    <span className="text-2xl font-bold text-cyan-600">
                      $
                      {(
                        hotel.tiposHabitacion.find(
                          (t) => t.tipo === reservaData.tipoHabitacion
                        )?.precio * reservaData.cantidadHabitaciones || 0
                      ).toLocaleString("es-CO")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Por noche</p>
                </div>
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
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <Check className="w-5 h-5" />
                  <span>Confirmar reserva</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelCard;
