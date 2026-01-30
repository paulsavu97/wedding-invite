// ====== CONFIG (edita esto) ======
const WEDDING = {
  // Fecha/hora en tu zona (Europe/Madrid). Ej: "2026-10-19T13:00:00+02:00"
  dateISO: "2026-10-19T13:00:00+02:00",
  placeName: "Bodega Finca Los Aljibes",
  mapsUrl: "https://www.google.com/maps?q=Bodega+Finca+Los+Aljibes"
};

// ====== Countdown ======
const $ = (id) => document.getElementById(id);
const target = new Date(WEDDING.dateISO);

$("mapsLink").href = WEDDING.mapsUrl;

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
