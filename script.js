(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setupNavigation() {
    const header = $('.site-header'), menuButton = $('.menu-toggle'), links = $('.nav-links');
    const closeMenu = () => { links.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open navigation'); };
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); links.classList.toggle('open', open);
    });
    $$('.nav-links a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('click', event => { if (!links.contains(event.target) && !menuButton.contains(event.target)) closeMenu(); });
    const sections = $$('main section[id]');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { $$('.nav-links a').forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`)); }
    }), { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => observer.observe(section));
    const scroll = () => { header.classList.toggle('scrolled', scrollY > 25); $('.back-top').classList.toggle('show', scrollY > 650); };
    addEventListener('scroll', scroll, { passive: true }); scroll();
    $('.back-top').addEventListener('click', () => scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' }));
  }

  function setupTheme() {
    const button = $('.theme-toggle');
    const saved = localStorage.getItem('ganesan-theme');
    if (saved === 'light') document.body.classList.add('light');
    const update = () => { const light = document.body.classList.contains('light'); $('.theme-icon').textContent = light ? '☾' : '☼'; button.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme'); };
    button.addEventListener('click', () => { document.body.classList.toggle('light'); localStorage.setItem('ganesan-theme', document.body.classList.contains('light') ? 'light' : 'dark'); update(); }); update();
  }

  function setupProgress() {
    let queued = false;
    addEventListener('scroll', () => {
      if (queued) return; queued = true;
      requestAnimationFrame(() => { const max = document.documentElement.scrollHeight - innerHeight; $('.progress').style.width = `${max > 0 ? scrollY / max * 100 : 0}%`; queued = false; });
    }, { passive: true });
  }

  function setupReveal() {
    const reveal = $$('.reveal');
    if (reducedMotion) { reveal.forEach(item => item.classList.add('visible')); return; }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .14 });
    reveal.forEach(item => observer.observe(item));
    const statObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target, target = Number(el.dataset.count); let start;
      const frame = time => { start ??= time; const p = Math.min((time - start) / 950, 1); el.textContent = `${(target * (1 - Math.pow(1 - p, 3))).toFixed(Number.isInteger(target) ? 0 : 1)}${el.dataset.suffix || ''}`; if (p < 1) requestAnimationFrame(frame); };
      requestAnimationFrame(frame); statObserver.unobserve(el);
    }), { threshold: .7 });
    $$('[data-count]').forEach(el => statObserver.observe(el));
  }

  function setupTyping() {
    if (reducedMotion) return;
    const output = $('.typed-role'), roles = ['Java Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'UI/UX Enthusiast'];
    let role = 0, index = roles[0].length, deleting = true;
    const tick = () => {
      const current = roles[role]; index += deleting ? -1 : 1; output.textContent = current.slice(0, index);
      let delay = deleting ? 45 : 75;
      if (index <= 0) { deleting = false; role = (role + 1) % roles.length; delay = 250; }
      if (index >= roles[role].length) { deleting = true; delay = 1550; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 1700);
  }

  const skillData = {
    programming: [['Java', 90], ['Python', 68]],
    frontend: [['HTML', 88], ['CSS', 86], ['JavaScript', 84], ['React.js', 75]],
    backend: [['Spring Boot', 78], ['JDBC', 82]],
    database: [['MySQL', 82], ['SQL', 80], ['Database Design', 73], ['Queries', 78]],
    uiux: [['Figma', 82], ['Adobe XD', 72], ['Sketch', 65], ['Wireframing', 84], ['Prototyping', 78], ['Responsive Design', 86], ['Design Systems', 70]]
  };
  function renderSkills(category) {
    const panel = $('.skill-content'); panel.innerHTML = skillData[category].map(([name, value]) => `<div class="skill-item"><div class="skill-title"><span>${name}</span><span>${value}%</span></div><div class="skill-track"><div class="skill-fill" data-width="${value}%"></div></div></div>`).join('');
    requestAnimationFrame(() => $$('.skill-fill', panel).forEach(fill => { fill.style.width = fill.dataset.width; }));
  }
  function setupSkillTabs() {
    $$('.skill-tab').forEach(tab => tab.addEventListener('click', () => {
      $$('.skill-tab').forEach(item => { item.classList.toggle('active', item === tab); item.setAttribute('aria-selected', String(item === tab)); }); renderSkills(tab.dataset.category);
    })); renderSkills('programming');
  }

  const projects = {
    weather: { number: 'PROJECT 01', title: 'Weather Application', description: 'Built a web-based weather application using HTML, CSS, and JavaScript with real-time API integration to display current weather conditions for searched cities.', technologies: ['HTML', 'CSS', 'JavaScript', 'Weather API'], github: 'https://github.com/ganesanravi2005-creator/Weather-app' },
    library: { number: 'PROJECT 02', title: 'Library Management System', description: 'Developed a Java-based Library Management System using Java, JDBC, and MySQL to manage book records, track issue/return transactions, and maintain member details, with a full-stack interface built using HTML, CSS, and JavaScript for the frontend and Spring Boot for backend REST APIs.', technologies: ['Java', 'JDBC', 'MySQL', 'Spring Boot', 'HTML', 'CSS', 'JavaScript', 'REST API'], github: 'https://github.com/ganesanravi2005-creator/LibraryManagementSystem' }
  };
  function setupModal() {
    const backdrop = $('.modal-backdrop'), close = $('.modal-close'); let previousFocus;
    const dismiss = () => { backdrop.classList.remove('open'); backdrop.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; previousFocus?.focus(); };
    $$('.detail-trigger').forEach(trigger => trigger.addEventListener('click', () => {
      const project = projects[trigger.dataset.project]; previousFocus = trigger;
      $('#modal-number').textContent = project.number; $('#modal-title').textContent = project.title; $('#modal-description').textContent = project.description;
      $('#modal-tech').innerHTML = project.technologies.map(technology => `<span>${technology}</span>`).join(''); $('#modal-github').href = project.github;
      backdrop.classList.add('open'); backdrop.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; close.focus();
    }));
    close.addEventListener('click', dismiss); backdrop.addEventListener('click', event => { if (event.target === backdrop) dismiss(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && backdrop.classList.contains('open')) dismiss(); });
  }

  let toastTimer;
  function showToast(message) { const toast = $('.toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3600); }
  function setupContact() {
    const form = $('.contact-form');
    const submitButton = $('button[type="submit"]', form);
    const originalButtonHTML = submitButton.innerHTML;
    form.addEventListener('submit', async event => {
      // The browser handles required fields and email format before this event.
      event.preventDefault();
      if (submitButton.disabled) return;

      if (form.action.includes('YOUR_FORM_ID')) {
        showToast('Set your Formspree Form ID in index.html to enable submissions.');
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) throw new Error(`Formspree returned ${response.status}`);
        form.reset();
        showToast("Message sent successfully! I'll get back to you soon.");
      } catch (error) {
        showToast('Something went wrong. Please try again.');
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHTML;
      }
    });
  }

  function setupMagnetic() {
    if (reducedMotion || matchMedia('(pointer: coarse)').matches) return;
    $$('.magnetic').forEach(button => {
      button.addEventListener('mousemove', event => { const rect = button.getBoundingClientRect(); button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .08}px, ${(event.clientY - rect.top - rect.height / 2) * .12 - 2}px)`; });
      button.addEventListener('mouseleave', () => { button.style.transform = ''; });
    });
  }
  function setupCursor() {
    if (matchMedia('(pointer: coarse)').matches || innerWidth < 1100 || reducedMotion) return;
    document.body.classList.add('custom-cursor'); const dot = $('.cursor-dot'), ring = $('.cursor-ring'); let x = 0, y = 0, rx = 0, ry = 0;
    addEventListener('mousemove', event => { x = event.clientX; y = event.clientY; dot.style.left = `${x}px`; dot.style.top = `${y}px`; });
    const follow = () => { rx += (x - rx) * .18; ry += (y - ry) * .18; ring.style.left = `${rx}px`; ring.style.top = `${ry}px`; requestAnimationFrame(follow); }; follow();
    $$('a,button').forEach(el => { el.addEventListener('mouseenter', () => ring.classList.add('hover')); el.addEventListener('mouseleave', () => ring.classList.remove('hover')); });
  }
  function setupParallax() {
    if (matchMedia('(pointer: coarse)').matches || reducedMotion) return;
    const visual = $('[data-parallax]');
    visual.addEventListener('mousemove', event => { const rect = visual.getBoundingClientRect(); visual.style.setProperty('--px', `${(event.clientX - rect.left - rect.width / 2) * .018}px`); visual.style.setProperty('--py', `${(event.clientY - rect.top - rect.height / 2) * .018}px`); });
    visual.addEventListener('mouseleave', () => { visual.style.setProperty('--px', '0px'); visual.style.setProperty('--py', '0px'); });
  }
  setupNavigation(); setupTheme(); setupProgress(); setupReveal(); setupTyping(); setupSkillTabs(); setupModal(); setupContact(); setupMagnetic(); setupCursor(); setupParallax();
})();
