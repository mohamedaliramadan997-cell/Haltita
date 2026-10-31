# Rules for the AI coding assistant: حالتيتا

> **v3.0 · 2026-10-03.** Read this file at the start of **every** session, together with `memory.md` and `tasks.md`.
> These rules override your defaults. If a rule blocks the task, stop and ask; don't work around it.

---

## 1. How to work

1. **Start of session:** read `memory.md` (status and decisions), then `tasks.md` (the next unchecked task). Say which task you are taking before writing code.
2. **One task at a time.** Only do the named task. Don't build ahead, refactor unrelated code, or "improve" files the task doesn't mention.
3. **Before coding,** list the files you will create or change and why, in 3–6 bullets.
4. **After each task:**
   - run `npm run typecheck`, `npm run lint` and `npm test` (and `npm run test:rules` if the rules changed), and report the results
   - tick the task in `tasks.md`
   - add a session entry to `memory.md`
   - suggest the commit message and branch name
5. **When unsure** about scope, rules or design, ask one clear question. Don't guess.
6. **Fix format (owner's preference):** for bug fixes and small edits, give **exact find-and-replace instructions** (file path, the exact text to find, the exact replacement), not full-file rewrites. Rewrite a whole file only when it's new or the change touches more than about 60% of it, and say so.
7. **Environment:** the owner develops **locally in VS Code on a Windows PC** and pushes to GitHub.
   - **Early phases:** test with **Expo Go** (`npx expo start`, phone on the same Wi-Fi; add `--tunnel` if it can't connect) and **browser tabs** (`--web`) as extra players.
   - **From T-080 onwards:** test with **development builds** (`expo-dev-client`) built by EAS.
   - Never suggest steps that need Android Studio, Xcode or a local emulator.

## 2. Sources of truth

| Topic | File | Rule |
|---|---|---|
| Game rules, scoring, no-skip, punishment lock | `prd.md` §7 | Implement exactly. **Never** change a number or rule without the owner's approval |
| Stack, data model, security, cloud, CI/CD, observability, scaling | `architecture.md` | Follow it; the coverage index is in §0 |
| Visual style and copy tone | `design.md` | Theme tokens only |
| Game content | `src/content/content.json` | **Read-only** (§7) |
| History and decisions | `memory.md` | Check it before re-deciding anything |

## 3. Architecture rules

- **All game logic lives in `src/engine/`** as pure TypeScript: no React, no Firebase, no AsyncStorage, no `Math.random`, no `Date.now()` in reducers. Seeds and `now` come in through actions.
- **Online:** only the host runs the engine (`HostRunner`). Other phones send intents and render `public` plus their own `private` node. **Never** run the reducer on a non-host phone.
- **Demo:** `DemoSync` runs the same reducer locally with bots. Phase components must not know which `GameSync` they use.
- **Every state change goes through an intent or action,** the host's included. There is no second code path.
- **The host validates actor, phase and payload** for every intent before reducing.
- **Atomic writes:** `public`, `private/*` and `hostState` go in **one** multi-path `update()`.
- **UI never computes game results** (scoring, winner, turn order, truth-holder).
- **Phase-driven rendering:** room and demo screens render from `phase`. **Never** navigate in a handler that also sends a phase-changing intent.
- **Overlays don't own transitions:** when they finish, send the intent that advances the game.
- **Arrays:** `readyIds`, `missionReadyIds` and `penalties` start as `[]`. Firebase drops empty arrays, so normalise them to `[]` on read.
- **No skip or redraw** for challenges or missions, anywhere, including debug UI.
- **The punishment is locked at `START_GAME`** until `PLAY_AGAIN`.
- **Connect to Firebase only inside a room** (`goOnline` on enter, `goOffline` on leave).
- Components stay under about 200 lines; functional components and hooks only (except the `ErrorBoundary`).

## 4. Secrets, security and privacy

- `truthHolderId`, roles and missions must **never** appear in `public` before their reveal phase, in another player's `private` node, in logs, in Sentry events, or in error messages.
- **Add a projection leak test whenever a field is added to `public`.**
- Security rules (`firebase/database.rules.json`) are code: change them only inside a task, test them in the emulator, and deploy only after CI passes.
- **Never commit** secrets, `.env` files, service-account keys or store credentials. Use EAS environment variables and GitHub secrets. `.env.example` lists the names only.
- Every rule-enforced limit (sizes, throttles, ≤ 8 members) is also checked on the client for a friendly message. The client check is **never** the only check.
- Names and custom punishments go through `lib/profanity.ts` (a local Arabic/English list) before they are sent.
- **No analytics or tracking SDKs.** The only third-party data flow is Sentry crash reporting, configured per §6.

## 5. Libraries

**Approved:**

| Purpose | Library |
|---|---|
| App and tooling | Expo SDK, expo-router, expo-dev-client, TypeScript, eas-cli (dev), firebase-tools (dev) |
| Backend | `firebase` JS SDK (Realtime Database, Auth, App Check `CustomProvider`) |
| App Check (native) | `@react-native-firebase/app` + `@react-native-firebase/app-check`, **only** to obtain App Check tokens (bridged into the JS SDK) |
| State and storage | zustand, @react-native-async-storage/async-storage |
| UI | react-native-reanimated, react-native-gesture-handler, react-native-svg, @expo-google-fonts/lalezar, @expo-google-fonts/cairo |
| Device | expo-haptics, expo-audio, expo-keep-awake, expo-crypto, expo-localization |
| Observability | `@sentry/react-native` (with its Expo config plugin) |
| Testing | jest-expo, @testing-library/react-native, @firebase/rules-unit-testing |

**Don't add without asking first:** any other dependency. When asking, say what it's for, its size, and why an approved library can't do it.

**Avoid:**

| Avoid | Use instead |
|---|---|
| Other `@react-native-firebase/*` modules (database, auth, crashlytics) | The JS SDK and Sentry |
| Firestore, Supabase, custom servers, Cloud Functions | RTDB + rules (Cloud Functions need the paid plan) |
| Redux, MobX, Context for game state | Zustand + Firebase subscriptions |
| styled-components, NativeWind/Tailwind, UI kits | `StyleSheet` + theme tokens |
| i18next | `src/i18n` |
| `Math.random()` in game logic | `rng.ts` |
| `expo-av` | `expo-audio` |
| Analytics SDKs (Firebase Analytics, Amplitude, etc.) | None (privacy decision D-007) |

## 6. Logging and error handling

- **Logger only:** use `lib/logger.ts` (`log.info/warn/error`). It prints to the console in development and sends to Sentry in production. **No raw `console.log`** in app code; lint enforces this.
- **Sentry:**
  - `sendDefaultPii: false`
  - `beforeSend` scrubs names, room codes, roles, and mission or question IDs
  - the uid is hashed before attaching
  - breadcrumbs carry phase names, intent types and connection changes only
- **Engine:** throw `GameError(code)` (`INVALID_PHASE`, `NOT_ALLOWED`, `UNKNOWN_PLAYER`, `GUESSER_CANNOT_ANSWER`, `NOT_ENOUGH_PLAYERS`, `NO_PUNISHMENT`, …). Never return partial state.
- **HostRunner:** catch per intent, delete the bad intent, set `members/{uid}/lastError`, and report the code to Sentry. One bad intent must never stop the runner.
- **Firebase calls:** awaited with try/catch, and user messages come from i18n:
  - "الكود ده مش موجود" (that code doesn't exist)
  - "الأوضة مليانة" (the room is full)
  - "اللعبة بدأت خلاص" (the game has already started)
  - "السيرفر زحمة.. جرب كمان دقيقة" (the server's busy, try again in a minute)
  - "بالراحة شوية 🙂" (slow down a bit), when throttled
- **Connection:**
  - while `.info/connected` is false, show the banner and disable host controls
  - render only what comes back from the database
  - the host-away overlay behaves as defined in `prd.md` §10
- **App-level:** an `ErrorBoundary` reports to Sentry and offers "رجوع للرئيسية" (back to home); `lastRoom` is kept for rejoin.
- No silent `catch {}`. Every catch either recovers or reports.

## 7. Content rules

- **Never edit, reword, translate, reorder or invent** questions, answers, challenges, missions or built-in punishments. Content comes only from `content.json`.
- State stores **IDs only** (`q042`, `c13`, `m07`, `p05`). The custom punishment text is the only free text in game state.
- Validate the JSON at startup. A failure shows an error screen and is reported to Sentry.
- Content changes happen only on the owner's request: edit the JSON, bump `version`, log it in `memory.md`.
- **Brand:** حالتيتا. **Never** use "حلو وكداب", "Sweet & Liar", sugar cubes or "الأحلى". The truth label is **صادق**, and points are **masks (أقنعة)**.

## 8. Language and RTL

- No hard-coded user-facing strings. Every string goes in `src/i18n/ar.ts` and `en.ts`; Arabic (Egyptian, playful) is the default.
- Use `start`/`end` spacing, never `left`/`right`; mirror directional icons.
- Cards are always bilingual.
- `formatNumber()` gives Arabic-Indic digits in the Arabic UI. **Room codes always use Western digits.**

## 9. Version control, CI/CD and releases

- **Branches:** `main` is always releasable; one branch per task, `t/<task-id>-<slug>`; merge through a PR after CI passes.
- **Commits:** `T-0xx: <summary>`.
- CI (`.github/workflows/ci.yml`) must stay green. Never disable a test or lint rule to make CI pass; fix the cause or ask.
- **Versioning:**
  - bump `version` (semver) in `app.config.ts` only in release tasks
  - build numbers increment automatically through EAS
  - `runtimeVersion` uses the `appVersion` policy
- **OTA (`eas update`)** is only for JavaScript and asset changes. **Any native change** (a new native library, config plugin, permission, or Expo SDK upgrade) requires a new store build and a version bump.
- **Never** run `eas submit`, `firebase deploy` or `eas update --channel production` unless the current task says so and the owner has confirmed.

## 10. Quality bar

- TypeScript `strict`: no `any` and no `@ts-ignore` without an explanatory comment.
- Tests: 100% of `scoring.ts`; every reducer action; projection leak tests; rules tests (including throttles and the janitor); a demo bot game reaching results.
- Touch targets ≥ 48 dp; contrast per `design.md`; an `accessibilityLabel` on every control.
- Animations on the UI thread; Firebase listeners unsubscribed on unmount.
- Keep web compatibility for development testing: native-only modules (App Check native, haptics, keep-awake) sit behind `lib/` wrappers that no-op on web.

## 11. Store compliance (never break these)

- **No new device permissions** without the owner's approval and a matching store-declaration update.
- **No new data collection** without updating the privacy policy, Apple privacy labels and Google Data safety (`architecture.md` §19).
- Solo demo mode must always reach results with no network, because reviewers depend on it.
- Keep `ITSAppUsesNonExemptEncryption=false` unless the encryption usage changes.
