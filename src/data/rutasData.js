// ==========================================================
// RUTA 1: Sapzurro → La Miel → Playa Soledad
// Clave: MIEL (Miel1.jpg a Miel5.jpg)
// ==========================================================
import Miel1 from "../assets/rutas/Miel1.jpg"; // Asegúrate de que las rutas a tu assets sean correctas
import Miel2 from "../assets/rutas/Miel2.jpg";
import Miel3 from "../assets/rutas/Miel3.jpg";
import Miel4 from "../assets/rutas/Miel4.jpg";
import Miel5 from "../assets/rutas/Miel5.jpg";

// ==========================================================
// RUTA 2: Sapzurro → El Cielo → Capurganá
// Clave: CIELO (Cielo1.jpg a Cielo5.jpg)
// ==========================================================
import Cielo1 from "../assets/rutas/Cielo1.jpg";
import Cielo2 from "../assets/rutas/Cielo2.jpg";
import Cielo3 from "../assets/rutas/Cielo3.jpg";
import Cielo4 from "../assets/rutas/Cielo4.jpg";
import Cielo5 from "../assets/rutas/Cielo5.jpg";

// ==========================================================
// RUTA 3: Sapzurro → Capurganá → Playa Aguacate
// Clave: AGUA (Agua1.jpg a Agua5.jpg)
// ==========================================================
import Agua1 from "../assets/rutas/Agua1.jpg";
import Agua2 from "../assets/rutas/Agua2.jpg";
import Agua3 from "../assets/rutas/Agua3.jpg";
import Agua4 from "../assets/rutas/Agua4.jpg";
import Agua5 from "../assets/rutas/Agua5.jpg";

// ==========================================================
// RUTA 4: Sapzurro → Snorkel → Cabo Tiburón
// Clave: CABO (Cabo1.jpg a Cabo5.jpg)
// ==========================================================
import Cabo1 from "../assets/rutas/Cabo1.jpg";
import Cabo2 from "../assets/rutas/Cabo2.jpg";
import Cabo3 from "../assets/rutas/Cabo3.jpg";
import Cabo4 from "../assets/rutas/Cabo4.jpg";
import Cabo5 from "../assets/rutas/Cabo5.jpg";

// ==========================================================
// ARREGLO DE RUTAS TURÍSTICAS
// ==========================================================
export const rutasTuristicas = [
  // ==========================================================
  // RUTA 1: Sapzurro → La Miel → Playa Soledad
  // ==========================================================
  {
    id: 1,
    nombre: "Sapzurro → La Miel → Playa Soledad",
    subtitulo: "Frontera, playa y snorkel en un día",
    duracion: "1 día",
    precio: 150000,
    etiqueta: "playas",
    descripcion:
      "Inicia en Sapzurro subiendo la escalinata fronteriza hacia La Miel (Panamá), donde podrás disfrutar playa tranquila y tiendas libres de impuestos. Luego, regreso por lancha hacia Playa Soledad, una playa paradisíaca perfecta para nadar, descansar y hacer snorkel.",
    idealPara: ["Familias", "Parejas", "Fotografía", "Día completo de playa"],
    imagenPlaceholder: {
      color: "from-blue-400 to-cyan-500",
      desc: "Playa Soledad y frontera",
    },
  },
  // ==========================================================
  // RUTA 2: Sapzurro → El Cielo → Capurganá
  // ==========================================================
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
    imagenPlaceholder: {
      color: "from-green-600 to-lime-700",
      desc: "Sendero ecológico y cascadas",
    },
  },
  // ==========================================================
  // RUTA 3: Sapzurro → Capurganá → Playa Aguacate
  // ==========================================================
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
    imagenPlaceholder: {
      color: "from-sky-500 to-indigo-600",
      desc: "Playa Aguacate y Capurganá",
    },
  },
  // ==========================================================
  // RUTA 4: Sapzurro → Snorkel → Cabo Tiburón (CONFIRMADA)
  // ==========================================================
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
    imagenPlaceholder: {
      color: "from-green-500 to-lime-600",
      desc: "Vista de la frontera y snorkel",
    },
  },
];
