// src/data/Activities.js

// ==========================================================
// ACTIVIDADES - Datos estáticos
// ----------------------------------------------------------
// Este archivo contiene el listado de actividades ofrecidas
// en la plataforma (objetos con metadatos y arrays de imágenes).
// - Las imágenes se importan desde ../assets/actividades/
// - Mantén consistencia en nombres y en la estructura de cada
//   actividad para que los componentes que consumen `activities`
//   (ActivitiesCard, RutaCard, etc.) funcionen sin cambios.
// ==========================================================

// ----------------------------------------------------------
// 1) Snorkel y Buceo (Sno1.jpg a Sno5.jpg)
// ----------------------------------------------------------
import Sno1 from "../assets/actividades/Sno1.jpg";
import Sno2 from "../assets/actividades/Sno2.jpg";
import Sno3 from "../assets/actividades/Sno3.jpg";
import Sno4 from "../assets/actividades/Sno4.jpg";
import Sno5 from "../assets/actividades/Sno5.jpg";

// ----------------------------------------------------------
// 2) Senderismo (Cam1.jpg a Cam5.jpg)
// ----------------------------------------------------------
import Cam1 from "../assets/actividades/Cam1.jpg";
import Cam2 from "../assets/actividades/Cam2.jpg";
import Cam3 from "../assets/actividades/Cam3.jpg";
import Cam4 from "../assets/actividades/Cam4.jpg";
import Cam5 from "../assets/actividades/Cam5.jpg";

// ----------------------------------------------------------
// 3) Kayak y Paddleboard (Kay1.jpg a Kay5.jpg)
// ----------------------------------------------------------
import Kay1 from "../assets/actividades/Kay1.jpg";
import Kay2 from "../assets/actividades/Kay2.jpg";
import Kay3 from "../assets/actividades/Kay3.jpg";
import Kay4 from "../assets/actividades/Kay4.jpg";
import Kay5 from "../assets/actividades/Kay5.jpg";

// ----------------------------------------------------------
// 4) Avistamiento de Flora y Fauna / Biología (Bio1.jpg a Bio5.jpg)
// ----------------------------------------------------------
import Bio1 from "../assets/actividades/Bio1.jpg";
import Bio2 from "../assets/actividades/Bio2.jpg";
import Bio3 from "../assets/actividades/Bio3.jpg";
import Bio4 from "../assets/actividades/Bio4.jpg";
import Bio5 from "../assets/actividades/Bio5.jpg";

// ==========================================================
// ARREGLO DE ACTIVIDADES
// ----------------------------------------------------------
// Cada objeto de actividad contiene campos usados por los
// componentes de UI: título, descripciones (corta/larga),
// icon (clave para mapear a un componente), color (clase
// tailwind para placeholders), categoría, duración, ubicación,
// dificultad, límites, incluye, requisitos, precio, calificación
// y array de imágenes.
// ==========================================================
export const activities = [
  {
    name: "Snorkel y Buceo",
    description:
      "Explora los arrecifes de coral virgen en Sapzurro. Perfecto para principiantes y experimentados.",
    fullDescription:
      "Sumérgete en las aguas cristalinas de Sapzurro y descubre un mundo submarino lleno de vida. Nuestros tours incluyen equipo completo de snorkel/buceo y guías expertos. Explora el famoso arrecife 'El Faro' y el barco hundido cercano. ¡Una experiencia inolvidable para todos los niveles!",
    // `icon` se mapea (en tiempo de ejecución) a un componente Lucide mediante getIconComponent
    icon: "IconoBuceo",
    // `color` es una clase utilitaria para placeholders / degradados cuando no hay imagen
    color: "bg-blue-500",
    category: "acuaticas",
    duration: "3-4 horas",
    location: "Playa Soledad",
    difficulty: "Baja",
    maxParticipants: 10,
    includes: [
      "Equipo de Snorkel",
      "Chaleco salvavidas",
      "Guía profesional",
      "Agua y snack",
    ],
    idealFor: ["Familias", "Parejas", "Amantes del mar"],
    requirements: [
      "Saber nadar (opcional para snorkel)",
      "Protector solar biodegradable",
    ],
    price: 70000,
    // campos adicionales usados por la UI:
    calificacion: 4.9,
    imagenes: [Sno1, Sno2, Sno3, Sno4, Sno5],
  },

  {
    name: "Senderismo Fronterizo",
    description:
      "Camina a La Miel (Panamá) o a Capurganá a través de senderos ecológicos y selva tropical.",
    fullDescription:
      "Embárcate en una caminata por los exuberantes senderos que conectan Sapzurro con La Miel (Panamá) o Capurganá. Esta actividad te permite experimentar la rica selva del Darién y cruzar la frontera natural entre Colombia y Panamá. Asegúrate de llevar tu pasaporte/cédula.",
    icon: "IconoSenderismo",
    color: "bg-green-600",
    category: "senderismo",
    duration: "2 horas",
    location: "Frontera",
    difficulty: "Media",
    maxParticipants: 15,
    includes: ["Guía local", "Permiso de paso", "Botella de agua"],
    idealFor: ["Aventureros", "Fotógrafos", "Exploradores"],
    requirements: ["Zapatos cómodos para caminar", "Cédula o Pasaporte"],
    price: 30000,
    calificacion: 4.5,
    imagenes: [Cam1, Cam2, Cam3, Cam4, Cam5],
  },

  {
    name: "Kayak y Paddleboard",
    description:
      "Alquila un kayak o paddleboard y explora tranquilamente las bahías y playas cercanas.",
    fullDescription:
      "Alquiler de equipos para explorar la bahía a tu propio ritmo. Ideal para una tarde tranquila, buscando vistas únicas de Sapzurro desde el agua. Puedes visitar pequeñas calas secretas o simplemente relajarte sobre el mar Caribe.",
    icon: "IconoKayak",
    color: "bg-cyan-500",
    category: "acuaticas",
    duration: "1-5 horas",
    location: "Bahía de Sapzurro",
    difficulty: "Baja",
    maxParticipants: 8,
    includes: [
      "Alquiler de Kayak/Paddleboard",
      "Pala",
      "Chaleco salvavidas",
      "Instrucciones básicas",
    ],
    idealFor: ["Parejas", "Relajación", "Ejercicio suave"],
    requirements: ["Ninguno"],
    price: 50000,
    calificacion: 4.7,
    imagenes: [Kay1, Kay2, Kay3, Kay4, Kay5],
  },

  {
    name: "Avistamiento de Fauna",
    description:
      "Tours guiados para observar aves, monos aulladores y la rica biodiversidad del Darién.",
    fullDescription:
      "Un tour temprano en la mañana o al atardecer para observar la increíble vida salvaje de la selva del Darién. Busca monos aulladores, perezosos, tucanes y una gran variedad de aves endémicas. Con guías expertos que conocen los mejores lugares de avistamiento.",
    icon: "IconoFauna",
    color: "bg-yellow-600",
    category: "senderismo",
    duration: "2.5 horas",
    location: "Sendero Interior",
    difficulty: "Media",
    maxParticipants: 12,
    includes: ["Guía naturalista", "Binoculares (compartidos)"],
    idealFor: ["Amantes de la naturaleza", "Biología", "Pájaros"],
    requirements: [
      "Ropa oscura (para no asustar la fauna)",
      "Repelente de insectos",
    ],
    price: 45000,
    calificacion: 4.6,
    imagenes: [Bio1, Bio2, Bio3, Bio4, Bio5],
  },
];
