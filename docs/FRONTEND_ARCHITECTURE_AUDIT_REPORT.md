# HMS FRONTEND ARCHITECTURE AUDIT — ENTERPRISE PRODUCTION READINESS REVIEW

> **Project:** Hospital Management System (HMS) — React Frontend  
> **Stack:** React 19.2 · TypeScript 6 · Vite 8 · TailwindCSS 4 · TanStack React Query 5 · React Router 8 · lucide-react · Recharts  
> **Auditor Role:** Principal Frontend Architect / Staff Engineer / Security & Performance Reviewer (20+ yrs, hospital / banking / fintech / ERP / SaaS)  
> **Date:** 2026-08-27  
> **Scope:** Entire `src/` — 450 source files, ~165k LOC, 19 feature domains, layout / routing / permissions / API / store / lib layers  
> **Build inspected:** `vite build` → `dist/index-Bj4-BLJp.js` 3.7 MB (740 kB gzip), `dist/index-QOKJg1Ly.css` 109 kB  
> **Review standard:** Google / Microsoft / Amazon / Stripe / Atlassian Staff-Review bar for a hospital system that will carry 500+ staff, multi-tenant, RBAC, thousands of concurrent users, protected health data

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Architecture Scorecard](#2-architecture-scorecard)
3. [Folder Structure Score & Review (Phase 1)](#3-folder-structure-review--phase-1)
4. [Architecture Review (Phase 2) — SOLID, DDD, Dependency Direction](#4-architecture-review--phase-2)
5. [Code Quality (Phase 3)](#5-code-quality--phase-3)
6. [React Review (Phase 4)](#6-react-review--phase-4)
7. [State Management (Phase 5)](#7-state-management--phase-5)
8. [API Layer (Phase 6)](#8-api-layer--phase-6)
9. [Security Review (Phase 7)](#9-security-review--phase-7)
10. [Performance Review (Phase 8)](#10-performance-review--phase-8)
11. [Accessibility (Phase 9)](#11-accessibility--phase-9)
12. [UI Design System (Phase 10)](#12-ui-design-system--phase-10)
13. [Testability (Phase 11)](#13-testability--phase-11)
14. [Enterprise Readiness (Phase 12)](#14-enterprise-readiness--phase-12)
15. [Technical Debt — P0/P1/P2/P3](#15-technical-debt--p0p1p2p3)
16. [Architecture Improvements](#16-architecture-improvements)
17. [Folder Structure Improvements](#17-folder-structure-improvements)
18. [State Management Improvements](#18-state-management-improvements)
19. [API Improvements](#19-api-improvements)
20. [UI Improvements](#20-ui-improvements)
21. [Security Improvements](#21-security-improvements)
22. [Performance Improvements](#22-performance-improvements)
23. [Testing Improvements](#23-testing-improvements)
24. [Refactoring Roadmap](#24-refactoring-roadmap)
25. [Migration Plan](#25-migration-plan)
26. [Engineering Best Practices Missing](#26-engineering-best-practices-missing)
27. [Final Verdict — FAANG/Enterprise Bar](#27-final-verdict--faangenterprise-bar)
28. [Timed Action Plan](#28-timed-action-plan)
29. [Appendix — Evidence Index](#29-appendix--evidence-index)

---

## 1. EXECUTIVE SUMMARY

### Verdict in one sentence

**Not production-ready for enterprise hospital deployment in its current form.** The codebase is a functional, feature-rich prototype that ships real workflows (appointments, OPD/consultation, billing, patient portal with family switching, dashboards for seven roles) and already fixes the worst auth sin (token-in-localStorage), but it fails the Staff Review bar on bundle architecture, test coverage, design-system governance, large-component decomposition, env-driven configuration, and error/accessibility discipline. With a disciplined 4–6 week remediation it can reach enterprise ship-readiness.

### What is genuinely good (earn your praise)

- **Real feature breadth, shipped end-to-end.** 19 feature domains (`appointments`, `auth`, `billing`, `dashboard`×7 roles, `doctors`, `encounters`, `notification`, `opd`, `patients`, `prescriptions`, `reception`, `reports`, `settings`×5 subdomains, `users`, `vitals`, `auditlog`) with matching `api / components / hooks / pages / services / types / constants / permissions` structure — not a skeleton.
- **Auth token storage was fixed correctly.** `src/lib/cookie-token-storage.ts:1` with `SameSite=Strict` + conditional `Secure` is the right pattern; `src/lib/axios.ts:51` implements 401 queue + refresh-token rotation (RTR) + `failedQueue` replay and clears both cookie and `hms-auth-storage:v1`/`hms-user:v1` on failure. This single decision removes the #1 healthcare XSS exfiltration vector.
- **Permission model is thoughtful.** `src/permissions/permissions.constants.ts:1` (760 lines) models `ROLE_PERMISSIONS` per role + `LEGACY_PERMISSION_MAP`; `src/permissions/usePermissions.ts:13` + `src/permissions/guards.tsx:18` provide `can()` / `RouteGuard` semantics. Despite flaws (see §9), the shape is closer to enterprise RBAC than the typical hard-coded `if (role === 'ADMIN')`.
- **Patient portal family switching is well-considered** as a domain concept: `src/features/patients/context/PatientPortalContext.tsx:1` + `src/components/layout/Header.tsx:77` + `src/app/routes/routeConfig.tsx:33` coordinate `hms-active-patient-mrn:v1` + `PatientPortalProvider` + `FamilyMembersManagement`. For a hospital product, this is a real differentiator and is implemented coherently.
- **Build is green.** `tsc -b && vite build` passes in 1.35s, 2872 modules, `eslint --cache` is integrated, `prettier 3.9.6` present.

### What blocks enterprise approval

| # | Blocker | Severity | Where |
|---|---------|----------|-------|
| 1 | **Monolithic bundle — 3.7 MB / 740 kB gzip, zero code-splitting** — no `React.lazy`, no route chunking. Every role downloads every dashboard, every report, every settings subdomain. | P0 | `src/main.tsx:8`, `src/app/routes/routeConfig.tsx:160`, `vite.config.ts:8` |
| 2 | **Zero test coverage** — no unit, integration, or E2E harness; no `vitest`/`jest`/`playwright` dependency, no `*.test.*` under `src/` | P0 | `package.json:12`, §13 |
| 3 | **Hard-coded `API_BASE_URL = "http://192.168.1.44:8888"`** with `VITE_API_BASE_URL` commented out; LAN IP leaks into source, prod build is non-portable, no env validation | P0 | `src/lib/axios.ts:3`, `vite.config.ts:13` |
| 4 | **Auth store still mirrors tokens + user into `localStorage`** (`hms-auth-storage:v1`, `hms-user:v1`) alongside cookies + falls back to reading it — re-exposes the vector the cookie layer was meant to close | P0 | `src/features/auth/store/auth.store.ts:71`, `src/lib/axios.ts:57` |
| 5 | **Permission escalation by design** — `DOCTOR` returns `true` for every `can()` call; `SUPER_ADMIN`/`HOSPITAL_ADMIN`/`ADMIN` return `true` for every permission except `CONSULTATION_START` (`src/permissions/usePermissions.ts:19`). Fine-grained RBAC is dead code. | P0 | `src/permissions/usePermissions.ts:19` |
| 6 | **Medical-grade error/Audit gaps** — `console.error`/`console.warn` leaks internal messages to the user-visible console in prod; no error boundary; no sanitized user-facing error contract | P1 | §5, §6, §9 |
| 7 | **Large-component debt** — 10+ files >1500 LOC (`DepartmentsSpecialtiesWorkspace 2690`, `ReportsOverview 2506`, `DoctorProfileScreen 2475`, `KpiDetail 2415`, `VitalsManagementScreen 2237`, `CreateInvoiceWorkspacePage 2095`). Will collapse under 10+ concurrent developers. | P1 | §5 |

### Bottom line for leadership

You have a **strong functional foundation** and a team that understands the domain. You do **not** have an enterprise-frontend system yet. The distance is not "rewrite" — it is **architecture hardening**: env/config, code-splitting, design-system extraction, permission enforcement, test scaffolding, and decomposition of the 10 fattest pages. Budget 4–6 weeks with 2 senior frontend engineers and you can credibly pass a CTO-level production review.

---

## 2. ARCHITECTURE SCORECARD

| Category | Score /10 | Grade | One-line justification |
|----------|-----------|-------|------------------------|
| **Architecture** | **5.5** | C+ | Feature-sliced layout + clean routing helpers; but no app-shell boundaries, no DI, no code-splitting, mixed concerns in fat pages |
| **Folder Structure** | **6.5** | B− | Consistent `api/components/hooks/pages/services/types` per feature; `common`/`lib`/`permissions`/`app/routes` exist — but `common` is nearly empty and cross-feature imports leak freely |
| **Component Design** | **5.0** | C | Good composition inside drawers/modals; but 10+ god-components, duplicated Avatar/StatusBadge/Chip implementations per feature, no shared UI kit |
| **React** | **5.5** | C+ | Hooks-heavy, mostly correct deps; some missing-dep warnings; zero `memo`/`useMemo` discipline for heavy tables; no ErrorBoundary/Suspense |
| **TypeScript** | **5.0** | C | Strict-ish flags (`noEmit`, `verbatimModuleSyntax`); but 595 `Record<string,unknown>` + 204 `as unknown`/`as any` + pervasive `any` in `encounters.api.ts:333`; weak DTO layer |
| **Performance** | **3.5** | D+ | No code-splitting, no virtualization, 11k hard-coded colors defeat caching, `recharts-lazy.tsx` is not lazy — 3.7 MB bundle blocks hospital networks |
| **Security** | **5.5** | C+ | Cookie + RTR is strong; immediately undermined by localStorage mirror + permission bypass + localStorage status overrides + console leakage |
| **Accessibility** | **4.5** | C− | Forms have labels via `TextField`; some `aria-label`s, but no focus management, no keyboard nav for drawers, no contrast audit, no screen-reader testing |
| **Maintainability** | **4.5** | C− | Fat files, magic strings/colors/routes/roles, duplicated API error blocks, duplicated mappers — high cost of change |
| **Scalability** | **4.0** | D+ | Will not survive 25–50 devs without code-ownership boundaries, token, or splitting |
| **Enterprise Readiness** | **4.0** | D+ | RBAC shape exists but is bypassed; no multi-tenant plumbing; no feature flags; no observability; no i18n; no env governance |
| **Developer Experience** | **5.5** | C+ | Vite HMR is fast, TS build passes, lint cache ok; but no tests, no Storybook, no path aliases, no `tsconfig` paths |
| **Testing Readiness** | **1.5** | F | Zero harness, zero tests, zero mocks, no DI — untestable at the edges |

| **Overall** | **60 / 130 → 46 / 100** | **D+ — Prototype with strong domain work; not enterprise-shippable** |
|-------------|-------------------------|------------------------------------------------------------------------|
| **Production Readiness** | **42%** | Gate: <50% = do not ship to hospital production |

> Scoring rubric: 9–10 = FAANG exemplar; 7–8 = enterprise-shippable with minor notes; 5–6 = needs sprint work; 3–4 = structural debt; 1–2 = missing capability.

---

## 3. FOLDER STRUCTURE REVIEW — PHASE 1

### What the tree actually is

```
src/
  app/routes/        ← routeConfig, AppRouter, Protected/PublicRoute, per-feature route groups
  assets/
  common/components/ ← Avatar, Pagination, UserAvatar, recharts-lazy (misnamed)
  components/layout/ ← HMSAppShell, Header, NavRail (+ CustomDatePicker, TimeSelect at top level)
  constants/         ← navigation.ts (ROLE_NAV_GROUPS, ROLE_LABEL)
  features/
    appointments|auditlog|auth|billing|dashboard|doctors|encounters|
    notification|opd|patients|prescriptions|reception|reports|settings|users|vitals
      api/ components/ constants/ hooks/ pages/ services/ types/ (permissions|utils|context|styles)
  lib/               ← axios (fetch wrapper), cookie-token-storage, time/intl/status/image utils
  permissions/       ← guards.tsx, permissions.constants.ts, types.ts, usePermissions.ts
  types/             ← app.types.ts
  utils/             ← appointmentPdf, consultationPdf
```

### Strengths

- **Feature-sliced posture is correct.** Every domain follows `api / components / hooks / pages / services / types` — see `src/features/auth/*`, `src/features/billing/*`, `src/features/patients/*`. This is the right start for DDD/Feature-First (`HMS1/src/features/...`).
- **Routing is decoupled from feature internals.** `src/app/routes/routeConfig.tsx:160` composes `PublicAuthRoutes()`, `PatientRoutes()`, `DoctorRoutes()`, `AppointmentRoutes()`, `BillingRoutes()`, `AdministrationRoutes()` behind a shared `<HMSAppShell>` — clean top-level orchestration.
- **Shared concerns have dedicated homes:** `lib/` for cross-cutting utils, `permissions/` for RBAC, `constants/navigation.ts` for nav config, `common/components/` for shared UI. Intent is sound.

### Findings (with file evidence)

| Severity | Finding | Evidence | Why it hurts at scale |
|----------|---------|----------|-----------------------|
| **P1** | **`common/` is a stub, not a system.** Only 4 files (`Avatar.tsx`, `Pagination.tsx`, `UserAvatar.tsx`, `recharts-lazy.tsx:1` which re-exports directly). Meanwhile every feature re-implements its own `Avatar.tsx`, `StatusBadge.tsx`, `Chip.tsx`, `Pagination.tsx`, `KpiCards.tsx`, `BillingHeader.tsx`, etc. | `src/features/appointments/components/Avatar.tsx`, `src/features/patients/components/Avatar.tsx`, `src/features/opd/components/Avatar.tsx`, `src/common/components/Avatar.tsx` — 4 separate avatars | Design divergence, 4× bug surface, blocks 25-dev ownership |
| **P1** | **Top-level `components/` vs `common/components/` vs `features/*/components/` — no ownership rule.** `CustomDatePicker`, `TimeSelect` live in `src/components/` while `Pagination` lives in `common/` and `AppointmentDatePickerFilter` lives in `features/appointments/components/`. | `src/components/CustomDatePicker.tsx` vs `src/common/components/Pagination.tsx` | Onboarding cost; import graph becomes `../../../../../` spaghetti |
| **P1** | **Wrong abstractions: `recharts-lazy.tsx` is not lazy.** File just re-exports from `recharts` synchronously — name lies, bundle pays the cost unconditionally. | `src/common/components/recharts-lazy.tsx:1` | Misleading contract; blocks genuine `React.lazy(() => import('recharts'))` optimization |
| **P2** | **Feature leakage via cross-feature imports without a contract.** `PatientPortalContext` is imported inside `HMSAppShell`, `Header`, `DashboardDispatcher`, `routeConfig`, many pages. No barrel discipline, no `import/no-restricted-paths`. | `src/components/layout/HMSAppShell.tsx:11`, `src/features/dashboard/pages/PatientDashboard.tsx` etc. | Circular-dependency risk grows with team size; DDD boundary erodes |
| **P2** | **Missing canonical folders for enterprise hygiene:** `src/config/`, `src/hooks/` (shared), `src/styles/tokens/`, `src/api/` (shared client/types), `src/test/`, `src/mocks/`, `src/lib/query/`, `src/lib/error/` | `src/` listing §1 | Signals absent governance — DX and test scaffolding have nowhere to live |
| **P2** | **Inconsistent export style.** Some features re-export via `index.ts` barrels (`features/appointments/index.ts`, `features/auth/index.ts`), others don't. Mixed `export default` pages (`LoginPage.tsx:226`, `DashboardHeader.tsx:40`) vs named exports. | `src/features/appointments/index.ts:1` vs `src/features/patients/pages/*` | Import inconsistency; tree-shaking and auto-import DX suffer |
| **P3** | **No `tsconfig` path aliases.** All imports are deep relative (`../../../lib/axios`); no `@/lib/axios`, `@/features/auth/*`. | `tsconfig.app.json:1` (no `paths`) | Drag on velocity; refactor risk |

**Folder Structure Score: 6.5/10 — Directionally correct, operationally half-built.**

---

## 4. ARCHITECTURE REVIEW — PHASE 2

### 4.1 Component Architecture

- **App shell is coherent:** `HMSAppShell.tsx:236` → `Header.tsx:430` + `NavRail.tsx:34` + `<Outlet/>` is the right top-level split. Role→nav mapping via `constants/navigation.ts:34` (`ROLE_NAV_GROUPS`) is clean.
- **Composition is used where it exists:** Drawers (`AppointmentDetailsDrawer.tsx:1`, `EditAppointmentDrawer.tsx:1`, `BookAppointmentDrawer.tsx`), dialogs (`CancelAppointmentConfirmationDialog.tsx:1`, `Reschedule…:133`), tabs (`doctors/components/tabs/*`) show reasonable component factoring.
- **But 10 pages are god-components** (see §5): `DepartmentsSpecialtiesWorkspace 2690 LOC`, `ReportsOverview 2506`, `DoctorProfileScreen 2475`, `KpiDetail 2415`, `CreateInvoiceWorkspacePage 2095` each violate SRP and make code review impossible. Logic, layout, API calls, and styling live in one file.

### 4.2 State Architecture

- **Auth state is external-store pattern** (`useSyncExternalStore` in `src/features/auth/store/auth.store.ts:1`), not Zustand despite the prompt assumption — `package.json:12` has **no `zustand`, no `axios`**; `grep zustand` returns zero hits. The API contract is called `apiClient`/`axios` but is a **`fetch` wrapper** (`src/lib/axios.ts:51`) with an `axios.isAxiosError` shim (`src/lib/axios.ts:346`). This naming lie alone would fail a Stripe/Google review.
- **Server state is split:** ~50% of reads go through `@tanstack/react-query` (`useQuery` in `dashboard/hooks/*`, `patients/hooks/*`), the other 50% bypasses it with `useState+useEffect+apiClient` (e.g., `DoctorManagementPage.tsx:118`, `BookAppointmentScreen.tsx:143`). No consistency rule → duplicate fetching logic.
- **Three bespoke external stores** (`auth.store.ts:64`, `consultationStore.ts:45`, `prescription.store.ts:34`) hand-roll `listeners:Set<() => void>` + `notify()` instead of using Zustand v5 or Redux Toolkit semantics. They lack middleware, devtools, persistence contracts, and selector memoization — bugs are latent.

### 4.3 SOLID / Principles

| Principle | Grade | Evidence |
|-----------|-------|----------|
| **SRP** | D | `CreateInvoiceWorkspacePage.tsx:254` holds `useReducer` for form + 5 `useState` for payment + success modal + validation + workspace bootstrap — single file owns form state, payment orchestration, PDF, and routing. Same for `DoctorProfileScreen.tsx:447` |
| **OCP** | C− | Adding a role or report means editing giant switch tables (`DashboardDispatcher.tsx:20`, `HMSAppShell.tsx:112`, `constants/navigation.ts:34`) — closed for extension |
| **DIP** | D | No dependency inversion: pages import `apiClient`/`patientsApi`/`billingService` directly; no repository interface, no injection, no mock seam |
| **DRY** | D | 595 `Record<string,unknown>` + pervasive duplicated `if (axios.isAxiosError(e)) { const resData = e.response?.data ... throw new Error(resData.message)}` blocks in every `*.api.ts` (~120 duplications) |
| **KISS** | C | Auth and portal context are more complex than necessary; localStorage fallback/bit-mapping logic is tangled |
| **YAGNI** | C | Over-engineered status union in `status-utils.ts:10` (20+ status strings) vs under-engineered env/config — misallocated complexity |
| **Separation of Concerns** | D+ | Business logic lives in components (`RegisterPatientScreen.tsx` builds blood-group/marital/relationship enums inline); no `useCase`/`service` boundary |

### 4.4 Dependency Direction

Designed: `pages → hooks → services → api → lib`.  
Actual: `pages → api` directly (`PatientListPage.tsx` → `patientsApi`), `services → store → lib → localStorage`, `Header → usePatientPortal → localStorage → patientsApi` — circular-ish, and the deepest leaf (`lib/axios.ts:57`) reaches back up to `localStorage` + `window.location`. No `eslint import/no-cycle` or `boundaries` rule to enforce direction.

### 4.5 Data Flow

React Query clients are created naked in `src/main.tsx:8` (`new QueryClient()` with zero defaults: no `retry`, `staleTime`, `gcTime`, `refetchOnWindowFocus`, `suspense` contract). OPD/consultation flow uses both React Query **and** bespoke external stores simultaneously — inconsistent cache identity → stale UI after mutations.

**Architecture Score: 5.5/10 — Sound shell, unsound interiors. Requires decomposition + DI + consistent server-state story before 25 devs can safely contribute.**

---

## 5. CODE QUALITY — PHASE 3

### 5.1 Duplicated Logic (the largest debt)

- **API error translation duplicated ~120 times.** Every `*.api.ts` repeats:
  ```ts
  if (axios.isAxiosError(error)) {
    const resData = error.response?.data as { message?: string }|undefined;
    if (resData?.message) throw new Error(resData.message, {cause:error});
  }
  throw error;
  ```
  See `patients.api.ts:77`, `auth.api.ts:32`, `doctors.api.ts:291`, `reception.api.ts:139`, `billing.api.ts`, `offers.api.ts`, `vitals.api.ts`, etc. Belongs in one `lib/api-error.ts`.

- **Avatars / Badges / Chips duplicated per feature.** Grep shows 4 `Avatar.tsx`, 5+ `StatusBadge.tsx`/`Badge` variants, 3 `Chip.tsx` variants — no unified `<Avatar>` or `<Badge>` token. (`common/components/Avatar.tsx` exists but is not adopted.)

- **Loading/disabled/toast/button logic duplicated.** `Loader2 animate-spin` + `disabled:opacity-70` + `isLoading` flags appear in 40+ screens without a `<Button>`/`<Spinner>` primitive.

### 5.2 Large Components / Long Functions

Top offenders (already cited):

| File | LOC | Symptom |
|------|-----|---------|
| `DepartmentsSpecialtiesWorkspace.tsx` | **2690** | Workspace + CRUD + tabs + modals + inline queries |
| `ReportsOverview.tsx` | 2506 | Multi-role KPIs + charts + filters in one render fn |
| `DoctorProfileScreen.tsx` | 2475 | Profile + status overrides + localStorage sync + 5 tab bodies |
| `KpiDetail.tsx` | 2415 | KPI detail + mock data + branching per role |
| `CreateInvoiceWorkspacePage.tsx` | 2095 | `useReducer` + 9 `useState` + payment math + print/PDF in one component |
| `GeneralSettingsContent.tsx` | 2058 | Settings monolith |
| `ConsultationDetailsScreen.tsx` | 1831 | Workspace fetch + vitals + diagnoses + Rx debug logs inline |

Each should be ≤300 LOC per component, with subcomponents extracted to `components/sections/` or `features/<domain>/components/sections/`.

### 5.3 Magic Values

- **11,207 hard-coded hex colors** (`grep "#[0-9A-Fa-f]" → 11207`). `bg-[#0D47A1]` is repeated 400+ times; `#E5E7EB`, `#64748B`, `#F1F5F9` are tokens in practice but not in code. No Tailwind theme token, no `src/styles/tokens/colors.ts`.
- **Hard-coded routes** sprinkled outside `ROUTES` (`"/patients/:mrn"` literal in `PatientRoutes.tsx`, billing prefixes as string literals in `HMSAppShell.tsx:71`, fallback redirects hard-coded).
- **Hard-coded roles/permissions** outside constants (`"PATIENT"`, `"DOCTOR"` string comparisons in `routeConfig.tsx:28`, `DashboardDispatcher.tsx:19`, `PatientPortalContext.tsx:175`, etc.).
- **Hard-coded magic strings for status/medical values:** blood groups, marital statuses, relationships are array literals inside `RegisterPatientScreen.tsx:35` rather than shared `constants/medical.constants.ts`.

### 5.4 Dead / Unused Code (lint proves it)

`eslint` already flags:

- `constants/navigation.ts:14` `ClipboardList` unused
- `AppointmentDetailsDrawer.tsx:4` `Edit`, `26` `downloadAppointmentSlipPdf`, `528` `onEditClick` unused
- `BookAppointmentScreen.tsx:22` `doctorsApi` unused
- `appointment.service.ts:799` useless assignment to `slots`
- `encounters/api/encounters.api.ts:333` explicit `any`
- `ConsultationDetailsScreen.tsx:8` `Download`/`Edit3` unused, `800` `handleDownloadPdf` unused, `789` missing dep `initialRecord?.medicines`
- `PatientDialogs.tsx:1` `useEffect`/`Calendar`/`Chevron*`/`useAppointmentSlots`/`parseSlotHour` unused

These are P3 in isolation, but collectively signal no CI gate on lint.

### 5.5 Type Safety

- **204 unsafe casts** (`as unknown`, `as any`, `@ts-*`) and **595 `Record<string,unknown>`** — the type system is bypassed at every API boundary. `LoginPage.tsx:62` (`useAuthStore.getState().user`), `AppointmentDetailsDrawer.tsx:242/725`, `PatientPortalContext.tsx:90` all treat domain objects as dictionaries.
- **User type is a grab-bag** (`auth.types.ts:13`): `User` carries `age`, `dob`/`dateOfBirth`, `residentialAddress`/`address`, `mobile`/`mobileNumber`/`phone`, `photo`/`photoUrl`, `primaryDepartmentId`/`departmentId`/`departmentName`/`department` — many nullable, many duplicated — invites bugs and makes mock factories impossible.

**Code Quality Score: 5.0/10 (Component Design) / 5.0/10 (TypeScript) — Feature-complete but ungoverned.**

---

## 6. REACT REVIEW — PHASE 4

### 6.1 Hooks & Correctness

- **Hook count is healthy (151 `export function use*`):** Custom hooks exist for `useAppointments`, `useAppointmentSlots`, `usePatients`, `useBilling`, `useNotifications`, dashboard per-role hooks, `useCreatePatient`, `useConsultation`, `useDiagnosis`, `useVitals`, etc. This is good — business logic is at least *attempted* to be extracted.
- **Hook reuse is inconsistent.** ~50% of screens call `apiClient` directly inside `useEffect` instead of using their feature hook (`DoctorManagementPage.tsx:118` does `await patientsApi.getMyPatients()` inside `useEffect`; `BookAppointmentScreen.tsx:143` hand-rolls fetching). Hurts cache identity and retries.
- **`useEffect` hygiene — mostly passing, with lapses:**
  - `RescheduleAppointmentConfirmationDialog.tsx:553` — `react-hooks/exhaustive-deps` warning: missing `setCurrentMonthDate`.
  - `ConsultationDetailsScreen.tsx:789` — missing `initialRecord?.medicines`.
  - `AppointmentsTab.tsx:131` — missing `loadAppointmentsData` + `set-state-in-effect` (cascading renders) — also flagged `react-hooks/set-state-in-effect`.
  - `BillingTab.tsx:94`, `DocumentsTab.tsx:66` — `useMemo` deps that change every render because `safeInvoices`/`safeAppointments` are re-created arrays.

### 6.2 Render Optimization

- **`React.memo` / `useMemo` / `useCallback` barely present.** Heavy tables (`DoctorTable`, `PatientTable`, `BillingTable`, `ConsultationTable`) re-render on every parent state tick; `HMSAppShell` creates `handleNavSelect` without `useCallback` and rebuilds `exactPathToNavId` tables on each render conceptually (though constants help). No `memo` on `Header`/`NavRail` — navigation re-renders on every route.
- **List rendering without keys discipline** — most tables use `id` correctly, but fallback keys include `Math.random()` in `PatientPortalContext.tsx:143` (`id: String(p.id ?? p.mrn ?? Math.random())`) — key instability → list reconcilation churn.

### 6.3 Suspense / Lazy / Error Boundaries

- **Zero.** No `React.lazy`, no `Suspense`, no `ErrorBoundary`. `src/main.tsx:8` mounts `<App>` directly; `App.tsx:1` mounts `<AppRouter>` directly. Any thrown render error unmounts the entire hospital UI. Any chunk can fail without recovery.
- **`recharts-lazy.tsx:1` is the only file that *should* be lazy** — and is not.

### 6.4 Composition

- **Props drilling over context where context already exists.** `BookAppointmentScreen.tsx` passes `departments/specialties/doctors` down many layers; `Report` pages repeat the same `<ReportLoadingState>`/`<ReportErrorState>` props across 20+ pages instead of composing a `<ReportLayout>`.
- **Portal/context duplication:** `PatientPortalContext` re-fetches `getMyPatients()` twice in one mount (`refresh` + `loadPortal` both fire from `useEffect` on `[isPatient,user]` — `PatientPortalContext.tsx:180` and `:221`). Race + double network.

**React Score: 5.5/10 — Idiomatic hooks usage exists, but missing the production guardrails (memo, split, boundaries, deps).**

---

## 7. STATE MANAGEMENT — PHASE 5

### 7.1 The real state picture

| Store | Pattern | File | Persisted? | Server vs UI? |
|-------|---------|------|------------|---------------|
| **Auth** | `useSyncExternalStore` external store | `auth.store.ts:64` | ✅ `localStorage hms-auth-storage:v1` + `hms-user:v1` + cookies | UI + pseudo-server (tokens) |
| **Consultation** | `useSyncExternalStore` external store | `opd/store/consultationStore.ts:45` | ❌ memory only | UI + server mix |
| **Prescription** | `useSyncExternalStore` external store | `prescriptions/store/prescription.store.ts:34` | ❌ memory only | UI + server mix |
| **Patient portal** | `React.Context` + `useState` | `patients/context/PatientPortalContext.tsx:173` | `localStorage hms-active-patient-mrn:v1` | Server-derived UI |
| **Dashboards, billing, appointments, notifications…** | `@tanstack/react-query` | `dashboard/hooks/*`, `patients/hooks/*`, `billing/hooks/*`, `notification/hooks/useNotifications.ts` etc. | React Query cache | Server |
| **Everything else** | `useState`/`useReducer` local | `CreateInvoiceWorkspacePage.tsx:272`, `RegisterPatientScreen.tsx:1` etc. | ❌ | UI |

### 7.2 Strengths

- **Auth external store is deterministic** — single `currentState` + `listeners:Set` + `notify()` + `saveState()` — behaves like a minimal Zustand. Selector form `useAuthStore(s => s.user)` avoids whole-store re-renders.
- **React Query is used correctly where it is used:** `useQuery`/`useMutation`/`useQueryClient` in `dashboard/hooks/*`, `patients/hooks/usePatients.ts`, `offers/hooks/useBilling.ts`, `notification/hooks/useNotifications.ts`.
- **Patient portal context persists active MRN** and syncs across tabs via `StorageEvent` (`PatientPortalContext.tsx:263`) — thoughtful for multi-tab hospital workflows.

### 7.3 Findings

| ID | Finding | Severity | Evidence |
|----|---------|----------|----------|
| S-1 | **No Zustand, no Redux, no Jotai — bespoke stores hand-rolled** with zero middleware/devtools/time-travel/persistence contract — unfit for multi-tenant medical state | P1 | `package.json:12` has neither dep; `auth.store.ts:64`, `consultationStore.ts:45`, `prescription.store.ts:34` |
| S-2 | **Server state schizophrenia.** Some features use React Query, some bypass it with `useState+useEffect`. No rule → cache is half-authoritative. Mutations in `DoctorManagementPage.tsx:202` manually update `localStorage doctor_status_overrides` instead of invalidating a query. | P1 | `DoctorManagementPage.tsx:177`, `PatientPortalContext.tsx:180` vs `usePatients.ts` |
| S-3 | **Auth store mirrors secrets to localStorage** and reads them back on boot (`loadInitialState():11`), then `lib/axios.ts:57` also reads `hms-auth-storage:v1` as a fallback if the cookie is missing. The cookie layer is bypassed by its own fallback. | P0 | `auth.store.ts:71`, `axios.ts:57` |
| S-4 | **Derived state is manual.** `activePatient`/`primaryMrn`/`activeMrn` derived from `familyMembers` inside `PatientPortalContext.tsx:277` via `useMemo`, but also stored separately as `useState` — desync risk | P2 | `PatientPortalContext.tsx:176` |
| S-5 | **Token persistence mixes three stores:** cookies (`cookie-token-storage.ts`), `hms-auth-storage:v1` (tokens+user JSON), `hms-user:v1` (user JSON separately). No single source of truth; logout must clear three places (`auth.store.ts:82` + `axios.ts:222`). | P1 | `auth.store.ts:74`, `axios.ts:217` |
| S-6 | **`QueryClient` has no enterprise defaults** — no `retry:1`, `refetchOnWindowFocus:false`, `staleTime:30s`, `gcTime`, global `onError` (`main.tsx:8`). Every query inherits Vite's noisy defaults (3 retries, exponential backoff). | P2 | `main.tsx:8` |
| S-7 | **State coupling.** `consultationStore` holds `selectedAppointment` + `selectedEncounter` + `selectedPrescription` + `selectedVitals` + `selectedDiagnoses` + `consultationStatus` — six concerns in one store; should be split or co-located with route. | P2 | `consultationStore.ts:11` |
| S-8 | **No persistence contract for offline/refresh.** Session restore relies entirely on `localStorage`; no `BroadcastChannel`, no `visibilitychange` invalidation — stale after computer sleeps. | P3 | `PatientPortalContext.tsx:263` only syncs portal MRN |

---

## 8. API LAYER — PHASE 6

### 8.1 What exists

- **`src/lib/axios.ts:51` is a full `fetch` wrapper** exposing `apiClient.get/post/put/patch/delete` and `axios.isAxiosError` compat shim (`:346`). Implements: Authorization header injection, `FormData` detection, content-type JSON handling, `ApiError` with `status/response`, **401 queue + RTR** (`:115`), **403 forced-password-change side-effect** (`:254`), **404 suppression for `patients/me/queue`+`prescription`** (`:279`), network-error wrapping (`:90`).
- **Per-feature `*.api.ts` thin wrappers:** `auth.api.ts` (13 endpoints), `patients/api/patient.api.ts` (1460 LOC, many endpoints), `doctors/api/doctors.api.ts`, `billing/api/billing.api.ts`, `appointments/api/appointments.api.ts`, `notification/api/notification.api.ts`, `encounters/api/encounters.api.ts`, `vitals/api/vitals.api.ts`, `reception/api/reception.api.ts`, `users/api/*`.
- **Per-feature `*.service.ts` that should compose `*.api.ts` + store + domain logic:** `auth.service.ts:1`, `appointment.service.ts`, `doctors.service.ts`, `patients/services/*`, `billing/services/billing.service.ts`, `settings/services/*`.

### 8.2 What is good

- **401 refresh logic is enterprise-grade** — `isRefreshing` guard + `failedQueue` + replay (`axios.ts:34/40/115`) + RTR rotation (`:202`) is the correct pattern and matches backend rotation semantics.
- **Typed `ApiResponse<T>` contract** + `unwrapData` helpers show domain awareness.
- **Feature boundaries are attempted** — each feature has its own `api` then `service` then `hooks`; `patientsApi.getAll` with `search` fallback (`patient.api.ts:52`) reflects real backend divergence.

### 8.3 Findings

| ID | Finding | Severity | Evidence |
|----|---------|----------|----------|
| A-1 | **Name lies: it is not Axios.** `lib/axios.ts` exports `apiClient` via `fetch`, but every consumer checks `axios.isAxiosError` and the type is `ApiError` masquerading as Axios. Any engineer onboarding will `npm i axios` and break the build. | P1 | `lib/axios.ts:1`, `patients/api/patient.api.ts:1`, `auth/api/auth.api.ts:1` |
| A-2 | **No Axios at all in `package.json`**; no `zustand` either — prompt-assumed stack is fiction; `README` must be corrected and deps audited | P1 | `package.json:12` |
| A-3 | **Base URL hard-coded to LAN IP; env var commented out** (`:3`). Prod build cannot target another env without code change. Vite proxy also hard-coded (`vite.config.ts:13` → `http://192.168.1.44:8888`). | P0 | `lib/axios.ts:3`, `vite.config.ts:13` |
| A-4 | **No request config standards** — no `timeout`, no `AbortController`/`signal`, no retries (except 401), no `requestId`/`correlationId`, no `tenantId` header for multi-tenant future | P1 | `lib/axios.ts:51` |
| A-5 | **Error normalization absent — copy-pasta per endpoint.** Same `axios.isAxiosError → resData.message → throw new Error(...,{cause})` block in every method (≥120 sites). No `lib/api-error.ts` with `toAppError()`. | P1 | `auth.api.ts:32`, `patients/api/patient.api.ts:77`, `reception/api/reception.api.ts:139` |
| A-6 | **Response unwrapping inconsistency.** Some APIs do `res.data.data` (`patients.api.ts:20` `unwrapData`), others `res.data.url||path||fileUrl` (`auth.api.ts:66`), others `typeof data==='object' && 'data' in data` ad-hoc (`patients/api/patient.api.ts:60`). No `responseSchema zod` normalization. | P2 | `patients/api/patient.api.ts:16`, `auth/api/auth.api.ts:66`, `axios.ts:98` |
| A-7 | **Mixed `api/` vs `services/` responsibilities.** `patientsApi.create` directly calls `billingService` + `triggerNotificationMatrix` (`patient.api.ts:3`), violating layer: API module should not side-effect billing/notifications. | P1 | `patients/api/patient.api.ts:3` |
| A-8 | **No API hooks must use React Query.** Half the codebase opts out (see S-2). No `hooks/useQuery` wrapper to enforce `queryKey` conventions, cache invalidation, or `select` mappers. | P1 | `DoctorManagementPage.tsx:118`, `BookAppointmentScreen.tsx:353` inline catches |
| A-9 | **No mocking seam.** No `msw` handler, no `__mocks__/patient.api.ts`, no repository interface to swap in `FakePatientsApi` for tests/Storybook/backend-not-ready dev | P2 | repo-wide |
| A-10 | **Fallback URL strategy is fragile.** `patientsApi.getAll` fallback to `?search` then `/api/v1/admin/users?role=PATIENT` (`patient.api.ts:52`) silently changes semantics; may leak users across tenants. Needs explicit feature flag, not silent fallback. | P1 | `patients/api/patient.api.ts:52` |

---

## 9. SECURITY REVIEW — PHASE 7

### 9.1 Threat-model context

Assume: RBAC across 7 roles, thousands of concurrent hospital users, PHI/medical records in `patients/*`, `opd/*`, `prescriptions/*`, `vitals/*`, `billing/*`. Attacker = XSS-injected script, stolen refresh token, or low-privilege user (e.g., `PATIENT`) attempting vertical escalation.

### 9.2 Findings

| ID | Severity | Title | Evidence | Exploit / Impact | Fix |
|----|----------|-------|----------|------------------|-----|
| SEC-01 | **P0** | **RBAC bypass by design: `DOCTOR` can do everything** (`can()` short-circuits to `true`) | `permissions/usePermissions.ts:19` — `if (roleKey==="DOCTOR") return true` | Any compromised doctor account (often weak passwords) can invoke `USER_DEACTIVATE`, `BILLING_REFUND_CREATE`, `REPORT_EXPORT`, `AUDIT`-level actions via crafted fetch even if `RouteGuard` hides the nav | Remove blanket bypass; enforce `ROLE_PERMISSIONS[DOCTOR]`; add backend authorization tests; add `can()` unit tests |
| SEC-02 | **P0** | **Admin bypass nearly universal** (`SUPER_ADMIN`/`HOSPITAL_ADMIN`/`ADMIN` get every permission except `CONSULTATION_START`). `ADMIN` already has `DOCTOR_SCHEDULE_MANAGE`, `PATIENT_EDIT`, `PRESCRIPTION_CREATE` etc. — over-privileged by design | `usePermissions.ts:26` | Horizontal escalation — receptionist account promoted to admin-equiv by leaked admin cookie still inherits clinical write powers | Apply least-privilege: remove master-bypass; define `ROLE_PERMISSIONS` accurately; audit backend permission mapping |
| SEC-03 | **P0** | **Auth secrets mirrored to `localStorage`** and re-read on boot / on `fetch` fallback, negating the cookie hardening | `auth.store.ts:74` `localStorage.setItem(STORAGE_KEY, {user,tokens})`, `axios.ts:57` fallback `localStorage.getItem("hms-auth-storage:v1")` | XSS can still `localStorage.getItem('hms-auth-storage:v1')` and exfiltrate `accessToken`+`refreshToken`+`user` even with cookies | Remove `hms-auth-storage:v1`/`hms-user:v1`; persist only non-sensitive `user.displayName` if needed; keep tokens in cookies exclusively |
| SEC-04 | **P1** | **Tokens stored as `SameSite=Strict` client-set cookies without `HttpOnly`** — readable via `document.cookie` — any XSS still exfiltrates via `document.cookie` | `cookie-token-storage.ts:28` `SameSite=Strict;Secure?` but no `HttpOnly` (cannot be set from JS) | Limited mitigation: True `HttpOnly` requires backend `Set-Cookie`. Current `js-cookie` is only a localStorage-to-cookie migration, not a real httpOnly defense. Must move to backend-set cookies + refresh via secure flow | Backend must set `HttpOnly; Secure; SameSite=Strict` cookies; frontend should stop writing tokens and use `credentials:"include"` + CSRF token |
| SEC-05 | **P1** | **No CSRF defense while using cookies** | `axios.ts:1` no `X-CSRF-Token`, no double-submit cookie | If backend accepts cookie auth, attacker site can forge `POST /api/v1/billing/create` from victim admin's browser | Add CSRF token fetch + header (`X-CSRF-Token`) or move to `Authorization: Bearer` + httpOnly split |
| SEC-06 | **P1** | **LocalStorage used as a pseudo-DB for medical state** (`doctor_status_overrides`, `patient_profile_custom_*`, `hms-completed-meds:*`, `hms_triggered_notifications`) — tamperable by user/script, no integrity check | `doctors/components/DoctorProfileScreen.tsx:451/807`, `patients/pages/PatientProfileCenterScreen.tsx:101`, `opd/components/ConsultationDetailsScreen.tsx:463` | User can flip doctor status to ACTIVE, fake profile data, forge completed meds, suppress notifications locally; clinician sees wrong status → patient-safety risk | Remove localStorage overrides; source of truth = backend only; if must cache, sign + TTL + validation |
| SEC-07 | **P1** | **Verbose error leakage via `console.error('[API Error 500] ...', responseData)` in production** — may expose stack/message/internal paths to any user opening devtools | `axios.ts:284` | Information disclosure; HIPAA-adjacent systems should not leak internals | Gate logs behind `import.meta.env.DEV`; ship sanitized `AppError.code → userMessage` map |
| SEC-08 | **P2** | **No route-guard depth — permission checked only at nav/route level, not at data layer or button level consistently.** Many pages fetch data regardless of `can()` and hide UI only cosmetically. | `PatientRoutes.tsx`, `AdministrationRoutes.tsx` — some routes lack `RouteGuard` or guard with `USER_VIEW` as catch-all | Low-privilege user can still call `patientsApi.getAll()` via console even if nav hides Patients | Enforce per-action guards + `disabled` buttons + API 403 handling + backend authorization as final gate (document) |
| SEC-09 | **P2** | **Forced password change is client-controlled** (`force_change_password` cookie + 403 string match on `"Password change required"`). Client can delete cookie and bypass. | `axios.ts:254` + `LoginPage.tsx:25` `getToken("force_change_password")==="true"` | Weak enforcement of security policy | Backend must enforce `mustChangePassword` on every privileged call; frontend redirect is UX only |
| SEC-10 | **P2** | **Hard-coded LAN URL leaks infra topology** in shipped JS (`http://192.168.1.44:8888` appears in `dist/index-*.js`). | `lib/axios.ts:3` | Recon for attacker on hospital LAN | Env-driven URL only; verify via `grep` in CI that no `192.168` ships |
| SEC-11 | **P3** | **No CSP, no `rel="noopener"` audit, no `sanitize` for rendered user content** (`dangerouslySetInnerHTML` absent today, but no policy to keep it absent). | repo-wide | Future XSS surface | Add `index.html` CSP meta + `vite-plugin-csp`; add `eslint-plugin-security` |
| SEC-12 | **P3** | **`localStorage` profile customs are per-browser, not per-user** — `patient_profile_custom_${k}` persists after logout if cleanup misses a key, leaking prior patient's name/phone to next user on shared kiosk | `patients/pages/PatientProfileCenterScreen.tsx:254` | Privacy leakage on shared hospital terminals | Scope custom profile to `user.id` namespace + purge on logout; integration test for logout scrub |

**Security Score: 5.5/10 — Cookie fix shows security awareness; surrounding architecture still fails least-privilege, secret-storage, and tamper-resistance.**

---

## 10. PERFORMANCE REVIEW — PHASE 8

### 10.1 Measured build facts

- `vite build` in **1.35s, 2872 modules** — Vite itself is fast.
- Output: **`dist/index-Bj4-BLJp.js` 3.736 MB, gzip 740 kB** + **`index-QOKJg1Ly.css` 109 kB, gzip 17.8 kB** — one JS chunk + one CSS chunk. Warnings: `Some chunks are larger than 500 kB — consider dynamic import()`.

On a hospital LAN or 4G tablet this is seconds of blank page before any dashboard paints. For 500 staff sharing WAN, 740 kB gzip × thousands of sessions is punishing.

### 10.2 Root causes

| Cause | Evidence | User impact |
|-------|----------|-------------|
| **No code-splitting** — zero `React.lazy` / `dynamic import()` / `manualChunks`. All 19 feature domains ship together. | `grep -rn React.lazy src` = 0; `vite.config.ts:8` has no `build.rollupOptions.output.manualChunks` | Patient downloading doctor OPD + accountant billing + reception queue on first login |
| **No route-level chunks** — `routeConfig.tsx:160` eagerly imports every page. | `AppRouter.tsx:1`, all `*Routes.tsx` static imports | Same as above |
| **Huge single-file pages** — 2500-LOC pages cannot be tree-shaken; their inlined forms/charts/tables all ship. | `ReportsOverview 2506`, `DepartmentsSpecialtiesWorkspace 2690`, `DoctorProfileScreen 2475` | Long parse/compile on low-end ward devices |
| **Recharts always bundled** — `recharts 3.10` (~400 kB) ships to every role though only admin/doctor dashboards use charts. `recharts-lazy.tsx:1` re-exports synchronously, so not lazy. | `common/components/recharts-lazy.tsx:1`, `features/reports/pages/*`, `features/dashboard/pages/*` | 400 kB tax for receptionist/patient |
| **`lucide-react` imported per-file** without barrel or subset — many icons ship even if unused. | `constants/navigation.ts:1` imports 11 icons at top level; every page imports 4–8 more | Adds 100–200 kB |
| **No virtualization for large lists** — `PatientTable`, `DoctorTable`, `BillingTable`, `AuditLogManagementPage 1757 LOC` fetch `?size=…` but render without `react-window`/`virtua`. Log/receipt lists can be thousands of rows. | `common/components/Pagination.tsx` + `BillingTable.tsx` etc. | Jank, O(n) DOM nodes, >16 ms frames |
| **CSS: 11k hard-coded colors + 108 kB single CSS** — no extraction, no per-chunk CSS, no `compressedSize` budget. `@import` of Google Fonts blocks render without `preconnect`/`font-display`. | `index.css:1` `@import url("...fonts...")`, 11207 hard-coded colors | FOIT/FOUT; no theme-mode requires re-download |
| **No memoization for tables** — tables recompute filters/sorts each render. | `AppointmentsTab.tsx:138` `useMemo` deps flagged unstable; no `React.memo` on row components | Re-render amplification on filter typing |
| **Images not optimized** — `safehandshospital_logo.webp 52 kB` OK, but any patient/doctor photo uploads at full resolution via `auth.api.ts:57` `FormData` without client resize/compression. | `auth.api.ts:57` `formData.append("file", file)` raw | Slow uploads on ward network |
| **No prefetch/prefetch discipline** — `QueryClient` has no `prefetchQuery` on nav hover; no `link rel=preload` for fonts/logo | `main.tsx:8` | Delays perceived performance |
| **Logging overhead in prod** — `console.log`/`console.warn` in hot paths (e.g., `opd/components/ConsultationDetailsScreen.tsx:311-314` four consecutive debug logs) | `grep console` = 171 logs | Overhead + exposure |

### 10.3 What good looks like (targets)

- Route-split to **≤180 kB gzip initial** (auth + shell + current role dashboard) + on-demand chunks ≤250 kB each.
- Recharts loaded only on report/dashboard routes via `lazy(() => import('recharts'))` + `Suspense`.
- Vendor split: `vendor-react`, `vendor-query`, `vendor-recharts`, `vendor-icons`.
- Tables virtualized (`@tanstack/virtual` or `virtua`).
- CSS tokens extracted; Google Fonts with `preconnect` + `display=swap`.

**Performance Score: 3.5/10 — Single-chunk 740 kB gzip is a ship-blocker for enterprise hospital deployment.**

---

## 11. ACCESSIBILITY — PHASE 9

### 11.1 Snapshot

- **767 `aria-*` / `role=` / `alt=` attributes** — not absent, but shallow. Mostly `aria-label="Input field"` / `"Select option"` / `"Close"` generics, plus `role="presentation"` on modals.

### 11.2 Findings

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| A11Y-01 | P1 | **Modal/drawer focus traps absent.** Drawers (`AppointmentDetailsDrawer`, `EditAppointmentDrawer`, `AppointmentDetailsDrawer.tsx:995`) set `role="presentation"` but do not trap focus, return focus on close, or handle `Esc` consistently (only some dialogs do via `useEffectEvent`). Keyboard-only clinician cannot safely complete check-in workflows. | `AppointmentDetailsDrawer.tsx:995`, `EditAppointmentDrawer.tsx:493`, `CancelAppointmentConfirmationDialog.tsx:70` |
| A11Y-02 | P1 | **Forms lack associated labels & error announce.** `TextField.tsx` presumably renders labels, but 400+ inline forms (`RegisterPatientScreen.tsx:35`, `CreateInvoiceWorkspacePage.tsx:2xx`) use custom styled `<input className="bg-white border border-gray-200">` without `<label for>` or `aria-describedby` linking errors. Screen readers miss field errors. | `RegisterPatientScreen.tsx:26` `inputBase`, `BillingRuleConfiguration.tsx` etc. |
| A11Y-03 | P2 | **Duplicate generic `aria-label`s** — many inputs expose `aria-label="Input field"` / `"Select option"` instead of contextual names (`"Patient blood group"` / `"Department filter"`). | `DockableQueueWorkspace.tsx:207/218/231`, `EditAppointmentDrawer.tsx:199` |
| A11Y-04 | P2 | **No tab order / skip-link / landmark audit.** `index.html:9` is `<div id="root">` only; no `<main>`, `<nav aria-label>`, `<header>` landmarks; `:focus-visible` styles absent; keyboard nav order in `Header.tsx:430` + `NavRail.tsx:34` untested | `index.html:9`, `components/layout/*.tsx` |
| A11Y-05 | P2 | **Contrast & semantic HTML not validated.** Hard-coded `#64748B` on `#F8FAFC` backgrounds, `#94A3B8` group labels — no `axe-core` run; color-only status encoding (e.g., `StatusBadge`/`StatusChip` red/green without icon/text) | `NavRail.tsx:53`, `StatusChip.tsx:123`, `StatusBadge.tsx` variants |
| A11Y-06 | P3 | **Toast/notification announcements missing `aria-live`.** `CommunicationToast.tsx`, `HeaderToast`, `AppointmentSaveToast.tsx` render visually but not via `aria-live="polite"`/`"assertive"` | `features/notification/components/CommunicationToast.tsx`, `Header.tsx:417` |
| A11Y-07 | P3 | **Font import blocks rendering, no `font-display: swap`** — assistive tech + slow networks see FOIT | `index.css:1` `fonts.googleapis.com` bare import |

### 11.3 What is okay

- `LoginForm.tsx:79` + `TextField.tsx` composition at least centralizes the *attempt* at labeled fields.
- `lucide-react` icons have accessible names via parent `aria-label`s in some drawers.

**Accessibility Score: 4.5/10 — Generic a11y attributes present, but no WCAG 2.1 AA program; fail for hospital compliance.**

---

## 12. UI DESIGN SYSTEM — PHASE 10

### 12.1 Inventory

| Primitive | Exists? | Adopted? | Notes |
|-----------|---------|----------|-------|
| `<Avatar>` | ✅ | ❌ | 4 copies — `common/components/Avatar.tsx` exists, yet `features/*/components/Avatar.tsx` re-implemented 3× (`appointments`, `patients`, `opd`) |
| `<Button>` | ❌ | — | Every page hand-rolls `className="bg-[#0D47A1] hover:bg-[#1565C0] text-white rounded-xl shadow-md"` — 500+ duplications |
| `<Input>` / `<Select>` / `<DatePicker>` | ❌ | — | `TextField.tsx` is auth-only; `CustomDatePicker.tsx`/`TimeSelect.tsx` live in top-level `components/` and are not systematized |
| `<Card>` / `<Table>` | ❌ | — | `DoctorTable.tsx`, `PatientTable.tsx`, `BillingTable.tsx`, `ConsultationTable.tsx` share patterns but not code |
| `<Badge>` / `<Chip>` / `<Status*>` | ⚠️ | ❌ | `Chip.tsx`, `StatusBadge.tsx`, `StatusChip.tsx`, `BillingStatusBadge.tsx`, `AuditBadges.tsx` — all overlapping |
| `<Modal>` / `<Drawer>` / `<Dialog>` | ⚠️ | ❌ | `AppointmentDetailsDrawer.tsx`, `EditAppointmentDrawer.tsx`, `BookAppointmentDrawer.tsx`, `QuickDetailsDrawer.tsx` — same overlay/focus/transition logic 4× |
| `<KpiCards>` | ❌ | — | 7+ `KpiCards.tsx` / `*KpiCards.tsx` per feature (doctors, billing, hospital admin, etc.) — zero shared `<KpiCard>` |
| Tokens (color/spacing/type) | ❌ | — | 11k hard-coded hex, inline `style={{fontFamily: PP}}`, `RB`, `PP` constants as string literals |
| Theme / dark mode | ⚠️ | — | `NavRail.tsx:34` `theme="light"|"dark"` + `onThemeToggle` exists locally, but no app-wide `ThemeProvider`, no `prefers-color-scheme`, no persisted token — dark mode is a nav-rail-only demo |
| Toast | ⚠️ | ❌ | `CommunicationToast`, `AppointmentSaveToast`, `SecuritySaveToast`, `HeaderToast` — no `<ToastProvider>` |
| Typography | ❌ | — | `index.css:5` defines `--font-sans/--font-body` for Poppins/Roboto, but pages use `style={{fontFamily: PP}}` on every text node; no `h1/h2/body/caption` primitives |

### 12.2 Consequences

- **Design drift is guaranteed.** When tailwind shades change, 11k sites must be grepped.
- **No contract for 10+ devs.** Designer cannot hand a Figma token; no Storybook; no `src/ui/` ownership.
- **Inconsistent a11y/loading/error states** because each feature reinvents them.

### 12.3 What to build

A real system (`src/ui/` or `src/design-system/`): `Button`, `Input`, `Select`, `DatePicker`, `Card`, `Table`, `Badge`, `Tag`, `Modal`, `Drawer`, `ToastProvider`, `Spinner`, `EmptyState`, `ErrorState`, `KpiCard`, `PageHeader` + tokens (`colors.ts`, `spacing.ts`, `radii.ts`, `shadows.ts`, `typography.ts`) + Tailwind `theme.extend` wired to tokens + Storybook or Ladle.

**Design System Score: 3.5/10 (implicit) — No system; primitives duplicated. Blocks scalability and visual consistency.**

---

## 13. TESTABILITY — PHASE 11

### 13.1 Hard facts

- **Zero test dependencies.** `package.json:12` has no `vitest`, `jest`, `@testing-library/react`, `msw`, `playwright`, `cypress`, `happy-dom/jsdom`.
- **Zero tests.** `find src -name *.test.* -o -name *.spec.*` returns only `node_modules/zod` internals — 0 project tests.
- **Lint passes but build warns about OOM-level chunks** — also not tested for bundle budget.
- **ESLint finds 40+ fixable issues** (unused vars, exhaustive-deps, set-state-in-effect) — but there is no CI job failing on it.

### 13.2 Why the codebase is currently untestable at the edges

| Blocker | Why | Example |
|---------|-----|---------|
| **No DI / seam** | Pages import `apiClient`/`patientsApi` directly; no interface to inject a fake | `PatientListPage.tsx → patientsApi.getAll()`; `BookAppointmentScreen.tsx → appointment.service` |
| **God components** | 2000-LOC pages cannot be mounted in isolation; rendering them requires mocking 8+ APIs and portal context | `CreateInvoiceWorkspacePage 2095`, `DoctorProfileScreen 2475` |
| **`localStorage` as hidden dependency** | Profiles, status overrides, portal MRN, completed-meds all read `localStorage.getItem` at module init or render-phase (`DoctorProfileScreen.tsx:447`) | `localStorage.getItem("doctor_status_overrides:v1")` at render phase |
| **`window.location.replace("/login")` hard-coded in lib** | Lib layer navigates; hook/component cannot intercept in test | `lib/axios.ts:237` |
| **`useSyncExternalStore` stores have no test harness** | No `renderHook` factory, no reset helper per test | `auth.store.ts:113` `logout()` must be called manually |
| **No MSW handlers / fixtures** | Every feature's `*.api.ts` shape is `unknown`/`Record<string,unknown>` at boundaries | `patients/types/patient.types.ts`, `appointment.types.ts` mix optional/nullable inconsistently |

### 13.3 What is test-ready (credit)

- **Hooks are extractable in principle** — `usePatients`, `useBilling`, `useNotifications`, `useAppointmentSlots`, `usePatientRegister` each encapsulate a single concern and could be `renderHook`-tested once a query provider wrapper exists.
- **Services are thin** — `auth.service.ts:1` delegates to `auth.api.ts` — seams exist if an interface is introduced.

**Testing Readiness: 1.5/10 — No harness, no tests, no seams. Enterprise ship requires E2E for auth + appointments + billing + OPD critical paths.**

---

## 14. ENTERPRISE READINESS — PHASE 12

### 14.1 Scaling the team

| Team size | Can this codebase support it? | Why |
|-----------|-------------------------------|-----|
| **2–5 devs** | ✅ Yes | Current velocity is visible — features ship, small-team ownership works |
| **10 devs** | ⚠️ Painful | God components create merge conflicts; no CODEOWNERS/path-per-feature; no design system; PRs become 800-line diffs |
| **25 devs** | ❌ No | No module boundaries, no contracts, no test gates, no Storybook — parallel work collapses |
| **50–100 devs** | ❌ No | Missing platform layer (tokens, API codegen, feature flags, observability, i18n, multi-tenant routing) — requires re-architecture |

### 14.2 Enterprise capability checklist

| Capability | Status | Evidence | Risk |
|------------|--------|----------|------|
| **Multi-tenancy** | ❌ Absent | No `tenantId` header, no `X-Tenant` or subdomain routing; `hospitalId` lives on `User` but never sent on requests; no tenant-scoped `localStorage` | Data leakage across hospitals |
| **RBAC enforcement** | ⚠️ Bypassed | Shape exists, but `DOCTOR`=god, `ADMIN`=god (see SEC-01/02); `RouteGuard` uses permission but `can()` collapses the lattice | False sense of security |
| **Audit / observability** | ❌ Absent | No `Sentry`/`OTel`/`Datadog`, no `requestId`, no `useLogger`; `console.*` only | Prod outages are undebuggable |
| **Feature flags** | ❌ Absent | No `flagsmith`/`launchdarkly` or even `VITE_FEATURE_*`; cannot darken a broken billing path | All-or-nothing deploys |
| **i18n / l10n** | ❌ Absent | Strings inline (`"Switch Active Patient"`, `"Secure login…"`, `"Dashboard"`); no `i18next` | Cannot serve secondary hospital language |
| **Environment governance** | ❌ Broken | Hard-coded `http://192.168.1.44:8888`; `VITE_API_BASE_URL` commented out; no `.env.example`, no `zod` env validation | Non-portable builds; secret leakage risk later |
| **Onboarding** | ⚠️ Thin | No `README` stack/arch notes, no `CONTRIBUTING.md`, no path aliases, no docs; junior dev must grep `192.168` to find backend | High ramp time |
| **CI/CD** | ❌ Minimal | Only `build` + `lint` scripts; no `typecheck`, `test`, `bundle-budget`, `a11y`, `security` gates | Regressions ship |
| **HIPAA/PHI hygiene** | ⚠️ Weak | Patient data stored in `localStorage` customs + status overrides; medical state can be tampered; no encryption-at-rest note; billing data visible via console | Compliance exposure |

### 14.3 Will technical debt explode?

**Yes, if team grows without intervention.** God-components and duplicated primitives scale as O(features × primitives). The 4th `Avatar`, 5th `KpiCards`, 6th `StatusBadge` are already in progress (`reports/pages/*`, `settings/components/*`). Without a token + `src/ui/` gate, debt doubles per quarter.

### 14.4 Is onboarding easy?

**No.** `264988`-char barrel files + deep relative imports + three persistence layers for auth + `lib/axios.ts` lying about being Axios + undocumented `localStorage` keys (`hms-active-patient-mrn:v1`, `doctor_status_overrides:v1`, `patient_profile_custom_*`, `hms-completed-meds:*`, `hms_triggered_notifications:v1`, `doctor_profile_custom_*`, `staff_profile_custom_*`) — newcomer must read 5 files to understand login.

**Enterprise Readiness: 4.0/10 — Prototype-grade platform. Feature velocity is real; platform maturity is not.**

---

## 15. TECHNICAL DEBT — P0/P1/P2/P3

### P0 — Critical (production blockers; fix this sprint or do not ship to hospital)

| ID | Title | Files | Why P0 |
|----|-------|-------|--------|
| P0-01 | **Eliminate monolithic bundle — route/chunk splitting required** | `src/main.tsx:8`, `src/app/routes/routeConfig.tsx:160`, `vite.config.ts:8`, `dist/index-Bj4-BLJp.js` 3.7MB | 740 kB gzip initial blocks ward devices & violates enterprise perf SLO |
| P0-02 | **Make `API_BASE_URL` env-driven and validated; remove LAN IP from source & dist** | `src/lib/axios.ts:3`, `vite.config.ts:13`, `src/lib/image-utils.ts:13` | Non-portable builds; infra leakage; breaks every non-LAN env |
| P0-03 | **Remove `localStorage` mirror for auth tokens/user** | `src/features/auth/store/auth.store.ts:71`, `src/lib/axios.ts:57` | Re-exposes XSS exfiltration; negates cookie fix |
| P0-04 | **Fix RBAC bypass (`DOCTOR`/admin god-mode in `can()`)** | `src/permissions/usePermissions.ts:19` | Any compromised doctor is now super-admin — hospital-wide privilege escalation |
| P0-05 | **Add `ErrorBoundary` + global error UI** | `src/main.tsx:8`, `src/App.tsx:1` | Uncaught render error blanks entire hospital workstation |
| P0-06 | **Zero tests → add minimum test harness + smoke tests for auth/billing/OPD** | `package.json:12`, `src/` | Cannot ship medical workflows with 0% coverage — required by hospital QA and audit |

### P1 — High (must fix this sprint; high cost of delay)

| ID | Title | Files |
|----|-------|-------|
| P1-01 | Correct `lib/axios.ts` naming (fetch wrapper, not axios) + unify error path in `lib/api-error.ts` | `lib/axios.ts:1`, all `*.api.ts` (120 duplications) |
| P1-02 | Configure `QueryClient` enterprise defaults + enforce React Query as the single server-state path | `main.tsx:8`, `DoctorManagementPage.tsx:118` |
| P1-03 | Decompose the 7 fattest pages into `sections/` + subcomponents (start with `CreateInvoiceWorkspacePage 2095`, `DoctorProfileScreen 2475`, `DepartmentsSpecialtiesWorkspace 2690`) | `features/billing/pages/CreateInvoiceWorkspacePage.tsx:254`, etc. |
| P1-04 | Introduce `src/ui/` design primitives (`Button`, `Input`, `Select`, `Card`, `Badge`, `Drawer`, `Spinner`, `KpiCard`, `PageHeader`) and migrate incrementally | `common/components/*`, `features/*/components/*` |
| P1-05 | Extract design tokens (`colors.ts`, `spacing.ts`, `typography.ts`) + wire to Tailwind `theme.extend`; remove 11k hard-coded colors | `index.css:5`, 11207 hard-coded colors |
| P1-06 | Remove `localStorage` overrides for domain truth (`doctor_status_overrides`, `patient_profile_custom_*`, `hms-completed-meds`, `hms_triggered_notifications`) — backend is source of truth | `DoctorProfileScreen.tsx:451`, `PatientProfileCenterScreen.tsx:101`, `ConsultationDetailsScreen.tsx:463`, `notification/services/notificationTrigger.ts:6` |
| P1-07 | Gate `console.*` behind `import.meta.env.DEV`; add `eslint no-console` for prod + `AppError` sanitized user messages | `lib/axios.ts:284`, 171 `console.*` |
| P1-08 | Add `tsconfig` path aliases (`@/*`, `~/features/*`, `@/lib/*`) and enforce via eslint `import/no-restricted-paths` + `import/order` | `tsconfig.app.json:1` |
| P1-09 | Add `AbortController`/timeout + `requestId` + `tenantId` + CSRF plumbing to `lib/axios.ts` + document multi-tenant header contract | `lib/axios.ts:51` |
| P1-10 | Make `recharts-lazy.tsx` genuinely lazy via `React.lazy` + `Suspense`; vendor-split recharts | `common/components/recharts-lazy.tsx:1` |

### P2 — Medium (technical debt; plan within month)

| ID | Title |
|----|-------|
| P2-01 | Fix `react-hooks/exhaustive-deps` warnings (3 flagged) + `set-state-in-effect` cascading renders (AppointmentsTab, DocumentsTab) |
| P2-02 | Fix `PatientPortalContext` double-fetch on mount (`refresh` + `loadPortal` both fire) |
| P2-03 | Stabilize `useMemo` deps that use unstable `safe*` array conditionals (AppointmentsTab, BillingTab) + add `React.memo` to heavy rows/headers |
| P2-04 | Replace `Record<string,unknown>`/`as unknown`×204 with real DTOs + `zod` validators per API (start with `auth.types.ts:13` `User`, `patient.types`) |
| P2-05 | Normalize API response unwrapping (`unwrapData`) + `zod` schema per endpoint; stop mixed `res.data.data`/`res.url||path` handling |
| P2-06 | Move mixed `services → billing/notifications` side effects out of `patientsApi` API layer — introduce orchestration hook/service |
| P2-07 | Enforce barrel/export consistency (no `export default` pages; adopt named exports + index barrels; `eslint import/no-default-export`) |
| P2-08 | Audit `localStorage` key namespace + scope to `user.id`; add `logout` scrub integration test for kiosk privacy |
| P2-09 | Add focus-trap + `aria-live` + landmark + contrast audit for drawers/toasts/tables (`axe-core` + `eslint-plugin-jsx-a11y`) |
| P2-10 | Introduce `src/config/env.ts` (`zod` env parse) + `.env.example` + `VITE_*` enum for `API_BASE_URL`, `APP_ENV`, `LOG_LEVEL`, `SENTRY_DSN` |

### P3 — Low (cleanup; polish & hygiene)

| ID | Title |
|----|-------|
| P3-01 | Remove lint-flagged unused vars (`ClipboardList`, `Edit`, `Download`, `doctorsApi`, `doctor_status_overrides` useless assignment) and enable `eslint --max-warnings=0` in CI |
| P3-02 | Replace `Math.random()` as React key with stable `id/mrn` fallback |
| P3-03 | Consolidate `Avatar`/`Badge`/`Chip` duplicates into `src/ui/` primitives; delete feature-local copies |
| P3-04 | Optimize uploaded photos client-side (resize/compress before `auth.api.ts:57` `FormData`) |
| P3-05 | Add `preconnect` + `font-display: swap` for `index.css:1` Google Fonts; consider self-hosting fonts |
| P3-06 | Standardize `User` type — de-duplicate `dob/dateOfBirth`, `address/residentialAddress`, `mobile/phone/mobileNumber`, `photo/photoUrl` |
| P3-07 | Add per-feature `README.md` + root `ARCHITECTURE.md` + `CONTRIBUTING.md` + `CODEOWNERS` |

---

## 16. ARCHITECTURE IMPROVEMENTS

1. **Adopt explicit dependency rule.** Add `eslint-plugin-boundaries` or `eslint-plugin-import` with:
   - `features/*` may import `common/ui`, `lib`, `constants`, `types`, `permissions` — but **never** sibling `features/*` directly except via `lib/events` or a declared `features/patients/portal` public API.
   - `lib` may not import `features/*` or `window.location`.
   - `app/routes` may import `features/*/routes` + `permissions`, nothing lower-level that leaks upward.
   Enforce in CI; fix cycle `lib/axios → localStorage → window.location`.

2. **Codify API contract layer.** Split `lib/axios.ts` into:
   ```
   src/lib/api/
     client.ts        # fetch + auth + retry + abort + requestId + tenantId
     error.ts         # ApiError + toAppError() + AppErrorCode enum
     paginator.ts     # PaginatedResponse<T> + cursor helpers
     mock.ts          # msw wiring (dev/test)
   src/lib/config/
     env.ts           # zod parse of VITE_API_BASE_URL etc.
   ```

3. **Introduce repository / use-case seam.** For each domain:
   ```
   features/patients/
     domain/           # pure types + mappers + validators (no imports)
     data/             # api + dto + mappers (implements PatientsRepository)
     application/      # usePatient, useCreatePatient (orchestrates repo + store + notifications)
     ui/               # components/pages (dumb)
   ```
   Even a light version (extract `PatientsRepository` interface from `patientsApi`) unlocks DI for tests.

4. **Unify server-state story.** Enforce: **All server reads/writes via React Query**. Wrap `useQuery` as `useAppQuery` that injects `[tenantId, ...key]`, `select: zodParse`, `staleTime`, `onError: toAppError`. Ban `useState+useEffect` fetching via lint.

5. **App shell boundaries.** Treat `HMSAppShell` as a platform surface:
   ```
   src/app/
     shell/            # HMSAppShell, Header, NavRail, ErrorBoundary, Suspense fallback
     routes/           # routeConfig (imports lazy pages only)
     providers/        # QueryProvider, AuthProvider, PortalProvider, ThemeProvider, ToastProvider
   ```

6. **Multi-tenant readiness.** Today `hospitalId` on `User` is never sent; add `X-Tenant-Id: user.hospitalId` header in `client.ts`, tenant-scoped `queryKey` prefixes, tenant-scoped `localStorage` namespaces (`hms:${tenantId}:active-patient-mrn`), and a `TenantContext` for future hospital-switcher.

---

## 17. FOLDER STRUCTURE IMPROVEMENTS

**Target enterprise layout:**

```
src/
  app/
    providers/          # QueryProvider, AuthProvider, PortalProvider, ThemeProvider, ToastProvider, ErrorBoundary
    routes/             # AppRouter, routeConfig, *Routes (all lazy)
    shell/              # HMSAppShell, Header, NavRail
  config/
    env.ts              # zod env validation
    navigation.ts       # (moved from src/constants)
    permissions.constants.ts
  lib/
    api/                # client.ts, error.ts, paginator.ts
    query/              # queryClient.ts, useAppQuery.ts
    tokens/             # colors.ts, spacing.ts, radii.ts, typography.ts
    utils/              # time, intl, status, image
  ui/                   # Button, Input, Select, DatePicker, Card, Table, Badge, Drawer, Modal, Toast, Spinner, KpiCard, PageHeader
    tokens/             # tailwind.preset.ts wired to lib/tokens
  features/             # keep current per-feature api/components/hooks/pages/services/types/constants
  types/                # app.types.ts
  test/
    setup.ts            # vitest setup + msw
    factories/          # userFactory, patientFactory, appointmentFactory
    msw/                # handlers.ts
docs/
  ARCHITECTURE.md       # C4 / dependency diagram
  ADR/                  # decisions (cookie storage, external-store, fetch vs axios)
.env.example
```

**Migrations:**

- Move `src/constants/navigation.ts` → `src/config/navigation.ts`; `src/permissions/*` → `src/config/permissions/*` or `src/app/auth/permissions/`.
- Move `src/components/CustomDatePicker.tsx` / `TimeSelect.tsx` → `src/ui/`.
- Rename `src/common` → `src/ui` and expand; keep only genuinely cross-feature primitives — delete feature-local `Avatar` duplicates.
- Rename `src/common/components/recharts-lazy.tsx` → `src/ui/charts/LazyRecharts.tsx` and make it genuinely lazy.
- Add path aliases so moves don't create `../../../../..` hell:
  ```jsonc
  // tsconfig.app.json
  { "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["src/*"], "@/ui/*": ["src/ui/*"], "@/lib/*": ["src/lib/*"], "@/features/*": ["src/features/*"] } } }
  ```

---

## 18. STATE MANAGEMENT IMPROVEMENTS

1. **Retire hand-rolled `useSyncExternalStore` stores.** Migrate `auth.store.ts`, `consultationStore.ts`, `prescription.store.ts` to **Zustand v5** (or keep `useSyncExternalStore` but add proper middleware):
   ```ts
   // stores/auth.store.ts (Zustand)
   export const useAuthStore = create<AuthState>()(
     devtools(persist(..., { name: 'hms:auth', partialize: s => ({ user: s.user }) }), { name: 'Auth' })
   )
   ```
   Tokens remain in cookies only; store holds only `user` + `isAuthenticated` derived from cookie presence.

2. **Single source for auth persistence:** cookies only (eventually backend HttpOnly). Remove `hms-auth-storage:v1` and `hms-user:v1` reads/writes entirely; if must cache user, cache display fields only under `hms:session:user` with short TTL and `user.id` scoping.

3. **Fix React Query usage:**
   ```ts
   // src/lib/query/queryClient.ts
   export const queryClient = new QueryClient({
     defaultOptions: {
       queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000, gcTime: 5*60_000 },
       mutations: { onError: (e) => toastAppError(toAppError(e)) },
     },
   })
   ```
   Add global `QueryErrorBoundary` and `Suspense` fallback.

4. **Disambiguate server vs UI vs domain state.** Rule:
   - Server state → React Query (with `queryKey: ['patients', tenantId, mrn]` etc.)
   - UI state (drawer open, active tab, filter strings) → component `useState`/`useReducer` **colocated** near the UI that owns it, never in global stores.
   - Cross-route UI state (active patient) → `PatientPortalContext` (keep) but fix double-fetch.

5. **Split `consultationStore` into route-scoped state.** `selectedAppointment/Encounter/Prescription/Vitals/Diagnoses` should live in a `ConsultationWorkspaceProvider` scoped to `/consultation/workspace/:id`, not a global store that lingers after navigation.

6. **Add selector stability.** Today `useAuthStore(s => s.user)` re-renders on every token refresh even if `user` unchanged. Use stable identity + `useShallow` or `createSelectors` pattern.

---

## 19. API IMPROVEMENTS

1. **Rename `lib/axios.ts` → `lib/api/client.ts`.** Keep the `axios.isAxiosError` shim only behind a deprecation alias; consumers migrate to `isApiError(e)`. Document that the client is `fetch`-based.

2. **Centralize error translation** (`lib/api/error.ts`):
   ```ts
   export type AppErrorCode = 'NETWORK'|'UNAUTHORIZED'|'FORBIDDEN'|'NOT_FOUND'|'VALIDATION'|'SERVER'|'UNKNOWN'
   export class AppError extends Error { code: AppErrorCode; status?: number; cause?: unknown }
   export function toAppError(e: unknown): AppError { /* single translation, single message map */ }
   export function isAppError(e: unknown): e is AppError
   ```
   Delete 120 duplicated `if (axios.isAxiosError…)` blocks.

3. **Make `API_BASE_URL` derived, validated, and non-leaking:**
   ```ts
   // src/config/env.ts
   const Env = z.object({ VITE_API_BASE_URL: z.string().url() })
   export const env = Env.parse(import.meta.env)
   export const API_BASE_URL = env.VITE_API_BASE_URL.replace(/\/$/, '')
   ```
   Add `.env.example`, `.env.development`, `.env.production`; CI fails if `192.168` appears in `dist/`.

4. **Add enterprise transport concerns** to `client.ts`:
   - `AbortController` + `signal` + `timeout` (default 15s)
   - `X-Request-Id: crypto.randomUUID()` + `X-Tenant-Id: user.hospitalId`
   - `credentials: 'include'` (if moving to httpOnly cookies) or `Authorization: Bearer` (current) — pick one.
   - `buildUrl('/api/v1/patients', {query, page, status})` helper to avoid `URLSearchParams` repetition (`patients/api/patient.api.ts:37`)

5. **Normalize response shape** with `zod`:
   ```ts
   const ApiEnvelope = <T extends z.ZodType>(data: T) => z.object({ success: z.boolean(), message: z.string().optional(), data })
   const PatientDto = z.object({ id: z.string(), mrn: z.string(), name: z.string(), ... })
   type Patient = z.infer<typeof PatientDto>
   ```
   Map DTO→domain in one `mappers/` layer instead of `as unknown as Record<string,unknown>` everywhere.

6. **Stop API-module side effects.** `patientsApi.create` should not call `billingService` or `triggerNotificationMatrix`. Move orchestration to an `application/useCreatePatient.ts` hook:
   ```ts
   export function useCreatePatient() {
     return useMutation({ mutationFn: patientsApi.create,
       onSuccess: (p) => { billingService.recordRegistration(p); triggerNotificationMatrix('PATIENT_CREATED', p) } })
   }
   ```

7. **Add contract tests.** For each `*.api.ts`, add a Vitest `msw` test that asserts request URL, method, headers, and `zod`-parsed response against a fixture — catches backend drift before it hits the ward.

---

## 20. UI IMPROVEMENTS

1. **Bootstrap `src/ui/` primitives before any feature work.** Phase 1 of the refactoring roadmap should ship (Week 1):
   - `Button` (variants `primary|secondary|ghost`, sizes, `loading`, `leftIcon`), `Input`, `Select`, `Textarea`, `DatePicker`, `Checkbox`, `Radio`, `Switch`
   - `Card`, `Table` (with `TableHeader`/`Row`/`EmptyState`), `Pagination`
   - `Badge`, `Chip`, `StatusBadge` (single implementation, semantic `intent` prop)
   - `Modal`, `Drawer` (focus trap, `Esc`, return-focus), `ToastProvider`, `Spinner`, `Skeleton`
   - `KpiCard`, `PageHeader`, `SectionHeader`, `EmptyState`, `ErrorState`

2. **Tokenize.** Create `src/lib/tokens/colors.ts`, `spacing.ts`, `radii.ts`, `shadows.ts`, `typography.ts` and consume via Tailwind `theme.extend`:
   ```ts
   // tailwind.preset.ts
   export default { theme: { extend: { colors: tokens.colors, borderRadius: tokens.radii } } }
   ```
   Lint: `eslint-plugin-tailwindcss` + `no-restricted-syntax` for raw `bg-[#0D47A1]` once tokens ship (gradual).

3. **Fix dark mode as a system.** Add `ThemeProvider` with `prefers-color-scheme` + persisted `localStorage hms:theme` + `data-theme` on `<html>` + CSS vars (`--color-bg`, `--color-primary`). `NavRail` toggles the provider, not its own local state.

4. **Unify page chrome.** Extract `PageHeader` + `FilterBar` + `ActionBar` + `LoadingState`/`ErrorState` so `ReportsOverview 2506` and `DoctorProfileScreen 2475` don't each reinvent headers/filters/KPIs.

5. **Visually verify with Storybook/Ladle.** Add Ladle (Vite-native, lighter than Storybook) for `ui/` primitives — speeds up design review and regression checks.

---

## 21. SECURITY IMPROVEMENTS

| Order | Action | Owner | Deliverable |
|-------|--------|-------|-------------|
| 1 | **Remove `localStorage` token/user mirror + fallback** | Frontend | Delete `hms-auth-storage:v1`/`hms-user:v1` writes/reads; keep tokens in cookies; migrate session restore to cookie-only; add `logout` scrub integration test |
| 2 | **Fix `can()` privilege collapse** | Frontend + Backend | Remove `DOCTOR`/`ADMIN` short-circuit in `usePermissions.ts:19`; derive `can()` strictly from `ROLE_PERMISSIONS` (or from backend `permissions` array). Backend to enforce same checks — frontend is not the gate. Add unit tests for each role × permission matrix. |
| 3 | **Move to backend-set `HttpOnly` cookies** (target) | Backend + Frontend | Backend `Set-Cookie: accessToken=…; HttpOnly; Secure; SameSite=Strict` + `refreshToken` httpOnly. Frontend stops writing cookies; `client.ts` uses `credentials:'include'` + CSRF token. |
| 4 | **Add CSRF** | Frontend + Backend | `GET /api/v1/auth/csrf` → `X-CSRF-Token` header on mutating calls; verify server-side. Until httpOnly, CSRF is lower severity but prep now. |
| 5 | **Remove `localStorage` domain overrides** | Frontend | `doctor_status_overrides`, `patient_profile_custom_*`, `hms-completed-meds`, `hms_triggered_notifications` → backend-only. If caching is required, validate + TTL + HMAC; never trust display values for access decisions. |
| 6 | **Gate console leakage** | Frontend | `lib/logger.ts` with `if (import.meta.env.DEV)`; `eslint no-console: error` in `eslint.config.js` prod override; sanitize `toAppError` messages to user-safe `AppError.userMessage` |
| 7 | **Harden forced-password flow** | Backend + Frontend | Backend rejects privileged endpoints when `mustChangePassword=true`; frontend redirect is UX only; add e2e test `login(with mustChangePassword)` |
| 8 | **Add CSP + security headers** | Build/Infra | `index.html` `Content-Security-Policy: default-src 'self'; img-src 'self' data: blob: https:; connect-src 'self' ${API_BASE_URL}; script-src 'self'`; `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`; verify `dist` via `csp-evaluator` |
| 9 | **Purge sensitive data on shared kiosks** | Frontend + QA | `logout` clears every `hms:*` key + cookies; add Playwright test `login → view patient → logout → localStorage empty, cookies empty, /login` |
| 10 | **Introduce `eslint-plugin-security` + `npm audit` + `Dependabot`** | Platform | `npm audit --audit-level=high` in CI; weekly `dependabot` PRs; `vite-plugin-csp` in build |

---

## 22. PERFORMANCE IMPROVEMENTS

| Order | Action | Expected gain |
|-------|--------|---------------|
| 1 | **Route-level code splitting.** Convert every page import in `routeConfig.tsx` to `lazy(() => import('@/features/.../pages/...'))` + `<Suspense fallback={<PageSkeleton/>}>` per route. Add `<ErrorBoundary>` per route chunk. | Initial gzip: ~740 kB → ~180 kB; ward-device TTI −60% |
| 2 | **Vendor/manual chunks.** `vite.config.ts → build.rollupOptions.output.manualChunks: { 'vendor-react': ['react','react-dom','react-router'], 'vendor-query': ['@tanstack/react-query'], 'vendor-recharts': ['recharts'], 'vendor-icons': ['lucide-react'] }` | Better HTTP caching; 400 kB recharts not on auth flow |
| 3 | **Lazy Recharts.** `src/ui/charts/LazyRecharts.tsx`: `const Recharts = lazy(() => import('recharts'))` used only in `ReportsOverview`, `KpiDetail`, `*Dashboard` chart sections with `<Suspense>` | Auth + patient flows stop paying chart tax |
| 4 | **Lazy/lucide tree-shaking.** Import icons via named `lucide-react` subset or `unplugin-icons`; verify `dist` no longer ships 50 unused icons | −100–150 kB |
| 5 | **Virtualize large lists.** Add `@tanstack/virtual` for `PatientTable` (100+ rows), `AuditLogManagementPage`, `VitalsManagementScreen`, billing tables; paginate server-side with `cursor` not `page/size` where possible | Smooth scrolling on 1000+ row reports |
| 6 | **Memoize table primitives.** `React.memo(Row)`, `useMemo` for filtered/sorted slices, `useCallback` for handlers; fix `safe*` unstable deps (`AppointmentsTab.tsx:138`) | −30–50% re-renders on filter keystrokes |
| 7 | **Fonts: `preconnect` + `display=swap` + self-host option.** Replace `index.css:1` `@import url(fonts)` with `<link rel=preconnect>` + `<link href=…&display=swap>` or `@fontsource/poppins` | Eliminate FOIT |
| 8 | **Image optimization for uploads.** Resize/compress client-side (`browser-image-compression`) before `auth.api.ts:57` `FormData` append; add `accept` + `maxSize` validation | Faster registration on 4G tablets |
| 9 | **Bundle budget CI gate.** `vite-plugin-bundle-buddy` or `bundlesize` with `maxSize: 250kB gzip` per chunk; fail PR if initial chunk > 200 kB gzip | Prevents regression |
| 10 | **Remove prod console overhead.** `vite-plugin-strip-console` or `esbuild.drop: ['console','debugger']` in `vite.config.ts` `build` | −minor CPU + cleaner dist |

**Bundle budget targets after remediation:**

| Chunk | Target (gzip) | Current |
|-------|---------------|---------|
| `index` (shell + auth + router) | ≤180 kB | 740 kB |
| `dashboard-*` (per role) | ≤120 kB each | 0 (in index) |
| `recharts` | ≤80 kB (lazy) | ~120 kB (in index) |
| `reports` | ≤150 kB | 0 (in index) |
| `opd` / `billing` / `patients` | ≤130 kB each | 0 (in index) |
| `css` | ≤25 kB | 17.8 kB (OK) |

---

## 23. TESTING IMPROVEMENTS

### 23.1 Harness (Week 1)

```bash
npm i -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom \
         happy-dom msw zod
npm i -D playwright @playwright/test   # e2e
```

Add `vitest.config.ts`:
```ts
export default defineConfig({
  test: { environment: 'happy-dom', setupFiles: ['./src/test/setup.ts'], globals: true, coverage: { provider: 'v8', thresholds: { lines: 70, branches: 60 } } },
})
```

`src/test/setup.ts`: `@testing-library/jest-dom`, `msw` `setupServer`, `QueryClientProvider` wrapper, `localStorage`/`cookie` mock, `env` mock.

Gate: `npm run test` + `npm run test:cov` + `npm run lint -- --max-warnings=0` + `npm run build` in CI.

### 23.2 Layers

| Layer | What to test first | Example tests |
|-------|-------------------|---------------|
| **Unit — lib** | `cookie-token-storage`, `time-utils`, `status-utils`, `image-utils`, `toAppError`, `usePermissions.can` | `can('PATIENT_VIEW') for NURSE → false`, `normalizeStatus('checked_in')==CHECKED_IN` |
| **Unit — hooks** | `useLogin`, `usePatientRegister`, `useAppointments`, `useBilling`, `useNotifications` | `renderHook(useLogin)` success/error paths, validation branching |
| **Integration — pages** | Decomposed sections (`KpiCards`, `BillingFilters`, `AppointmentDatePickerFilter`, `PatientTable`) via `render` + `msw` handlers | `PatientListPage` renders mocked `GET /api/v1/patients` list, filter, pagination |
| **E2E — Playwright** | Auth + forced-password + appointment + OPD + billing golden paths | `login.spec`, `patient-register.spec`, `book-appointment.spec`, `consultation-workspace.spec`, `create-invoice.spec`, `logout-scrub.spec` |

### 23.3 Priority order (value per effort)

1. `usePermissions` matrix (30 cases, catches SEC-01/02 instantly)
2. `lib/api/client` + `toAppError` + `401 queue` (regression nets for the best part of the system)
3. `auth` login / register / forgot-password flows (highest risk)
4. `patients` CRUD + portal switch (family switching)
5. `appointments` book/reschedule/cancel/queue transitions (status-utils critical)
6. `billing` create-invoice math + payment paths (money)
7. Playwright smoke: `login → dashboard → patients → appointment → consultation → billing → logout`

### 23.4 Observability for test runs

Add `vitest --coverage` gate at **70% lines / 60% branches** for `src/lib`, `src/permissions`, `src/features/auth`, `src/features/appointments`, `src/features/billing` first. Expand per quarter.

---

## 24. REFACTORING ROADMAP

### Phase A — Stabilize (Week 1, P0, 1 senior)

> Goal: ship-blockers gone, CI gates live.

- [ ] `src/config/env.ts` + `.env.example` + migrate `API_BASE_URL` + `vite proxy.target` to env (`axios.ts:3`, `vite.config.ts:13`) — verify no `192.168` in `dist`.
- [ ] Wrap `src/main.tsx:8` in `ErrorBoundary` + add `RouteErrorBoundary` per route chunk; add `lib/logger.ts` + gate `console.*` behind `DEV`.
- [ ] Remove `localStorage` mirror in `auth.store.ts:71` + fallback in `axios.ts:57`; regression-test login/logout/refresh/session-restore. Add `logout` scrub for all `hms:*` keys.
- [ ] Fix `can()` in `usePermissions.ts:19` — remove god-mode returns; add 30-case unit test.
- [ ] Add `QueryClient` enterprise defaults (`main.tsx:8`).
- [ ] Add `vitest` harness + `usePermissions` + `toAppError` + `status-utils` unit tests; add CI jobs: `typecheck`, `lint --max-warnings=0`, `test`, `build`, `bundle-budget`.

### Phase B — Split & Systematize (Weeks 2–3, P1, 2 seniors)

> Goal: bundle/UX/maintainability under control.

- [ ] Route-level `React.lazy` + `Suspense` for every page in `routeConfig.tsx:160`; add `vite manualChunks`; make `recharts-lazy.tsx` genuinely lazy; verify `dist` emits ≥12 chunks and initial gzip ≤220 kB.
- [ ] Ship `src/ui/` primitives (Button/Input/Select/Card/Table/Badge/Drawer/Spinner/KpiCard/PageHeader) + tokens; migrate `LoginForm`, `PatientRegisterForm`, `Header` to primitives as pilot.
- [ ] Tokenize Tailwind: `theme.extend` from `lib/tokens/*`; lint new hard-coded colors.
- [ ] Rename `lib/axios.ts` → `lib/api/client.ts`; extract `lib/api/error.ts` (`toAppError`); DRY 120 duplicated try/catch blocks via shared `handleApiError` (keep one implementation).
- [ ] Remove `localStorage` domain overrides (doctor status, patient customs, completed-meds, triggered-notifications); wire backend source-of-truth.
- [ ] Add `tsconfig` path aliases `@/*`; fix imports with `eslint --fix`.

### Phase C — Decompose & Harden (Weeks 4–6, P1–P2, team)

> Goal: 25-dev readiness.

- [ ] Decompose the 7 fattest pages into `sections/` + hooks + `ui/` primitives (`CreateInvoiceWorkspacePage`, `DoctorProfileScreen`, `DepartmentsSpecialtiesWorkspace`, `ReportsOverview`, `KpiDetail`, `VitalsManagementScreen`, `PatientAppointmentsScreen`) — each section ≤300 LOC, each with a `render` test.
- [ ] Introduce `PatientsRepository`/`AppointmentsRepository`/etc. interfaces; add `msw` handlers + fixtures; add integration tests for patient/appointment/billing flows.
- [ ] Split `consultationStore` + `prescription.store` into route-scoped providers + React Query mutations; remove global lingering state.
- [ ] Fix `react-hooks/exhaustive-deps` + `set-state-in-effect` + `safe*` unstable deps; add `React.memo` to tables/headers.
- [ ] Virtualize `PatientTable`, `DoctorTable`, `BillingTable`, `AuditLogManagementPage`.
- [ ] A11y pass: focus traps for drawers, `aria-live` for toasts, `axe-core` in CI, contrast audit for badges.

### Phase D — Platform Maturity (Months 2–6, roadmap owned by Staff)

- [ ] Multi-tenant headers + tenant-scoped caches + hospital-switcher (if product requires).
- [ ] Backend `HttpOnly` cookie migration + CSRF.
- [ ] Feature flags (`VITE_FEATURE_*` initially, then LaunchDarkly/Flagsmith).
- [ ] Observability (Sentry + OTel traces + `X-Request-Id`).
- [ ] i18n (`i18next` extraction).
- [ ] Ladle/Storybook for `ui/` + visual regression (`chromatic`).
- [ ] Contracts: OpenAPI → `openapi-typescript` codegen replacing hand-written DTOs + `zod` schemas.

---

## 25. MIGRATION PLAN

### 25.1 Principles

- **No big-bang rewrite.** Every step ships as a PR that passes existing build + lint + new tests and can be reverted in one commit.
- **Strangler pattern.** Keep `lib/axios.ts` as a deprecated re-export to `lib/api/client.ts` for 2 sprints; lint-warn `axios.isAxiosError` after migration.
- **Codemods where possible.** `ts-morph`/`jscodeshift` for `Relative → @/` imports, `bg-[#0D47A1]` → `bg-primary` token migration.
- **Bundle budget is the gate.** No phase is "done" until `dist` initial gzip ≤ agreed budget.

### 25.2 Sequenced migrations

| Step | Migration | Technique | Rollback |
|------|-----------|-----------|----------|
| M1 | Env-driven `API_BASE_URL` + `proxy.target` | `config/env.ts` + `.env` + search-replace `192.168` → `env.API_BASE_URL` | Revert one commit; devs use `.env.local` |
| M2 | Auth localStorage → cookie-only | Delete localStorage mirror code paths; add `msw` session-restore tests | Re-add fallback branch behind `VITE_LEGACY_AUTH_STORAGE=1` |
| M3 | `can()` permission fix | Tighten to `ROLE_PERMISSIONS`; add matrix tests; deploy behind `VITE_PERMISSIONS_STRICT=1` flag | Flag off re-enables old returns |
| M4 | `lib/axios` → `lib/api/client + error` | Move file, keep shim re-export; codemod `axios.isAxiosError` → `isApiError` | Shim keeps old imports alive |
| M5 | Route-level `React.lazy` | Wrap each page in `lazy()` + `Suspense` per `*Routes.tsx`; add `ErrorBoundary` | Convert one lazy back to static import |
| M6 | `recharts-lazy` true lazy + vendor split | `ui/charts/LazyRecharts` + `vite manualChunks` | Revert to sync import |
| M7 | `common/components` → `src/ui` | Move + dedup `Avatar`/`Pagination`/`Badge`/`Drawer` into `ui/`; codemod imports | Old path re-exports shim for one sprint |
| M8 | Design tokens + Tailwind preset | `lib/tokens/*` + `tailwind.preset.ts`; gradual color replacement via lint `no-restricted-syntax` | Tokens are additive; rollback is `git revert` |
| M9 | God-component decomposition | Extract `sections/` per page; each section behind `render` test | Feature-flag new sections or keep both and switch |
| M10 | Test harness + MSW + Playwright | `vitest.config.ts` + `src/test/*` + `playwright.config.ts`; CI gates | Remove CI gates if flaky (then fix) |

### 25.3 Risk mitigations

- **Auth migration (M2) is highest risk** — run dual-write for one sprint (write both, read cookies-first), then delete mirror after 7-day burn-in + QA on shared kiosk logout.
- **Permission fix (M3) will surface missing backend guards** — coordinate with backend team; add `GET /api/v1/auth/me/permissions` if backend needs to drive `permissions` array instead of role table.
- **Bundle splitting (M5/M6) requires QA of loading states** — add `PageSkeleton` + per-route `ErrorBoundary` fallback with retry; Playwright asserts no blank screens.

---

## 26. ENGINEERING BEST PRACTICES MISSING

| Practice | Current | Required |
|----------|---------|----------|
| **Env management** | Hard-coded LAN IP, no `.env.example` | `config/env.ts` (`zod`) + `.env.example` + `VITE_*` validation + CI `192.168` leak check |
| **Path aliases** | Deep relative imports everywhere | `tsconfig paths: @/*` + `eslint import/order` |
| **CI gates** | Only `build` + `lint` scripts | `typecheck`, `test`, `coverage`, `bundle-budget`, `axe`, `npm audit`, `lint --max-warnings=0` |
| **Commit hygiene** | No format hook, no commitlint | `husky` + `lint-staged` (prettier + eslint) + `commitlint` (conventional commits) |
| **Docs** | No `ARCHITECTURE.md`, `CONTRIBUTING.md`, `ADR/` | `docs/ARCHITECTURE.md` (C4), `docs/ADR/*.md`, `features/<f>/README.md`, `CODEOWNERS` |
| **Design governance** | No tokens, no `ui/`, no Storybook | `src/ui/` + `lib/tokens/` + `tailwind.preset.ts` + Ladle/Storybook |
| **API governance** | No OpenAPI/codegen, no DTO validation | `openapi-typescript` + `zod` DTO schemas per `*.api.ts`; `msw` contract tests |
| **Error handling** | `console.*` + stringly-typed errors | `AppError` + `lib/api/error.ts` + `ErrorBoundary` + `toast` mapping |
| **Performance governance** | No budget, no split, no virt | `bundlesize` + `manualChunks` + `react-window` + `vite-plugin-bundle-buddy` |
| **Security governance** | No CSP, no CSRF, no audit | `csp` + `csrf` + `eslint-plugin-security` + `npm audit` + `dependabot` |
| **Testing** | 0% | `vitest` + `msw` + `playwright` + `coverage` gates + factory fixtures |
| **Observability** | `console.*` only | `Sentry` + `OTel` + `X-Request-Id` |
| **Feature management** | No flags | `VITE_FEATURE_*` → `flagsmith`/`launchdarkly` |
| **i18n** | No infra | `i18next` extraction (future) |

---

## 27. FINAL VERDICT — FAANG/ENTERPRISE BAR

### Would this frontend be approved at…

| Company | Verdict | Reason (specific to their bar) |
|---------|---------|--------------------------------|
| **Google** | ❌ No | No tests, 3.7 MB monolith, 11k hard-coded colors, hand-rolled stores, no ErrorBoundary, no `axe` — fails go/best-practices and accessibility review. Would require Phase A–C before internal dogfood. |
| **Microsoft** | ❌ No | Fails Microsoft accessibility (A11Y-CI) and perf budget (740 kB gzip). No `tsconfig` paths, no DI seams — would not pass PR review for a hospital product under HIPAA-adjacent review. |
| **Amazon** | ❌ No | No multi-tenant header/tenancy model, no retry/timeout/abort on transport, no bundle budget, no observability — fails operational excellence pillar. |
| **Stripe** | ❌ No | Stripe would immediately flag `DOCTOR`/`ADMIN` privilege collapse, localStorage token/user mirror, and missing CSRF as ship-blockers for a system touching billing — security review fails. |
| **Uber** | ❌ No | No code-splitting + no virtualization for large lists + no memo discipline — fails perf review for thousands of concurrent users on mobile/field devices. |
| **Shopify** | ❌ No | No design system, no tokens, no polaris-style primitives — design-system review fails (11k raw hex, 4 Avatar copies). |
| **Atlassian** | ❌ No | No testing harness (0%), no CI quality gates — fails Atlassian QA bar for any production frontend. |

### Single-paragraph why not

Every one of those companies enforces **four non-negotiables** for production frontends that operate on sensitive data at scale: (1) **test gates with measurable coverage**, (2) **bundle/perf budgets with route-level splitting**, (3) **least-privilege access control enforced end-to-end**, and (4) **design-system/token governance with accessibility coverage**. This codebase today has **0% test coverage, a 740 kB gzip monolith with zero splitting, `can()` returning `true` for entire roles, and 11k hard-coded colors with no `ui/`**. It is feature-rich and shows real product intent — but it does not meet the enterprise ship bar. After **Phases A–C (4–6 weeks, 2 seniors)** it credibly can.

---

## 28. TIMED ACTION PLAN

### 🔴 Immediate fixes — 1 day (ship-blockers that fit in a PR)

- [ ] **`config/env.ts` + `.env.example`** — make `API_BASE_URL` env-driven; remove `192.168.1.44:8888` literal from `lib/axios.ts:3` and `vite.config.ts:13`; verify `grep 192.168 dist/` = 0.
- [ ] **`ErrorBoundary` in `src/main.tsx:8`** + `RouteErrorBoundary` in `AppRouter` — eliminate full-app blank on render throw.
- [ ] **`console.*` → `lib/logger.ts` (DEV-gated)** — wrap `lib/axios.ts:87/284` errors behind `if (import.meta.env.DEV)`; add `eslint no-console` prod override.
- [ ] **`QueryClient` defaults in `main.tsx:8`** (`retry:1`, `refetchOnWindowFocus:false`, `staleTime:30s`).
- [ ] **`recharts-lazy.tsx` rename + TODO** — rename to prevent false confidence; file a follow-up issue for true lazy.

### 🟠 Short-term — 1 week (P0 close + test bootstrap)

- [ ] **Auth localStorage mirror removal** (`auth.store.ts:71` + `axios.ts:57`) + logout scrub test.
- [ ] **`usePermissions.ts:19` privilege fix** + `src/test/usePermissions.spec.ts` (30 cases).
- [ ] **Route-level `React.lazy` + `Suspense`** for `AppRouter` routes; **`vite manualChunks`**; **initial gzip ≤220 kB** verified in CI.
- [ ] **`lib/api/error.ts` (`AppError`/`isApiError`/`toAppError`)** + replace 20 highest-traffic `axios.isAxiosError` blocks (auth, patients, billing).
- [ ] **`vitest` harness + `msw` + `status-utils`/`time-utils`/`image-utils` unit tests** + CI jobs (`typecheck`, `test`, `build`, `bundle-budget`).
- [ ] **`tsconfig` path aliases `@/*`** + `eslint import/order` auto-fix.

### 🟡 Medium-term — 1 month (enterprise hardening)

- [ ] **True-lazy Recharts** (`ui/charts/LazyRecharts`) + vendor split; **lucide subset**; bundle targets met.
- [ ] **`src/ui/` primitives v1** (Button/Input/Select/Card/Table/Badge/Drawer/Spinner/KpiCard/PageHeader) + **tokens** + Tailwind preset; migrate 3 pilot pages.
- [ ] **God-component decomposition v1**: `CreateInvoiceWorkspacePage`, `DoctorProfileScreen`, `DepartmentsSpecialtiesWorkspace` split into `sections/` + `hooks/`.
- [ ] **Remove `localStorage` domain overrides** (doctor status, patient customs, completed-meds, triggered-notifications) — backend source-of-truth.
- [ ] **A11y pass v1**: focus traps for drawers, `aria-live` for toasts, `axe-core` in CI, contrast audit.
- [ ] **All `*.api.ts` get `zod` DTO + `unwrapData` normalization**; delete `as unknown as Record<string,unknown>` at boundaries; fix 40+ eslint warnings.
- [ ] **`AbortController`/timeout + `X-Request-Id` + `X-Tenant-Id` + request helpers** in `lib/api/client.ts`.

### 🟢 Long-term — 3–6 months (platform maturity)

- [ ] **OpenAPI → `openapi-typescript` codegen** replaces hand-written DTOs; `msw` contract tests per domain.
- [ ] **Backend `HttpOnly` cookie migration + CSRF** (`Set-Cookie` + `credentials:'include'`).
- [ ] **Multi-tenant routing + hospital-switcher** (tenant-scoped caches, tenant-scoped localStorage namespaces, `TenantContext`).
- [ ] **Observability** (Sentry + OTel + `X-Request-Id` correlation) + feature flags + i18n.
- [ ] **Ladle/Storybook + visual regression** + per-feature `README.md` + `ARCHITECTURE.md` + `ADR/` + `CODEOWNERS`.
- [ ] **Playwright E2E smoke suite** (auth + appointments + OPD + billing + reports) + `bundlesize` + `axe` + `npm audit` required in CI.

---

## 29. APPENDIX — EVIDENCE INDEX

### Build / Stack facts

| Artifact | File | Line/evidence |
|----------|------|---------------|
| No Zustand/Axios deps | `package.json` | `dependencies: @tailwindcss/vite, @tanstack/react-query, lucide-react, react, react-dom, react-router, recharts, tailwindcss` — zero `zustand`, zero `axios` |
| Vite config | `vite.config.ts` | `:8` plugins `[react(), tailwindcss()]`, `:13` `proxy "/api" → http://192.168.1.44:8888` |
| TS config | `tsconfig.app.json` | `:9` `skipLibCheck`, no `paths`, `:16` `jsx:react-jsx`, `:12` bundler resolution |
| Entry | `src/main.tsx` | `:8` `new QueryClient()` naked, `:10` `BrowserRouter` + `App` |
| CSS | `src/index.css` | `:1` `@import url(fonts.googleapis.com)`, `:5` `--font-sans/--font-body`, `:10` scrollbar thin |
| Build output | `dist/` | `index-Bj4-BLJp.js 3.736 MB (740 kB gzip)`, `index-QOKJg1Ly.css 108 kB`, chunks warning, 2872 modules |
| Lint | `eslint.config.js` | `:9` ignores `dist,node_modules`, `:12` flat `js+tseslint+reactHooks+reactRefresh` |

### Counts (mechanically verified)

| Metric | Value | Command |
|--------|-------|---------|
| Source files under `src/` | **450** | `find ./src -type f \| wc -l` |
| Total LOC | **~165k** | `find src -name *.ts -o -name *.tsx \| xargs wc -l` |
| Hard-coded hex colors | **11207** | `grep -rn "#[0-9A-Fa-f]{3,6}" src \| wc -l` |
| `Record<string,…>` | **595** | `grep -rn "Record<string" src \| wc -l` |
| `as unknown`/`as any`/`@ts-*` | **204** | `grep -rn "as unknown\|as any\|@ts-" src \| wc -l` |
| `console.*` | **171** | `grep -rn "console\." src \| wc -l` |
| `useEffect` / hooks density | **563** `useEffect`+`useMemo`+… hits | `grep -rn "useEffect\|useMemo\|useCallback" src \| wc -l` |
| Custom hooks `export function use*` | **151** | `grep -rn "export function use" src \| wc -l` |
| `aria-*`/`role=`/`alt=` | **767** | `grep -rn "aria-\|role=\|alt=" src --include=*.tsx \| wc -l` |
| `TODO/FIXME/HACK` | **0** | `grep -rn "TODO\|FIXME" src \| wc -l` (domain `any`/`unknown` explains low count) |
| Tests under `src/` | **0** | `find src -name *.test.* -o -name *.spec.*` → only `node_modules/zod` |

### Key file anchors

| Concern | File(s) |
|---------|---------|
| Auth cookie storage | `src/lib/cookie-token-storage.ts:1` (`SameSite=Strict`, `secureFlag()`) |
| API client (fetch) + 401 RTR | `src/lib/axios.ts:1` (`API_BASE_URL http://192.168.1.44:8888`): `:34` `failedQueue`, `:40` `processQueue`, `:51` `customFetch`, `:115` 401 queue, `:202` RTR |
| Auth store (external-store) | `src/features/auth/store/auth.store.ts:1` (`loadInitialState:11`, `saveState:71`, `hms-auth-storage:v1`, `hms-user:v1`) |
| Permissions | `src/permissions/permissions.constants.ts:1` (760 lines), `src/permissions/usePermissions.ts:19` (`DOCTOR`/`ADMIN` god returns), `src/permissions/guards.tsx:18` (`RouteGuard`) |
| Nav + theming | `src/constants/navigation.ts:1` (`ROLE_NAV_GROUPS`, `ROLE_LABEL`, `PP/RB`), `src/components/layout/NavRail.tsx:34`, `src/components/layout/Header.tsx:430`, `src/components/layout/HMSAppShell.tsx:236` |
| Routing | `src/app/routes/routeConfig.tsx:160` (`AppRoutes` composition), `src/app/routes/routes.ts:1` (`ROUTES` 69 entries), `src/app/routes/ProtectedRoute.tsx:10` |
| Patient portal | `src/features/patients/context/PatientPortalContext.tsx:173` (`PatientPortalProvider`, `mapApiToFamilyMember:81`, double-fetch `:180`+`:221`) |
| Stores (non-auth) | `src/features/opd/store/consultationStore.ts:11`, `src/features/prescriptions/store/prescription.store.ts:11` |
| Fat pages | `src/features/users/pages/DepartmentsSpecialtiesWorkspace.tsx:2690`, `src/features/reports/pages/ReportsOverview.tsx:2506`, `src/features/doctors/components/DoctorProfileScreen.tsx:2475`, `src/features/reports/pages/KpiDetail.tsx:2415`, `src/features/billing/pages/CreateInvoiceWorkspacePage.tsx:2095` |
| Utils | `src/lib/time-utils.ts`, `src/lib/status-utils.ts:10` (status matrix), `src/lib/image-utils.ts:8`, `src/lib/intl-formatters.ts`, `src/common/components/recharts-lazy.tsx:1` (not lazy) |
| Validation | `src/features/auth/validation/login.schema.ts:7` (`loginSchema`, `validatePatientRegisterForm`) — single validation file |

### Review method

- Recursive traversal of `src/` (all 450 files) + `package.json`/`vite.config.ts`/`tsconfig`/`eslint.config.js`/`index.html`.
- Mechanical greps for `zustand/axios/localStorage/console/as unknown/Record<string/lazy/aria-/192.168/import.meta/VITE_` to cross-reference architectural claims.
- Live `npm run lint` (40+ findings) and `npm run build` (3.7 MB single chunk warning) executed locally.
- Each finding cross-referenced to at least one file:line anchor; scoring mapped to enterprise readiness questions the prompt required (10/25/50/100 devs, technical debt, single-system view).

---

> **Prepared as the file `docs/FRONTEND_ARCHITECTURE_AUDIT_REPORT.md` (this document).** Treat it as the Staff Review gate before hospital production deployment. The immediate next step is a 60-minute architecture review with engineering leadership to assign owners for P0-01 → P0-06 and to schedule Phases A–D.

