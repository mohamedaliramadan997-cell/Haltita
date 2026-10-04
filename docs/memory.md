# Project memory: حالتيتا (Haltita)

> The running log of context, decisions, bugs and changes. **Read this first in every session.** Update it at the end of every task.
> Newest entries go at the **top** of each log section.

---

## 1. Current status

| Item | Value |
|---|---|
| Phase | Phase 0 setup: T-002 done (Expo Go and web verified); T-001 still open |
| Next task | **T-001**: identifiers and accounts (owner); then T-003 |
| Content version | v3.1: 100 questions, 50 challenges, 50 missions, 15 punishments |
| Blockers | Permanent app ID not chosen (T-001); `com.example.haltita` placeholder in `app.config.ts` |

## 2. Environment and setup notes (no secret values here)

| Item | Value |
|---|---|
| App ID (iOS bundle and Android package) | `com.<owner>.haltita` *(set at T-001; permanent)* |
| Store name | حالتيتا – Haltita |
| Publisher | Owner's **personal** Apple and Google accounts |
| Expo SDK | *(record at T-005)* |
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
2. The owner's identifier for `com.<owner>.haltita` (decided at T-001).
