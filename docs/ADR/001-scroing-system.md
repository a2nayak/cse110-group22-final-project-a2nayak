# ADR 0001: Score Computation System

## Status

Accepted

## Context

We need a score computation system for our game. We discussed during the meeting that we will use base correctness, full accuracy, seconds used for typing and question difficulty as factors in scoring computing system.

## Decision

We will use the forumula 
```
Score =  BC + BC*(1 + %accuracy) - seconds_elapsed * question_difficulty
Where BC = base correctness
```
for our scoring system.

## Consequences

Pros:
- Considers multiple factors instead of relying only on accuracy or timing.
- Rewards users for correct answers and higher typing accuracy.
- Penalizes slower responses, especially on harder questions.
- Allows question difficulty to affect scoring in a flexible way.

Cons:
- The formula may need balancing through playtesting.
- Scores may become negative if the time penalty is too high.
- The difficulty multiplier must be carefully chosen to avoid unfair scoring.
- The meaning of BC and question_difficulty must stay consistent across all questions.