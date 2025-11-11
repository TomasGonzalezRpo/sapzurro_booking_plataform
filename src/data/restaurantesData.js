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
      { color: "from-blue-400 to-cyan-500", desc: "Langosta a la parrilla" },
      { color: "from-cyan-400 to-teal-500", desc: "Ceviche de camarón" },
      { color: "from-teal-400 to-emerald-500", desc: "Pargo rojo entero" },
      {
        color: "from-blue-500 to-indigo-500",
        desc: "Terraza con vista al mar",
      },
      {
        color: "from-cyan-500 to-blue-600",
        desc: "Atardecer desde el restaurante",
      },
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
      { color: "from-orange-400 to-red-500", desc: "Sancocho de pescado" },
      { color: "from-yellow-400 to-orange-500", desc: "Arroz con coco" },
      { color: "from-red-400 to-pink-500", desc: "Patacones con hogao" },
      { color: "from-amber-400 to-orange-600", desc: "Interior acogedor" },
      { color: "from-orange-500 to-red-600", desc: "Jugo natural de borojó" },
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
      {
        color: "from-purple-400 to-pink-500",
        desc: "Filete mignon con reducción",
      },
      { color: "from-pink-400 to-rose-500", desc: "Sushi de atún fresco" },
      { color: "from-violet-400 to-purple-500", desc: "Cóctel signature" },
      { color: "from-fuchsia-400 to-pink-600", desc: "Terraza al atardecer" },
      { color: "from-purple-500 to-indigo-600", desc: "Ambiente romántico" },
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
      {
        color: "from-green-400 to-emerald-500",
        desc: "Bowl de quinoa tropical",
      },
      { color: "from-lime-400 to-green-500", desc: "Smoothie bowl colorido" },
      {
        color: "from-emerald-400 to-teal-500",
        desc: "Hamburguesa vegana de lentejas",
      },
      { color: "from-teal-400 to-cyan-500", desc: "Huerta orgánica" },
      {
        color: "from-green-500 to-emerald-600",
        desc: "Espacio zen al aire libre",
      },
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
      { color: "from-red-400 to-orange-500", desc: "Churrasco argentino" },
      { color: "from-orange-400 to-amber-500", desc: "Costillas BBQ" },
      { color: "from-amber-400 to-yellow-500", desc: "Parrillada mixta" },
      { color: "from-red-500 to-pink-600", desc: "Ambiente campestre" },
      { color: "from-orange-500 to-red-600", desc: "Parrilla en vivo" },
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
      { color: "from-red-400 to-yellow-500", desc: "Pizza margarita" },
      { color: "from-yellow-400 to-orange-500", desc: "Pizza cuatro quesos" },
      { color: "from-orange-400 to-red-500", desc: "Horno de leña" },
      { color: "from-amber-400 to-red-600", desc: "Ambiente italiano" },
      { color: "from-red-500 to-pink-600", desc: "Pasta fresca casera" },
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
      { color: "from-amber-400 to-orange-500", desc: "Café latte art" },
      { color: "from-yellow-400 to-amber-500", desc: "Croissants frescos" },
      { color: "from-orange-400 to-yellow-500", desc: "Desayuno continental" },
      { color: "from-amber-500 to-orange-600", desc: "Terraza con vista" },
      { color: "from-yellow-500 to-orange-600", desc: "Repostería artesanal" },
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
      { color: "from-red-400 to-orange-500", desc: "Hamburguesa especial" },
      { color: "from-yellow-400 to-red-500", desc: "Perro caliente completo" },
      { color: "from-orange-400 to-red-600", desc: "Papas fritas crujientes" },
      { color: "from-amber-400 to-orange-600", desc: "Kiosco nocturno" },
      { color: "from-red-500 to-pink-600", desc: "Malteadas artesanales" },
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
