export const hotelesDemo = [
  {
    id: 1,
    nombre: "Casa Hotel La Mariela",
    descripcion:
      "Casa Hotel frente al mar con vistas espectaculares y ambiente acogedor",
    descripcionCompleta:
      "La Casa Hotel La Mariela es un refugio exclusivo ubicado en primera línea de playa. Con una arquitectura que combina elementos tradicionales y modernos, ofrece una experiencia única de relajación. Nuestras habitaciones están diseñadas con materiales naturales y cuentan con amplias terrazas privadas. El restaurante sirve cocina del Pacífico con ingredientes frescos locales. Disfruta de atardeceres inolvidables desde nuestra terraza panorámica.",
    precioDesde: 180000,
    calificacion: 4.8,
    imagenes: [
      { color: "from-cyan-400 to-blue-500", desc: "Vista principal" },
      { color: "from-blue-400 to-cyan-500", desc: "Habitación suite" },
      { color: "from-sky-400 to-blue-600", desc: "Terraza con vista al mar" },
      { color: "from-cyan-500 to-teal-500", desc: "Restaurante" },
      { color: "from-blue-500 to-indigo-500", desc: "Piscina infinity" },
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
  {
    id: 2,
    nombre: "Casa Hostal Playa Coral",
    descripcion:
      "Hospedaje económico y cómodo, perfecto para viajeros que buscan autenticidad",
    descripcionCompleta:
      "La Casa Hostal Playa Coral es ideal para viajeros que buscan una experiencia auténtica y económica. Ubicado en el corazón de Sapzurro, a pocos pasos de la playa. Ambiente familiar y acogedor donde podrás conocer otros viajeros. Contamos con cocina compartida equipada, terraza con hamacas y una biblioteca de libros. El personal local te ayudará a descubrir los mejores secretos de la zona.",
    precioDesde: 80000,
    calificacion: 4.5,
    imagenes: [
      { color: "from-emerald-400 to-cyan-500", desc: "Fachada del hostal" },
      { color: "from-teal-400 to-emerald-500", desc: "Habitación compartida" },
      { color: "from-cyan-400 to-emerald-400", desc: "Cocina común" },
      { color: "from-green-400 to-teal-500", desc: "Área social" },
      { color: "from-emerald-500 to-cyan-600", desc: "Terraza con hamacas" },
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
  {
    id: 3,
    nombre: "HillTop Sapzurro Hostel",
    descripcion:
      "Cabañas rústicas rodeadas de naturaleza con acceso directo a la playa",
    descripcionCompleta:
      "HillTop Sapzurro Hostel ofrece una experiencia única de inmersión en la naturaleza sin sacrificar comodidad. Cada cabaña está construida con materiales locales y cuenta con amplios espacios abiertos. Despierta con el sonido de las olas y pájaros tropicales. Nuestra piscina natural se integra perfectamente con el paisaje. El bar de playa sirve cócteles y mariscos frescos. Perfecto para parejas y familias que buscan tranquilidad.",
    precioDesde: 200000,
    calificacion: 4.9,
    imagenes: [
      { color: "from-amber-400 to-orange-500", desc: "Cabaña principal" },
      { color: "from-yellow-400 to-amber-500", desc: "Interior cabaña" },
      { color: "from-orange-400 to-red-400", desc: "Vista desde la cabaña" },
      { color: "from-amber-500 to-yellow-600", desc: "Piscina natural" },
      { color: "from-yellow-500 to-orange-500", desc: "Bar de playa" },
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
  {
    id: 4,
    nombre: "El Chilena Hotel",
    descripcion:
      "Alojamiento ecológico con compromiso ambiental y experiencia única",
    descripcionCompleta:
      "El Chilena Hotel es pionero en turismo sostenible en la región. Funcionamos 100% con energía solar y sistemas de recolección de agua lluvia. Nuestras instalaciones están diseñadas para minimizar el impacto ambiental. Ofrecemos experiencias educativas sobre conservación marina y selva tropical. El restaurante usa ingredientes orgánicos de nuestra huerta. Parte de nuestras ganancias se destinan a proyectos comunitarios locales.",
    precioDesde: 150000,
    calificacion: 4.7,
    imagenes: [
      { color: "from-green-400 to-emerald-500", desc: "Lodge principal" },
      { color: "from-lime-400 to-green-500", desc: "Bungalow ecológico" },
      { color: "from-emerald-400 to-teal-500", desc: "Huerta orgánica" },
      { color: "from-teal-400 to-cyan-500", desc: "Área de meditación" },
      { color: "from-green-500 to-emerald-600", desc: "Mirador natural" },
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
