var map = L.map('map').setView([-34.6037, -58.3816], 12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO'
}).addTo(map);

let instituciones = [];
// =============================
// 1️ Cargar datos desde Google Sheets
// =============================

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
          direccion: columnas[3]?.trim(),
          tipo: columnas[4]?.trim()
        };
      });

    cargarBarrios();
  });


// =============================
// 2️ Cargar GeoJSON de barrios
// =============================

function cargarBarrios() {

  fetch("caba_barrios.json")
    .then(res => res.json())
    .then(data => {

      L.geoJSON(data, {

        // Estilo verde pastel con bordes blancos
        style: {
          color: "#ffffff",
          weight: 1.5,
          fillColor: "#8FD3B6",
          fillOpacity: 0.6
        },

onEachFeature: function(feature, layer) {

  const nombreBarrio = feature.properties.BARRIO;

  layer.bindTooltip(nombreBarrio, {
    permanent: true,
    direction: "center",
    className: "label-barrio"
  });

  // después sigue tu layer.on("click", ...)

          layer.on("click", function() {

            let nombreBarrio = feature.properties.BARRIO;

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

            const modal = document.getElementById("modalBarrio");
            const overlay = document.getElementById("overlay");

            document.getElementById("contenidoModal").innerHTML = html;

            overlay.style.display = "block";
            modal.style.display = "block";

            setTimeout(() => {
              modal.classList.add("activo");
            }, 10);

          });

        }

      }).addTo(map);

    });
}


// =============================
// 3️ Lógica para cerrar modal
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


