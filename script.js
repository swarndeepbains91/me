// Portfolio Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Dark Mode Toggle - Simplified and Fixed
    console.log('Script loaded');
    
    function initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;
        
        console.log('Looking for theme toggle...');
        console.log('Theme toggle element:', themeToggle);
        
        if (!themeToggle) {
            console.error('Theme toggle button not found!');
            return;
        }
        
        console.log('Theme toggle found successfully');
        
        // Set dark mode as default
        const savedTheme = localStorage.getItem('theme') || 'dark';
        console.log('Setting theme to:', savedTheme);
        html.setAttribute('data-theme', savedTheme);
        
        // Add click event listener
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Toggle clicked!');
            
            const currentTheme = html.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            console.log(`Switching from ${currentTheme} to ${newTheme}`);
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            console.log('Theme switched successfully');
        });
        
        console.log('Theme toggle initialized successfully');
    }
    
    // Initialize theme toggle
    initThemeToggle();
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation on scroll
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-menu a');
    
    function updateActiveNav() {
        const scrollY = window.pageYOffset + 120;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    
    // Header scroll effect
    const header = document.querySelector('.header');
    
    function handleScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Mobile menu toggle - Fixed
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    console.log('Mobile nav elements:', { navToggle, navMenu });
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Mobile menu toggle clicked');
            
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            console.log('Menu active:', navMenu.classList.contains('active'));
            console.log('Toggle active:', this.classList.contains('active'));
        });
    } else {
        console.error('Mobile navigation elements not found:', { navToggle, navMenu });
    }
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (navToggle) {
                navToggle.classList.remove('active');
            }
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.innovation-card, .project-featured, .lab-item, .contact-method, .stat');
    animateElements.forEach(el => observer.observe(el));
    
    // CTA Button interactions
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.textContent.includes('Experience') || this.textContent.includes('Projects')) {
                document.querySelector('#experience').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else if (this.textContent.includes('Skills') || this.textContent.includes('Technical')) {
                document.querySelector('#skills').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Tech card hover effects
    const innovationCards = document.querySelectorAll('.innovation-card');
    innovationCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Progress bar animations
    const progressBars = document.querySelectorAll('.progress');
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target;
                const width = progress.style.width;
                progress.style.width = '0%';
                
                setTimeout(() => {
                    progress.style.width = width;
                }, 200);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => progressObserver.observe(bar));
    
    // Typing effect for hero title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Add glitch effect to title on hover
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.addEventListener('mouseenter', function() {
            this.style.animation = 'glitch 0.3s ease-in-out';
        });
        
        heroTitle.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    }
    
    // Particle interaction on mouse move
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create trailing particles
        if (Math.random() > 0.95) {
            createTrailParticle(mouseX, mouseY);
        }
    });
    
    function createTrailParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, rgba(0,255,255,0.8) 0%, transparent 70%);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 9999;
            animation: trailFade 1s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
    
    // Stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const finalValue = stat.textContent;
                
                if (finalValue === '∞') return;
                
                const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
                if (isNaN(numericValue)) return;
                
                let current = 0;
                const increment = numericValue / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= numericValue) {
                        stat.textContent = finalValue;
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current) + (finalValue.includes('+') ? '+' : '');
                    }
                }, 40);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => statsObserver.observe(stat));

    // Promotion chart initialization
    function initPromotionChart() {
        const canvas = document.getElementById('promotionChart');
        if (!canvas || typeof Chart === 'undefined') return;

        // Years from earliest role through current
        const labels = ['2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025'];

        // Numeric career level per year (higher = more senior)
        // 1: Jr. iOS Developer / Associate
        // 2: Technical Analyst / Co-op
        // 3: Senior Technical Analyst
        // 4: Team Lead
        // 5: Tech Lead
        // 6: Senior Manager
        const data = [1,1,1,1,2,2,4,4,5,5,5,6];

        // Human-readable mapping for levels
        const levelLabels = {
            1: 'Jr / Associate',
            2: 'Technical Analyst',
            3: 'Senior Technical Analyst',
            4: 'Team Lead',
            5: 'Tech Lead',
            6: 'Senior Manager'
        };

        // Job title (or transition notes) per year for tooltip clarity
        const jobTitles = [
            'Jr. iOS Developer (IAPP) — May 2014 - Nov 2015',         // 2014
            'Jr. iOS Developer (IAPP) — May 2014 - Nov 2015',         // 2015
            'iOS Developer / Technical Analyst Co-op — 2016', // 2016 (Hotspot Life + CIBC co-op overlap)
            'iOS Developer (Hotspot Life) — 2017',             // 2017
            'Technical Analyst (CIBC) — 2018',         // 2018
            'Technical Analyst (CIBC) — 2019 (promoted Nov 2019)', // 2019
            'Senior Technical Analyst / Transition to Team Lead — 2020', // 2020
            'Team Lead — 2021',                 // 2021
            'Team Lead → Tech Lead (Sept 2022)', // 2022
            'Tech Lead — 2023',                 // 2023
            'Tech Lead — 2024',                 // 2024
            'Senior Manager (Apr 2025 - Present)' // 2025
        ];

        const promotionChart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Career Level',
                    data: data,
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-blue').trim() || '#0A84FF',
                    backgroundColor: 'rgba(10,132,255,0.08)',
                    tension: 0.25,
                    fill: true,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            plugins: [
                {
                    id: 'highlightPoint',
                    afterDatasetsDraw: function(chart) {
                        const idx = window.promotionHighlightIndex;
                        if (typeof idx === 'undefined' || idx === null) return;
                        const meta = chart.getDatasetMeta(0);
                        const point = meta.data[idx];
                        if (!point) return;
                        const ctx = chart.ctx;
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(point.x, point.y, 14, 0, Math.PI * 2);
                        ctx.fillStyle = 'rgba(10,132,255,0.15)';
                        ctx.fill();
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-blue').trim() || '#0A84FF';
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            ],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMin: 0,
                        suggestedMax: 6,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                return levelLabels[value] || value;
                            }
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                const idx = context.dataIndex;
                                const val = context.parsed.y;
                                const levelName = levelLabels[val] || ('Level ' + val);
                                const job = jobTitles[idx] || '';
                                return `${levelName} (${val}) — ${job}`;
                            }
                        }
                    }
                }
            }
        });

        // Build interactive legend under chart
        const legendContainer = document.getElementById('promotionLegend');
        if (legendContainer) {
            legendContainer.innerHTML = '';
            labels.forEach((year, i) => {
                const item = document.createElement('div');
                item.className = 'legend-item';
                const short = jobTitles[i] ? (jobTitles[i].length > 40 ? jobTitles[i].slice(0, 37) + '...' : jobTitles[i]) : '';
                item.innerHTML = `<span class="legend-year">${year}</span><span class="legend-job">${short}</span>`;
                item.style.cssText = 'padding:6px 10px;border-radius:8px;background:var(--card-bg);cursor:pointer;font-size:13px;display:flex;gap:8px;align-items:center;';
                item.addEventListener('mouseenter', () => {
                    window.promotionHighlightIndex = i;
                    promotionChart.draw();
                });
                item.addEventListener('mouseleave', () => {
                    window.promotionHighlightIndex = null;
                    promotionChart.draw();
                });
                item.addEventListener('click', () => {
                    // Show tooltip on click
                    promotionChart.setActiveElements([{datasetIndex:0, index:i}]);
                    promotionChart.tooltip.setActiveElements([{datasetIndex:0, index:i}], {x:0,y:0});
                    promotionChart.update();
                });
                legendContainer.appendChild(item);
            });
        }
    }

    initPromotionChart();
});

// Add dynamic CSS animations
const scriptStyle = document.createElement('style');
scriptStyle.textContent = `
    .header.scrolled {
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
    }
    
    .nav-menu a.active {
        color: var(--primary-blue);
    }
    
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes slideDown {
        0% {
            opacity: 0;
            transform: translateY(-20px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .innovation-card,
    .project-featured,
    .lab-item,
    .contact-method,
    .stat {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
    }
    
    @keyframes trailFade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0) translateY(-20px);
        }
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
            position: fixed;
            top: 72px;
            left: 16px;
            right: 16px;
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border-light);
            border-radius: 16px;
            flex-direction: column;
            padding: 16px;
            z-index: 999;
            box-shadow: 0 16px 48px var(--shadow-light);
        }
        
        .nav-menu.active {
            display: flex;
            animation: slideDown 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        
        .nav-menu li {
            margin-bottom: 8px;
        }
        
        .nav-menu li:last-child {
            margin-bottom: 0;
        }
        
        .nav-menu a {
            display: block;
            padding: 16px 20px;
            background: var(--light-bg);
            color: var(--dark-text);
            border: 1px solid var(--border-light);
            border-radius: 12px;
            font-weight: 500;
            text-align: center;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            text-decoration: none;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .nav-menu a:hover, .nav-menu a:active {
            background: var(--primary-blue);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
            border-color: var(--primary-blue);
        }
        
        .nav-menu a::after {
            display: none;
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }

    /* Promotion legend styles */
    .promotion-legend {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        margin-top: 8px;
    }

    .promotion-legend .legend-item {
        background: var(--card-bg);
        padding: 6px 10px;
        border-radius: 8px;
        display: flex;
        gap: 8px;
        align-items: center;
        cursor: pointer;
        border: 1px solid transparent;
    }

    .promotion-legend .legend-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(10,132,255,0.12);
        border-color: rgba(10,132,255,0.18);
    }

    .promotion-legend .legend-job {
        max-width: 220px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 13px;
        color: var(--dark-text);
    }
`;
document.head.appendChild(scriptStyle);