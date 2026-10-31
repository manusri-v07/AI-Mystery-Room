# AI Mystery Room — Project Specification

## 1. Project Overview

### 1.1 Project Name
AI Mystery Room

### 1.2 Problem Statement
Traditional mystery games often provide fixed stories and limited replayability. Players may solve the same mystery repeatedly, reducing engagement.

AI Mystery Room solves this problem by using Generative AI to create unique, interactive mystery scenarios. Users can investigate crime scenes, examine clues, analyze suspects, request hints, and identify the culprit.

### 1.3 Project Objective
To develop an AI-powered web application where users can create and solve logically consistent mysteries with different difficulty levels.

### 1.4 Target Users
- Mystery and detective game enthusiasts.
- Students interested in interactive AI applications.
- Users who enjoy puzzles and logical reasoning.
- Casual players looking for an engaging game.

---

## 2. Technology Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- CSS

### Backend
- Node.js
- Express.js
- Google Gemini API using `@google/genai`
- Zod for validation

### Database
- MongoDB
- Mongoose

### Deployment
- Frontend: Vercel
- Backend: Suitable Node.js hosting platform
- Database: MongoDB Atlas

---

## 3. Core Features

### 3.1 Create Mystery
- Users can generate a new mystery.
- Users can select Easy, Medium, or Hard difficulty.
- Gemini generates the mystery based on the selected difficulty.
- Each mystery contains a title, story, suspects, clues, and hints.

### 3.2 Investigation
- Display the mystery story and available suspects.
- Allow users to investigate and discover clues.
- Display discovered clues to the player.
- Track investigation progress.

### 3.3 Hint System
- Users can request hints during investigation.
- Hints should help players understand the mystery without directly revealing the culprit.
- Limit the number of hints based on difficulty.

### 3.4 Accusation
- Users can select a suspect as the culprit.
- Allow the player to submit their final accusation.
- Prevent repeated accusations for the same mystery.

### 3.5 Results
- Display whether the accusation was correct.
- Reveal the actual culprit after submission.
- Show the explanation behind the mystery.
- Display the final score.

---

## 4. Difficulty Levels and Game Rules

| Feature | Easy | Medium | Hard |
|---|---:|---:|---:|
| Suspects | 3 | 4 | 5 |
| Clues | 5 | 7 | 9 |
| Hints | 2 | 3 | 3 |
| Correct accusation points | 100 | 150 | 200 |

### Scoring Rules
- Correct accusation: Award points based on difficulty.
- Each discovered clue: +5 points.
- Each hint used: -10 points.
- Minimum score: 0.
- Incorrect accusation: No correct-accusation points.

### Score Formula

Final Score = Correct Accusation Points + (Discovered Clues × 5) − (Hints Used × 10)

The final score must never be below zero.

All scoring calculations must happen on the backend.

---

## 5. User Flow

1. User opens the Home page.
2. User selects Create Mystery.
3. User chooses a difficulty level.
4. Backend requests Gemini to generate a mystery.
5. Backend validates the generated mystery.
6. Mystery is saved in MongoDB.
7. User enters the Investigation Room.
8. User explores suspects and discovers clues.
9. User can request hints within the allowed limit.
10. User proceeds to the Accusation page.
11. User selects and submits a suspect.
12. Backend evaluates the accusation and calculates the score.
13. Results page displays the verdict, culprit, explanation, and score.

---

## 6. UI Pages

### 6.1 Home Page
- Display project title and introduction.
- Provide a Create Mystery button.
- Display basic instructions.
- Include a responsive navigation layout.

### 6.2 Create Mystery Page
- Display difficulty selection.
- Provide Easy, Medium, and Hard options.
- Include a Generate Mystery button.
- Show a loading state during generation.
- Display an error message if generation fails.

### 6.3 Investigation Room
- Display mystery title and story.
- Display suspect profiles.
- Show available clues.
- Allow users to discover clues.
- Provide a hint button.
- Display remaining hints and discovered clue count.
- Provide navigation to the accusation page.

### 6.4 Accusation Page
- Display all suspects.
- Allow the user to select one suspect.
- Include a Submit Accusation button.
- Prevent submission without selecting a suspect.

### 6.5 Results Page
- Display correct or incorrect verdict.
- Reveal the actual culprit.
- Display the explanation.
- Display final score and score breakdown.
- Provide an option to create another mystery.

### 6.6 UI Behavior
- Display loading indicators during API requests.
- Show meaningful error messages.
- Prevent duplicate submissions.
- Maintain navigation between pages.
- Ensure responsive behavior on desktop and mobile screens.

---

## 7. Backend API Design

Base URL: `/api`

### 7.1 Generate Mystery

**Endpoint:** `POST /api/mysteries`

Request:
```json
{
  "difficulty": "easy"
}
```

Response:
```json
{
  "success": true,
  "mysteryId": "mystery_id",
  "title": "The Missing Diamond",
  "story": "A valuable diamond disappeared..."
}
```

The response must not contain the culprit or solution.

### 7.2 Get Mystery

**Endpoint:** `GET /api/mysteries/:id`

Response:
```json
{
  "success": true,
  "mystery": {
    "title": "The Missing Diamond",
    "story": "Mystery story...",
    "difficulty": "easy",
    "suspects": [],
    "clues": []
  }
}
```

Only publicly available mystery information should be returned.

### 7.3 Discover Clue

**Endpoint:** `POST /api/mysteries/:id/clues/:clueId`

Response:
```json
{
  "success": true,
  "clue": {
    "id": "clue_id",
    "description": "A suspicious fingerprint was found."
  }
}
```

The backend must track discovered clues and prevent duplicate rewards.

### 7.4 Request Hint

**Endpoint:** `POST /api/mysteries/:id/hints`

Response:
```json
{
  "success": true,
  "hint": "Pay attention to the timeline."
}
```

The backend must enforce the hint limit.

### 7.5 Submit Accusation

**Endpoint:** `POST /api/mysteries/:id/accuse`

Request:
```json
{
  "suspectId": "suspect_id"
}
```

Response:
```json
{
  "success": true,
  "correct": true,
  "culprit": "Suspect Name",
  "explanation": "Explanation of the mystery...",
  "score": 125,
  "scoreBreakdown": {
    "accusationPoints": 100,
    "cluePoints": 35,
    "hintPenalty": 10
  }
}
```

The culprit and explanation must only be returned after accusation.

---

## 8. Database Design

### Mystery Model

Each mystery should contain:

- `title`: Mystery title.
- `story`: Mystery description.
- `difficulty`: Easy, Medium, or Hard.
- `suspects`: Array of suspect objects.
- `clues`: Array of clue objects.
- `hints`: Array of hints.
- `culpritId`: Actual culprit's ID.
- `solutionExplanation`: Explanation of the mystery.
- `createdAt`: Creation timestamp.

### Suspect Object
- `id`
- `name`
- `description`
- `alibi`

### Clue Object
- `id`
- `description`
- `isDiscovered`

### Player Progress
- `mysteryId`
- `discoveredClueIds`
- `hintsUsed`
- `accusedSuspectId`
- `isCompleted`
- `score`

Player progress should be maintained separately from the mystery's original solution data.

---

## 9. AI Integration and Mystery Generation

Gemini will generate mystery scenarios using structured JSON output.

### AI Generation Requirements
- Generate a mystery based on the selected difficulty.
- Generate the exact number of suspects, clues, and hints required.
- Include a logically consistent culprit and solution.
- Ensure clues support the final explanation.
- Ensure suspects have meaningful descriptions and alibis.
- Avoid contradictions between the story, clues, suspects, and solution.

### Validation
- Validate Gemini output using Zod.
- Check required fields.
- Verify suspect, clue, and hint counts.
- Verify that the culprit ID matches an existing suspect.
- Reject invalid or incomplete responses.
- Retry generation when appropriate.

The backend must validate the mystery before saving it to MongoDB.

---

## 10. Security Requirements

- Store Gemini API keys in backend environment variables.
- Never expose API keys in frontend code.
- Never commit `.env` files to GitHub.
- Keep culprit ID and solution explanation private on the backend.
- Never send hidden solution data through public mystery APIs.
- Perform scoring and game-rule validation on the backend.
- Validate all incoming API requests.
- Prevent duplicate clue rewards and repeated accusations.
- Do not trust scores or progress values submitted by the frontend.

---

## 11. Error Handling

The application should handle:

- Gemini API failures.
- Invalid Gemini responses.
- MongoDB connection failures.
- Invalid difficulty selections.
- Mystery not found.
- Invalid suspect selection.
- Hint limit reached.
- Duplicate clue discovery.
- Repeated accusation attempts.
- Network and server errors.

All errors should return meaningful messages without exposing sensitive server information.

---

## 12. Project Structure

```text
AI-Mystery-Room/
│
├── SPEC.md
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── server/
    ├── config/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── services/
    ├── middleware/
    ├── server.js
    ├── package.json
    └── .env
```

---

## 13. Testing Requirements

Test the following:

1. Generate mysteries for all three difficulty levels.
2. Verify the correct number of suspects, clues, and hints.
3. Verify that invalid AI responses are rejected.
4. Verify that the culprit remains hidden before accusation.
5. Verify clue discovery and duplicate prevention.
6. Verify hint limits and penalties.
7. Verify correct and incorrect accusations.
8. Verify score calculations and minimum score of zero.
9. Verify backend and database error handling.
10. Test the complete application on desktop and mobile.

---

## 14. Acceptance Criteria

The project is considered complete when:

- Users can generate mysteries for Easy, Medium, and Hard levels.
- Each mystery contains the required number of suspects, clues, and hints.
- Users can investigate and discover clues.
- Users can request hints within the allowed limit.
- Users can submit an accusation.
- The actual culprit and solution remain hidden until accusation.
- The backend calculates the final score correctly.
- The Results page displays the verdict, culprit, explanation, and score.
- Invalid AI responses and API errors are handled properly.
- The application is deployed and works through its live URL.

---

## 15. Final Deliverables

- Complete source code in a GitHub repository.
- Deployed frontend URL.
- Working backend and database integration.
- Completed `SPEC.md`.
- Tested and functional AI Mystery Room application.
- Project submission through the NxtWave submission form.

**Project Deadline:** 2 November 2026, 11:59 PM.
