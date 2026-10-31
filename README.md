# AI Mystery Room 🔍

AI Mystery Room is an interactive mystery-solving game powered by Google Gemini. Players investigate AI-generated mystery cases, discover clues, use hints, identify suspects, and accuse the culprit.

## Features

- Generate mysteries using Google Gemini.
- Three difficulty levels: Easy, Medium, and Hard.
- Investigate suspects and discover hidden clues.
- Request hints during investigations.
- Accuse a suspect and receive a verdict.
- Earn points for discovering clues and solving mysteries.
- View the final score and mystery solution.

## Technology Stack

**Frontend**
- React
- Vite
- React Router
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- Google Gemini API
- Zod

## Project Structure

```text
AI-Mystery-Room/
├── client/
│   └── src/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── services/
└── SPEC.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd AI-Mystery-Room
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server` folder:

```env
PORT=5001
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Replace the placeholder values with your own credentials. Never upload your actual API keys or database credentials to GitHub.

### 5. Start the backend

From the `server` folder:

```bash
node server.js
```

### 6. Start the frontend

From the `client` folder, in a separate terminal:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Game Rules

| Difficulty | Suspects | Clues | Hints | Correct Accusation |
|---|---:|---:|---:|---:|
| Easy | 3 | 5 | 2 | 100 points |
| Medium | 4 | 7 | 3 | 150 points |
| Hard | 5 | 9 | 3 | 200 points |

**Scoring:**
- Each discovered clue: +5 points
- Each hint used: −10 points
- Correct accusation: difficulty-based bonus
- Minimum final score: 0

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/mysteries` | Create a mystery |
| GET | `/api/investigation/:id` | Get mystery details |
| POST | `/api/investigation/:id/clues/:clueId` | Discover a clue |
| POST | `/api/investigation/:id/hints` | Request a hint |
| POST | `/api/investigation/:id/accuse` | Accuse a suspect |

## Author

Developed as part of the NxtWave project.
