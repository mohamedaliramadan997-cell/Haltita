# PRD: حالتيتا (Haltita), mobile party game

> **Status:** v3.0 · **Owner:** Ali · **Last updated:** 2026-10-03 · **Platforms:** iOS + Android (both stores at launch)
> This file defines WHAT we are building and WHY. For how it's built, see `architecture.md`. For how it looks, see `design.md`. The game rules in §7 are the authoritative spec. If code and this file disagree, this file wins until it is updated.

---

## 1. Summary

**حالتيتا** is a bluffing party game for 4–8 friends in the same room, **each playing on their own phone**.

One player hosts a **room** and the others join it with a short code. Every round, one player secretly holds the real answer to a strange trivia question, and everyone else invents a convincing fake one. The **guesser** has to spot who is telling the truth.

Players collect **masks (أقنعة 🎭)** for fooling the guesser or catching the truth. Every round, a **challenge card** changes how everyone must answer, and each player carries a hidden **secret mission**. After 8 rounds:

- the player with the most masks is **سيد الأقنعة** (Master of Masks)
- the player with the fewest is **المكشوف** (the Exposed One) and takes the punishment the group agreed before the game.

Tagline: **اكدب.. بس بذكاء** (Lie… but smartly).

## 2. Problem

Bluffing trivia games are a hit at gatherings, but playing them on paper or on one shared phone is clumsy:

- Dealing secret roles means passing a phone or cards around, which is slow and easy to leak.
- Someone has to manage the cards, the timer and the score instead of playing.
- Scores are argued over.
- Questions repeat from night to night.

## 3. Solution

Everyone joins a room on their own phone:

- **Private things show only on your phone:** your secret mission, and whether you're the truth-holder or a liar this round.
- **Shared things show on every phone at the same moment:** the round's challenge, the question, the timer, the reveal and the scoreboard.
- **The app handles all the admin:** it deals the roles, keeps the score, runs the timer, tracks questions already used, and delivers the reveal with drama.

## 4. Target users

**Primary:** Arabic-speaking friend groups in the UAE (Egyptian and Gulf speakers), roughly 20–40, playing in person at gatherings, majlis nights and trips. Groups are 4–8 players, each with a smartphone.

**Secondary (later):** families and mixed groups (family content filter).

| Persona | Needs |
|---|---|
| **The Host** | Create a room, share the code, and start in under a minute, with light control buttons during the game |
| **The Player** | Join with a code and a name in under 20 seconds; always know from their own screen what to do now |
| **The Guesser** (rotating) | A clear, dramatic way to make the pick on their phone |

## 5. Goals and success criteria

| Goal | MVP measure |
|---|---|
| Fast start | Room created, 5 players joined and round 1 started in ≤ 90 s |
| Zero admin | Nobody calculates a score or deals a card by hand |
| Secrets stay secret | A player's role and mission appear only on that player's phone (and are never readable from other devices, per the database rules) |
| In sync | All phones show the same public phase within about 1 s |
| Resilient | A player or the host who drops out and comes back returns to the same game and phase |
| Replayable | About 12 game nights before any question repeats for the same host |

The MVP has no analytics. Success is judged by play-test sessions, which are logged in `memory.md`.

## 6. Scope

### 6.1 MVP: multi-phone rooms

| ID | Feature | Notes |
|---|---|---|
| F1 | Home | Create room · Join room · Rejoin last room (if one is active) · Solo demo · How to play · Settings · About |
| F2 | Create room | Host enters their name and gets a **5-digit room code** plus a share button (WhatsApp and others) |
| F3 | Join room | Enter the code and a name, then land in the lobby |
| F4 | Lobby | Live player list (4–8). The host arranges **seating order**, sets rounds (4/6/8/10/12, default 8), think timer (off/15/30/45/60 s, default 30) and missions (on/off), and **locks the punishment** (see §7.5). Start is enabled only when valid |
| F5 | Secret missions | Each player sees their own mission on their own phone and taps **جاهز** (ready) |
| F6 | Round flow | Intro → challenge → question → secret roles → think timer → answering → guess → reveal → scoreboard, synced across phones |
| F7 | Secret roles | Each answering player privately sees **صادق + the real answer** or **كداب** on their own phone |
| F8 | Challenge penalties | During answering, the host marks who broke the challenge (the table decides out loud) |
| F9 | Guess and reveal | The guesser picks on their phone, and the reveal plays on every phone at once |
| F10 | Automatic scoring | Masks change according to §7.3, animated on every phone |
| F11 | Mission reveal | Missions are revealed one by one on every phone; the host marks each done or not done |
| F12 | Results | سيد الأقنعة, المكشوف plus the punishment, full ranking, tie-breaks, and "play again" in the same room |
| F13 | Reconnect | Any player, host included, can close the app or lose signal and come back to the same game |
| F14 | No-repeat questions | Used question IDs are stored against the host; the pool resets when it is too small |
| F15 | How to play | Short illustrated rules, also reachable from a pause sheet mid-game |
| F16 | Language | Arabic (Egyptian) UI by default with RTL; English toggle. Cards always show Arabic with an English line underneath |
| F17 | **Solo demo mode** ("جرّب لوحدك", try it on your own) | One phone plays a full game with 3 simulated players who auto-ready and guess. Works offline. Required so store reviewers can test the app alone |
| F18 | **Kick player** | The host can remove a player from the lobby before the start (moderation) |
| F19 | **About and Reset my data** | About shows the version and links to the privacy policy and support. Reset deletes your question history and anonymous ID from the server and the device |
| F20 | **Server-busy state** | If the free database is at capacity: "السيرفر زحمة.. جرب كمان دقيقة". Running games are unaffected |
| F21 | Sound effects, haptics, animations | Shared moments (reveal, results) feel dramatic |
| F22 | Family mode | Hides questions tagged `familySafe: false` |
| F23 | **Store release, iOS and Android** | App Store and Google Play, Arabic and English listings |

### 6.2 Later phases

| ID | Feature | Phase |
|---|---|---|
| F24 | In-app voting for challenge penalties and missions (instead of the host marking them) | Extras |
| F25 | Host hand-over if the host leaves for good | Extras |
| F26 | Join by QR code or deep link | Extras |
| F27 | Offline single-phone mode (pass-and-play with real players) | Extras |
| F28 | Custom question packs · Stats | Extras |

### 6.3 Out of scope (for now)

- Named accounts or login (anonymous sign-in only)
- Public matchmaking or strangers joining rooms
- Ads, payments, in-app purchases
- Voice or video chat (players are in the same room)
- Skipping challenge or mission cards (see §7.6)
- Changing the scoring rules in settings (the house rules are fixed)

## 7. Game rules (authoritative spec)

### 7.1 Room and setup

- Players: **minimum 4, maximum 8**, each on their own phone. Names must be unique (case-insensitive, trimmed) and 1–16 characters long.
- The **host is also a player**. On top of playing, the host has a few control buttons.
- No joining after the game has started. Players already in the game can always **rejoin**.
- The host sets the **seating order (clockwise)** in the lobby. This order drives turn rotation.
- Every player starts with **3 masks 🎭**.
- If missions are on, each player gets **one unique random mission**, shown only on their own phone.
- Round 1's guesser is chosen **at random**. After that, the guesser role moves to the **next player in seating order** each round.

### 7.2 A round

| # | Step | What happens | Who advances it |
|---|---|---|---|
| 1 | **Challenge** | One challenge card is drawn at random, with no repeats within a game. It applies to every answering player | Host taps next |
| 2 | **Question** | One question is drawn from the unused pool. The guesser reads it aloud | Host taps next |
| 3 | **Secret roles** | One **truth-holder** is picked at random from the non-guessers. Every other answering player is a **liar**. Each sees their role on their own phone (the truth-holder also sees the real answer) and taps جاهز | Automatic once all are ready (the host can override after 20 s) |
| 4 | **Think** | A synced timer runs (if on) | Automatic when it ends (the host can end the timer early) |
| 5 | **Answering** | Players answer out loud in turn, starting after the guesser and going clockwise. Every phone shows the order. The host marks any player who broke the challenge | Host taps next |
| 6 | **Interrogation** | The guesser may ask up to **2 follow-up questions**. This is a reminder only and isn't enforced | (part of step 5) |
| 7 | **Guess** | The guesser picks exactly one answering player on their phone and confirms | Guesser (the host can pick on their behalf if the guesser is disconnected) |
| 8 | **Reveal and score** | Every phone shows the truth-holder, the real answer and the mask changes | Host taps next → scoreboard |

### 7.3 Scoring (house rules, fixed)

| Event | Masks 🎭 |
|---|---|
| Guesser picks the truth-holder | Guesser **+2**, truth-holder **+1** |
| Guesser picks a liar | That liar **+2**, truth-holder **+1** |
| Player broke the challenge | That player **−1** (at most once per player per round; the guesser can't be penalised) |
| Secret mission completed (end of game) | That player **+3** |

- Masks can't go below **0**.
- The truth-holder gets +1 in both cases.
- These values are **not configurable**.

### 7.4 End of game

1. After the last round, if missions are on, missions are revealed one by one on every phone. The host marks each as done or not done (table vote), and +3 is applied per completed mission.
2. The player with the most masks is **سيد الأقنعة** (winner). The player with the fewest is **المكشوف** and takes the locked punishment.
3. **Ties:** if players tie for the top spot or the bottom spot, play a **tie-break round** with normal rules and all players. Repeat until that position is decided, up to **3 tie-break rounds**; after that, the win or punishment is shared. The top tie is resolved first, then the bottom.
4. **Ending early:** the host can end the game from the pause sheet. Missions are still revealed and results use the current masks.
5. **Play again:** the same room and players go back to the lobby, and the host can change settings and the punishment before the next start.

### 7.5 Punishment

- The punishment is chosen **in the lobby, before the game starts**. The host picks **one** from the **built-in list** (15 items in `content.json`) **or** types a **custom punishment** (1–80 characters).
- Once the game starts, the punishment is **locked**: it's shown in the lobby summary and on the results screen, and can't be changed mid-game.
- The Start button stays disabled until a punishment is chosen.

### 7.6 No skipping

- **Challenge cards can't be skipped or redrawn.** Whatever is drawn applies to everyone answering that round.
- **Mission cards can't be skipped, swapped or redrawn.** Each player keeps the mission they were dealt for the whole game.
- The app offers no skip or redraw controls for either. The only way out is the host ending the game early.

### 7.7 What each phone shows (by phase)

| Phase | Answering players | Guesser | Host (also a player) |
|---|---|---|---|
| Lobby | Player list, settings summary | same | Settings, seating order, punishment, Start |
| Mission deal | **Own mission** (hold to reveal) + جاهز | same | Same + ready progress |
| Round intro | Round no., guesser name | "إنت المخمن!" | + next |
| Challenge | Challenge card | same | + next |
| Question | Question card | Same + "اقرا السؤال بصوت عالي" | + next |
| Secret roles | **Own role card** (hold to reveal) + جاهز | "استنى.. الكل بيشوف كارته" | Progress x/y + override after 20 s |
| Think | Synced timer | same | + end timer |
| Answering | Answer order, current turn | Order + "تقدر تسأل سؤالين" | + penalty toggles, next |
| Guess | "{guesser} بيختار…" | **Pick screen** | Same as their role + "pick for guesser" if the guesser is disconnected |
| Reveal | Reveal animation + deltas | same | + next |
| Scoreboard | Ranking | same | + next round |
| Mission reveal | Mission of player N | same | + done / not done |
| Results | Winner, المكشوف, punishment, ranking | same | + play again / close room |

## 8. User stories (MVP)

- As the **host**, I create a room, send the code to the WhatsApp group, and see friends appear in the lobby live.
- As a **player**, I type the 5-digit code and my name and I'm in.
- As a **player**, my role and mission appear only on my phone, and hide when I let go.
- As the **guesser**, I pick on my own phone and everyone watches the reveal together.
- As **anyone**, if my phone locks or the app closes, I reopen it and I'm back in the game.
- As the **host**, I lock in a punishment before we start so nobody can change it after losing.
- As a **returning group**, we get questions we haven't seen before.

## 9. Content

- The source is `content.json` (v3.1): 100 questions (Arabic and English, question and answer), 50 challenges, 50 missions, and 15 built-in punishments.
- Content is **fixed and versioned**. The app never edits, translates or generates it. Custom punishments are stored only in the room for that game.
- Questions 35 and 36 are tagged `familySafe: false`.

## 10. Edge cases

| Case | Expected behaviour |
|---|---|
| Wrong or unknown room code | "الكود ده مش موجود" (that code doesn't exist); the player stays on the join screen |
| Room full (8 players) or game already started | Join is refused with a clear message; rejoin by an existing member is still allowed |
| Duplicate name in the room | Inline error; the player picks another name |
| Fewer than 4 or more than 8 players, or no punishment chosen | Start disabled, with the reason shown |
| A player disconnects mid-round | The game continues. Their chip shows a "disconnected" badge. If they are the guesser at the guess step, the host can pick for them. If a secret-roles ack is missing, the host can override after 20 s |
| The host disconnects | Every phone shows "المضيف فصل.. مستنيينه" (the host dropped, waiting for them) and the game pauses. When the host reopens the app, the game resumes from the saved host state |
| The host never returns | The room ends after 30 minutes without the host (host hand-over is a later feature) |
| The app goes to the background while a secret is showing | The secret hides; on return the player must hold again |
| Unused question pool smaller than the number of rounds | The pool resets automatically, with a one-line notice to the host |
| Tie for first and last at the same time | Top tie first, then bottom, each with up to 3 tie-break rounds |
| All players tied | Treated as a top tie; if it's still tied after 3 rounds, everyone shares the win and nobody is punished |
| A penalty would take masks below 0 | Clamped to 0 |
| No internet | Home shows "محتاجين نت عشان نلعب" (we need internet to play); create and join are disabled; solo demo still works |
| Database at capacity (free plan) | "السيرفر زحمة.. جرب كمان دقيقة" (the server's busy, try again in a minute) on create/join; games already running continue |
| Offensive name or custom punishment | Basic profanity filter blocks it with an inline message; the host can kick a player in the lobby |

## 11. Non-functional requirements

| Area | Requirement |
|---|---|
| Platforms | iOS and Android phones; portrait only; the 2 most recent major OS versions minimum (exact minimums set at T-001 from the Expo SDK defaults) |
| Performance | Cold start under 3 s on a mid-range Android; phase sync across phones within about 1 s; 60 fps animations |
| Reliability | Crash-free sessions ≥ 99.5% (Sentry); full recovery after a restart for both players and the host |
| Security and privacy | No personal data beyond a display name; secrets visible only to their owner; App Check on; data deletion available |
| Accessibility | Contrast ≥ 4.5:1, 48 dp touch targets, screen-reader labels, Reduce Motion respected |
| Localisation | Arabic (RTL, default) and English; Arabic-Indic digits in the Arabic UI (except room codes) |
| Cost | $0 a month to run at launch (Firebase Spark, Sentry free, EAS free). Fixed costs are store fees only: Apple $99/year, Google $25 one-time |
| Compliance | Store policies (Apple App Review, Google Play); privacy policy published; age rating about 12+ |

## 12. Constraints and assumptions

- **Internet is required** for rooms (Firebase). Solo demo mode works offline.
- **Both iOS and Android at launch**, published under the owner's **personal** developer accounts.
- The free Firebase plan caps the app at **100 phones in rooms at once** (about 16 games). The upgrade path is in `architecture.md` §18.
- New personal Google Play accounts must run a **closed test with ≥ 12 testers for 14 consecutive days** before production. Plan the friend group as beta testers.
- Development happens **locally in VS Code on the owner's Windows PC**. Expo Go is used early; development builds come from the hardening phase onwards.

## 13. Open questions

1. Rebrand the print-and-play PDF to حالتيتا with masks?
2. The owner's identifier for the permanent app ID (`com.<owner>.haltita`) is decided at T-001.
