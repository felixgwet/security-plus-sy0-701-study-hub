// Shared stats helpers for index.html and dashboard.html
(function () {
  const KEY = 'sy0701_attempts';
  window.SY0701_getAttempts = function () {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  };

  window.SY0701_stats = function () {
    const a = window.SY0701_getAttempts();
    if (!a.length) return { count: 0 };
    const pcts = a.map(x => x.pct);
    const best = {}, last = {};
    a.forEach(x => {
      best[x.id] = Math.max(best[x.id] || 0, x.pct);
      last[x.id] = x;
    });
    const megaTaken = a.filter(x => x.id.indexOf('mega-exam') !== -1);
    return {
      count: a.length,
      avg: Math.round(pcts.reduce((s, x) => s + x, 0) / pcts.length),
      latest: pcts[pcts.length - 1],
      first: pcts[0],
      best: Math.max.apply(null, pcts),
      bestPerExam: best,
      lastPerExam: last,
      megaCount: megaTaken.length,
      megaAvg: megaTaken.length ? Math.round(megaTaken.reduce((s, x) => s + x.pct, 0) / megaTaken.length) : null
    };
  };

  window.SY0701_escape = function (s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  };
})();
