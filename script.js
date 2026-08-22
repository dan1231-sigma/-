const API_URL = 'https://countriesnow.space/api/v0.1/countries/flag/images';

const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');
const apiError = document.getElementById('apiError');

const gameScreen = document.getElementById('gameScreen');
const questionLabel = document.getElementById('questionLabel');
const scoreLabel = document.getElementById('scoreLabel');
const streakLabel = document.getElementById('streakLabel');
const flag = document.getElementById('flag');
const answerInput = document.getElementById('answerInput');
const checkBtn = document.getElementById('checkBtn');
const nextBtn = document.getElementById('nextBtn');
const message = document.getElementById('message');

const resultScreen = document.getElementById('resultScreen');
const finalScore = document.getElementById('finalScore');
const resultPercent = document.getElementById('resultPercent');
const maxStreakResult = document.getElementById('maxStreakResult');
const playAgainBtn = document.getElementById('playAgainBtn');

let countries = [];
let gameCountries = [];
let currentCountry = null;
let currentQuestion = 0;
let score = 0;
let streak = 0;
let maxStreak = 0;
let isAnswered = false;

function showElement(element, visible) {
  element.style.display = visible ? '' : 'none';
}

function setButtonVisible(button, visible) {
  button.style.display = visible ? '' : 'none';
}

function initializeScreens() {
  showElement(startScreen, true);
  showElement(gameScreen, false);
  showElement(resultScreen, false);
  setButtonVisible(nextBtn, false);
}

function setMessage(text, type = '') {
  message.textContent = text;
  message.className = `message ${type}`.trim();
}

function showApiError(text) {
  apiError.textContent = text;
  apiError.classList.toggle('hidden', !text);
}

function normalizeAnswer(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function getValidCountries(data) {
  const result = Array.isArray(data) ? data : data?.data || [];
  const list = Array.isArray(result) ? result : [result];

  return list
    .map(country => ({
      name: { common: country?.name || '' },
      flags: { png: country?.flag || '' },
      translations: {}
    }))
    .filter(country => country.name.common && country.flags.png);
}

function getCountryFlag(country) {
  if (!country || !country.flags) return '';
  return country.flags.png || country.flags.svg || '';
}

function getAllowedNames(country) {
  if (!country) return [];

  const names = new Set();
  const common = country.name?.common;
  const ukr = country.translations?.ukr?.common;

  if (common) names.add(normalizeAnswer(common));
  if (ukr) names.add(normalizeAnswer(ukr));

  return [...names];
}

function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function chooseGameCountries() {
  if (!countries.length) return [];

  const shuffled = shuffleArray(countries);
  const selected = [];
  const seen = new Set();

  for (const country of shuffled) {
    const key = country.name.common;
    if (!key || seen.has(key)) continue;

    selected.push(country);
    seen.add(key);

    if (selected.length === 30) break;
  }

  return selected;
}

function setFlagImage(url) {
  if (!url) {
    flag.removeAttribute('src');
    flag.style.display = 'none';
    flag.classList.add('flag-empty');
    return;
  }

  flag.src = url;
  flag.alt = currentCountry?.name?.common || 'Flag';
  flag.classList.remove('flag-empty');
  flag.style.display = 'block';
}

function updateScoreboard() {
  questionLabel.textContent = `Питання: ${currentQuestion + 1}/${gameCountries.length}`;
  scoreLabel.textContent = `Рахунок: ${score}`;
  streakLabel.textContent = `Стрік: ${streak}`;
}

function showQuestion() {
  if (!gameCountries.length || currentQuestion >= gameCountries.length) {
    endGame();
    return;
  }

  currentCountry = gameCountries[currentQuestion];
  const flagUrl = getCountryFlag(currentCountry);
  setFlagImage(flagUrl);

  answerInput.value = '';
  answerInput.disabled = false;
  answerInput.focus();

  checkBtn.disabled = false;
  setButtonVisible(checkBtn, true);
  setButtonVisible(nextBtn, false);

  isAnswered = false;
  setMessage('');
  updateScoreboard();
}

function endGame() {
  showElement(gameScreen, false);
  showElement(resultScreen, true);

  const percent = gameCountries.length ? Math.round((score / gameCountries.length) * 100) : 0;

  finalScore.textContent = `${score} / ${gameCountries.length}`;
  resultPercent.textContent = `${percent}% правильних`;
  maxStreakResult.textContent = `Максимальний стрік: ${maxStreak}`;
}

function nextQuestion() {
  currentQuestion += 1;

  if (currentQuestion < gameCountries.length) {
    showQuestion();
    return;
  }

  endGame();
}

function startNewGame() {
  score = 0;
  streak = 0;
  maxStreak = 0;
  currentQuestion = 0;
  isAnswered = false;

  gameCountries = chooseGameCountries();

  showElement(startScreen, false);
  showElement(resultScreen, false);
  showElement(gameScreen, true);

  if (!gameCountries.length) {
    showApiError('Не вдалося завантажити список країн.');
    showElement(startScreen, true);
    showElement(gameScreen, false);
    return;
  }

  showQuestion();
}

function checkAnswer() {
  if (isAnswered) return;

  const inputText = answerInput.value;
  const normalizedInput = normalizeAnswer(inputText);

  if (!normalizedInput) {
    setMessage('Введи назву країни!', 'warning');
    return;
  }

  const allowedNames = getAllowedNames(currentCountry);
  const isCorrect = allowedNames.includes(normalizedInput);

  if (isCorrect) {
    score += 1;
    streak += 1;
    maxStreak = Math.max(maxStreak, streak);
    setMessage('Правильно!', 'success');

    isAnswered = true;
    answerInput.disabled = true;
    checkBtn.disabled = true;
    setButtonVisible(nextBtn, true);
    setButtonVisible(checkBtn, false);

    updateScoreboard();
    return;
  }

  streak = 0;
  setMessage(`Неправильно! Правильна відповідь: ${currentCountry.name.common}`, 'error');

  isAnswered = true;
  answerInput.disabled = true;
  checkBtn.disabled = true;
  setButtonVisible(nextBtn, true);
  setButtonVisible(checkBtn, false);

  updateScoreboard();
}

async function loadCountries() {
  startBtn.disabled = true;
  startBtn.textContent = 'Завантаження...';
  showApiError('');

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`API error ${response.status}`);

    const data = await response.json();
    countries = getValidCountries(data);

    if (!countries.length) throw new Error('empty');

    startBtn.disabled = false;
    startBtn.textContent = 'START';
  } catch (error) {
    countries = [];
    startBtn.disabled = false;
    startBtn.textContent = 'Спробувати ще раз';
    showApiError(`Не вдалося завантажити список країн. ${error.message}`);
  }
}

startBtn.addEventListener('click', () => {
  if (!countries.length) {
    loadCountries();
    return;
  }

  startNewGame();
});

checkBtn.addEventListener('click', checkAnswer);
nextBtn.addEventListener('click', nextQuestion);
playAgainBtn.addEventListener('click', startNewGame);

answerInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    checkAnswer();
  }
});

flag.addEventListener('error', () => {
  flag.style.display = 'none';
  flag.classList.add('flag-empty');
});

initializeScreens();

window.addEventListener('DOMContentLoaded', () => {
  loadCountries();
});