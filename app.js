/* ─── Selectors ────────────────────────────────────────────────────────────── */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ─── Storage keys ─────────────────────────────────────────────────────────── */
const KEYS = { theme: "h777_theme", entries: "h777_entries", filter: "h777_filter" };

/* ─── Timing constants ──────────────────────────────────────────────────────── */
const TIMING = {
  TOAST_BASE:     1800,   // minimum toast display time (ms)
  TOAST_PER_CHAR:   35,   // additional ms per character of message
  TOAST_MAX:      4000,   // maximum toast display time (ms)
  COUNTER_ANIM:   1200,   // stat counter animation duration (ms)
};

/* ─── State ────────────────────────────────────────────────────────────────── */
const state = {
  activeStage: "Intake",
  filter: localStorage.getItem(KEYS.filter) || "all",
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
  // Duration scales with message length so longer messages stay visible longer
  const duration = Math.min(
    TIMING.TOAST_BASE + msg.length * TIMING.TOAST_PER_CHAR,
    TIMING.TOAST_MAX
  );
  toastTimer = setTimeout(() => {
    el.classList.remove("is-show");
    el.textContent = "";
  }, duration);
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
  if (saved) {
    if (saved === "light") document.documentElement.setAttribute("data-theme", "light");
  } else if (window.matchMedia?.("(prefers-color-scheme: light)").matches) {
    // Respect system preference on first visit (no saved preference yet)
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem(KEYS.theme, "light");
  }
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
function animateCounter(el, target, duration = TIMING.COUNTER_ANIM) {
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

function buildProjectCard(p, i) {
  const article = document.createElement("article");
  article.className = "project reveal is-visible";
  article.style.setProperty("--i", i);

  const top = document.createElement("div");
  top.className = "project__top";

  const title = document.createElement("h3");
  title.className = "project__title";
  title.textContent = p.title;

  const badges = document.createElement("div");
  badges.className = "badges";
  p.tags.forEach(t => {
    const span = document.createElement("span");
    span.className = "badge";
    span.textContent = t;
    badges.appendChild(span);
  });

  top.appendChild(title);
  top.appendChild(badges);

  const desc = document.createElement("p");
  desc.className = "project__desc";
  desc.textContent = p.desc;

  const meta = document.createElement("div");
  meta.className = "project__meta";

  const dateSpan = document.createElement("span");
  dateSpan.textContent = p.updated;

  const diffSpan = document.createElement("span");
  diffSpan.textContent = p.difficulty;
  diffSpan.style.color = DIFF_COLORS[p.difficulty] ?? "var(--muted)";

  meta.appendChild(dateSpan);
  meta.appendChild(diffSpan);

  article.appendChild(top);
  article.appendChild(desc);
  article.appendChild(meta);

  return article;
}

function renderProjects() {
  const grid = $("#projectGrid");
  if (!grid) return;

  grid.textContent = "";

  const active = state.filter;
  const visible = active === "all"
    ? state.projects
    : state.projects.filter(p => p.tags.includes(active));

  if (!visible.length) {
    const p = document.createElement("p");
    p.className = "muted";
    p.style.cssText = "grid-column:1/-1;padding:24px 0";
    p.textContent = "No projects match this filter.";
    grid.appendChild(p);
    return;
  }

  visible.forEach((p, i) => grid.appendChild(buildProjectCard(p, i)));
}

function initFilters() {
  // Apply saved filter state to button UI
  $$(".filter").forEach(btn => {
    if (btn.dataset.filter === state.filter) {
      $$(".filter").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
    }

    btn.addEventListener("click", () => {
      $$(".filter").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      state.filter = btn.dataset.filter;
      localStorage.setItem(KEYS.filter, state.filter);
      renderProjects();
    });
  });
}

/* ─── System Pulse nodes ───────────────────────────────────────────────────── */
const STAGE_MESSAGES = {
  Intake:  "New ticket received. Routing now...",
  Triage:  "Assessing urgency + impact.",
  Assign:  "Owner identified. Handoff complete.",
  Execute: "Work in progress. Clock is ticking.",
  Verify:  "Checking quality before close.",
  Close:   "Done. Receipt filed. System clear."
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
function genId() {
  // Combines timestamp + random suffix to avoid same-millisecond collisions
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

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

function buildEntryEl(e) {
  const entry = document.createElement("div");
  entry.className = "entry";

  const top = document.createElement("div");
  top.className = "entry__top";

  const idSpan = document.createElement("span");
  idSpan.textContent = `#${e.id}`;

  const tsSpan = document.createElement("span");
  tsSpan.textContent = e.ts;

  top.appendChild(idSpan);
  top.appendChild(tsSpan);

  const grid = document.createElement("div");
  grid.className = "entry__grid";

  [
    { key: "priority",  label: "Priority"  },
    { key: "challenge", label: "Challenge" },
    { key: "insight",   label: "Insight"   },
    { key: "served",    label: "Served"    }
  ].forEach(({ key, label }) => {
    if (!e[key]) return;
    const kv = document.createElement("div");
    kv.className = "kv";
    const b = document.createElement("b");
    b.textContent = label;
    const span = document.createElement("span");
    span.textContent = e[key];
    kv.appendChild(b);
    kv.appendChild(span);
    grid.appendChild(kv);
  });

  entry.appendChild(top);
  entry.appendChild(grid);
  return entry;
}

function renderEntries() {
  const container = $("#entries");
  const countEl = $("#entryCount");
  if (!container) return;

  if (countEl) countEl.textContent = `${state.entries.length} entr${state.entries.length === 1 ? "y" : "ies"}`;

  container.textContent = "";

  if (!state.entries.length) {
    const p = document.createElement("p");
    p.className = "muted";
    p.style.fontSize = "13px";
    p.textContent = "No entries yet. Fill the form and save.";
    container.appendChild(p);
    return;
  }

  state.entries.slice().reverse().forEach(e => container.appendChild(buildEntryEl(e)));
}

function initLog() {
  loadEntries();
  renderEntries();

  $("#logForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const entry = {
      id:        genId(),
      ts:        new Date().toLocaleString(),
      priority:  $("#priority").value.trim(),
      challenge: $("#challenge").value.trim(),
      insight:   $("#insight").value.trim(),
      served:    $("#served").value.trim()
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
