/* Small, dependency-free enhancements for The Lagos Correspondent. */
(() => {
  'use strict';
  const root = document.documentElement;
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const storage = {
    get(key, fallback) { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, value); return true; } catch { return false; } }
  };
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const motionEnabled = () => root.dataset.motion !== 'off' && !reducedMotion.matches;
  const announce = (message) => {
    const status = $('#edition-status');
    if (!status) return;
    status.hidden = false;
    status.textContent = message;
    clearTimeout(announce.timer);
    announce.timer = setTimeout(() => { status.hidden = true; }, 4200);
  };
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  // Preferences: sound always begins off; motion also respects the operating system.
  let soundEnabled = false;
  let audioContext;
  const soundButton = $('[data-toggle-sound]');
  const motionButton = $('[data-toggle-motion]');
  const themeButton = $('.theme-toggle');
  const syncMotion = () => {
    const enabled = motionEnabled();
    root.classList.toggle('js-motion', enabled && 'IntersectionObserver' in window);
    if (motionButton) {
      motionButton.textContent = `Motion: ${enabled ? 'on' : 'off'}`;
      motionButton.setAttribute('aria-pressed', String(enabled));
    }
    if (!enabled) $$('.reveal').forEach(element => element.classList.add('revealed'));
  };
  syncMotion();
  reducedMotion.addEventListener('change', syncMotion);
  motionButton?.addEventListener('click', () => {
    if (reducedMotion.matches) { announce('Reduced motion follows your device setting.'); return; }
    root.dataset.motion = motionEnabled() ? 'off' : 'on';
    storage.set('ij-motion', root.dataset.motion);
    syncMotion();
  });
  const syncTheme = () => themeButton?.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
  syncTheme();
  themeButton?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    storage.set('ij-theme', root.dataset.theme);
    syncTheme();
  });
  soundButton?.addEventListener('click', async () => {
    if (soundEnabled) {
      soundEnabled = false;
    } else {
      try {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) throw new Error('Audio unavailable');
        audioContext ||= new Audio();
        await audioContext.resume();
        soundEnabled = true;
      } catch { announce('Press sounds are unavailable in this browser.'); }
    }
    soundButton.textContent = `Sound: ${soundEnabled ? 'on' : 'off'}`;
    soundButton.setAttribute('aria-pressed', String(soundEnabled));
  });
  const pressSound = () => {
    if (!soundEnabled || !audioContext || audioContext.state !== 'running') return;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(45, audioContext.currentTime + .045);
    gain.gain.setValueAtTime(.035, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + .06);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + .065);
  };

  // Print the masthead, reveal columns, and stamp section labels as they enter view.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }), { threshold: .06 });
    $$('.reveal').forEach(element => observer.observe(element));
  } else $$('.reveal').forEach(element => element.classList.add('revealed'));

  // A reading rule and a clock at the Lagos bureau.
  const progress = $('.reading-progress');
  const backToTop = $('.back-to-top');
  let scrollFrame = false;
  const updateProgress = () => {
    const distance = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    if (progress) progress.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollY / distance))})`;
    if (backToTop) backToTop.hidden = scrollY < 650;
    scrollFrame = false;
  };
  addEventListener('scroll', () => {
    if (!scrollFrame) { scrollFrame = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  addEventListener('resize', updateProgress, { passive: true });
  addEventListener('load', updateProgress);
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: motionEnabled() ? 'smooth' : 'instant' });
    $('.paper-title a')?.focus({ preventScroll: true });
  });
  const updateClock = () => {
    const clock = $('.edition-clock');
    if (clock) {
      const now = new Date();
      clock.textContent = `${new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit' }).format(now)} WAT`;
      clock.dateTime = now.toISOString();
    }
  };
  updateClock();
  setInterval(updateClock, 30000);
  updateProgress();

  // Keep the breaking strip readable and let visitors stop its rotation.
  const ticker = $('#breakingTicker');
  if (ticker) {
    const roles = ['Open for frontend, writing & product work.', 'Built in Lagos. Made for the web.', 'A good idea deserves a good build.', 'Explore the work. Stay for the Sunday supplement.'];
    const tickerButton = $('[data-toggle-ticker]');
    let role = 0;
    let paused = !motionEnabled();
    let hovered = false;
    let changeTimer;
    const syncTicker = () => {
      if (tickerButton) {
        tickerButton.textContent = paused ? 'Resume' : 'Pause';
        tickerButton.setAttribute('aria-pressed', String(paused));
        tickerButton.setAttribute('aria-label', `${paused ? 'Resume' : 'Pause'} availability headlines`);
      }
    };
    tickerButton?.addEventListener('click', () => { paused = !paused; syncTicker(); });
    ticker.closest('.breaking-strip').addEventListener('mouseenter', () => { hovered = true; });
    ticker.closest('.breaking-strip').addEventListener('mouseleave', () => { hovered = false; });
    ticker.textContent = roles[0];
    syncTicker();
    setInterval(() => {
      if (paused || hovered || !motionEnabled() || document.hidden) return;
      ticker.classList.add('ticker-out');
      clearTimeout(changeTimer);
      changeTimer = setTimeout(() => {
        role = (role + 1) % roles.length;
        ticker.textContent = roles[role];
        ticker.classList.remove('ticker-out');
        ticker.classList.add('ticker-in');
      }, 380);
    }, 5500);
  }

  // Dialogs use the browser's focus trap, Escape key, and focus restoration.
  const openDialog = (dialog) => {
    if (!dialog || dialog.open || typeof dialog.showModal !== 'function') return;
    dialog.showModal();
  };
  $$('dialog').forEach(dialog => {
    $('[data-close-dialog]', dialog)?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
  });

  // Search the actual published projects, articles, and pages, with no remote service.
  let indexEntries = [];
  try { indexEntries = JSON.parse($('#edition-index-data')?.textContent || '[]'); } catch { /* Normal navigation remains available. */ }
  const indexDialog = $('#edition-index');
  const searchInput = $('#edition-search');
  const searchResults = $('#index-results');
  const renderIndex = () => {
    if (!searchResults) return;
    const query = (searchInput?.value || '').trim().toLowerCase();
    const words = query.split(/\s+/).filter(Boolean);
    const matches = indexEntries.filter(entry => words.every(word => `${entry.title} ${entry.description} ${entry.type}`.toLowerCase().includes(word)));
    searchResults.replaceChildren();
    matches.slice(0, 20).forEach(entry => {
      const row = make('li');
      const link = make('a');
      link.href = entry.url;
      if (/^https?:/.test(entry.url)) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      link.append(make('span', 'index-result-meta', entry.type), make('span', 'index-result-title', entry.title), make('span', 'index-result-desc', entry.description));
      row.append(link);
      searchResults.append(row);
    });
    if (!matches.length) searchResults.append(make('li', 'empty-state', 'No matching stories. Try “Web3”, “restaurant”, or “Bitcoin”.'));
    $('#index-count').textContent = `${matches.length} ${matches.length === 1 ? 'result' : 'results'}`;
  };
  const showIndex = () => { renderIndex(); openDialog(indexDialog); searchInput?.focus(); };
  $('[data-open-index]')?.addEventListener('click', showIndex);
  searchInput?.addEventListener('input', renderIndex);
  indexDialog?.addEventListener('click', event => { if (event.target.closest('a')) indexDialog.close(); });
  document.addEventListener('keydown', event => {
    const editing = event.target.closest('input, textarea, select, [contenteditable]');
    if (((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') || (event.key === '/' && !editing && !event.metaKey && !event.ctrlKey && !event.altKey)) {
      event.preventDefault(); showIndex();
    }
  });

  // Small ink feedback; press-transition.js owns the full newspaper reveal.
  document.addEventListener('click', event => {
    const control = event.target.closest('a, button');
    if (control) pressSound();


  });

  // Project desk: filter the existing cards and read a project sheet before leaving.
  const cards = $$('.site-card');
  const projectFilter = $('#project-filters');
  const projectDialog = $('#project-sheet');
  projectFilter?.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    $$('button', projectFilter).forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    cards.forEach(card => {
      card.hidden = button.dataset.filter !== 'all' && !(card.dataset.category || '').split(' ').includes(button.dataset.filter);
      if (!card.hidden) { count++; card.classList.remove('in-view'); if (motionEnabled()) requestAnimationFrame(() => card.classList.add('in-view')); }
    });
    $('#project-count').textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
    updateProgress();
  });
  cards.forEach(card => {
    const name = $('.card-title', card).textContent;
    const preview = $('.card-preview', card);
    const frame = $('iframe', card);
    if (frame?.dataset.src) {
      const loadButton = make('button', 'edition-action load-preview', 'Load preview ↗');
      loadButton.setAttribute('aria-label', `Load preview of ${name}`);
      preview.append(loadButton);
      loadButton.addEventListener('click', () => {
        frame.addEventListener('load', () => {
          frame.classList.add('loaded');
          $('.project-shot', card)?.setAttribute('hidden', '');
        }, { once: true });
        frame.src = frame.dataset.src;
        loadButton.remove();
        const note = $('.preview-poster-note', preview);
        if (note) note.textContent = 'External preview · use Visit Site if unavailable';
      }, { once: true });
    }
    $('[data-project-sheet]', card)?.addEventListener('click', () => {
      $('#project-sheet-title').textContent = name;
      $('#project-sheet-description').textContent = card.dataset.description || $('.card-desc', card).textContent;
      $('#project-sheet-role').textContent = $('.card-role', card).textContent;
      $('#project-sheet-category').textContent = card.dataset.category.split(' ').join(' · ');
      const liveLink = $('.card-link[href]', card);
      const visit = $('#project-sheet-visit');
      visit.hidden = !liveLink;
      if (liveLink) visit.href = liveLink.href;
      $('#project-sheet-preview-note').hidden = Boolean(liveLink);
      openDialog(projectDialog);
    });
  });

  // Reading list is deliberately local to this browser, with honest empty states.
  const articles = $$('.article-wrap');
  let saved;
  try { saved = new Set(JSON.parse(storage.get('ij-reading-list', '[]')).filter(item => typeof item === 'string')); } catch { saved = new Set(); }
  let writingFilter = 'all';
  const writingFilters = $('#writing-filters');
  const updateArticles = () => {
    let count = 0;
    articles.forEach(wrapper => {
      const isSaved = saved.has(wrapper.dataset.article);
      const button = $('.bookmark-button', wrapper);
      button.setAttribute('aria-pressed', String(isSaved));
      button.textContent = isSaved ? '✓ Saved to reading list' : '+ Save for later';
      const title = $('h3', wrapper).textContent;
      button.setAttribute('aria-label', isSaved ? `Remove ${title} from reading list` : `Save ${title} for later`);
      wrapper.hidden = writingFilter === 'saved' ? !isSaved : writingFilter !== 'all' && wrapper.dataset.source !== writingFilter;
      if (!wrapper.hidden) count++;
    });
    if ($('#writing-count')) $('#writing-count').textContent = `${count} ${count === 1 ? 'story' : 'stories'}`;
    if ($('#reading-empty')) $('#reading-empty').hidden = count > 0;
    const savedLabel = $('[data-filter="saved"]', writingFilters || document);
    if (savedLabel) savedLabel.textContent = `Reading list (${articles.filter(article => saved.has(article.dataset.article)).length})`;
    updateProgress();
  };
  articles.forEach(wrapper => $('.bookmark-button', wrapper).addEventListener('click', () => {
    const id = wrapper.dataset.article;
    saved.has(id) ? saved.delete(id) : saved.add(id);
    const persisted = storage.set('ij-reading-list', JSON.stringify([...saved]));
    const button = $('.bookmark-button', wrapper);
    const willHide = writingFilter === 'saved' && !saved.has(id);
    updateArticles();
    if (willHide && document.activeElement === button) $('[data-filter="saved"]', writingFilters)?.focus();
    announce(persisted ? (saved.has(id) ? 'Saved for later on this browser.' : 'Removed from your reading list.') : 'Updated for this visit. Browser storage is unavailable.');
  }));
  writingFilters?.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    writingFilter = button.dataset.filter;
    $$('button', writingFilters).forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    updateArticles();
  });
  if (articles.length) updateArticles();

  // Let a visitor typeset a fictional front page, then take an actual PNG home.
  const pressForm = $('#press-form');
  if (pressForm) {
    const headline = $('#press-headline');
    const byline = $('#press-byline');
    const proof = $('#press-proof');
    const defaultHeadline = 'Good things are being built in Lagos.';
    const currentHeadline = () => headline.value.trim() || defaultHeadline;
    const currentByline = () => byline.value.trim() || 'Filed by a curious reader';
    const updateProof = () => {
      $('#proof-headline').textContent = currentHeadline();
      $('#proof-byline').textContent = currentByline();
      proof.setAttribute('aria-label', `Your front page: ${currentHeadline()} ${currentByline()}`);
    };
    pressForm.addEventListener('input', updateProof);
    const suggestions = ['Lagos called. The future answered.', 'One good idea. A whole new chapter.', 'Built with curiosity. Printed in Lagos.', defaultHeadline];
    let suggestion = 0;
    $('#shuffle-headline').addEventListener('click', () => { headline.value = suggestions[suggestion++ % suggestions.length]; updateProof(); });
    pressForm.addEventListener('submit', async event => {
      event.preventDefault();
      updateProof();
      const downloadButton = $('#print-headline');
      downloadButton.disabled = true;
      proof.classList.remove('pressed');
      requestAnimationFrame(() => proof.classList.add('pressed'));
      try {
        // Never wait indefinitely on a font service before creating a keepsake.
        await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 1500))]);
        const canvas = document.createElement('canvas');
        canvas.width = 1080; canvas.height = 1350;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas unavailable');
        context.fillStyle = '#f5ecd4'; context.fillRect(0, 0, 1080, 1350);
        context.fillStyle = '#1a1208'; context.strokeStyle = '#3a2a10';
        context.strokeRect(45, 45, 990, 1260);
        context.textAlign = 'center';
        context.font = '21px "Special Elite", monospace';
        context.fillText('THE READER’S EDITION  ·  A LITTLE INTERNET KEEPSAKE', 540, 105);
        context.font = '76px "UnifrakturMaguntia", Georgia, serif';
        context.fillText('The Lagos Correspondent', 540, 210, 900);
        const rule = (y, width = 2) => { context.lineWidth = width; context.beginPath(); context.moveTo(85, y); context.lineTo(995, y); context.stroke(); };
        rule(245, 3); rule(252, 1);
        context.font = '20px "Special Elite", monospace';
        const date = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Lagos', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
        context.fillText(`${date.toUpperCase()}   ·   LAGOS, NIGERIA   ·   ONE OF ONE`, 540, 293);
        rule(320);
        context.fillStyle = '#8b1a1a'; context.font = '22px "Special Elite", monospace';
        context.fillText('EXTRA! EXTRA! YOUR STORY, IN PRINT.', 540, 385);
        const wrap = (text, maxWidth) => {
          const lines = []; let line = '';
          for (const word of text.split(/\s+/)) {
            const candidate = line ? `${line} ${word}` : word;
            if (context.measureText(candidate).width > maxWidth && line) { lines.push(line); line = ''; }
            // Break a single long word rather than clipping it at the paper edge.
            for (const character of (line ? ` ${word}` : word)) {
              if (context.measureText(line + character).width > maxWidth && line) { lines.push(line); line = ''; }
              line += character;
            }
          }
          if (line) lines.push(line);
          return lines;
        };
        let size = 88; let lines;
        do { context.font = `900 ${size}px "Playfair Display", Georgia, serif`; lines = wrap(currentHeadline(), 840); if (lines.length <= 4) break; size -= 4; } while (size > 36);
        context.fillStyle = '#1a1208';
        lines.forEach((line, index) => context.fillText(line, 540, 480 + index * size * 1.16));
        const afterHeadline = 480 + lines.length * size * 1.16 + 25;
        context.font = 'italic 28px "Lora", Georgia, serif';
        context.fillText(currentByline(), 540, afterHeadline, 840);
        rule(afterHeadline + 40);
        context.strokeStyle = '#b09060'; context.lineWidth = 2;
        for (let column = 0; column < 3; column++) for (let row = 0; row < 7; row++) {
          const x = 90 + column * 310;
          context.beginPath(); context.moveTo(x, afterHeadline + 85 + row * 20); context.lineTo(x + (row === 6 ? 180 : 270), afterHeadline + 85 + row * 20); context.stroke();
        }
        context.save(); context.translate(540, 1160); context.rotate(-.08);
        context.strokeStyle = '#8b1a1a'; context.fillStyle = '#8b1a1a'; context.lineWidth = 3;
        context.strokeRect(-185, -38, 370, 66); context.font = '28px "Special Elite", monospace';
        context.fillText('HOT OFF THE PRESS', 0, 5); context.restore();
        context.fillStyle = '#6b4c2a'; context.font = '18px "Special Elite", monospace';
        context.fillText('A FICTIONAL FRONT PAGE · MADE IN JACKSON’S PRINTING ROOM', 540, 1250, 880);
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        if (!blob) throw new Error('Export unavailable');
        const url = URL.createObjectURL(blob);
        const link = make('a'); link.href = url; link.download = 'the-lagos-correspondent-your-edition.png';
        document.body.append(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        announce('Fresh off the press. Your PNG is ready.');
      } catch { announce('Could not create the PNG. Please try again.'); }
      finally { downloadButton.disabled = false; }
    });
  }

  // Historical notes are labelled summaries, with the original archive credited.
  const archive = $('#lagos-archive');
  archive?.addEventListener('click', event => {
    const button = event.target.closest('button[data-year]');
    if (!button) return;
    $$('[data-year]', archive).forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    $$('[data-archive-panel]', archive).forEach(panel => {
      panel.hidden = panel.dataset.archivePanel !== button.dataset.year;
      panel.classList.remove('is-changing');
      if (!panel.hidden && motionEnabled()) requestAnimationFrame(() => panel.classList.add('is-changing'));
    });
    updateProgress();
  });

  // Compose a real enquiry locally; the visitor chooses when to open their email app.
  const telegramForm = $('#telegram-form');
  if (telegramForm) {
    const preview = $('#telegram-preview');
    const buildEnquiry = () => {
      const name = $('#enquiry-name').value.trim();
      const kind = $('#enquiry-kind').value;
      const idea = $('#enquiry-idea').value.trim();
      return `Hi Israel,\n\nI'm ${name || '[your name]'}. I found your portfolio and would like to discuss ${kind.toLowerCase()}.\n\n${idea || '[A few words about the project]'}\n\nBest,\n${name || '[your name]'}`;
    };
    telegramForm.addEventListener('submit', event => {
      event.preventDefault();
      const message = buildEnquiry();
      preview.textContent = message;
      preview.hidden = false;
      $('#enquiry-actions').hidden = false;
      $('#open-enquiry').href = `mailto:israeljackson854@gmail.com?subject=${encodeURIComponent(`Portfolio enquiry: ${$('#enquiry-kind').value}`)}&body=${encodeURIComponent(message)}`;
      $('#telegram-form').dataset.composed = 'true';
      announce('Your draft is ready below. Open it in your email app or copy it.');
    });
    telegramForm.addEventListener('input', () => {
      if (telegramForm.dataset.composed === 'true') {
        preview.hidden = true;
        $('#enquiry-actions').hidden = true;
        telegramForm.dataset.composed = 'false';
      }
    });
    $('#copy-enquiry').addEventListener('click', () => copyText(preview.textContent));
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); announce('Copied to clipboard.'); }
    catch { announce('Clipboard unavailable. Select and copy the text directly.'); }
  }
  $('[data-copy-email]')?.addEventListener('click', () => copyText('israeljackson854@gmail.com'));
  $$('[data-enhancement]').forEach(element => { element.hidden = false; });
  updateProgress();
})();
