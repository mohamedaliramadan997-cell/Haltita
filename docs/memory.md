# Project memory: حالتيتا (Haltita)

> The running log of context, decisions, bugs and changes. **Read this first in every session.** Update it at the end of every task.
> Newest entries go at the **top** of each log section.

---

## 1. Current status

| Item | Value |
|---|---|
| Phase | Phase 0 setup done: T-002 to T-006 done; T-001 in progress (app ID, Expo and GitHub done; store accounts pending) |
| Stopped at | 2026-10-18: T-006 done on `t/T-006-ci` (PR #8, CI green) |
| Next step | 1) Merge PR #8. 2) Start **T-010** from `main` |
| Next task | **T-010** (T-001 stays `[~]` until the Apple and Google accounts are approved) |
| Content version | v3.1: 100 questions, 50 challenges, 50 missions, 15 punishments |
| Blockers | Apple Developer and Google Play Console approval pending (T-001, not needed until release) |

## 2. Environment and setup notes (no secret values here)

| Item | Value |
|---|---|
| App ID (iOS bundle and Android package) | `com.mali.haltita` *(set at T-001, 2026-10-03; permanent)* |
| Store name | حالتيتا – Haltita |
| Publisher | Owner's **personal** Apple and Google accounts |
| Expo SDK | **57** (`expo` ~57.0.26, React Native 0.86.3, React 19.2.3) *(recorded at T-005, 2026-10-18)* |
| Firebase projects | `haltita-dev`, `haltita-prod`; RTDB `europe-west1`; Spark plan |
| Sentry | Project `haltita`; environments `development` / `preview` / `production` |
| EAS | Profiles `development` / `preview` / `production`; update channels `preview` / `production` |
| Environment variable names | `APP_ENV`, `EXPO_PUBLIC_FIREBASE_*`, `SENTRY_AUTH_TOKEN`, `EXPO_TOKEN`, `APPCHECK_DEBUG_TOKEN` |
| Google Play closed test | Start date *(T-094)*; needs ≥ 12 testers for 14 consecutive days |

## 3. Project snapshot (for a new tool or chat)

- **حالتيتا** is a bluffing party game for 4–8 friends in the same room, each on their own phone (iOS and Android). The host creates a room with a 5-digit code.
- Each round: one truth-holder, the others bluff, the guesser picks. Points are masks 🎭. There's a challenge card every round and a secret mission per player. The winner is سيد الأقنعة, and المكشوف does the punishment locked in the lobby.
- **Tech:** Expo + TypeScript; Firebase RTDB (host-authoritative, free Spark plan); anonymous auth; App Check; Sentry; EAS Build, Submit and Update; GitHub Actions.
- A **solo demo mode** (local engine with bots) exists for store reviewers and for development.
- **Origin:** started as a print-and-play game inspired by a YouTube show's game, then rebranded. Never reintroduce the old branding (`rules.md` §7).
- **Owner:** Ali (Dubai). Develops in **GitHub Codespaces**. Fixes are given as **find-and-replace instructions**.

## 4. Key decisions (ADR log)

| ID | Date | Decision | Why | Alternatives considered |
|---|---|---|---|---|
| ADR-032 | 2026-10-18 | The GitHub repo is **public**, so `main` branch protection (CI required) is free | Branch protection on private repos needs GitHub Pro | GitHub Pro (~$4/month); no enforced protection |
| ADR-031 | 2026-10-18 | CI audit fails on high/critical advisories **unless** they are in `.github/audit-allowlist.json` (reviewed; started with braces, node-forge, @grpc/grpc-js) | All current findings sit in Expo/Firebase/Jest with no fix that keeps SDK 57 (`npm audit fix --force` → SDK 44) | Strict `npm audit --audit-level=high` (always red); report only |
| ADR-030 | 2026-10-03 | Google Play closed test (≥ 12 testers for 14 days) is planned into the beta phase | Required for new personal Play accounts | — |
| ADR-029 | 2026-10-03 | Moderation: host kick in the lobby + local profanity filter + length limits; rooms are private | Store UGC expectations at low cost | Report/block system (overkill for private rooms) |
| ADR-028 | 2026-10-03 | No device permissions requested | Simpler review, better privacy | — |
| ADR-027 | 2026-10-03 | Rate limiting through security rules (room creation 1/60 s, intents 1/250 ms, size limits) + App Check | No server; free | Cloud Functions (needs the paid plan) |
| ADR-026 | 2026-10-03 | App Check through `@react-native-firebase/app-check`, bridged into the JS SDK with `CustomProvider`; enforced in prod. Needs development builds (not Expo Go). **Fallback if the bridge fails:** native RNFB for database and auth on mobile, keeping the JS SDK on web | Blocks scripted abuse at no cost | No App Check |
| ADR-025 | 2026-10-03 | Free room clean-up: host deletes on close + client janitor deletes rooms older than 24 h on create; rules allow deleting stale rooms | No Cloud Functions on the free plan | Scheduled function (Blaze) |
| ADR-024 | 2026-10-03 | Connect to Firebase only inside rooms (`goOnline`/`goOffline`) | Stretches the 100-connection free cap to about 16 concurrent games | Always connected |
| ADR-023 | 2026-10-03 | **Stay on Firebase Spark (free) for launch**; upgrade to Blaze when peak connections reach 80 or more (no code change) | $0 running cost | Blaze now; Supabase free (pauses after 1 idle week, rework); Neon (no realtime); Cloudflare Durable Objects (own server; future option) |
| ADR-022 | 2026-10-03 | Two Firebase projects (dev and prod), RTDB in europe-west1 | Testing never touches live games | Single project |
| ADR-021 | 2026-10-03 | CI/CD: GitHub private repo, task branches + PRs, GitHub Actions CI, tag-driven EAS Build + Submit, EAS Update for JavaScript-only fixes, Dependabot | Repeatable, store-ready releases from Codespaces | Manual builds |
| ADR-020 | 2026-10-03 | **Sentry** for crash and error tracking, PII scrubbed, source maps | Free tier; works with Expo | Crashlytics (native setup conflicts); none |
| ADR-019 | 2026-10-03 | **Solo demo mode** with bots via `DemoSync` | Store reviewers test alone; useful for development | Video + notes only |
| ADR-018 | 2026-10-03 | Publish under the owner's **personal** developer accounts | Fastest; no company paperwork | Company account (D-U-N-S) |
| ADR-017 | 2026-10-03 | **iOS and Android at launch** (was Android first) | Owner requirement | — |
| ADR-016 | 2026-10-03 | Latin name **Haltita**; ID `com.<owner>.haltita` | Owner confirmed | Hal Teeta |
| ADR-015 | 2026-09-26 | Punishment: built-in list (15) or custom text, locked at Start | Owner requirement | — |
| ADR-014 | 2026-09-26 | Challenge and mission cards can't be skipped or redrawn | Owner requirement | — |
| ADR-013 | 2026-09-26 | Scoring house rules fixed (+2/+1, +2/+1, −1, +3, start 3, floor 0) | Owner requirement | Adjustable |
| ADR-012 | 2026-09-26 | Rebrand: حالتيتا, masks, صادق, سيد الأقنعة / المكشوف, Masky mascots | Distance from the original show | — |
| ADR-011 | 2026-09-26 | Multi-phone rooms are the core MVP | Owner requirement | Single phone first |
| ADR-010 | 2026-09-26 | Host-authoritative: engine on the host phone, intents, atomic multi-path writes, `hostState` for resume | Secrets stay private; no server | Server or Cloud Functions |
| ADR-009 | 2026-09-26 | Room codes: 5 digits, Western numerals, transaction-created | Easy on Arabic keyboards | 4 letters |
| ADR-008 | 2026-09-26 | Host marks penalties and missions; force-ready after 20 s; host picks for a disconnected guesser | Simple; never freezes | In-app voting (backlog) |
| ADR-007 | 2026-09-26 | No accounts (anonymous auth), no analytics | Privacy and simplicity | — |
| ADR-006 | 2026-09-26 | Arabic UI by default with RTL; English toggle; bilingual cards | Target players | — |
| ADR-005 | 2026-09-26 | Firebase RTDB through the JS SDK (only App Check is native) | Works in Expo Go and on web for development | Firestore |
| ADR-004 | 2026-09-26 | Web kept compatible for development testing (browser tabs as players) | Test 4–8 players with one phone | — |
| ADR-003 | 2026-09-26 | Phase-driven rendering; no navigation on phase change | Avoids race bugs seen before | — |
| ADR-002 | 2026-09-26 | Pure TypeScript engine, seeded RNG, test-first, projection leak tests | Provable scoring, no leaks | — |
| ADR-001 | 2026-09-26 | Expo (React Native) + TypeScript | Easiest iOS + Android route; cloud builds without a Mac; JS background | Flutter; PWA |

## 5. Lessons from earlier projects (don't repeat)

- Initialise ready flags explicitly; Firebase drops empty arrays, so normalise them to `[]`.
- Never set the phase and navigate in the same callback.
- Check join status and connection status separately on reconnect.
- Overlays must send the next intent when they finish.

## 6. Session log

### 2026-10-18: T-006 CI

- **Done:** `.github/workflows/ci.yml` (PRs and pushes to `main`; Node 24; `npm ci` → typecheck → lint → test → test:rules → audit), `.github/scripts/audit-check.js` + `.github/audit-allowlist.json` (ADR-031), `.github/dependabot.yml` (npm security updates only, weekly). Docs: `architecture.md` §11/§12.
- **GitHub settings (owner-approved):** repo made **public** (ADR-032; history scanned first: no secret files or keys, only the owner's commit email is visible). Dependabot alerts and security updates on. `main` protection: required check `check` (the CI job), branches must be up to date, applies to admins too, no force pushes or deletions. No review requirement (solo owner).
- **Checks:** all local scripts pass; the audit check passes, and a negative test (one advisory removed from the allowlist) failed as expected. PR #8 CI run green (69 s).
- **Notes:**
  - The required check is named `check` (the job id). Renaming the job means updating branch protection too.
  - The emulator rules-test step comes with T-033 (`firebase-tools` + emulator in CI).
  - `.gitignore` covers `.env*.local` but not a plain `.env`; worth adding before T-030 creates Firebase config (owner's call; repo is public now).
  - Remove allowlist entries when the audit script prints "no longer reported" (e.g. after an Expo SDK upgrade).

### 2026-10-18: Design reference images (T-003 follow-up)

- **Done:** the owner added `icon-concept.png`, `masky-poses.png` and `mockup-screens.png` to `docs/assets/` (from the ElevenLabs flow; each a 1280×720 PNG). Contents checked against `design.md`; `docs/assets/README.md` status updated. `cards-concept.png` is still not generated (T-061).
- **Note:** `icon-concept.png` is 16:9 with the icon centred; crop it to a square before use (T-100), as `design.md` says.

### 2026-10-18: T-005 Approved JS libraries

- **Done:** installed with `npx expo install` (SDK 57-matched). Runtime: `firebase` 13, `zustand` 5, `@react-native-async-storage/async-storage` 2.2, `react-native-svg` 15.15, `@expo-google-fonts/lalezar`, `@expo-google-fonts/cairo`, `expo-haptics`, `expo-audio`, `expo-keep-awake`, `expo-crypto`, `expo-localization`. Dev: `@testing-library/react-native` 14, `@firebase/rules-unit-testing` 6. Reanimated, gesture-handler, expo-router and expo-font were already present (T-002).
- **Required peers added:** `expo-asset` (required by `expo-audio`; part of the Expo SDK) and `test-renderer` (dev; required by Testing Library 14).
- **Left out on purpose:** `@react-native-firebase/app` + `app-check` (native-only; App Check task), `@sentry/react-native` (T-081), `expo-dev-client` (T-080); the CLIs `eas-cli` and `firebase-tools` come with their tasks (EAS, T-033).
- **Config plugins NOT added:** `expo install` asked to add the `expo-audio` and `expo-localization` plugins to `app.config.ts`. `expo-audio`'s plugin adds a **microphone permission** by default (`rules.md` §11), and playback works without it; if a dev-build task needs it, add it with `microphonePermission: false`. The `expo-localization` plugin (RTL/locales) belongs to T-012.
- **Checks:** `typecheck` passes; `test` and `test:rules` pass (no tests yet); `expo-doctor` 20/21. A throwaway test (deleted) rendered with Testing Library and used zustand under jest-expo, and a Node `require` loaded `firebase/app`, `database`, `auth`, `app-check` (`CustomProvider`) and `rules-unit-testing`.
- **Known issues (not fixed, out of scope):**
  - `expo-doctor`: 6 patch mismatches that predate this task (`expo` 57.0.26→57.0.30, `expo-constants`, `expo-linking`, `expo-router`, `expo-splash-screen`, `jest-expo`). Bump them in a separate small task when the owner agrees.
  - Importing the real `firebase` SDK in the jest-expo `app` project fails (ESM + `.mjs` in `@firebase/util` aren't transformed). App tests should mock Firebase behind `lib/`; if a real import is needed, handle it in the Firebase task.
  - The `rules` jest project (T-004) has no TS/ESM transform, so `.test.ts` files there fail to parse. T-033 must add one (e.g. `babel-jest` with `babel-preset-expo`, or `ts-jest`, after asking).
  - On this Windows checkout (`core.autocrlf=true`) `prettier --check` flags 7 untouched files for CRLF line endings; in Codespaces it passes. A `.gitattributes` with `* text=auto eol=lf` would fix it (owner's call).
  - `npm audit`: 54 high / 16 moderate, still inside Expo's tree (see T-004 note); T-006 decides.
- **Next:** T-006.

### 2026-10-04: T-004 Tooling

- **Done:** dev dependencies installed with `npx expo install` (SDK-matched): `eslint` 9 + `eslint-config-expo` (flat config) + `eslint-config-prettier`, `prettier` 3, `jest` 29 + `jest-expo` + `@types/jest` 29 (pinned to 29 to match Jest). `eslint-config-prettier` is a small dev-only addition so ESLint and Prettier don't conflict.
- **Config:** `eslint.config.js` adds `no-console` (all files), and for TS files `no-explicit-any` and `ban-ts-comment` (`@ts-ignore`/`@ts-expect-error` only with a description). `.prettierrc` (single quotes, trailing commas, width 100); `.prettierignore` excludes `docs/`, `*.md` and `src/content/content.json` (read-only). `jest.config.js` has two projects: `app` (jest-expo) and `rules` (node, `firebase/**/*.test.ts`; T-033 wraps it in `firebase emulators:exec`). TypeScript `strict` was already on; `tsconfig.json` only reformatted by Prettier.
- **Scripts:** `typecheck` (`tsc --noEmit`), `lint` (`eslint . && prettier --check .`), `format`, `test` (app project), `test:rules` (rules project). Both test scripts use `--passWithNoTests` until real tests exist.
- **Checks:** `typecheck`, `lint`, `test` and `test:rules` pass; `expo-doctor` 21/21. A throwaway file confirmed all three lint rules fire and a jest-expo test runs (then deleted).
- **Found for T-006:** `npm audit --audit-level=high` already fails on `main` (19 high, all inside Expo's own tree: `braces` via Metro/micromatch, `node-forge` via `@expo/cli`; no fixed versions; `npm audit fix --force` would downgrade Expo to SDK 44). The new dev tools raise it to 50 high (same advisories). T-006 must decide how CI handles this (e.g. `--omit=dev` or an allowlist); ask the owner, don't silence it.
- **Next:** T-005.

### 2026-10-04: T-003 Docs, content, AI entry point

- **Done:** `AGENTS.md` (pointer to the docs for non-Claude tools, mirrors `CLAUDE.md`); `README.md` rewritten (summary, stack, Codespaces setup, docs index); `docs/assets/README.md` created (lists the four reference images from `design.md` and their status).
- **Content:** the owner's `content.json` added **unchanged** (same SHA-256) at `src/content/content.json`. Checked: `version` "3.1"; 100 questions (`q001`–`q100`), 50 challenges (`c01`–`c50`), 50 missions (`m01`–`m50`), 15 punishments (`p01`–`p15`); IDs unique and sequential; all fields present; `familySafe: false` only on `q035` and `q036`. Brand check: no banned terms. "sugar cubes" appears only in the q015 trivia answer (wombat droppings), not as branding, so it was kept.
- **Pending (owner):** the `docs/assets` images (needed by T-015).
- **T-001 update (owner):** the Expo account and the GitHub repo exist. Apple Developer and Google Play Console enrolments are in progress; the owner will complete them after coding and testing.
- **Checks:** `tsc --noEmit` passes. There are no `lint`/`test` scripts yet (T-004).
- **Next:** T-004.

### 2026-10-03: T-001 Identifiers and accounts (in progress)

- **Done:** set the permanent app ID `com.mali.haltita` in `app.config.ts` (`ios.bundleIdentifier` and `android.package`), replacing the `com.example.haltita` placeholder; recorded it in §2 (per ADR-016).
- **Checks:** `tsc --noEmit` passes. There are no `lint`/`test` scripts yet (T-004).
- **Still open (owner):** Expo and GitHub accounts, Apple Developer enrolment and Google Play Console account. T-001 stays `[~]` until both store accounts are approved.
- **Next:** T-003.

### 2026-10-03: T-002 Create the Expo app

- **Done:** scaffolded with `create-expo-app` (default template, **Expo SDK 57**, RN 0.86, TypeScript, Expo Router) on branch `t/T-002-create-expo-app`. Replaced `app.json` with `app.config.ts`: name حالتيتا, slug `haltita`, portrait only, phones only (`supportsTablet: false`), `userInterfaceStyle: dark`. Removed the demo screens, components, hooks and assets, plus their unused dependencies (`@expo/ui`, `expo-device`, `expo-glass-effect`, `expo-image`, `expo-symbols`, `expo-web-browser`).
- **Routes:** in the root `app/` per `architecture.md` §3. The SDK 57 template defaults to `src/app/`. The tsconfig alias `@/*` points to `src/*`.
- **Placeholder:** `com.example.haltita` is used for the bundle ID and package until T-001 sets the permanent ID. It **must** be replaced before the first EAS build.
- **Checks:** `tsc --noEmit` passes; `expo-doctor` passes 21/21; `expo export --platform web` builds. There are no `lint`/`test` scripts yet (T-004). 2026-10-03: the owner confirmed the app opens in Expo Go on their phone.
- **Docs fix (owner):** the folder `Docs\` was renamed to `docs/`, the unrelated `DESIGN.md` style reference was deleted, and `design_1.md` was renamed to `design.md`. The docs and `CLAUDE.md` were committed with this branch.
- **Next:** T-001 (app ID), then T-003.

### 2026-10-03: Architecture review (planning)

- **Done:** reviewed the docs against 15 production areas; filled the gaps (CI/CD, rate limiting, caching, error tracking, monitoring, scaling, store compliance); added solo demo mode, kick, reset-my-data and the busy state; renumbered tasks to `T-0xx`.
- **Next:** T-001.

### 2026-09-26: Design references and docs v2.0

- ElevenLabs flow "Haltita design assets": icon concept, Masky poses, 3-screen mockup (the owner downloads them to `docs/assets/`); the cards concept is still pending.
- Docs v2.0: rebrand, multi-phone rooms, masks scoring, no-skip rule, punishment lock.

## 7. Bugs and fixes

| ID | Date | Description | Root cause | Fix | Status |
|---|---|---|---|---|---|
| *(none yet)* | | | | | |

## 8. Changes to scope, architecture and design

| Date | File | Change | Reason |
|---|---|---|---|
| 2026-10-03 | all | v3.0: production-readiness sections; iOS at launch; F17–F23 added; tasks renumbered | Final review before coding |
| 2026-09-26 | content | v3.1: 15 built-in punishments | Punishment picker |
| 2026-09-26 | all | v2.0: rebrand + multi-phone rooms | Owner decision |

## 9. Open questions

1. Rebrand the print-and-play PDF to match the app?
2. ~~The owner's identifier for `com.<owner>.haltita`~~ Resolved 2026-10-03: `com.mali.haltita`.
3. How should CI handle `npm audit --audit-level=high` failing on advisories inside Expo's own dependencies with no fix (`braces`, `node-forge`)? Decide at T-006.
