// src/data/hotelesData.js

// ==========================================================
// HOTELES DEMO - Datos estáticos con imágenes
// ----------------------------------------------------------
// Este archivo contiene una lista de hoteles (hotelesDemo) usada
// por los componentes de UI (HotelCard, HotelesSection, etc.).
// - Las imágenes se importan desde ../assets/hotels/...
// - Cada hotel es un objeto con metadatos (id, nombre, descripciones,
//   precioDesde, calificacion, imagenes, amenidades, servicios,
//   tiposHabitacion).
// - El array `imagenes` para cada hotel contiene objetos con:
//    { src: <import>, color: "<clases tailwind gradient>", desc: "texto" }
//   que se usan para el carrusel y placeholders cuando sea necesario.
// ==========================================================

// =============================
// IMPORTS DE IMÁGENES
// =============================

// Mariela
import Mariela1 from "../assets/hotels/mariela/Mariela1.jpg";
import Mariela2 from "../assets/hotels/mariela/Mariela2.jpg";
import Mariela3 from "../assets/hotels/mariela/Mariela3.jpg";
import Mariela4 from "../assets/hotels/mariela/Mariela4.jpg";
import Mariela5 from "../assets/hotels/mariela/Mariela5.jpg";

// Coral
import Coral1 from "../assets/hotels/coral/Coral1.jpg";
import Coral2 from "../assets/hotels/coral/Coral2.jpg";
import Coral3 from "../assets/hotels/coral/Coral3.jpg";
import Coral4 from "../assets/hotels/coral/Coral4.jpg";
import Coral5 from "../assets/hotels/coral/Coral5.jpg";

// HillTop (Top)
import Top1 from "../assets/hotels/hilltop/Top1.jpg";
import Top2 from "../assets/hotels/hilltop/Top2.jpg";
import Top3 from "../assets/hotels/hilltop/Top3.jpg";
import Top4 from "../assets/hotels/hilltop/Top4.jpg";
import Top5 from "../assets/hotels/hilltop/Top5.jpg";

// Chileno
import Chileno1 from "../assets/hotels/chileno/Chileno1.jpg";
import Chileno2 from "../assets/hotels/chileno/Chileno2.jpg";
import Chileno3 from "../assets/hotels/chileno/Chileno3.jpg";
import Chileno4 from "../assets/hotels/chileno/Chileno4.jpg";
import Chileno5 from "../assets/hotels/chileno/Chileno5.jpg";

// =======================================================
// LISTA DE HOTELES COMPLETA — CON IMÁGENES YA ASIGNADAS
// -------------------------------------------------------
// Cada entrada del array `hotelesDemo` representa un hotel/hostal
// con campos utilizados por los componentes del frontend.
// - id: identificador único (número).
// - nombre: nombre mostrado.
// - descripcion: texto corto para cards/listados.
// - descripcionCompleta: texto largo para la vista detallada/modal.
// - precioDesde: número (COP) utilizado como referencia en listados.
// - calificacion: número (float) entre 0 y 5.
// - imagenes: array de objetos { src, color, desc } usado por carruseles.
// - amenidades: array de strings (se mapean a íconos en UI).
// - servicios: array de strings (lista de servicios ofrecidos).
// - tiposHabitacion: array de objetos { tipo, precio, disponibles }.
// =======================================================
console.log("[hotelesData] imports comprobación:", {
  Mariela1,
  Coral1,
  Top1,
  Chileno1,
});
export const hotelesDemo = [
  // ==============================
  // HOTEL 1 — MARIELA
  // ==============================
  {
    id: 1,
    nombre: "Casa Hotel La Mariela",
    descripcion:
      "Casa Hotel frente al mar con vistas espectaculares y ambiente acogedor",
    descripcionCompleta:
      "La Casa Hotel La Mariela es un refugio exclusivo ubicado en primera línea de playa. Con una arquitectura que combina elementos tradicionales y modernos, ofrece una experiencia única de relajación. Nuestras habitaciones están diseñadas con materiales naturales y cuentan con amplias terrazas privadas. El restaurante sirve cocina del Pacífico con ingredientes frescos locales. Disfruta de atardeceres inolvidables desde nuestra terraza panorámica.",
    precioDesde: 180000,
    calificacion: 4.9,
    imagenes: [
      {
        src: Mariela1,
        color: "from-cyan-400 to-blue-500",
        desc: "Vista principal",
      },
      {
        src: Mariela2,
        color: "from-blue-400 to-cyan-500",
        desc: "Habitación suite",
      },
      {
        src: Mariela3,
        color: "from-sky-400 to-blue-600",
        desc: "Terraza con vista al mar",
      },
      {
        src: Mariela4,
        color: "from-cyan-500 to-teal-500",
        desc: "Restaurante",
      },
      {
        src: Mariela5,
        color: "from-blue-500 to-indigo-500",
        desc: "Piscina infinity",
      },
    ],
    amenidades: [
      "Wifi",
      "Desayuno",
      "Aire acondicionado",
      "Vista al mar",
      "Restaurante",
      "Bar",
    ],
    servicios: [
      "Servicio a la habitación 24/7",
      "Tours guiados",
      "Transporte al aeropuerto",
      "Spa",
      "Masajes",
    ],
    tiposHabitacion: [
      { tipo: "Sencilla", precio: 180000, disponibles: 3 },
      { tipo: "Doble con baño privado", precio: 250000, disponibles: 5 },
      { tipo: "Suite vista al mar", precio: 400000, disponibles: 2 },
    ],
  },

  // ==============================
  // HOTEL 2 — CORAL
  // ==============================
  {
    id: 2,
    nombre: "Casa Hostal Playa Coral",
    descripcion:
      "Hospedaje económico y cómodo, perfecto para viajeros que buscan autenticidad",
    descripcionCompleta:
      "La Casa Hostal Playa Coral es ideal para viajeros que buscan una experiencia auténtica y económica. Ubicado en el corazón de Sapzurro, a pocos pasos de la playa. Ambiente familiar y acogedor donde podrás conocer otros viajeros. Contamos con cocina compartida equipada, terraza con hamacas y una biblioteca de libros. El personal local te ayudará a descubrir los mejores secretos de la zona.",
    precioDesde: 80000,
    calificacion: 4.6,
    imagenes: [
      {
        src: Coral1,
        color: "from-emerald-400 to-cyan-500",
        desc: "Fachada del hostal",
      },
      {
        src: Coral2,
        color: "from-teal-400 to-emerald-500",
        desc: "Habitación compartida",
      },
      {
        src: Coral3,
        color: "from-cyan-400 to-emerald-400",
        desc: "Cocina común",
      },
      { src: Coral4, color: "from-green-400 to-teal-500", desc: "Área social" },
      {
        src: Coral5,
        color: "from-emerald-500 to-cyan-600",
        desc: "Terraza con hamacas",
      },
    ],
    amenidades: ["Wifi", "Cocina compartida", "Terraza", "Biblioteca"],
    servicios: [
      "Información turística",
      "Alquiler de snorkel",
      "Desayuno opcional",
      "Casilleros seguros",
    ],
    tiposHabitacion: [
      { tipo: "Sencilla sin baño", precio: 80000, disponibles: 4 },
      { tipo: "Sencilla con baño", precio: 120000, disponibles: 6 },
      { tipo: "Doble con baño", precio: 150000, disponibles: 3 },
    ],
  },

  // ==============================
  // HOTEL 3 — HILLTOP
  // ==============================
  {
    id: 3,
    nombre: "HillTop Sapzurro Hostel",
    descripcion:
      "Cabañas rústicas rodeadas de naturaleza con acceso directo a la playa",
    descripcionCompleta:
      "HillTop Sapzurro Hostel ofrece una experiencia única de inmersión en la naturaleza sin sacrificar comodidad. Cada cabaña está construida con materiales locales y cuenta con amplios espacios abiertos. Despierta con el sonido de las olas y pájaros tropicales. Nuestra piscina natural se integra perfectamente con el paisaje. El bar de playa sirve cócteles y mariscos frescos. Perfecto para parejas y familias que buscan tranquilidad.",
    precioDesde: 200000,
    calificacion: 4.3,
    imagenes: [
      {
        src: Top1,
        color: "from-amber-400 to-orange-500",
        desc: "Cabaña principal",
      },
      {
        src: Top2,
        color: "from-yellow-400 to-amber-500",
        desc: "Interior cabaña",
      },
      {
        src: Top3,
        color: "from-orange-400 to-red-400",
        desc: "Vista desde la cabaña",
      },
      {
        src: Top4,
        color: "from-amber-500 to-yellow-600",
        desc: "Piscina natural",
      },
      {
        src: Top5,
        color: "from-yellow-500 to-orange-500",
        desc: "Bar de playa",
      },
    ],
    amenidades: ["Wifi", "Desayuno", "Piscina", "Bar", "Acceso a playa"],
    servicios: [
      "Kayaks gratis",
      "Clases de yoga",
      "BBQ en la playa",
      "Tours de snorkel",
      "Cenas románticas",
    ],
    tiposHabitacion: [
      { tipo: "Cabaña estándar", precio: 200000, disponibles: 4 },
      { tipo: "Cabaña grande", precio: 300000, disponibles: 3 },
      { tipo: "Cabaña Premium vista al mar", precio: 450000, disponibles: 2 },
    ],
  },

  // ==============================
  // HOTEL 4 — EL CHILENO
  // ==============================
  {
    id: 4,
    nombre: "El Chilena Hotel",
    descripcion:
      "Alojamiento ecológico con compromiso ambiental y experiencia única",
    descripcionCompleta:
      "El Chilena Hotel es pionero en turismo sostenible en la región. Funcionamos 100% con energía solar y sistemas de recolección de agua lluvia. Nuestras instalaciones están diseñadas para minimizar el impacto ambiental. Ofrecemos experiencias educativas sobre conservación marina y selva tropical. El restaurante usa ingredientes orgánicos de nuestra huerta. Parte de nuestras ganancias se destinan a proyectos comunitarios locales.",
    precioDesde: 150000,
    calificacion: 3.8,
    imagenes: [
      {
        src: Chileno1,
        color: "from-green-400 to-emerald-500",
        desc: "Lodge principal",
      },
      {
        src: Chileno2,
        color: "from-lime-400 to-green-500",
        desc: "Bungalow ecológico",
      },
      {
        src: Chileno3,
        color: "from-emerald-400 to-teal-500",
        desc: "Huerta orgánica",
      },
      {
        src: Chileno4,
        color: "from-teal-400 to-cyan-500",
        desc: "Área de meditación",
      },
      {
        src: Chileno5,
        color: "from-green-500 to-emerald-600",
        desc: "Mirador natural",
      },
    ],
    amenidades: ["Wifi", "Restaurante", "Tours", "Kayaks", "Huerta orgánica"],
    servicios: [
      "Tours ecológicos",
      "Avistamiento de aves",
      "Clases de cocina",
      "Voluntariado ambiental",
    ],
    tiposHabitacion: [
      { tipo: "Habitación sencilla", precio: 150000, disponibles: 5 },
      { tipo: "Habitación doble", precio: 220000, disponibles: 4 },
      { tipo: "Bungalow familiar", precio: 380000, disponibles: 2 },
    ],
  },
];
