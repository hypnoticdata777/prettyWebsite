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
        }
      ]
    };