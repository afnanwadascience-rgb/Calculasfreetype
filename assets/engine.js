/*! Calculas Typing engine. Pure logic: no DOM, no timers. Every test mode uses it.
 *  Scoring (documented on /typing-speed-test/):
 *   1 word = 5 characters (spaces included).
 *   Net WPM  = correct characters / 5 / minutes
 *   Raw WPM  = all typed characters / 5 / minutes
 *   Accuracy = correct keystrokes / (keystrokes + skipped characters) * 100
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CalculasEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var MAX_EXTRA = 8; // extra characters allowed beyond a word's length

  function create(words, opts) {
    opts = opts || {};
    var limit = opts.duration ? opts.duration * 1000 : 0; // 0 = ends when the text ends
    var s = {
      words: words.slice(), wi: 0, cur: '', startT: null, endT: null, finished: false,
      finCorrect: 0, finIncorrect: 0, finRaw: 0, keys: 0, wrong: 0, skipped: 0, backs: 0,
      done: 0, doneOk: 0, missed: [], buckets: []
    };

    function cmp(w, t) {
      var m = 0, n = Math.min(w.length, t.length);
      for (var i = 0; i < n; i++) if (w.charCodeAt(i) === t.charCodeAt(i)) m++;
      return m;
    }
    function begin(t) { if (s.startT === null) s.startT = t; }
    function end(t) { if (!s.finished) { s.finished = true; s.endT = t; } }
    function bucket(t) {
      var i = Math.floor((t - s.startT) / 1000);
      while (s.buckets.length <= i) s.buckets.push(0);
      s.buckets[i]++;
    }
    function commit(withSpace) {
      var w = s.words[s.wi], m = cmp(w, s.cur), exact = s.cur === w;
      s.finCorrect += m + (withSpace && exact ? 1 : 0);
      s.finIncorrect += Math.max(w.length, s.cur.length) - m;
      s.finRaw += s.cur.length + (withSpace ? 1 : 0);
      if (withSpace && s.cur.length < w.length) s.skipped += w.length - s.cur.length;
      s.done++;
      if (exact) s.doneOk++; else if (s.missed.indexOf(w) < 0) s.missed.push(w);
      s.wi++; s.cur = '';
    }
    function consistency(el) {
      var n = Math.floor(el / 1000);
      if (n < 3) return null;
      var sum = 0, i, v;
      for (i = 0; i < n; i++) sum += s.buckets[i] || 0;
      var mean = sum / n;
      if (!mean) return null;
      var sq = 0;
      for (i = 0; i < n; i++) { v = (s.buckets[i] || 0) - mean; sq += v * v; }
      var cv = Math.sqrt(sq / n) / mean; // coefficient of variation of keystrokes per second
      return Math.max(0, Math.min(100, Math.round(100 - cv * 100)));
    }

    return {
      type: function (ch, t) {
        if (s.finished) return false;
        var w = s.words[s.wi];
        if (!w || s.cur.length >= w.length + MAX_EXTRA) return false;
        begin(t);
        s.cur += ch; s.keys++;
        if (ch !== w.charAt(s.cur.length - 1)) s.wrong++;
        bucket(t);
        if (!limit && s.wi === s.words.length - 1 && s.cur.length >= w.length) { commit(false); end(t); }
        return true;
      },
      backspace: function () {
        if (s.finished || !s.cur.length) return false;
        s.cur = s.cur.slice(0, -1); s.backs++;
        return true;
      },
      space: function (t) {
        if (s.finished || !s.cur.length || !s.words[s.wi]) return false;
        begin(t); s.keys++; bucket(t);
        commit(true);
        if (!limit && s.wi >= s.words.length) end(t);
        return true;
      },
      tick: function (t) {
        if (!s.finished && s.startT !== null && limit && t - s.startT >= limit) end(s.startT + limit);
        return s.finished;
      },
      extend: function (more) { for (var i = 0; i < more.length; i++) s.words.push(more[i]); },
      snapshot: function (t) {
        var w = s.words[s.wi] || '', mCur = cmp(w, s.cur);
        var correct = s.finCorrect + mCur, incorrect = s.finIncorrect + (s.cur.length - mCur);
        var el = s.startT === null ? 0 : ((s.finished ? s.endT : (t === undefined ? s.startT : t)) - s.startT);
        var min = Math.max(el, 1000) / 60000;
        var typedTotal = s.keys + s.skipped;
        var missed = s.missed.slice();
        if (s.cur && mCur < s.cur.length && missed.indexOf(w) < 0) missed.push(w);
        return {
          wpm: correct / 5 / min,
          raw: (s.finRaw + s.cur.length) / 5 / min,
          accuracy: typedTotal ? (s.keys - s.wrong) / typedTotal * 100 : 100,
          correct: correct, incorrect: incorrect, total: correct + incorrect,
          errors: s.wrong + s.skipped, corrections: s.backs, keystrokes: s.keys,
          consistency: consistency(el), words: s.done, wordsCorrect: s.doneOk,
          elapsed: el, missed: missed, finished: s.finished
        };
      },
      index: function () { return s.wi; },
      buffer: function () { return s.cur; },
      word: function (i) { return s.words[i] || ''; },
      count: function () { return s.words.length; },
      isFinished: function () { return s.finished; },
      started: function () { return s.startT !== null; }
    };
  }

  return { create: create };
});
