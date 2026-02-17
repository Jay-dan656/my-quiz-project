const questions = [
    {
        question: "What does HTML stand for?",
        answers: [
            { text: "Hyper Text Markup Language", correct: true },
            { text: "Home Tool Markup Language", correct: false },
            { text: "Hyperlinks Text Mark Language", correct: false },
            { text: "Hyper Tool Multi Language", correct: false }
        ]
    },
    {
        question: "Which language is used for styling web pages?",
        answers: [
            { text: "CSS", correct: true },
            { text: "HTML", correct: false },
            { text: "Python", correct: false },
            { text: "Java", correct: false }
        ]
    },
    {
        question: "Which is not a JavaScript framework?",
        answers: [
            { text: "Django", correct: true },
            { text: "React", correct: false },
            { text: "Vue", correct: false },
            { text: "Angular", correct: false }
        ]
    }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const timerElement = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const highScoreElement = document.getElementById("high-score");

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;

// 🔀 Shuffle function
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function startQuiz() {
    questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    score = 0;
    showHighScore();
    showQuestion();
}

function showHighScore() {
    const highScore = localStorage.getItem("highScore") || 0;
    highScoreElement.innerHTML = `High Score: ${highScore}`;
}

function updateProgressBar() {
    const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
}

function startTimer() {
    timeLeft = 15;
    timerElement.innerHTML = `Time: ${timeLeft}`;

    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerHTML = `Time: ${timeLeft}`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            autoSelectWrong();
        }
    }, 1000);
}

function showQuestion() {
    resetState();
    updateProgressBar();

    let currentQuestion = questions[currentQuestionIndex];
    questionElement.innerHTML = `Q${currentQuestionIndex + 1}. ${currentQuestion.question}`;

    shuffleArray(currentQuestion.answers).forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);

        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }

        button.addEventListener("click", selectAnswer);
    });

    startTimer();
}

function resetState() {
    clearInterval(timer);
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    clearInterval(timer);

    const selectedBtn = e.target;
    const correct = selectedBtn.dataset.correct === "true";

    if (correct) {
        score++;
        selectedBtn.classList.add("correct");
    } else {
        selectedBtn.classList.add("wrong");
    }

    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });

    nextButton.style.display = "block";
}

function autoSelectWrong() {
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });

    nextButton.style.display = "block";
}

function showScore() {
    resetState();
    questionElement.innerHTML = `Final Score: ${score} / ${questions.length}`;
    timerElement.innerHTML = "";
    progressBar.style.width = "100%";

    let highScore = localStorage.getItem("highScore") || 0;

    if (score > highScore) {
        localStorage.setItem("highScore", score);
        highScoreElement.innerHTML = `🏆 New High Score: ${score}`;
    }

    nextButton.innerHTML = "Restart Exam";
    nextButton.style.display = "block";
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});

startQuiz();
