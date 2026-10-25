/* A newspaper, folded open. No canvas, animation library, or blocked first paint. */
(() => {
  'use strict';
  const root = document.documentElement;
  const curtain = document.getElementById('paper-curtain');
  if (!curtain) return;
  const skip = document.getElementById('skip-paper');
  const unfold = document.getElementById('unfold-paper');
  const paper = document.querySelector('.newspaper');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const permitted = () => root.dataset.motion !== 'off' && !reduce.matches;
  const timers = new Set();
  let navigating = false;
  let returnFocus;
  let paperWasInert = false;
  let ownsInert = false;
  const later = (callback, delay) => {
    const id = setTimeout(() => { timers.delete(id); callback(); }, delay);
    timers.add(id);
    return id;
  };
  const clearTimers = () => { timers.forEach(clearTimeout); timers.clear(); };
  const finish = () => {
    clearTimers();
    navigating = false;
    root.dataset.press = 'idle';
    root.classList.remove('press-entering');
    skip.hidden = true;
    unfold.hidden = true;
    if (ownsInert) { paper.inert = paperWasInert; ownsInert = false; }
    if (document.activeElement === skip || document.activeElement === unfold) returnFocus?.focus({ preventScroll: true });
  };
  const stage = (state) => {
    clearTimers();
    // Register the escape hatch before making content temporarily inert.
    later(finish, state === 'waiting' ? 45000 : 2800);
    if (paper && !ownsInert) { paperWasInert = paper.inert; ownsInert = true; paper.inert = true; }
    root.dataset.press = state;
    skip.hidden = false;
    unfold.hidden = state !== 'waiting';
  };
  const open = (fromReplay = false) => {
    if (!permitted()) { finish(); return; }
    root.dataset.press = 'opening';
    root.classList.toggle('press-entering', !fromReplay);
    unfold.hidden = true;
    later(finish, fromReplay ? 1080 : 1020);
  };
  const replay = (button) => {
    if (!permitted() || navigating) return;
    returnFocus = button.closest('.edition-preferences')?.querySelector('summary') || button;
    document.querySelector('.edition-preferences[open]')?.removeAttribute('open');
    stage('waiting');
    unfold.focus({ preventScroll: true });
  };
  const replayButtons = [...document.querySelectorAll('[data-replay-press]')];
  const syncReplay = () => replayButtons.forEach(button => { button.disabled = !permitted(); });
  replayButtons.forEach(button => button.addEventListener('click', () => replay(button)));
  syncReplay();
  skip.addEventListener('click', finish);
  unfold.addEventListener('click', () => open(true));
  document.addEventListener('keydown', event => {
    if (root.dataset.press === 'idle') return;
    if (event.key === 'Escape') { event.preventDefault(); finish(); }
    if (event.key === 'Tab' && !navigating) {
      const choices = [unfold, skip].filter(button => !button.hidden);
      const next = event.shiftKey ? choices[0] : choices[choices.length - 1];
      if (document.activeElement === next || !choices.includes(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? choices[choices.length - 1] : choices[0]).focus();
      }
    }
  });
  reduce.addEventListener('change', () => { syncReplay(); if (!permitted() && !navigating) finish(); });
  document.querySelector('[data-toggle-motion]')?.addEventListener('click', () => later(() => { syncReplay(); if (!permitted()) finish(); }, 0));
  addEventListener('pageshow', event => {
    if (event.persisted) { navigating = false; finish(); }
  });

  // Let anchors open a folded supplement before scrolling to its contents.
  const revealAnchor = (hash = location.hash) => {
    if (typeof hash !== 'string') hash = location.hash;
    if (!hash) return;
    let target;
    try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
    if (!target) return;
    let parent = target.parentElement;
    let expanded = false;
    while (parent) {
      if (parent.tagName === 'DETAILS' && !parent.open) { parent.open = true; expanded = true; }
      parent = parent.parentElement;
    }
    if (expanded) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'instant', block: 'start' }));
  };
  addEventListener('hashchange', revealAnchor);
  revealAnchor();
  document.addEventListener('toggle', event => {
    if (event.target.matches('details')) dispatchEvent(new Event('resize'));
  }, true);
  document.addEventListener('click', event => {
    const preferences = document.querySelector('.edition-preferences[open]');
    if (preferences && !preferences.contains(event.target)) preferences.open = false;
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, location.href);
    if (url.origin === location.origin && url.pathname === location.pathname && url.hash) revealAnchor(url.hash);
    if (url.origin !== location.origin || url.pathname === location.pathname || !/\/(index|portfolio|writing|notices)\.html$/.test(url.pathname) || !permitted()) return;
    event.preventDefault();
    if (navigating) return;
    navigating = true;
    returnFocus = undefined;
    stage('covering');
    // Navigation is independent of storage and animation events.
    later(() => {
      try { sessionStorage.setItem('ij-press-arrive', '1'); } catch { /* Optional. */ }
      location.assign(url.href);
    }, 330);
  });

  let arriving = false;
  let firstVisit = false;
  try {
    arriving = sessionStorage.getItem('ij-press-arrive') === '1';
    sessionStorage.removeItem('ij-press-arrive');
    firstVisit = sessionStorage.getItem('ij-press-seen-v1') !== '1';
    sessionStorage.setItem('ij-press-seen-v1', '1');
  } catch { firstVisit = root.dataset.press === 'intro'; }
  if (permitted() && (arriving || (firstVisit && !location.hash))) {
    stage(arriving ? 'closed' : 'intro');
    later(() => open(), arriving ? 60 : 240);
  } else finish();
})();
