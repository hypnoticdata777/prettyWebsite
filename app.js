const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const STORAGE_KEYS = {
  theme: "h777_theme",
  entries: "h777_entries"
};

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
desc: "A searchable SOP shell with “UI / State / Rules / Data” buckets.",
tags: ["ops"],
updated: "2026-02-03",
difficulty: "easy"
}
],
entries: []
};