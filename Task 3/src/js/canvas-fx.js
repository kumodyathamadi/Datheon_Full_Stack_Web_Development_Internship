/**
 * ATMOS — Atmospheric Particle & Canvas FX Engine
 * High-performance 60fps canvas renderer matching active meteorological conditions
 */

export class AtmosphericCanvas {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement ? canvasElement.getContext('2d') : null;
    this.animationId = null;
    this.particles = [];
    this.currentCondition = 'clear-night';
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.lastTime = performance.now();

    if (this.canvas && !this.reducedMotion) {
      this.init();
    }
  }

  init() {
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize, { passive: true });
    this.handleResize();
    this.setCondition(this.currentCondition);
    this.animate = this.animate.bind(this);
    this.animationId = requestAnimationFrame(this.animate);
  }

  handleResize() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
    }
    this.initParticles();
  }

  setCondition(condition) {
    this.currentCondition = condition;
    this.initParticles();
  }

  initParticles() {
    this.particles = [];
    if (this.reducedMotion || !this.width || !this.height) return;

    const countMap = {
      'rain': Math.min(50, Math.floor(this.width / 25)),
      'snow': Math.min(45, Math.floor(this.width / 28)),
      'clear-night': Math.min(65, Math.floor(this.width / 20)),
      'clear-day': Math.min(15, Math.floor(this.width / 80)),
      'clouds': Math.min(8, Math.floor(this.width / 150)),
      'thunderstorm': Math.min(60, Math.floor(this.width / 22)),
      'atmosphere': Math.min(25, Math.floor(this.width / 50))
    };

    const count = countMap[this.currentCondition] || 30;

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(true));
    }
  }

  createParticle(isInitial = false) {
    const x = Math.random() * this.width;
    const y = isInitial ? Math.random() * this.height : -20;

    switch (this.currentCondition) {
      case 'rain':
      case 'thunderstorm':
        return {
          x,
          y,
          len: 12 + Math.random() * 16,
          speed: 12 + Math.random() * 8,
          opacity: 0.15 + Math.random() * 0.35,
          width: 1.2 + Math.random() * 0.8
        };
      case 'snow':
        return {
          x,
          y,
          radius: 1.5 + Math.random() * 2.5,
          speed: 1 + Math.random() * 1.8,
          drift: (Math.random() - 0.5) * 0.8,
          opacity: 0.25 + Math.random() * 0.5,
          angle: Math.random() * Math.PI * 2
        };
      case 'clear-night':
        return {
          x,
          y: Math.random() * this.height,
          radius: 0.7 + Math.random() * 1.6,
          opacity: 0.15 + Math.random() * 0.65,
          twinkleSpeed: 0.01 + Math.random() * 0.03,
          twinkleDir: Math.random() > 0.5 ? 1 : -1
        };
      case 'clear-day':
        return {
          x: Math.random() * this.width,
          y: Math.random() * (this.height * 0.6),
          radius: 30 + Math.random() * 70,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          opacity: 0.03 + Math.random() * 0.05
        };
      case 'clouds':
        return {
          x: Math.random() * (this.width + 400) - 200,
          y: Math.random() * (this.height * 0.5),
          radiusX: 90 + Math.random() * 120,
          radiusY: 40 + Math.random() * 60,
          speed: 0.15 + Math.random() * 0.25,
          opacity: 0.04 + Math.random() * 0.07
        };
      default:
        return {
          x,
          y,
          radius: 1.5,
          speed: 0.5,
          opacity: 0.2
        };
    }
  }

  animate(now) {
    if (!this.ctx || this.reducedMotion) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      if (this.currentCondition === 'rain' || this.currentCondition === 'thunderstorm') {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.currentCondition === 'thunderstorm' 
          ? `rgba(192, 132, 252, ${p.opacity})` 
          : `rgba(56, 189, 248, ${p.opacity})`;
        this.ctx.lineWidth = p.width;
        this.ctx.lineCap = 'round';
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x - 3, p.y + p.len);
        this.ctx.stroke();

        p.y += p.speed;
        p.x -= 1.5;

        if (p.y > this.height) {
          this.particles[i] = this.createParticle(false);
        }
      } else if (this.currentCondition === 'snow') {
        p.angle += 0.02;
        p.x += Math.sin(p.angle) * 0.8 + p.drift;
        p.y += p.speed;

        this.ctx.beginPath();
        this.ctx.fillStyle = `rgba(224, 242, 254, ${p.opacity})`;
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();

        if (p.y > this.height || p.x < -20 || p.x > this.width + 20) {
          this.particles[i] = this.createParticle(false);
        }
      } else if (this.currentCondition === 'clear-night') {
        p.opacity += p.twinkleSpeed * p.twinkleDir;
        if (p.opacity > 0.8) {
          p.opacity = 0.8;
          p.twinkleDir = -1;
        } else if (p.opacity < 0.15) {
          p.opacity = 0.15;
          p.twinkleDir = 1;
        }

        this.ctx.beginPath();
        this.ctx.fillStyle = `rgba(224, 231, 255, ${p.opacity})`;
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (this.currentCondition === 'clear-day') {
        p.x += p.speedX;
        p.y += p.speedY;
        this.ctx.beginPath();
        const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(251, 191, 36, ${p.opacity})`);
        grad.addColorStop(1, 'rgba(251, 191, 36, 0)');
        this.ctx.fillStyle = grad;
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (this.currentCondition === 'clouds') {
        p.x += p.speed;
        if (p.x - p.radiusX > this.width) {
          p.x = -p.radiusX;
        }
        this.ctx.beginPath();
        this.ctx.fillStyle = `rgba(203, 213, 225, ${p.opacity})`;
        this.ctx.ellipse(p.x, p.y, p.radiusX, p.radiusY, 0, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    this.animationId = requestAnimationFrame(this.animate);
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    window.removeEventListener('resize', this.handleResize);
  }
}
