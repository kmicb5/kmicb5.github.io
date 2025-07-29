document.addEventListener('DOMContentLoaded', () => {
    const aboutBtn = document.getElementById('about-btn');
    const musicSection = document.getElementById('music-section');
    const aboutSection = document.getElementById('about-section');

    function fadeOut(element, callback) {
        element.style.transition = 'opacity 0.5s';
        element.style.opacity = 0;
        setTimeout(() => {
            element.style.display = 'none';
            if (callback) callback();
        }, 500);
    }

    function fadeIn(element) {
        element.style.display = 'block';
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.5s';
            element.style.opacity = 1;
        });
    }

    aboutBtn.addEventListener('click', () => {
        const musicVisible = window.getComputedStyle(musicSection).display !== 'none';

        if (musicVisible) {
            fadeOut(musicSection, () => fadeIn(aboutSection));
            aboutBtn.textContent = 'Music';
        } else {
            fadeOut(aboutSection, () => fadeIn(musicSection));
            aboutBtn.textContent = 'About';
        }
    });
});