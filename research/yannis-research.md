# User Interaction and Typing Mechanics Research

**Researcher:** Yannis Smith  
**Topic:** User Interaction and Typing Mechanics  
**Course:** CSE 110 — Sprint 1 Research

---

## Overview

This section covers what makes a typing game feel good and function properly from a user interaction standpoint. For our MVP — a text-based interface where users type syntactically correct answers — the key metrics to track are WPM, accuracy, and consistency. Below is a breakdown of each, along with notes on input mechanics relevant to our implementation.

---

## WPM (Words Per Minute)

WPM is the standard metric for measuring typing speed. The calculation is:

> **(Total characters typed ÷ 5) ÷ time in minutes = Gross WPM**

Dividing by 5 normalizes for word length, treating every 5 characters as one "word." Most games report **Net WPM**, which subtracts a penalty for uncorrected errors:

> **Net WPM = Gross WPM − (uncorrected errors per minute)**

**Benchmarks:**
- Beginner: 20–30 WPM
- Average adult: ~40 WPM
- Skilled typist: 50–60 WPM
- Competitive/professional: 70+ WPM

For our game, WPM may be less central than accuracy since we're testing syntactic correctness rather than raw speed — but it's still useful as a stat to show the user.

**Relevance to MVP:** We could display WPM at the end of a round as a secondary stat, but it shouldn't be the primary scoring driver given our game's focus on correct answers.

---

## Accuracy

Accuracy is the percentage of correctly typed characters out of total characters typed. There are two common ways to handle errors:

- **Uncorrected-only penalty:** If a user backspaces and fixes a mistake, it doesn't count against them — only errors left in the final output are penalized. This is the more lenient approach (used by games like MonkeyType).
- **All-errors penalty:** Every mistake counts, even corrected ones, because time was still lost. This is stricter and more realistic for measuring true performance.

**Common error types to track (from KeyHero):**
- Wrong case (e.g., typing `the` instead of `The`)
- Bad ordering (e.g., `huose` instead of `house`)
- Doublets (e.g., `homee`)

**Relevance to MVP:** Since our game requires syntactically correct input, accuracy is the most important metric. A user who types the wrong answer entirely should be penalized more heavily than one who makes a small typo and corrects it. We should decide early whether we want forced correction (block progress until the error is fixed) or free correction (allow moving on, but penalize).

---

## Consistency

Consistency measures how steady a user's typing speed is throughout a session. High consistency = stable pace throughout. Low consistency = fast bursts followed by slow patches.

Research shows that consistency tends to improve naturally as typing skill improves, and that high consistency correlates with higher overall WPM. It's tracked in games like MonkeyType and is part of what separates practiced typists from beginners.

**Relevance to MVP:** Consistency may be a post-MVP stat — it's nice to have but adds complexity. If we implement a timer, we can derive consistency from WPM variance across the session. For the MVP, we can skip it and add it later.

---

## Input Mechanics

### Character-by-Character vs. Word-by-Word

Most typing games use **character-by-character** comparison — each keystroke is checked in real time against the expected character. This gives immediate feedback and is standard across MonkeyType, TypeRacer, and others.

Word-by-word input (where the user submits a whole word at once) is less common but could work for our game depending on how the answer input is structured.

**For our MVP:** Since we're prompting users to type an answer (likely a short phrase or code snippet), character-by-character real-time comparison is the better UX. It lets users see mistakes immediately.

### Real-Time Error Feedback

Immediate visual feedback when a user types wrong is critical. Research and existing games consistently show that instant error highlighting helps users correct bad habits and improves muscle memory. Two common approaches:

1. **Highlight the error in red** and allow the user to backspace and fix it before continuing
2. **Block further input** until the error is corrected (forced correction)

Forced correction trains real accuracy but can feel punishing. Highlighting without blocking is more forgiving and keeps flow going.

**For our MVP:** Highlighting errors in real time is the minimum. Forced correction could be a setting or a later feature.

### Backspace Behavior

A key UX decision is whether to allow free backspacing (fix anything at any time) or restrict it (e.g., can only backspace within the current word). TypeRacer requires fixing mistakes before moving on. MonkeyType allows backspacing freely.

For a game focused on correct syntax, we should at minimum require that the final submitted answer is correct — whether we allow mid-input correction is a design choice.

### Timer Behavior

Most typing tests start the timer on the **first keystroke**, not on page load. Some add a grace period (e.g., KeyHero starts the timer automatically after 3 seconds if the user hasn't typed yet). Starting on first keystroke is the better UX since it doesn't penalize the user for reading the prompt.

**For our MVP:** Start the timer on the first keystroke. Display elapsed time or a countdown depending on what the scoring team decides.

---

## Key Takeaways for MVP

| Mechanic | Recommendation |
|---|---|
| WPM | Show as end-of-round stat; don't use as primary score driver |
| Accuracy | Primary metric; penalize uncorrected errors |
| Consistency | Post-MVP; skip for now |
| Input method | Character-by-character, real-time comparison |
| Error feedback | Highlight in red on wrong character |
| Backspace | Allow free correction; require correct final answer |
| Timer start | On first keystroke |

---
