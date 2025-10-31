const carousel = document.getElementById('carousel');
let position = 0;
let speed = 0.5;
let isDragging = false;
let startX = 0;
let startPosition = 0;

function moveCarousel() {
    if (!isDragging) {
        position -= speed;

        // Reset position when a card width is reached
        if (position < -320) {
            position = 0;
            // Move first card to end
            carousel.appendChild(carousel.firstElementChild);
        }
    }

    // Apply the transform with a slight curve effect
    carousel.style.transform = `rotate(-5deg) translateX(${position}px)`;
    requestAnimationFrame(moveCarousel);
}

// Initialize carousel
moveCarousel();

// Mouse events
carousel.addEventListener('mouseenter', () => {
    if (!isDragging) speed = 0;
});
carousel.addEventListener('mouseleave', () => {
    if (!isDragging) speed = 0.5;
});

// Mouse drag events
carousel.addEventListener('mousedown', handleStart);
document.addEventListener('mousemove', handleMove);
document.addEventListener('mouseup', handleEnd);

// Touch events for mobile
carousel.addEventListener('touchstart', handleStart, { passive: false });
document.addEventListener('touchmove', handleMove, { passive: false });
document.addEventListener('touchend', handleEnd);

function handleStart(e) {
    e.preventDefault();
    isDragging = true;
    speed = 0;
    startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    startPosition = position;
    carousel.style.cursor = 'grabbing';
    carousel.style.userSelect = 'none';
}

function handleMove(e) {
    if (!isDragging) return;

    e.preventDefault();
    const currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const deltaX = currentX - startX;

    // Smooth movement with momentum
    position = startPosition + deltaX * 0.8;

    // Boundary limits
    if (position > 100) position = 100;
    if (position < -420) position = -420;
}

function handleEnd(e) {
    if (!isDragging) return;

    isDragging = false;
    carousel.style.cursor = 'grab';
    carousel.style.userSelect = '';

    // Resume auto-scroll after a short delay
    setTimeout(() => {
        if (!isDragging) speed = 0.5;
    }, 1000);
}