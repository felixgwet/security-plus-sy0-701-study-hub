// SY0-701 Study Hub — local analytics (localStorage)
(function () {
  const KEY = 'sy0701_attempts';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function save(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  }

  window.SY0701_getAttempts = load;

  window.SY0701_record = function (meta, result) {
    const list = load();
    list.push({
      id: meta.id,
      title: meta.title,
      date: new Date().toISOString(),
      correct: result.correct,
      total: result.total,
      pct: result.pct,
      scaled: result.scaled === undefined ? null : result.scaled,
      passed: result.passed === undefined ? null : result.passed
    });
    save(list);
  };

  // Auto-hook: exam engines (sim/fb/final/mega) call submitExam -> result-screen
  function hookExam() {
    if (typeof submitExam !== 'function') return false;
    const orig = submitExam;
    let recorded = false;
    submitExam = function (auto) {
      orig(auto);
      if (recorded) return;
      recorded = true;
      const meta = window.__EXAM_META || { id: location.pathname.split('/').pop(), title: document.title };
      const raw = (document.getElementById('raw-line') || {}).textContent || '';
      const m = raw.match(/([\d.]+) of (\d+) points \((\d+)%\)/);
      const scaled = parseInt((document.getElementById('scaled-score') || {}).textContent, 10);
      if (m) {
        window.SY0701_record(meta, {
          correct: parseFloat(m[1]), total: parseInt(m[2], 10), pct: parseInt(m[3], 10),
          scaled: isNaN(scaled) ? null : scaled,
          passed: isNaN(scaled) ? null : scaled >= 750
        });
      }
    };
    return true;
  }

  // Auto-hook: quiz engine calls showResults -> result-screen with final-score
  function hookQuiz() {
    if (typeof showResults !== 'function') return false;
    const orig = showResults;
    let recorded = false;
    showResults = function () {
      orig();
      if (recorded) return;
      recorded = true;
      const meta = window.__EXAM_META || { id: location.pathname.split('/').pop(), title: document.title };
      const txt = (document.getElementById('final-score') || {}).textContent || '';
      const m = txt.match(/(\d+)\s*\/\s*(\d+)/);
      if (m) {
        const correct = parseInt(m[1], 10), total = parseInt(m[2], 10);
        window.SY0701_record(meta, { correct: correct, total: total, pct: Math.round(correct / total * 100) });
      }
    };
    return true;
  }

  function tryHook() {
    if (!hookExam()) hookQuiz();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryHook);
  } else {
    tryHook();
  }
})();
