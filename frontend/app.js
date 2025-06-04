function createAnimatedStars(numStars, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';


  const isMobile = window.innerWidth <= 600;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const stars = [];
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    const size = Math.random() * 1.4 + 0.5;

    
    let baseX, baseY;
    if (isMobile) {
      baseX = Math.random() * width * 0.9 + width * 0.05; 
      baseY = Math.random() * height * 0.9 + height * 0.05;
    } else {
      baseX = Math.random() * width;
      baseY = Math.random() * height;
    }

    
    const floatRadius = Math.random() * 16 + 6; 
    const floatSpeed = (Math.random() * 0.7 + 0.2) * (Math.random() < 0.5 ? 1 : -1);
    const angle = Math.random() * Math.PI * 2;
    star.style.position = 'absolute';
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.borderRadius = '50%';
    star.style.background = `rgba(255,255,255,${0.35 + Math.random()*0.25})`;
    star.style.boxShadow = `0 0 ${Math.random()*8+2}px ${Math.random()*1.1}px rgba(255,255,255,0.5)`;
    star.style.zIndex = 0;
    star.style.opacity = 0.65 + Math.random() * 0.3;
    container.appendChild(star);
    stars.push({
      el: star,
      baseX,
      baseY,
      floatRadius,
      floatSpeed,
      angle,
    });
  }

  function animateStars(time) {
    for (const s of stars) {
     
      const t = (time || 0) * 0.00025 * s.floatSpeed + s.angle;
      const x = s.baseX + Math.cos(t) * s.floatRadius;
      const y = s.baseY + Math.sin(t) * s.floatRadius;
      s.el.style.left = `${x}px`;
      s.el.style.top = `${y}px`;
    }
    requestAnimationFrame(animateStars);
  }
  animateStars();
}

function initStars() {
  createAnimatedStars(100, 'stars-bg');
}
window.addEventListener('DOMContentLoaded', initStars);
window.addEventListener('resize', () => setTimeout(initStars, 200));