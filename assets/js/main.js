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

// ====== Form UX (Google Sheets via Apps Script) ======
const form = $("rsvpForm");
const msg = $("formMsg");

function setDisabled(disabled) {
  const btn = form?.querySelector('button[type="submit"]');
  if (btn) btn.disabled = disabled;
}

// Mostrar/ocultar "parada_autobus" según transporte
const transporteSel = document.querySelector('select[name="transporte"]');
const paradaInput = document.querySelector('input[name="parada_autobus"]');
const paradaField = paradaInput ? paradaInput.closest(".field") : null;

function updateParadaField(){
  if (!transporteSel || !paradaField || !paradaInput) return;
  const isBus = transporteSel.value === "Autobús";
  paradaField.style.display = isBus ? "grid" : "none";
  if (!isBus) paradaInput.value = "";
}
if (transporteSel) {
  transporteSel.addEventListener("change", updateParadaField);
  updateParadaField();
}

if (form && msg) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    msg.textContent = "Enviando…";
    setDisabled(true);

    try {
      const fd = new FormData(form);
      fd.append("user_agent", navigator.userAgent);

      // Convertimos a x-www-form-urlencoded (evita preflight/CORS)
      const body = new URLSearchParams();
      for (const [k, v] of fd.entries()) body.append(k, v);

      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body
      });

      let data = null;
      try { data = await res.json(); } catch {}

      if (res.ok && (!data || data.ok)) {
        form.reset();
        updateParadaField();
        msg.textContent = "¡Gracias! Confirmación enviada.";
      } else {
        const errMsg = (data && data.error) ? data.error : "No se pudo enviar. Prueba de nuevo.";
        msg.textContent = errMsg;
      }

    } catch (err) {
      msg.textContent = "Error de red. Inténtalo otra vez.";
    } finally {
      setDisabled(false);
    }
  });
}

