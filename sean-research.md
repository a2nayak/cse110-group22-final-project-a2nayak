# Potential scoring/progression:

From the reearch that I was able to find what it seems is that the most common and efficient ways of scoring and doing progression is through immidieate feedback and autonomy in progression:

 - ## Scoring Systems
    - Better for situations where the game is focused more on learning-aligned levels.

    - Weighted Accuracy (The "Compiler" Model): Traditional typing games use WPM (Words Per Minute). However, research on programming education suggests weighting accuracy higher. You might implement a "Streak Multiplier" that resets on any syntax error, mimicking how a compiler stops at the first bug.

    - Feedback/Engagement Angle: Studies on "Progression Embodiment Graphs" (PEG) show that the latency of feedback is the strongest predictor of learning. Scoring should be real-time; the score should visibly "drop" or "shiver" the moment an error occurs, creating an immediate cognitive link between the action and the result.

    - Characters Per Minute (CPM) vs. WPM: For coding, CPM is often a more accurate metric because code contains non-standard word lengths and symbols (brackets, operators). Research suggests that CPM is more effective for monitoring the improvement of technical typing skills than standard WPM. 

- ## Examples:
    - ### Typing.io (The "Real-World" Model)
        - Typo Cost Analysis. Instead of just giving a percentage, it calculates the "cost" of your errors based on how many characters you typed after the mistake before you realized it and backspaced.
    
    - ### MonkeyType (The "Expert" Model)
        - Strict Modes. You can toggle "Master Mode," where the game instantly fails if you miss a single character.

    - ### Type to Learn (The "Balanced" Model)
        - The Accuracy Threshold. Players cannot pass a level unless they hit a specific accuracy (e.g., 96%) regardless of how fast they are.

 - ## Progression Models
    - This keeps the player engaged and lets them keep moving forward without getting bored or frustrated

    - Scaffolding & Task Sequences: Players usually play and persist for long if the game follows a low difficulty to a high difficulty path. Progression should start with Primitive Types (strings, ints), move to Control Flow (if/else), and peak at Complex Structures (classes, recursion).

    - Adaptive Difficulty Adjustment (DDA): Modern gamified platforms use DDA to tailor the experience. If a player’s accuracy drops below 80%, the game should automatically serve shorter "snippets" or increase the font size of syntax-heavy characters (like { vs ( ) until they stabilize.

    - Skill Trees as Progression: Instead of a linear level 1 to 10, use a "Skill Tree." This gives players autonomy, which is a key driver in educational engagement. A player might choose to progress down the "Frontend Track" (HTML/CSS syntax) or the "Backend Track" (Python/Java).

- ## Examples:
    - ### Incretyper (The "Skill Tree" Model)
        - Upgrade Paths. As you type words correctly, you earn "shards" (currency). You use these shards on a non-linear skill tree to unlock perks—like slowing down the timer, increasing your score multiplier, or unlocking "higher-tier" words.
    
    - ### ZType (The "Arcade Wave" Model)
        - Wave-Based Difficulty. Enemies move toward your ship, and you must type the words attached to them to destroy them. As waves progress, the words get longer, use more rare symbols (like _, &, *), and multiple enemies appear at once.

    - ### TypingMaster: Bubbles (The "Scaffolding" Model)
        - Key Introduction. It starts by only giving you letters on the Home Row. It only "unlocks" the top and bottom rows once you demonstrate mastery of the middle row.
