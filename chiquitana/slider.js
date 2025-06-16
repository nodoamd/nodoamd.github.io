class Slider {
    constructor() {
        this.slider = document.querySelector('.slider');
        this.dots = document.querySelectorAll('.slider-dot');
        this.currentIndex = 0;
        this.autoplayInterval = 5000; // 5 segundos entre slides

        this.init();
    }

    init() {
        this.dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index);
                this.goToSlide(index);
            });
        });

        // Iniciar autoplay
        this.startAutoplay();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.slider.style.transform = `translateX(-${index * 100}%)`;
        
        // Actualizar dots
        this.dots.forEach(dot => dot.classList.remove('active'));
        this.dots[index].classList.add('active');
    }

    startAutoplay() {
        setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.dots.length;
            this.goToSlide(this.currentIndex);
        }, this.autoplayInterval);
    }
}

// Inicializar el slider cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Slider();
});
