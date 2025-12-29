document.addEventListener('DOMContentLoaded', () => {
    console.log('Aura project page loaded');
    
    // Simple scroll animation for elements
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // Modal functionality
    const productButtons = document.querySelectorAll('.product-btn');
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal-close');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    // Open modal when product button is clicked
    productButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productType = button.getAttribute('data-product');
            const modal = document.getElementById(`modal-${productType}`);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });

    // Close modal when close button is clicked
    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scrolling
        });
    });

    // Close modal when overlay is clicked
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.closest('.modal').classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scrolling
        });
    });

    // Close modal when Escape key is pressed
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    document.body.style.overflow = ''; // Re-enable scrolling
                }
            });
        }
    });
});
