var map = L.map('map').setView([-34.6037, -58.3816], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

let instituciones = [];

// 1️⃣ Primero cargamos los datos desde Google Sheets
fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQUDk_hKSVyoC6w4k0Do4QVTvXr0JvYEdC7HwqqEeWPlUgWva9YZy1tUSBL2gmFmvgKmGCGg2p9oQAM/pub?output=csv")
  .then(response => response.text())
  .then(csv => {

    const filas = csv.split("\n").slice(1);

    instituciones = filas
      .filter(fila => fila.trim() !== "")
      .map(fila => {
        const columnas = fila.split(",");

        return {
          barrio: columnas[0]?.trim(),
          nombre: columnas[1]?.trim(),
          actividad: columnas[2]?.trim(),
          direccion: columnas[3]?.trim()
        };
      });

    // 2️⃣ Recién ahora cargamos los barrios
    cargarBarrios();
  });

function cargarBarrios() {

  fetch("caba_barrios.json")")
    .then(res => res.json())
    .then(data => {

      L.geoJSON(data, {
        style: {
          color: "#333",
          weight: 1,
          fillOpacity: 0.3
        },
        onEachFeature: function(feature, layer) {

          layer.on("click", function() {

            let nombreBarrio = feature.properties.BARRIO;

            let filtradas = instituciones.filter(i => 
              i.barrio === nombreBarrio
            );

            let html = `<h2>${nombreBarrio}</h2>`;

            if (filtradas.length === 0) {
              html += "<p>No hay instituciones cargadas.</p>";
            } else {
              html += `
                <table>
                  <tr>
                    <th>Nombre</th>
                    <th>Actividad</th>
                    <th>Dirección</th>
                  </tr>
              `;

              filtradas.forEach(i => {
                html += `
                  <tr>
                    <td>${i.nombre}</td>
                    <td>${i.actividad}</td>
                    <td>${i.direccion}</td>
                  </tr>
                `;
              });

              html += "</table>";
            }

            document.getElementById("contenido").innerHTML = html;
          });

        }
      }).addTo(map);

    });
}

