# Sprint 1 Planning Meeting: Research and Prototyping 

**Time:** 5/4/26 @4pm in Geisel

**Members attended:** Angel, Dmitri, Anirudh, Sofia, Ben, Sirtaj, Yannis  
**Members not attended:** Sean (Communicated), Brenda (Communicated), Lucien (Communicated), Kaung (Uncommunicated)

---

## Section 1: MVP ideas

### Option 1: Jupyter notebook-style cells that prompt users to enter code that updates a game state based on the code

**Pros:**
- Fun, engaging
- Easy to implement a creative theme focused on making the game entertaining

**Cons:**
- Little bit complicated to implement with a game state
- May be difficult to scale

**Notes**
- Brings into question what changes the state of the game, the user’s code (like code.org), or the user’s correctness and speed at answering a prompt

---

### Option 2: Hacker game where the UI resembles a terminal where the user is prompted to answer a question with a set of discrete options. After selecting an option, they copy out the syntax of that line

**Pros**
- Easy to create a database of diverse questions
- Not a complicated UI
- Leaves room for progressive generation of questions

**Cons:** 
- Essentially becomes like a flashcard game
- Does not emphasize learning code

---

### Option 3: Trace a virus through code files using a shell language, then replicate code being eaten by a code-eating bug in order to replace whatever it ate. Replacing the whole file damages the bug and when all files are cleaned, the bug dies and level/game is won.

**Pros:**
- Super easy to code
- Fun premise that follows a narrative, can be engaging for users
- Code almost writes itself, very little backend development needed

**Cons:**
- May be too simplistic or boring for the users
- Difficult to scale due to simplicity of design

---

### Option 4: Duolingo-style learning/Quizlet but with code syntax

**Pros**
- Lots of different types of questions and learning
- Can contribute to memorization

**Cons**
- Could be out of scope
- Loses the plot of a typing game aimed at syntax, leans more into a learning website

---

## Section 2: What are the main questions we need to answer?

- Syntax focused or algorithmic thinking focused  
  Prompt specifies to focus more on syntax, team voted to lean syntax-heavy  

- Discrete or infinite options  
  Team voted to lean much more towards discrete options as goal is syntax, not algorithmic thinking  

- Text based or game based  
  Team decided to fulfil all basic requirements of the project via a text-based game like option 2, but the hope is to add a game-like interface and progression system/goal down the line  

---

## Section 3: Final MVP (Pre-research, will evolve)

- Text-based interface with some sort of theme
- Database of prompts or questions
  - potentially room for progressive generation later
- Almost all user interaction happens just through typing into input box
- Scoring or progression feature, time limit
- Cohesive and clean UI that is friendly to users with all types of familiarity with technology

---

## Section 4: Team delegations for Sprint 1

### TEAM 1: Research  
**DUE:** WEDNESDAY 5/6/26 @ 4PM  
**Team lead in charge:** Dmitri  

**Tasks, one person for each subtask**
- User scenarios, personas, stories:  
  Note: correlate user stories → elements of MVP  
- Features of other typing games:  
- User interaction, typing mechanics:  
- Types of questions we should be asking  
- Scoring features/progression:  

---

### TEAM 2: Prototyping  
**DUE:** SUNDAY 5/10/26  
**Team lead in charge:** Angel  

**Tasks**
- Meet Wednesday night to finalize expectations for prototype  

**Subteam 1 (2 people):** Question database and prompt box  

**Subteam 2 (2 people):** User input, typing mechanics box  

**Subteam 3 (2 people):** Progression, scoring, and timer  