import React, { useState } from "react";
import RestauranteCard from "./RestauranteCard";
import {
  restaurantesAliados,
  restaurantesNoAliados,
  tiposCocina,
} from "../data/restaurantesData";
import { Award, UtensilsCrossed } from "lucide-react";

const RestaurantesSection = () => {
  const [filtros, setFiltros] = useState({
    tipoCocina: "Todos",
    precioMax: 200000,
    calificacionMin: 0,
    horario24h: false,
  });

  const filtrarRestaurantes = (restaurantes) => {
    return restaurantes.filter((restaurante) => {
      const cumpleTipoCocina =
        filtros.tipoCocina === "Todos" ||
        restaurante.tipoCocina === filtros.tipoCocina;

      // Extraer precio máximo del rango
      const precioMaxRestaurante = parseInt(
        restaurante.rangoPrecios.match(/\d+/g)?.pop() || 0
      );
      const cumplePrecio = precioMaxRestaurante <= filtros.precioMax;

      const cumpleCalificacion =
        restaurante.calificacion >= filtros.calificacionMin;

      const cumpleHorario =
        !filtros.horario24h || restaurante.horarios === "24 horas";

      return (
        cumpleTipoCocina && cumplePrecio && cumpleCalificacion && cumpleHorario
      );
    });
  };

  const restaurantesAliadosFiltrados = filtrarRestaurantes(restaurantesAliados);
  const restaurantesNoAliadosFiltrados = filtrarRestaurantes(
    restaurantesNoAliados
  );
  const totalRestaurantes =
    restaurantesAliadosFiltrados.length + restaurantesNoAliadosFiltrados.length;

  return (
    <section
      id="restaurantes"
      className="py-20 px-4 bg-gradient-to-b from-cyan-50 to-white"
    >
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Restaurantes en Sapzurro
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre la diversidad gastronómica del paraíso caribeño
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 max-w-6xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <UtensilsCrossed className="w-5 h-5 text-cyan-600" />
            <span>Filtrar restaurantes:</span>
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tipo de cocina */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de cocina
              </label>
              <select
                value={filtros.tipoCocina}
                onChange={(e) =>
                  setFiltros({ ...filtros, tipoCocina: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                {tiposCocina.map((tipo, index) => (
                  <option key={index} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            {/* Precio máximo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio máximo: ${filtros.precioMax.toLocaleString("es-CO")}
              </label>
              <input
                type="range"
                min="20000"
                max="200000"
                step="10000"
                value={filtros.precioMax}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    precioMax: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Calificación mínima */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calificación mínima:{" "}
                {filtros.calificacionMin > 0
                  ? filtros.calificacionMin
                  : "Todas"}
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filtros.calificacionMin}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    calificacionMin: parseFloat(e.target.value),
                  })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Abierto 24 horas */}
            <div className="flex items-center">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filtros.horario24h}
                  onChange={(e) =>
                    setFiltros({ ...filtros, horario24h: e.target.checked })
                  }
                  className="w-5 h-5 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Solo 24 horas
                </span>
              </label>
            </div>
          </div>

          {/* Botón limpiar filtros */}
          {(filtros.tipoCocina !== "Todos" ||
            filtros.precioMax !== 200000 ||
            filtros.calificacionMin !== 0 ||
            filtros.horario24h) && (
            <div className="mt-4 text-center">
              <button
                onClick={() =>
                  setFiltros({
                    tipoCocina: "Todos",
                    precioMax: 200000,
                    calificacionMin: 0,
                    horario24h: false,
                  })
                }
                className="text-cyan-600 hover:text-cyan-700 font-semibold text-sm"
              >
                Limpiar todos los filtros
              </button>
            </div>
          )}
        </div>

        {/* Contador de resultados */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            Mostrando{" "}
            <span className="font-bold text-cyan-600">{totalRestaurantes}</span>{" "}
            restaurante{totalRestaurantes !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Sección de Restaurantes Aliados */}
        {restaurantesAliadosFiltrados.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <Award className="w-8 h-8 text-emerald-500" />
              <h3 className="text-3xl font-bold text-gray-800">
                Restaurantes Aliados
              </h3>
            </div>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Restaurantes con los que tenemos alianza. Disfruta de menús más
              completos, promociones especiales y beneficios exclusivos.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {restaurantesAliadosFiltrados.map((restaurante) => (
                <RestauranteCard
                  key={restaurante.id}
                  restaurante={restaurante}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sección de Restaurantes No Aliados */}
        {restaurantesNoAliadosFiltrados.length > 0 && (
          <div>
            <div className="flex items-center justify-center space-x-3 mb-8">
              <UtensilsCrossed className="w-8 h-8 text-gray-500" />
              <h3 className="text-3xl font-bold text-gray-800">
                Otros Restaurantes
              </h3>
            </div>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Excelentes opciones gastronómicas en Sapzurro. Información básica
              disponible.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurantesNoAliadosFiltrados.map((restaurante) => (
                <RestauranteCard
                  key={restaurante.id}
                  restaurante={restaurante}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mensaje si no hay resultados */}
        {totalRestaurantes === 0 && (
          <div className="text-center py-12">
            <UtensilsCrossed className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-4">
              No se encontraron restaurantes con estos filtros
            </p>
            <button
              onClick={() =>
                setFiltros({
                  tipoCocina: "Todos",
                  precioMax: 200000,
                  calificacionMin: 0,
                  horario24h: false,
                })
              }
              className="text-cyan-600 hover:text-cyan-700 font-semibold"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Banner informativo */}
        <div className="mt-16 bg-gradient-to-r from-cyan-100 to-blue-100 border-2 border-cyan-300 rounded-2xl p-8 text-center">
          <h4 className="text-2xl font-bold text-gray-800 mb-3">
            ¿Eres propietario de un restaurante?
          </h4>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Únete a nuestra plataforma y disfruta de los beneficios de ser un
            restaurante aliado: mayor visibilidad, acceso a más clientes y
            promociones especiales.
          </p>
          <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-3 rounded-full font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg">
            Conviértete en aliado
          </button>
        </div>
      </div>
    </section>
  );
};

export default RestaurantesSection;
