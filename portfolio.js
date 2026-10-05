// Connected portfolio interactions. Native buttons and details support keyboard use.
document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const motionButton = document.getElementById('motionToggle');
    const themeButton = document.getElementById('appearanceToggle');
    const soundButton = document.getElementById('soundToggle');
    const audio = document.getElementById('bgMusic');
    const readPreference = key => { try { return localStorage.getItem(key); } catch { return null; } };
    const savePreference = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
    let motionPreference = readPreference('portfolio-motion') || 'on';
    function updateMotion() {
        const off = motionPreference === 'off' || reducedMotion.matches;
        root.dataset.motion = off ? 'off' : 'on';
        document.dispatchEvent(new Event('portfolio-motion-change'));
        motionButton.textContent = off ? 'Motion: reduced' : 'Motion: on';
        motionButton.setAttribute('aria-pressed', String(off));
        document.querySelectorAll('video').forEach(video => {
            if (off) video.pause(); else video.play().catch(() => {});
        });
    }
    updateMotion();
    reducedMotion.addEventListener('change', updateMotion);
    motionButton.addEventListener('click', () => {
        motionPreference = root.dataset.motion === 'off' ? 'on' : 'off';
        savePreference('portfolio-motion', motionPreference);
        updateMotion();
    });
    function updateThemeLabel() {
        themeButton.textContent = `Theme: ${root.dataset.theme}`;
        document.getElementById('themeToggle').setAttribute('aria-label', `Switch to ${root.dataset.theme === 'dark' ? 'light' : 'dark'} theme`);
    }
    themeButton.addEventListener('click', () => {
        root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        savePreference('theme', root.dataset.theme);
    });
    new MutationObserver(updateThemeLabel).observe(root, {attributes: true, attributeFilter: ['data-theme']});
    updateThemeLabel();
    function syncAudio() {
        soundButton.textContent = audio.paused ? 'Sound: off' : 'Sound: on';
        soundButton.setAttribute('aria-pressed', String(!audio.paused));
    }
    audio.addEventListener('play', syncAudio);
    audio.addEventListener('pause', syncAudio);
    soundButton.addEventListener('click', async () => {
        const status = document.getElementById('soundStatus');
        status.textContent = '';
        if (!audio.paused) audio.pause();
        else {
            try { await audio.play(); } catch { status.textContent = 'Audio is unavailable. Please try again later.'; }
        }
        syncAudio();
    });
    const descriptions = {
        people: 'Shared ownership, mentoring, and cross-functional teams bring the strategy to life.',
        cloud: 'Cloud infrastructure and deployment automation connect applications to reliable delivery.',
        operations: 'Monitoring, service reviews, and incident response support critical systems every day.'
    };
    document.querySelectorAll('[data-node]').forEach(button => button.addEventListener('click', () => {
        document.querySelectorAll('[data-node]').forEach(node => node.setAttribute('aria-pressed', String(node === button)));
        document.getElementById('architectureDescription').textContent = descriptions[button.dataset.node];
    }));
    document.querySelectorAll('[data-career]').forEach(button => button.addEventListener('click', () => {
        document.querySelectorAll('[data-career]').forEach(stop => stop.setAttribute('aria-pressed', String(stop === button)));
        document.querySelectorAll('.career-panel').forEach(panel => { panel.hidden = panel.id !== button.dataset.career; });
    }));
    const connections = {
        build: 'Build → iOS applications, Firebase integrations, and AI-assisted development.',
        deploy: 'Deploy → Jenkins pipelines, OpenShift migrations, and infrastructure configuration.',
        observe: 'Observe → Application monitoring, troubleshooting, and critical incident response.',
        lead: 'Lead → Cross-functional teams, service reviews, and strategic protection initiatives.'
    };
    function selectFocus(focus) {
        document.querySelectorAll('[data-focus]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.focus === focus)));
        document.querySelectorAll('[data-skills]').forEach(card => card.classList.toggle('skill-connected', card.dataset.skills.split(' ').includes(focus)));
        document.getElementById('skillConnection').textContent = connections[focus];
    }
    document.querySelectorAll('[data-focus]').forEach(button => button.addEventListener('click', () => selectFocus(button.dataset.focus)));
    selectFocus('build');
    const menu = document.querySelector('.nav-menu');
    const menuToggle = document.querySelector('.nav-toggle');
    function syncMenu() { menuToggle.setAttribute('aria-expanded', String(menu.classList.contains('active'))); }
    new MutationObserver(syncMenu).observe(menu, {attributes: true, attributeFilter: ['class']});
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            if (menu.classList.contains('active')) { menu.classList.remove('active'); menuToggle.classList.remove('active'); menuToggle.focus(); }
            document.querySelectorAll('.atmosphere[open]').forEach(details => { details.open = false; details.querySelector('summary').focus(); });
        }
    });
    function updateProgress() {
        const distance = root.scrollHeight - innerHeight;
        document.getElementById('readingProgress').style.width = `${distance > 0 ? Math.min(100, scrollY / distance * 100) : 0}%`;
        document.querySelectorAll('.nav-menu a').forEach(link => {
            if (link.classList.contains('active')) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
        });
    }
    addEventListener('scroll', updateProgress, {passive: true});
    addEventListener('resize', updateProgress);
    updateProgress();
});
