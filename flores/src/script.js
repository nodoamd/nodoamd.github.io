console.clear();

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// ========================================
// LOADER DE FLORES - ORIGINAL
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
    this._numberOfLeaves = 7;
    this._rotation = 360 / this._numberOfLeaves;
    this._path = [
      { x: 15, y: 0 },
      { x: 16, y: -1 },
      { x: 17, y: 0 },
      { x: 16, y: 1 },
      { x: 15, y: 0 }
    ];
    this._location = { x: this._path[0].x, y: this._path[0].y };

    this._tn1 = gsap.to(this._location, {
      duration: this._numberOfLeaves,
      bezier: {
        curviness: 1.5,
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
        x: this._location.x - 11,
        y: this._location.y - 37,
        rotation: (this._rotation * i) - 90
      });

      this._flowerLeaves.appendChild(leafElement);
    }

    this._animate();
  };

  FlowerLoader.prototype._animate = function () {
    var leaves = this._flowerLeaves.querySelectorAll(Selector.LEAF_INNER);
    var center = this._element.querySelector(Selector.CENTER);
    var self = this;

    var timeline = gsap.timeline({
      onComplete: function () {
        // Solo 2 ciclos
        if (!timeline.userData || timeline.userData.cycles < 1) {
          timeline.userData = { cycles: (timeline.userData?.cycles || 0) + 1 };
          timeline.restart(true);
        } else {
          // Ocultar loader después de 2 ciclos
          gsap.to("#loader-wrapper", {
            opacity: 0,
            duration: 0.5,
            onComplete: function () {
              document.getElementById("loader-wrapper").style.display = "none";
              animateHeroEntrance();
            }
          });
        }
      }
    });

    timeline
      .add(
        gsap.fromTo(center, {
          scale: 0
        }, {
          scale: 1,
          duration: 1,
          ease: "elastic.out(1.1, 0.75)"
        }), 0
      )
      .add(
        gsap.to(leaves, {
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "elastic.out(1.1, 0.75)"
        }), 0.3
      )
      .add(
        gsap.to(leaves, {
          scale: 1.25,
          duration: 0.3,
          ease: "elastic.out(1.5, 1)"
        })
      )
      .add(
        gsap.to(this._element.querySelector(Selector.LEAVES), {
          rotation: 360,
          duration: 1,
          ease: "expo.inOut"
        }), 1.7
      )
      .add(
        gsap.to(leaves, {
          scale: 0,
          duration: 0.5,
          ease: "elastic.inOut(1.1, 0.75)"
        })
      )
      .add(
        gsap.to(center, {
          scale: 0,
          duration: 0.5,
          ease: "elastic.inOut(1.1, 0.75)"
        }), '-=0.37'
      );
  };

  return new FlowerLoader(document.querySelector('.flower'));
})();

// ========================================
// SMOOTH SCROLL SETUP
// ========================================
let smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 1.5,
  smoothTouch: 0.1,
  normalizeScroll: true,
  ignoreMobileResize: true
});

// ========================================
// HERO ENTRANCE ANIMATION
// ========================================
gsap.set(".expand-on-scroll", { opacity: 0 });
gsap.set(".shop-letter", { opacity: 0, y: 30 });
gsap.set(".button", { opacity: 0, y: 20 });

function animateHeroEntrance() {
  const tl = gsap.timeline();

  tl.to(".expand-on-scroll", {
    opacity: 1,
    duration: 1.2,
    ease: "power2.out"
  })
    .to(".shop-letter", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.03,
      ease: "back.out(1.7)"
    }, "-=0.6")
    .to(".button", {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.3");
}

// ========================================
// ANIMACIONES DE ENTRADA POR SCROLL
// ========================================

// Intro Section
gsap.set(".intro-section .spacer-content", { opacity: 0, y: 50 });
gsap.to(".intro-section .spacer-content", {
  scrollTrigger: {
    trigger: ".intro-section",
    start: "top center",
    end: "center center",
    scrub: 1
  },
  opacity: 1,
  y: 0,
  ease: "power2.out"
});

// Services Cards
gsap.set(".service-card", { opacity: 0, y: 50 });
gsap.utils.toArray(".service-card").forEach((card, index) => {
  gsap.to(card, {
    scrollTrigger: {
      trigger: card,
      start: "top 80%",
      end: "top 40%",
      scrub: 1
    },
    opacity: 1,
    y: 0,
    ease: "power2.out",
    delay: index * 0.1
  });
});

// Benefits Section
gsap.set(".benefits-section h2", { opacity: 0, y: 40 });
gsap.to(".benefits-section h2", {
  scrollTrigger: {
    trigger: ".benefits-section",
    start: "top center",
    end: "center center",
    scrub: 1
  },
  opacity: 1,
  y: 0,
  ease: "power2.out"
});

gsap.set(".benefit-card", { opacity: 0, y: 40 });
gsap.utils.toArray(".benefit-card").forEach((card, index) => {
  gsap.to(card, {
    scrollTrigger: {
      trigger: card,
      start: "top 80%",
      end: "top 40%",
      scrub: 1
    },
    opacity: 1,
    y: 0,
    ease: "power2.out",
    delay: index * 0.08
  });
});

// Newsletter Section
gsap.set(".newsletter-section .newsletter-content", { opacity: 0, y: 50 });
gsap.to(".newsletter-section .newsletter-content", {
  scrollTrigger: {
    trigger: ".newsletter-section",
    start: "top center",
    end: "center center",
    scrub: 1
  },
  opacity: 1,
  y: 0,
  ease: "power2.out"
});

// Footer
gsap.set(".footer-section", { opacity: 0 });
gsap.to(".footer-section", {
  scrollTrigger: {
    trigger: ".footer-section",
    start: "top center",
    end: "center center",
    scrub: 1
  },
  opacity: 1,
  ease: "power2.out"
});

// ========================================
// INTERACTIVIDAD
// ========================================

// Botones de servicios
document.querySelectorAll(".book-service").forEach((btn) => {
  btn.addEventListener("click", function () {
    gsap.to(this, {
      scale: 0.95,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "back.out"
    });
  });
});

// Newsletter form
const newsletterForm = document.querySelector(".newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = this.querySelector("input[type='email']").value;
    const btn = this.querySelector("button");

    gsap.to(btn, {
      scale: 0.95,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "back.out"
    });

    alert(`¡Gracias! Te hemos registrado con ${email}`);
    this.reset();
  });
}

// Refresh on resize
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});