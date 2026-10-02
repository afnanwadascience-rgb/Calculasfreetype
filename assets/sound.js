/*! Calculas Typing sound.
 *  All sounds are synthesized in the browser with the Web Audio API — there is no audio file to
 *  ship or license, and per spec (\u00a748) nothing plays until the visitor turns sound on: the
 *  AudioContext is only created inside a click on the sound toggle, which is itself a user gesture.
 */
(function () {
  'use strict';
  function ls(k, v) {
    try {
      if (v === undefined) return localStorage.getItem(k);
      if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v);
    } catch (e) { /* storage unavailable */ }
    return null;
  }

  var ctx = null, master = null;
  var enabled = ls('ct-sound') === '1';
  var volume = Math.min(100, Math.max(0, parseInt(ls('ct-vol'), 10)));
  if (isNaN(volume)) volume = 55;
  volume = volume / 100;

  function ensure() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = volume;
    master.connect(ctx.destination);
    return ctx;
  }

  // Filtered noise reads as a mechanical click; a pure tone reads as a beep.
  function noiseBuffer(c, dur) {
    var n = Math.max(1, Math.floor(c.sampleRate * dur));
    var buf = c.createBuffer(1, n, c.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2);
    return buf;
  }

  function click(freq, q, dur, peak) {
    if (!enabled || volume <= 0) return;
    var c = ensure();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    var t = c.currentTime;
    var src = c.createBufferSource();
    src.buffer = noiseBuffer(c, dur);
    var band = c.createBiquadFilter();
    band.type = 'bandpass'; band.frequency.value = freq; band.Q.value = q;
    var g = c.createGain();
    g.gain.setValueAtTime(peak, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(band); band.connect(g); g.connect(master);
    src.start(t); src.stop(t + dur + 0.02);
  }

  var Sound = {
    key: function () { click(2500 + Math.random() * 600, 4.5, 0.026, 0.85); },
    space: function () { click(950 + Math.random() * 150, 2, 0.055, 1); },
    back: function () { click(1750, 5, 0.018, 0.55); },
    isEnabled: function () { return enabled; },
    setEnabled: function (v) {
      enabled = !!v; ls('ct-sound', enabled ? '1' : '0');
      if (enabled) ensure();
    },
    getVolume: function () { return Math.round(volume * 100); },
    setVolume: function (v) {
      volume = Math.min(100, Math.max(0, +v || 0)) / 100;
      ls('ct-vol', String(Math.round(volume * 100)));
      if (master) master.gain.value = volume;
    }
  };
  window.CalculasSound = Sound;
})();
