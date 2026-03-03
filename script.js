// =============================
// LIMITES DE CABA
// =============================

var boundsCABA = L.latLngBounds(
  [-34.7050, -58.5310],  // Suroeste
  [-34.5260, -58.3350]   // Noreste
);

// =============================
// CREACION DEL MAPA
// =============================

var map = L.map('map', {
  center: [-34.6037, -58.3816],
  zoom: 12,
  minZoom: 12,
  maxZoom: 17,
  maxBounds: boundsCABA,
  maxBoundsViscosity: 1.0
});

// =============================
// FONDO CLARO
// =============================

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO'
}).addTo(map);

// =============================
// CARGA DE BARRIOS
// =============================

var barriosLayer;

fetch('barrios.geojson')
  .then(response => response.json())
  .then(data => {

    barriosLayer = L.geoJSON(data, {
      style: {
        color: "#333",
        weight: 1,
        fillColor: "#ffffff",
        fillOpacity: 0.6
      },
      onEachFeature: function (feature, layer) {

        if (feature.properties && feature.properties.nombre) {

          var centroide = layer.getBounds().getCenter();

          var label = L.marker(centroide, {
            icon: L.divIcon({
              className: 'label-barrio',
              html: feature.properties.nombre,
              iconSize: [100, 20]
            })
          });

          layer.labelMarker = label;
          label.addTo(map);
        }
      }
    }).addTo(map);

    controlarLabels();
  });

// =============================
// CONTROLAR VISIBILIDAD DE NOMBRES
// =============================

function controlarLabels() {

  var zoomActual = map.getZoom();

  barriosLayer.eachLayer(function (layer) {

    if (layer.labelMarker) {

      if (zoomActual < 13) {
        map.removeLayer(layer.labelMarker);
      } else {
        map.addLayer(layer.labelMarker);
      }
    }
  });
}

map.on('zoomend', controlarLabels);


