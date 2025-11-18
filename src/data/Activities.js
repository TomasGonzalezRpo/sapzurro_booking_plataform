// src/data/Activities.js

export const activities = [
  {
    name: "Snorkel en Playa Soledad",
    description:
      "Explora los arrecifes de coral que rodean Playa Soledad, uno de los puntos más cristalinos del golfo. Durante la actividad podrás observar peces tropicales, estrellas de mar, corales y, con suerte, tortugas marinas. Es una experiencia tranquila, perfecta para quienes desean disfrutar la vida submarina sin necesidad de bucear.",
    price: 100000,
    duration: "2-3 horas",
    category: "acuaticas",
    image: "snorkel-playa-soledad.jpg",
    available: true,
    includes: ["Equipo básico de snorkel", "Bote", "Guía local"],
    idealFor: ["Turismo ecológico", "Familias", "Fotógrafos", "Aventura suave"],
    priceRange: "80000-120000",
    difficulty: "Baja",
    location: "Playa Soledad, Sapzurro",
    images: [{ desc: "Vista submarina", color: "from-blue-500 to-cyan-500" }],
    rating: 4.5,
    maxParticipants: 15,
    fullDescription:
      "Detalles completos de la actividad de snorkel en el arrecife. Incluye un recorrido guiado por el capitán, quien te señalará la vida marina más interesante del área. La visibilidad suele ser excelente.",
    requirements: ["Saber nadar"],
  },
  {
    name: "Caminata Ecológica Sapzurro → La Miel (Panamá)",
    description:
      "Sube los icónicos 300 escalones que conectan Sapzurro con La Miel, en Panamá. Después de la caminata disfrutarás de una de las playas más tranquilas del sector y podrás acceder a las tiendas duty free. Es una de las experiencias más representativas de la zona por su mezcla de naturaleza, cultura fronteriza y vistas panorámicas.",
    price: 200000,
    duration: "1 día (ida y vuelta)",
    category: "senderismo",
    image: "caminata-sapzurro-la-miel.jpg",
    available: true,
    includes: ["Caminata guiada", "Visita a frontera", "Tiempo de playa"],
    idealFor: ["Senderistas", "Parejas", "Viajeros internacionales"],
    priceRange: "200000",
    difficulty: "Media",
    location: "Sapzurro a La Miel, Frontera Colombia-Panamá",
    images: [{ desc: "Vista panorámica", color: "from-green-600 to-lime-600" }],
    rating: 4.9,
    maxParticipants: 12,
    fullDescription:
      "Recorrido completo a través de la selva y la frontera, incluyendo las vistas desde el mirador. La caminata dura aproximadamente 30 minutos y es moderadamente exigente.",
    requirements: [
      "Buen estado físico",
      "Calzado adecuado",
      "Documento de identidad (pasaporte o cédula)",
    ],
  },
  {
    name: "Kayak por la Bahía de Sapzurro",
    description:
      "La bahía de Sapzurro es perfecta para remar gracias a su mar calmado y protegido. Rema a lo largo de la costa, explora rincones escondidos y disfruta la vista de la selva que rodea el pueblo. Es una actividad segura, relajante y muy fotografiable.",
    price: 50000,
    duration: "1-2 horas",
    category: "acuaticas",
    image: "kayak-bahia-sapzurro.jpg",
    available: true,
    includes: ["Kayak individual o doble", "Chaleco salvavidas"],
    idealFor: ["Parejas", "Amigos", "Actividad física leve", "Naturaleza"],
    priceRange: "40000-60000",
    difficulty: "Baja",
    location: "Bahía de Sapzurro",
    images: [
      { desc: "Remando en la bahía", color: "from-teal-400 to-cyan-400" },
    ],
    rating: 4.2,
    maxParticipants: 8,
    fullDescription:
      "Un paseo tranquilo y relajante para disfrutar la tranquilidad de la bahía y su entorno selvático. Ideal para la mañana o el atardecer cuando el mar está más en calma.",
  },
  {
    name: "Visita Nocturna: Bioluminiscencia en Capurganá",
    description:
      "En noches de mar tranquilo es posible observar plancton bioluminiscente cerca de Capurganá. La lancha sale desde Sapzurro al anochecer y permite vivir uno de los espectáculos naturales más impresionantes de la región: ¡el mar brillando con cada movimiento!",
    price: 165000,
    duration: "2 horas (salida desde Sapzurro en lancha)",
    category: "nocturnas",
    image: "bioluminiscencia-capurgana.jpg",
    available: true,
    includes: ["Transporte en lancha", "Guía", "Observación nocturna"],
    idealFor: ["Aventureros", "Parejas", "Fotografía nocturna"],
    priceRange: "150000-180000",
    difficulty: "Baja",
    location: "Capurganá (salida desde Sapzurro)",
    requirements: ["Reserva previa", "Condiciones climáticas favorables"],
    images: [{ desc: "Mar brillante", color: "from-indigo-900 to-purple-800" }],
    rating: 5.0,
    maxParticipants: 10,
    fullDescription:
      "Una experiencia mágica solo disponible en ciertas condiciones, usualmente noches sin luna. El movimiento del agua ilumina miles de organismos de plancton.",
  },
];
