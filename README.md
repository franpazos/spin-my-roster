# 🌀 Spin My Roster

**Spin My Roster** is a slot-machine-style NFL roster-building game inspired by fantasy football drafts.

Instead of a traditional snake draft, you spin a reel to randomly select an NFL team, then choose a position from that team to build your roster. Picks are staged before being committed, allowing limited undo and adding a strategic twist to the randomness.

This project is an MVP built for fun, experimentation, and future expansion.

---

## 🎮 How It Works

1. **Spin the reel** to randomly get an NFL team  
2. **Choose a roster position** (QB, RB, WR, TE, OL, DEF, HC)
3. **Select a player or unit** from that team:
   - Skill positions (QB, RB, WR, TE) → individual players
   - OL and DEF → team units
   - HC → real current NFL head coach
4. The pick is **staged**:
   - It appears immediately in your roster
   - You can undo it before committing
5. **Spin again** to commit the pick and continue
6. The game ends when the roster is complete

---

## 🧠 Game Rules & Design

- Teams can repeat (no limit per team)
- The same player cannot be selected twice
- Once a pick is committed, it cannot be undone
- You cannot skip a team without selecting a position
- Staged picks follow a **stage → commit** model (similar to Git)

The UI and UX are inspired by modern fantasy platforms like Sleeper, with a clean, dark, minimal aesthetic.

---

## 🛠️ Tech Stack

- **Next.js (App Router)** – React framework
- **JavaScript** – MVP intentionally kept JS-only
- **Tailwind CSS** – utility-first styling
- **shadcn/ui** – minimal UI primitives
- **ESPN Public APIs**
  - NFL teams
  - Current player rosters
  - Real NFL head coaches (including photos)
- **Vercel** – free hosting & deployment

---

## 🧩 Architecture Highlights

- Client-side state managed with `useReducer`
- Explicit game state machine (IDLE, SPINNING, STAGED, COMPLETE)
- Serverless API routes used as a proxy and cache layer for ESPN APIs
- Local persistence via `localStorage` (committed roster only)

---

## 🚀 Future Ideas

- Multiple roster formats
- Multiplayer drafts
- Season selection / all-time rosters
- Shareable draft results
- Enhanced reel animations and sound effects

---

## ⚠️ Disclaimer

This project is for **educational and personal use only**.

All NFL-related data, team names, logos, and player information belong to their respective owners. No affiliation with the NFL or ESPN is implied.

---

Built with ❤️ for fun and learning.
