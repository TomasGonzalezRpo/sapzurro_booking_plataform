// src/components/MisReservasContent.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  MapPin,
  DollarSign,
  Users,
  CheckCircle,
  AlertCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader,
} from "lucide-react";

const MisReservasContent = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("todas");
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
        return "border-l-4 border-l-emerald-500 bg-emerald-50";
      case "pendiente":
        return "border-l-4 border-l-yellow-500 bg-yellow-50";
      case "cancelada":
        return "border-l-4 border-l-red-500 bg-red-50";
      default:
        return "border-l-4 border-l-gray-500 bg-gray-50";
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "confirmada":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case "pendiente":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "cancelada":
        return <Trash2 className="w-5 h-5 text-red-600" />;
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
    <div className="space-y-8">
      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Mis Reservas</h1>
        <p className="text-gray-600 mt-2">
          Visualiza y gestiona todas tus reservas
        </p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {["todas", "confirmada", "pendiente", "cancelada"].map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              filtro === f
                ? "bg-cyan-500 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:border-cyan-500"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} (
            {reservas.filter((r) => f === "todas" || r.estado === f).length})
          </button>
        ))}
      </div>

      {/* Estado: Cargando */}
      {loading && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <Loader className="w-12 h-12 text-cyan-500 mx-auto animate-spin" />
          <p className="text-gray-600 mt-4">Cargando reservas...</p>
        </div>
      )}

      {/* Estado: Error */}
      {error && !loading && (
        <div className="bg-red-50 border-l-4 border-l-red-500 rounded-lg p-4 text-red-700">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Estado: Sin reservas */}
      {!loading && !error && reservasFiltradas.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No hay reservas {filtro !== "todas" ? `${filtro}s` : ""}
          </p>
          <p className="text-gray-400">Crea una reserva para comenzar</p>
        </div>
      )}

      {/* Lista de reservas */}
      {!loading && !error && reservasFiltradas.length > 0 && (
        <div className="grid gap-4">
          {reservasFiltradas.map((reserva) => (
            <div
              key={reserva.id_reserva}
              className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 ${getEstadoColor(
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
                  <div className="text-4xl">
                    {getServiceIcon(reserva.tipo_servicio)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {reserva.nombre_servicio}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2 flex-wrap gap-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(reserva.fecha_inicio).toLocaleDateString(
                            "es-CO"
                          )}
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
                  <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white">
                    {getEstadoIcon(reserva.estado)}
                    <span className="text-sm font-medium">
                      {getEstadoLabel(reserva.estado)}
                    </span>
                  </div>
                  {expandedId === reserva.id_reserva ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </div>
              </div>

              {/* Detalles expandidos */}
              {expandedId === reserva.id_reserva && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium">ID Reserva</p>
                      <p className="text-gray-800 font-mono">
                        #{reserva.id_reserva}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Tipo</p>
                      <p className="text-gray-800 capitalize">
                        {reserva.tipo_servicio}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Fecha Reserva</p>
                      <p className="text-gray-800">
                        {new Date(reserva.fecha_reserva).toLocaleDateString(
                          "es-CO"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">
                        Precio Unitario
                      </p>
                      <p className="text-gray-800">
                        ${reserva.precio_unitario.toLocaleString("es-CO")}
                      </p>
                    </div>
                  </div>

                  {reserva.notas_admin && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-sm text-gray-600 font-medium">
                        Comentarios
                      </p>
                      <p className="text-gray-800 mt-1">
                        {reserva.notas_admin}
                      </p>
                    </div>
                  )}

                  {reserva.estado !== "cancelada" && (
                    <button
                      onClick={() => handleCancelarReserva(reserva.id_reserva)}
                      disabled={cancelando === reserva.id_reserva}
                      className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {cancelando === reserva.id_reserva ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
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
  );
};

export default MisReservasContent;
