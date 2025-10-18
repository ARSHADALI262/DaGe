window.addEventListener('DOMContentLoaded', () => {
  // Optimize scroll performance
  let ticking = false;
  let lastScrollY = window.scrollY;
  
  function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        // Check if scrolling up
        if (lastScrollY < 100) {
          document.querySelector('header')?.classList.remove('header-hidden');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Lazy load images
  const lazyImages = document.querySelectorAll('img[src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in';
        const tempImage = new Image();
        tempImage.onload = () => {
          img.src = tempImage.src;
          img.style.opacity = '1';
        };
        tempImage.src = img.getAttribute('src');
        observer.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));
  // === Theme and Navigation ===
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle?.querySelector('i');
  const body = document.body;

  // Toggle between light and dark mode
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      themeIcon?.classList.toggle('fa-moon');
      themeIcon?.classList.toggle('fa-sun');
      // Save preference to localStorage
      const isDarkMode = body.classList.contains('dark-mode');
      localStorage.setItem('darkMode', isDarkMode);
    });
    
    // Check for saved user preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
      body.classList.add('dark-mode');
      themeIcon?.classList.remove('fa-moon');
      themeIcon?.classList.add('fa-sun');
    }
  }

  // === Navigation Menu Toggle ===
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    document.querySelectorAll('.nav-links a').forEach(link =>
      link.addEventListener('click', () => navLinks.classList.remove('active'))
    );
  }

  // === Reservation Form ===
  const reservationForm = document.getElementById('reservationForm');
  if (reservationForm) {
    reservationForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('Thank you for your reservation! We will confirm your booking shortly.');
      e.target.reset();
    });
  }

  // === Set Minimum Date for Reservations ===
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // === Menu Filter System ===
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');
  const menuGrid = document.querySelector('.menu-grid');
  
  // Create a debounce function to limit filter operations
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Enhanced show/hide with better performance
  const visibleItems = new Set();
  
  const showItem = item => {
    if (!visibleItems.has(item)) {
      visibleItems.add(item);
      requestAnimationFrame(() => {
        item.style.display = "block";
        requestAnimationFrame(() => {
          item.style.opacity = 1;
          item.style.transform = "translateY(0)";
        });
      });
    }
  };
  
  const hideItem = item => {
    if (visibleItems.has(item)) {
      visibleItems.delete(item);
      item.style.opacity = 0;
      item.style.transform = "translateY(20px)";
      setTimeout(() => {
        if (!visibleItems.has(item)) {
          item.style.display = "none";
        }
      }, 300);
    }
  };

  // Show all items initially in the "all" category
  menuItems.forEach((item) => {
    const img = item.querySelector('img');
    if (img && !img.getAttribute('src').includes('basket-for-artisan-bakery.jpg')) {
      showItem(item);
    } else {
      hideItem(item);
    }
  });

  // === Filtering System ===
  filterButtons.forEach(button => {
    button.addEventListener('click', e => {
      const filter = e.target.getAttribute('data-filter');

      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');

      menuItems.forEach((item, i) => {
        const category = item.getAttribute('data-category').trim();
        const img = item.querySelector('img');

        if (filter === 'all') {
          // Show first 9 items
          if (i < 9) {
            showItem(item);
            if (img) img.style.display = "block"; // Show images normally
          } else hideItem(item);
        } else if (category === filter) {
          showItem(item);
          // ✅ Hide images only for Skewers
          if (filter === 'skewers' && img) {
            img.style.display = "none";
          } else if (img) {
            img.style.display = "block";
          }
        } else {
          hideItem(item);
        }
      });
    });
  });

  // Default active "All"
  document.querySelector('.filter-btn[data-filter="all"]')?.classList.add('active');
});
