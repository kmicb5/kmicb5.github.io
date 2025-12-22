// GLOBAL VARIABLES - declare first
let tabButtons, tabContents, activateTab;

// prevent scroll on hash navigation
window.addEventListener('hashchange', function(e) {
    e.preventDefault();
    window.scrollTo(0, 0);
}, true);

if (window.location.hash) {
    window.scrollTo(0, 0);
}

// tab switching functionality - runs on page load
document.addEventListener('DOMContentLoaded', function() {
    tabButtons = document.querySelectorAll('.tab-button');
    tabContents = document.querySelectorAll('.tab-content');

    activateTab = function(tabName) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        const activeContent = document.getElementById(tabName);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    };

    // handles tab clicks
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            if (window.location.hash.slice(1) !== tabName) {
                window.location.hash = tabName;
            }
            activateTab(tabName);
        });
    });

    // ESC key to close modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeTipsModal();
        }
    });

    // on first load, activate the correct tab
    const tabName = window.location.hash.slice(1);
    if (tabName) {
        activateTab(tabName);
    } else {
        activateTab('welcome');
    }
});

// handle browser back/forward and direct hash links
window.addEventListener('hashchange', function() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const tabName = window.location.hash.slice(1);
    if (tabName && activateTab) {
        activateTab(tabName);
    }

    setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, 10);
});

// on page load, check if there's a hash and activate that tab
window.addEventListener('load', function() {
    const tabName = window.location.hash.slice(1);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (tabName && activateTab) {
        activateTab(tabName);
    } else if (activateTab) {
        activateTab('welcome');
    }

    setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, 10);
});

// tips modal funcs
function openTipsModal(title, box1Data, box2Data, box3Data, box4Data) {
    document.getElementById('modal-image').src = box1Data.image;
    document.getElementById('modal-title').textContent = title;
    
    document.getElementById('box1-title').textContent = box1Data.title;
    document.getElementById('box1-text').textContent = box1Data.text;
    
    document.getElementById('box2-title').textContent = box2Data.title;
    document.getElementById('box2-text').textContent = box2Data.text;
    
    document.getElementById('box3-title').textContent = box3Data.title;
    const list = document.getElementById('box3-list');
    list.innerHTML = box3Data.items.map(item => `<li>${item}</li>`).join('');
    
    document.getElementById('box4-title').textContent = box4Data.title;
    document.getElementById('box4-text').textContent = box4Data.text;
    
    document.getElementById('tips-modal').classList.add('active');
}

function closeTipsModal() {
    document.getElementById('tips-modal').classList.remove('active');
}

// lightbox functionality for images
function openLightbox(element) {
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-image');
    const src = element.querySelector('img').src;
    modal.style.display = 'block';
    modalImg.src = src;
}

function openLightboxImg(img) {
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-image');
    modal.style.display = 'block';
    modalImg.src = img.src;
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    modal.style.display = 'none';
}

// close lightbox when clicking outside the image
window.addEventListener('click', function(event) {
    const modal = document.getElementById('lightbox-modal');
    if (event.target === modal) {
        closeLightbox();
    }
});

// borg probe animation
function initProbes() {
    const probes = Array.from(document.querySelectorAll('.probe'));
    const vpWidth = () => window.innerWidth;
    const vpHeight = () => window.innerHeight;

    const state = probes.map((img, idx) => ({
        el: img,
        x: Math.random() * vpWidth(),
        y: Math.random() * vpHeight(),
        // Much faster speeds for sweeping motion
        vx: (Math.random() * 0.15 + 0.05) * (Math.random() < 0.5 ? 1 : -1),
        vy: (Math.random() * 0.15 + 0.05) * (Math.random() < 0.5 ? 1 : -1),
        time: Math.random() * Math.PI * 2,
        targetX: Math.random() * vpWidth(),
        targetY: Math.random() * vpHeight(),
        pathTimer: 0,
        pathDuration: Math.random() * 8000 + 12000  // 4-7 seconds per path
    }));

    function tick() {
        const w = vpWidth();
        const h = vpHeight();
        const t = performance.now();

        state.forEach(p => {
            p.pathTimer += 16; // ~60fps

            // switch to new target when path is complete
            if (p.pathTimer > p.pathDuration) {
                p.pathTimer = 0;
                p.pathDuration = Math.random() * 3000 + 4000;
                p.targetX = Math.random() * (w + 400) - 200; // Allow off-screen
                p.targetY = Math.random() * (h + 400) - 200;
            }

            // calc progress along current path (0 to 1)
            const progress = p.pathTimer / p.pathDuration;
            
            // easing function for smooth arc motion
            const easeProgress = Math.sin(progress * Math.PI); // Creates smooth curve

            // linear interpolation with easing toward target
            p.x += (p.targetX - p.x) * 0.02 + Math.sin(t * 0.002 + p.time) * 0.3;
            p.y += (p.targetY - p.y) * 0.02 + Math.cos(t * 0.0015 + p.time) * 0.3;

            const elW = p.el.offsetWidth || 60;
            const elH = p.el.offsetHeight || 60;

            // warp around screen - allows probes to go off-screen and re-enter
            if (p.x > w + 100) p.x = -100;
            if (p.x < -100) p.x = w + 100;
            if (p.y > h + 100) p.y = -100;
            if (p.y < -100) p.y = h + 100;

            p.el.style.left = p.x + 'px';
            p.el.style.top = p.y + 'px';
            
            // calc angle based on velocity for banking effect
            const angle = Math.atan2(p.targetY - p.y, p.targetX - p.x) * (180 / Math.PI);
            p.el.style.transform = `rotate(${angle + Math.sin(t * 0.003 + p.time) * 8}deg)`;
        });

        requestAnimationFrame(tick);
    }

    tick();
}

window.addEventListener('load', initProbes);