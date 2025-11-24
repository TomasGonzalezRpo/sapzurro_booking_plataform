// src/data/restaurantesData.js

// ==========================================================
// DATOS DE RESTAURANTES (ALIADOS Y NO ALIADOS)
// ----------------------------------------------------------
// Este archivo exporta:
// - `restaurantesAliados`: array con restaurantes aliados (con más datos).
// - `restaurantesNoAliados`: array con restaurantes no aliados.
// - `tiposCocina`: lista para llenar select/filtrado de tipos de cocina.
// - `ocasionesEspeciales`: lista de opciones para reservas en restaurantes.
//
// Notas importantes:
// - Las rutas de las imágenes deben existir en ../assets/restaurantesaliados/
//   y ../assets/restaurantesnoaliados/ respectivamente.
// - Cada restaurante tiene campos usados por los componentes UI:
//   id, nombre, descripcion, descripcionCompleta, esAliado, calificacion,
//   tipoCocina, rangoPrecios, horarios, telefono, imagenes (array de {url,desc}),
//   menuDestacado (array de platos), chefEspecialidad, linkMenu, y flags como
//   ofreceDesayuno cuando aplique.
// - Mantén la estructura de objetos para que los componentes (RestauranteCard,
//   RestaurantesSection, etc.) funcionen sin cambios.
// ==========================================================

// ==========================================================
// IMPORTS DE IMÁGENES - RESTAURANTES ALIADOS
// ----------------------------------------------------------
// Asegúrate de que los archivos Ref1.jpg .. Ref5.jpg, Don1..Don5.jpg, etc.,
// existan en la carpeta ../assets/restaurantesaliados/
// ==========================================================
import Ref1 from "../assets/restaurantesaliados/Ref1.jpg";
import Ref2 from "../assets/restaurantesaliados/Ref2.jpg";
import Ref3 from "../assets/restaurantesaliados/Ref3.jpg";
import Ref4 from "../assets/restaurantesaliados/Ref4.jpg";
import Ref5 from "../assets/restaurantesaliados/Ref5.jpg";

import Don1 from "../assets/restaurantesaliados/Don1.jpg";
import Don2 from "../assets/restaurantesaliados/Don2.jpg";
import Don3 from "../assets/restaurantesaliados/Don3.jpg";
import Don4 from "../assets/restaurantesaliados/Don4.jpg";
import Don5 from "../assets/restaurantesaliados/Don5.jpg";

import Sun1 from "../assets/restaurantesaliados/Sun1.jpg";
import Sun2 from "../assets/restaurantesaliados/Sun2.jpg";
import Sun3 from "../assets/restaurantesaliados/Sun3.jpg";
import Sun4 from "../assets/restaurantesaliados/Sun4.jpg";
import Sun5 from "../assets/restaurantesaliados/Sun5.jpg";

import Cab1 from "../assets/restaurantesaliados/Cab1.jpg";
import Cab2 from "../assets/restaurantesaliados/Cab2.jpg";
import Cab3 from "../assets/restaurantesaliados/Cab3.jpg";
import Cab4 from "../assets/restaurantesaliados/Cab4.jpg";
import Cab5 from "../assets/restaurantesaliados/Cab5.jpg";

import Asa1 from "../assets/restaurantesaliados/Asa1.jpg";
import Asa2 from "../assets/restaurantesaliados/Asa2.jpg";
import Asa3 from "../assets/restaurantesaliados/Asa3.jpg";
import Asa4 from "../assets/restaurantesaliados/Asa4.jpg";
import Asa5 from "../assets/restaurantesaliados/Asa5.jpg";

// ==========================================================
// IMPORTS DE IMÁGENES - RESTAURANTES NO ALIADOS
// ----------------------------------------------------------
// Verificar que los archivos Piz1..Piz5, Caf1..Caf5, Comi1..Comi5 existan en
// ../assets/restaurantesnoaliados/
// ==========================================================
import Piz1 from "../assets/restaurantesnoaliados/Piz1.jpg";
import Piz2 from "../assets/restaurantesnoaliados/Piz2.jpg";
import Piz3 from "../assets/restaurantesnoaliados/Piz3.jpg";
import Piz4 from "../assets/restaurantesnoaliados/Piz4.jpg";
import Piz5 from "../assets/restaurantesnoaliados/Piz5.jpg";

import Caf1 from "../assets/restaurantesnoaliados/Caf1.jpg";
import Caf2 from "../assets/restaurantesnoaliados/Caf2.jpg";
import Caf3 from "../assets/restaurantesnoaliados/Caf3.jpg";
import Caf4 from "../assets/restaurantesnoaliados/Caf4.jpg";
import Caf5 from "../assets/restaurantesnoaliados/Caf5.jpg";

import Com1 from "../assets/restaurantesnoaliados/Comi1.jpg";
import Com2 from "../assets/restaurantesnoaliados/Comi2.jpg";
import Com3 from "../assets/restaurantesnoaliados/Comi3.jpg";
import Com4 from "../assets/restaurantesnoaliados/Comi4.jpg";
import Com5 from "../assets/restaurantesnoaliados/Comi5.jpg";

// ==========================================================
// RESTAURANTES ALIADOS
// ----------------------------------------------------------
// Cada objeto incluye suficientes campos para:
// - Listados (card): nombre, descripcion, calificacion, tipoCocina, imagenes.
// - Página/Modal detalle: descripcionCompleta, menuDestacado, chefEspecialidad,
//   linkMenu, horarios, telefono, etc.
// ==========================================================
export const restaurantesAliados = [
  {
    id: 1,
    nombre: "El Refugio del Pescador",
    descripcion:
      "Mariscos frescos del día en un ambiente caribeño auténtico con vista al mar",
    descripcionCompleta:
      "El Refugio del Pescador es el restaurante insignia de Sapzurro, especializado en pescados y mariscos capturados diariamente por pescadores locales. Nuestro chef combina técnicas tradicionales con toques contemporáneos. El ambiente rústico-elegante con terraza frente al mar crea la experiencia perfecta para disfrutar la gastronomía del Pacífico.",
    esAliado: true,
    calificacion: 4.9,
    tipoCocina: "Mariscos",
    rangoPrecios: "$$$ (80.000 - 150.000)",
    horarios: "12:00 PM - 10:00 PM",
    telefono: "+57 300 123 4567",
    imagenes: [
      { url: Ref1, desc: "Langosta a la parrilla" },
      { url: Ref2, desc: "Ceviche de camarón" },
      { url: Ref3, desc: "Pargo rojo entero" },
      { url: Ref4, desc: "Terraza con vista al mar" },
      { url: Ref5, desc: "Atardecer desde el restaurante" },
    ],
    menuDestacado: [
      {
        plato: "Langosta caribeña a la parrilla",
        precio: 145000,
        categoria: "Especialidad",
      },
      {
        plato: "Ceviche mixto de mariscos",
        precio: 65000,
        categoria: "Entradas",
      },
      {
        plato: "Pargo rojo frito entero",
        precio: 95000,
        categoria: "Platos fuertes",
      },
      {
        plato: "Arroz con camarones",
        precio: 55000,
        categoria: "Platos fuertes",
      },
      {
        plato: "Cazuela de mariscos",
        precio: 120000,
        categoria: "Especialidad",
      },
      {
        plato: "Pulpo a la plancha",
        precio: 85000,
        categoria: "Platos fuertes",
      },
      { plato: "Ensalada tropical", precio: 35000, categoria: "Entradas" },
    ],
    chefEspecialidad:
      "Chef María Gonzalez - 15 años de experiencia en cocina del Pacífico",
    linkMenu: "https://drive.google.com/menucompletopescador",
  },
  {
    id: 2,
    nombre: "Donde Juancho",
    descripcion:
      "Comida típica chocoana con el sazón de la abuela en el corazón de Sapzurro",
    descripcionCompleta:
      "Restaurante familiar que lleva tres generaciones compartiendo las recetas tradicionales del Chocó. Donde Juancho es famoso por su sancocho de pescado y los platos típicos preparados con productos locales orgánicos. El ambiente acogedor te hará sentir como en casa.",
    esAliado: true,
    calificacion: 4.7,
    tipoCocina: "Típica Chocoana",
    rangoPrecios: "$$ (30.000 - 60.000)",
    horarios: "7:00 AM - 9:00 PM",
    telefono: "+57 300 234 5678",
    imagenes: [
      { url: Don1, desc: "Sancocho de pescado" },
      { url: Don2, desc: "Arroz con coco" },
      { url: Don3, desc: "Patacones con hogao" },
      { url: Don4, desc: "Interior acogedor" },
      { url: Don5, desc: "Jugo natural de borojó" },
    ],
    menuDestacado: [
      {
        plato: "Desayuno chocoano completo",
        precio: 25000,
        categoria: "Desayuno",
      },
      {
        plato: "Sancocho de pescado",
        precio: 35000,
        categoria: "Platos fuertes",
      },
      {
        plato: "Arroz con coco y pescado frito",
        precio: 40000,
        categoria: "Platos fuertes",
      },
      {
        plato: "Encocado de camarón",
        precio: 45000,
        categoria: "Platos fuertes",
      },
      {
        plato: "Patacones con hogao",
        precio: 15000,
        categoria: "Acompañamientos",
      },
      { plato: "Jugo de borojó", precio: 8000, categoria: "Bebidas" },
      { plato: "Pandebono casero", precio: 12000, categoria: "Desayuno" },
    ],
    chefEspecialidad:
      "Doña Rosa - Guardiana de las recetas familiares tradicionales",
    linkMenu: "https://drive.google.com/menucompletojuancho",
    ofreceDesayuno: true,
  },
  {
    id: 3,
    nombre: "Sunset Lounge & Grill",
    descripcion:
      "Cocina internacional fusión con los mejores atardeceres de Sapzurro",
    descripcionCompleta:
      "Restaurante boutique que combina cocina internacional con ingredientes locales del Pacífico. Sunset Lounge es el lugar perfecto para ocasiones especiales, con una carta de vinos selecta y cócteles de autor. La terraza panorámica ofrece vistas espectaculares del atardecer caribeño.",
    esAliado: true,
    calificacion: 4.8,
    tipoCocina: "Internacional Fusión",
    rangoPrecios: "$$$$ (100.000 - 200.000)",
    horarios: "6:00 PM - 11:00 PM",
    telefono: "+57 300 345 6789",
    imagenes: [
      { url: Sun1, desc: "Filete mignon con reducción" },
      { url: Sun2, desc: "Sushi de atún fresco" },
      { url: Sun3, desc: "Cóctel signature" },
      { url: Sun4, desc: "Terraza al atardecer" },
      { url: Sun5, desc: "Ambiente romántico" },
    ],
    menuDestacado: [
      {
        plato: "Filete mignon con reducción de vino tinto",
        precio: 135000,
        categoria: "Carnes",
      },
      { plato: "Sushi roll tropical", precio: 75000, categoria: "Entradas" },
      {
        plato: "Risotto de mariscos",
        precio: 95000,
        categoria: "Platos fuertes",
      },
      {
        plato: "Atún sellado con costra de ajonjolí",
        precio: 110000,
        categoria: "Platos fuertes",
      },
      {
        plato: "Pasta al pesto con camarones",
        precio: 85000,
        categoria: "Pastas",
      },
      {
        plato: "Tabla de quesos importados",
        precio: 65000,
        categoria: "Entradas",
      },
      { plato: "Tiramisú artesanal", precio: 35000, categoria: "Postres" },
    ],
    chefEspecialidad:
      "Chef Alessandro Martínez - Formación en Le Cordon Bleu París",
    linkMenu: "https://drive.google.com/menucompletosunset",
  },
  {
    id: 4,
    nombre: "La Cabaña Vegetariana",
    descripcion:
      "Cocina vegetariana y vegana con ingredientes orgánicos de la región",
    descripcionCompleta:
      "Primer restaurante 100% vegetariano de Sapzurro, comprometido con la sostenibilidad y el bienestar. Utilizamos productos de nuestra propia huerta orgánica y de agricultores locales. Ofrecemos opciones veganas, sin gluten y crudiveganas en un espacio zen rodeado de naturaleza.",
    esAliado: true,
    calificacion: 4.6,
    tipoCocina: "Vegetariana/Vegana",
    rangoPrecios: "$$ (35.000 - 70.000)",
    horarios: "7:00 AM - 8:00 PM",
    telefono: "+57 300 456 7890",
    imagenes: [
      { url: Cab1, desc: "Bowl de quinoa tropical" },
      { url: Cab2, desc: "Smoothie bowl colorido" },
      { url: Cab3, desc: "Hamburguesa vegana de lentejas" },
      { url: Cab4, desc: "Huerta orgánica" },
      { url: Cab5, desc: "Espacio zen al aire libre" },
    ],
    menuDestacado: [
      {
        plato: "Desayuno energético con açaí",
        precio: 28000,
        categoria: "Desayuno",
      },
      {
        plato: "Bowl de quinoa con vegetales asados",
        precio: 42000,
        categoria: "Platos fuertes",
      },
      {
        plato: "Hamburguesa vegana de lentejas",
        precio: 38000,
        categoria: "Platos fuertes",
      },
      {
        plato: "Curry de garbanzos y coco",
        precio: 45000,
        categoria: "Platos fuertes",
      },
      {
        plato: "Ensalada mediterránea completa",
        precio: 35000,
        categoria: "Ensaladas",
      },
      { plato: "Smoothie verde detox", precio: 18000, categoria: "Bebidas" },
      {
        plato: "Tacos veganos de jackfruit",
        precio: 40000,
        categoria: "Platos fuertes",
      },
    ],
    chefEspecialidad:
      "Chef Sofía Ramírez - Especialista en nutrición holística",
    linkMenu: "https://drive.google.com/menucompletovegetariana",
    ofreceDesayuno: true,
  },
  {
    id: 5,
    nombre: "Asadero & Parrilla El Rancho",
    descripcion:
      "Las mejores carnes a la parrilla en un ambiente campestre y familiar",
    descripcionCompleta:
      "Restaurante especializado en carnes premium a la parrilla al estilo colombiano. El Rancho ofrece cortes selectos, chorizos artesanales y arepas hechas a mano. El ambiente campestre con música en vivo los fines de semana lo hace ideal para compartir en familia o con amigos.",
    esAliado: true,
    calificacion: 4.7,
    tipoCocina: "Parrilla/Carnes",
    rangoPrecios: "$$$ (60.000 - 120.000)",
    horarios: "12:00 PM - 10:00 PM",
    telefono: "+57 300 567 8901",
    imagenes: [
      { url: Asa1, desc: "Churrasco argentino" },
      { url: Asa2, desc: "Costillas BBQ" },
      { url: Asa3, desc: "Parrillada mixta" },
      { url: Asa4, desc: "Ambiente campestre" },
      { url: Asa5, desc: "Parrilla en vivo" },
    ],
    menuDestacado: [
      {
        plato: "Churrasco argentino premium",
        precio: 85000,
        categoria: "Carnes",
      },
      {
        plato: "Costillas BBQ en salsa especial",
        precio: 75000,
        categoria: "Carnes",
      },
      {
        plato: "Parrillada mixta para 2",
        precio: 140000,
        categoria: "Especialidad",
      },
      { plato: "Lomo de cerdo a la BBQ", precio: 65000, categoria: "Carnes" },
      {
        plato: "Chorizo artesanal con arepa",
        precio: 35000,
        categoria: "Entradas",
      },
      {
        plato: "Mazorca asada con queso",
        precio: 18000,
        categoria: "Acompañamientos",
      },
      {
        plato: "Ensalada César con pollo",
        precio: 40000,
        categoria: "Ensaladas",
      },
    ],
    chefEspecialidad:
      "Maestro parrillero Jorge Suárez - 20 años dominando el fuego",
    linkMenu: "https://drive.google.com/menucompletoelrancho",
  },
];

// ==========================================================
// RESTAURANTES NO ALIADOS
// ----------------------------------------------------------
// Menos metadatos que los aliados pero suficientes para listados y
// reservas básicas. Se han añadido ejemplos con imágenes locales.
// ==========================================================
export const restaurantesNoAliados = [
  {
    id: 6,
    nombre: "Pizzería Bella Italia",
    descripcion:
      "Pizzas artesanales al horno de leña con recetas tradicionales italianas",
    descripcionCompleta:
      "Pizzería familiar que trae el sabor auténtico de Italia a Sapzurro. Masa fermentada 48 horas y horno de leña importado garantizan la mejor pizza de la región.",
    esAliado: false,
    calificacion: 4.5,
    tipoCocina: "Italiana",
    rangoPrecios: "$$ (40.000 - 80.000)",
    horarios: "5:00 PM - 10:00 PM",
    telefono: "+57 300 678 9012",
    imagenes: [
      { url: Piz1, desc: "Pizza margarita" },
      { url: Piz2, desc: "Pizza cuatro quesos" },
      { url: Piz3, desc: "Horno de leña" },
      { url: Piz4, desc: "Ambiente italiano" },
      { url: Piz5, desc: "Pasta fresca casera" },
    ],
    menuDestacado: [
      { plato: "Pizza Margarita clásica", precio: 45000, categoria: "Pizzas" },
      { plato: "Pizza Cuatro Quesos", precio: 52000, categoria: "Pizzas" },
      { plato: "Lasagna Bolognesa", precio: 48000, categoria: "Pastas" },
    ],
    chefEspecialidad: "Pizzero Luigi Rossini - Napolitano de 3ra generación",
    linkMenu: "https://drive.google.com/menucompletobellaitalia",
  },
  {
    id: 7,
    nombre: "Café del Puerto",
    descripcion:
      "Cafetería y panadería artesanal con el mejor café de la región",
    descripcionCompleta:
      "Punto de encuentro favorito de locales y turistas, especializado en café orgánico de fincas cercanas y repostería artesanal. Perfecto para desayunos y meriendas.",
    esAliado: false,
    calificacion: 4.4,
    tipoCocina: "Cafetería",
    rangoPrecios: "$ (15.000 - 35.000)",
    horarios: "6:00 AM - 6:00 PM",
    telefono: "+57 300 789 0123",
    imagenes: [
      { url: Caf1, desc: "Café latte art" },
      { url: Caf2, desc: "Croissants frescos" },
      { url: Caf3, desc: "Desayuno continental" },
      { url: Caf4, desc: "Terraza con vista" },
      { url: Caf5, desc: "Repostería artesanal" },
    ],
    menuDestacado: [
      { plato: "Desayuno continental", precio: 22000, categoria: "Desayuno" },
      { plato: "Capuchino doble", precio: 12000, categoria: "Bebidas" },
      { plato: "Croissant de chocolate", precio: 8000, categoria: "Panadería" },
    ],
    chefEspecialidad:
      "Barista certificado Juan Pérez - Campeón regional de latte art",
    linkMenu: "https://drive.google.com/menucompletocafepuerto",
    ofreceDesayuno: true,
  },
  {
    id: 8,
    nombre: "Comidas Rápidas El Kiosco",
    descripcion: "Hamburguesas, perros calientes y comida rápida las 24 horas",
    descripcionCompleta:
      "El único lugar abierto las 24 horas en Sapzurro. Ideal para antojos nocturnos o comidas rápidas después de un día de playa. Ambiente informal y precios económicos.",
    esAliado: false,
    calificacion: 4.2,
    tipoCocina: "Comida Rápida",
    rangoPrecios: "$ (10.000 - 30.000)",
    horarios: "24 horas",
    telefono: "+57 300 890 1234",
    imagenes: [
      { url: Com1, desc: "Hamburguesa especial" },
      { url: Com2, desc: "Perro caliente completo" },
      { url: Com3, desc: "Papas fritas crujientes" },
      { url: Com4, desc: "Kiosco nocturno" },
      { url: Com5, desc: "Malteadas artesanales" },
    ],
    menuDestacado: [
      {
        plato: "Hamburguesa El Kiosco especial",
        precio: 25000,
        categoria: "Hamburguesas",
      },
      { plato: "Perro caliente completo", precio: 15000, categoria: "Perros" },
      {
        plato: "Papas fritas grandes",
        precio: 12000,
        categoria: "Acompañamientos",
      },
    ],
    chefEspecialidad: "Equipo de cocina rápida - Servicio 24/7",
    linkMenu: "https://drive.google.com/menucompletoelkiosco",
  },
];

// ==========================================================
// LISTAS UTILES PARA LA UI
// - tiposCocina: opciones para filtros / selects
// - ocasionesEspeciales: opciones para reservas
// ==========================================================
export const tiposCocina = [
  "Todos",
  "Mariscos",
  "Típica Chocoana",
  "Internacional Fusión",
  "Vegetariana/Vegana",
  "Parrilla/Carnes",
  "Italiana",
  "Cafetería",
  "Comida Rápida",
];

export const ocasionesEspeciales = [
  "Cumpleaños",
  "Aniversario",
  "Cena de negocios",
  "Celebración familiar",
  "Cita romántica",
  "Graduación",
  "Otro",
];
