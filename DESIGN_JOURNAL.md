

# EvolveCode Design Journal: Learning Science Architecture

**Date:** 2025-05-20
**Author:** Learning Science Engineer Team

## 1. Overview
EvolveCode is designed to address the "Cliff Problem" in coding education: the steep drop-off when students move from block-based games to syntax-based coding. Our architecture separates the **Task Model** (what the user needs to do) from the **Scaffolding Model** (how we help them do it).

## 2. Scaffolding Architecture (`LevelConfig`)
We introduced the `LevelConfig` type to formalize the **Zone of Proximal Development (ZPD)**. 

### Core Components:
1.  **Goal Text (`goalText`)**: 
    *   *Purpose:* Sets the "North Star". Must be actionable and age-appropriate.
    *   *Kids:* "Help the Bee..." (Narrative based)
    *   *Teen:* "Initialize the array..." (Technical based)
2.  **Step Hints (`stepHints`)**: 
    *   *Purpose:* Progressive disclosure of information. We don't want to give the answer immediately.
    *   *Logic:* Hints range from conceptual ("Think about turns") to procedural ("Use the Blue block").
3.  **Common Mistakes (`commonMistakes`)**: 
    *   *Purpose:* Targeted remediation.
    *   *Mechanism:* The system detects specific error states (e.g., `OBSTACLE_HIT`) and maps them to pre-written, constructive feedback strings. This prevents generic "Error" messages which cause anxiety.
4.  **Success Message (`successMessage`)**: 
    *   *Purpose:* Reinforce the *concept* learned, not just the action.
    *   *Example:* "You learned sequencing!" instead of just "You won!"

## 3. The Feedback Loop (Tutor Logic)
The Tutor Logic is kept pure and deterministic to ensure consistency.

### State Flow:
1.  **Initial State:** Show `goalText`.
2.  **User Request:** User clicks "Hint".
    *   *Action:* `getNextHint` retrieves the next item in `stepHints`.
    *   *UI:* Updates the Tutor Bubble.
3.  **User Action:** User runs code.
    *   **Success:** Show `successMessage`.
    *   **Failure (Specific):** System detects a known error state (e.g., hitting a wall). `getFeedbackForMistake` retrieves the specific correction.
    *   **Failure (Generic):** System falls back to a gentle nudge (often the first hint) to encourage re-reading the problem.

## 4. Chat Tutor System (New)
Implemented "Instant Feedback Loop" for Kids Stage.

### Flow:
1.  **Action:** User clicks block.
2.  **Visualization:** Block is added to a "User Message" in the chat stream (replaces static script area).
3.  **Simulation:** Code automatically runs (Auto-Run Bee).
4.  **Feedback:** Tutor inserts a message *only* if a significant event occurs (Start, Success, Crash).

This creates a conversational UI for coding:
> Tutor: "Go to the flower!"
> User: [Move] [Move]
> (Bee moves, stops short)
> User: [Move]
> (Bee moves, hits flower)
> Tutor: "Great job!"

## 5. Roadmap & Improvements

### Adaptive Difficulty (ML Integration)
*   *Current:* Linear progression.
*   *Next:* Use the `user_progression.csv` data to dynamically adjust `commonMistakes` sensitivity. If a user is "High XP", give less verbose feedback.

### Language Evolution
*   *Current:* Static strings in `levels.ts`.
*   *Next:* Store `goalText` as a template.
    *   Kids: "Walk to the door."
    *   Teen: "Call the `move()` method until coordinate (x,y)."
    *   Pro: "Implement A* pathfinding."

### Analytics
*   *Metric:* "Hint Usage Rate".
*   *Goal:* If users consistently ask for >2 hints on a specific level, flag that level for content review (it might be too hard).
