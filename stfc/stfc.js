// prevent scroll on hash navigation
window.addEventListener('hashchange', function(e) {
    e.preventDefault();
    window.scrollTo(0, 0);
}, true);

if (window.location.hash) {
    window.scrollTo(0, 0);
}

// prevent default hash scroll behavior
if (window.location.hash) {
    window.scrollTo(0, 0);
}

// tab switching functionality
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

function activateTab(tabName) {
    // rm active class from all buttons and contents
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // add active class to clicked button and corresponding content
    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    const activeContent = document.getElementById(tabName);
    if (activeContent) {
        activeContent.classList.add('active');
    }
}

// handle tab clicks
tabButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const tabName = this.getAttribute('data-tab');
        
        // only change hash if it's a different tab
        if (window.location.hash.slice(1) !== tabName) {
            window.location.hash = tabName;
        }
        
        activateTab(tabName);
    });
});

// handle browser back/forward and direct hash links
window.addEventListener('hashchange', function() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    const tabName = window.location.hash.slice(1);
    if (tabName) {
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

    // force scroll to top multiple times to override firefox's behavior
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (tabName) {
        activateTab(tabName);
    } else {
        activateTab('welcome'); // default to welcome tab
    }

    // force scroll again after a tiny delay
    setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, 10);
});

        // lightbox functionality for images
function openLightbox(element) {
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-image');
    const src = element.querySelector('img').src;
    
    modal.style.display = 'block';
    modalImg.src = src;
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

// make all .clickable elements open the lightbox
document.querySelectorAll('.content-image.clickable').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
        openLightbox(this);
    });
});