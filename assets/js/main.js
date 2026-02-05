// ====== CONFIG (edita esto) ======
const WEDDING = {
  dateISO: "2026-06-27T13:00:00+02:00",

  ceremony: {
    name: "Iglesia Virgen de la Piedad",
    mapsUrl: "https://maps.app.goo.gl/SDSN7cr8CDLzNRV47"
  },

  banquet: {
    name: "Finca La Cervalera (Tarancón)",
    address: "Carretera A-3, km 79, Camino La Cervalera s/n, 16400 Tarancón (Cuenca)",
    mapsUrl: "https://www.google.com/maps/place/Finca+La+Cervalera/@40.0243429,-3.0319603,717m/data=!3m2!1e3!4b1!4m6!3m5!1s0xd4286b351048cb3:0x2abb45ef5ffcded8!8m2!3d40.0243429!4d-3.0319603!16s%2Fg%2F11b638_tz2?entry=ttu&g_ep=EgoyMDI2MDEyOC4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D"
  },

  preboda: {
    place: "Quintanar de la Orden",
    timeText: "19:30",
    mapsUrl: "https://www.google.com/maps?q=Quintanar+de+la+Orden"
  }
};

// ====== Helpers ======
const $ = (id) => document.getElementById(id);
const target = new Date(WEDDING.dateISO);

function pad(n){ return String(n).padStart(2, "0"); }

function toICSDateUTC(date){
  // YYYYMMDDTHHMMSSZ
  const d = new Date(date.getTime());
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth()+1).padStart(2,"0");
  const da = String(d.getUTCDate()).padStart(2,"0");
  const h = String(d.getUTCHours()).padStart(2,"0");
  const mi = String(d.getUTCMinutes()).padStart(2,"0");
  const s = String(d.getUTCSeconds()).padStart(2,"0");
  return `${y}${m}${da}T${h}${mi}${s}Z`;
}

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

// Preboda
const pLink = $("mapsPreboda");
const pTime = $("prebodaTime");
if (pLink) pLink.href = WEDDING.preboda.mapsUrl;
if (pTime) pTime.textContent = WEDDING.preboda.timeText;

// ====== Fecha bonita ======
const pretty = new Intl.DateTimeFormat("es-ES", {
  weekday: "long", year: "numeric", month: "long", day: "2-digit",
  hour: "2-digit", minute: "2-digit"
}).format(target);

const prettyEl = $("prettyDate");
if (prettyEl) prettyEl.textContent = pretty;

// ====== Countdown ======
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

  dd.textContent = String(days);
  hh.textContent = pad(hours);
  mm.textContent = pad(mins);
  ss.textContent = pad(secs);
}

tick();
setInterval(tick, 1000);

// ====== Botón GUARDAR FECHA (descarga ICS) ======
const addBtn = $("addToCalendar");
if (addBtn) {
  addBtn.addEventListener("click", () => {
    // Duración estimada del evento: 8 horas (ajústalo si quieres)
    const start = new Date(WEDDING.dateISO);
    const end = new Date(start.getTime() + 8 * 60 * 60 * 1000);

    const dtstamp = toICSDateUTC(new Date());
    const dtstart = toICSDateUTC(start);
    const dtend = toICSDateUTC(end);

    const title = "Boda Cristina & Santi";
    const location = `${WEDDING.ceremony.name} / ${WEDDING.banquet.name}`;
    const description = `Ceremonia: ${WEDDING.ceremony.name}\nCelebración: ${WEDDING.banquet.name}\n\n¡Nos encantará verte!`;

    const ics =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//C&S//Invitacion//ES
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${dtstart}-cs@invitacion
DTSTAMP:${dtstamp}
DTSTART:${dtstart}
DTEND:${dtend}
SUMMARY:${title}
LOCATION:${location}
DESCRIPTION:${description.replace(/\n/g, "\\n")}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "save-the-date-cristina-santi.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
}

// ====== Niños: mostrar/ocultar "¿Cuántos?" ======
const kidsSelect = document.getElementById("kidsSelect");
const kidsCountField = document.getElementById("kidsCountField");
const kidsCount = document.getElementById("kidsCount");

function updateKidsField(){
  if (!kidsSelect || !kidsCountField) return;
  const show = kidsSelect.value === "Sí";
  kidsCountField.style.display = show ? "grid" : "none";
  if (!show && kidsCount) kidsCount.value = "";
}

if (kidsSelect) {
  kidsSelect.addEventListener("change", updateKidsField);
  updateKidsField();
}


// ====== Form UX (Apps Script vía iframe, sin CORS) ======
const form = document.getElementById("rsvpForm");
const msg = document.getElementById("formMsg");
const iframe = document.getElementById("rsvp_iframe");

function setDisabled(disabled) {
  const btn = form?.querySelector('button[type="submit"]');
  if (btn) btn.disabled = disabled;
}

if (form && msg && iframe) {
  form.addEventListener("submit", () => {
    msg.textContent = "Enviando…";
    setDisabled(true);

    // añade user_agent como campo oculto real (Apps Script lo recibirá)
    let ua = form.querySelector('input[name="user_agent"]');
    if (!ua) {
      ua = document.createElement("input");
      ua.type = "hidden";
      ua.name = "user_agent";
      form.appendChild(ua);
    }
    ua.value = navigator.userAgent;
  });

  iframe.addEventListener("load", () => {
    // Si llega aquí, el POST ya se envió (y normalmente se guardó)
    form.reset();
    // si tienes la función updateKidsField, llámala:
    if (typeof updateKidsField === "function") updateKidsField();

    msg.textContent = "¡Listo! Hemos recibido tu confirmación. Gracias 🤍";
    setDisabled(false);
  });
}

// ====== Animaciones on-scroll (cards flotantes pro) ======
(() => {
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  // Si el usuario prefiere menos movimiento, mostramos sin animación
  if (prefersReduced) {
    items.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.14, rootMargin: "0px 0px -10% 0px" });

  items.forEach((el, i) => {
    // Stagger sutil: cada elemento entra con un delay distinto
    el.style.setProperty("--d", `${Math.min(i * 70, 420)}ms`);
    io.observe(el);
  });
})();

