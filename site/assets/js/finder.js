// Client-side filtering for the data finder. State lives in the URL hash so
// a filtered view can be shared (e.g. .../#q=turnout&topic=us-elections).
(function () {
  var data = window.FINDER_DATA || [];
  var $ = function (id) { return document.getElementById(id); };
  var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab-btn'));
  var qEl = $('f-q'), topicEl = $('f-topic'), easyEl = $('f-easy');
  var unitBoxes = Array.prototype.slice.call(document.querySelectorAll('#f-units input'));
  var accessBoxes = Array.prototype.slice.call(document.querySelectorAll('#f-access input'));
  var list = $('cards'), countEl = $('count'), noneEl = $('none');

  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[-–—/]/g, ' ');
  }
  data.forEach(function (d) {
    d.nameN = norm(d.name + ' ' + d.abbr);
    d.kwN = norm(d.kw.join(' | '));
    d.restN = norm(d.desc + ' ' + d.cov);
    d.easy = d.kw.indexOf('beginner friendly') > -1;
  });

  var blank = function () { return { tab: 'all', q: '', topic: '', units: [], access: [], easy: false }; };
  var state = blank();

  function readHash() {
    var s = blank();
    location.hash.replace(/^#/, '').split('&').forEach(function (kv) {
      var i = kv.indexOf('='); if (i < 0) return;
      var k = kv.slice(0, i), v = decodeURIComponent(kv.slice(i + 1));
      if (k === 'tab') s.tab = v;
      else if (k === 'q') s.q = v;
      else if (k === 'topic') s.topic = v;
      else if (k === 'units') s.units = v.split(',').filter(Boolean);
      else if (k === 'access') s.access = v.split(',').filter(Boolean);
      else if (k === 'easy') s.easy = v === '1';
    });
    return s;
  }
  function writeHash() {
    var p = [];
    if (state.tab !== 'all') p.push('tab=' + state.tab);
    if (state.q) p.push('q=' + encodeURIComponent(state.q));
    if (state.topic) p.push('topic=' + state.topic);
    if (state.units.length) p.push('units=' + state.units.join(','));
    if (state.access.length) p.push('access=' + state.access.join(','));
    if (state.easy) p.push('easy=1');
    var h = p.length ? '#' + p.join('&') : '';
    if (h !== location.hash) history.replaceState(null, '', h || location.pathname + location.search);
  }

  // Every search word must match somewhere; matches in the name or keywords rank higher.
  function score(d, terms) {
    var total = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i];
      if (d.nameN.indexOf(t) > -1) total += 10;
      else if (d.kwN.indexOf(t) > -1) total += 5;
      else if (d.restN.indexOf(t) > -1) total += 1;
      else return -1;
    }
    // Bonus when the whole phrase appears as typed (e.g. "civil war").
    if (terms.length > 1) {
      var phrase = terms.join(' ');
      if (d.kwN.indexOf(phrase) > -1 || d.nameN.indexOf(phrase) > -1) total += 8;
    }
    return total;
  }

  function render() {
    tabs.forEach(function (b) {
      var on = b.dataset.tab === state.tab;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    qEl.value = state.q; topicEl.value = state.topic; easyEl.checked = state.easy;
    unitBoxes.forEach(function (b) { b.checked = state.units.indexOf(b.value) > -1; });
    accessBoxes.forEach(function (b) { b.checked = state.access.indexOf(b.value) > -1; });
    // Only offer topics belonging to the current tab.
    Array.prototype.forEach.call(topicEl.querySelectorAll('optgroup'), function (g) {
      g.hidden = g.disabled = state.tab !== 'all' && g.dataset.group !== state.tab;
    });

    var q = norm(state.q).trim(), terms = q ? q.split(/\s+/) : [];
    var shown = [];
    data.forEach(function (d) {
      var ok = (state.tab === 'all' || d.groups.indexOf(state.tab) > -1) &&
        (!state.topic || d.topics.indexOf(state.topic) > -1) &&
        (!state.units.length || d.units.some(function (u) { return state.units.indexOf(u) > -1; })) &&
        (!state.access.length || state.access.indexOf(d.access) > -1) &&
        (!state.easy || d.easy);
      var sc = ok ? (terms.length ? score(d, terms) : 0) : -1;
      if (sc >= 0) shown.push({ i: d.i, sc: sc });
    });
    // Relevance order when searching, otherwise alphabetical (the server order).
    shown.sort(function (a, b) { return b.sc - a.sc || a.i - b.i; });
    var visible = {};
    shown.forEach(function (s) { visible[s.i] = 1; list.appendChild(cards[s.i]); });
    cards.forEach(function (c, i) { c.hidden = !visible[i]; });

    countEl.textContent = shown.length + ' of ' + data.length + ' sources';
    noneEl.hidden = shown.length > 0;
    writeHash();
  }

  function set(patch) { for (var k in patch) state[k] = patch[k]; render(); }
  function checked(boxes) { return boxes.filter(function (b) { return b.checked; }).map(function (b) { return b.value; }); }

  tabs.forEach(function (b) {
    b.addEventListener('click', function () {
      var tab = b.dataset.tab, topic = state.topic;
      // Drop a topic filter that doesn't belong to the new tab.
      if (topic && tab !== 'all') {
        var opt = topicEl.querySelector('option[value="' + topic + '"]');
        if (!opt || opt.parentNode.dataset.group !== tab) topic = '';
      }
      set({ tab: tab, topic: topic });
    });
  });
  var timer;
  qEl.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(function () { set({ q: qEl.value }); }, 120); });
  topicEl.addEventListener('change', function () { set({ topic: topicEl.value }); });
  unitBoxes.forEach(function (b) { b.addEventListener('change', function () { set({ units: checked(unitBoxes) }); }); });
  accessBoxes.forEach(function (b) { b.addEventListener('change', function () { set({ access: checked(accessBoxes) }); }); });
  easyEl.addEventListener('change', function () { set({ easy: easyEl.checked }); });
  $('f-reset').addEventListener('click', function () { state = blank(); render(); });

  // Clicking a keyword chip searches for it; clicking a topic filters to it.
  list.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip'), top = e.target.closest('.topic-link');
    if (chip) { set({ q: chip.dataset.kw, tab: 'all', topic: '' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else if (top) { set({ topic: top.dataset.topic, tab: 'all', q: '' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  });

  window.addEventListener('hashchange', function () { state = readHash(); render(); });
  state = readHash();
  // On phones, fold the filter panel so results appear right below the search box
  // (left open if the URL already carries filters, so they stay visible).
  var more = $('f-more');
  if (window.matchMedia('(max-width: 860px)').matches && !(state.topic || state.units.length || state.access.length || state.easy)) more.open = false;
  render();
})();
