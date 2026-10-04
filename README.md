# حالتيتا – Haltita

A bluffing party game for 4–8 friends in the same room, each on their own phone (iOS and Android). The host creates a room with a 5-digit code. Each round has one truth-holder (صادق), the others bluff, and the guesser picks. Points are masks 🎭. The winner is سيد الأقنعة, and المكشوف does the punishment locked in the lobby. A solo demo mode with bots runs offline.

Arabic (Egyptian) UI by default with RTL, plus an English toggle; cards are bilingual.

## Stack

Expo (React Native) + TypeScript + Expo Router · Firebase Realtime Database (host-authoritative, anonymous auth, App Check) · Sentry · EAS Build, Submit and Update · GitHub Actions.

## Getting started (GitHub Codespaces)

```bash
npm install
npx expo start --tunnel   # scan the QR code with Expo Go
npx expo start --web      # browser tabs as extra players
```

Development builds (`expo-dev-client`) replace Expo Go from T-080 onwards.

## Docs

| File | Contents |
|---|---|
| [`docs/rules.md`](docs/rules.md) | Working rules for contributors and AI tools |
| [`docs/memory.md`](docs/memory.md) | Status, decisions (ADRs) and session log |
| [`docs/tasks.md`](docs/tasks.md) | The task list (`T-0xx`) |
| [`docs/prd.md`](docs/prd.md) | Scope and game rules |
| [`docs/architecture.md`](docs/architecture.md) | Structure, data, security, cloud and CI/CD |
| [`docs/design.md`](docs/design.md) | Visual style, theme tokens and copy tone |

AI tools start from [`CLAUDE.md`](CLAUDE.md) or [`AGENTS.md`](AGENTS.md).

## Content

Game content (100 questions, 50 challenges, 50 missions, 15 punishments) lives in `src/content/content.json`. It is fixed and versioned; the app never edits, translates or generates it.
