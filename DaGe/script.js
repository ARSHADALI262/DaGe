window.addEventListener('DOMContentLoaded', () => {
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

  // Smooth show/hide
  const showItem = item => {
    item.style.display = "block";
    setTimeout(() => (item.style.opacity = 1), 100);
  };
  const hideItem = item => {
    item.style.opacity = 0;
    setTimeout(() => (item.style.display = "none"), 200);
  };

  // Show only first 9 items initially
  menuItems.forEach((item, i) => {
    if (i < 9) showItem(item);
    else hideItem(item);
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
