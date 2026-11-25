/**
 * ==============================================================================
 * CALENDARIO DE ADVIENTO - LÓGICA PRINCIPAL (app.js)
 * ==============================================================================
 * Controla:
 * 1. La lectura y renderizado del contenido desde 'days-data.js'.
 * 2. La lógica de fechas y bloqueo (según el día actual de Diciembre).
 * 3. La memoria interna (localStorage) para recordar días abiertos y cupones.
 * 4. El Modo de Prueba / Administrador para simular fechas durante el desarrollo.
 * 5. La apertura interactiva de cada tipo de sorpresa (carta, foto, música, cupon, trivia).
 */

// CLAVES DE LOCALSTORAGE
const STORAGE_KEYS = {
  OPENED_DAYS: 'adviento_opened_days',
  UNLOCKED_COUPONS: 'adviento_unlocked_coupons',
  SIMULATED_DAY: 'adviento_simulated_day',
  UNLOCK_ALL_DEV: 'adviento_unlock_all_dev'
};

// ELEMENTOS DEL DOM (INTERFAZ)
const senderNameDisplay = document.getElementById('senderNameDisplay');
const recipientNameDisplay = document.getElementById('recipientNameDisplay');
const calendarGrid = document.getElementById('calendarGrid');
const unlockedCounter = document.getElementById('unlockedCounter');
const walletBadge = document.getElementById('walletBadge');
const calendarStatusNotice = document.getElementById('calendarStatusNotice');

// MODAL DE SORPRESA
const dayModal = document.getElementById('dayModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalActionBtn = document.getElementById('modalActionBtn');
const modalDayNumber = document.getElementById('modalDayNumber');
const modalTitle = document.getElementById('modalTitle');
const modalContentArea = document.getElementById('modalContentArea');
const modalTypeTag = document.getElementById('modalTypeTag');

// MODAL DE DÍA BLOQUEADO
const lockedModal = document.getElementById('lockedModal');
const lockedModalCloseBtn = document.getElementById('lockedModalCloseBtn');
const lockedModalActionBtn = document.getElementById('lockedModalActionBtn');
const lockedUnlockDateBadge = document.getElementById('lockedUnlockDateBadge');
const lockedModalMessage = document.getElementById('lockedModalMessage');

// ELEMENTOS DEL MODO DE PRUEBA (DEV BAR)
const devBar = document.getElementById('devBar');
const devToggleBtn = document.getElementById('devToggleBtn');
const devBarBody = document.getElementById('devBarBody');
const devDateSelect = document.getElementById('devDateSelect');
const devUnlockAllBtn = document.getElementById('devUnlockAllBtn');
const devResetBtn = document.getElementById('devResetBtn');

// ==============================================================================
// GESTIÓN DE LOCALSTORAGE (MEMORIA DEL NAVEGADOR)
// ==============================================================================

/**
 * Obtiene la lista de días ya abiertos
 */
function getOpenedDays() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.OPENED_DAYS);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Guarda un día como abierto
 */
function markDayAsOpened(dayNumber) {
  const opened = getOpenedDays();
  if (!opened.includes(dayNumber)) {
    opened.push(dayNumber);
    localStorage.setItem(STORAGE_KEYS.OPENED_DAYS, JSON.stringify(opened));
  }
}

/**
 * Obtiene la lista de cupones desbloqueados
 */
function getUnlockedCoupons() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.UNLOCKED_COUPONS);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Guarda un cupón desbloqueado
 */
function saveUnlockedCoupon(couponId) {
  if (!couponId) return;
  const coupons = getUnlockedCoupons();
  if (!coupons.includes(couponId)) {
    coupons.push(couponId);
    localStorage.setItem(STORAGE_KEYS.UNLOCKED_COUPONS, JSON.stringify(coupons));
  }
}

// ==============================================================================
// CÁLCULO DE LA FECHA ACTUAL Y SIMULACIÓN
// ==============================================================================

/**
 * Determina el día actual permitido.
 * Si devMode está activo, usa la simulación.
 * Si devMode está inactivo, usa la fecha real del sistema.
 */
function getCurrentAllowedDay() {
  // Si está activado "Desbloquear todo" en modo dev
  if (CALENDAR_CONFIG.devMode && localStorage.getItem(STORAGE_KEYS.UNLOCK_ALL_DEV) === 'true') {
    return 31;
  }

  // Si devMode está activo y hay un día simulado guardado
  if (CALENDAR_CONFIG.devMode) {
    const simulated = localStorage.getItem(STORAGE_KEYS.SIMULATED_DAY);
    if (simulated) {
      return parseInt(simulated, 10);
    }
  }

  // Modo fecha real del sistema:
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1 = Enero, 12 = Diciembre
  const currentDay = now.getDate();

  // Si aún no es el año o mes objetivo (ej. antes del 1 de diciembre de 2024)
  if (currentYear < CALENDAR_CONFIG.targetYear || (currentYear === CALENDAR_CONFIG.targetYear && currentMonth < CALENDAR_CONFIG.targetMonth)) {
    return 0; // Todo bloqueado
  }

  // Si ya pasó diciembre del año objetivo, todo queda abierto
  if (currentYear > CALENDAR_CONFIG.targetYear || (currentYear === CALENDAR_CONFIG.targetYear && currentMonth > CALENDAR_CONFIG.targetMonth)) {
    return 31;
  }

  // Estamos en diciembre: el día máximo permitido es el día de hoy
  return currentDay;
}

// ==============================================================================
// RENDERIZADO DEL TABLERO DE CASILLAS
// ==============================================================================

/**
 * Construye las 31 casillas en base a DAYS_DATA y su estado (abierto/disponible/bloqueado)
 */
function renderCalendarGrid() {
  // 1. Alternar entre pantalla exclusiva de pre-lanzamiento o calendario activo
  updateViewMode();

  calendarGrid.innerHTML = '';
  const currentAllowedDay = getCurrentAllowedDay();
  const openedDays = getOpenedDays();

  // Actualizar contadores
  unlockedCounter.innerHTML = `Descubiertos: <strong>${openedDays.length} / 31</strong>`;
  const coupons = getUnlockedCoupons();
  walletBadge.textContent = `${coupons.length} cupón${coupons.length === 1 ? '' : 'es'}`;

  // Actualizar aviso según el día
  if (currentAllowedDay === 0) {
    calendarStatusNotice.textContent = "❄️ El calendario comenzará el 1 de Diciembre. ¡La magia está por empezar!";
  } else if (currentAllowedDay >= 31) {
    calendarStatusNotice.textContent = "✨ ¡Todos los días de diciembre están disponibles! Explora cualquier sorpresa cuando quieras.";
  } else {
    calendarStatusNotice.textContent = `Hoy es día ${currentAllowedDay} de Diciembre. Tienes sorpresas listas para descubrir.`;
  }

  DAYS_DATA.forEach((data) => {
    const day = data.dia;
    const isDay31 = day === 31;
    const isOpened = openedDays.includes(day);
    const isUnlocked = day <= currentAllowedDay;

    // Crear la tarjeta
    const card = document.createElement('div');
    card.classList.add('calendar-card');
    if (isDay31) card.classList.add('card-special-31');

    // Determinar estado visual
    let stateClass = '';
    let statusText = '';
    let dotTitle = '';

    if (isOpened) {
      stateClass = 'card-state-opened';
      statusText = '✨ Abierto';
      dotTitle = 'Día descubierto';
    } else if (isUnlocked) {
      stateClass = 'card-state-available';
      statusText = '¡Abrir hoy!';
      dotTitle = 'Disponible para abrir';
    } else {
      stateClass = 'card-state-locked';
      statusText = '🔒 Bloqueado';
      dotTitle = `Disponible el ${day} de Diciembre`;
    }

    card.classList.add(stateClass);

    // Contenido interno de la casilla
    card.innerHTML = `
      <div class="card-top">
        <span class="card-status-dot" title="${dotTitle}"></span>
        <span class="card-theme-icon">${isUnlocked ? data.icono : '🔒'}</span>
      </div>
      
      <div class="card-center">
        <span class="card-number">${day}</span>
        <span class="card-month">Diciembre</span>
      </div>
      
      <div class="card-bottom">
        ${isDay31 && !isOpened
          ? `<span class="special-badge-31">✦ Fin de Año ✦</span>` 
          : `<span class="card-preview-type">${statusText}</span>`
        }
      </div>
    `;

    // Evento al hacer clic en la casilla
    card.addEventListener('click', () => {
      handleCardClick(data, isUnlocked, isOpened);
    });

    calendarGrid.appendChild(card);
  });
}

/**
 * Gestiona el clic en una casilla según si está desbloqueada o bloqueada
 */
function handleCardClick(data, isUnlocked, isOpened) {
  if (!isUnlocked) {
    // Abrir modal de bloqueo
    showLockedModal(data.dia);
    return;
  }

  // Si está desbloqueada, marcarla como abierta si es la primera vez
  if (!isOpened) {
    markDayAsOpened(data.dia);
    if (data.tipo === 'cupon' && data.cuponId) {
      saveUnlockedCoupon(data.cuponId);
    }
  }

  // Si es el Día 31, abrir la experiencia especial culminante de fin de año
  if (data.dia === 31 && typeof window.openDay31Experience === 'function') {
    window.openDay31Experience();
    renderCalendarGrid();
    return;
  }

  // Mostrar el contenido de la sorpresa normal
  showDayModal(data);

  // Volver a renderizar para actualizar insignias y estilos
  renderCalendarGrid();
}

// ==============================================================================
// VENTANAS MODALES Y VISTAS DE SORPRESAS
// ==============================================================================

/**
 * Muestra el modal de casilla bloqueada
 */
function showLockedModal(dayNumber) {
  const currentAllowed = getCurrentAllowedDay();
  if (currentAllowed === 0) {
    lockedUnlockDateBadge.innerHTML = `Comienza el: <strong>1 de Diciembre</strong>`;
    lockedModalMessage.textContent = `¡Hola mi vida! ❤️ Este calendario se activará a medianoche del 1 de Diciembre. Puedes ver la cuenta regresiva arriba para saber exactamente cuánto falta para que empiece la magia.`;
  } else {
    lockedUnlockDateBadge.innerHTML = `Se desbloquea el: <strong>${dayNumber} de Diciembre</strong>`;
    lockedModalMessage.textContent = `Esta sorpresa está guardada con mucho amor. ¡Sé paciente, mi vida! Podrás descubrirla cuando llegue el ${dayNumber} de Diciembre.`;
  }
  lockedModal.classList.add('is-active');
  lockedModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLockedModal() {
  lockedModal.classList.remove('is-active');
  lockedModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/**
 * Muestra el modal con la sorpresa del día correspondiente
 */
function showDayModal(data) {
  modalDayNumber.textContent = `Día ${data.dia} de Diciembre`;
  modalTitle.textContent = data.titulo;

  // Generar el contenido específico según el tipo de sorpresa
  let contentHtml = '';

  switch (data.tipo) {
    case 'carta':
      contentHtml = `
        <div class="letter-box">
          <p>${data.mensaje}</p>
          ${data.pie ? `<div class="letter-footer-note">${data.pie}</div>` : ''}
        </div>
      `;
      modalTypeTag.innerHTML = `<span>💌 Carta Romántica</span>`;
      break;

    case 'foto':
      contentHtml = `
        <div class="polaroid-frame">
          <div class="polaroid-image-wrapper" ${data.fotoUrl ? `onclick="openLightbox('${data.fotoUrl}', '${(data.mensaje || 'Nuestro recuerdo').replace(/'/g, "\\'")}')"` : ''}>
            ${data.fotoUrl 
              ? `<img src="${data.fotoUrl}" alt="Nuestro recuerdo especial">
                 <span class="polaroid-zoom-hint">🔍 Toca para agrandar</span>` 
              : `<div style="text-align:center; padding:20px;">
                   <span style="font-size:3rem;">📷</span>
                   <p style="margin-top:6px; font-weight:600; color:#444;">Espacio para tu foto especial</p>
                   <small style="color:#777;">(Coloca tu imagen en assets/images/ y edita days-data.js)</small>
                 </div>`
            }
          </div>
          <div class="polaroid-caption">${data.mensaje || 'Un instante inolvidable juntos'}</div>
        </div>
        ${data.pie ? `<p style="text-align:center; font-style:italic; color:var(--color-gold-light);">${data.pie}</p>` : ''}
      `;
      modalTypeTag.innerHTML = `<span>📷 Fotografía & Recuerdo</span>`;
      break;

    case 'musica':
      contentHtml = `
        <div class="music-player-box">
          <span class="music-disc-icon">💿</span>
          <div class="song-title-display">${data.cancionTitulo || 'Canción Especial'}</div>
          <div class="song-artist-display">${data.cancionArtista || 'Nuestra Música'}</div>
          <p style="margin: 12px 0; font-size: 0.95rem; color: var(--color-cream);">${data.mensaje}</p>
          
          ${data.audioUrl 
            ? `<audio controls class="custom-audio-player" src="${data.audioUrl}"></audio>` 
            : `<div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; font-size: 0.85rem; color: var(--color-gold-light);">
                 🎵 Puedes enlazar un archivo MP3 en <code>days-data.js</code>
               </div>`
          }
        </div>
        ${data.pie ? `<p style="text-align:center; font-style:italic; color:var(--color-cream-muted);">${data.pie}</p>` : ''}
      `;
      modalTypeTag.innerHTML = `<span>🎶 Canción Dedicada</span>`;
      break;

    case 'cupon':
      contentHtml = `
        <div class="scratch-instructions">
          <span>✨</span>
          <span>¡Rasca el área dorada para descubrir tu cupón sorpresa!</span>
          <span>✨</span>
        </div>

        <div class="scratch-card-wrapper" id="scratchCardWrapper">
          <div class="scratch-card-content">
            <span class="coupon-id-pill">ID: ${data.cuponId || 'CUPON-AMOR'}</span>
            <h4 style="font-family:var(--font-serif); font-size:1.35rem; color:#fff; margin-bottom:10px;">${data.titulo}</h4>
            <p style="font-size:1rem; line-height:1.6; color:var(--color-cream);">${data.mensaje}</p>
            <div class="coupon-validity">${data.validez || 'Canjeable cuando tú quieras'}</div>
            <div class="coupon-saved-notice" style="margin-top:14px;">
              ✅ ¡Guardado en tu <strong>Wallet de Amor</strong>!
            </div>
          </div>
          <canvas class="scratch-canvas" id="scratchCanvas"></canvas>
        </div>

        <div class="scratch-actions">
          <button class="btn-reveal-all" id="btnRevealAll" onclick="if(window.revealScratchCard) window.revealScratchCard();">
            ✨ Revelar cupón completo
          </button>
        </div>

        ${data.pie ? `<p style="text-align:center; font-size:0.85rem; color:var(--color-gold); margin-top:14px;">${data.pie}</p>` : ''}
      `;
      modalTypeTag.innerHTML = `<span>🎟️ Cupón: Rasca y Gana</span>`;
      break;

    case 'pregunta':
      const optionsHtml = data.opciones.map((opt, index) => `
        <button class="quiz-option-btn" data-index="${index}">
          <strong>${String.fromCharCode(65 + index)})</strong> ${opt}
        </button>
      `).join('');

      contentHtml = `
        <div class="quiz-box">
          <div class="quiz-question-text">${data.pregunta}</div>
          <div class="quiz-options-list" id="quizOptionsList">
            ${optionsHtml}
          </div>
          <div class="quiz-feedback-box" id="quizFeedbackBox"></div>
        </div>
        ${data.pie ? `<p style="text-align:center; margin-top:14px; font-size:0.85rem; color:var(--color-cream-muted);">${data.pie}</p>` : ''}
      `;
      modalTypeTag.innerHTML = `<span>❓ Trivia de Nuestra Relación</span>`;
      break;

    case 'especial-31':
      contentHtml = `
        <div style="background: linear-gradient(135deg, rgba(110,16,31,0.6), rgba(27,83,59,0.6)); border: 2px solid var(--color-gold); border-radius: 14px; padding: 22px; text-align: center; margin-bottom: 16px;">
          <div style="font-size: 2.8rem; margin-bottom: 8px;">🎆 🥂 👑</div>
          <h4 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-gold-light); margin-bottom: 12px;">¡Feliz Fin de Año, Mi Vida!</h4>
          <p style="font-size: 1.05rem; line-height: 1.7; color: #fff; margin-bottom: 16px;">${data.mensaje}</p>
          
          <div class="letter-box" style="text-align: left; margin-top: 14px;">
            <p style="white-space: pre-line;">${data.cartaEspecial}</p>
          </div>
          
          <div style="margin-top: 18px; font-family: var(--font-cursive); font-size: 1.8rem; color: var(--color-gold-light);">
            ${data.pie || 'Por un nuevo año juntos'}
          </div>
        </div>
      `;
      modalTypeTag.innerHTML = `<span>👑 Clímax & Año Nuevo</span>`;
      break;

    default:
      contentHtml = `<p>${data.mensaje}</p>`;
      modalTypeTag.innerHTML = `<span>✨ Sorpresa</span>`;
  }

  modalContentArea.innerHTML = contentHtml;

  // Si es tipo trivia, adjuntar interactividad a las opciones
  if (data.tipo === 'pregunta') {
    setupQuizInteractivity(data);
  }

  // Si es tipo cupón, inicializar la experiencia de Rasca y Gana
  if (data.tipo === 'cupon') {
    setupScratchCard(data);
  }

  dayModal.classList.add('is-active');
  dayModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeDayModal() {
  dayModal.classList.remove('is-active');
  dayModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/**
 * Agrega eventos a las opciones de trivia
 */
function setupQuizInteractivity(data) {
  const buttons = document.querySelectorAll('.quiz-option-btn');
  const feedbackBox = document.getElementById('quizFeedbackBox');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedIndex = parseInt(btn.getAttribute('data-index'), 10);
      
      // Desactivar todos los botones para que no cambie la respuesta
      buttons.forEach(b => b.style.pointerEvents = 'none');

      if (selectedIndex === data.respuestaCorrecta) {
        btn.classList.add('correct-choice');
        feedbackBox.style.display = 'block';
        feedbackBox.style.background = 'rgba(27, 83, 59, 0.85)';
        feedbackBox.style.border = '1px solid #39ff14';
        feedbackBox.style.color = '#fff';

        const aciertoText = data.mensajeCorrecto || data.mensajeAcierto || '¡Sabía que lo recordarías!';
        let rewardPhotoHtml = '';
        if (data.fotoAcierto) {
          rewardPhotoHtml = `
            <div class="quiz-reward-photo" onclick="openLightbox('${data.fotoAcierto}', '¡Recompensa desbloqueada!')">
              <img src="${data.fotoAcierto}" alt="Foto de recompensa">
              <div class="quiz-reward-caption">✨ ¡Fotografía secreta desbloqueada! (Toca para agrandar)</div>
            </div>
          `;
        }

        feedbackBox.innerHTML = `
          <div>💖 <strong>¡Correcto, mi amor!</strong> ${aciertoText}</div>
          ${rewardPhotoHtml}
        `;

        // Celebrar con confeti
        if (typeof fireConfetti === 'function') {
          fireConfetti(window.innerWidth / 2, window.innerHeight * 0.5, 45);
        }
      } else {
        btn.classList.add('wrong-choice');
        // Resaltar la correcta
        buttons[data.respuestaCorrecta].classList.add('correct-choice');
        feedbackBox.style.display = 'block';
        feedbackBox.style.background = 'rgba(110, 16, 31, 0.85)';
        feedbackBox.style.border = '1px solid #ff4d6d';
        feedbackBox.style.color = '#fff';

        const errorText = data.mensajeError || `¡Cerca, amor! Pero igual te amo con locura. ${data.mensajeAcierto || ''}`;
        feedbackBox.innerHTML = `💕 ${errorText}`;
      }
    });
  });
}

// ==============================================================================
// GESTIÓN DEL MODO DE PRUEBAS / DESARROLLADOR (DEV BAR)
// ==============================================================================

function setupDevBar() {
  if (!CALENDAR_CONFIG.devMode) {
    devBar.style.display = 'none';
    return;
  }

  devBar.style.display = 'block';

  // Llenar selector de días (1 a 31)
  devDateSelect.innerHTML = `
    <option value="0">Antes de Diciembre (Ver solo Pre-lanzamiento)</option>
  `;
  for (let i = 1; i <= 31; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `Día ${i} de Diciembre (Ver Calendario)`;
    devDateSelect.appendChild(opt);
  }

  // Establecer el valor seleccionado actual
  const currentSimulated = getCurrentAllowedDay();
  devDateSelect.value = currentSimulated;

  // Evento al cambiar fecha simulada
  devDateSelect.addEventListener('change', (e) => {
    localStorage.removeItem(STORAGE_KEYS.UNLOCK_ALL_DEV);
    localStorage.setItem(STORAGE_KEYS.SIMULATED_DAY, e.target.value);
    renderCalendarGrid();
  });

  // Evento botón Desbloquear Todo
  devUnlockAllBtn.addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEYS.UNLOCK_ALL_DEV, 'true');
    // Desbloquear también todos los cupones para probar la Wallet de inmediato
    DAYS_DATA.forEach(d => {
      if (d.tipo === 'cupon' && d.cuponId) {
        saveUnlockedCoupon(d.cuponId);
      }
    });
    devDateSelect.value = 31;
    renderCalendarGrid();
    alert('🔓 ¡Modo Dev: Todas las 31 casillas y la Wallet han sido desbloqueadas para que revises todo!');
  });

  // Evento botón Reiniciar Progreso
  devResetBtn.addEventListener('click', () => {
    if (confirm('¿Deseas borrar todo el progreso guardado (días descubiertos y cupones)?')) {
      localStorage.removeItem(STORAGE_KEYS.OPENED_DAYS);
      localStorage.removeItem(STORAGE_KEYS.UNLOCKED_COUPONS);
      localStorage.removeItem(STORAGE_KEYS.SIMULATED_DAY);
      localStorage.removeItem(STORAGE_KEYS.UNLOCK_ALL_DEV);
      devDateSelect.value = 1;
      renderCalendarGrid();
      alert('🔄 Progreso reiniciado a cero.');
    }
  });

  // Toggle para colapsar panel
  devToggleBtn.addEventListener('click', () => {
    devBarBody.classList.toggle('is-collapsed');
    devToggleBtn.textContent = devBarBody.classList.contains('is-collapsed') ? '+' : '−';
  });
}

// ==============================================================================
// LÓGICA DE CUPÓN: RASCA Y GANA INTERACTIVO
// ==============================================================================
function setupScratchCard(data) {
  const canvas = document.getElementById('scratchCanvas');
  const wrapper = document.getElementById('scratchCardWrapper');
  const btnReveal = document.getElementById('btnRevealAll');
  if (!canvas || !wrapper) return;

  // Esperar a que el modal se dibuje para tener dimensiones reales
  setTimeout(() => {
    const width = wrapper.clientWidth || 360;
    const height = wrapper.clientHeight || 280;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    // 1. Capa metálica dorada festiva
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#d4af37');
    grad.addColorStop(0.25, '#fbe39d');
    grad.addColorStop(0.55, '#aa820a');
    grad.addColorStop(0.85, '#6e101f');
    grad.addColorStop(1, '#420811');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Marco navideño
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, width - 16, height - 16);

    // Estrellas y chispas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    for (let i = 0; i < 35; i++) {
      const sx = (i * 43) % width;
      const sy = (i * 29) % height;
      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Texto central
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Cinzel, serif';
    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 10;
    ctx.fillText('🎁 RASCA Y GANA 🎁', width / 2, height / 2 - 18);

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fbe39d';
    ctx.font = 'bold 14px Outfit, sans-serif';
    ctx.fillText('Desliza tu dedo o mouse aquí', width / 2, height / 2 + 15);

    ctx.font = 'italic 12px Outfit, sans-serif';
    ctx.fillStyle = '#faf5eb';
    ctx.fillText('para descubrir tu cupón sorpresa ✨', width / 2, height / 2 + 38);

    let isScratching = false;
    let isCompleted = false;

    function scratch(x, y) {
      if (isCompleted) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();

      checkProgress();
    }

    function checkProgress() {
      if (isCompleted) return;
      try {
        const imgData = ctx.getImageData(0, 0, width, height);
        const pixels = imgData.data;
        let transparent = 0;
        let total = 0;

        for (let i = 3; i < pixels.length; i += 4 * 20) {
          total++;
          if (pixels[i] === 0) transparent++;
        }

        if (total > 0 && (transparent / total) > 0.35) {
          revealAll();
        }
      } catch (err) {}
    }

    function revealAll() {
      if (isCompleted) return;
      isCompleted = true;
      canvas.classList.add('fade-out');

      if (btnReveal) {
        btnReveal.textContent = '🎉 ¡Cupón Descubierto!';
        btnReveal.style.background = 'rgba(27, 83, 59, 0.8)';
        btnReveal.style.borderColor = '#39ff14';
      }

      // Guardar cupón en localStorage
      if (data.cuponId) {
        saveUnlockedCoupon(data.cuponId);
        // Actualizar contador del badge
        const coupons = getUnlockedCoupons();
        if (walletBadge) walletBadge.textContent = `${coupons.length} cupón${coupons.length === 1 ? '' : 'es'}`;
      }

      // Celebrar con confeti
      if (typeof fireConfetti === 'function') {
        fireConfetti(window.innerWidth / 2, window.innerHeight * 0.5, 60);
      }
    }

    window.revealScratchCard = revealAll;

    // Eventos Pointer (Mouse + Touch táctil unificado)
    function getPos(e) {
      const b = canvas.getBoundingClientRect();
      return {
        x: e.clientX - b.left,
        y: e.clientY - b.top
      };
    }

    canvas.onpointerdown = (e) => {
      isScratching = true;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
      try { canvas.setPointerCapture(e.pointerId); } catch(err){}
    };

    canvas.onpointermove = (e) => {
      if (!isScratching) return;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    };

    canvas.onpointerup = (e) => {
      isScratching = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch(err){}
    };

    canvas.onpointercancel = () => { isScratching = false; };
  }, 100);
}

// ==============================================================================
// CONTROL DE VISTAS: PRE-LANZAMIENTO VS CALENDARIO ACTIVO
// ==============================================================================
function updateViewMode() {
  const currentAllowed = getCurrentAllowedDay();
  const prelaunchSender = document.getElementById('prelaunchSender');
  const prelaunchRecipient = document.getElementById('prelaunchRecipient');

  // Sincronizar nombres también en la vista de pre-lanzamiento
  if (CALENDAR_CONFIG.couple) {
    if (prelaunchSender) prelaunchSender.textContent = CALENDAR_CONFIG.couple.sender;
    if (prelaunchRecipient) prelaunchRecipient.textContent = CALENDAR_CONFIG.couple.recipient;
  }

  // Si currentAllowed === 0 (antes de Diciembre), activar la vista exclusiva de Pre-lanzamiento
  if (currentAllowed === 0) {
    document.body.classList.add('is-prelaunch');
  } else {
    document.body.classList.remove('is-prelaunch');
  }
}

// ==============================================================================
// TEMPORIZADOR DE CUENTA REGRESIVA AL 1 DE DICIEMBRE
// ==============================================================================
let countdownTimerInterval = null;

function initPrelaunchCountdown() {
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');

  const targetYear = (typeof CALENDAR_CONFIG !== 'undefined' && CALENDAR_CONFIG.targetYear) ? CALENDAR_CONFIG.targetYear : 2026;
  const targetDate = new Date(targetYear, 11, 1, 0, 0, 0); // 1 de Diciembre

  function updateTimer() {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    // Si ya comenzó diciembre
    if (diff <= 0) {
      document.body.classList.remove('is-prelaunch');
      if (countdownTimerInterval) clearInterval(countdownTimerInterval);
      if (typeof fireConfetti === 'function') {
        fireConfetti(window.innerWidth / 2, window.innerHeight * 0.5, 90);
      }
      renderCalendarGrid();
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
    if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
    if (cdMinutes) cdMinutes.textContent = String(minutes).padStart(2, '0');
    if (cdSeconds) cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  countdownTimerInterval = setInterval(updateTimer, 1000);
}

// ==============================================================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sincronizar nombres de la pareja desde days-data.js
  if (CALENDAR_CONFIG.couple) {
    if (senderNameDisplay) senderNameDisplay.textContent = CALENDAR_CONFIG.couple.sender;
    if (recipientNameDisplay) recipientNameDisplay.textContent = CALENDAR_CONFIG.couple.recipient;
  }

  // 2. Configurar eventos de cierre de modales
  modalCloseBtn.addEventListener('click', closeDayModal);
  modalActionBtn.addEventListener('click', closeDayModal);
  dayModal.addEventListener('click', (e) => { if (e.target === dayModal) closeDayModal(); });

  lockedModalCloseBtn.addEventListener('click', closeLockedModal);
  lockedModalActionBtn.addEventListener('click', closeLockedModal);
  lockedModal.addEventListener('click', (e) => { if (e.target === lockedModal) closeLockedModal(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDayModal();
      closeLockedModal();
      closeLightbox();
      closeSpotifyModal();
    }
  });

  // 3. Inicializar Modo Dev
  setupDevBar();

  // 4. Inicializar Temporizador de Pre-lanzamiento
  initPrelaunchCountdown();

  // 5. Renderizar el tablero inicial
  renderCalendarGrid();
});

// ==============================================================================
// VISOR DE FOTOGRAFÍAS EN PANTALLA COMPLETA (LIGHTBOX)
// ==============================================================================
function openLightbox(imageUrl, captionText) {
  const lightbox = document.getElementById('imageLightbox');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  if (!lightbox || !img) return;

  img.src = imageUrl;
  if (caption) caption.textContent = captionText || '';

  lightbox.classList.add('is-active');
  lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox(e) {
  const lightbox = document.getElementById('imageLightbox');
  if (!lightbox) return;
  lightbox.classList.remove('is-active');
  lightbox.setAttribute('aria-hidden', 'true');
}

// ==============================================================================
// MODAL DE PLAYLIST DE SPOTIFY & CÓDIGO QR
// ==============================================================================
function openSpotifyModal() {
  const modal = document.getElementById('spotifyModal');
  const qrContainer = document.getElementById('spotifyQrContainer');
  const directLink = document.getElementById('spotifyDirectLink');
  const titleDisplay = document.getElementById('spotifyTitleDisplay');
  const descDisplay = document.getElementById('spotifyDescDisplay');
  if (!modal) return;

  const spotifyConfig = (typeof CALENDAR_CONFIG !== 'undefined' && CALENDAR_CONFIG.spotify) ? CALENDAR_CONFIG.spotify : {
    titulo: 'Nuestra Playlist en Spotify',
    descripcion: 'Las canciones que cuentan nuestra historia.',
    url: 'https://open.spotify.com',
    qrImagenUrl: ''
  };

  if (titleDisplay) titleDisplay.textContent = spotifyConfig.titulo || 'Nuestra Playlist en Spotify';
  if (descDisplay) descDisplay.textContent = spotifyConfig.descripcion || 'Escucha las canciones que cuentan nuestra historia.';
  if (directLink) directLink.href = spotifyConfig.url || 'https://open.spotify.com';

  // Renderizar QR: si tiene imagen propia la muestra, si no, genera el QR
  if (qrContainer) {
    qrContainer.innerHTML = '';
    if (spotifyConfig.qrImagenUrl) {
      const customImg = document.createElement('img');
      customImg.src = spotifyConfig.qrImagenUrl;
      customImg.alt = 'Código Spotify';
      customImg.style.cursor = 'zoom-in';
      customImg.onclick = () => openLightbox(spotifyConfig.qrImagenUrl, 'Código Spotify');
      qrContainer.appendChild(customImg);
    } else if (window.QRCode) {
      new QRCode(qrContainer, {
        text: spotifyConfig.url || 'https://open.spotify.com',
        width: 190,
        height: 190,
        colorDark: '#091f13',
        colorLight: '#ffffff'
      });
    }
  }

  modal.classList.add('is-active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeSpotifyModal() {
  const modal = document.getElementById('spotifyModal');
  if (!modal) return;
  modal.classList.remove('is-active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Exponer en window
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.openSpotifyModal = openSpotifyModal;
window.closeSpotifyModal = closeSpotifyModal;
