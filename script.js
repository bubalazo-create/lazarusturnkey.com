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



});
