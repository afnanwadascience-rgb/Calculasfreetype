/*! Calculas Typing: Premium cinematic 3D typing platform - Unified app.js
 *  Integrates CalculasEngine (pure logic) + CalculasContent (passage data) 
 *  with cinematic hero section and scroll-controlled video
 *  Dark theme: charcoal, graphite, dark metallic gray
 *  All functionality preserved from original project
 */

/* Global setup - these will be initialized after DOM loads */
var CalculasEngine = window.CalculasEngine || {};
var CalculasContent = window.CalculasContent || {};
var CalculasSound = window.CalculasSound || { key: function () {}, space: function () {}, back: function () {}, isEnabled: function () { return false; }, setEnabled: function () {}, getVolume: function () { return 0; }, setVolume: function () {} };

/* ============================================
   APPLICATION STATE
   ============================================ */
var UI = {
  uid: 0,
  active: null,
  currentMode: 'standard',
  currentDuration: 30, // 30-second test
  startTime: null,
  timerId: null,
  finished: false,
  lastSnapshot: null,
  testCount: 0,
  bestWpm: 0,
  history: [],
  soundEnabled: false,
  volume: 0.5
};

/* ============================================
   Initialize sound system on page load
   ============================================ */
function initSound() {
  // Initialize sound state from localStorage
  UI.soundEnabled = CalculasSound.isEnabled();
  // Create/ensure AudioContext exists if sound was previously enabled
  if (UI.soundEnabled) {
    CalculasSound.setEnabled(true);
  }
  UI.soundEnabled = CalculasSound.isEnabled();
  UI.volume = CalculasSound.getVolume() / 100;
}

/* ============================================
   DOM ELEMENT CACHE
   ============================================ */
var DOM = {
  heroVideo: null,
  heroProgress: 0,
  testSection: null,
  modeButtons: null,
  passageElement: null,
  textarea: null,
  resultsSection: null,
  wpmDisplay: null,
  accuracyDisplay: null,
  errorsDisplay: null,
  timeDisplay: null,
  restartButton: null,
  tryAgainButton: null,
  newTestButton: null,
  historyList: null,
  bestWpmDisplay: null,
  soundToggle: null,
  volumeSlider: null
};

/* ============================================
   INITIALIZE
   ============================================ */
function init() {
  // Cache DOM elements
  cacheDom();

  // Initialize sound system
  initSound();

  // Set up hero video
  setupHeroVideo();

  // Set up mode buttons
  setupModeButtons();

  // Set up sound controls
  setupSoundControls();

  // Set up restart/new test
  setupTestControls();

  // Initialize first test
  renderTest();

  // Listen for window messages/visibility changes
  setupVisibilityHandling();

  console.log('Calculas Typing initialized');
}

/* ============================================
   CACHE DOM ELEMENTS
   ============================================ */
function cacheDom() {
  DOM.heroVideo = document.getElementById('heroVideo');
  DOM.testSection = document.querySelector('.typing-test');
  DOM.modeButtons = document.querySelectorAll('.mode');
  DOM.passageElement = document.getElementById('passage');
  DOM.textarea = document.querySelector('#typing-test .tt-input');
  DOM.resultsSection = document.querySelector('.tt-result');
  DOM.wpmDisplay = document.querySelector('.tt-stats .st-v[data-s="wpm"]');
  DOM.accuracyDisplay = document.querySelector('.tt-stats .st-v[data-s="acc"]');
  DOM.errorsDisplay = document.querySelector('.tt-stats .st-v[data-s="bad"]');
  DOM.timeDisplay = document.querySelector('.tt-stats .st-v[data-s="time"]');
  DOM.restartButton = document.querySelector('.tt-result [data-act="again"]');
  DOM.tryAgainButton = document.querySelector('.res-actions .btn.primary');
  DOM.newTestButton = document.querySelector('.tt-result [data-act="new"]');
  DOM.historyList = document.getElementById('history');
  DOM.bestWpmDisplay = document.getElementById('bestWpm');
  DOM.soundToggle = document.getElementById('sound-toggle');
  DOM.volumeSlider = document.getElementById('sound-vol');
}

/* ============================================
   SETUP HERO VIDEO SCROLL CONTROL
   ============================================ */
function setupHeroVideo() {
  if (!DOM.heroVideo) return;

  // Make video cover the hero area
  function resizeHeroVideo() {
    if (DOM.heroVideo) {
      DOM.heroVideo.style.height = window.innerHeight + 'px';
    }
  }
  resizeHeroVideo();
  window.addEventListener('resize', resizeHeroVideo);

  // Initially set video to play from beginning
  if (DOM.heroVideo) {
    DOM.heroVideo.currentTime = 0;
    DOM.heroVideo.play().catch(function() {
      // Autoplay may be blocked, that's OK
    });
  }
}

/* ============================================
   SETUP MODE BUTTONS
   ============================================ */
function setupModeButtons() {
  if (!DOM.modeButtons) return;

  DOM.modeButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      DOM.modeButtons.forEach(function(btn) {
        btn.classList.remove('active');
      });
      // Add active class to clicked button
      this.classList.add('active');
      UI.currentMode = this.dataset.mode;
      // Reset and start new test
      resetTest();
      renderTest();
    });
  });

  // Set initial active button
  if (DOM.modeButtons.length > 0) {
    DOM.modeButtons[0].classList.add('active');
  }
}

/* ============================================
   SETUP SOUND CONTROLS
   ============================================ */
function setupSoundControls() {
  if (!DOM.soundToggle) return;

  // Initialize sound state
  UI.soundEnabled = CalculasSound.isEnabled();

  // Update toggle button appearance
  function updateSoundToggle() {
    DOM.soundToggle.textContent = UI.soundEnabled ? '🔊' : '🔇';
    DOM.soundToggle.setAttribute('aria-label', UI.soundEnabled
      ? 'Typing sound: on, click to mute'
      : 'Typing sound: off, click to turn on');
  }
  updateSoundToggle();

  // Toggle sound on click
  DOM.soundToggle.addEventListener('click', function() {
    UI.soundEnabled = !UI.soundEnabled;
    CalculasSound.setEnabled(UI.soundEnabled);
    updateSoundToggle();
  });

  // Volume control
  if (DOM.volumeSlider) {
    // Set initial volume
    var savedVolume = parseInt(localStorage.getItem('ct-vol') || '55', 10) / 100;
    DOM.volumeSlider.value = isNaN(savedVolume) ? 55 : savedVolume * 100;
    UI.volume = DOM.volumeSlider.value / 100;
    CalculasSound.setVolume(UI.volume);

    // Update volume on change
    DOM.volumeSlider.addEventListener('input', function() {
      UI.volume = this.value / 100;
      CalculasSound.setVolume(UI.volume);
      localStorage.setItem('ct-vol', String(Math.round(UI.volume * 100)));
    });
  }
}

/* ============================================
   SETUP TEST CONTROLS
   ============================================ */
function setupTestControls() {
  // Restart / Try Again
  function restartTest() {
    resetTest();
    renderTest();
  }

  if (DOM.restartButton) {
    DOM.restartButton.addEventListener('click', restartTest);
  }
  if (DOM.tryAgainButton) {
    DOM.tryAgainButton.addEventListener('click', restartTest);
  }
  if (DOM.newTestButton) {
    DOM.newTestButton.addEventListener('click', function() {
      resetTest();
      renderTest();
    });
  }

  // Handle Escape key to reset
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      resetTest();
    }
  });
}

/* ============================================
   SETUP VISIBILITY HANDLING
   ============================================ */
function setupVisibilityHandling() {
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden && !UI.finished) {
      // Page became visible - restart timer if test is running
      if (UI.startTime !== null && UI.timerId === null) {
        startTimer();
      }
    }
  });
}

/* ============================================
   RENDER TEST
   ============================================ */
function renderTest() {
  // Get mode-specific content
  var modeData = getModeData();
  if (!modeData) return;

  // Create engine with words
  var words = modeData.words.slice();
  var eng = CalculasEngine.create(words, { duration: UI.currentDuration });

  // Store engine reference for highlighting
  window.currentEngine = eng;

  // Render the passage
  renderPassage(words, eng);

  // Set up input handling
  setupInput(eng);

  // Update stats initially
  updateStats(0);
}

/* ============================================
   GET MODE DATA
   ============================================ */
function getModeData() {
  var mode = UI.currentMode;

  if (mode === 'numbers') {
    // Use numbers mode from content
    var gen = CalculasContent.gen;
    var numbers = gen.numbers(60); // 60 numbers for 30-second test
    return { words: numbers };
  } else if (mode === 'punctuation') {
    var punct = CalculasContent.punct;
    var baseWords = CalculasContent.common.concat(CalculasContent.punct);
    var generated = [];
    for (var i = 0; i < 60; i++) {
      var word = baseWords[Math.floor(Math.random() * baseWords.length)];
      // Add punctuation to some words
      if (Math.random() < 0.3) {
        var puncMark = ['', ',', '.', '!', '?'][Math.floor(Math.random() * 5)];
        if (puncMark) word += puncMark;
      }
      generated.push(word);
    }
    return { words: generated };
  } else {
    // Standard mode - use common words
    var common = CalculasContent.common;
    var selected = [];
    for (var i = 0; i < 60; i++) {
      selected.push(common[Math.floor(Math.random() * common.length)]);
    }
    return { words: selected };
  }
}

/* ============================================
   RENDER PASSAGE
   ============================================ */
function renderPassage(words, eng) {
  // Clear existing passage
  if (DOM.passageElement) {
    DOM.passageElement.innerHTML = '';
  }

  if (!words || words.length === 0) {
    if (DOM.passageElement) {
      DOM.passageElement.textContent = 'No passage available';
    }
    return;
  }

  // Generate HTML with character spans
  var html = '';
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    for (var j = 0; j < word.length; j++) {
      var char = word[j];
      var escapedChar = char.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
      html += '<span class="c" data-wi="' + i + '" data-ci="' + j + '">' + escapedChar + '</span>';
    }
    html += ' ';
  }

  if (DOM.passageElement) {
    DOM.passageElement.innerHTML = html;
  }

  // Store reference for highlighting
  DOM.wordSpans = DOM.passageElement ? DOM.passageElement.querySelectorAll('.c') : [];

  // Apply current engine state highlighting
  if (eng && eng.buffer) {
    var buffer = eng.buffer();
    highlightCharacters(buffer);
  }
}

/* ============================================
   HIGHLIGHT CHARACTERS
   ============================================ */
function highlightCharacters(typedChars) {
  var spans = DOM.wordSpans || DOM.passageElement ? DOM.passageElement.querySelectorAll('.c') : [];
  if (!spans) return;

  // Remove existing classes
  spans.forEach(function(span) {
    span.className = 'c';
  });

  // Apply classes based on typed characters
  if (typedChars) {
    for (var i = 0; i < typedChars.length; i++) {
      var char = typedChars[i];
      var targetSpan = spans[i];
      if (!targetSpan) break;

      if (char === undefined || char === null) {
        // No more typed characters
        break;
      }

      // Get the expected character from the passage word at position i
      var eng = window.currentEngine;
      if (eng && eng.word) {
        var word = eng.word(0);
        if (word && i < word.length) {
          var expectedChar = word[i];
          if (char === expectedChar) {
            targetSpan.classList.add('ok');
          } else {
            targetSpan.classList.add('no');
          }
        }
      }
    }
  }

  // Add current character indicator
  if (eng && eng.index !== undefined) {
    var curIndex = eng.index();
    if (curIndex < spans.length) {
      spans.forEach(function(span, idx) {
        if (idx === curIndex) {
          span.classList.add('cur');
        } else {
          span.classList.remove('cur');
        }
      });
    }
  }
}

/* ============================================
   SETUP INPUT HANDLING
   ============================================ */
function setupInput(eng) {
  if (!DOM.textarea) return;

  var prev = '';
  var started = false;

  DOM.textarea.addEventListener('input', function(e) {
    if (eng.isFinished()) {
      DOM.textarea.value = '';
      return finishTest();
    }

    var v = DOM.textarea.value;
    var t = performance.now();

    // Calculate diff between prev and current
    var i = 0;
    while (i < prev.length && i < v.length && prev.charAt(i) === v.charAt(i)) {
      i++;
    }

    // Remove wrong characters
    for (var k = prev.length; k > i; k--) {
      eng.backspace();
      if (UI.soundEnabled) CalculasSound.back();
    }

    // Add new typed characters
    for (var k = i; k < v.length; k++) {
      var ch = v.charAt(k);
      if (ch === ' ') {
        // Space handling - process current word
        paint();
        var idx = eng.index();
        var len = eng.buffer().length;
        if (eng.space(t)) {
          // Handle word completion
          updateStats(t);
          if (UI.soundEnabled) CalculasSound.space();
        }
      } else if (ch >= ' ') {
        eng.type(ch, t);
        if (UI.soundEnabled) CalculasSound.key();
      }
      if (eng.isFinished()) break;
    }

    DOM.textarea.value = eng.buffer();
    prev = DOM.textarea.value;

    // Update highlighting
    if (eng && eng.buffer) {
      highlightCharacters(eng.buffer());
    }

    // Scroll to current position
    if (eng.index() !== null) {
      scrollToPosition();
    }

    // Check if finished
    if (eng.isFinished()) {
      return finishTest();
    }

    // Start test on first keystroke when in idle state
    if (!started && eng.started()) {
      started = true;
      startTimer();
    }
  });

  // Handle keydown for Escape and Enter
  DOM.textarea.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      resetTest();
    } else if (e.key === 'Enter') {
      e.preventDefault();
    }
  });

  // Focus the textarea after a slight delay
  setTimeout(function() {
    DOM.textarea.focus();
  }, 100);
}

/* ============================================
   PAINT FUNCTION (for space handling)
   ============================================ */
function paint() {
  if (!eng) return;

  var i = eng.index();
  var textEl = DOM.passageElement;
  if (!textEl) return;

  var cs = textEl.children;
  var buf = eng.buffer();
  var w = eng.word(i);

  // Remove old characters beyond current word
  while (cs.length > w.length) {
    textEl.removeChild(cs[cs.length - 1]);
  }

  // Apply classes to each character span
  for (var j = 0; j < w.length; j++) {
    var csj = cs[j];
    if (!csj) break;
    csj.className = j < buf.length ? (buf.charAt(j) === w.charAt(j) ? 'c ok' : 'c no') : (j === buf.length ? 'c cur' : 'c');
  }

  // Add extra characters beyond the word
  if (buf.length > w.length) {
    var extra = '';
    for (var j = w.length; j < buf.length; j++) {
      extra += '<span class="c extra">' + esc(buf.charAt(j)) + '</span>';
    }
    textEl.insertAdjacentHTML('beforeend', extra);
  }

  // Toggle end class
  textEl.classList.toggle('end', buf.length >= w.length);
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, function(c) {
    return '&#' + c.charCodeAt(0) + ';';
  });
}

/* ============================================
   UPDATE STATS
   ============================================ */
function updateStats(t) {
  if (!eng) return;

  var s = eng.snapshot(t);
  if (s) {
    // WPM
    var wpm = Math.round(s.wpm);
    if (DOM.wpmDisplay) DOM.wpmDisplay.textContent = wpm;

    // Accuracy
    var acc = Math.round(s.accuracy) + '%';
    if (DOM.accuracyDisplay) DOM.accuracyDisplay.textContent = acc;

    // Errors
    var errors = s.errors;
    if (DOM.errorsDisplay) DOM.errorsDisplay.textContent = errors;

    // Time
    var timeLeft;
    var lim = UI.currentDuration; // 30 seconds
    if (lim) {
      var elapsed = s.elapsed;
      timeLeft = Math.max(0, Math.ceil((lim * 1000 - elapsed) / 1000));
      var minutes = Math.floor(timeLeft / 60);
      var seconds = timeLeft % 60;
      timeLeft = (minutes > 0 ? minutes + ':' : '') + (seconds < 10 ? '0' : '') + seconds;
    } else {
      timeLeft = 'UNL';
    }
    if (DOM.timeDisplay) DOM.timeDisplay.textContent = timeLeft;
  }
}

/* ============================================
   START TIMER
   ============================================ */
function startTimer() {
  // Clear any existing timer
  if (UI.timerId !== null) {
    clearInterval(UI.timerId);
    UI.timerId = null;
  }

  UI.startTime = performance.now();
  UI.timerId = setInterval(function() {
    var elapsed = (performance.now() - UI.startTime) / 1000;
    var remaining = Math.max(0, UI.currentDuration - Math.floor(elapsed));

    if (DOM.timeDisplay) {
      var minutes = Math.floor(remaining / 60);
      var seconds = remaining % 60;
      DOM.timeDisplay.textContent = (minutes > 0 ? minutes + ':' : '') +
        (seconds < 10 ? '0' : '') + seconds;
    }

    // Check if time is up
    if (remaining <= 0) {
      clearInterval(UI.timerId);
      UI.timerId = null;
      if (DOM.timeDisplay) DOM.timeDisplay.textContent = '00:00';
      finishTest();
    }
  }, 100);
}

/* ============================================
   FINISH TEST
   ============================================ */
function finishTest() {
  if (UI.finished) return;
  UI.finished = true;

  // Clear timer
  if (UI.timerId !== null) {
    clearInterval(UI.timerId);
    UI.timerId = null;
  }

  // Get final snapshot
  var t = performance.now();
  var s = eng ? eng.snapshot(t) : null;

  if (s) {
    // Display results
    var wpm = Math.round(s.wpm);
    var acc = Math.round(s.accuracy) + '%';
    var errors = s.errors;
    var correct = s.correct;
    var total = s.total;
    var duration = (s.elapsed / 1000).toFixed(1);

    // Show results area
    if (DOM.resultsSection) {
      DOM.resultsSection.hidden = false;
    }

    // Update result displays
    if (DOM.wpmDisplay) DOM.wpmDisplay.textContent = wpm;
    if (DOM.accuracyDisplay) DOM.accuracyDisplay.textContent = acc;
    if (DOM.errorsDisplay) DOM.errorsDisplay.textContent = errors;

    // Save to history
    saveToHistory(wpm, acc, errors, duration);

    // Update best WPM
    updateBestWpm(wpm);
  }

  // Enable interaction with results
  if (DOM.restartButton) DOM.restartButton.disabled = false;
  if (DOM.tryAgainButton) DOM.tryAgainButton.disabled = false;
  if (DOM.newTestButton) DOM.newTestButton.disabled = false;
}

/* ============================================
   SAVE TO HISTORY
   ============================================ */
function saveToHistory(wpm, acc, errors, duration) {
  UI.testCount++;

  var result = {
    wpm: wpm,
    accuracy: acc,
    errors: errors,
    duration: duration,
    date: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    }),
    mode: UI.currentMode
  };

  // Get existing history from localStorage
  var historyStr = localStorage.getItem('calculasTypingHistory');
  var history = historyStr ? JSON.parse(historyStr) : [];

  // Add new result at the beginning
  history.unshift(result);

  // Keep only last 20 results
  history = history.slice(0, 20);

  // Save back to localStorage
  localStorage.setItem('calculasTypingHistory', JSON.stringify(history));

  // Update UI state
  UI.history = history;
  renderHistory();

  // Update best WPM
  updateBestWpm(wpm);
}

/* ============================================
   UPDATE BEST WPM
   ============================================ */
function updateBestWpm(wpm) {
  if (wpm > UI.bestWpm) {
    UI.bestWpm = wpm;
    if (DOM.bestWpmDisplay) DOM.bestWpmDisplay.textContent = wpm;
  }
}

/* ============================================
   RENDER HISTORY
   ============================================ */
function renderHistory() {
  if (!DOM.historyList) return;

  DOM.historyList.innerHTML = '';

  if (UI.history && UI.history.length > 0) {
    UI.history.slice(0, 8).forEach(function(test) {
      var li = document.createElement('div');
      li.className = 'history-item';
      li.innerHTML = '<b>' + test.wpm + ' WPM</b> · ' +
        test.accuracy + ' · ' +
        test.errors + ' errors · ' +
        test.date;
      DOM.historyList.appendChild(li);
    });
  } else {
    DOM.historyList.innerHTML = '<p>No completed tests yet.</p>';
  }

  // Update best WPM display
  if (DOM.bestWpmDisplay && UI.history) {
    DOM.bestWpmDisplay.textContent = UI.history.length > 0
      ? Math.max.apply(Math, UI.history.map(function(x) { return x.wpm; }))
      : 0;
  }
}

/* ============================================
   RESET TEST
   ============================================ */
function resetTest() {
  UI.finished = false;

  // Clear timer
  if (UI.timerId !== null) {
    clearInterval(UI.timerId);
    UI.timerId = null;
  }

  // Reset UI state
  UI.startTime = null;
  UI.currentMode = 'standard';

  // Re-render mode buttons
  if (DOM.modeButtons) {
    DOM.modeButtons.forEach(function(btn) {
      btn.classList.remove('active');
    });
    if (DOM.modeButtons[0]) DOM.modeButtons[0].classList.add('active');
  }

  // Clear passage
  if (DOM.passageElement) {
    DOM.passageElement.innerHTML = '';
  }

  // Clear textarea
  if (DOM.textarea) {
    DOM.textarea.value = '';
  }

  // Hide results
  if (DOM.resultsSection) {
    DOM.resultsSection.hidden = true;
  }

  // Reset stats
  if (DOM.wpmDisplay) DOM.wpmDisplay.textContent = '0';
  if (DOM.accuracyDisplay) DOM.accuracyDisplay.textContent = '100%';
  if (DOM.errorsDisplay) DOM.errorsDisplay.textContent = '0';
  if (DOM.timeDisplay) DOM.timeDisplay.textContent = UI.currentDuration + ':00';

  // Reset engine state
  window.currentEngine = null;

  // Restart timer if not finished
  if (!UI.finished) {
    startTimer();
  }
}

/* ============================================
   SCROLL TO POSITION
   ============================================ */
function scrollToPosition() {
  var textEl = DOM.passageElement;
  if (!textEl) return;

  var el = textEl.querySelector('.w');
  if (!el) return;

  var t = el.offsetTop - (el.offsetHeight || 40);
  textEl.scrollTop = t > 0 ? t : 0;
}

/* ============================================
   RESPONSIVE HANDLING
   ============================================ */
function handleResize() {
  // Adjust hero video on resize
  if (DOM.heroVideo) {
    DOM.heroVideo.style.height = window.innerHeight + 'px';
  }
}
window.addEventListener('resize', handleResize);

/* ============================================
   INITIALIZE APPLICATION
   ============================================ */
// Initialize after a small delay to allow DOM to settle
setTimeout(function() {
  init();

  // Start first test after hero section is visible
  setTimeout(function() {
    // Render the first test
    renderTest();

    // Focus the textarea
    if (DOM.textarea) {
      DOM.textarea.focus();
    }
  }, 500);
}, 100);

// Export for testing
window.CalculasUI = {
  reset: resetTest,
  render: renderTest,
  getMode: function() { return UI.currentMode; }
};