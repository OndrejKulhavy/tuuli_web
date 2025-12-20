document.addEventListener('DOMContentLoaded', () => {
    // Gallery Logic (from weby.html)
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    if (portfolioItems.length > 0) {
        portfolioItems.forEach(item => {
            const container = item.querySelector('.gallery-container');
            const slides = item.querySelectorAll('.gallery-slide');
            const dots = item.querySelectorAll('.gallery-dot');
            const prevBtn = item.querySelector('.gallery-nav.prev');
            const nextBtn = item.querySelector('.gallery-nav.next');
            
            if (!container || slides.length === 0) return;

            let currentSlide = 0;

            function goToSlide(index) {
                if (index < 0) index = slides.length - 1;
                if (index >= slides.length) index = 0;
                currentSlide = index;
                container.style.transform = `translateX(-${currentSlide * 100}%)`;
                dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
            }

            prevBtn?.addEventListener('click', () => goToSlide(currentSlide - 1));
            nextBtn?.addEventListener('click', () => goToSlide(currentSlide + 1));
            dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));
        });
    }

    // Automatic Slideshow Logic (for projects.html)
    const slideshows = document.querySelectorAll('.project-image.slideshow');
    const intervalTime = 4000; // Fixed interval for all slideshows
    
    // Synchronized slideshow switching
    if (slideshows.length > 0) {
        const slideshowStates = [];
        
        // Initialize all slideshows
        slideshows.forEach(slideshow => {
            const images = slideshow.querySelectorAll('img');
            if (images.length <= 1) return;
            
            slideshowStates.push({
                images,
                currentIndex: 0
            });
        });
        
        // Switch all slideshows at the same time
        setInterval(() => {
            slideshowStates.forEach(state => {
                // Remove active class from current
                state.images[state.currentIndex].classList.remove('active');
                
                // Calculate next index
                state.currentIndex = (state.currentIndex + 1) % state.images.length;
                
                // Add active class to next
                state.images[state.currentIndex].classList.add('active');
            });
        }, intervalTime);
    }

    // Mobile scroll-based hover effect for projects
    const projects = document.querySelectorAll('.project');
    
    if (projects.length > 0 && 'IntersectionObserver' in window && window.innerWidth <= 768) {
        const observerOptions = {
            root: null,
            rootMargin: '-40% 0px -40% 0px', // Trigger when project is in middle 20% of viewport
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, observerOptions);

        projects.forEach(project => observer.observe(project));
    }
});
