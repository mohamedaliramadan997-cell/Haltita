# Tasks: حالتيتا

> **v3.0 · 2026-10-03.** Legend: `[ ]` to do · `[~]` in progress · `[x]` done · `[!]` blocked. 👤 = done by the owner (accounts, payments, consoles).
> **Rule:** one task per session/branch (`t/T-0xx-slug`), in order. A task is done only when its "Done when" passes, CI is green, the box is ticked, and `memory.md` is updated.
> Features (`F1`–`F28`) are defined in `prd.md` §6.

---

## Phase 0: Accounts, repo and setup

- [~] **T-001** 👤 **Identifiers and accounts:** choose the permanent app ID `com.<owner>.haltita`; create an Expo account; create a private GitHub repo `haltita`; **start Apple Developer enrolment ($99/year) and the Google Play Console account ($25)** now, because approval can take days. · F23
  - Done when: the app ID is recorded in `memory.md` §2; the Expo and GitHub accounts exist; both store enrolments are submitted.
- [x] **T-002** **Create the Expo app:** `create-expo-app` (TypeScript + Router) in Codespaces; set `name`, `slug`, `ios.bundleIdentifier`, `android.package`; portrait only; remove the demo screens.
  - Done when: it opens in Expo Go (`--tunnel`) and on web.
- [x] **T-003** **Docs, content, AI entry point:** `docs/` (6 files + `assets/`), `src/content/content.json`, README, and a `CLAUDE.md`/`AGENTS.md` pointer to the docs.
- [x] **T-004** **Tooling:** `strict` TypeScript, ESLint (with `no-console`), Prettier, jest-expo; scripts `typecheck`, `lint`, `test`, `test:rules`.
- [x] **T-005** **Install the approved JS-only libraries** (`rules.md` §5, excluding the native-only ones). Record the Expo SDK version.
- [x] **T-006** **CI:** `.github/workflows/ci.yml` (install, typecheck, lint, test, `npm audit --audit-level=high`), Dependabot, and `main` branch protection that requires CI.
  - Done when: a test PR shows green checks.

## Phase 1: Foundation

- [x] **T-010** Theme tokens (`design.md`). Done when there are no hex values or font sizes outside `src/theme`.
- [x] **T-011** Fonts (bundled Lalezar and Cairo) and the splash screen.
- [x] **T-012** i18n and RTL, `formatNumber()` (room codes stay Western), `expo-localization` default. · F16
- [x] **T-013** Content loader and validation (100/50/50/15). Unit tests.
- [x] **T-014** Base UI: `Screen`, `Button` (primary/secondary/host/ghost), `Toast`, `Banner`, `ErrorBoundary`.
- [ ] **T-015** Art: `Masky` (6 poses, 8 tints), `MaskToken`, `Pattern`, emblems, from `docs/assets` references.
- [ ] **T-016** `lib/logger.ts` (console for now; Sentry is added in T-081) and `lib/profanity.ts` with tests.
- [x] **T-017** **Upgrade to Expo SDK 58:** upgrade every Expo package together (`expo@^58` + `npx expo install --fix`, following Expo's SDK 58 upgrade guide; React Native 0.88). Never a single-package bump (Dependabot PRs like #9 get closed). Also clears the 6 patch mismatches noted at T-005.
  - Done when: `expo-doctor` passes every check; typecheck, lint and tests pass; the app opens in Expo Go (SDK 58) and on web; `memory.md` §2 records the new versions; `.github/audit-allowlist.json` is reviewed (remove entries the audit no longer reports).

## Phase 2: Game engine (pure TypeScript, test-first)

- [ ] **T-020** Types and errors (`architecture.md` §6–7).
- [ ] **T-021** RNG and decks: seeded shuffle, no repeats, pool reset.
- [ ] **T-022** `START_GAME`: validation, seats, first guesser, missions, masks = 3, **punishment lock**. · F4, F5
- [ ] **T-023** Round flow: `READY_MISSION`, `BEGIN_ROUND`, `NEXT`, `READY_ROLE`, `FORCE_READY`, `TIMER_DONE`, `TOGGLE_PENALTY`. **There is no skip or redraw path.** · F6, F7, F8
- [ ] **T-024** Scoring: `SUBMIT_GUESS` deltas, −1 penalty, floor 0. **100% coverage.** · F10
- [ ] **T-025** End game: missions +3, ranking, top and bottom ties, up to 3 tie-breaks, shared results. · F11, F12
- [ ] **T-026** `END_EARLY`, `PLAY_AGAIN`, plus a seeded full-game simulation test.
- [ ] **T-027** Projections: `projectPublic` and `projectPrivate`, with **leak tests for every phase**.

## Phase 3: Firebase foundation

- [ ] **T-030** 👤+AI **Firebase projects:** `haltita-dev` and `haltita-prod` (Spark, RTDB in **europe-west1**, Anonymous Auth on). `app.config.ts` selects the config from `APP_ENV`; local (`.env.local`) and EAS environment variables are set; `.env.example` is added.
- [ ] **T-031** Auth: anonymous sign-in with AsyncStorage persistence (`browserSessionPersistence` on web).
  - Done when: the same uid survives a restart, and two browser tabs get different uids.
- [ ] **T-032** **Security rules:** access (`architecture.md` §12.2), validation (sizes, ≤ 8 members) and **throttles** (§13).
- [ ] **T-033** **Rules tests** in the emulator, also run in CI. Cover every row of §12.2, the throttles and the janitor delete rule.
- [ ] **T-034** Presence: `.info/connected`, `onDisconnect`, server time offset, **`goOnline`/`goOffline` only inside rooms**.
- [ ] **T-035** Janitor: delete up to 10 rooms older than 24 h when a room is created. Tested in the emulator.

## Phase 4: Rooms and lobby

- [ ] **T-040** Create room: 5-digit code via a transaction, creation throttle, share sheet, **busy-state handling**. · F2, F20
- [ ] **T-041** Join and rejoin: CodeInput, error messages, `ht.lastRoom.v1` and the Home "rejoin" button. · F3, F13
- [ ] **T-042** Lobby: live list, seat-order drag (host), settings panel. · F4
- [ ] **T-043** Kick player (host, lobby only) with a rules check. · F18
- [ ] **T-044** PunishmentPicker: 15 built-in options or custom text (profanity filter), shown as locked after Start. · F4
- [ ] **T-045** Start: the `START_GAME` intent; all phones move together.

## Phase 5: Host runner and sync

- [ ] **T-050** `GameSync` interface, `sendIntent`, `useRoom` (normalise arrays, `lastError` toasts).
- [ ] **T-051** **HostRunner:** validate → reduce → one atomic multi-path update → delete the intent. Tests for actor, phase and payload rejection, and for the runner surviving bad intents.
- [ ] **T-052** Host resume from `hostState` (manual test: kill the host mid-round).
- [ ] **T-053** Question history per host (`hosts/{uid}`) with pool reset. · F14

## Phase 6: Game screens

- [ ] **T-060** Room shell: `PhaseSwitch`, `HostControls`, `PauseSheet` (end game with a confirm).
- [ ] **T-061** `GameCard` + `HoldToReveal` (hides on release, background and blur), with component tests.
- [ ] **T-062** MissionDeal (ready progress, force-ready after 20 s). · F5
- [ ] **T-063** RoundIntro, ChallengeFlip, QuestionView (role-aware, `prd.md` §7.7).
- [ ] **T-064** SecretRole (truth or liar card; the guesser's waiting view; force-ready). · F7
- [ ] **T-065** ThinkTimer (synced from `thinkEndsAt`; the host can end it early).
- [ ] **T-066** Answering (order, host penalty toggles, guesser reminder). · F8
- [ ] **T-067** Guess (picker for the guesser; waiting view for others; the host picks if the guesser is disconnected). · F9
- [ ] **T-068** Reveal (synced) and Scoreboard. · F9, F10
- [ ] **T-069** MissionReveal. · F11
- [ ] **T-070** Results, tie-break, play again, close room. · F12
- [ ] **T-071** Rules, Settings (language, sound, haptics, family mode, **Reset my data**) and About (version, privacy and support links). · F15, F19

## Phase 7: Solo demo mode

- [ ] **T-075** `DemoSync` + bots: a local reducer; bots ready after 1–2 s and guess at random; no network. · F17
- [ ] **T-076** Demo route and the Home "جرّب لوحدك" (try it on your own) entry, reusing the phase components.
- [ ] **T-077** A CI test: a full demo game with bots reaches `results`.

## Phase 8: Production hardening

- [ ] **T-080** **Development builds:** `expo-dev-client`, `eas.json` profiles (development, preview, production), APP_ENV-based bundle-ID suffix `.dev`. Install the dev build on the owner's phone (Android APK; iOS once the Apple account is active).
- [ ] **T-081** **Sentry:** SDK and config plugin, source-map upload during EAS Build, `beforeSend` scrubbing, hashed uid, environment tags, logger wired up.
  - Done when: a test crash appears in Sentry with a readable stack trace and no personal data.
- [ ] **T-082** **App Check:** `@react-native-firebase/app-check` (Play Integrity / App Attest) bridged to the JS SDK through `CustomProvider`, debug tokens for dev and CI, enforcement **on in prod only**.
  - Done when: a non-app request is rejected in prod and the dev build works.
- [ ] **T-083** Connection UX: offline banner, host-away overlay, room-ended after 30 minutes, disconnected badges.
- [ ] **T-084** Animations (with a Reduce Motion fallback). · F21
- [ ] **T-085** Haptics and sound (`lib/` wrappers, settings, credits logged). · F21
- [ ] **T-086** Keep-awake on room and demo routes.
- [ ] **T-087** Family mode (host setting). · F22
- [ ] **T-088** Accessibility and RTL pass; device matrix check (`architecture.md` §17).
- [ ] **T-089** Performance check: cold start under 3 s on a mid-range Android; no dropped frames on reveals.

## Phase 9: Beta

- [ ] **T-090** **Privacy policy and support pages** (Arabic and English) on Firebase Hosting (prod), linked from About.
- [ ] **T-091** Deploy prod rules and hosting (`firebase deploy -P prod`) after CI passes; **monitoring setup** (Sentry alert rules; RTDB connections alert at 80 or a weekly check).
- [ ] **T-092** `release.yml`: tag `v*` → EAS Build (all platforms, production) → EAS Submit (TestFlight + Play internal).
- [ ] **T-093** 👤 **iOS beta:** first build in TestFlight; internal testers play a full game.
- [ ] **T-094** 👤 **Google Play closed test:** invite **≥ 12 testers** (the friend group), keep them opted in for **14 consecutive days**, and log the start date in `memory.md`.
- [ ] **T-095** Play-test #1 with a real group (checklist below); bugs logged as BUG-xxx tasks.

## Phase 10: Store release

- [ ] **T-100** Store listings (Arabic and English): name "حالتيتا – Haltita", descriptions, keywords, screenshots (phone sizes), icon.
- [ ] **T-101** 👤 Apple privacy labels and Google Data safety per `architecture.md` §19; age-rating questionnaires.
- [ ] **T-102** App Review notes (how to test: solo demo mode; the game needs 4+ phones) plus a short demo video link.
- [ ] **T-103** 👤 Submit iOS for review; apply for Play production access (after the 14-day closed test).
- [ ] **T-104** Release v1.0.0: tag, build, submit, staged rollout on Play (20% → 100%).
- [ ] **T-105** Post-launch: watch Sentry and store vitals daily for the first week; log the findings.

## Backlog (post-v1)

- [ ] In-app voting for penalties and missions (F24) · [ ] Host hand-over (F25) · [ ] QR / deep-link join (F26)
- [ ] Offline pass-and-play (F27) · [ ] Custom question packs, stats (F28)
- [ ] Blaze upgrade when peak connections reach 80 or more (`architecture.md` §18)

---

## Play-test checklist (T-095 and before every release)

- [ ] Room created and 5 players joined in under 90 s, on a mix of iPhone and Android
- [ ] Every phone showed the right thing for its role in every phase
- [ ] No secret was visible on the wrong phone
- [ ] Reveal and results happened at the same moment on all phones
- [ ] Scores were correct; the punishment couldn't be changed after Start; no way to skip a challenge or mission
- [ ] A player and the host each killed the app mid-round and recovered
- [ ] Tie-break triggered correctly (force a tie)
- [ ] Solo demo mode completes offline
- [ ] No Sentry errors from the session (or each one is logged as a bug)

## Store submission checklist

- [ ] App ID, version and build number correct · [ ] Privacy and support URLs live · [ ] Privacy labels / Data safety match the data actually collected
- [ ] Age rating done · [ ] Review notes + demo video · [ ] No debug UI, test tokens or dev Firebase config in the production build
- [ ] `ITSAppUsesNonExemptEncryption=false` · [ ] Screenshots in Arabic and English · [ ] Play closed test of 12+ testers for 14 days completed
