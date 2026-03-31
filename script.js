// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // 2. Sticky Navbar & Scroll Styling
    const navbar = document.querySelector('.navbar');

    function updateNavbar() {
        if (!navbar) return;
        
        const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
        
        if (window.scrollY > 50 || !isHomePage) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    if (navbar) {
        window.addEventListener('scroll', updateNavbar);
        updateNavbar(); // Initial check
    }

    // 3. Smooth Scrolling for Anchor Links (safeguard for older browsers)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            // Only prevent default if the target is actually on the CURRENT page
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Basic Contact Form Validation/Handling
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const data = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = 'Thank you for your message. We will get back to you shortly!';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                } else {
                    const errorData = await response.json();
                    if (Object.hasOwn(errorData, 'errors')) {
                        formStatus.textContent = errorData.errors.map(error => error.message).join(', ');
                    } else {
                        formStatus.textContent = 'Oops! There was a problem submitting your form.';
                    }
                    formStatus.className = 'form-status error';
                }
            } catch (error) {
                formStatus.textContent = 'Oops! There was a problem submitting your form.';
                formStatus.className = 'form-status error';
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Clear message after 5 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 5000);
            }
        });
    }

    // 5. Update Current Year in Footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 6. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length > 0 && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger the reveal with a slight delay per element
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, index * 100);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback: just show everything
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    // 7. Lightbox for Galleries
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    document.body.appendChild(lightbox);

    const lightboxImg = document.createElement('img');
    lightbox.appendChild(lightboxImg);

    const galleryImages = document.querySelectorAll('.service-gallery img, .project-img, .photo-gallery img, .about-image-wrapper img');
    galleryImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            lightbox.classList.add('active');
            lightboxImg.src = img.src;
        });
    });

    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // 8. Cookie Consent & Google Analytics
    const measurementId = 'G-10SZRQJE24';
    
    function loadGoogleAnalytics() {
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}');
        `;
        document.head.appendChild(script2);
    }

    // Check localStorage
    if (localStorage.getItem('cookieConsent') === 'accepted') {
        loadGoogleAnalytics();
    } else if (!localStorage.getItem('cookieConsent')) {
        // Build the banner
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content container">
                <p>We use cookies and Google Analytics to monitor traffic and improve your experience on our site. Do you accept these tracking cookies?</p>
                <div class="cookie-buttons">
                    <button id="btn-accept-cookies" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.85rem;">Accept</button>
                    <button id="btn-decline-cookies" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem; border-color: var(--color-primary); color: var(--color-primary);">Decline</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);

        document.getElementById('btn-accept-cookies').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            banner.classList.add('hidden');
            loadGoogleAnalytics();
        });

        document.getElementById('btn-decline-cookies').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            banner.classList.add('hidden');
        });
    }
    // 9. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (questionBtn && answer) {
            questionBtn.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                // Close all
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if(otherAnswer) otherAnswer.style.maxHeight = null;
                });
                
                // Toggle current
                if (!isOpen) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 50 + "px";
                }
            });
        }
    });

});
