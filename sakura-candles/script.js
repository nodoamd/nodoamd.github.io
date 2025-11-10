// ========================================
// SAKURA CANDLES & SOAPS - JavaScript
// Premium interactions & functionality
// ========================================

// === PAGE LOADER - CANDLE EFFECT ===
window.addEventListener('load', () => {
    const loader = document.getElementById('pageLoader');

    // Duración total: 2.5 segundos de animación + transición
    setTimeout(() => {
        loader.style.transition = 'opacity 0.6s ease, visibility 0.6s ease';
        loader.classList.add('hidden');
    }, 2500);
});

// === NAVIGATION ===
const nav = document.querySelector('.nav');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileClose = document.querySelector('.mobile-close');
const mobileLinks = document.querySelectorAll('.mobile-link');

// Scroll effect on nav
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Mobile menu toggle
function openMobileMenu() {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
}

if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
}

// Close mobile menu when clicking links
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (href !== '#' && href.length > 1) {
            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const navHeight = nav.offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// === ADD TO CART (WhatsApp Integration) ===
let cart = [];

function addToCart(productName, price) {
    // Add product to cart
    const product = {
        name: productName,
        price: price,
        quantity: 1
    };

    // Check if product already in cart
    const existingProduct = cart.find(item => item.name === productName);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }

    // Show feedback
    showCartFeedback(productName);

    // Update cart display (if you have a cart icon)
    updateCartCount();
}

function showCartFeedback(productName) {
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'cart-feedback';
    feedback.innerHTML = `
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>${productName} añadido al carrito</span>
    `;

    // Add styles
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10B981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
    `;

    document.body.appendChild(feedback);

    // Remove after 3 seconds
    setTimeout(() => {
        feedback.remove();

        // After adding products, prompt to checkout
        if (cart.length > 0) {
            setTimeout(() => {
                showCheckoutPrompt();
            }, 500);
        }
    }, 3000);
}

function showCheckoutPrompt() {
    // Check if already shown
    if (document.querySelector('.checkout-prompt')) return;

    const prompt = document.createElement('div');
    prompt.className = 'checkout-prompt';
    prompt.innerHTML = `
        <div class="checkout-content">
            <h3>¿Listo para hacer tu pedido?</h3>
            <p>Tienes ${cart.length} producto(s) en tu carrito</p>
            <div class="checkout-actions">
                <button onclick="sendWhatsAppOrder()" class="btn-checkout">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Enviar Pedido por WhatsApp
                </button>
                <button onclick="closeCheckoutPrompt()" class="btn-cancel">Seguir comprando</button>
            </div>
        </div>
    `;

    prompt.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        padding: 2rem;
        border-radius: 16px;
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInUp 0.4s ease;
    `;

    document.body.appendChild(prompt);
}

function closeCheckoutPrompt() {
    const prompt = document.querySelector('.checkout-prompt');
    if (prompt) {
        prompt.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => prompt.remove(), 300);
    }
}

function sendWhatsAppOrder() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    // Build WhatsApp message
    let message = '¡Hola! Me gustaría hacer un pedido de Sakura Candles:\n\n';

    let total = 0;
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} x${item.quantity} - ${item.price * item.quantity}€\n`;
        total += item.price * item.quantity;
    });

    message += `\n*Total: ${total}€*\n\n`;
    message += '¿Podrían confirmar disponibilidad y método de pago?\n';
    message += '¡Gracias!';

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // WhatsApp number (replace with actual number)
    const whatsappNumber = '34612345678';

    // Open WhatsApp
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');

    // Clear cart after sending
    cart = [];
    updateCartCount();
    closeCheckoutPrompt();
}

function updateCartCount() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // You can add a cart badge in the nav if needed
    // For now, just log it
    console.log('Cart items:', cartCount);
}

// === SCROLL ANIMATIONS ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.zen-card, .product-card, .proceso-step, .testimonial-card');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// === DYNAMIC STYLES FOR FEEDBACK ===
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    @keyframes slideInUp {
        from {
            transform: translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes slideOutDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100px);
            opacity: 0;
        }
    }

    .checkout-content h3 {
        font-family: 'Playfair Display', serif;
        font-size: 1.5rem;
        color: #2E2E2E;
        margin-bottom: 0.5rem;
    }

    .checkout-content p {
        color: #4A4A4A;
        margin-bottom: 1.5rem;
    }

    .checkout-actions {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .btn-checkout {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        background: #25D366;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 50px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.95rem;
    }

    .btn-checkout:hover {
        background: #20BA5A;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(37, 211, 102, 0.3);
    }

    .btn-cancel {
        background: transparent;
        color: #8B4789;
        padding: 0.75rem;
        border: 2px solid #FFB7C5;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }

    .btn-cancel:hover {
        background: #FFB7C5;
        color: white;
    }

    @media (max-width: 768px) {
        .cart-feedback {
            right: 10px !important;
            left: 10px;
            font-size: 0.875rem;
        }

        .checkout-prompt {
            right: 10px !important;
            left: 10px;
            bottom: 10px !important;
            max-width: none !important;
            padding: 1.5rem !important;
        }
    }
`;
document.head.appendChild(style);

// === PRODUCT HOVER EFFECTS ===
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', function () {
        this.style.zIndex = '1';
    });
});

// === CART MODAL ===
const cartModal = document.getElementById('cartModal');
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsList = document.getElementById('cartItemsList');
const emptyCartMessage = document.getElementById('emptyCartMessage');
const whatsappCheckoutBtn = document.getElementById('whatsappCheckoutBtn');

function toggleCartModal() {
    cartModal.classList.toggle('active');
    if (cartModal.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
        updateCartDisplay();
    } else {
        document.body.style.overflow = '';
    }
}

function updateCartDisplay() {
    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartItemsList.style.display = 'none';
        whatsappCheckoutBtn.disabled = true;
        updateCartTotals();
        return;
    }

    emptyCartMessage.style.display = 'none';
    cartItemsList.style.display = 'flex';
    whatsappCheckoutBtn.disabled = false;

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        const itemTotal = (item.price * item.quantity).toFixed(2);

        cartItem.innerHTML = `
            <div class="cart-item-image">
                🕯️
            </div>
            <div class="cart-item-content">
                <div class="cart-item-header">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">€${item.price.toFixed(2)}</span>
                </div>
                <div class="cart-item-footer">
                    <div class="cart-item-qty">
                        <button class="qty-btn minus" data-index="${index}">−</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn plus" data-index="${index}">+</button>
                    </div>
                    <span style="font-size: 0.9rem; color: #999;">€${itemTotal}</span>
                    <button class="cart-item-remove" data-index="${index}">🗑️</button>
                </div>
            </div>
        `;

        cartItemsList.appendChild(cartItem);
    });

    // Add event listeners for quantity buttons
    document.querySelectorAll('.qty-btn.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
            updateCartDisplay();
            updateCartCount();
        });
    });

    document.querySelectorAll('.qty-btn.plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            cart[index].quantity++;
            updateCartDisplay();
            updateCartCount();
        });
    });

    // Add event listeners for remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            cart.splice(index, 1);
            updateCartDisplay();
            updateCartCount();
        });
    });

    updateCartTotals();
}

function updateCartTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 4.99; // Free shipping over €50
    const total = subtotal + shipping;

    document.getElementById('cartSubtotal').textContent = `€${subtotal.toFixed(2)}`;
    document.getElementById('cartShipping').textContent = `€${shipping.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `€${total.toFixed(2)}`;
}

// Cart button listeners
cartBtn.addEventListener('click', toggleCartModal);
closeCartBtn.addEventListener('click', toggleCartModal);
cartOverlay.addEventListener('click', toggleCartModal);

// WhatsApp checkout
whatsappCheckoutBtn.addEventListener('click', () => {
    const phoneNumber = '34612345678'; // Reemplaza con tu número WhatsApp (código país + número sin espacios)

    let message = '🌸 *Pedido Sakura Candles & Soaps*\n\n';
    message += '*Productos:*\n';

    cart.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        message += `• ${item.name} x${item.quantity} — €${itemTotal}\n`;
    });

    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 4.99;
    const total = subtotal + shipping;

    message += `\n*Resumen:*\n`;
    message += `Subtotal: €${subtotal.toFixed(2)}\n`;
    if (shipping > 0) {
        message += `Envío: €${shipping.toFixed(2)}\n`;
    } else {
        message += `Envío: GRATIS\n`;
    }
    message += `*Total: €${total.toFixed(2)}*\n\n`;
    message += `Confirma tu pedido para proceder con la compra.`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Clear cart after sending
    cart = [];
    updateCartDisplay();
    updateCartCount();
});

// === LOG CART (for debugging) ===
window.getCart = () => {
    console.log('Current cart:', cart);
    return cart;
};

console.log('%c🌸 Sakura Candles & Soaps', 'color: #FFB7C5; font-size: 20px; font-weight: bold;');
console.log('%cHandmade with love in Barcelona', 'color: #8B4789; font-size: 14px;');

// === PRODUCT DATA FOR MODALS ===
const productData = {
    'GANBARU': {
        name: 'GANBARU',
        meaning: '頑張る • Perseverancia',
        description: 'Aroma a madera de cedro y sándalo. Perfecta para momentos de concentración y trabajo.',
        image: './assets/images/a%20(2).jpg',
        price: 22
    },
    'NINTAI': {
        name: 'NINTAI',
        meaning: '忍耐 • Paciencia',
        description: 'Lavanda y eucalipto para la calma interior.',
        image: './assets/images/a%20(3).jpg',
        price: 20
    },
    'SATORI': {
        name: 'SATORI',
        meaning: '悟り • Iluminación',
        description: 'Incienso japonés y flor de loto.',
        image: './assets/images/a%20(4).jpg',
        price: 24
    },
    'KAKEBO': {
        name: 'KAKEBO',
        meaning: '家計簿 • Equilibrio',
        description: 'Té verde matcha y bergamota.',
        image: './assets/images/a%20(5).jpg',
        price: 21
    },
    'HANAMI': {
        name: 'HANAMI',
        meaning: '花見 • Contemplar las Flores',
        description: 'Flor de cerezo y jazmín. Una celebración de la primavera y la belleza efímera.',
        image: './assets/images/a%20(6).jpg',
        price: 23
    },
    'JABONES SAKURA': {
        name: 'JABONES SAKURA',
        meaning: '石鹸 • Jabones Naturales',
        description: 'Set de 4 jabones artesanales hechos con ingredientes 100% naturales.',
        image: './assets/images/a%20(7).jpg',
        price: 18
    }
};

let currentModalProduct = null;

// === PRODUCT MODAL ===
function openProductModal(productName) {
    const product = productData[productName];
    if (!product) return;

    currentModalProduct = product;

    const modal = document.getElementById('productModal');
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductMeaning').textContent = product.meaning;
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalProductImage').src = product.image;
    document.getElementById('modalProductPrice').textContent = `€${product.price}`;
    document.getElementById('modalAddCartBtn').onclick = () => addToCartFromModal();

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentModalProduct = null;
}

function addToCartFromModal() {
    if (currentModalProduct) {
        addToCart(currentModalProduct.name, currentModalProduct.price);
        closeProductModal();
    }
}

// Close modal when clicking overlay
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('productModal');
    const overlay = document.querySelector('.product-modal-overlay');

    if (overlay) {
        overlay.addEventListener('click', closeProductModal);
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeProductModal();
        }
    });
});
