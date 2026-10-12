# Orchestration Plan — M FAUZAN HANIF Portfolio & CMS

## Objective
Lead, plan, and orchestrate the full end-to-end implementation across Phase 1 to Phase 5 in accordance with ORIGINAL_REQUEST.md and docs/ specifications.

## High-Level Roadmap
- **Phase 0: Survey & Scoping**
  - Spawn 3 parallel survey agents (Explorer + 2 Spec Miners) to examine existing codebase and specification documents (`docs/PRD.md`, `docs/DATABASE.md`, `docs/DESIGN.md`, `docs/ROADMAP.md`, `docs/features/`).
  - Synthesize reports and produce `PROJECT.md` with complete Feature Inventory, Module Architecture, Milestones, and Interface Contracts.
- **Phase 1: Dual-Track Initiation**
  - **Track A (Implementation)**: Decompose into 5 sequential/coupled milestones (M1 to M5) assigned to Sub-Orchestrators.
    - M1: Backend Data Layer & Database Seeding
    - M2: Landing Page & Public Showcases
    - M3: Admin Authentication & Protected CMS Dashboard
    - M4: Media Management & cPanel Deployment Readiness
    - M5: Final E2E Integration, Coverage Hardening & Acceptance
  - **Track B (E2E Testing)**: Spawn E2E Testing Orchestrator to design opaque-box test infrastructure and Tiers 1-4 test cases independently, publishing `TEST_READY.md`.
- **Phase 2: Milestone Execution & Quality Gates**
  - Execute M1 -> M2 -> M3 -> M4 -> M5 using standard Sub-Orchestrator iteration loops (Explorer -> Worker -> Reviewers -> Challengers -> Forensic Auditor).
  - Enforce binary audit veto: strictly zero tolerance for cheating/dummy code.
- **Phase 3: Final Acceptance & Handover**
  - Verify 100% test pass on Pest feature tests, Pint styling format, TypeScript typecheck, frontend production build, and cPanel dump readiness.
  - Report final completion to parent agent.
