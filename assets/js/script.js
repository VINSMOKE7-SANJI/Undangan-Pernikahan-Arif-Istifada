/* ============================================================
   WEDDING INVITATION ENGINE
   Loads data/wedding.json, reads ?to= guest name from the URL,
   and renders every section of index.html dynamically.
   ============================================================ */

(function () {
  "use strict";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const WISHES_KEY = "wedding_wishes_v1";

  /* small inline placeholder used when an image fails to load,
     so a missing photo never shows a broken-image icon */
  const FALLBACK_IMG =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%230d2b22'/%3E%3Cg stroke='%23c6a15b' stroke-width='2' fill='none' opacity='0.6'%3E%3Cpath d='M200 130l16.6 51.1H270l-42.3 30.7 16.6 51.1L200 231.9l-44.3 31 16.6-51.1L130 181.1h53.4z'/%3E%3C/g%3E%3C/svg%3E";

  function withFallback(img) {
    img.addEventListener("error", function onErr() {
      img.removeEventListener("error", onErr);
      img.src = FALLBACK_IMG;
      img.classList.add("img-fallback");
    });
    return img;
  }

  function getGuestName(defaultName) {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");
    if (!to) return { name: defaultName, isExplicit: false };
    const decoded = decodeURIComponent(to.replace(/\+/g, " ")).trim();
    return decoded ? { name: decoded, isExplicit: true } : { name: defaultName, isExplicit: false };
  }

  const ICONS = {
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 22s7-7.4 7-12a7 7 0 1 0-14 0c0 4.6 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>'
  };

  async function loadData() {
    const res = await fetch("data/wedding.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Gagal memuat data undangan");
    return res.json();
  }

  /* ---------------- OPENING ---------------- */
  /* ---------------- ANIMATED FRAME BACKGROUND (every page, Ken-Burns) ---------------- */
  function initFrameBackgrounds(data) {
    const frameUrl = data.framePhoto || "assets/images/frame.jpg";
    const targets = [$("#hero"), ...$$(".section"), $("#closing")].filter(Boolean);

    targets.forEach((sec) => {
      if (sec.querySelector(".section-frame-bg")) return; // don't duplicate

      const bg = document.createElement("div");
      bg.className = "section-frame-bg";
      bg.style.backgroundImage = `url('${frameUrl}')`;

      const wash = document.createElement("div");
      wash.className = "section-frame-wash";
      if (sec.id === "hero") wash.classList.add("wash-hero");
      if (sec.id === "closing") wash.classList.add("wash-closing");

      sec.prepend(wash);
      sec.prepend(bg);
    });
  }

  function renderOpening(data, guestName) {
    $("#op-groom-name").textContent = data.groom.name;
    $("#op-bride-name").textContent = data.bride.name;
    $("#op-date").textContent = data.event.dateLabelLong;
    $("#op-greeting").textContent = data.meta.openingLine;
    $("#op-guest-name").textContent = guestName;
    document.title = `Undangan Pernikahan ${data.groom.name} & ${data.bride.name}`;
    $("#nav-brand").textContent = `${data.groom.name} & ${data.bride.name}`;

    const openingImg = data.openingPhoto || data.coverPhoto;
    if (openingImg) {
      $("#opening-bg").style.backgroundImage = `url('${openingImg}')`;
    }
  }

  function renderHero(data) {
    $("#hero-groom").textContent = data.groom.name;
    $("#hero-bride").textContent = data.bride.name;
    $("#hero-date").textContent = data.event.dateLabelLong;
  }

  function renderQuote(data) {
    $("#quote-arabic").textContent = data.quote.arabic;
    $("#quote-translation").textContent = `"${data.quote.translation}"`;
    $("#quote-source").textContent = data.quote.source;
  }

  function renderCouple(data) {
    const g = data.groom, b = data.bride;
    const gImg = $("#groom-photo"); gImg.src = g.photo; gImg.alt = `Foto ${g.fullName}`; withFallback(gImg);
    $("#groom-fullname").textContent = g.fullName;
    $("#groom-ig").textContent = g.instagram || "";
    $("#groom-parents").textContent = `${g.childOrder} ${g.father} & ${g.mother}`;

    const bImg = $("#bride-photo"); bImg.src = b.photo; bImg.alt = `Foto ${b.fullName}`; withFallback(bImg);
    $("#bride-fullname").textContent = b.fullName;
    $("#bride-ig").textContent = b.instagram || "";
    $("#bride-parents").textContent = `${b.childOrder} ${b.father} & ${b.mother}`;
  }

  /* ---------------- EVENT + MAP EMBED ---------------- */
  function mapEmbedSrc(ev) {
    if (ev.mapEmbedUrl) return ev.mapEmbedUrl;
    const q = encodeURIComponent(ev.address || ev.venueName || "");
    return `https://maps.google.com/maps?q=${q}&z=15&output=embed`;
  }

  function eventCardHTML(ev) {
    return `
      <div class="event-card">
        <div class="ev-label">${ICONS.calendar} ${ev.label}</div>
        <div class="ev-day">${ev.day}</div>
        <div class="ev-time">${ev.time}</div>
        <div class="event-row">${ICONS.pin}<span>${ev.venueName}<br>${ev.address}</span></div>
        <div class="map-embed">
          <iframe src="${mapEmbedSrc(ev)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Peta lokasi ${ev.label}"></iframe>
        </div>
        <a class="btn-map" href="${ev.mapsUrl}" target="_blank" rel="noopener">Buka di Google Maps</a>
      </div>`;
  }

  function renderEvents(data) {
    $("#event-cards").innerHTML = eventCardHTML(data.event.akad) + eventCardHTML(data.event.resepsi);
  }

  /* ---------------- LOVE STORY (with photo per scene) ---------------- */
  function renderLoveStory(data) {
    const wrap = $("#love-story");
    wrap.innerHTML = data.loveStory.map(item => `
      <div class="timeline-item">
        <div class="timeline-year">${item.year}</div>
        <div class="timeline-title">${item.title}</div>
        <p class="timeline-text">${item.text}</p>
        ${item.photo ? `<img class="timeline-photo" src="${item.photo}" alt="Foto ${item.title}" loading="lazy">` : ""}
      </div>`).join("");
    $$(".timeline-photo", wrap).forEach(withFallback);
  }

  /* ---------------- GALLERY — infinite dual-row marquee ---------------- */
  function renderGallery(data) {
    const photos = data.gallery;
    const half = Math.ceil(photos.length / 2);
    const rowA = photos.slice(0, half);
    const rowB = photos.slice(half);

    function buildRow(list) {
      // duplicate the list so the CSS translateX(-50%) loop is seamless
      const doubled = list.concat(list);
      return doubled.map((src, i) =>
        `<img src="${src}" alt="Galeri foto" loading="lazy" data-full="${src}">`
      ).join("");
    }

    $("#marquee-row-1").innerHTML = buildRow(rowA);
    $("#marquee-row-2").innerHTML = buildRow(rowB.length ? rowB : rowA);

    $$(".marquee-row img").forEach(withFallback);

    const lightbox = $("#lightbox");
    const lbImg = $("#lb-img");
    $("#gallery-marquee").addEventListener("click", (e) => {
      const img = e.target.closest("img");
      if (!img) return;
      lbImg.src = img.dataset.full;
      lightbox.classList.add("open");
    });
    $("#lb-close").addEventListener("click", () => lightbox.classList.remove("open"));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.classList.remove("open"); });
  }

  /* ---------------- WEDDING GIFT — debit-card style ---------------- */
  const BANK_THEMES = {
    bni:      "linear-gradient(135deg,#d97b1f,#7a3a05)",
    mandiri:  "linear-gradient(135deg,#0a5aa8,#052a4d)",
    bca:      "linear-gradient(135deg,#146fc4,#0a2f57)",
    bri:      "linear-gradient(135deg,#0f6dab,#083a5c)",
    bsi:      "linear-gradient(135deg,#0f7a4e,#0a3a26)",
    cimb:     "linear-gradient(135deg,#a3121f,#5c0910)",
    default:  "linear-gradient(135deg,var(--emerald-700),var(--emerald-950))"
  };

  function bankGradient(name) {
    const key = (name || "").toLowerCase().replace(/[^a-z]/g, "");
    return BANK_THEMES[key] || BANK_THEMES.default;
  }

  function formatCardNumber(num) {
    return String(num).replace(/(.{4})/g, "$1 ").trim();
  }

  function renderGift(data) {
    $("#gift-intro").textContent = data.gift.intro;
    const wrap = $("#bank-cards");
    wrap.innerHTML = data.gift.banks.map((b) => `
      <div class="bank-card-wrap">
        <div class="debit-card" style="background:${bankGradient(b.bank)}">
          <div class="card-top">
            <div class="chip"></div>
            <div class="card-brand">${b.bank}</div>
          </div>
          <div class="card-number">${formatCardNumber(b.number)}</div>
          <div class="card-bottom">
            <div class="card-holder">${b.holder}</div>
            <div class="card-dots"><span></span><span></span></div>
          </div>
        </div>
        <button class="btn-copy" data-copy="${b.number}">Salin Nomor</button>
      </div>`).join("");

    $$(".btn-copy", wrap).forEach(btn => {
      btn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(btn.dataset.copy);
          btn.textContent = "Tersalin!";
          btn.classList.add("copied");
          setTimeout(() => { btn.textContent = "Salin Nomor"; btn.classList.remove("copied"); }, 1800);
        } catch (err) {
          btn.textContent = "Gagal menyalin";
        }
      });
    });
  }

  /* ---------------- MEMORY VIDEO ---------------- */
  function renderVideo(data) {
    const section = $("#section-video");
    const mv = data.memoryVideo;
    if (!mv || !mv.src) { section.remove(); return; }
    const video = $("#memory-video");
    video.src = mv.src;
    if (mv.poster) video.poster = mv.poster;
    $("#video-caption").textContent = mv.caption || "";
  }

  /* ---------------- LIVE STREAMING (only if a link is provided) ---------------- */
  function toEmbeddableUrl(url) {
    const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|live\/))([\w-]+)/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    return null;
  }

  function renderLiveStream(data) {
    const section = $("#section-live");
    const ls = data.liveStream;
    if (!ls || !ls.url) {
      section.remove();
      const navLink = $('[data-live-link]');
      if (navLink) navLink.remove();
      return;
    }
    section.hidden = false;
    $("#live-note").textContent = ls.note || "Live streaming tersedia melalui tautan berikut.";
    $("#live-link").href = ls.url;

    const embed = toEmbeddableUrl(ls.url);
    if (embed) {
      const iframeWrap = document.createElement("div");
      iframeWrap.className = "map-embed";
      iframeWrap.style.marginTop = "16px";
      iframeWrap.innerHTML = `<iframe src="${embed}" loading="lazy" allowfullscreen title="Live streaming"></iframe>`;
      $(".live-card").insertBefore(iframeWrap, $("#live-link"));
      $(".live-card iframe").style.height = "220px";
    }
  }

  /* ---------------- RSVP / WISHES ---------------- */
  function loadWishes() {
    try { return JSON.parse(localStorage.getItem(WISHES_KEY) || "[]"); }
    catch { return []; }
  }
  function saveWish(wish) {
    const list = loadWishes();
    list.unshift(wish);
    localStorage.setItem(WISHES_KEY, JSON.stringify(list));
    return list;
  }
  function escapeHTML(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }
  function statusClass(attend) {
    if (attend === "Hadir") return "hadir";
    if (attend === "Tidak Hadir") return "tidak-hadir";
    return "masih-ragu";
  }
  function initials(name) {
    return (name || "?").trim().split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  }

  function renderWishes(list, highlightFirst) {
    const wrap = $("#wishes-list");
    if (!list.length) {
      wrap.innerHTML = `<div class="wishes-empty">Jadilah yang pertama mengirim doa &amp; ucapan.</div>`;
      return;
    }
    wrap.innerHTML = list.map((w, i) => `
      <div class="wish-item${highlightFirst && i === 0 ? " new-in" : ""}">
        <div class="wish-avatar">${initials(w.name)}</div>
        <div class="wish-body">
          <div class="wish-top">
            <div class="wish-name">${escapeHTML(w.name)}</div>
            <div class="wish-status ${statusClass(w.attend)}">${escapeHTML(w.attend)}</div>
          </div>
          <p class="wish-text">${escapeHTML(w.message)}</p>
          <div class="wish-date">${w.date}</div>
        </div>
      </div>`).join("");
  }

  const SUBMITTED_KEY = "wedding_has_submitted_v1";

  function initRSVP(guestName, isExplicitGuest) {
    renderWishes(loadWishes(), false);

    const form = $("#rsvp-form");
    const doneBox = $("#rsvp-done");
    const nameInput = $("#rsvp-name");
    const nameHint = $("#rsvp-name-hint");

    // Auto-fill the guest name from ?to= and lock it so guests only add their message.
    if (isExplicitGuest) {
      nameInput.value = guestName;
      nameInput.readOnly = true;
      nameHint.hidden = false;
    }

    // One submission per device: once sent, swap the form for a thank-you state.
    if (localStorage.getItem(SUBMITTED_KEY)) {
      form.hidden = true;
      doneBox.hidden = false;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const message = $("#rsvp-message").value.trim();
      const attend = ($$('input[name="attend"]').find(r => r.checked) || {}).value || "Hadir";
      if (!name || !message) return;

      const wish = {
        name, message, attend,
        date: new Date().toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
      };
      const list = saveWish(wish);
      renderWishes(list, true);
      localStorage.setItem(SUBMITTED_KEY, "1");

      form.hidden = true;
      doneBox.hidden = false;
    });
  }

  /* ---------------- CLOSING / FOOTER ---------------- */
  function renderClosing(data) {
    $("#closing-text").textContent = data.closing.thanksText;
    $("#closing-groom").textContent = data.groom.name;
    $("#closing-bride").textContent = data.bride.name;
    $("#closing-date").textContent = data.event.dateLabelLong;
  }

  function renderFooterAd(data) {
    const ad = data.meta.footerAd;
    $("#ad-text").textContent = ad.text;
    $("#ad-brand").textContent = ad.brand;
    $("#ad-cta").textContent = ad.ctaText;
    const msg = encodeURIComponent(ad.waMessage);
    $("#ad-wa").href = `https://wa.me/${ad.waNumber}?text=${msg}`;
  }

  /* ---------------- COUNTDOWN ---------------- */
  function initCountdown(targetISO) {
    const target = new Date(targetISO).getTime();
    function tick() {
      const diff = Math.max(0, target - Date.now());
      $("#cd-days").textContent = String(Math.floor(diff / 86400000)).padStart(2, "0");
      $("#cd-hours").textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0");
      $("#cd-mins").textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      $("#cd-secs").textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------- SCROLL REVEAL (continuous, replays both ways) ---------------- */
  function initReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        en.target.classList.toggle("in", en.isIntersecting);
      });
    }, { threshold: 0.15 });
    $$(".reveal").forEach(el => io.observe(el));

    const staggerIO = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        const items = $$(".stagger-item", en.target.closest(".couple-wrap") || document);
        items.forEach((item, i) => {
          item.style.transitionDelay = en.isIntersecting ? `${i * 0.15}s` : "0s";
          item.classList.toggle("in", en.isIntersecting);
        });
      });
    }, { threshold: 0.2 });
    const coupleWrap = $(".couple-wrap");
    if (coupleWrap) staggerIO.observe(coupleWrap);
  }

  /* ---------------- OPENING / MUSIC ---------------- */
  function initOpening(data) {
    const btn = $("#btn-open");
    const opening = $("#opening");
    const audio = $("#bg-audio");
    const navBtn = $("#btn-menu");
    if (data.meta.musicFile) audio.src = data.meta.musicFile;

    btn.addEventListener("click", () => {
      opening.classList.add("is-closing");
      audio.play().then(() => {
        $("#music-toggle").classList.add("playing");
      }).catch(() => { /* autoplay blocked; user can tap the music icon */ });
      setTimeout(() => {
        opening.style.display = "none";
        navBtn.classList.add("visible");
      }, 850);
    });
  }

  function initMusicToggle() {
    const btn = $("#music-toggle");
    const audio = $("#bg-audio");
    btn.addEventListener("click", () => {
      if (audio.paused) { audio.play().catch(() => {}); btn.classList.add("playing"); }
      else { audio.pause(); btn.classList.remove("playing"); }
    });
  }

  /* ---------------- PARALLAX (hero background) ---------------- */
  function initParallax() {
    const hero = $("#hero");
    if (!hero) return;
    let ticking = false;
    function update() {
      const y = Math.min(60, window.scrollY * 0.12);
      hero.style.setProperty("--parallax-y", `${y}px`);
      ticking = false;
    }
    window.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  }

  /* ---------------- NAV DRAWER ---------------- */
  function initNav() {
    const menuBtn = $("#btn-menu");
    const drawer = $("#nav-drawer");
    const overlay = $("#nav-overlay");
    const closeBtn = $("#nav-close");

    function openNav() {
      drawer.classList.add("open");
      overlay.classList.add("open");
      menuBtn.classList.add("tucked");
      menuBtn.setAttribute("aria-expanded", "true");
    }
    function closeNav() {
      drawer.classList.remove("open");
      overlay.classList.remove("open");
      menuBtn.classList.remove("tucked");
      menuBtn.setAttribute("aria-expanded", "false");
    }

    menuBtn.addEventListener("click", openNav);
    closeBtn.addEventListener("click", closeNav);
    overlay.addEventListener("click", closeNav);

    $$("a[data-nav]").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        closeNav();
        if (target) {
          setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
        }
      });
    });
  }

  /* ---------------- INIT ---------------- */
  async function init() {
    let data;
    try {
      data = await loadData();
    } catch (err) {
      console.error(err);
      document.body.innerHTML = `<p style="padding:40px;font-family:sans-serif;text-align:center;">Undangan tidak dapat dimuat. Pastikan file data/wedding.json tersedia.</p>`;
      return;
    }

    const guest = getGuestName(data.meta.defaultGuestName);

    initFrameBackgrounds(data);
    renderOpening(data, guest.name);
    renderHero(data);
    renderQuote(data);
    renderCouple(data);
    renderEvents(data);
    renderLoveStory(data);
    renderGallery(data);
    renderVideo(data);
    renderLiveStream(data);
    renderGift(data);
    renderClosing(data);
    renderFooterAd(data);
    initCountdown(data.event.dateISO);
    initRSVP(guest.name, guest.isExplicit);
    initOpening(data);
    initMusicToggle();
    initNav();
    initReveal();
    initParallax();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
