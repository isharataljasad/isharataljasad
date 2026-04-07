document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const overlay = document.querySelector('.mobile-overlay');

  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      mainNav.classList.toggle('open');
      if (overlay) overlay.classList.toggle('open');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', function() {
      mainNav.classList.remove('open');
      overlay.classList.remove('open');
    });
  }

  // Dropdown toggle
  document.querySelectorAll('.nav-dropdown-toggle').forEach(function(toggle) {
    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      const parent = this.closest('.nav-dropdown');
      parent.classList.toggle('open');
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', function() {
    document.querySelectorAll('.nav-dropdown').forEach(function(d) {
      d.classList.remove('open');
    });
  });

  // Accordion
  document.querySelectorAll('.accordion-header').forEach(function(header) {
    header.addEventListener('click', function() {
      const item = this.closest('.accordion-item');
      const body = item.querySelector('.accordion-body');
      const inner = body.querySelector('.accordion-body-inner');

      if (item.classList.contains('open')) {
        body.style.maxHeight = '0';
        item.classList.remove('open');
      } else {
        // Close others
        document.querySelectorAll('.accordion-item.open').forEach(function(other) {
          other.querySelector('.accordion-body').style.maxHeight = '0';
          other.classList.remove('open');
        });
        body.style.maxHeight = inner.scrollHeight + 'px';
        item.classList.add('open');
      }
    });
  });

  // Mark active nav link
  const currentPath = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  document.querySelectorAll('.main-nav a, .nav-dropdown-menu a').forEach(function(link) {
    const href = link.getAttribute('href');
    if (href && (currentPath === href || currentPath === href.replace('.html', '') || currentPath.endsWith(href))) {
      link.classList.add('active');
    }
  });
});
