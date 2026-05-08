/***********************
 * QUESTION ENGINE
 * Top-left UI module
 ***********************/
console.log("Question engine loaded");

document.addEventListener("DOMContentLoaded", () => {
  const state = {
    questions: [],
    usedIndexes: new Set(),
    currentQuestion: null,
    score: 0,
    totalQuestions: 0,
    answeredQuestions: 0,
  };

  const promptEl = document.getElementById("prompt");
  const optionsEl = document.getElementById("options");
  const inputEl = document.getElementById("typing-input");
  const submitBtn = document.getElementById("submit-btn");
  const scoreEl = document.getElementById("score");
  const progressEl = document.getElementById("progress");
  const feedbackEl = document.getElementById("feedback-message");

  async function loadQuestions() {
    try {
      const res = await fetch("../data/questions.json");

      if (!res.ok) {
        throw new Error("Could not load questions.json");
      }

      state.questions = await res.json();
      state.totalQuestions = state.questions.length;

      nextQuestion();
    } catch (err) {
      console.error("Failed to load questions:", err);
      promptEl.textContent = "Failed to load questions.";
    }
  }

  function getNextQuestion() {
    if (state.usedIndexes.size === state.questions.length) {
      return null;
    }

    let randomIndex;

    do {
      randomIndex = Math.floor(Math.random() * state.questions.length);
    } while (state.usedIndexes.has(randomIndex));

    state.usedIndexes.add(randomIndex);
    state.currentQuestion = state.questions[randomIndex];

    return state.currentQuestion;
  }

  function renderQuestion(q) {
    promptEl.textContent = q.prompt;
    optionsEl.innerHTML = "";
    inputEl.value = "";
    inputEl.focus();

    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.textContent = opt;

      btn.disabled = true;

     optionsEl.appendChild(btn);
  });

  feedbackEl.textContent = "Type your answer, then press Submit.";
  feedbackEl.className = "feedback";

    updateProgress();
  }

  function checkAnswer() {
  if (!state.currentQuestion) return;

  const userAnswer = inputEl.value.trim();
  const correctAnswer = state.currentQuestion.answer.trim();

  if (userAnswer === "") {
    feedbackEl.textContent = "Type an answer before submitting.";
    feedbackEl.className = "feedback warning";
    return;
  }

  if (userAnswer === correctAnswer) {
    state.score++;
    scoreEl.textContent = state.score;

    feedbackEl.textContent = "Correct! Loading next question...";
    feedbackEl.className = "feedback correct";
  } else {
    feedbackEl.textContent = `Incorrect. Correct answer: ${correctAnswer}`;
    feedbackEl.className = "feedback incorrect";
  }

  state.answeredQuestions++;
  updateProgress();

  setTimeout(() => {
    nextQuestion();
  }, 1200);
}

  function updateProgress() {
    progressEl.textContent = `${state.answeredQuestions} / ${state.totalQuestions}`;
  }

  function nextQuestion() {
    const q = getNextQuestion();

    if (!q) {
      endGame();
      return;
    }

    renderQuestion(q);
  }

  function endGame() {
    promptEl.textContent = "Game Complete!";
    optionsEl.innerHTML = "";
    inputEl.disabled = true;
    submitBtn.disabled = true;
    progressEl.textContent = `${state.totalQuestions} / ${state.totalQuestions}`;
  }

  submitBtn.addEventListener("click", checkAnswer);

  inputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      checkAnswer();
    }
  });

  loadQuestions();
});