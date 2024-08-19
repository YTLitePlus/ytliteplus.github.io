document.addEventListener('DOMContentLoaded', () => {
    initializeLightbox();
    setupDownloadLink();
    setupSmoothScrolling();
    setupThemeToggle();
});

function initializeLightbox() {
    Fancybox.bind("[data-fancybox]", {
        loop: true,
        buttons: ["close"],
        transitionEffect: "fade",
        clickSlide: "close",
        keyboard: {
            ArrowLeft: "prev",
            ArrowRight: "next",
        },
    });
}

function setupDownloadLink() {
    const downloadLink = document.getElementById('download-link');
    
    downloadLink.addEventListener('click', (e) => {
        e.preventDefault();
        fetch('https://api.github.com/repos/YTLitePlus/YTLitePlus/releases/latest')
            .then(response => response.json())
            .then(data => {
                const bodyContent = data.body;
                const match = bodyContent.match(/### Catbox\s*`(.+?\.ipa)`/);
                if (match && match[1]) {
                    const fileName = match[1];
                    const downloadUrl = `https://files.catbox.moe/${fileName}`;
                    window.location.href = downloadUrl;
                } else {
                    alert('Download link not found in the latest release.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while fetching the download link.');
            });
    });
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "light") {
        document.body.classList.add("light-mode");
    } else if (prefersDarkScheme.matches && currentTheme !== "dark") {
        document.body.classList.add("light-mode");
    }

    themeToggle.addEventListener("click", function() {
        const isLightMode = document.body.classList.toggle("light-mode");
        localStorage.setItem("theme", isLightMode ? "light" : "dark");
    });

    themeToggle.addEventListener("keydown", function(e) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.click();
        }
    });
}