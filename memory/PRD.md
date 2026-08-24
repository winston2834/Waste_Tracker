# LeftoverLab — PRD

## Original Problem Statement
Food waste tracking platform for a college campus. Tracks waste from the campus Mess and 6 cafeteria shops (Amul Shop, Campus Zaiqa, Nescafe, Hungrys, Friend's Juice Corner, Snacks Point). Daily data entry by staff, visual analytics, anonymous student feedback. Warm, food-themed design (oranges/ambers/cream), playful and student-friendly. User chose: frontend-only with mock data structured for later backend wiring, mock login UI only, Recharts, no extras, "human-made not AI-made" aesthetic.

## Architecture
- Frontend-only React SPA (react-router-dom v7), Tailwind + custom warm palette, Nunito/DM Sans fonts
- Mock data layer: `src/services/api.js` — seeded 30-day deterministic data in localStorage; single swap-point for a real backend later
- Mock auth: `src/services/auth.js` — localStorage session, hardcoded role accounts (credentials in `/app/memory/test_credentials.md`)
- Recharts for bar/trend charts; sonner toasts; lucide-react icons
- Backend (FastAPI) untouched — not used by this app

## User Personas
- Student (anonymous, no login): browses dashboards, submits star ratings/comments
- Mess Incharge: logs meal waste, views mess analytics + private student reports panel
- Cafeteria Owner (per-shop): logs own shop's waste, views own dashboard
- Admin: full overview, all outlets' charts, all reports table with filters

## Core Requirements (static)
- Landing with Mess/Cafeteria cards + floating Report/Rate Food FAB on all main pages
- 6 shop cards → per-shop dashboard (7/30-day bar toggle, 30-day trend, date-based item breakdown)
- Mess dashboard: meal filter (Breakfast/Lunch/Dinner), Sunday → Brunch+Dinner swap, day/week bar toggle, trend, item breakdown
- Waste entry form: custom item + kg rows, "+ Add another item", meal picker for mess
- Anonymous feedback: mess/shop target, meal picker, 1–5 stars, optional comment, confirmation
- Admin: stat cards, per-outlet bar chart, mess-vs-cafeterias trend, drill-in links, filterable reports table

## Implemented (June 2026)
- All pages, flows, charts, mock auth, seeded data, loading/empty states — full scope above
- E2E tested via testing agent: 14 flow groups, 100% pass (iteration_1)

## Backlog
- P0 (when user asks): real backend (FastAPI + MongoDB) — wire services/api.js + auth.js to /api endpoints; real JWT auth with admin-created accounts
- P1: CSV export of waste data; per-shop student ratings visible to owners; date-range picker for trends
- P2: PWA/offline support, weekly email digests, waste-reduction goals/badges

## Known Notes
- Seeded window fixed at first load; crossing a day boundary needs re-seed (acceptable for mock)
- Data cached at module level; multi-tab sync not supported (mock-only concern)

## Next Tasks
- Await user review; likely next step is real backend + real auth
