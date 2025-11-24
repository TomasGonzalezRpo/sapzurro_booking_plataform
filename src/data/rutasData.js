// src/data/rutasData.js

// Este archivo contiene un array de objetos (rutasTuristicas) con todos los datos estáticos de las rutas.
// Las imágenes se importan al inicio y se usan más abajo en cada objeto de ruta.

// ==========================================================
// RUTA 1: Sapzurro → La Miel → Playa Soledad
// Importamos las 5 imágenes para la RUTA MIEL
// ==========================================================
import Miel1 from "../assets/rutas/Miel1.jpg";
import Miel2 from "../assets/rutas/Miel2.jpg";
import Miel3 from "../assets/rutas/Miel3.jpg";
import Miel4 from "../assets/rutas/Miel4.jpg";
import Miel5 from "../assets/rutas/Miel5.jpg";

// ==========================================================
// RUTA 2: Sapzurro → El Cielo → Capurganá
// Importamos las 5 imágenes para la RUTA CIELO
// ==========================================================
import Cielo1 from "../assets/rutas/Cielo1.jpg";
import Cielo2 from "../assets/rutas/Cielo2.jpg";
import Cielo3 from "../assets/rutas/Cielo3.jpg";
import Cielo4 from "./assets/rutas/Cielo4.jpg"; // Error: ruta relativa
import Cielo5 from "./assets/rutas/Cielo5.jpg"; // Error: ruta relativa

// ==========================================================
// RUTA 3: Sapzurro → Capurganá → Playa Aguacate
// Importamos las 5 imágenes para la RUTA AGUA
// ==========================================================
import Agua1 from "../assets/rutas/Agua1.jpg";
import Agua2 from "../assets/rutas/Agua2.jpg";
import Agua3 from "../assets/rutas/Agua3.jpg";
import Agua4 from "../assets/rutas/Agua4.jpg";
import Agua5 from "../assets/rutas/Agua5.jpg";

// ==========================================================
// RUTA 4: Sapzurro → Snorkel → Cabo Tiburón
// Importamos las 5 imágenes para la RUTA CABO
// ==========================================================
import Cabo1 from "../assets/rutas/Cabo1.jpg";
import Cabo2 from "../assets/rutas/Cabo2.jpg";
import Cabo3 from "../assets/rutas/Cabo3.jpg";
import Cabo4 from "../assets/rutas/Cabo4.jpg";
import Cabo5 from "../assets/rutas/Cabo5.jpg";

// ==========================================================
// ARREGLO PRINCIPAL: Exportamos este array para que la app lo use
// ==========================================================
export const rutasTuristicas = [
  // ==========================================================
  // RUTA 1: La que va a Panamá (La Miel)
  // ==========================================================
  {
    id: 1, // Identificador único
    nombre: "Sapzurro → La Miel → Playa Soledad",
    subtitulo: "Frontera, playa y snorkel en un día",
    duracion: "1 día",
    precio: 150000, // Precio en pesos colombianos (COP)
    etiqueta: "playas", // Categoría de la ruta
    descripcion:
      "Inicia en Sapzurro subiendo la escalinata fronteriza hacia La Miel (Panamá), donde podrás disfrutar playa tranquila y tiendas libres de impuestos. Luego, regreso por lancha hacia Playa Soledad, una playa paradisíaca perfecta para nadar, descansar y hacer snorkel.",
    idealPara: ["Familias", "Parejas", "Fotografía", "Día completo de playa"],
    calificacion: 4.9,
    imagenes: [Miel1, Miel2, Miel3, Miel4, Miel5], // Usamos el array de imágenes importadas
    imagenPlaceholder: {
      color: "from-blue-400 to-cyan-500", // Colores para el fondo de placeholder (Tailwind CSS)
      desc: "Playa Soledad y frontera",
    },
  }, // ========================================================== // RUTA 2: El Cielo (Cascadas y selva) // ==========================================================
  {
    id: 2,
    nombre: "Sapzurro → El Cielo → Capurganá",
    subtitulo: "Senderismo, cascadas y selva tropical",
    duracion: "Medio día",
    precio: 85000,
    etiqueta: "selva",
    descripcion:
      "Sal de Sapzurro hacia el sendero ecológico que lleva a El Cielo, donde disfrutarás pozas y cascadas naturales. Después del baño en agua dulce, continúa la caminata hacia Capurganá, una ruta rodeada de selva tropical.",
    idealPara: ["Amantes del senderismo", "Turismo ecológico", "Aventureros"],
    calificacion: 4.4,
    imagenes: [Cielo1, Cielo2, Cielo3, Cielo4, Cielo5],
    imagenPlaceholder: {
      color: "from-green-600 to-lime-700",
      desc: "Sendero ecológico y cascadas",
    },
  }, // ========================================================== // RUTA 3: Playa Aguacate (Relax y gastronomía) // ==========================================================
  {
    id: 3,
    nombre: "Sapzurro → Capurganá → Playa Aguacate",
    subtitulo: "Mar, malecón y relax total",
    duracion: "1 día",
    precio: 90000,
    etiqueta: "playas",
    descripcion:
      "Caminata suave desde Sapzurro hasta Capurganá, con tiempo libre para recorrer el malecón. Luego salida en lancha hacia Playa Aguacate, una de las más hermosas del sector, famosa por sus aguas tranquilas y gastronomía local.",
    idealPara: [
      "Grupos",
      "Amantes del mar",
      "Personas que desean un día relajado",
    ],
    calificacion: 4.3,
    imagenes: [Agua1, Agua2, Agua3, Agua4, Agua5],
    imagenPlaceholder: {
      color: "from-sky-500 to-indigo-600",
      desc: "Playa Aguacate y Capurganá",
    },
  }, // ========================================================== // RUTA 4: Cabo Tiburón (Snorkel y Aventura) // ==========================================================
  {
    id: 4,
    nombre: "Ruta 4: Sapzurro → Snorkel → Cabo Tiburón", // Nombre actualizado
    subtitulo: "Aventura marina + senderismo fronterizo",
    duracion: "1 día",
    precio: 95000,
    etiqueta: "ecoturismo",
    descripcion:
      "Inicia con un tour en lancha por las zonas de snorkel alrededor de Sapzurro, donde podrás ver peces tropicales, corales y estrellas de mar. Después del almuerzo, continúa la caminata hacia Cabo Tiburón, un punto icónico en la frontera entre Colombia y Panamá.",
    idealPara: ["Ecoturismo", "Aventura", "Viajeros que quieren “todo en uno”"],
    calificacion: 4.7,
    imagenes: [Cabo1, Cabo2, Cabo3, Cabo4, Cabo5],
    imagenPlaceholder: {
      color: "from-green-500 to-lime-600",
      desc: "Vista de la frontera y snorkel",
    },
  },
];
