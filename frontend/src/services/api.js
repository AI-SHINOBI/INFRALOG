const BASE = "http://localhost:8000/api";

export const API = {
  dashboard: () => fetch(`${BASE}/dashboard/`).then(r => r.json()),

  projects: () => fetch(`${BASE}/projects/`).then(r => r.json()),

  createProject: (name) =>
    fetch(`${BASE}/projects/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }),

  deleteProject: (id) =>
    fetch(`${BASE}/projects/${id}/delete/`, {
      method: "DELETE",
    }),

  projectDetail: (id) =>
    fetch(`${BASE}/projects/${id}/`).then(r => r.json()),

  logs: (id) =>
    fetch(`${BASE}/projects/${id}/logs/`).then(r => r.json()),

  createLog: (id, log) =>
    fetch(`${BASE}/projects/${id}/logs/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(log),
    }),
};