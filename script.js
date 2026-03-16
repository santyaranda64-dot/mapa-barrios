// =============================
// 0️ Función robusta para parsear CSV
// (maneja comas dentro de celdas con comillas)
// =============================

function parsearLineaCSV(linea) {
  const resultado = [];
  let campo = "";
  let dentroDeComillas = false;

  for (let i = 0; i < linea.length; i++) {
    const char = linea[i];

    if (char === '"') {
      dentroDeComillas = !dentroDeComillas;
    } else if (char === "," && !dentroDeComillas) {
      resultado.push(campo.trim());
      campo = "";
    } else {
      campo += char;
    }
  }

  resultado.push(campo.trim()); // última columna
  return resultado;
}


// =============================
// 1️ Configuración inicial del mapa (limitado a CABA)
// =============================

var boundsCABA = [
  [-34.705, -58.531],  // Suroeste
  [-34.526, -58.335]   // Noreste
];

var map = L.map('map', {
  maxBounds: boundsCABA,
  maxBoundsViscosity: 1.0,
  minZoom: 11,
  maxZoom: 17
}).setView([-34.6037, -58.3816], 12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO'
}).addTo(map);

let instituciones = [];


// =============================
// 2️ Cargar datos desde Google Sheets
// =============================

const timestamp = new Date().getTime();
fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vQUDk_hKSVyoC6w4k0Do4QVTvXr0JvYEdC7HwqqEeWPlUgWva9YZy1tUSBL2gmFmvgKmGCGg2p9oQAM/pub?output=csv&t=${timestamp}`)
  .then(response => response.text())
  .then(csv => {

    const filas = csv.split("\n").slice(1);

    instituciones = filas
      .filter(fila => fila.trim() !== "")
      .map(fila => {
        const columnas = parsearLineaCSV(fila); // ✅ parseo robusto

        return {
          barrio: columnas[0]?.trim(),
          nombre: columnas[1]?.trim(),
          actividad: columnas[2]?.trim(),
          direccion: columnas[3]?.trim(),
          tipo: columnas[4]?.trim()
        };
      });

    cargarBarrios();
  });


// =============================
// 3️ Cargar GeoJSON de barrios
// =============================

function cargarBarrios() {

  fetch("caba_barrios.json")
    .then(res => res.json())
    .then(data => {

      const geojson = L.geoJSON(data, {

        style: {
          color: "#ffffff",
          weight: 1.5,
          fillColor: "#8FD3B6",
          fillOpacity: 0.6
        },

        onEachFeature: function(feature, layer) {

          const nombreBarrio = feature.properties.BARRIO;

          // Label centrado permanente
          layer.bindTooltip(nombreBarrio, {
            permanent: true,
            direction: "center",
            className: "label-barrio"
          });

          // Click para abrir modal
          layer.on("click", function() {

            let filtradas = instituciones.filter(i =>
              i.barrio?.trim().toUpperCase() === nombreBarrio?.trim().toUpperCase()
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
                    <td>${i.nombre || ""}</td>
                    <td>${i.actividad || ""}</td>
                    <td>${i.direccion || ""}</td>
                  </tr>
                `;
              });

              html += "</table>";
            }

            document.getElementById("contenidoModal").innerHTML = html;

            overlay.style.display = "block";
            modal.style.display = "block";

            setTimeout(() => {
              modal.classList.add("activo");
            }, 10);
          });

        }

      }).addTo(map);


      // =============================
      // 4️ Control dinámico de labels según zoom
      // =============================

      function actualizarLabels() {
        const zoom = map.getZoom();

        document.querySelectorAll(".label-barrio").forEach(label => {

          if (zoom <= 11) {
            label.style.display = "none";
            return;
          }

          label.style.display = "block";

          const size = 12 + (zoom - 12) * 1.5;
          label.style.fontSize = size + "px";
        });
      }

      map.on("zoomend", actualizarLabels);
      actualizarLabels();

    });
}


// =============================
// 5️ Lógica para cerrar modal
// =============================

const cerrarModal = document.getElementById("cerrarModal");
const overlay = document.getElementById("overlay");
const modal = document.getElementById("modalBarrio");

function cerrar() {
  modal.classList.remove("activo");

  setTimeout(() => {
    modal.style.display = "none";
    overlay.style.display = "none";
  }, 200);
}

cerrarModal.addEventListener("click", cerrar);
overlay.addEventListener("click", cerrar);
