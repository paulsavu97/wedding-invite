// ====== CONFIG (edita esto) ======
const WEDDING = {
  dateISO: "2026-06-27T13:00:00+02:00",

  ceremony: {
    name: "Iglesia Virgen de la Piedad",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Iglesia+Virgen+de+la+Piedad+Taranc%C3%B3n"
  },

  banquet: {
    name: "Finca La Cervalera (Tarancón)",
    address: "Carretera A-3, km 79, Camino La Cervalera s/n, 16400 Tarancón (Cuenca)",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=La+Cervalera+Taranc%C3%B3n"
  }
};

// ====== Helpers ======
const $ = (id) => document.getElementById(id);
const target = new Date(WEDDING.dateISO);

// ====== Maps + textos ======
const cLink = $("mapsCeremony");
const bLink = $("mapsBanquet");
if (cLink) cLink.href = WEDDING.ceremony.mapsUrl;
if (bLink) bLink.href = WEDDING.banquet.mapsUrl;

const cName = $("ceremonyName");
const bName = $("banquetName");
const bAddr = $("banquetAddr");
if (cName) cName.textContent = WEDDING.ceremony.name;
if (bName) bName.textContent = WEDDING.banquet.name;
if (bAddr) bAddr.textContent = WEDDING.banquet.address;

// ====== Fecha bonita ======
const pretty = new Intl.DateTimeFormat("es-ES", {
  weekday: "long", year: "numeric", month: "long", day: "2-digit",
  hour: "2-digit", minute: "2-digit"
}).format(target);

const prettyEl = $("prettyDate");
if (prettyEl) prettyEl.textContent = pretty;

// ====== Countdown ======
function pad(n){ return String(n).padStart(2, "0"); }

function tick(){
  const now = new Date();
  const diff = target - now;

  const dd = $("dd"), hh = $("hh"), mm = $("mm"), ss = $("ss");
  if (!dd || !hh || !mm || !ss) return;

  if (diff <= 0){
    dd.textContent = "00";
    hh.textContent = "00";
    mm.textContent = "00";
    ss.textContent = "00";
    return;
  }

  const s = Math.floor(diff / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  dd.textContent = pad(days);
  hh.textContent = pad(hours);
  mm.textContent = pad(mins);
  ss.textContent = pad(secs);
}

tick();
setInterval(tick, 1000);

// ====== Form UX (sin backend propio) ======
const form = $("rsvpForm");
const msg = $("formMsg");

if (form && msg) {
  form.addEventListener("submit", async (e) => {
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
