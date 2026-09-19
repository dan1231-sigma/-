const API_URL = 'https://countriesnow.space/api/v0.1/countries/flag/images';
const TRANSLATIONS_URL = 'https://raw.githubusercontent.com/mledoze/countries/master/countries.json';

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
const themeOptions = document.querySelectorAll('.theme-option');
const languageOptions = document.querySelectorAll('.language-option');

const translations = {
  uk: {
    title: 'Вгадай країну',
    theme: 'Тема',
    themeAria: 'Вибір теми',
    languageAria: 'Вибір мови',
    eyebrow: 'Географічна вікторина',
    intro: 'Перевір свою інтуїцію за прапором. 30 країн, одна спроба на кожну.',
    start: 'START',
    loading: 'Завантаження...',
    retry: 'Спробувати ще раз',
    question: 'Питання',
    score: 'Рахунок',
    streak: 'Стрік',
    answerPlaceholder: 'Введи назву країни',
    check: 'Перевірити',
    next: 'Наступна країна',
    hintLetters: 'Підказка: 3 букви',
    hintWords: 'Підказка: к-сть слів',
    gameOver: 'Гру завершено!',
    percent: '% правильних',
    maxStreak: 'Максимальний стрік',
    playAgain: 'Грати ще раз',
    usedLetters: 'Підказка з буквами вже використана',
    usedWords: 'Підказка про слова вже використана',
    startsWith: 'Підказка: починається з «{hint}»',
    wordCount: 'Підказка: у назві {count} {word}',
    oneWord: 'слово',
    fewWords: 'слова',
    manyWords: 'слів',
    emptyAnswer: 'Введи назву країни!',
    correct: 'Правильно!',
    almost: 'Майже! Автовиправлення ({percent}%): «{name}»',
    wrong: 'Неправильно! Правильна відповідь: {name}',
    apiError: 'Не вдалося завантажити список країн. {details}',
    noCountries: 'Не вдалося завантажити список країн.'
  },
  en: {
    title: 'Guess the Country',
    theme: 'Theme',
    themeAria: 'Theme selector',
    languageAria: 'Language selector',
    eyebrow: 'Geography quiz',
    intro: 'Trust your instincts and identify the flag. 30 countries, one try each.',
    start: 'START',
    loading: 'Loading...',
    retry: 'Try again',
    question: 'Question',
    score: 'Score',
    streak: 'Streak',
    answerPlaceholder: 'Enter the country name',
    check: 'Check answer',
    next: 'Next country',
    hintLetters: 'Hint: 3 letters',
    hintWords: 'Hint: number of words',
    gameOver: 'Game complete!',
    percent: '% correct',
    maxStreak: 'Best streak',
    playAgain: 'Play again',
    usedLetters: 'The letter hint has already been used',
    usedWords: 'The word hint has already been used',
    startsWith: 'Hint: starts with “{hint}”',
    wordCount: 'Hint: the name has {count} {word}',
    oneWord: 'word',
    fewWords: 'words',
    manyWords: 'words',
    emptyAnswer: 'Enter a country name!',
    correct: 'Correct!',
    almost: 'Almost! Auto-correct ({percent}%): “{name}”',
    wrong: 'Incorrect! The right answer is: {name}',
    apiError: 'Could not load the country list. {details}',
    noCountries: 'Could not load the country list.'
  }
};

let currentLanguage = 'uk';
// якщо гора не йде до магомеда то магомед пише js // //якщо іля допиши всі країни я ахуею//
const ukrainianCountryNames = {
  Afghanistan: 'Афганістан', Albania: 'Албанія', Algeria: 'Алжир', Andorra: 'Андорра',
  Argentina: 'Аргентина', Armenia: 'Вірменія', Australia: 'Австралія', Austria: 'Австрія',
  Azerbaijan: 'Азербайджан', Bahrain: 'Бахрейн', Bangladesh: 'Бангладеш', Belarus: 'Білорусь',
  Belgium: 'Бельгія', Bolivia: 'Болівія', Brazil: 'Бразилія', Bulgaria: 'Болгарія',
  Cambodia: 'Камбоджа', Cameroon: 'Камерун', Canada: 'Канада', Chile: 'Чилі', China: 'Китай',
  Colombia: 'Колумбія', Croatia: 'Хорватія', Cuba: 'Куба', Cyprus: 'Кіпр', Czechia: 'Чехія',
  Denmark: 'Данія', Ecuador: 'Еквадор', Egypt: 'Єгипет', Estonia: 'Естонія', Ethiopia: 'Ефіопія',
  Finland: 'Фінляндія', France: 'Франція', Georgia: 'Грузія', Germany: 'Німеччина', Greece: 'Греція',
  Hungary: 'Угорщина', Iceland: 'Ісландія', India: 'Індія', Indonesia: 'Індонезія', Iran: 'Іран',
  Iraq: 'Ірак', Ireland: 'Ірландія', Israel: 'Ізраїль', Italy: 'Італія', Japan: 'Японія',
  Jordan: 'Йорданія', Kazakhstan: 'Казахстан', Kenya: 'Кенія', Kuwait: 'Кувейт', Latvia: 'Латвія',
  Lebanon: 'Ліван', Lithuania: 'Литва', Luxembourg: 'Люксембург', Malaysia: 'Малайзія', Mexico: 'Мексика',
  Moldova: 'Молдова', Monaco: 'Монако', Mongolia: 'Монголія', Montenegro: 'Чорногорія', Morocco: 'Марокко',
  Netherlands: 'Нідерланди', NewZealand: 'Нова Зеландія', Nigeria: 'Нігерія', Norway: 'Норвегія',
  Pakistan: 'Пакистан', Panama: 'Панама', Peru: 'Перу', Philippines: 'Філіппіни', Poland: 'Польща',
  Portugal: 'Португалія', Qatar: 'Катар', Romania: 'Румунія', Russia: 'Росія', SaudiArabia: 'Саудівська Аравія',
  Serbia: 'Сербія', Singapore: 'Сінгапур', Slovakia: 'Словаччина', Slovenia: 'Словенія', Somalia: 'Сомалі',
  SouthAfrica: 'Південна Африка', SouthKorea: 'Південна Корея', Spain: 'Іспанія', Sweden: 'Швеція',
  Switzerland: 'Швейцарія', Taiwan: 'Тайвань', Thailand: 'Таїланд', Tunisia: 'Туніс', Turkey: 'Туреччина',
  Ukraine: 'Україна', UnitedArabEmirates: 'Обʼєднані Арабські Емірати', UnitedKingdom: 'Велика Британія',
  UnitedStates: 'Сполучені Штати', Uruguay: 'Уругвай', Uzbekistan: 'Узбекистан', Venezuela: 'Венесуела',
  Vietnam: 'Вʼєтнам', Yemen: 'Ємен', Zambia: 'Замбія', Zimbabwe: 'Зімбабве',
  IsleofMan: 'Острів Мен', PuertoRico: 'Пуерто-Рико', Palestine: 'Палестина', Kosovo: 'Косово',
  VaticanCity: 'Ватикан', NorthMacedonia: 'Північна Македонія', BosniaandHerzegovina: 'Боснія і Герцеговина',
  SouthSudan: 'Південний Судан', SriLanka: 'Шрі-Ланка', Myanmar: 'Мʼянма', Laos: 'Лаос',
  Syria: 'Сирія', Sudan: 'Судан', DemocraticRepublicoftheCongo: 'Демократична Республіка Конго',
  RepublicoftheCongo: 'Республіка Конго', CotedIvoire: 'Кот-дʼІвуар', Eswatini: 'Есватіні',
  TimorLeste: 'Східний Тимор', PapuaNewGuinea: 'Папуа-Нова Гвінея', SolomonIslands: 'Соломонові Острови',
  TrinidadandTobago: 'Тринідад і Тобаго', CostaRica: 'Коста-Рика', DominicanRepublic: 'Домініканська Республіка',
  ElSalvador: 'Сальвадор', Guatemala: 'Гватемала', Honduras: 'Гондурас', Nicaragua: 'Нікарагуа',
  UnitedStatesMinorOutlyingIslands: 'Малі Зовнішні Острови США'
};

function t(key, values = {}) {
  let text = translations[currentLanguage][key] || translations.uk[key] || key;
  Object.entries(values).forEach(([name, value]) => {
    text = text.replace(`{${name}}`, value);
  });
  return text;
}
// функція для зміни мови //
function setLanguage(language) {
  currentLanguage = ['uk', 'en'].includes(language) ? language : 'uk';
  const text = translations[currentLanguage];
  document.documentElement.lang = currentLanguage;
  document.title = text.title;
  document.querySelector('.theme-switcher__label').textContent = text.theme;
  document.querySelector('.theme-switcher').setAttribute('aria-label', text.themeAria);
  document.querySelector('.language-switcher').setAttribute('aria-label', text.languageAria);
  document.querySelector('.eyebrow').textContent = text.eyebrow;
  document.querySelector('.Main').textContent = text.title;
  document.querySelector('.intro').textContent = text.intro;
  answerInput.placeholder = text.answerPlaceholder;
  checkBtn.textContent = text.check;
  nextBtn.textContent = text.next;
  playAgainBtn.textContent = text.playAgain;
  document.querySelector('#resultScreen h2').textContent = text.gameOver;
  languageOptions.forEach(option => {
    const isActive = option.dataset.language === currentLanguage;
    option.classList.toggle('is-active', isActive);
    option.setAttribute('aria-pressed', String(isActive));
  });
  updateScoreboard();
  const lettersButton = document.getElementById('hintLettersBtn');
  const wordsButton = document.getElementById('hintWordsBtn');
  if (lettersButton) lettersButton.textContent = text.hintLetters;
  if (wordsButton) wordsButton.textContent = text.hintWords;
  const percent = gameCountries.length ? Math.round((score / gameCountries.length) * 100) : 0;
  finalScore.textContent = `${score} / ${gameCountries.length}`;
  resultPercent.textContent = `${percent}${t('percent')}`;
  maxStreakResult.textContent = `${t('maxStreak')}: ${maxStreak}`;
  if (!isAnswered) setMessage('');
  localStorage.setItem('guess-country-language', currentLanguage);
}

function setTheme(theme) {
  const selectedTheme = ['light', 'dark', 'rgb'].includes(theme) ? theme : 'light';
  document.body.dataset.theme = selectedTheme;
  themeOptions.forEach(option => {
    const isActive = option.dataset.theme === selectedTheme;
    option.classList.toggle('is-active', isActive);
    option.setAttribute('aria-pressed', String(isActive));
  });
  localStorage.setItem('guess-country-theme', selectedTheme);
}

let countries = [];
let gameCountries = [];
let currentCountry = null;
let currentQuestion = 0;
let score = 0;
let streak = 0;
let maxStreak = 0;
let isAnswered = false;
let usedHints = { letters: false, words: false };

function getFirstThreeLettersHint(country) {
  const name = getLocalizedCountryName(country).trim();
  if (!name) return '';
  if (name.length <= 3) return name;
  return name.slice(0, 3) + '...';
}

function getWordCountHint(country) {
  const name = getLocalizedCountryName(country);
  if (!name) return 0;
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return words.length;
}

function showLettersHint() {
  if (isAnswered || !currentCountry) return;
  if (usedHints.letters) {
    setMessage(t('usedLetters'), 'warning');
    return;
  }
  usedHints.letters = true;
  const hint = getFirstThreeLettersHint(currentCountry);
  setMessage(t('startsWith', { hint }), 'hint');
}

function showWordsHint() {
  if (isAnswered || !currentCountry) return;
  if (usedHints.words) {
    setMessage(t('usedWords'), 'warning');
    return;
  }
  usedHints.words = true;
  const count = getWordCountHint(currentCountry);
  const wordText = count === 1 ? t('oneWord') : t('manyWords');
  setMessage(t('wordCount', { count, word: wordText }), 'hint');
}

function levenshteinDistance(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

function stringSimilarity(str1, str2) {
  const a = normalizeAnswer(str1);
  const b = normalizeAnswer(str2);
  if (!a && !b) return 1;
  if (!a || !b) return 0;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  const distance = levenshteinDistance(a, b);
  return 1 - distance / maxLen;
}
// автофарм словаря//
function tryAutoCorrect(inputText, country) {
  const allowed = getAllowedNames(country);
  if (!allowed.length) return { corrected: false, bestName: null, similarity: 0 };

  let bestName = null;
  let bestSim = 0;

  for (const name of allowed) {
    const sim = stringSimilarity(inputText, name);
    if (sim > bestSim) {
      bestSim = sim;
      bestName = name;
    }
  }

  const common = country.name?.common || '';
  const commonSim = stringSimilarity(inputText, common);
  if (commonSim > bestSim) {
    bestSim = commonSim;
    bestName = normalizeAnswer(common);
  }

  const corrected = bestSim >= 0.7;
  return {
    corrected,
    bestName: corrected ? (common || bestName) : null,
    similarity: bestSim
  };
}


function showElement(element, visible) {
  element.classList.toggle('hidden', !visible);
}

function setButtonVisible(button, visible) {
  button.classList.toggle('hidden', !visible);
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
 // получаєш валід з API всп гуд, якщо не то лох//
function getValidCountries(data) {
  const result = Array.isArray(data) ? data : data?.data || [];
  const list = Array.isArray(result) ? result : [result];

  return list
    .map(country => ({
      name: {
        common: typeof country?.name === 'string' ? country.name : country?.name?.common || ''
      },
      flags: {
        png: country?.flags?.png || country?.flag || '',
        svg: country?.flags?.svg || ''
      },
      translations: country?.translations || {}
    }))
    .filter(country => country.name.common && country.flags.png);
}

function mergeCountryTranslations(countryList, translationData) {
  if (!Array.isArray(translationData)) return countryList;

  const translationsByName = new Map(
    translationData
      .filter(country => country?.name?.common)
      .map(country => [normalizeAnswer(country.name.common), country.translations || {}])
  );

  return countryList.map(country => ({
    ...country,
    translations: translationsByName.get(normalizeAnswer(country.name.common)) || country.translations
  }));
}

function getLocalizedCountryName(country) {
  if (!country) return '';
  if (currentLanguage === 'uk') {
    return country.translations?.ukr?.common
      || ukrainianCountryNames[country.name?.common?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z]/g, '')]
      || country.name?.common
      || '';
  }
  return country.name?.common || '';
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
  const localized = getLocalizedCountryName(country);

  if (common) names.add(normalizeAnswer(common));
  if (ukr) names.add(normalizeAnswer(ukr));
  if (localized) names.add(normalizeAnswer(localized));

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
// вибір країн //
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
  flag.alt = getLocalizedCountryName(currentCountry) || 'Flag';
  flag.classList.remove('flag-empty');
  flag.style.display = 'block';
}

function updateScoreboard() {
  questionLabel.textContent = `${t('question')}: ${currentQuestion + 1}/${gameCountries.length}`;
  scoreLabel.textContent = `${t('score')}: ${score}`;
  streakLabel.textContent = `${t('streak')}: ${streak}`;
}
// тута подсказки //
function ensureHintButtons() {
  if (document.getElementById('hintLettersBtn')) return;

  const container = document.createElement('div');
  container.id = 'hintButtons';
  container.style.cssText = 'display:flex;gap:8px;margin:8px 0;flex-wrap:wrap;';

  const btnLetters = document.createElement('button');
  btnLetters.id = 'hintLettersBtn';
  btnLetters.type = 'button';
  btnLetters.textContent = t('hintLetters');
  btnLetters.className = 'hint-btn';
  btnLetters.addEventListener('click', showLettersHint);

  const btnWords = document.createElement('button');
  btnWords.id = 'hintWordsBtn';
  btnWords.type = 'button';
  btnWords.textContent = t('hintWords');
  btnWords.className = 'hint-btn';
  btnWords.addEventListener('click', showWordsHint);

  container.append(btnLetters, btnWords);

  if (answerInput && answerInput.parentNode) {
    answerInput.parentNode.insertBefore(container, answerInput.nextSibling);
  } else if (gameScreen) {
    gameScreen.appendChild(container);
  }
}

function setHintButtonsEnabled(enabled) {
  const btnL = document.getElementById('hintLettersBtn');
  const btnW = document.getElementById('hintWordsBtn');
  if (btnL) btnL.disabled = !enabled || usedHints.letters;
  if (btnW) btnW.disabled = !enabled || usedHints.words;
}
// показується вопроси і флаг //
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
  usedHints = { letters: false, words: false };
  setMessage('');
  updateScoreboard();

  ensureHintButtons();
  setHintButtonsEnabled(true);
}

function endGame() {
  showElement(gameScreen, false);
  showElement(resultScreen, true);

  const percent = gameCountries.length ? Math.round((score / gameCountries.length) * 100) : 0;

  finalScore.textContent = `${score} / ${gameCountries.length}`;
  resultPercent.textContent = `${percent}${t('percent')}`;
  maxStreakResult.textContent = `${t('maxStreak')}: ${maxStreak}`;
}

function nextQuestion() {
  currentQuestion += 1;

  if (currentQuestion < gameCountries.length) {
    showQuestion();
    return;
  }

  endGame();
}
// рестарт //
function startNewGame() {
  score = 0;
  streak = 0;
  maxStreak = 0;
  currentQuestion = 0;
  isAnswered = false;
  usedHints = { letters: false, words: false };

  gameCountries = chooseGameCountries();

  showElement(startScreen, false);
  showElement(resultScreen, false);
  showElement(gameScreen, true);

  if (!gameCountries.length) {
    showApiError(t('noCountries'));
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
    setMessage(t('emptyAnswer'), 'warning');
    return;
  }

  const allowedNames = getAllowedNames(currentCountry);
  const isExact = allowedNames.includes(normalizedInput);

  // Автовиправлення при ≥ 70% схожості
  const auto = tryAutoCorrect(inputText, currentCountry);

  if (isExact || auto.corrected) {
    score += 1;
    streak += 1;
    maxStreak = Math.max(maxStreak, streak);

    if (isExact) {
      setMessage(t('correct'), 'success');
    } else {
      answerInput.value = auto.bestName;
      const percent = Math.round(auto.similarity * 100);
      setMessage(
        t('almost', { percent, name: auto.bestName }),
        'success'
      );
    }
    //  прпр не відображався в локальному //
    isAnswered = true;
    answerInput.disabled = true;
    checkBtn.disabled = true;
    setButtonVisible(nextBtn, true);
    setButtonVisible(checkBtn, false);
    setHintButtonsEnabled(false);

    updateScoreboard();
    return;
  }

  // якщо будуть баги з відповідю тут правильність //
  streak = 0;
  setMessage(t('wrong', { name: getLocalizedCountryName(currentCountry) }), 'error');

  isAnswered = true;
  answerInput.disabled = true;
  checkBtn.disabled = true;
  setButtonVisible(nextBtn, true);
  setButtonVisible(checkBtn, false);
  setHintButtonsEnabled(false);

  updateScoreboard();
}

async function loadCountries() {
  startBtn.disabled = true;
  startBtn.textContent = t('loading');
  showApiError('');

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`API error ${response.status}`);

    const data = await response.json();
    countries = getValidCountries(data);

    try {
      const translationsResponse = await fetch(TRANSLATIONS_URL);
      if (translationsResponse.ok) {
        const translationData = await translationsResponse.json();
        countries = mergeCountryTranslations(countries, translationData);
      }
    } catch {
    }

    if (!countries.length) throw new Error('empty');

    startBtn.disabled = false;
    startBtn.textContent = t('start');
  } catch (error) {
    countries = [];
    startBtn.disabled = false;
    startBtn.textContent = t('retry');
    showApiError(t('apiError', { details: error.message }));
  }
}

startBtn.addEventListener('click', () => {
  if (!countries.length) {
    loadCountries();
    return;
  }

  startNewGame();
});

themeOptions.forEach(option => {
  option.addEventListener('click', () => setTheme(option.dataset.theme));
});

languageOptions.forEach(option => {
  option.addEventListener('click', () => setLanguage(option.dataset.language));
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
setTheme(localStorage.getItem('guess-country-theme'));
setLanguage(localStorage.getItem('guess-country-language'));

window.addEventListener('DOMContentLoaded', () => {
  loadCountries();
});