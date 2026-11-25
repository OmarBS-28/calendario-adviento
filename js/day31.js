/**
 * ==============================================================================
 * DÍA 31 - EXPERIENCIA ESPECIAL DE FIN DE AÑO (day31.js)
 * ==============================================================================
 * Controla:
 * 1. La experiencia en 3 Actos para el 31 de Diciembre:
 *    - Acto 1: El Brindis y bienvenida al Año Nuevo (con fuegos artificiales).
 *    - Acto 2: Carta extendida y galería de recuerdos del año.
 *    - Acto 3: La caja de regalo interactiva que revela la Gran Sorpresa.
 * 2. El lanzamiento de confeti dorado y animaciones de celebración.
 */

// Referencias a los elementos del modal del Día 31
const day31Modal = document.getElementById('day31Modal');
const day31CloseBtn = document.getElementById('day31CloseBtn');
const day31TabBtns = document.querySelectorAll('.day31-tab-btn');
const day31Acts = document.querySelectorAll('.day31-act-section');

const btnLaunchCelebration = document.getElementById('btnLaunchCelebration');
const giftBoxInteractive = document.getElementById('giftBoxInteractive');
const surpriseRevealedBox = document.getElementById('surpriseRevealedBox');
const giftBoxWrapper = document.getElementById('giftBoxWrapper');

/**
 * Abre la experiencia especial del Día 31
 */
function openDay31Experience() {
  if (!day31Modal) return;

  // 1. Cargar el contenido y las fotos personalizadas del Día 31
  populateDay31Content();

  // 2. Mostrar la ventana modal
  day31Modal.classList.add('is-active');
  day31Modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // 3. Iniciar en el Acto 1
  switchDay31Act('toast');

  // 4. Lanzar confeti de bienvenida
  if (typeof fireConfetti === 'function') {
    setTimeout(() => {
      fireConfetti(window.innerWidth / 2, window.innerHeight * 0.5, 70);
    }, 300);
  }
}

/**
 * Carga dinámicamente la carta y las 3 fotos de los momentos favoritos desde days-data.js
 */
function populateDay31Content() {
  const day31Data = (typeof DAYS_DATA !== 'undefined') ? DAYS_DATA.find(d => d.dia === 31) : null;
  if (!day31Data) return;

  const letterText = document.getElementById('day31LetterText');
  const letterSign = document.getElementById('day31LetterSign');
  const galleryGrid = document.getElementById('day31GalleryGrid');

  if (letterText && day31Data.cartaEspecial) {
    letterText.innerHTML = day31Data.cartaEspecial.replace(/\n/g, '<br>');
  }

  if (letterSign && day31Data.pie) {
    letterSign.textContent = day31Data.pie;
  }

  if (galleryGrid && day31Data.recuerdosAno) {
    galleryGrid.innerHTML = '';
    day31Data.recuerdosAno.forEach((item, index) => {
      const card = document.createElement('div');
      card.classList.add('gallery-memory-card');

      const photoHtml = item.fotoUrl 
        ? `<div class="gallery-memory-photo-wrap" onclick="openLightbox('${item.fotoUrl}', '${(item.titulo || 'Recuerdo').replace(/'/g, "\\'")}')" title="Toca para agrandar">
             <img src="${item.fotoUrl}" alt="${item.titulo || 'Recuerdo'}">
             <span class="polaroid-zoom-hint" style="font-size:0.68rem; padding:2px 6px;">🔍 Agrandar</span>
           </div>`
        : `<div class="gallery-memory-photo-wrap" style="cursor:default;">
             <div style="text-align:center; padding:10px;">
               <span style="font-size:2.2rem;">📷</span>
               <div style="font-size:0.75rem; color:#fbe39d; margin-top:4px;">Foto ${index + 1}</div>
               <small style="font-size:0.65rem; color:#aaa;">(Coloca fotoUrl en days-data.js)</small>
             </div>
           </div>`;

      card.innerHTML = `
        ${photoHtml}
        <h4 class="gallery-memory-title">${item.titulo || `Momento ${index + 1}`}</h4>
        <div class="gallery-memory-text">${item.texto || ''}</div>
      `;
      galleryGrid.appendChild(card);
    });
  }
}

/**
 * Cierra la experiencia especial del Día 31
 */
function closeDay31Experience() {
  if (!day31Modal) return;
  day31Modal.classList.remove('is-active');
  day31Modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/**
 * Cambia de acto ('toast', 'letter', 'surprise')
 */
function switchDay31Act(actName) {
  // Cambiar estado activo en botones
  day31TabBtns.forEach(btn => {
    if (btn.getAttribute('data-act') === actName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Mostrar la sección correspondiente
  day31Acts.forEach(sec => {
    if (sec.id === `act-${actName}`) {
      sec.classList.add('is-visible');
    } else {
      sec.classList.remove('is-visible');
    }
  });
}

/**
 * Destapa la caja de regalo misteriosa en el Acto 3
 */
function unboxFinalSurprise() {
  if (!surpriseRevealedBox) return;

  // Desvanecer caja cerrada
  if (giftBoxWrapper) {
    giftBoxWrapper.style.display = 'none';
  }

  // Revelar la sorpresa final
  surpriseRevealedBox.style.display = 'block';

  // Gran explosión de confeti en múltiples oleadas
  if (typeof fireConfetti === 'function') {
    fireConfetti(window.innerWidth * 0.3, window.innerHeight * 0.6, 60);
    setTimeout(() => fireConfetti(window.innerWidth * 0.7, window.innerHeight * 0.6, 60), 200);
    setTimeout(() => fireConfetti(window.innerWidth * 0.5, window.innerHeight * 0.4, 90), 450);
  }
}

// Exponer en window
window.openDay31Experience = openDay31Experience;
window.closeDay31Experience = closeDay31Experience;

// Eventos de inicialización
document.addEventListener('DOMContentLoaded', () => {
  if (day31CloseBtn) {
    day31CloseBtn.addEventListener('click', closeDay31Experience);
  }

  if (day31Modal) {
    day31Modal.addEventListener('click', (e) => {
      if (e.target === day31Modal) closeDay31Experience();
    });
  }

  // Navegación por pestañas de los 3 actos
  day31TabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const act = btn.getAttribute('data-act');
      switchDay31Act(act);
    });
  });

  // Botón de celebrar en el Acto 1
  if (btnLaunchCelebration) {
    btnLaunchCelebration.addEventListener('click', () => {
      if (typeof fireConfetti === 'function') {
        fireConfetti(window.innerWidth / 2, window.innerHeight * 0.6, 80);
      }
    });
  }

  // Clic en la caja de regalo interactiva del Acto 3
  if (giftBoxInteractive) {
    giftBoxInteractive.addEventListener('click', unboxFinalSurprise);
  }
});
