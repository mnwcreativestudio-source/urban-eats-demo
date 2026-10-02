/**
 * Urban Eats - Luxury Modern Indian Restaurant
 * Core JavaScript Engine & Interactive Components
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initReservationSystem();
  initPrivateDiningSystem();
  initContactForm();
  initMenuTabsAndFilters();
  initLightboxGallery();
  initAccordions();
  initCookieBanner();
  initStickyCategoryNav();
  initUniversalModals();
  setMinReservationDates();
  initDemoActions();
});

/* ==========================================
   1. STICKY HEADER & SCROLL BEHAVIOR
   ========================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================
   2. MOBILE NAVIGATION DRAWER
   ========================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  if (!toggleBtn || !mobileNav || !backdrop) return;

  const openNav = () => {
    toggleBtn.classList.add('open');
    mobileNav.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
  };

  const closeNav = () => {
    toggleBtn.classList.remove('open');
    mobileNav.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open');
    if (isOpen) closeNav();
    else openNav();
  });

  backdrop.addEventListener('click', closeNav);

  const navLinks = mobileNav.querySelectorAll('.mobile-nav-link, .btn');
  navLinks.forEach(link => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeNav();
    }
  });
}

/* ==========================================
   3. RESERVATION SYSTEM & VALIDATION
   ========================================== */
function setMinReservationDates() {
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split('T')[0];
  dateInputs.forEach(input => {
    input.setAttribute('min', today);
    if (!input.value) {
      input.value = today;
    }
  });
}

function initReservationSystem() {
  const forms = document.querySelectorAll('.reservation-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleReservationSubmit(form);
    });
  });
}

function handleReservationSubmit(form) {
  let isValid = true;
  const nameInput = form.querySelector('[name="name"]');
  const phoneInput = form.querySelector('[name="phone"]');
  const emailInput = form.querySelector('[name="email"]');
  const dateInput = form.querySelector('[name="date"]');
  const timeInput = form.querySelector('[name="time"]');
  const guestsInput = form.querySelector('[name="guests"]');
  const occasionInput = form.querySelector('[name="occasion"]');
  const requestsInput = form.querySelector('[name="requests"]');

  // Reset errors
  form.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));

  // Validate Name
  if (!nameInput || nameInput.value.trim().length < 2) {
    markError(nameInput, 'Please enter your full name (at least 2 characters)');
    isValid = false;
  }

  // Validate Phone (permissive for demo formats like +00 000 000 0000)
  const cleanPhone = phoneInput ? phoneInput.value.replace(/[\s\-\(\)\+]/g, '') : '';
  if (!phoneInput || cleanPhone.length < 5) {
    markError(phoneInput, 'Please enter a contact number');
    isValid = false;
  }

  // Validate Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
    markError(emailInput, 'Please enter a valid email address');
    isValid = false;
  }

  // Validate Date
  if (!dateInput || !dateInput.value) {
    markError(dateInput, 'Please select a date for your visit');
    isValid = false;
  } else {
    const selectedDate = new Date(dateInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      markError(dateInput, 'Reservation date cannot be in the past');
      isValid = false;
    }
  }

  // Validate Time
  if (!timeInput || !timeInput.value) {
    markError(timeInput, 'Please choose a dining time slot');
    isValid = false;
  }

  if (!isValid) {
    showToast('Please correct the highlighted fields.', 'error');
    return;
  }

  // Loading State
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spin-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      Securing Table...
    `;
  }

  // Simulate server confirmation (portfolio demo simulation)
  setTimeout(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }

    const referenceId = 'UE-DEMO-' + Math.floor(10000 + Math.random() * 90000);
    const reservationData = {
      id: referenceId,
      name: nameInput ? nameInput.value.trim() : 'Guest',
      phone: phoneInput ? phoneInput.value.trim() : '',
      email: emailInput ? emailInput.value.trim() : '',
      date: dateInput ? dateInput.value : '',
      time: timeInput ? timeInput.value : '',
      guests: guestsInput ? guestsInput.value : '2 Guests',
      occasion: occasionInput ? occasionInput.value : 'Dining',
      requests: requestsInput && requestsInput.value ? requestsInput.value : 'None'
    };

    displayReservationSuccess(form, reservationData);
    showToast(`Demo Reservation ${referenceId} simulated!`, 'success');
  }, 950);
}

function displayReservationSuccess(form, data) {
  const container = form.closest('.form-card') || form.parentElement;
  const successCard = container.querySelector('.reservation-success-card');

  if (successCard) {
    // Populate receipt details
    const refEl = successCard.querySelector('.receipt-ref');
    const nameEl = successCard.querySelector('.receipt-name');
    const datetimeEl = successCard.querySelector('.receipt-datetime');
    const guestsEl = successCard.querySelector('.receipt-guests');
    const occasionEl = successCard.querySelector('.receipt-occasion');

    if (refEl) refEl.textContent = data.id;
    if (nameEl) nameEl.textContent = data.name;
    if (datetimeEl) datetimeEl.textContent = `${formatDisplayDate(data.date)} at ${data.time}`;
    if (guestsEl) guestsEl.textContent = data.guests;
    if (occasionEl) occasionEl.textContent = data.occasion;

    form.style.display = 'none';
    successCard.style.display = 'block';

    // WhatsApp Action: Disabled for portfolio safety
    const waBtn = successCard.querySelector('.btn-whatsapp-confirm');
    if (waBtn) {
      waBtn.href = 'javascript:void(0);';
      waBtn.onclick = (e) => {
        e.preventDefault();
        showToast('Demo Mode: External WhatsApp link disabled for portfolio showcase.', 'info');
      };
    }

    // Reset button inside success card
    const newBookingBtn = successCard.querySelector('.btn-new-booking');
    if (newBookingBtn) {
      newBookingBtn.addEventListener('click', () => {
        form.reset();
        setMinReservationDates();
        successCard.style.display = 'none';
        form.style.display = 'block';
      });
    }
  } else {
    // Simple inline notice
    form.reset();
    showToast(`Demo Table request received! Reference: ${data.id}`, 'success');
  }
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function markError(inputEl, message) {
  if (!inputEl) return;
  const group = inputEl.closest('.form-group');
  if (group) {
    group.classList.add('error');
    let errorEl = group.querySelector('.form-error-msg');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'form-error-msg';
      group.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }
}

/* ==========================================
   4. PRIVATE DINING ENQUIRY SYSTEM
   ========================================== */
function initPrivateDiningSystem() {
  const form = document.querySelector('.private-dining-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]');
    const phone = form.querySelector('[name="phone"]');
    const guests = form.querySelector('[name="guests"]');
    const date = form.querySelector('[name="date"]');

    if (!name || !name.value.trim()) {
      showToast('Please enter your contact name.', 'error');
      return;
    }
    if (!phone || phone.value.trim().length < 10) {
      showToast('Please enter a valid phone number.', 'error');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Submitting Enquiry...';
    }

    setTimeout(() => {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Enquiry Sent';
      }
      form.reset();
      showToast('Private dining enquiry received. Our events sommelier will contact you within 2 business hours.', 'success');
      
      const successBox = document.querySelector('.private-success-state');
      if (successBox) {
        form.style.display = 'none';
        successBox.style.display = 'block';
      }
    }, 800);
  });
}

/* ==========================================
   5. CONTACT FORM
   ========================================== */
function initContactForm() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('[name="name"]');
    const email = contactForm.querySelector('[name="email"]');
    const message = contactForm.querySelector('[name="message"]');

    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
      contactForm.reset();
      showToast('Thank you for contacting Urban Eats. We will respond promptly!', 'success');
      
      const contactSuccess = document.querySelector('.contact-success-state');
      if (contactSuccess) {
        contactForm.style.display = 'none';
        contactSuccess.style.display = 'block';
      }
    }, 750);
  });
}

/* ==========================================
   6. MENU TABS & FILTERING
   ========================================== */
function initMenuTabsAndFilters() {
  // Homepage Tab Selector
  const tabBtns = document.querySelectorAll('.menu-tab-btn');
  const tabContents = document.querySelectorAll('.menu-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const activeContent = document.getElementById(targetTab);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });
  });

  // Dedicated Menu Page Dietary Filter & Search
  const filterBtns = document.querySelectorAll('.dietary-filter-btn');
  const searchInput = document.querySelector('.menu-search-input');
  const allMenuItems = document.querySelectorAll('.full-menu-item');

  function applyMenuFilters() {
    const activeFilterBtn = document.querySelector('.dietary-filter-btn.active');
    const filter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    let visibleCount = 0;

    allMenuItems.forEach(item => {
      const itemTags = (item.getAttribute('data-tags') || '').toLowerCase();
      const itemName = (item.querySelector('.item-title')?.textContent || '').toLowerCase();
      const itemDesc = (item.querySelector('.item-desc')?.textContent || '').toLowerCase();

      const matchesFilter = (filter === 'all') || itemTags.includes(filter);
      const matchesSearch = query === '' || itemName.includes(query) || itemDesc.includes(query);

      if (matchesFilter && matchesSearch) {
        item.style.display = '';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    const emptyState = document.querySelector('.menu-empty-state');
    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyMenuFilters();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyMenuFilters);
  }
}

/* ==========================================
   7. MASONRY GALLERY & LIGHTBOX MODAL
   ========================================== */
function initLightboxGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox-modal');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxTitle = lightbox.querySelector('.lightbox-caption-title');
  const lightboxCounter = lightbox.querySelector('.lightbox-caption-counter');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  let currentIndex = 0;
  const itemsArray = Array.from(galleryItems);

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = itemsArray[currentIndex];
    if (!item) return;

    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-title');
    const category = item.querySelector('.gallery-category');

    if (img && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'Gallery photo';
    }
    if (lightboxTitle) {
      lightboxTitle.textContent = title ? title.textContent : 'Urban Eats Gallery';
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} of ${itemsArray.length}${category ? ' • ' + category.textContent : ''}`;
    }
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % itemsArray.length;
    updateLightboxContent();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + itemsArray.length) % itemsArray.length;
    updateLightboxContent();
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/* ==========================================
   8. ACCESSIBLE ACCORDIONS (FAQ)
   ========================================== */
function initAccordions() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (!accordionItems.length) return;

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');

    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other accordions for clean accordion style
      accordionItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.accordion-trigger');
          const otherPanel = otherItem.querySelector('.accordion-panel');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.style.maxHeight = null;
        }
      });

      if (isExpanded) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================
   9. STICKY CATEGORY NAV (MENU PAGE)
   ========================================== */
function initStickyCategoryNav() {
  const catNav = document.querySelector('.sticky-cat-nav');
  if (!catNav) return;

  const catButtons = catNav.querySelectorAll('.cat-nav-btn');
  const sections = document.querySelectorAll('.menu-category-section');

  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        catButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 160;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    if (current) {
      catButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-target') === current) {
          btn.classList.add('active');
          btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      });
    }
  }, { passive: true });
}

/* ==========================================
   10. UNIVERSAL MODALS
   ========================================== */
function initUniversalModals() {
  const openButtons = document.querySelectorAll('[data-open-modal]');
  const closeButtons = document.querySelectorAll('.modal-close-btn');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalType = btn.getAttribute('data-open-modal');
      const modal = document.querySelector(`.modal-backdrop[data-modal="${modalType}"]`);
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(modal => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  });
}

/* ==========================================
   11. COOKIE BANNER
   ========================================== */
function initCookieBanner() {
  const banner = document.querySelector('.cookie-banner');
  if (!banner) return;

  const cookiePref = localStorage.getItem('urban_eats_cookie_consent');
  if (!cookiePref) {
    setTimeout(() => {
      banner.classList.add('show');
    }, 1200);
  }

  const acceptBtn = banner.querySelector('.btn-accept-cookies');
  const declineBtn = banner.querySelector('.btn-decline-cookies');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('urban_eats_cookie_consent', 'accepted');
      banner.classList.remove('show');
      showToast('Cookie preferences updated.', 'info');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('urban_eats_cookie_consent', 'essential_only');
      banner.classList.remove('show');
      showToast('Essential cookies only enabled.', 'info');
    });
  }
}

/* ==========================================
   12. TOAST NOTIFICATION SYSTEM
   ========================================== */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconSvg = type === 'success' 
    ? `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
    : type === 'error'
    ? `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
    : `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 400);
  }, 4200);
}

/* ==========================================
   13. PORTFOLIO DEMO ACTION INTERCEPTOR
   ========================================== */
function initDemoActions() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button');
    if (!target) return;

    // Check if target is marked as demo-action or has disabled demo href
    const href = target.getAttribute('href');
    if (
      target.classList.contains('demo-action-btn') ||
      (href && (href === 'javascript:void(0)' || href === 'javascript:void(0);' || href === '#demo-action'))
    ) {
      e.preventDefault();
      const label = target.textContent.trim() || 'This button';
      showToast(`Demo Showcase: External action for "${label}" is disabled for portfolio safety.`, 'info');
    }
  });
}

