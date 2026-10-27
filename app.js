// Motor común de las webs de hostelería.
// Todo el contenido sale de datos.js (NEGOCIO, CARTA, MENU_DIA, EVENTOS).

const ALERGENOS = {
  gluten: ["🌾", "Gluten"], crustaceos: ["🦐", "Crustáceos"], huevo: ["🥚", "Huevo"],
  pescado: ["🐟", "Pescado"], cacahuete: ["🥜", "Cacahuete"], soja: ["🫘", "Soja"],
  lacteos: ["🥛", "Lácteos"], frutos_cascara: ["🌰", "Frutos de cáscara"], apio: ["🥬", "Apio"],
  mostaza: ["🟡", "Mostaza"], sesamo: ["⚪", "Sésamo"], sulfitos: ["🍷", "Sulfitos"],
  altramuces: ["🌼", "Altramuces"], moluscos: ["🦪", "Moluscos"],
};
// Secciones opcionales: si datos.js no las define, no se muestran
const HAY_MENU = typeof MENU_DIA !== "undefined";
const HAY_EVENTOS = typeof EVENTOS !== "undefined" && EVENTOS.length > 0;
const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const euros = (n) => n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
const enlaceWA = (msg) => `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(msg)}`;
const aMinutos = (h) => { const [a, b] = h.split(":").map(Number); return a * 60 + b; };

// ¿Está abierto ahora? Admite tramos que pasan de medianoche (p. ej. 20:00-03:00)
function estadoAhora(fecha = new Date()) {
  const min = fecha.getHours() * 60 + fecha.getMinutes();
  const hoy = fecha.getDay(), ayer = (hoy + 6) % 7;
  for (const t of NEGOCIO.horario) {
    const abre = aMinutos(t.abre), cierra = aMinutos(t.cierra);
    const cruza = cierra <= abre;
    if (t.dias.includes(hoy) && min >= abre && (cruza || min < cierra)) return { abierto: true, hasta: t.cierra };
    if (cruza && t.dias.includes(ayer) && min < cierra) return { abierto: true, hasta: t.cierra };
  }
  return { abierto: false };
}

// Franja del día (para el bar "todo en uno")
function franjaActual(fecha = new Date()) {
  if (!NEGOCIO.franjas) return null;
  const min = fecha.getHours() * 60 + fecha.getMinutes();
  return NEGOCIO.franjas.find((f) => {
    const a = aMinutos(f.desde), b = aMinutos(f.hasta);
    return b > a ? min >= a && min < b : min >= a || min < b;
  }) || NEGOCIO.franjas[0];
}

function pintarCabecera() {
  document.title = `${NEGOCIO.nombre} · ${NEGOCIO.tipo} en ${NEGOCIO.ciudad}`;
  document.querySelectorAll("[data-n]").forEach((el) => { el.textContent = NEGOCIO[el.dataset.n]; });
  const menu = [["carta", "Carta"]];
  if (HAY_MENU) menu.push(["menu-dia", "Menú del día"]);
  if (HAY_EVENTOS) menu.push(["eventos", NEGOCIO.tituloEventos || "Eventos"]);
  menu.push(["reservas", "Reservar"], ["donde", "Dónde estamos"]);
  $("#menu").innerHTML = menu.map(([id, txt]) => `<a href="#${id}">${txt}</a>`).join("");
  for (const id of ["menu-dia", "eventos"]) {
    if (!menu.some(([m]) => m === id)) $(`#${id}`)?.remove();
  }
}

// Pizarra de la portada con las recomendaciones del día
function pintarPizarra() {
  if (!NEGOCIO.pizarra) return;
  const p = NEGOCIO.pizarra;
  $("#pizarra").hidden = false;
  $("#pizarra").innerHTML = `<p class="pizarra-titulo">${esc(p.titulo)}</p>
    <ul>${p.lineas.map(([txt, precio]) => `<li><span>${esc(txt)}</span><span>${precio ? euros(precio) : ""}</span></li>`).join("")}</ul>
    ${p.pie ? `<p class="pizarra-pie">${esc(p.pie)}</p>` : ""}`;
}

function pintarEstado() {
  const e = estadoAhora();
  $("#estado").className = "estado " + (e.abierto ? "abierto" : "cerrado");
  $("#estado").textContent = e.abierto ? `● Abierto ahora · hasta las ${e.hasta}` : "● Cerrado ahora";
  const f = franjaActual();
  if (f) {
    $("#franja").hidden = false;
    $("#franja").innerHTML = `<span>${esc(f.icono)}</span> Ahora: <strong>${esc(f.nombre)}</strong> — ${esc(f.texto)}`;
    document.body.dataset.franja = f.id;
  }
}

let filtroSinGluten = false;
function pintarCarta() {
  const cats = CARTA.map((c) => c.categoria);
  $("#cats").innerHTML = cats.map((c, i) => `<button class="cat${i ? "" : " activa"}" data-i="${i}">${esc(c)}</button>`).join("")
    + `<label class="filtro"><input type="checkbox" id="sin-gluten" ${filtroSinGluten ? "checked" : ""}> 🌾🚫 Solo sin gluten</label>`;
  // si la franja horaria indica una categoría, la carta se abre ahí
  const f = franjaActual();
  const inicial = f?.categoria ? Math.max(0, cats.indexOf(f.categoria)) : 0;
  mostrarCategoria(inicial);
}

function mostrarCategoria(i) {
  document.querySelectorAll(".cat").forEach((b) => b.classList.toggle("activa", +b.dataset.i === i));
  const platos = CARTA[i].platos.filter((p) => !filtroSinGluten || !(p.alergenos || []).includes("gluten"));
  $("#platos").innerHTML = platos.length ? platos.map((p) => `
    <article class="plato">
      <div class="plato-cab"><h3>${esc(p.nombre)}</h3><span class="precio">${p.precio2 ? `${euros(p.precio)} / ${euros(p.precio2)}` : euros(p.precio)}</span></div>
      ${p.desc ? `<p>${esc(p.desc)}</p>` : ""}
      <div class="alergenos">${(p.alergenos || []).map((a) => `<span title="${esc(ALERGENOS[a][1])}">${ALERGENOS[a][0]}</span>`).join("")}
        ${p.etiqueta ? `<em class="etiqueta">${esc(p.etiqueta)}</em>` : ""}</div>
    </article>`).join("") : `<p class="vacio">No hay platos sin gluten en esta sección. ¡Pregúntanos, adaptamos muchos!</p>`;
  $("#platos").dataset.i = i;
  if (CARTA[i].nota_precios) $("#platos").insertAdjacentHTML("beforeend", `<p class="nota">${esc(CARTA[i].nota_precios)}</p>`);
}

function pintarLeyenda() {
  $("#leyenda").innerHTML = Object.values(ALERGENOS).map(([ico, nom]) => `<span>${ico} ${nom}</span>`).join("");
}

function pintarMenuDia() {
  if (!HAY_MENU) return;
  const m = MENU_DIA;
  const lista = (t, xs) => `<div><h3>${t}</h3><ul>${xs.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`;
  $("#menu-dia-contenido").innerHTML = `
    <p class="menu-precio">${euros(m.precio)} <small>${esc(m.dias)}</small></p>
    <div class="menu-cols">${lista("Primeros", m.primeros)}${lista("Segundos", m.segundos)}${lista("Postres", m.postres)}</div>
    <p class="menu-incluye">${esc(m.incluye)}</p>`;
}

function pintarEventos() {
  if (!HAY_EVENTOS) return;
  $("#eventos h2").textContent = NEGOCIO.tituloEventos || "Eventos";
  $("#lista-eventos").innerHTML = EVENTOS.map((e) => `
    <article class="evento"><span class="evento-ico">${esc(e.icono)}</span>
      <div><p class="evento-dia">${esc(e.cuando)}</p><h3>${esc(e.titulo)}</h3><p>${esc(e.desc)}</p></div></article>`).join("");
}

function pintarHorario() {
  const orden = [1, 2, 3, 4, 5, 6, 0];
  const hoy = new Date().getDay();
  $("#horario").innerHTML = orden.map((d) => {
    const tramos = NEGOCIO.horario.filter((t) => t.dias.includes(d)).map((t) => `${t.abre}–${t.cierra}`);
    return `<tr class="${d === hoy ? "hoy" : ""}"><td>${DIAS[d]}</td><td>${tramos.join(" · ") || "Cerrado"}</td></tr>`;
  }).join("");
  const q = encodeURIComponent(`${NEGOCIO.direccion}, ${NEGOCIO.ciudad}`);
  $("#mapa").href = `https://www.google.com/maps/search/?api=1&query=${q}`;
  $("#tel").href = `tel:+${NEGOCIO.whatsapp}`;
}

function pintarReservas() {
  const hoy = new Date().toISOString().slice(0, 10);
  $("#r-fecha").min = hoy; $("#r-fecha").value = hoy;
  if (NEGOCIO.tiposReserva) {
    $("#r-tipo").innerHTML = NEGOCIO.tiposReserva.map((t) => `<option>${esc(t)}</option>`).join("");
  } else $("#r-tipo-label").remove();
}

function pintarPie() {
  const red = (n, url) => (url ? `<a href="${esc(url)}" target="_blank" rel="noopener">${n}</a>` : "");
  $("#redes").innerHTML = [red("Instagram", NEGOCIO.instagram), red("Facebook", NEGOCIO.facebook),
    `<a href="${enlaceWA("")}" target="_blank" rel="noopener">WhatsApp</a>`].filter(Boolean).join(" · ");
  $("#credito").innerHTML = `Web de demostración con un negocio ficticio · Hecha por <a href="https://github.com/Sergio-sysops" target="_blank" rel="noopener">sergio_sysops</a>`;
}

// QR de la carta para poner en las mesas
function mostrarQR() {
  const url = location.href.split("#")[0] + "#carta";
  $("#qr-caja").innerHTML = "";
  if (window.QRCode) new QRCode($("#qr-caja"), { text: url, width: 220, height: 220, colorDark: "#111", colorLight: "#fff" });
  else $("#qr-caja").textContent = url;
  $("#qr-dialogo").showModal();
}

document.addEventListener("click", (e) => {
  const cat = e.target.closest(".cat");
  if (cat) mostrarCategoria(+cat.dataset.i);
  if (e.target.closest("#ver-qr")) mostrarQR();
  if (e.target.closest("#cerrar-qr")) $("#qr-dialogo").close();
});
document.addEventListener("change", (e) => {
  if (e.target.id === "sin-gluten") { filtroSinGluten = e.target.checked; mostrarCategoria(+$("#platos").dataset.i || 0); }
});

$("#form-reserva").addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new FormData(e.target);
  if (d.get("web")) return;   // campo trampa para bots
  const fecha = new Date(d.get("fecha") + "T12:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
  const lineas = [`¡Hola! Quiero reservar en ${NEGOCIO.nombre}:`, `• Día: ${fecha}`, `• Hora: ${d.get("hora")}`,
    `• Personas: ${d.get("personas")}`];
  if (d.get("tipo")) lineas.push(`• Tipo: ${d.get("tipo")}`);
  lineas.push(`• Nombre: ${d.get("nombre")}`);
  if (d.get("notas")?.trim()) lineas.push(`• Notas: ${d.get("notas").trim()}`);
  window.open(enlaceWA(lineas.join("\n")), "_blank", "noopener");
});

pintarCabecera(); pintarPizarra(); pintarEstado(); pintarCarta(); pintarLeyenda(); pintarMenuDia();
pintarEventos(); pintarHorario(); pintarReservas(); pintarPie();
setInterval(pintarEstado, 60000);
