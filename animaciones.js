// Sensat Studio · animaciones de la landing (v2)
// Entradas suaves al bajar, cifras que cuentan y la S que sigue al mouse.
(function () {
  clearTimeout(window.__sinAnimaciones);

  var raiz = document.documentElement;
  var menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var elementos = document.querySelectorAll('.revelar');

  function formatear(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function contar(dt) {
    var meta = parseInt(dt.getAttribute('data-cifra'), 10);
    var duracion = 1600;
    var inicio = null;
    function paso(t) {
      if (inicio === null) inicio = t;
      var avance = Math.min((t - inicio) / duracion, 1);
      var suave = 1 - Math.pow(1 - avance, 3);
      dt.textContent = formatear(Math.round(meta * suave));
      if (avance < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
  }

  if (menosMovimiento || !('IntersectionObserver' in window)) {
    elementos.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  // Las cifras arrancan en cero y cuentan al aparecer
  document.querySelectorAll('[data-cifra]').forEach(function (dt) { dt.textContent = '0'; });

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      var el = entrada.target;
      el.classList.add('visible');
      el.querySelectorAll('[data-cifra]').forEach(contar);
      observador.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

  elementos.forEach(function (el) { observador.observe(el); });

  // La S de la portada se inclina un poco siguiendo el mouse (solo computadora)
  var portada = document.querySelector('.portada');
  var giro = document.querySelector('.s-giro');
  if (portada && giro && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    portada.addEventListener('mousemove', function (e) {
      var caja = portada.getBoundingClientRect();
      var x = (e.clientX - caja.left) / caja.width - 0.5;
      var y = (e.clientY - caja.top) / caja.height - 0.5;
      giro.style.setProperty('--ry', (x * 18).toFixed(2) + 'deg');
      giro.style.setProperty('--rx', (-y * 14).toFixed(2) + 'deg');
    });
    portada.addEventListener('mouseleave', function () {
      giro.style.setProperty('--ry', '0deg');
      giro.style.setProperty('--rx', '0deg');
    });
  }

  raiz.classList.add('animado');
})();
