# Meeting Notes

## Attendance
**Members present:** Angel, Dmitri, Sirtaj, Brenda, Sofia, Lucien, Yannis, Anirudh  
**Members absent:** Kaung, Ben, Sean (all communicated)

---

## Agenda
- Recap Sprint 1
- Talk about what needs to be done for Sprint 2
- Talk about TA feedback

---

## User Scenarios

Sofia conducted a survey that showed that CS students feel slow in their programming due to having to look up syntax and not knowing where to start.

Therefore, our target audience is predominantly people familiar with coding who want to solidify their understanding of syntax.

---

## Progression Scoring

We went over the progression team’s results, which included several options for timing and scoring the game.

It would be easier and more reminiscent of a typing game if, instead of generating options, we simply prompted the user with the correct answer to copy down. This can hopefully be done as a shadow in the text box that the user types over.

---

## Language Diversity

The TA mentioned we need to include more than one language, so we decided to split it into 2, potentially 3 different “umbrellas”:
- Object oriented
- Web development

---

## Final Game Overlay Details

**Name:** print("Hello Farm!")

### Core Flow
- Users start by selecting a language/umbrella
- Prompts for code are related to the game  
  Example: *create a variable called `farm_name` and assign it to `"Hello Farm"`*

---

### Scoring System
The multiplier is based on speed, accuracy, and correctness, with a bonus for streaks.

- Base correctness: 100 points  
- Speed: (time given - time taken / time given) * points  (can be negative if extra time is taken)
- Accuracy: (1 + (50 - percentage of characters typed correctly on first try) ) * points  (negative if less than half accuracy)
- Streaks: (1x, 1.5x, 2x, etc., depending on consecutive fully correct and accurate responses)

---

### Point System and Progression
- Score is maintained and increases/decreases based on performance. 
- Every 5 correct answer plants one seed 
- Each plant generates a certain amount of currency per answer that increases/decreases based on the level of the plant. 


If score is consistently high and streak is maintained, increases chances of positive events like the following:
- Plant becomes golden plant and produces more money
- Super Growth (planted seed instantly grows)   

If score decreases, increases the chance of a negative event:
- Plant becomes sick (decreases 1 level and -X money)
- Plant gets eaten (plant goes away and -2X money)

**Goal:** Make a happy and healthy farm to maximize revenue.

---

### INITIAL Point System and Progression

Note: This was advised to be ambitious for our timeline, thus the following features which were initially a part of our MVP have since been simplified into the above plan.

- Higher point values unlock new levels faster, and each new level gives a new powerup (e.g., bigger watering can, new seeds, more land)
- Higher point values also increase multipliers on produce quality

Every 5 levels, players visit a farmer’s market to sell their produce:
- If produce is bad or missing, popularity ranking and revenue decrease
- If produce is good, popularity ranking and revenue increase

**Goal:** Become the most popular and richest farm in the city

- Farms expand with levels, and more items and higher-quality produce are unlocked
- As players progress, the difficulty of syntax increases as they begin copying multi-line commands and functions
- If the player is scoring poorly, they may face random events such as:
  - Crops dying
  - Running out of seeds
  - Produce being eaten by rodents  
  - Generally lower-quality produce that will not sell well at the farmer’s market
