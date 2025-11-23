// src/components/MisReservasPage.jsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import {
  X,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const MisReservasPage = ({ onClose }) => {
  const { user } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("todas"); // todas, confirmada, pendiente, cancelada
  const [expandedId, setExpandedId] = useState(null);
  const [cancelando, setCancelando] = useState(null);

  // 🔑 OBTENER MIS RESERVAS
  useEffect(() => {
    const obtenerReservas = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get("http://localhost:5000/api/reservas", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("sapzurro_token")}`,
          },
        });

        if (response.data.success) {
          setReservas(response.data.reservas || []);
        } else {
          setError(response.data.message || "Error al obtener reservas");
        }
      } catch (err) {
        console.error("Error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Error al cargar reservas"
        );
      } finally {
        setLoading(false);
      }
    };

    obtenerReservas();
  }, []);

  // 🔑 FILTRAR RESERVAS
  const reservasFiltradas =
    filtro === "todas" ? reservas : reservas.filter((r) => r.estado === filtro);

  // 🔑 CANCELAR RESERVA
  const handleCancelarReserva = async (id_reserva) => {
    if (!window.confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
      return;
    }

    try {
      setCancelando(id_reserva);

      const response = await axios.delete(
        `http://localhost:5000/api/reservas/${id_reserva}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("sapzurro_token")}`,
          },
        }
      );

      if (response.data.success) {
        // Actualizar estado en la lista
        setReservas(
          reservas.map((r) =>
            r.id_reserva === id_reserva ? { ...r, estado: "cancelada" } : r
          )
        );
        alert("Reserva cancelada exitosamente");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error al cancelar la reserva");
    } finally {
      setCancelando(null);
    }
  };

  // 🔑 OBTENER COLOR DEL ESTADO
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "confirmada":
        return "bg-emerald-50 border-emerald-200";
      case "pendiente":
        return "bg-yellow-50 border-yellow-200";
      case "cancelada":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "confirmada":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case "pendiente":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "cancelada":
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getEstadoLabel = (estado) => {
    switch (estado) {
      case "confirmada":
        return "Confirmada";
      case "pendiente":
        return "Pendiente";
      case "cancelada":
        return "Cancelada";
      default:
        return estado;
    }
  };

  // 🔑 OBTENER ÍCONO DEL TIPO DE SERVICIO
  const getServiceIcon = (tipo) => {
    switch (tipo) {
      case "hotel":
        return "🏨";
      case "restaurante":
        return "🍽️";
      case "actividad":
        return "🎯";
      case "ruta":
        return "🗺️";
      default:
        return "📌";
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-70 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        {/* Encabezado */}
        <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 flex justify-between items-start rounded-t-2xl">
          <div>
            <h2 className="text-3xl font-bold mb-1">Mis Reservas</h2>
            <p className="text-cyan-100">
              Gestiona y visualiza todas tus reservas
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Filtros */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {["todas", "confirmada", "pendiente", "cancelada"].map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  filtro === f
                    ? "bg-cyan-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)} (
                {reservas.filter((r) => f === "todas" || r.estado === f).length}
                )
              </button>
            ))}
          </div>

          {/* Estado: Cargando */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin inline-block">⏳</div>
              <p className="text-gray-600 mt-2">Cargando reservas...</p>
            </div>
          )}

          {/* Estado: Error */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Estado: Sin reservas */}
          {!loading && !error && reservasFiltradas.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No hay reservas {filtro !== "todas" ? `${filtro}s` : ""}
              </p>
              <p className="text-gray-400">Crea una reserva para comenzar</p>
            </div>
          )}

          {/* Lista de reservas */}
          {!loading && !error && reservasFiltradas.length > 0 && (
            <div className="space-y-4">
              {reservasFiltradas.map((reserva) => (
                <div
                  key={reserva.id_reserva}
                  className={`border rounded-xl p-4 transition-all ${getEstadoColor(
                    reserva.estado
                  )}`}
                >
                  {/* Header de la reserva */}
                  <div
                    onClick={() =>
                      setExpandedId(
                        expandedId === reserva.id_reserva
                          ? null
                          : reserva.id_reserva
                      )
                    }
                    className="cursor-pointer flex items-start justify-between"
                  >
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="text-3xl">
                        {getServiceIcon(reserva.tipo_servicio)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800">
                          {reserva.nombre_servicio}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(
                                reserva.fecha_inicio
                              ).toLocaleDateString("es-CO")}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{reserva.cantidad_personas} personas</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>
                              ${reserva.precio_total.toLocaleString("es-CO")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Estado y botón expandir */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white/50">
                        {getEstadoIcon(reserva.estado)}
                        <span className="text-sm font-medium">
                          {getEstadoLabel(reserva.estado)}
                        </span>
                      </div>
                      {expandedId === reserva.id_reserva ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {/* Detalles expandidos */}
                  {expandedId === reserva.id_reserva && (
                    <div className="mt-4 pt-4 border-t border-gray-300/50 space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">ID de Reserva</p>
                          <p className="font-semibold text-gray-800">
                            #{reserva.id_reserva}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Tipo de Servicio</p>
                          <p className="font-semibold text-gray-800 capitalize">
                            {reserva.tipo_servicio}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Fecha de Reserva</p>
                          <p className="font-semibold text-gray-800">
                            {new Date(reserva.fecha_reserva).toLocaleDateString(
                              "es-CO"
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Precio Unitario</p>
                          <p className="font-semibold text-gray-800">
                            ${reserva.precio_unitario.toLocaleString("es-CO")}
                          </p>
                        </div>
                      </div>

                      {reserva.notas_admin && (
                        <div className="bg-white/50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Comentarios</p>
                          <p className="text-gray-800">{reserva.notas_admin}</p>
                        </div>
                      )}

                      {reserva.estado !== "cancelada" && (
                        <button
                          onClick={() =>
                            handleCancelarReserva(reserva.id_reserva)
                          }
                          disabled={cancelando === reserva.id_reserva}
                          className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {cancelando === reserva.id_reserva ? (
                            <>
                              <div className="animate-spin">⏳</div>
                              <span>Cancelando...</span>
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4" />
                              <span>Cancelar Reserva</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisReservasPage;
