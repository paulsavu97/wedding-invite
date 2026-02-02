// ====== CONFIG (edita esto) ======
const WEDDING = {
  // Ceremonia: 27 junio 2026 a las 13:00 (horario peninsular, verano = +02:00)
  dateISO: "2026-06-27T13:00:00+02:00",

  ceremony: {
    name: "Iglesia Virgen de la Piedad",
    // OJO: si la iglesia NO está en Tarancón, cambia "Tarancón" por el pueblo correcto
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Iglesia+Virgen+de+la+Piedad+Taranc%C3%B3n"
  },

  banquet: {
    name: "Finca La Cervalera (Tarancón)",
    address: "Carretera A-3, km 79, Camino La Cervalera s/n, 16400 Tarancón (Cuenca)",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=La+Cervalera+Taranc%C3%B3n"
  },

  // Link “principal” (lo usabas en el botón)
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Iglesia+Virgen+de+la+Piedad+Taranc%C3%B3n"
};

// ====== Countdown ======
const $ = (id) => document.getElementById(id);
const target = new Date(WEDDING.dateISO);

// Si mantienes un botón “principal”
$("mapsLink").href = WEDDING.mapsUrl;

// Si añades botones separados (recomendado)
const cLink = document.getElementById("mapsCeremony");
const bLink = document.getElementById("mapsBanquet");
if (cLink) cLink.href = WEDDING.ceremony.mapsUrl;
if (bLink) bLink.href = WEDDING.banquet.mapsUrl;

// Rellenar textos si existen
const cName = document.getElementById("ceremonyName");
const bName = document.getElementById("banquetName");
const bAddr = document.getElementById("banquetAddr");
if (cName) cName.textContent = WEDDING.ceremony.name;
if (bName) bName.textContent = WEDDING.banquet.name;
if (bAddr) bAddr.textContent = WEDDING.banquet.address;

const pretty = new Intl.DateTimeFormat("es-ES", {
  weekday: "long", year: "numeric", month: "long", day: "2-digit",
  hour: "2-digit", minute: "2-digit"
}).format(target);

$("prettyDate").textContent = pretty;

function pad(n){ return String(n).padStart(2, "0"); }

function tick(){
  const now = new Date();
  let diff = target - now;

  if (diff <= 0){
    $("dd").textContent = "00";
    $("hh").textContent = "00";
    $("mm").textContent = "00";
    $("ss").textContent = "00";
    return;
  }

  const s = Math.floor(diff / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  $("dd").textContent = pad(days);
  $("hh").textContent = pad(hours);
  $("mm").textContent = pad(mins);
  $("ss").textContent = pad(secs);
}

tick();
setInterval(tick, 1000);

// ====== Form UX (sin backend propio) ======
const form = document.getElementById("rsvpForm");
const msg = document.getElementById("formMsg");

// Si usas Formspree, esto mejora UX; si no, igual funciona (se enviará normal).
if (form && msg) {
  form.addEventListener("submit", async (e) => {
    // Si no cambias el action (Formspree real), mejor deja el submit normal.
    if (!form.action.includes("formspree.io")) return;

    e.preventDefault();
    msg.textContent = "Enviando…";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });

      if (res.ok) {
        form.reset();
        msg.textContent = "¡Gracias! Confirmación enviada.";
      } else {
        msg.textContent = "No se pudo enviar. Prueba de nuevo o contáctanos por WhatsApp.";
      }
    } catch {
      msg.textContent = "Error de red. Inténtalo otra vez.";
    }
  });
}
