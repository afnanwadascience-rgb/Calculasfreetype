/*! Calculas Typing content. All text is original, written for this site. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CalculasContent = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  function w(s) { return s.split(/\s+/).filter(Boolean); }

  var common = w('the of and a to in is you that it he was for on are as with his they at be this have from or one had by word but not what all were we when your can said there use an each which she do how their if will up other about out many then them these so some her would make like him into time has look two more write go see number no way could people my than first water been call who oil its now find long down day did get come made may part over new sound take only little work know place year live me back give most very after thing our just name good sentence man think say great where help through much before line right too mean old any same tell boy follow came want show also around form three small set put end does another well large must big even such because turn here why ask went men read need land different home us move try kind hand picture again change off play spell air away animal house point page letter mother answer found study still learn should world school never last door between city tree cross farm hard start might story far sea draw left late run while press close night real life few open seem together next white children begin got walk example paper group always music those both mark often until mile river car feet care second enough plain girl usual young ready above ever red list though feel talk bird soon body family direct');

  var punct = w("don't can't it's we're they'll well-known part-time self-taught e-mail up-to-date one-on-one twenty-one high-quality long-term short-term day-to-day");

  var practice = {
    beginner: { title: 'Beginner', blurb: 'Short, easy words to build a steady rhythm.',
      words: w('cat dog sun run sit hat pen map bed cup fun red big top win yes box car fan jam kid leg net pig rug six tip van wet zip arm bag dig egg fig gum hop ink jet key lip mud nap owl pot ram sky toy web') },
    intermediate: { title: 'Intermediate', blurb: 'Everyday words of five to seven letters.',
      words: w('garden window planet basket silver bridge morning thunder pocket market island custom candle orange travel rescue jungle winter pillow signal button coffee mirror finger shadow pepper ticket rocket valley harbor cotton lantern meadow whistle blanket compass drawer engine forest gadget helmet') },
    advanced: { title: 'Advanced', blurb: 'Long words that reward smooth finger movement.',
      words: w('extraordinary architecture responsibility communication environmental infrastructure unpredictable experimental collaboration representative international opportunity understanding organization development performance relationship appreciation characteristic determination entrepreneurial interpretation sustainability transformation comprehensive') },
    numbers: { title: 'Numbers', blurb: 'Random numbers to train the number row.', gen: 'numbers' },
    punctuation: { title: 'Punctuation', blurb: 'Commas, quotes, brackets and other symbols in running text.', gen: 'punctuation' },
    difficult: { title: 'Difficult words', blurb: 'Words people often misspell or stumble over.',
      words: w('necessary separate definitely occurrence accommodate rhythm privilege conscience embarrass guarantee maintenance questionnaire recommend schedule Wednesday February government environment restaurant vacuum perseverance millennium pronunciation exaggerate unnecessary independent bureaucracy silhouette acquire') },
    common: { title: 'Common words', blurb: 'The words English uses most, typed until they feel automatic.', words: common },
    programming: { title: 'Programming', blurb: 'Keywords and terms from everyday software work.',
      words: w('function return const variable array object string boolean import export class async await promise interface database server request response module package compile debug commit branch merge deploy syntax parameter callback iterator selector template framework endpoint session token cache query') },
    business: { title: 'Business', blurb: 'Vocabulary for emails, reports and meetings.',
      words: w('budget revenue invoice customer strategy quarterly forecast supplier contract proposal meeting agenda deadline manager client profit margin market growth report policy partner training payroll inventory schedule vendor negotiate approval') },
    academic: { title: 'Academic', blurb: 'Terms for essays, papers and study notes.',
      words: w('hypothesis analysis literature research evidence methodology conclusion theory sample variable review citation abstract argument framework survey interpret criteria context concept discussion objective outcome reference') },
    speed: { title: 'Speed practice', blurb: 'A 60-second sprint of short, frequent words.', time: 60,
      words: w('the and for you are but not all can had her was one our out day get has him his how man new now old see two way who boy did its let put say she too use may off own yet ago air bit cut end few fit got hit job lot low map met net odd pay raw') },
    accuracy: { title: 'Accuracy practice', blurb: 'Awkward letter patterns. Aim for 97% accuracy or better.', goal: 97,
      words: w('quiet queue equip squirt bubble puppy pepper error terror worry weather sweater poultry pottery opportunity typewriter proprietor pretty require repertoire potpourri wrote tower power query quote outer upper') }
  };

  var quotes = [
    'Speed is a side effect of accuracy, so slow down until your fingers stop guessing.',
    'A calm rhythm beats a frantic burst, because mistakes cost more time than patience ever does.',
    'Practice is not repeating the same mistake faster; it is fixing it slowly until it disappears.',
    'Good habits feel awkward for a week, ordinary for a month, and invisible after that.',
    'Read a little ahead, type what you see, and let your eyes stay one word in front of your hands.',
    'The keyboard rewards patience: relax your shoulders, curve your fingers, and let each key do its work.',
    'Every expert once typed with two fingers and a lot of doubt, then simply kept going.',
    'Ten focused minutes today are worth more than an hour of distracted effort next weekend.',
    'When your hands know the keys, your mind is free to chase ideas instead of letters.',
    'Progress rarely arrives with a fanfare; it shows up as one fewer mistake than yesterday.',
    'Look at the words, trust your fingers, and forgive the typo before it steals your focus.',
    'A steady pace is a fast pace in disguise, because you never stop to repair what you broke.',
    'Learning to type well is a quiet skill that pays back a little every single day.',
    'Rhythm turns scattered keystrokes into sentences, and sentences into work that finally feels effortless.'
  ];

  var paragraphs = [
    'Typing is a skill that improves with attention rather than force. Start by keeping your wrists relaxed and your eyes on the screen instead of the keys. Aim for smooth, even keystrokes, and correct mistakes calmly. Within a few weeks of short daily sessions, you will notice that your hands find familiar words almost on their own.',
    'A good workspace makes typing easier. Sit with your back supported, your feet flat on the floor, and your screen at eye level. Keep the keyboard close enough that your elbows rest near your sides. Small changes like these reduce strain, help you stay comfortable during long sessions, and make steady practice far more enjoyable.',
    'Every language has its own rhythm, and English is full of common patterns. Short words such as the, and, and of appear constantly, so typing them smoothly saves a surprising amount of time. Practice them until they feel automatic, then move on to longer words, where accuracy matters even more than speed.',
    'Numbers, punctuation, and capital letters slow many people down. The trick is to treat them as part of the words rather than interruptions. Notice which finger travels to each symbol, repeat the movement slowly, and return to the home row afterward. Before long, a comma or a question mark will feel as natural as a letter.',
    'Plan your practice like a small project. Choose one weakness, such as a tricky letter pair, and spend five minutes on it. Then take a short break, return to a regular test, and compare the results. Measuring your progress in small steps keeps motivation high and shows you exactly what is working.',
    'Fast typists are rarely the ones who hit every key hard. They keep a light touch, move only the fingers they need, and rely on rhythm to stay accurate. If you notice tension in your hands, pause for a moment, shake them out, and begin again. Comfort and speed usually grow together.'
  ];

  var code = [
    'const total = items.reduce((sum, item) => sum + item.price, 0);',
    'for (let i = 0; i < names.length; i++) { console.log(names[i]); }',
    'def average(values): return sum(values) / len(values)',
    'SELECT name, email FROM users WHERE active = 1 ORDER BY name;',
    '<a href="/about/" class="link">About us</a>',
    '.card { display: grid; gap: 12px; padding: 16px; }',
    'if (user && user.isAdmin) { showPanel(); } else { redirect("/login"); }',
    'const sorted = [...list].sort((a, b) => a.score - b.score);',
    'try { await save(data); } catch (err) { console.error(err.message); }',
    'git commit -m "Fix layout bug on mobile"',
    'let counts = new Map(); counts.set(word, (counts.get(word) || 0) + 1);',
    'while (queue.length > 0) { process(queue.shift()); }',
    'import { useState } from "react";',
    'fetch("/api/items").then(res => res.json()).then(console.log);'
  ];

  // Difficulty is a Calculas Typing classification (word length and familiarity).
  var pools = {
    easy: practice.beginner.words,
    medium: common,
    hard: practice.intermediate.words.concat(practice.advanced.words, practice.difficult.words),
    expert: practice.advanced.words.concat(practice.difficult.words, practice.business.words, practice.academic.words, practice.programming.words)
  };

  function rnd(n) { return Math.floor(Math.random() * n); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pick(list, n) {
    var out = [], last = '';
    for (var i = 0; i < n; i++) {
      var x, g = 0;
      do { x = list[rnd(list.length)]; } while (x === last && list.length > 1 && ++g < 6);
      out.push(x); last = x;
    }
    return out;
  }
  function numbers(n) {
    var out = [];
    for (var i = 0; i < n; i++) {
      var len = 1 + rnd(5), s = String(1 + rnd(9));
      while (s.length < len) s += rnd(10);
      out.push(s);
    }
    return out;
  }
  function mixNumbers(words) {
    return words.map(function (x) { return rnd(6) === 0 ? numbers(1)[0] : x; });
  }
  function punctuate(words) {
    var start = true;
    return words.map(function (x) {
      var t = x, r = Math.random();
      if (start && /^[a-z]/.test(t)) { t = t.charAt(0).toUpperCase() + t.slice(1); }
      start = false;
      if (r < 0.10) t += ',';
      else if (r < 0.16) { t += '.'; start = true; }
      else if (r < 0.19) { t += '?'; start = true; }
      else if (r < 0.21) { t += '!'; start = true; }
      else if (r < 0.24) t = '"' + t + '"';
      else if (r < 0.27) t = '(' + t + ')';
      else if (r < 0.29) t += ';';
      else if (r < 0.31) t += ':';
      return t;
    });
  }
  // Clean pasted text: straighten typographic characters, drop control characters, collapse whitespace.
  function clean(text) {
    var s = String(text)
      .replace(/[\u2018\u2019\u201A\u2032]/g, "'").replace(/[\u201C\u201D\u201E\u2033]/g, '"')
      .replace(/[\u2013\u2014\u2212]/g, '-').replace(/\u2026/g, '...').replace(/[\u00A0\u2007\u202F]/g, ' ')
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, '')
      .replace(/\s+/g, ' ').trim();
    var list = s ? s.split(' ') : [];
    return list.slice(0, 1500);
  }
  function repeatShuffle(list, min) {
    var out = [];
    while (out.length < min) out = out.concat(shuffle(list));
    return out;
  }

  return {
    common: common, punct: punct, practice: practice, quotes: quotes, paragraphs: paragraphs, code: code, pools: pools,
    gen: { pick: pick, numbers: numbers, mixNumbers: mixNumbers, punctuate: punctuate, clean: clean, shuffle: shuffle, repeatShuffle: repeatShuffle }
  };
});
