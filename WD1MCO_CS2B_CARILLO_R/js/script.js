document.addEventListener("DOMContentLoaded", () => {

    // ELEMENTS
    const navbar = document.querySelector(".navbar");
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const backToTop = document.getElementById("backToTop");

    const modal = document.getElementById("characterModal");
    const closeModal = document.querySelector(".close-modal");

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-img");
    const closeLightbox = document.querySelector(".close-lightbox");

    // MOBILE NAVIGATION
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("show");
    });

    // CLOSE MOBILE MENU
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navLinks.classList.remove("show");
        });
    });

    // NAVBAR SCROLL EFFECT
    function handleScroll() {

        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
            backToTop.classList.add("show");
        } else {
            navbar.classList.remove("scrolled");
            backToTop.classList.remove("show");
        }
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    // BACK TO TOP
    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // CHARACTER MODAL
    const characterCards = document.querySelectorAll(".character-card");

    characterCards.forEach(card => {

        const button = card.querySelector(".view-more");

        button.addEventListener("click", () => {

            const name = card.dataset.name;
            const affiliation = card.dataset.affiliation;
            const ability = card.dataset.ability;
            const description = card.dataset.desc;

            document.getElementById("modalName").textContent = name;
            document.getElementById("modalAffiliation").textContent = affiliation;
            document.getElementById("modalAbility").textContent = ability;
            document.getElementById("modalDesc").textContent = description;

            modal.classList.add("active");
            document.body.style.overflow = "hidden";
        });

    });

    // CLOSE CHARACTER MODAL
    function hideModal() {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }

    closeModal.addEventListener("click", hideModal);

    modal.addEventListener("click", event => {
        if (event.target === modal) {
            hideModal();
        }
    });

    // GALLERY LIGHTBOX
    const galleryImages = document.querySelectorAll(".gallery-img");

    galleryImages.forEach(image => {

        image.addEventListener("click", () => {

            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;

            lightbox.classList.add("active");
            document.body.style.overflow = "hidden";

        });

    });

    // CLOSE LIGHTBOX
    function hideLightbox() {
        lightbox.classList.remove("active");
        lightboxImage.src = "";
        document.body.style.overflow = "";
    }

    closeLightbox.addEventListener("click", hideLightbox);

    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) {
            hideLightbox();
        }
    });

    // ESCAPE KEY
    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            hideModal();
            hideLightbox();
        }

    });

    // SCROLL REVEAL ANIMATION
    const fadeElements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);
            }

        });

    }, {
        threshold: 0.12
    });

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // CHARACTER CARD ANIMATION
    characterCards.forEach((card, index) => {
        card.style.transitionDelay = `${(index % 4) * 0.07}s`;
    });

    // ACTIVE NAVIGATION LINK
    const sections = document.querySelectorAll("header[id], section[id]");

    window.addEventListener("scroll", () => {

        let current = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 150;

            if (window.scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }

        });

        document.querySelectorAll(".nav-links a").forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }

        });

    });

});


// =====================================
// DEMON SLAYER SHOPPING CART
// =====================================

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

let cart = [];

// ADD TO CART
document.querySelectorAll(".add-cart").forEach(button => {

    button.addEventListener("click", () => {

        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = Number(button.dataset.price);
        const image = button.dataset.image;

        const existing = cart.find(item => item.id === id);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({
                id,
                name,
                price,
                image,
                quantity: 1
            });
        }

        updateCart();

        button.textContent = "ADDED TO CART!";

        setTimeout(() => {
            button.textContent = "ADD TO CART";
        }, 1000);

    });

});

// UPDATE CART
function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty.</p>';
    }

    cart.forEach(item => {

        total += item.price * item.quantity;
        count += item.quantity;

        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₱${item.price.toLocaleString()}</p>

                <div class="cart-quantity">
                    <button class="minus" data-id="${item.id}">−</button>
                    <span>${item.quantity}</span>
                    <button class="plus" data-id="${item.id}">+</button>
                </div>
            </div>

            <button class="remove-item" data-id="${item.id}">
                ✕
            </button>
        `;

        cartItems.appendChild(div);
    });

    cartCount.textContent = count;
    cartTotal.textContent = `₱${total.toLocaleString()}`;

}

// CART BUTTON ACTIONS
cartItems.addEventListener("click", event => {

    const id = event.target.dataset.id;

    if (!id) return;

    const item = cart.find(product => product.id === id);

    if (event.target.classList.contains("plus") && item) {
        item.quantity++;
    }

    if (event.target.classList.contains("minus") && item) {
        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(product => product.id !== id);
        }
    }

    if (event.target.classList.contains("remove-item")) {
        cart = cart.filter(product => product.id !== id);
    }

    updateCart();

});

// CLEAR CART
document.getElementById("clearCart").addEventListener("click", () => {
    cart = [];
    updateCart();
});

// CHECKOUT
document.getElementById("checkoutBtn").addEventListener("click", () => {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    alert(
        "DEMON SLAYER ORDER SUMMARY\n\n" +
        "Total Items: " +
        cart.reduce((sum, item) => sum + item.quantity, 0) +
        "\nTotal Amount: ₱" + total.toLocaleString() +
        "\n\nThank you for shopping!"
    );

    cart = [];
    updateCart();

});

updateCart();
