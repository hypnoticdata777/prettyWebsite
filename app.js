/* ─── Selectors ────────────────────────────────────────────────────────────── */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ─── Storage keys ─────────────────────────────────────────────────────────── */
const KEYS = { theme: "h777_theme", entries: "h777_entries" };

/* ─── State ────────────────────────────────────────────────────────────────── */
const state = {
  activeStage: "Intake",
  filter: "all",
  projects: [
    {
      title: "TurnFlow™",
      desc: "Turn & maintenance estimate → tasks → proof → receipts. Built for clarity and trust.",
      tags: ["ops", "frontend"],
      updated: "2026-02-05",
      difficulty: "medium"
    },
    {
      title: "RentPulse™",
      desc: "Owner-facing delinquency updates with consistent narrative + next actions.",
      tags: ["ops", "automation"],
      updated: "2026-02-02",
      difficulty: "medium"
    },
    {
      title: "InboxPilot™",
      desc: "Sorts urgent emails, flags risk, and schedules focus blocks.",
      tags: ["automation", "ops"],
      updated: "2026-01-29",
      difficulty: "hard"
    },
    {
      title: "Budget Sage Tracker",
      desc: "Local-first expense tracker with edit/delete + persistence + charts next.",
      tags: ["frontend"],
      updated: "2026-01-31",
      difficulty: "easy"
    },
    {
      title: "Daily War Room Logger",
      desc: "Minimal-friction daily logging tool with timestamps + auto-save.",
      tags: ["frontend", "automation"],
      updated: "2026-02-01",
      difficulty: "easy"
    },
    {
      title: "Ops SOP Index",
      desc: "A searchable SOP shell with UI / State / Rules / Data buckets.",
      tags: ["ops"],
      updated: "2026-02-03",
      difficulty: "easy"
    }
  ],
  entries: []
};

/* ─── Toast ────────────────────────────────────────────────────────────────── */
let toastTimer = null;
function toast(msg) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("is-show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove("is-show");
    el.textContent = "";
  }, 2400);
}

/* ─── Year ─────────────────────────────────────────────────────────────────── */
function initYear() {
  const el = $("#year");
  if (el) el.textContent = new Date().getFullYear();
}

/* ─── Theme ────────────────────────────────────────────────────────────────── */
function updateThemeIcon() {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  const icon = $("#themeIcon");
  if (icon) icon.textContent = isLight ? "☀" : "☾";
}

function initTheme() {
  const saved = localStorage.getItem(KEYS.theme);
  if (saved === "light") document.documentElement.setAttribute("data-theme", "light");
  updateThemeIcon();

  $("#themeBtn")?.addEventListener("click", () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    if (isLight) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem(KEYS.theme, "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem(KEYS.theme, "light");
    }
    updateThemeIcon();
    toast("Theme updated.");
  });
}

/* ─── Smooth scroll ────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  $$(".nav__link, .hero__buttons a").forEach(a => {
    a.addEventListener("click", e => {
      const href = a.getAttribute("href");
      if (!href?.startsWith("#")) return;
      e.preventDefault();
      $(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  $("#ctaBtn")?.addEventListener("click", () => {
    $("#projects")?.scrollIntoView({ behavior: "smooth" });
  });
}

/* ─── Active nav on scroll ─────────────────────────────────────────────────── */
function initActiveNav() {
  const sections = $$("section[id]");
  const links = $$(".nav__link");
  if (!sections.length || !links.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove("is-active"));
        const active = links.find(l => l.getAttribute("href") === "#" + entry.target.id);
        active?.classList.add("is-active");
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => io.observe(s));
}

/* ─── Scroll-reveal ────────────────────────────────────────────────────────── */
function initReveal() {
  const items = $$(".reveal");
  if (!items.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  items.forEach(el => io.observe(el));
}

/* ─── Animated stat counters ───────────────────────────────────────────────── */
function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  const update = now => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function initCounters() {
  const stats = $$(".stat__num[data-count]");
  if (!stats.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count, 10);
        animateCounter(entry.target, target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => io.observe(el));
}

/* ─── Card mouse-tracking glow ─────────────────────────────────────────────── */
function applyGlow(el, e) {
  const r = el.getBoundingClientRect();
  el.style.setProperty("--x", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
  el.style.setProperty("--y", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
}

function initCardGlow() {
  $$(".card").forEach(card => card.addEventListener("mousemove", e => applyGlow(card, e)));

  // Project cards are dynamic — delegate from the grid
  $("#projectGrid")?.addEventListener("mousemove", e => {
    const card = e.target.closest(".project");
    if (card) applyGlow(card, e);
  });
}

/* ─── Projects ─────────────────────────────────────────────────────────────── */
const DIFF_COLORS = { easy: "var(--b)", medium: "var(--c)", hard: "var(--a)" };

function renderProjects() {
  const grid = $("#projectGrid");
  if (!grid) return;
  const active = state.filter;
  const visible = active === "all"
    ? state.projects
    : state.projects.filter(p => p.tags.includes(active));

  if (!visible.length) {
    grid.innerHTML = `<p class="muted" style="grid-column:1/-1;padding:24px 0">No projects match this filter.</p>`;
    return;
  }

  grid.innerHTML = visible.map((p, i) => `
    <article class="project reveal is-visible" style="--i:${i}">
      <div class="project__top">
        <h3 class="project__title">${p.title}</h3>
        <div class="badges">
          ${p.tags.map(t => `<span class="badge">${t}</span>`).join("")}
        </div>
      </div>
      <p class="project__desc">${p.desc}</p>
      <div class="project__meta">
        <span>${p.updated}</span>
        <span style="color:${DIFF_COLORS[p.difficulty] ?? "var(--muted)"}">
          ${p.difficulty}
        </span>
      </div>
    </article>
  `).join("");
}

function initFilters() {
  $$(".filter").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".filter").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      state.filter = btn.dataset.filter;
      renderProjects();
    });
  });
}

/* ─── System Pulse nodes ───────────────────────────────────────────────────── */
const STAGE_MESSAGES = {
  Intake:   "New ticket received. Routing now...",
  Triage:   "Assessing urgency + impact.",
  Assign:   "Owner identified. Handoff complete.",
  Execute:  "Work in progress. Clock is ticking.",
  Verify:   "Checking quality before close.",
  Close:    "Done. Receipt filed. System clear."
};

function setActiveNode(name) {
  state.activeStage = name;
  $$(".node").forEach(n => n.classList.toggle("is-active", n.dataset.node === name));
  const display = $("#activeStage");
  if (display) display.textContent = name;
  toast(STAGE_MESSAGES[name] ?? name);
}

function initNodes() {
  $$(".node").forEach(btn => {
    btn.addEventListener("click", () => setActiveNode(btn.dataset.node));
  });
  setActiveNode("Intake");
}

/* ─── Command Log ──────────────────────────────────────────────────────────── */
function loadEntries() {
  try {
    state.entries = JSON.parse(localStorage.getItem(KEYS.entries) || "[]");
  } catch {
    state.entries = [];
  }
}

function saveEntries() {
  localStorage.setItem(KEYS.entries, JSON.stringify(state.entries));
}

function renderEntries() {
  const container = $("#entries");
  const countEl = $("#entryCount");
  if (!container) return;

  if (countEl) countEl.textContent = `${state.entries.length} entr${state.entries.length === 1 ? "y" : "ies"}`;

  if (!state.entries.length) {
    container.innerHTML = `<p class="muted" style="font-size:13px">No entries yet. Fill the form and save.</p>`;
    return;
  }

  container.innerHTML = state.entries.slice().reverse().map(e => `
    <div class="entry">
      <div class="entry__top">
        <span>#${e.id}</span>
        <span>${e.ts}</span>
      </div>
      <div class="entry__grid">
        ${e.priority ? `<div class="kv"><b>Priority</b><span>${e.priority}</span></div>` : ""}
        ${e.challenge ? `<div class="kv"><b>Challenge</b><span>${e.challenge}</span></div>` : ""}
        ${e.insight ? `<div class="kv"><b>Insight</b><span>${e.insight}</span></div>` : ""}
        ${e.served ? `<div class="kv"><b>Served</b><span>${e.served}</span></div>` : ""}
      </div>
    </div>
  `).join("");
}

function initLog() {
  loadEntries();
  renderEntries();

  $("#logForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const entry = {
      id: Date.now(),
      ts: new Date().toLocaleString(),
      priority: $("#priority").value.trim(),
      challenge: $("#challenge").value.trim(),
      insight: $("#insight").value.trim(),
      served: $("#served").value.trim()
    };
    if (!entry.priority && !entry.challenge && !entry.insight && !entry.served) {
      toast("Fill in at least one field.");
      return;
    }
    state.entries.push(entry);
    saveEntries();
    renderEntries();
    e.target.reset();
    toast("Entry saved.");
  });

  $("#exportBtn")?.addEventListener("click", () => {
    if (!state.entries.length) { toast("Nothing to export yet."); return; }
    const blob = new Blob([JSON.stringify(state.entries, null, 2)], { type: "application/json" });
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: `h777-log-${Date.now()}.json`
    });
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Exported JSON.");
  });

  $("#clearBtn")?.addEventListener("click", () => {
    if (!state.entries.length) { toast("Nothing to clear."); return; }
    const confirmed = confirm(`Delete all ${state.entries.length} entries? This cannot be undone.`);
    if (!confirmed) return;
    state.entries = [];
    saveEntries();
    renderEntries();
    toast("Log cleared.");
  });
}

/* ─── Contact placeholder ──────────────────────────────────────────────────── */
function initContact() {
  $("#fakeSubmit")?.addEventListener("click", () => {
    const email = $("#email")?.value.trim();
    if (!email) { toast("Enter an email first."); return; }
    toast(`Got it — we'll reach out to ${email} soon.`);
    if ($("#email")) $("#email").value = "";
  });
}

/* ─── Boot ─────────────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initTheme();
  initSmoothScroll();
  initActiveNav();
  initReveal();
  initCounters();
  initCardGlow();
  renderProjects();
  initFilters();
  initNodes();
  initLog();
  initContact();
});
