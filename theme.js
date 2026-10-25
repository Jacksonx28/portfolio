/* Apply saved preferences before the first paint. Storage may be disabled. */
(() => {
  const root = document.documentElement;
  try {
    const theme = localStorage.getItem('ij-theme');
    if (theme === 'light' || theme === 'dark') root.dataset.theme = theme;
    else if (matchMedia('(prefers-color-scheme: dark)').matches) root.dataset.theme = 'dark';
    root.dataset.motion = localStorage.getItem('ij-motion') === 'off' ? 'off' : 'on';
  } catch { root.dataset.motion = 'on'; }
})();
