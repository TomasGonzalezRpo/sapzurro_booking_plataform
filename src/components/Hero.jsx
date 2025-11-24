import React from "react";
import { MapPin, Sun, Waves } from "lucide-react";

const Hero = ({ scrollToSection }) => {
  return (
    <section id="inicio" className="pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          style={{ height: "600px" }}
        >
          {/* fondo decorativo */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-emerald-400">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-200 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-emerald-200 rounded-full blur-3xl"></div>
            </div>
          </div>

          {/* contenido principal del hero */}
          <div className="relative h-full flex items-center justify-center text-center px-4">
            <div className="max-w-4xl">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6">
                <MapPin className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">
                  Paraíso Caribeño
                </span>
              </div>

              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
                Descubre Sapzurro
              </h2>

              <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-2xl mx-auto drop-shadow-md">
                Un rincón mágico donde la selva se encuentra con el mar Caribe
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => scrollToSection("hoteles")}
                  className="group bg-white text-cyan-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-cyan-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Reserva Ahora
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>

                <button
                  onClick={() => scrollToSection("sobre-sapzurro")}
                  className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all border-2 border-white/50"
                >
                  Conoce Más
                </button>
              </div>

              {/* estadísticas flotantes simples */}
              <div className="mt-12 flex flex-wrap justify-center gap-6">
                <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30">
                  <div className="flex items-center space-x-2">
                    <Sun className="w-5 h-5 text-yellow-200" />
                    <div className="text-left">
                      <p className="text-white text-2xl font-bold">28°C</p>
                      <p className="text-white/80 text-xs">Clima perfecto</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30">
                  <div className="flex items-center space-x-2">
                    <Waves className="w-5 h-5 text-blue-200" />
                    <div className="text-left">
                      <p className="text-white text-2xl font-bold">10+</p>
                      <p className="text-white/80 text-xs">Playas vírgenes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* sección de bienvenida */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Bienvenido al Paraíso
              </h3>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed text-center mb-6">
              Sapzurro es una joya escondida en el Chocó colombiano, donde aguas
              cristalinas del Caribe acarician playas de arena blanca rodeadas
              por exuberante selva tropical. Este pequeño paraíso fronterizo con
              Panamá te invita a desconectarte del mundo y reconectarte con la
              naturaleza.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed text-center">
              Descubre una biodiversidad única, sumérgete en aguas turquesa,
              explora senderos naturales y vive la auténtica experiencia
              caribeña. ¡Tu aventura comienza aquí!
            </p>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => scrollToSection("actividades")}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
              >
                Explorar Actividades
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
