(() => {
  'use strict';
  const opening = document.getElementById('opening');
  const skip = document.getElementById('skip-opening');
  const replay = document.getElementById('replay-opening');
  const altitude = document.getElementById('opening-altitude');
  const progressBar = opening.querySelector('[role="progressbar"]');
  const fill = opening.querySelector('.opening-progress i');
  const ring = opening.querySelector('.ring-progress');
  const status = document.getElementById('opening-status');
  const stages = [...opening.querySelectorAll('[data-opening-stage]')];
  const photo = document.querySelector('.hero-image');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0, maximumTimer = 0, closeTimer = 0, revealTimer = 0, generation = 0, previousFocus;

  function setProgress(value) {
    const metres = Math.round(value * 100);
    altitude.textContent = metres.toLocaleString('en-IN');
    progressBar.setAttribute('aria-valuenow', String(metres));
    fill.style.transform = `scaleX(${value})`;
    ring.style.strokeDashoffset = String(282.743 * (1 - value));
    const stage = value < .32 ? 0 : value < .72 ? 1 : 2;
    stages.forEach((element, index) => element.classList.toggle('current', index === stage));
  }

  function finish(skipped = false) {
    if (!opening.open || opening.classList.contains('is-leaving')) return;
    generation += 1;
    cancelAnimationFrame(frame); clearTimeout(maximumTimer); clearTimeout(closeTimer);
    setProgress(1);
    status.textContent = 'Ready for your next big idea';
    opening.classList.add('is-leaving');
    document.body.classList.remove('opening-running');
    if (!reduced.matches && !document.body.classList.contains('motion-paused')) document.body.classList.add('opening-reveal');
    closeTimer = setTimeout(() => {
      opening.close();
      opening.classList.remove('is-leaving');
      if (previousFocus && previousFocus.isConnected && previousFocus !== document.body) previousFocus.focus({ preventScroll: true });
      else if (skipped) document.getElementById('hero-register').focus({ preventScroll: true });
    }, reduced.matches || document.body.classList.contains('motion-paused') ? 0 : 1050);
    clearTimeout(revealTimer);
    revealTimer = setTimeout(() => document.body.classList.remove('opening-reveal'), 2200);
  }

  function readyPhoto() {
    if (photo.complete) return Promise.resolve();
    return new Promise(resolve => {
      const done = () => { photo.removeEventListener('load', done); photo.removeEventListener('error', done); resolve(); };
      photo.addEventListener('load', done, { once: true }); photo.addEventListener('error', done, { once: true });
    });
  }

  function start(replaying = false) {
    cancelAnimationFrame(frame); clearTimeout(maximumTimer); clearTimeout(closeTimer); clearTimeout(revealTimer);
    generation += 1;
    const run = generation;
    previousFocus = document.activeElement;
    const lessMotion = reduced.matches || document.body.classList.contains('motion-paused');
    document.body.classList.remove('opening-reveal');
    opening.classList.remove('is-leaving');
    status.textContent = 'Initializing the hackathon';
    setProgress(0);
    if (!opening.open) opening.showModal();
    document.body.classList.add('opening-running');
    skip.focus({ preventScroll: true });
    if (replaying) window.scrollTo({ top: 0, behavior: 'instant' });
    let ready = false;
    const started = performance.now();
    const fontReady = document.fonts?.ready || Promise.resolve();
    Promise.all([readyPhoto(), Promise.race([fontReady, new Promise(resolve => setTimeout(resolve, 900))])]).then(() => { if (run === generation) ready = true; });
    // Hard timeout and skip guarantee image failures never trap the visitor.
    maximumTimer = setTimeout(() => finish(), 5500);
    const duration = lessMotion ? 250 : 2350;
    const animate = now => {
      if (run !== generation || !opening.open) return;
      const elapsed = now - started;
      const value = Math.min(ready ? 1 : .88, elapsed / duration);
      setProgress(lessMotion ? (ready ? 1 : 0) : 1 - Math.pow(1 - value, 1.45));
      if (value > .74) {
        const message = ready ? 'Assembling the possibilities' : 'Loading the event backdrop';
        if (status.textContent !== message) status.textContent = message;
      }
      if (ready && elapsed >= duration) { finish(); return; }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
  }

  skip.addEventListener('click', () => finish(true));
  opening.addEventListener('cancel', event => { event.preventDefault(); finish(true); });
  replay.addEventListener('click', () => start(true));
  window.addEventListener('pagehide', () => { generation += 1; cancelAnimationFrame(frame); clearTimeout(maximumTimer); clearTimeout(closeTimer); clearTimeout(revealTimer); document.body.classList.remove('opening-running'); if (opening.open) opening.close(); });
  if (typeof opening.showModal === 'function') start();
})();
