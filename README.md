# Mirror Tarot

A minimalist tarot tool for self-reflection.  
It doesn't predict the future — it helps you see what you're already thinking.

---

## What It Is

Mirror Tarot is a mirror, not a fortune-telling machine.

You draw a card not to learn what tomorrow brings, but to pause and ask yourself:  
**What have I noticed?**

It does three things:

- **Daily Card** — Draw one card a day, with a short observation
- **One Question** — Write a question, draw three cards (Past / Present / Future), receive a layered reading
- **Records** — Every draw and every reflection is saved in your own browser

---

## Features

- **22 Major Arcana** — No reversals, no Minor Arcana, kept simple
- **L2 Card Reveal** — Three cards face down, tap to flip them one by one, like a real spread
- **L2 Analysis** — Three layers of reading:
  1. Single card interpretation (what each card means in its position)
  2. Card-to-card connections (movement direction + stage crossing)
  3. Synthesis (one observation + one question back to you)
- **No predictions** — All copy is written around “what you're already thinking,” never fortune-telling
- **Local storage** — Everything stays in your browser. No uploads, no tracking
- **Light / Dark theme** — One-tap toggle
- **Pure front-end** — No server, no build step, no install required

---

## File Structure

```
Mirror-Tarot/
├── index.html     Structure
├── style.css      Styles (themes, flip animation, responsive layout)
├── engine.js      Analysis engine (card meanings, stages, L2 logic)
└── app.js         UI logic (reveal, history, theme)
```

All four files live flat in the same folder and reference each other with relative paths.  
You can drop them into any folder with any name.

---

## How to Use

### Open Locally

1. Download all four files into one folder
2. Double-click `index.html`
3. Start drawing

### Deploy to GitHub Pages

1. Create a new repository (e.g. `Mirror-Tarot`)
2. Upload all four files
3. Go to **Settings → Pages**
4. Source: **Deploy from a branch**, branch: `main`, folder: `/ (root)`
5. Save and wait 1–2 minutes
6. Visit `https://your-username.github.io/Mirror-Tarot/`

### On Mobile

Open the URL in Safari or Chrome, then **Add to Home Screen** to use it like an app.

---

## How to Play

### Daily Card

Tap **Draw a Card** to get one card and a short observation.  
Tap **Draw Again** to draw another — no daily lock.  
If the line resonates, write something and tap **Record This Card**.

### One Question

1. Write your question (e.g. “What's on my mind lately?”)
2. Tap **Shuffle · Draw 3 Cards**
3. Three cards appear face down — **tap to flip them one by one**:
   - 1st card → Past
   - 2nd card → Present
   - 3rd card → Future
4. Once all three are revealed, three layers appear:
   - **Layer 1 · Single Card** — What each card means in its position
   - **Layer 2 · Connections** — Whether the cards move forward, backward, or stay near each other
   - **Layer 3 · Synthesis** — One observation + one question left for you
5. Write your response and tap **Record This Draw**

### Records

All draws are saved locally in your browser.  
Tap any entry to expand it and see the reading and your own reflection.

---

## About the Card Meanings

Each card has a separate interpretation for **Past / Present / Future** — not the same keyword reused three times.

For example, The Hermit:

- Past: You once carried something alone for a while
- Present: You need some solitude now to think things through
- Future: A period is coming where you'd rather be alone

The three-layer analysis works like this:

- **Movement** — The distance between adjacent cards on the Fool's Journey tells whether the path moves forward, backward, or stays near
- **Stage Crossing** — The 22 cards are divided into three stages (Beginning / Trial / Transformation); we check whether the three cards cross stages
- **Synthesis** — Based on the stage relationship, we offer one observation and one question, handing the conclusion back to you

---

## Data & Privacy

- Everything is stored in your browser's `localStorage`
- No network calls, no uploads, no tracking
- Clearing browser data will also clear your records

---

## Design Principles

- Don't predict the future
- Don't judge good or bad cards
- Don't give specific advice
- Only offer angles of observation
- Leave space — silence matters more than explanation

---

## License

Free to use, learn from, and modify for personal use.  
If it helps you, feel free to turn it into your own version.

---

— Designed by **BY** —
