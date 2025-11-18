// src/data/rutasData.js

/**
 * Array de datos para las Rutas Turísticas.
 * NOTA: Los precios son ejemplos y deben ser ajustados
 * a las tarifas reales de los tours en Sapzurro.
 */
export const rutasTuristicas = [
  {
    id: 1,
    nombre: "Snorkel y Frontera: Cabo Tiburón",
    subtitulo: "Aventura marina + senderismo fronterizo",
    duracion: "1 día (6-8 horas)",
    precio: 150000, // Precio en COP
    etiqueta: "ecoturismo",
    descripcion:
      "Tour en lancha por zonas de snorkel alrededor de Sapzurro (peces, corales). Después del almuerzo, caminata hacia Cabo Tiburón, punto icónico entre Colombia y Panamá.",
    idealPara: ["Ecoturismo", "Aventura", "Viajeros que quieren 'todo en uno'"],
    imagenPlaceholder: {
      color: "from-green-500 to-lime-600",
      desc: "Vista de la frontera",
    },
  },
  {
    id: 2,
    nombre: "Las Tres Playas Escondidas",
    subtitulo: "Sapzurro, La Miel y Capurganá",
    duracion: "Medio día (4 horas)",
    precio: 85000,
    etiqueta: "playas",
    descripcion:
      "Recorrido rápido en lancha por las tres playas más hermosas de la región. Incluye tiempo libre en La Miel (Panamá) para compras y baño en Capurganá.",
    idealPara: ["Playa", "Familias", "Fotografía", "Recorrido rápido"],
    imagenPlaceholder: {
      color: "from-blue-400 to-cyan-500",
      desc: "Arena blanca y mar azul",
    },
  },
  {
    id: 3,
    nombre: "Cascadas y Ríos: Tesoros Naturales",
    subtitulo: "Senderismo en selva y piscinas naturales",
    duracion: "4 horas",
    precio: 60000,
    etiqueta: "selva",
    descripcion:
      "Caminata guiada en la densa selva hasta la majestuosa Cascada del Cielo. Podrás disfrutar de un refrescante baño en sus piscinas naturales y observar flora local.",
    idealPara: ["Senderismo", "Naturaleza", "Baños en río", "Ejercicio"],
    imagenPlaceholder: {
      color: "from-sky-500 to-indigo-600",
      desc: "Agua dulce y vegetación",
    },
  },
  {
    id: 4,
    nombre: "Inmersión Cultural: Vida Costeña",
    subtitulo: "Comunidad indígena, historia y gastronomía local",
    duracion: "5 horas",
    precio: 95000,
    etiqueta: "cultural",
    descripcion:
      "Tour educativo que comienza con una interacción con una comunidad indígena local, aprendiendo sobre sus costumbres y artesanías. Finaliza con una degustación de platos típicos caribeños.",
    idealPara: ["Cultura", "Gastronomía", "Viajeros solos", "Educación"],
    imagenPlaceholder: {
      color: "from-purple-500 to-fuchsia-600",
      desc: "Pueblo y tradiciones",
    },
  },
];

// NOTA IMPORTANTE: Este archivo no necesita 'export default'.
