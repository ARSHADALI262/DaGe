window.addEventListener('DOMContentLoaded', () => {
  // Optimize scroll performance
  let ticking = false;
  let lastScrollY = window.scrollY;
  
  function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
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

  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle?.querySelector('i');
  const body = document.body;

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      themeIcon?.classList.toggle('fa-moon');
      themeIcon?.classList.toggle('fa-sun');
      localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    });
    
    if (localStorage.getItem('darkMode') === 'true') {
      body.classList.add('dark-mode');
      themeIcon?.classList.remove('fa-moon');
      themeIcon?.classList.add('fa-sun');
    }
  }

  // Navigation Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    document.querySelectorAll('.nav-links a').forEach(link =>
      link.addEventListener('click', () => navLinks.classList.remove('active'))
    );
  }

  // Reservation Form
  const reservationForm = document.getElementById('reservationForm');
  if (reservationForm) {
    reservationForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('Thank you for your reservation! We will confirm your booking shortly.');
      e.target.reset();
    });
  }

  // Set Minimum Date for Reservations
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // === Menu Filter System ===
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  // Initialize items styles
  menuItems.forEach(item => {
    item.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
    item.style.opacity = '0';
    item.style.display = 'none';
  });

  // Define allowed item names for each category
  const categoryItems = {
    'all': [
      'Mandi', 'Al-Faham', 'Shawarma', 'Grilled Chicken',
      'Mexican Shawarma', 'Special Mandi', 'BBQ Chicken',
      'Tandoori Chicken', 'Special Al-Faham'
    ],
    'mandi': ['Mandi', 'Special Mandi'],
    'shawarma': ['Shawarma', 'Mexican Shawarma'],
    'al-faham': ['Al-Faham', 'Special Al-Faham'],
    'grills': ['BBQ Chicken', 'Grilled Chicken', 'Tandoori Chicken'],
    'skewers': ['Chicken Skewer', 'Mutton Skewer', 'Mixed Skewer']
  };

  // Handle filter click
  const handleFilter = (filter) => {
    // Hide all items first
    menuItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      setTimeout(() => {
        item.style.display = 'none';
      }, 300);
    });

    setTimeout(() => {
      const allowedItems = categoryItems[filter] || [];

      // Show filtered items
      let shown = 0;
      menuItems.forEach((item, index) => {
        const itemName = item.querySelector('.menu-item-text h3')?.textContent?.trim();
        const category = item.getAttribute('data-category').trim();
        
        // Show item if it's in the allowed list for this category
        if (allowedItems.includes(itemName)) {
          const delay = shown * 100;
          item.style.display = 'block';
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
            
            const img = item.querySelector('img');
            const imgContainer = item.querySelector('.menu-item-img');
            
            if (filter === 'skewers' || category === 'skewers') {
              // Hide images for skewers
              if (img) {
                img.style.display = 'none';
                img.style.visibility = 'hidden';
              }
              if (imgContainer) {
                imgContainer.style.display = 'none';
                imgContainer.style.height = '0';
                imgContainer.style.padding = '0';
                imgContainer.style.margin = '0';
              }
              // Adjust text layout
              const textContainer = item.querySelector('.menu-item-text');
              if (textContainer) {
                textContainer.style.width = '100%';
                textContainer.style.padding = '1rem';
              }
            } else {
              // Show images for other categories
              if (img) {
                img.style.display = 'block';
                img.style.visibility = 'visible';
                img.style.opacity = '1';
                img.style.height = 'auto';
                img.style.width = '100%';
              }
              if (imgContainer) {
                imgContainer.style.display = 'block';
                imgContainer.style.height = '200px';
              }
            }
          }, delay);
          shown++;
        }
      });

      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      document.querySelector(`.filter-btn[data-filter="${filter}"]`)?.classList.add('active');
    }, 300);
  };

  // Attach filter click handlers
  filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const filter = e.target.getAttribute('data-filter');
      handleFilter(filter);
    });
  });

  // Initialize with 'all' filter
  handleFilter('all');
});