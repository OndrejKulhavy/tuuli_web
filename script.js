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
    slideshows.forEach(slideshow => {
        const images = slideshow.querySelectorAll('img');
        if (images.length <= 1) return;

        let currentIndex = 0;
        // Randomize interval between 3s and 5s to make it feel more organic
        const intervalTime = 3000 + Math.random() * 2000;

        setInterval(() => {
            // Remove active class from current
            images[currentIndex].classList.remove('active');
            
            // Calculate next index
            currentIndex = (currentIndex + 1) % images.length;
            
            // Add active class to next
            images[currentIndex].classList.add('active');
        }, intervalTime);
    });
});
