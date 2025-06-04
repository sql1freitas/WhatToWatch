
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
  const loader = document.getElementById('loader');
  loader.style.display = 'flex';

  document.querySelectorAll('.step').forEach((el, idx) => {
    el.classList.remove('active');
  });
  setTimeout(() => {
    document.querySelectorAll('.step').forEach((el, idx) => {
      el.classList.toggle('active', idx === stepNumber - 1);
    });
    loader.style.display = 'none';
  } , 700);

  const socialFooter = document.getElementById('social-footer');
  if (socialFooter) {
    if (stepNumber === 1) {
      socialFooter.style.display = 'flex';
    } else {
      socialFooter.style.display = 'none';
    }
  }
}


let perfilSelecionado = '';
let generoSelecionado = '';
let filmesJaSorteados = [];


async function sortearFilme() {
  document.getElementById('loader').style.display = 'flex';
  try {
    const anteriores = filmesJaSorteados.join(',');
    const url = `/api/sortear?perfil=${perfilSelecionado}&genero=${generoSelecionado}&anteriores=${anteriores}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Nenhum filme encontrado.');
    const filme = await resp.json();


    filmesJaSorteados.push(filme.id);


    document.querySelector('.movie-title').innerText = filme.title || '[Título do Filme]';
    document.querySelector('.movie-poster').src = filme.poster_path || 'https://via.placeholder.com/320x460?text=Poster+do+Filme';
    document.querySelector('.movie-poster').alt = filme.title || 'Poster do filme';


    if (document.querySelector('.movie-overview'))
      document.querySelector('.movie-overview').innerText = filme.overview || '';
    if (document.querySelector('.movie-vote'))
      document.querySelector('.movie-vote').innerText = filme.vote_average ? `Nota: ${filme.vote_average}` : '';
    if (document.querySelector('.movie-date'))
      document.querySelector('.movie-date').innerText = filme.release_date ? `Lançamento: ${filme.release_date}` : '';
  } catch (err) {
    alert('Não foi possível encontrar um filme para esse perfil/gênero. Tente novamente!');
  } finally {
    document.getElementById('loader').style.display = 'none';
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
      perfilSelecionado = this.dataset.choice;
      showStep(3);
    });
  });

  document.querySelectorAll('.genreBtn').forEach(btn => {
    btn.addEventListener('click', async function() {
      generoSelecionado = this.dataset.genre;
      filmesJaSorteados = [];
      await sortearFilme();
      showStep(4);
    });
  });

  document.getElementById('rerollBtn').onclick = async function() {
    await sortearFilme();
  };

  document.getElementById('homeBtn').onclick = function() {
    perfilSelecionado = '';
    generoSelecionado = '';
    filmesJaSorteados = [];
    showStep(1);
  };
});