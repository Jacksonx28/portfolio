/* Apply saved preferences before the first paint. Storage may be disabled. */
(() => {
  const root = document.documentElement;
  try {
    const theme = localStorage.getItem('ij-theme');
    if (theme === 'light' || theme === 'dark') root.dataset.theme = theme;
    else if (matchMedia('(prefers-color-scheme: dark)').matches) root.dataset.theme = 'dark';
    root.dataset.motion = localStorage.getItem('ij-motion') === 'off' ? 'off' : 'on';
  } catch { root.dataset.motion = 'on'; }
  try {
    if (root.dataset.motion !== 'off' && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.dataset.press = sessionStorage.getItem('ij-press-arrive') === '1' ? 'closed' :
        sessionStorage.getItem('ij-press-seen-v1') !== '1' && !location.hash ? 'intro' : 'idle';
    } else root.dataset.press = 'idle';
  } catch { root.dataset.press = 'idle'; }
  // If the main enhancement cannot load, the printed cover still gets out of the way.
  setTimeout(() => { if (root.dataset.press === 'intro' || root.dataset.press === 'closed') root.dataset.press = 'idle'; }, 3000);
})();
