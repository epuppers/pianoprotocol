// script.js
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const mainHeader = document.getElementById('main-header');
    const navLinksContainer = document.getElementById('nav-links');
    const navLinks = navLinksContainer.querySelectorAll('a');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const currentYearSpan = document.getElementById('current-year');
    const siteBackgroundGlows = document.querySelector('.site-background-glows');

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Scrolled state for header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (mobileMenuToggle && navLinksContainer) {
        mobileMenuToggle.addEventListener('click', () => {
            navbar.classList.toggle('open');
            const isExpanded = navbar.classList.contains('open');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded.toString());
        });
    }

    // Smooth scroll & close mobile menu
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    let headerOffset = mainHeader.offsetHeight;
                    // If mobile menu is open and header might be taller or affect layout
                    if (navbar.classList.contains('open') && window.innerWidth <= 768) {
                       // Potentially adjust offset if mobile menu changes header perceived height or layout
                    }
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }

            if (navbar.classList.contains('open')) {
                navbar.classList.remove('open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Active nav link highlighting on scroll
    const sections = document.querySelectorAll('main section[id]');
    function navHighlighter() {
        let scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            // Adjust sectionTop to trigger highlight a bit earlier/later as needed
            const sectionTop = current.offsetTop - mainHeader.offsetHeight - Math.min(150, window.innerHeight * 0.2);
            let sectionId = current.getAttribute('id');
            let correspondingLink = document.querySelector(`#nav-links a[href="#${sectionId}"]`);

            if (correspondingLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinks.forEach(l => l.classList.remove('active')); // Remove from all
                    correspondingLink.classList.add('active'); // Add to current
                } else {
                    correspondingLink.classList.remove('active');
                }
            }
        });
        // Special case for bottom of page, if last section is small
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 50) { // Near bottom
             let lastSectionLink = document.querySelector(`#nav-links a[href="#${sections[sections.length-1].id}"]`);
             if(lastSectionLink) {
                navLinks.forEach(l => l.classList.remove('active'));
                lastSectionLink.classList.add('active');
             }
        } else if (scrollY < sections[0].offsetTop - mainHeader.offsetHeight - 150) { // Near top before first section
            navLinks.forEach(l => l.classList.remove('active'));
        }

    }
    window.addEventListener('scroll', navHighlighter);
    navHighlighter();

    // Scroll Animations
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // observer.unobserve(entry.target); // Uncomment to animate only once
            } else {
                 // Optional: Remove 'is-visible' if you want elements to re-animate when scrolling back up
                 // entry.target.classList.remove('is-visible');
            }
        });
    }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

    scrollElements.forEach(el => {
        observer.observe(el);
    });

    // Parallax/movement for background glows (subtle)
    if (siteBackgroundGlows) {
        const glows = siteBackgroundGlows.querySelectorAll('.glow');
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
            const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1

            glows.forEach((glow, index) => {
                const factor = (index + 1) * 5; // Different movement factor for each glow
                glow.style.transform = `translate(${x * factor}px, ${y * factor}px) scale(${glow.style.transform.includes('scale') ? glow.style.transform.split('scale(')[1].split(')')[0] : 1})`;
            });
        });
    }
});