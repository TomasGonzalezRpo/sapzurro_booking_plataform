import React, { useState } from "react";
import HotelCard from "./HotelCard";
import { hotelesDemo } from "../data/hotelesData";

const HotelesSection = () => {
  const [filtros, setFiltros] = useState({
    precioMax: 500000,
    calificacionMin: 0,
  });

  return (
    <section
      id="hoteles"
      className="py-20 px-4 bg-gradient-to-b from-white to-cyan-50"
    >
      <div className="container mx-auto">
        {/* Título de la sección */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Hoteles en Sapzurro
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encuentra el alojamiento perfecto para tu estadía en el paraíso
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Controles de filtro */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Filtrar por:
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio máximo por noche: $
                {filtros.precioMax.toLocaleString("es-CO")}
              </label>
              <input
                type="range"
                min="50000"
                max="500000"
                step="50000"
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
          </div>
        </div>

        {/* Grid con los hoteles que cumplen los filtros */}
        <div className="grid md:grid-cols-2 gap-8">
          {hotelesDemo
            .filter(
              (hotel) =>
                hotel.precioDesde <= filtros.precioMax &&
                hotel.calificacion >= filtros.calificacionMin
            )
            .map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
        </div>

        {/* Mensaje cuando no hay resultados */}
        {hotelesDemo.filter(
          (hotel) =>
            hotel.precioDesde <= filtros.precioMax &&
            hotel.calificacion >= filtros.calificacionMin
        ).length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No se encontraron hoteles con estos filtros
            </p>
            <button
              onClick={() =>
                setFiltros({ precioMax: 500000, calificacionMin: 0 })
              }
              className="mt-4 text-cyan-600 hover:text-cyan-700 font-semibold"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HotelesSection;
