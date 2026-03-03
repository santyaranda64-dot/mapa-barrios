// =============================
// 0️ Configuración inicial del mapa (limitado a CABA)
// MAPA FIJO Y CENTRADO EN CABA
// =============================

var boundsCABA = [
  [-34.705, -58.531],  // Suroeste
  [-34.526, -58.335]   // Noreste
];
var map = L.map('map', {

  center: [-34.6037, -58.3816],
  zoom: 12,

  minZoom: 12,   // no permite zoom out
  maxZoom: 17,

  dragging: false,          // no se puede arrastrar
  scrollWheelZoom: true,    // solo permite zoom
  doubleClickZoom: true,
  boxZoom: false,
  keyboard: false,
  touchZoom: true

});

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO'
}).addTo(map);

var map = L.map('map', {
maxBounds: boundsCABA,
@@ -176,3 +192,4 @@ function cerrar() {

cerrarModal.addEventListener("click", cerrar);
overlay.addEventListener("click", cerrar);
