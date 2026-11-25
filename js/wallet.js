/**
 * ==============================================================================
 * MI WALLET DE AMOR - LÓGICA DE LA CUPONERA DIGITAL (wallet.js)
 * ==============================================================================
 * Controla:
 * 1. La apertura y cierre garantizados de la ventana modal de la Wallet.
 * 2. La visualización de los cupones que han sido descubiertos en el calendario.
 * 3. El estado de cada cupón: 'Disponible' o 'Canjeado' (guardado en localStorage).
 * 4. La generación de códigos QR visuales únicos sin internet.
 * 5. La descarga gratuita del cupón en formato de imagen de alta resolución (PNG)
 *    para guardarlo directamente en la galería de fotos del celular o PC.
 */

// Clave adicional para estados de canje
const STORAGE_KEY_COUPON_STATUSES = 'adviento_coupon_statuses';

let currentWalletFilter = 'all';

/**
 * Obtiene el mapa de estados de los cupones (si están canjeados o disponibles)
 */
function getCouponStatuses() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_COUPON_STATUSES);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

/**
 * Cambia el estado de un cupón entre 'disponible' y 'canjeado'
 */
function toggleCouponRedemption(couponId) {
  const statuses = getCouponStatuses();
  const current = statuses[couponId] || { redeemed: false };
  
  if (current.redeemed) {
    delete statuses[couponId];
  } else {
    const fecha = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    statuses[couponId] = {
      redeemed: true,
      redeemedDate: fecha
    };
  }

  localStorage.setItem(STORAGE_KEY_COUPON_STATUSES, JSON.stringify(statuses));
  renderWalletCoupons(currentWalletFilter);
}

/**
 * Abre la ventana modal de la Wallet garantizando su visibilidad inmediata
 */
function openWalletModal() {
  const modal = document.getElementById('walletModal');
  if (!modal) {
    console.error("No se encontró el elemento #walletModal en el documento.");
    return;
  }

  // 1. Mostrar la ventana modal primero
  modal.classList.add('is-active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // 2. Renderizar los cupones de forma segura
  try {
    renderWalletCoupons(currentWalletFilter);
  } catch (err) {
    console.error("Error al renderizar los cupones en la Wallet:", err);
  }
}

/**
 * Cierra la ventana modal de la Wallet
 */
function closeWalletModal() {
  const modal = document.getElementById('walletModal');
  if (!modal) return;
  modal.classList.remove('is-active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/**
 * Renderiza la lista de cupones según el filtro seleccionado ('all', 'available', 'redeemed')
 */
function renderWalletCoupons(filter = 'all') {
  currentWalletFilter = filter;
  const grid = document.getElementById('walletCouponsGrid');
  const emptyState = document.getElementById('walletEmptyState');
  const countSubtitle = document.getElementById('walletCountSubtitle');

  if (!grid || !emptyState) return;

  // Obtener cupones desbloqueados (desde app.js o localStorage)
  let unlockedCouponIds = [];
  try {
    const stored = localStorage.getItem('adviento_unlocked_coupons');
    if (stored) unlockedCouponIds = JSON.parse(stored);
  } catch (e) {
    unlockedCouponIds = [];
  }

  const isUnlockAllDev = typeof CALENDAR_CONFIG !== 'undefined' && 
                         CALENDAR_CONFIG.devMode && 
                         localStorage.getItem('adviento_unlock_all_dev') === 'true';

  const statuses = getCouponStatuses();

  // Filtrar todos los días del calendario que sean tipo cupón y que ya estén desbloqueados
  const couponsData = (typeof DAYS_DATA !== 'undefined' ? DAYS_DATA : []).filter(day => 
    day.tipo === 'cupon' && (unlockedCouponIds.includes(day.cuponId) || isUnlockAllDev)
  );

  // Actualizar subtítulo con el conteo
  if (countSubtitle) {
    countSubtitle.textContent = `Tienes ${couponsData.length} cupón${couponsData.length === 1 ? '' : 'es'} en tu colección.`;
  }

  // Filtrar según el botón activo
  let visibleCoupons = couponsData.filter(c => {
    const isRedeemed = statuses[c.cuponId] && statuses[c.cuponId].redeemed;
    if (filter === 'available') return !isRedeemed;
    if (filter === 'redeemed') return isRedeemed;
    return true; // 'all'
  });

  // Si no hay cupones desbloqueados en absoluto
  if (couponsData.length === 0) {
    grid.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  grid.style.display = 'grid';
  emptyState.style.display = 'none';
  grid.innerHTML = '';

  visibleCoupons.forEach((coupon) => {
    const isRedeemed = statuses[coupon.cuponId] && statuses[coupon.cuponId].redeemed;
    const redeemedDate = isRedeemed ? statuses[coupon.cuponId].redeemedDate : null;

    const ticket = document.createElement('div');
    ticket.classList.add('coupon-ticket');
    ticket.setAttribute('id', `ticket-${coupon.cuponId}`);

    ticket.innerHTML = `
      <div class="ticket-top">
        <span class="ticket-id">${coupon.cuponId}</span>
        <span class="ticket-status-pill ${isRedeemed ? 'status-redeemed' : 'status-available'}">
          ${isRedeemed ? 'Canjeado' : 'Disponible'}
        </span>
      </div>

      <h3 class="ticket-title">${coupon.titulo}</h3>
      <p class="ticket-desc">${coupon.mensaje}</p>
      <span class="ticket-validity">✦ ${coupon.validez || 'Canjeable en cualquier momento'}</span>

      <div class="ticket-qr-section">
        <div class="ticket-qr-canvas-wrapper" id="qr-${coupon.cuponId}"></div>
        <span class="ticket-qr-label">Código Digital de Amor</span>
      </div>

      ${isRedeemed 
        ? `<div class="ticket-redeemed-stamp">CANJEADO ${redeemedDate || ''}</div>` 
        : ''
      }

      <div class="ticket-actions">
        <button class="btn-ticket-action btn-toggle-redeem" data-id="${coupon.cuponId}">
          ${isRedeemed ? '↩️ Restaurar' : '✅ Canjear'}
        </button>
        <button class="btn-ticket-action btn-download-ticket" data-id="${coupon.cuponId}">
          📥 Guardar (PNG)
        </button>
      </div>
    `;

    grid.appendChild(ticket);

    // Generar el código QR visual para este cupón
    const qrContainer = ticket.querySelector(`#qr-${coupon.cuponId}`);
    if (qrContainer && window.QRCode) {
      try {
        new QRCode(qrContainer, {
          text: `VALE-AMOR:${coupon.cuponId}`,
          width: 130,
          height: 130,
          colorDark: "#26060c",
          colorLight: "#ffffff"
        });
      } catch (qrErr) {
        console.warn("Aviso al generar QR:", qrErr);
      }
    }

    // Evento de Canjear
    const toggleBtn = ticket.querySelector('.btn-toggle-redeem');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        toggleCouponRedemption(coupon.cuponId);
      });
    }

    // Evento de Guardar en Fotos (PNG)
    const downloadBtn = ticket.querySelector('.btn-download-ticket');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        downloadCouponTicketAsImage(coupon, isRedeemed);
      });
    }
  });
}

/**
 * ==============================================================================
 * GENERADOR DE TICKET DIGITAL EN IMAGEN PNG (Alternativa Gratuita $0 MXN)
 * ==============================================================================
 */
function downloadCouponTicketAsImage(coupon, isRedeemed) {
  const width = 800;
  const height = 1100;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 1. Fondo degradado verde bosque y vino
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#101c17');
  grad.addColorStop(0.5, '#171e1b');
  grad.addColorStop(1, '#3b0a13');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. Borde exterior dorado festivo
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 10;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  // Borde interior punteado
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 2;
  ctx.setLineDash([12, 8]);
  ctx.strokeRect(45, 45, width - 90, height - 90);
  ctx.setLineDash([]);

  // 3. Encabezado y sello
  const recipient = (typeof CALENDAR_CONFIG !== 'undefined' && CALENDAR_CONFIG.couple) ? CALENDAR_CONFIG.couple.recipient : 'Mi Amor';
  const sender = (typeof CALENDAR_CONFIG !== 'undefined' && CALENDAR_CONFIG.couple) ? CALENDAR_CONFIG.couple.sender : 'Yo';

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fbe39d';
  ctx.font = 'bold 26px serif';
  ctx.fillText('🎄 CALENDARIO DE ADVIENTO • CUPÓN DE AMOR 🎄', width / 2, 95);

  ctx.fillStyle = '#ffffff';
  ctx.font = '20px sans-serif';
  ctx.fillText(`Para: ${recipient}  •  De: ${sender}`, width / 2, 135);

  // Línea divisoria dorada
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(80, 160);
  ctx.lineTo(width - 80, 160);
  ctx.stroke();

  // 4. Identificador del cupón
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 22px monospace';
  ctx.fillText(`ID: ${coupon.cuponId}`, width / 2, 210);

  // 5. Título del cupón
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px serif';
  wrapText(ctx, coupon.titulo, width / 2, 280, width - 160, 52);

  // 6. Mensaje / Descripción
  ctx.fillStyle = '#faf5eb';
  ctx.font = '26px sans-serif';
  wrapText(ctx, `"${coupon.mensaje}"`, width / 2, 430, width - 180, 40);

  // 7. Validez
  ctx.fillStyle = '#fbe39d';
  ctx.font = 'italic 22px sans-serif';
  ctx.fillText(`✦ ${coupon.validez || 'Canjeable en cualquier momento'} ✦`, width / 2, 600);

  // 8. Dibujar el código QR en el centro del ticket
  const qrCanvas = document.querySelector(`#qr-${coupon.cuponId} canvas`);
  if (qrCanvas) {
    const qrSize = 220;
    const qrX = (width - qrSize) / 2;
    const qrY = 660;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32);

    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    ctx.fillStyle = '#222222';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('CÓDIGO DIGITAL DE CANJE', width / 2, qrY + qrSize + 12);
  }

  // 9. Pie de página romántico
  ctx.fillStyle = '#d4af37';
  ctx.font = 'italic 24px serif';
  ctx.fillText('"Válido por sonrisas, abrazos y amor infinito"', width / 2, 980);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '18px sans-serif';
  ctx.fillText('Guardado desde tu Calendario de Adviento', width / 2, 1020);

  // 10. Si está canjeado, estampar el sello rojo "CANJEADO"
  if (isRedeemed) {
    ctx.save();
    ctx.translate(width / 2, 520);
    ctx.rotate(-22 * Math.PI / 180);
    ctx.strokeStyle = '#ff2a51';
    ctx.lineWidth = 10;
    ctx.strokeRect(-220, -50, 440, 100);
    ctx.fillStyle = 'rgba(255, 42, 81, 0.9)';
    ctx.font = 'bold 64px serif';
    ctx.fillText('CANJEADO', 0, 20);
    ctx.restore();
  }

  // 11. Descargar o Compartir en celular
  canvas.toBlob((blob) => {
    if (!blob) return;
    const fileName = `${coupon.cuponId}.png`;

    if (navigator.canShare && navigator.canShare({ files: [new File([blob], fileName, { type: 'image/png' })] })) {
      const file = new File([blob], fileName, { type: 'image/png' });
      navigator.share({
        title: coupon.titulo,
        text: `¡Mi cupón de amor: ${coupon.titulo}!`,
        files: [file]
      }).catch(() => {
        downloadBlobFallback(blob, fileName);
      });
    } else {
      downloadBlobFallback(blob, fileName);
    }
  }, 'image/png');
}

function downloadBlobFallback(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

// Exponer funciones globalmente
window.openWalletModal = openWalletModal;
window.closeWalletModal = closeWalletModal;
window.toggleCouponRedemption = toggleCouponRedemption;
window.downloadCouponTicketAsImage = downloadCouponTicketAsImage;

// ==============================================================================
// INICIALIZACIÓN DE LA WALLET
// ==============================================================================
function initWalletEvents() {
  const walletBtn = document.getElementById('walletBtnPreview');
  const closeBtn = document.getElementById('walletModalCloseBtn');
  const modal = document.getElementById('walletModal');
  const filterButtons = document.querySelectorAll('.wallet-filters .filter-btn');

  if (walletBtn) {
    walletBtn.removeEventListener('click', openWalletModal);
    walletBtn.addEventListener('click', openWalletModal);
  }

  if (closeBtn) {
    closeBtn.removeEventListener('click', closeWalletModal);
    closeBtn.addEventListener('click', closeWalletModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeWalletModal();
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter') || 'all';
      renderWalletCoupons(filter);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWalletEvents);
} else {
  initWalletEvents();
}
