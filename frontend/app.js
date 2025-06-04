
function createAnimatedStars(numStars, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  const width = window.innerWidth;
  const height = window.innerHeight;
  const stars = [];
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    const size = Math.random() * 1.4 + 0.5;
    const baseX = Math.random() * width;
    const baseY = Math.random() * height;
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


function showStep(stepNumber) {
  document.querySelectorAll('.step').forEach((el, idx) => {
    el.classList.toggle('active', idx === stepNumber - 1);
  });
  const socialFooter = document.getElementById('social');
  if (socialFooter) {
    if (stepNumber === 1) {
      socialFooter.style.display = 'flex';
    } else {
      socialFooter.style.display = 'none';
    }
  }
}


document.addEventListener('DOMContentLoaded', function() {
  showStep(1);

  document.getElementById('escolherBtn').onclick = function(e) {
    e.preventDefault();
    showStep(2);
  };

  document.querySelectorAll('.choiceBtn').forEach(btn => {
    btn.addEventListener('click', function() {
      showStep(3);
    });
  });

  document.querySelectorAll('.genreBtn').forEach(btn => {
    btn.addEventListener('click', function() {
      // Aqui você pode adicionar a lógica para a escolha do gênero
      // alert('Você escolheu o gênero: ' + btn.textContent); //
      // showStep(4); // Se houver uma etapa 4
    });
  });
});

