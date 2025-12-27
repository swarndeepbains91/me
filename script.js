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
    
    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
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
            display: flex;
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            background: rgba(10, 15, 30, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 20px;
            transform: translateY(-100%);
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .nav-menu.active {
            display: flex;
            transform: translateY(0);
            opacity: 1;
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
`;
document.head.appendChild(scriptStyle);