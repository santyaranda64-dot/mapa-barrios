// =============================
// MAPA TOTALMENTE FIJO EN CABA
// =============================

// Límites exactos de CABA (aproximados)
var boundsCABA = L.latLngBounds(
  [-34.7050, -58.5310],  // Suroeste
  [-34.5260, -58.3350]   // Noreste
);

var map = L.map('map', {
  center: [-34.6037, -58.3816],
  zoom: 13,
  minZoom: 13,
  maxZoom: 17,
  maxBounds: boundsCABA,
  maxBoundsViscosity: 1.0,   // Evita cualquier escape o rebote
  zoomControl: true,
  dragging: false,
  scrollWheelZoom: true,     // Cambiá a false si querés bloquear zoom
  doubleClickZoom: false,
  boxZoom: false,
  keyboard: false,
  touchZoom: false,
  inertia: false
});

// Forzar que nunca se salga del centro
map.setMaxBounds(boundsCABA);

// Fondo
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO'
}).addTo(map);
