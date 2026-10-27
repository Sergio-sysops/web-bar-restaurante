// Datos del negocio (FICTICIO, solo para la demo)
const NEGOCIO = {
  nombre: "La Plazuela",
  tipo: "Bar · Restaurante",
  ciudad: "Villanueva",
  lema: "Del café de la mañana a la última copa. Cocina casera, tapas y buen ambiente todo el día.",
  direccion: "Plaza Mayor, 4",
  whatsapp: "34600000000",
  instagram: "https://instagram.com/",
  facebook: "",
  fuentes: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Nunito+Sans:wght@400;600;800&display=swap",
  horario: [
    { dias: [1, 2, 3, 4], abre: "07:00", cierra: "00:00" },
    { dias: [5, 6], abre: "08:00", cierra: "02:30" },
    { dias: [0], abre: "09:00", cierra: "17:00" },
  ],
  // La portada cambia según la hora del día
  franjas: [
    { id: "desayuno", desde: "07:00", hasta: "12:00", icono: "☕", categoria: "Desayunos", nombre: "Desayunos", texto: "tostadas, churros y café recién hecho" },
    { id: "comida", desde: "12:00", hasta: "16:30", icono: "🍽️", categoria: "Raciones y platos", nombre: "Menú del día", texto: "cocina casera por 13,50 €" },
    { id: "tarde", desde: "16:30", hasta: "21:00", icono: "🍺", categoria: "Tapas", nombre: "Tapeo", texto: "cañas bien tiradas y tapa con cada consumición" },
    { id: "noche", desde: "21:00", hasta: "07:00", icono: "🍸", categoria: "Copas", nombre: "Cenas y copas", texto: "raciones, combinados y buena música" },
  ],
  tiposReserva: ["Comida", "Cena", "Copas", "Celebración / grupo"],
  tituloEventos: "Esta semana",
  pizarra: {
    titulo: "Hoy en la pizarra",
    lineas: [["Menú del día", 13.5], ["Caña + tapa", 1.8], ["Croquetas de cocido", 1.6], ["Secreto ibérico", 14], ["Tarta de queso casera", 4.5]],
    pie: "¡Tapa gratis con cada caña!",
  },
};

const CARTA = [
  { categoria: "Desayunos", platos: [
    { nombre: "Tostada con tomate y aceite", desc: "Pan de pueblo, tomate rallado y AOVE.", precio: 2.2, precio2: 3.2, alergenos: ["gluten"], etiqueta: "½ / entera" },
    { nombre: "Tostada con jamón", desc: "Con tomate y jamón serrano.", precio: 3.5, alergenos: ["gluten"] },
    { nombre: "Churros (6 uds.)", desc: "Recién hechos, con chocolate +1 €.", precio: 2.8, alergenos: ["gluten"] },
    { nombre: "Desayuno completo", desc: "Café o infusión + zumo de naranja natural + tostada.", precio: 4.5, alergenos: ["gluten", "lacteos"], etiqueta: "Oferta" },
    { nombre: "Tostada sin gluten", desc: "Pan sin gluten tostado aparte.", precio: 3.0, alergenos: [] },
  ]},
  { categoria: "Tapas", platos: [
    { nombre: "Ensaladilla rusa", desc: "La de la casa, con atún y mayonesa casera.", precio: 3.5, precio2: 9, alergenos: ["huevo", "pescado"], etiqueta: "Tapa / ración" },
    { nombre: "Patatas bravas", desc: "Con nuestra salsa brava y alioli.", precio: 3, precio2: 7.5, alergenos: ["huevo"] },
    { nombre: "Croquetas caseras", desc: "Jamón o cocido, hechas cada mañana.", precio: 1.6, alergenos: ["gluten", "lacteos", "huevo"], etiqueta: "Unidad" },
    { nombre: "Calamares a la andaluza", desc: "Fritos al momento.", precio: 4.5, precio2: 12, alergenos: ["gluten", "moluscos"] },
    { nombre: "Tortilla de patatas", desc: "Jugosa, con o sin cebolla.", precio: 2.5, precio2: 10, alergenos: ["huevo"] },
    { nombre: "Secreto ibérico", desc: "A la plancha con patatas.", precio: 5, precio2: 14, alergenos: [] },
  ]},
  { categoria: "Raciones y platos", platos: [
    { nombre: "Huevos rotos con jamón", desc: "Patatas fritas, huevos de corral y jamón.", precio: 11, alergenos: ["huevo"] },
    { nombre: "Parrillada de verduras", desc: "Verduras de temporada a la brasa.", precio: 10, alergenos: [], etiqueta: "Vegano" },
    { nombre: "Chuletón (1 kg aprox.)", desc: "Para compartir, con patatas y pimientos.", precio: 42, alergenos: [] },
    { nombre: "Bacalao a la riojana", desc: "Con tomate, pimiento y patata.", precio: 15, alergenos: ["pescado"] },
  ]},
  { categoria: "Bebidas", platos: [
    { nombre: "Caña", desc: "Con tapa de la casa.", precio: 1.8, alergenos: ["gluten"] },
    { nombre: "Doble / tercio", precio: 2.8, alergenos: ["gluten"] },
    { nombre: "Copa de vino de la casa", desc: "Tinto, blanco o rosado.", precio: 2.2, alergenos: ["sulfitos"] },
    { nombre: "Refresco", precio: 2.2, alergenos: [] },
    { nombre: "Café / cortado", precio: 1.4, alergenos: ["lacteos"] },
  ]},
  { categoria: "Copas", platos: [
    { nombre: "Combinado nacional", desc: "Ron, ginebra, whisky o vodka con refresco.", precio: 6.5, alergenos: [] },
    { nombre: "Combinado premium", desc: "Pregunta por nuestras marcas.", precio: 8.5, alergenos: [] },
    { nombre: "Gin-tonic de la casa", desc: "Con pepino y pimienta rosa.", precio: 8, alergenos: [], etiqueta: "Favorito" },
    { nombre: "Chupito", precio: 2, alergenos: [] },
  ]},
];

const MENU_DIA = {
  precio: 13.5,
  dias: "De lunes a viernes, de 13:00 a 16:00",
  primeros: ["Lentejas estofadas", "Ensalada mixta", "Macarrones a la boloñesa"],
  segundos: ["Pollo al ajillo", "Merluza a la plancha", "Albóndigas en salsa"],
  postres: ["Flan casero", "Arroz con leche", "Fruta del tiempo"],
  incluye: "Incluye pan, bebida (agua, vino o refresco) y postre o café.",
};

const EVENTOS = [
  { icono: "⚽", cuando: "Sábados y domingos", titulo: "Fútbol en pantalla grande", desc: "Todos los partidos de liga y Champions. Reserva mesa para los partidos grandes." },
  { icono: "🎤", cuando: "Jueves · 22:00", titulo: "Noche de karaoke", desc: "Micrófono abierto y 2x1 en combinados hasta las 23:00." },
  { icono: "🥘", cuando: "Domingos · mediodía", titulo: "Paella por encargo", desc: "Encárgala antes del sábado por WhatsApp. Mínimo 4 personas." },
];
