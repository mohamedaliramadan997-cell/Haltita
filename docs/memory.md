# Project memory: حالتيتا (Haltita)

> The running log of context, decisions, bugs and changes. **Read this first in every session.** Update it at the end of every task.
> Newest entries go at the **top** of each log section.

---

## 1. Current status

| Item | Value |
|---|---|
| Phase | Phase 1 foundation: T-010, T-011, T-012, T-013, T-014 and T-017 done. Phase 0 done except T-001 (store accounts pending) |
| Stopped at | 2026-11-01: T-014 finished on `t/T-014-base-ui`, not yet committed or merged |
| Next step | Commit T-014, open its PR and merge after CI passes, then start **T-015** from `main` |
| Next task | **T-015** (T-001 stays `[~]` until the Apple and Google accounts are approved) |
| Content version | v3.1: 100 questions, 50 challenges, 50 missions, 15 punishments |
| Blockers | Apple Developer and Google Play Console approval pending (T-001, not needed until release) |

## 2. Environment and setup notes (no secret values here)

| Item | Value |
|---|---|
| App ID (iOS bundle and Android package) | `com.mali.haltita` *(set at T-001, 2026-10-03; permanent)* |
| Store name | حالتيتا – Haltita |
| Publisher | Owner's **personal** Apple and Google accounts |
| Expo SDK | **58** (`expo` 58.0.22, React Native 0.88.1, React 19.3.0) *(upgraded at T-017, 2026-10-31)* |
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
- **Owner:** Ali (Dubai). Develops **locally in VS Code on a Windows PC** (ADR-034). Fixes are given as **find-and-replace instructions**.

## 4. Key decisions (ADR log)

| ID | Date | Decision | Why | Alternatives considered |
|---|---|---|---|---|
| ADR-035 | 2026-10-31 | **Language:** a saved choice wins; otherwise an English device gets English and every other device gets Arabic. **Direction:** Arabic is RTL and English is LTR, and a change restarts the app once with `reloadAppAsync` from `expo` | Reconciles "Arabic by default" (`prd.md` F16) with "`expo-localization` default" (T-012); React Native only applies a direction change after a restart | Always Arabic until toggled; English UI kept RTL |
| ADR-034 | 2026-10-31 | Develop **locally in VS Code on the owner's Windows PC** (was GitHub Codespaces); GitHub stays the source of truth through branches and PRs. Still no steps that need Android Studio, Xcode or a local emulator | Owner request | Stay on Codespaces |
| ADR-033 | 2026-10-18 | Type tokens `cardSub` 13/19 and `caption` 12/17 (were 13/18 and 12/16) | Meet `design.md`'s own rule: Cairo line height ≥ 1.4× | Keep the table values and drop the rule |
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

### 2026-11-01: T-014 Base UI

- **Done:** `src/components/ui/`: `Screen` (safe area, padding, background; takes `style`), `Button` (primary/secondary/host/ghost; `disabledReason` shows as a caption above it; `minHeight` so scaled text isn't clipped), `Toast` (`showToast(message)` from anywhere, one `<Toast />` in `app/_layout.tsx`, 2.5 s, the latest replaces the current one), `Banner` (`offline`/`hostAway`, display only) and `ErrorBoundary` (wraps the Stack and Toast in `app/_layout.tsx`). `ContentErrorScreen` and the placeholder Home now use `Screen`.
- **"رجوع للرئيسية" restarts the app:** `reloadAppAsync` on native, `location.assign('/')` on web. The boundary has unmounted the navigator, and a remounted one would restore the crashed route. A restart opens on Home and keeps AsyncStorage, so `lastRoom` survives for rejoin.
- **New copy, not from `design.md` §8 (owner to review):** `crashMessage`: "حصلت مشكلة.. معلش" / "Something went wrong, sorry". `backHome` ("رجوع للرئيسية") comes from `rules.md` §6; its English "Back to home" is new.
- **Left for later tasks:**
  - **T-015:** add `Pattern` to `Screen`; the host button's crown is the 👑 emoji until an icon exists, if one is wanted.
  - **T-016:** report crashes (`componentDidCatch`) and failed restarts to `log.error` (`shortcut:` comments in `ErrorBoundary.tsx`).
  - **T-060/T-070:** the pink-outline destructive button (`design.md` §2.2) isn't a variant yet; T-014 only named four.
  - **T-083:** nothing renders `Banner` yet. Decide when it shows and how host away pauses play. It sits over the top of the screen, so it can cover a title.
  - **T-084/T-085:** the button's press scale snaps instead of animating over 90 ms, and there's no haptic (`shortcut:` comment in `Button.tsx`).
- **Tests:** `src/components/ui/ui.test.tsx`.
- **Checks:** typecheck, ESLint and tests (65) pass; test:rules passes (no tests yet); Prettier passes with line endings ignored (known CRLF issue, so `npm run lint` still fails at `prettier --check` on this checkout); `expo-doctor` 20/20; `expo export --platform all --clear` bundles.
- **Visual check:** a temporary route (not committed) in headless Chrome, device language Arabic: the button variants, disabled caption, toast, both banners and the crash screen match the spec, with 16 px margins on both sides.
- **Not verified:** any of this on a phone (safe-area insets, native banner and toast stacking over the Stack), the native restart from the crash screen, and the browser actually navigating from the crash screen (both only covered by mocked tests). English layout (LTR) wasn't checked with English labels, because the preview's labels were hard-coded Arabic.

### 2026-10-31: T-013 Content loader and validation

- **Done:** `src/content/index.ts` exports `content` (typed from the JSON), `validateContent()` and `contentProblems`, which is checked once at startup. It checks the version, the counts (100/50/50/15), sequential IDs (which also makes them unique), non-empty Arabic and English text, question `number` and boolean `familySafe`. `content.json` is unchanged.
- **Error screen (`rules.md` §7):** when `contentProblems` isn't empty, `app/_layout.tsx` shows `src/components/ui/ContentErrorScreen.tsx` instead of the app, and the splash still hides. T-014 can move it onto `Screen`.
- **New copy, not from `design.md` §8 (owner to review):** `contentError`: "في مشكلة في بيانات اللعبة.. حدّث التطبيق وجرب تاني" / "There's a problem with the game data. Update the app and try again."
- **Left for later:** lookups by ID and types per card come with the tasks that use them (T-020 onwards); the family-mode filter is T-087. **T-016 must report `contentProblems` to `log.error`** (`shortcut:` comment in `_layout.tsx`); Sentry scrubbing (T-081) must cover those messages because they contain question and mission IDs.
- **Tests:** `src/content/content.test.ts` (real file plus broken copies) and `src/components/ui/ContentErrorScreen.test.tsx` (layout with invalid content).
- **Not verified:** the error screen on a phone or in a browser; only a component test renders it, and the shipped content never triggers it.

### 2026-10-31: T-012 i18n and RTL

- **Done:** `src/i18n` (`ar.ts`, `en.ts`, `index.ts`) and `src/lib/formatNumber.ts`. Components call `useI18n()` for `language`, `strings` and `formatNumber`; `en.ts` is typed from `ar.ts`, so a missing key fails typecheck. The placeholder Home now uses `strings.appName`. Only `appName` exists so far: later tasks add their strings, taking the copy from `design.md` §8.
- **Language and direction (ADR-035):** the choice is stored with Zustand `persist` under `ht.language.v1`. `app/_layout.tsx` holds the splash until `initLanguage()` finishes. On native a wrong direction sets `allowRTL` and `forceRTL`, then restarts once; on web it sets `dir` and `lang` on `<html>` with no restart.
- **Restart guard:** `triedRTL` stops a restart loop on a device that ignores the direction change; the app then opens in the wrong direction rather than never opening. The write is awaited before restarting, which relies on `persist`'s `setState` returning the write promise (its type says `void`; a test covers it).
- **Room codes:** `formatNumber` only accepts numbers and room codes are strings rendered as they are, so they stay Western.
- **Config:** added the `expo-localization` plugin with `supportedLocales: ['ar', 'en']` (T-005 deferred it here). It adds no permissions, but it's a native change that only takes effect in a build, not in Expo Go.
- **For T-071:** the Settings toggle calls `setLanguage()`, and should show a failure toast because it rejects if storage fails. **For T-016:** `initLanguage()` has a `shortcut:` comment to report failures to `log.error`.
- **Checks:** typecheck, ESLint and tests (36) pass; test:rules passes (no tests yet); Prettier passes with line endings ignored (known CRLF issue, so `npm run lint` still fails at `prettier --check` on this checkout); `expo-doctor` 20/20; `expo export --platform all --clear` bundles. In a served web build under headless Chrome, `ar` gave Arabic and `rtl`, `en` gave English and `ltr`, and `fr` gave Arabic and `rtl`.
- **Phone check (owner, Samsung S25 Ultra in English, Expo Go SDK 58):** the app opens and shows "Haltita" on the plum background, which also closes **T-017**. Expo Go first showed "Something went wrong"; it cleared before the cause was identified (the server, bundle and firewall all checked out from the PC). If it comes back, start from the error log and `http://<PC IP>:8081/status` in the phone's browser.
- **Not verified:** Arabic on a real phone, and the direction change and restart in Expo Go or a build (an English phone never restarts). No screen yet uses `start`/`end` layout, so mirroring itself is also unchecked.

### 2026-10-31: T-017 Upgrade to Expo SDK 58

- **Done (owner asked to take it before T-012):** all Expo packages moved together to SDK 58: `expo` 58.0.22, React Native 0.88.1, React 19.3.0, Reanimated 4.7, Gesture Handler 3.3, Jest 30, `jest-expo` 58, `eslint-config-expo` 58. No app code changed.
- **Lockfile regenerated:** `expo install --fix` failed with `ERESOLVE` on a stale `@expo/ui` 57 entry in the old lockfile. Deleting `package-lock.json` and `node_modules` fixed it without `--force`, so indirect dependencies also moved to their newest allowed versions.
- **Audit allowlist:** the upgrade cleared `decode-uri-component` and `zod`, so both entries were removed. Only `@grpc/grpc-js` remains (Firestore isn't used).
- **Checks:** `expo-doctor` 20/20; typecheck, ESLint, tests (20), test:rules and the audit check pass; Prettier passes with line endings ignored (known CRLF issue); `expo export` bundles iOS, Android and web with `--clear`.
- **Not verified:** the app on a phone in Expo Go (SDK 58). T-017 stays `[~]` until the owner confirms it.
- **For later tasks (from the SDK 58 notes):**
  - **T-012:** `expo-localization` no longer force-enables RTL on iOS from the device locale; layout direction follows `I18nManager`, so set it explicitly.
  - **T-014 and later:** the `StatusBar` `backgroundColor`/`translucent` props, `InteractionManager`, the `Touchable` root export and the `Modal` `animated` prop are gone; `ImageBackground` is deprecated.
  - **T-080:** R8 is on by default in Android release builds; test release builds, because libraries using reflection may need keep rules.
  - **T-092:** Node must be 22.13+, 24.3+ or 26+ (CI uses 24).

### 2026-10-31: T-011 Fonts and splash

- **Done:** `app/_layout.tsx` loads Lalezar 400 and Cairo 400/600/800 with `useFonts`, keyed by the `fonts` tokens, and holds the splash until they load. It imports per-weight subpaths (`@expo-google-fonts/cairo/400Regular`), so only these 4 `.ttf` files are bundled. The placeholder Home uses `typography.hero`.
- **Font failure:** the splash hides and the app opens with system fonts, so the game stays playable. **T-016 must send `fontError` to `log.error`** (`shortcut:` comment in `_layout.tsx`).
- **Splash:** `assets/images/splash-icon.png` is now a 1024×1024 transparent PNG with the wordmark (cream with a pink offset shadow) and the tagline "اكدب.. بس بذكاء", on the `plum900` background from `app.config.ts`; `imageWidth` went from 76 to 200. It was rendered from the real fonts with headless Chrome (no new dependency; the HTML source isn't committed). The text is kept inside the central circle that Android 12+ can mask.
- **Tests:** `src/theme/fonts.test.tsx` (4 tests: all tokens loaded; splash held while loading; hidden on load; hidden on font failure). It lives outside `app/` because Expo Router treats every file there as a route.
- **Checks:** typecheck, ESLint, tests (20) and test:rules pass. `npm run lint` still fails at `prettier --check` on this Windows checkout (known CRLF issue, now 17 files); `prettier --check --end-of-line auto .` passes. `expo export --platform web` bundles exactly the 4 fonts, and a served web build showed the wordmark in Lalezar.
- **Not verified:** the native splash on a real device. Expo Go shows its own splash, so check it on the first development build (T-080). Fonts in Expo Go on a phone are also unchecked.
- **`expo-doctor`:** 20/21; the failure is the known patch mismatches (now 5), cleared by T-017.
- **CI audit (owner-approved, ADR-031 process):** 7 new high advisories blocked PR #12 and would block any PR. `npm update node-forge` (1.4.0 → 1.4.2, lockfile only) cleared 5 of them. `decode-uri-component` (ships in the app; denial of service only) and `zod` (build tooling) were added to the allowlist; both need major versions their parents don't allow, so **review them at T-017**. Removed the `braces` and `node-forge` entries, no longer reported.
- **Docs (owner request, ADR-034):** `rules.md`, `prd.md`, `tasks.md` (T-030), `README.md` and this file now say local development. Older log entries and ADRs that mention Codespaces stay as history.

### 2026-10-18: Added T-017 (SDK 58 upgrade)

- **Done:** added **T-017** to Phase 1 of `tasks.md` (owner request): upgrade all Expo packages to SDK 58 together (latest at the time: `expo` 58.0.14, React Native 0.88.0). It also covers the 6 patch mismatches from T-005. Placed at the end of Phase 1 so it lands before the game engine and Firebase work.

### 2026-10-18: T-010 Theme tokens

- **Done:** `src/theme/` with `colors.ts` (palette, `cardColors` per card type, semantic `colors`), `typography.ts` (font family names matching the `@expo-google-fonts` exports for T-011, the 9 type tokens, card auto-fit minimum 18, card font-scale cap 1.3), `layout.ts` (spacing, screen padding, radius, sticker `elevation`, card 63:88 at 82% width, sizes) and `index.ts`. Import with `@/theme`.
- **Enforced:** an ESLint `no-restricted-syntax` rule blocks hex literals and literal `fontSize`/`lineHeight`/`letterSpacing` outside `src/theme` (probe file: 3 of 3 caught).
- **Changed:** `app.config.ts` splash and Android adaptive-icon backgrounds now use `palette.plum900` (were Expo template blues), imported as `./src/theme/colors.ts`. The Expo config loader needs the `.ts` extension, so `tsconfig.json` got `allowImportingTsExtensions` (fine with `noEmit`). The placeholder Home uses `colors.background`/`colors.text`.
- **tsconfig:** added `"types": ["jest"]`. TypeScript 6 no longer loads `@types/*` automatically, so the first test file failed typecheck without it.
- **Tests:** `src/theme/theme.test.ts` (15 tests): every text pair in `design.md` §2.3 and every card band meets WCAG AA 4.5; pink on cream stays below it; line height ≥ font size.
- **Checks:** typecheck, ESLint, tests and test:rules pass; `npx expo config` shows `#2E0F35`; `expo export --platform web` bundles. `prettier --check .` passes for all changed files; it still flags the known CRLF-only files on this Windows checkout.
- **Line heights (ADR-033):** `design.md` §3's table broke its own 1.4× Cairo rule (`cardSub` 13/18, `caption` 12/16). The owner chose 13/19 and 12/17; `design.md` and `typography.ts` were updated together, and a test now enforces the 1.4× rule.
- **Dependabot PR #9 closed (owner):** it bumped only `expo-router` to SDK 58. Moving to SDK 58 must be its own task, upgrading all Expo packages together with `npx expo install --fix` / the Expo upgrade guide. Expect Dependabot to propose such partial bumps again; close them the same way.

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
