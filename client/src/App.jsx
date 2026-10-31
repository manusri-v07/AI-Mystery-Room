
import { useState } from "react";
import "./App.css";

const API = "http://localhost:5001";

function App() {
  const [page, setPage] = useState("home");
  const [difficulty, setDifficulty] = useState("easy");
  const [mystery, setMystery] = useState(null);
  const [selectedSuspect, setSelectedSuspect] = useState("");
  const [result, setResult] = useState(null);
  const [hints, setHints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const request = async (url, options = {}) => {
    const response = await fetch(`${API}${url}`, {
      headers: { "Content-Type": "application/json" },
      ...options
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Something went wrong");
    return data;
  };

  const createMystery = async () => {
    try {
      setLoading(true);
      setError("");
      setHints([]);
      setResult(null);

      const data = await request("/api/mysteries", {
        method: "POST",
        body: JSON.stringify({ difficulty })
      });

      setMystery(data.mystery);
      setPage("investigation");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const discoverClue = async (clueId) => {
    try {
      setError("");
      const data = await request(
        `/api/investigation/${mystery.id}/clues/${clueId}`,
        { method: "POST" }
      );

      setMystery((old) => ({
        ...old,
        clues: old.clues.map((clue) =>
          clue.id === clueId
            ? { ...clue, description: data.clue.description, isDiscovered: true }
            : clue
        ),
        score: data.score
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const useHint = async () => {
    try {
      setError("");
      const data = await request(
        `/api/investigation/${mystery.id}/hints`,
        { method: "POST" }
      );
      setHints((old) => [...old, data.hint]);
      setMystery((old) => ({
        ...old,
        score: data.score,
        hintsUsed: old.hintsUsed + 1
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const accuse = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await request(
        `/api/investigation/${mystery.id}/accuse`,
        {
          method: "POST",
          body: JSON.stringify({ suspectName: selectedSuspect })
        }
      );

      setResult(data);
      setPage("results");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => {
    setMystery(null);
    setResult(null);
    setHints([]);
    setSelectedSuspect("");
    setError("");
    setPage("home");
  };

  return (
    <div className="app">
      <header>
        <h2 onClick={goHome}>🔎 MYSTERY ROOM</h2>
        <span>THINK. INVESTIGATE. SOLVE.</span>
      </header>

      <main>
        {error && <div className="error">{error}</div>}

        {page === "home" && (
          <section className="hero">
            <p className="eyebrow">THE TRUTH IS HIDDEN</p>
            <h1>Every clue tells a story.<br />Every suspect hides a secret.</h1>
            <p className="subtitle">
              Enter a world of mysteries. Examine the evidence, question
              the suspects and uncover the truth.
            </p>

            <div className="panel">
              <h3>Create Your Mystery</h3>
              <p>Choose your difficulty level</p>

              <div className="levels">
                {["easy", "medium", "hard"].map((level) => (
                  <button
                    key={level}
                    className={difficulty === level ? "level active" : "level"}
                    onClick={() => setDifficulty(level)}
                  >
                    {level.toUpperCase()}
                  </button>
                ))}
              </div>

              <button className="primary" onClick={createMystery} disabled={loading}>
                {loading ? "Creating mystery..." : "ENTER THE MYSTERY →"}
              </button>
            </div>
          </section>
        )}

        {page === "investigation" && mystery && (
          <section>
            <p className="eyebrow">{mystery.difficulty.toUpperCase()} CASE</p>
            <h1>{mystery.title}</h1>
            <p className="story">{mystery.story}</p>

            <div className="stats">
              <div><strong>{mystery.score || 0}</strong><span>SCORE</span></div>
              <div><strong>{mystery.clues.filter(c => c.isDiscovered).length}/{mystery.clues.length}</strong><span>CLUES FOUND</span></div>
              <div><strong>{mystery.hintsUsed || 0}</strong><span>HINTS USED</span></div>
            </div>

            <h2>Suspects</h2>
            <div className="cards">
              {mystery.suspects.map((suspect) => (
                <article className="card" key={suspect._id || suspect.name}>
                  <h3>{suspect.name}</h3>
                  <p>{suspect.description}</p>
                  <p><b>Motive:</b> {suspect.motive}</p>
                  <p><b>Alibi:</b> {suspect.alibi}</p>
                </article>
              ))}
            </div>

            <h2>Evidence Room</h2>
            <div className="cards">
              {mystery.clues.map((clue, index) => (
                <article className="card clue" key={clue.id}>
                  <h3>Clue {index + 1}</h3>
                  <p>{clue.isDiscovered ? clue.description : "🔒 Undiscovered clue"}</p>
                  {!clue.isDiscovered && (
                    <button className="secondary" onClick={() => discoverClue(clue.id)}>
                      Discover clue
                    </button>
                  )}
                  {clue.isDiscovered && <span className="found">✓ Discovered</span>}
                </article>
              ))}
            </div>

            <div className="panel">
              <h2>Need a hint?</h2>
              {hints.map((hint, i) => <p key={i}>💡 {hint}</p>)}
              <button className="secondary" onClick={useHint}>Reveal next hint (−10 points)</button>
            </div>

            <button className="primary" onClick={() => setPage("accusation")}>
              MAKE YOUR ACCUSATION →
            </button>
          </section>
        )}

        {page === "accusation" && mystery && (
          <section className="hero">
            <p className="eyebrow">THE FINAL DECISION</p>
            <h1>Who is the culprit?</h1>
            <p className="subtitle">Review the evidence carefully before making your accusation.</p>

            <div className="panel">
              {mystery.suspects.map((suspect) => (
                <label className="choice" key={suspect.name}>
                  <input
                    type="radio"
                    name="suspect"
                    value={suspect.name}
                    checked={selectedSuspect === suspect.name}
                    onChange={(e) => setSelectedSuspect(e.target.value)}
                  />
                  {suspect.name}
                </label>
              ))}

              <button
                className="primary"
                disabled={!selectedSuspect || loading}
                onClick={accuse}
              >
                {loading ? "Submitting..." : "CONFIRM ACCUSATION"}
              </button>
              <button className="secondary" onClick={() => setPage("investigation")}>
                Back to investigation
              </button>
            </div>
          </section>
        )}

        {page === "results" && result && (
          <section className="hero">
            <p className="eyebrow">CASE CLOSED</p>
            <h1>{result.isCorrect ? "Mystery Solved!" : "Wrong Accusation!"}</h1>
            <h2 className={result.isCorrect ? "correct" : "wrong"}>
              {result.isCorrect ? "✓ Correct culprit" : "✕ Incorrect culprit"}
            </h2>

            <div className="panel">
              <p>Your accusation: <b>{result.accusedSuspect}</b></p>
              <p>Actual culprit: <b>{result.culprit}</b></p>
              <h2>Final Score: {result.score}</h2>
              <h3>The Solution</h3>
              <p>{result.solution}</p>
            </div>

            <button className="primary" onClick={goHome}>CREATE ANOTHER MYSTERY</button>
          </section>
        )}
      </main>

      <footer>AI MYSTERY ROOM · CAN YOU FIND THE TRUTH?</footer>
    </div>
  );
}

export default App;
