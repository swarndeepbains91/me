// Futuristic Background Animation
class FuturisticBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        this.animationFrame = null;
        
        this.init();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        const container = document.getElementById('futuristic-bg');
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '1';
        
        this.resize();
        container.appendChild(this.canvas);
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    createParticles() {
        this.particles = [];
        const numParticles = Math.min(150, Math.floor((this.canvas.width * this.canvas.height) / 10000));
        
        for (let i = 0; i < numParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.8 + 0.2,
                color: this.getRandomColor(),
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.02
            });
        }
    }
    
    getRandomColor() {
        const colors = [
            '0, 255, 255',    // Cyan
            '0, 255, 136',    // Green
            '136, 0, 255',    // Purple
            '255, 0, 136',    // Pink
            '255, 136, 0',    // Orange
            '136, 255, 0'     // Lime
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Update pulse
            particle.pulse += particle.pulseSpeed;
            particle.opacity = 0.3 + Math.sin(particle.pulse) * 0.3;
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx += dx * force * 0.001;
                particle.vy += dy * force * 0.001;
                particle.opacity = Math.min(1, particle.opacity + force * 0.3);
            }
            
            // Limit velocity
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            
            // Glow effect
            this.ctx.shadowColor = `rgb(${particle.color})`;
            this.ctx.shadowBlur = 10;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${particle.color}, ${particle.opacity})`;
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    drawConnections() {
        const maxDistance = 120;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (maxDistance - distance) / maxDistance * 0.3;
                    
                    // Create gradient line
                    const gradient = this.ctx.createLinearGradient(
                        this.particles[i].x, this.particles[i].y,
                        this.particles[j].x, this.particles[j].y
                    );
                    gradient.addColorStop(0, `rgba(${this.particles[i].color}, ${opacity})`);
                    gradient.addColorStop(1, `rgba(${this.particles[j].color}, ${opacity})`);
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    drawGrid() {
        const gridSize = 50;
        const time = Date.now() * 0.001;
        
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            const opacity = 0.1 + Math.sin(time + x * 0.01) * 0.05;
            this.ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            const opacity = 0.1 + Math.sin(time + y * 0.01) * 0.05;
            this.ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    drawWaveforms() {
        const time = Date.now() * 0.003;
        const centerY = this.canvas.height / 2;
        const amplitude = 50;
        const frequency = 0.02;
        
        // Draw multiple waveforms
        const waveforms = [
            { color: '0, 255, 255', offset: 0, amp: 1 },
            { color: '255, 0, 136', offset: Math.PI / 3, amp: 0.7 },
            { color: '0, 255, 136', offset: Math.PI * 2 / 3, amp: 0.5 }
        ];
        
        waveforms.forEach(wave => {
            this.ctx.save();
            this.ctx.strokeStyle = `rgba(${wave.color}, 0.3)`;
            this.ctx.lineWidth = 2;
            this.ctx.shadowColor = `rgb(${wave.color})`;
            this.ctx.shadowBlur = 10;
            
            this.ctx.beginPath();
            for (let x = 0; x < this.canvas.width; x += 2) {
                const y = centerY + Math.sin(x * frequency + time + wave.offset) * amplitude * wave.amp;
                if (x === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.stroke();
            this.ctx.restore();
        });
    }
    
    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Create dark gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, 'rgba(10, 15, 30, 0.95)');
        gradient.addColorStop(0.5, 'rgba(15, 25, 45, 0.95)');
        gradient.addColorStop(1, 'rgba(20, 35, 60, 0.95)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw waveforms
        this.drawWaveforms();
        
        // Update and draw particles
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.canvas && this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
    }
}

// Additional particle systems
class FloatingParticles {
    constructor() {
        this.container = document.querySelector('.particles');
        this.particles = [];
        this.createParticles();
        this.animate();
    }
    
    createParticles() {
        const numParticles = 50;
        
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: radial-gradient(circle, rgba(0,255,255,0.8) 0%, transparent 70%);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${10 + Math.random() * 20}s linear infinite;
                animation-delay: ${Math.random() * 20}s;
            `;
            
            this.container.appendChild(particle);
            this.particles.push(particle);
        }
    }
    
    animate() {
        // Particles are animated via CSS
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FuturisticBackground();
    new FloatingParticles();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
    
    .particle {
        pointer-events: none;
    }
`;
document.head.appendChild(style);