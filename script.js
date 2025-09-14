document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const letsGoBtn = document.getElementById('lets-go-btn');
    const discountForm = document.getElementById('discount-form');
    const backBtn = document.getElementById('back-btn');
    const homePage = document.getElementById('home-page');
    const formPage = document.getElementById('form-page');
    const successPage = document.getElementById('success-page');
    
    const navbarToggler = document.getElementById('navbar-toggler');
    const navbarMenu = document.getElementById('navbar-menu');

    // --- Page Navigation ---
    function showPage(pageToShow) {
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none'; // Hide all pages first
        });

        // Use a consistent display style for page transitions
        const displayStyle = (pageToShow.id === 'form-page' || pageToShow.id === 'success-page') ? 'flex' : 'block';
        pageToShow.style.display = displayStyle;
        
        // Timeout to allow display property to apply before adding class for opacity transition
        setTimeout(() => {
            pageToShow.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 10); 
    }

    letsGoBtn.addEventListener('click', () => {
        showPage(formPage);
    });

    backBtn.addEventListener('click', () => {
        showPage(homePage);
    });

    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // If it's a page link, prevent default and show page
            if (href === '#home-page' || href === '#form-page') {
                e.preventDefault();
                const targetPage = document.querySelector(href);
                if (targetPage) {
                    showPage(targetPage);
                }
            } else {
                // For anchor links, let them scroll
                const targetSection = document.querySelector(href);
                if (targetSection && !targetSection.classList.contains('page')) {
                     e.preventDefault();
                     targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }

            // Close navbar on mobile after link click
            if (navbarMenu.classList.contains('active')) {
                navbarMenu.classList.remove('active');
            }
        });
    });

    // --- Form Submission ---
    discountForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const persons = document.getElementById('persons').value;

        const formData = {
            name: name,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            age: document.getElementById('age').value,
            persons: persons,
            location: document.getElementById('location').value,
        };

        try {
            await window.addDoc(window.collection(window.db, "discount-requests"), formData);
            console.log("Form data saved to Firestore!");
        } catch (error) {
            console.error("Error saving to Firestore:", error);
        }

        // Populate the receipt
        const today = new Date();
        const date = today.toLocaleDateString('en-GB');
        const time = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        
        document.getElementById('receipt-date').textContent = date;
        document.getElementById('receipt-time').textContent = time;
        document.getElementById('receipt-name').textContent = name;
        document.getElementById('receipt-persons').textContent = persons;

        // Generate and display discount code
        const randomCode = generateDiscountCode(6);
        document.getElementById('discount-code').textContent = randomCode;

        showPage(successPage);
        discountForm.reset();
    });

    // Function to generate a random discount code
    function generateDiscountCode(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    // --- Navbar Toggler for Mobile ---
    navbarToggler.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
    });

    // --- Carousel ---
    const carouselTrack = document.querySelector('.carousel-track');
    const images = [
        'carousel-1.png',
        'carousel-2.png',
        'carousel-3.png',
        'carousel-4.png',
        'carousel-5.png'
    ];
    let currentIndex = 0;

    // Create and append slides
    images.forEach(src => {
        const slide = document.createElement('div');
        slide.classList.add('carousel-slide');
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Vegetarian fast food';
        slide.appendChild(img);
        carouselTrack.appendChild(slide);
    });

    function nextSlide() {
        currentIndex = (currentIndex + 1) % images.length;
        carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    setInterval(nextSlide, 3000); // Change slide every 3 seconds

    // --- Review Carousel ---
    const reviewTrack = document.querySelector('.review-carousel-track');
    const dotsContainer = document.querySelector('.review-carousel-dots');
    const reviews = [
        { name: 'Priya S.', photo: 'review-photo-1.png', text: "Absolutely the best veggie burger in Borivali! The vibe is so chill and the food is always fresh. A must-visit!" },
        { name: 'Rohan M.', photo: 'review-photo-2.png', text: "Sumit's corner is my go-to for a quick, tasty bite. The pizza and wraps are amazing. Super clean place too!" },
        { name: 'Aisha K.', photo: 'review-photo-3.png', text: "Love this place! Perfect for hanging out with friends. The food is delicious and affordable. 10/10 would recommend." },
        { name: 'Vikram P.', photo: 'review-photo-4.png', text: "The quality you get for the price is insane. Everything is so flavorful. I'm a regular here for a reason!" }
    ];
    let currentReviewIndex = 0;

    reviews.forEach((review, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.classList.add('review-card');
        slide.innerHTML = `
            <div class="review-card-content">
                <img src="${review.photo}" alt="Photo of ${review.name}" class="review-photo">
                <p class="review-text">"${review.text}"</p>
                <p class="review-author">- ${review.name}</p>
            </div>
        `;
        reviewTrack.appendChild(slide);

        // Create dot
        const dot = document.createElement('div');
        dot.classList.add('review-dot');
        dot.dataset.index = index;
        if (index === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
    });

    const reviewDots = document.querySelectorAll('.review-dot');

    function updateReviewCarousel() {
        reviewTrack.style.transform = `translateX(-${currentReviewIndex * 100}%)`;
        reviewDots.forEach(dot => dot.classList.remove('active'));
        reviewDots[currentReviewIndex].classList.add('active');
    }

    function nextReview() {
        currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
        updateReviewCarousel();
    }
    
    dotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('review-dot')) {
            currentReviewIndex = parseInt(e.target.dataset.index);
            updateReviewCarousel();
        }
    });

    setInterval(nextReview, 5000); // Change review every 5 seconds
});
