
/* =========================================================
   إشارات الجسد | Bio-OS
   JavaScript خفيف للملاحة، القوائم، وسنة التذييل
   ========================================================= */
(function () {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navMenu = document.querySelector('[data-nav-menu]');
  const dropdownToggle = document.querySelector('[data-dropdown-toggle]');
  const dropdown = document.querySelector('.dropdown');
  const yearNode = document.querySelector('[data-year]');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  if (yearNode) yearNode.textContent = new Date().getFullYear();

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('open');
    });
  }

  if (dropdownToggle && dropdown) {
    dropdownToggle.addEventListener('click', function () {
      const expanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
      dropdownToggle.setAttribute('aria-expanded', String(!expanded));
      dropdown.classList.toggle('open');
    });

    document.addEventListener('click', function (event) {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.querySelectorAll('[data-nav-link]').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPath) link.classList.add('active');
  });

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      alert('تم منع الإرسال الفعلي في النسخة الثابتة. اربط النموذج بخدمة بريد أو Form endpoint مناسب مع الحفاظ على نفس التحفظات التحريرية.');
    });
  }
})();
