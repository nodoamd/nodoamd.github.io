console.clear();

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// ========================================
// PREMIUM COMB TRANSITION SYSTEM
// ========================================
class CombTransition {
  constructor () {
    this.overlay = document.getElementById('comb-transition');
    this.isActive = false;
    this.init();
  }

  init() {
    // Setup comb transition triggers
    document.querySelectorAll('.comb-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const target = trigger.dataset.target;
        this.transition(target);
      });
    });
  }

  transition(targetSection) {
    if (this.isActive) return;

    this.isActive = true;
    this.overlay.classList.add('active');

    // Animate comb teeth falling
    gsap.to('.tooth', {
      transform: 'translateY(0)',
      duration: 0.8,
      stagger: 0.05,
      ease: "back.out(1.7)"
    });

    // Animate transition text
    gsap.to('.transition-letter', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.5,
      ease: "power2.out"
    });

    // Close combs and navigate
    setTimeout(() => {
      gsap.to('.comb-left', {
        x: -10,
        rotation: -5,
        duration: 1.2,
        ease: "power3.out"
      });

      gsap.to('.comb-right', {
        x: 10,
        rotation: 5,
        duration: 1.2,
        ease: "power3.out"
      });

      setTimeout(() => {
        this.navigateToSection(targetSection);
      }, 800);
    }, 1500);
  }

  navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      smoother.scrollTo(section, true, "top 100px");
    }

    // Hide overlay
    setTimeout(() => {
      this.overlay.classList.remove('active');
      this.isActive = false;

      // Reset positions
      gsap.set('.comb-left', { x: -200, rotation: -15 });
      gsap.set('.comb-right', { x: 200, rotation: 15 });
      gsap.set('.tooth', { transform: 'translateY(20px)' });
      gsap.set('.transition-letter', { opacity: 0, y: 20 });
    }, 600);
  }
}

// ========================================
// PREMIUM CURSOR SYSTEM
// ========================================
class PremiumCursor {
  constructor () {
    this.cursor = document.querySelector('.mouse-follower');
    this.init();
  }

  init() {
    if (!this.cursor) return;

    document.addEventListener('mousemove', (e) => {
      gsap.to(this.cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out"
      });
    });

    // Hover effects
    document.querySelectorAll('a, button, .service-card, .benefit-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(this.cursor, {
          scale: 3,
          backgroundColor: 'rgba(46, 125, 50, 0.3)',
          duration: 0.3,
          ease: "power2.out"
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(this.cursor, {
          scale: 1,
          backgroundColor: '#2e7d32',
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });
  }
}

// ========================================
// FLOWER LOADER PREMIUM
// ========================================
var FlowerLoader = (function () {
  var LEAF_SVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 23.7 51.8" style="enable-background:new 0 0 23.7 51.8;" xml:space="preserve"><path d="M11.8,0c0,0-26.6,24.1,0,51.8C38.5,24.1,11.8,0,11.8,0z"/></svg>';

  var Selector = {
    CENTER: '.flower__center',
    LEAF: '.flower__leaf',
    LEAF_INNER: '.flower__leaf-inner',
    LEAVES: '.flower__leaves'
  };

  var ClassName = {
    CENTER: 'flower__center',
    LEAF: 'flower__leaf'
  };

  function FlowerLoader(element) {
    this._element = element;
    this._flowerLeaves = element.querySelector(Selector.LEAVES);
    this._numberOfLeaves = 8;
    this._rotation = 360 / this._numberOfLeaves;
    this._path = [
      { x: 18, y: 0 },
      { x: 20, y: -2 },
      { x: 22, y: 0 },
      { x: 20, y: 2 },
      { x: 18, y: 0 }
    ];
    this._location = { x: this._path[0].x, y: this._path[0].y };

    this._tn1 = gsap.to(this._location, {
      duration: this._numberOfLeaves,
      bezier: {
        curviness: 2,
        values: this._path
      },
      ease: "none"
    });

    this._initialize();
  }

  FlowerLoader.prototype._initialize = function () {
    this._addLeaves();
  };

  FlowerLoader.prototype._addLeaves = function () {
    for (var i = 0; i < this._numberOfLeaves; i++) {
      var leafElement = document.createElement('div');
      leafElement.className = ClassName.LEAF;
      leafElement.innerHTML = '<div class="flower__leaf-inner">' + LEAF_SVG + '</div>';
      this._tn1.time(i);

      gsap.set(leafElement, {
        x: this._location.x - 12,
        y: this._location.y - 40,
        rotation: (this._rotation * i) - 90
      });

      this._flowerLeaves.appendChild(leafElement);
    }

    this._animate();
  };

  FlowerLoader.prototype._animate = function () {
    var leaves = this._flowerLeaves.querySelectorAll(Selector.LEAF_INNER);
    var center = this._element.querySelector(Selector.CENTER);

    var timeline = gsap.timeline({
      onComplete: function () {
        if (!timeline.userData || timeline.userData.cycles < 1) {
          timeline.userData = { cycles: (timeline.userData?.cycles || 0) + 1 };
          timeline.restart(true);
        } else {
          gsap.to("#loader-wrapper", {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            onComplete: function () {
              document.getElementById("loader-wrapper").style.display = "none";
              initPremiumSite();
            }
          });
        }
      }
    });

    timeline
      .add(
        gsap.fromTo(center, {
          scale: 0,
          rotation: 0
        }, {
          scale: 1,
          rotation: 360,
          duration: 1.2,
          ease: "elastic.out(1, 0.6)"
        }), 0
      )
      .add(
        gsap.to(leaves, {
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: "elastic.out(1.2, 0.75)"
        }), 0.2
      )
      .add(
        gsap.to(leaves, {
          scale: 1.3,
          duration: 0.4,
          ease: "power2.out"
        })
      )
      .add(
        gsap.to(this._element.querySelector(Selector.LEAVES), {
          rotation: 360,
          duration: 1.2,
          ease: "power2.inOut"
        }), 1.5
      )
      .add(
        gsap.to(leaves, {
          scale: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "power2.in"
        })
      )
      .add(
        gsap.to(center, {
          scale: 0,
          duration: 0.6,
          ease: "power2.in"
        }), '-=0.3'
      );
  };

  return new FlowerLoader(document.querySelector('.flower'));
})();

// ========================================
// SMOOTH SCROLL PREMIUM
// ========================================
let smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 2,
  smoothTouch: 0.1,
  normalizeScroll: true,
  ignoreMobileResize: true,
  effects: true
});

// ========================================
// PREMIUM NAVIGATION
// ========================================
function initPremiumNavigation() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Advanced scroll effect
  let lastScrollY = 0;
  let ticking = false;

  function updateNavbar() {
    const scrollY = window.scrollY;

    if (scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide/show navbar on scroll
    if (scrollY > lastScrollY && scrollY > 200) {
      gsap.to(navbar, {
        y: -100,
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      gsap.to(navbar, {
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick);

  // Mobile menu with premium animations
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');

      if (navMenu.classList.contains('active')) {
        gsap.fromTo(navLinks,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
          }
        );
      }
    });
  }

  // Smooth scroll for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          smoother.scrollTo(target, true, "top 100px");
        }
      }

      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

// ========================================
// PREMIUM HERO ANIMATIONS
// ========================================
function initPremiumHero() {
  // Hero entrance sequence
  const heroTl = gsap.timeline({ delay: 0.5 });

  heroTl
    .to(".hero-badge", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    })
    .to(".line-inner", {
      y: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: "power3.out"
    }, "-=0.4")
    .to(".subtitle-line", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.6")
    .to(".hero-buttons .btn", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "back.out(1.7)"
    }, "-=0.4")
    .to(".main-image", {
      opacity: 1,
      scale: 1,
      rotation: 2,
      duration: 1.2,
      ease: "power2.out"
    }, "-=1");

  // Parallax effects
  gsap.to(".floating-elements .float-element", {
    y: -100,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    stagger: 0.3
  });

  // Image hover effect
  const imageContainer = document.querySelector('.image-container');
  if (imageContainer) {
    imageContainer.addEventListener('mouseenter', () => {
      gsap.to(imageContainer, {
        rotation: 0,
        scale: 1.02,
        duration: 0.6,
        ease: "power2.out"
      });
    });

    imageContainer.addEventListener('mouseleave', () => {
      gsap.to(imageContainer, {
        rotation: 2,
        scale: 1,
        duration: 0.6,
        ease: "power2.out"
      });
    });
  }
}

// ========================================
// PREMIUM SCROLL ANIMATIONS
// ========================================
function initPremiumScrollAnimations() {
  // Fade in elements
  gsap.utils.toArray('.service-card, .benefit-item, .stat-item').forEach((element, index) => {
    gsap.fromTo(element,
      {
        opacity: 0,
        y: 60,
        rotation: 2
      },
      {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Section titles animation
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.fromTo(title,
      {
        opacity: 0,
        y: 50
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: title,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
}

// ========================================
// PREMIUM INTERACTIONS
// ========================================
function initPremiumInteractions() {
  // Enhanced button hover effects
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  });

  // Service card interactions
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -10,
        rotationY: 5,
        duration: 0.4,
        ease: "power2.out"
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        rotationY: 0,
        duration: 0.4,
        ease: "power2.out"
      });
    });
  });

  // Form interactions
  const form = document.getElementById("reservationForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      // Enhanced submit animation
      gsap.to(this.querySelector("button"), {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });

      setTimeout(() => {
        alert(`¡Gracias ${data.name}! Tu cita ha sido reservada para el ${data.date} a las ${data.time}.`);
        this.reset();
      }, 300);
    });
  }
}

// ========================================
// PREMIUM SITE INITIALIZATION
// ========================================
function initPremiumSite() {
  // Initialize all premium systems
  new CombTransition();
  new PremiumCursor();

  initPremiumNavigation();
  initPremiumHero();
  initPremiumScrollAnimations();
  initPremiumInteractions();

  // Set initial states
  gsap.set(".hero-badge", { opacity: 0, y: 20 });
  gsap.set(".line-inner", { y: "100%" });
  gsap.set(".subtitle-line", { opacity: 0, y: 20 });
  gsap.set(".hero-buttons .btn", { opacity: 0, y: 30 });
  gsap.set(".main-image", { opacity: 0, scale: 0.9 });

  // Refresh ScrollTrigger
  ScrollTrigger.refresh();

  console.log('🎉 Premium site initialized with Awwwards-level animations!');
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('loader-wrapper')) {
    initPremiumSite();
  }
});

window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});