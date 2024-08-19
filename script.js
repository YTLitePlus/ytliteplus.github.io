document.addEventListener('DOMContentLoaded', () => {
    initializeFancybox();
    setupDownloadLink();
    setupSmoothScrolling();
    setupThemeToggle();
});

function initializeFancybox() {
    Fancybox.bind("[data-fancybox]", {
        buttons: ["close", "slideShow", "fullScreen", "download"],
        wheel: "slide",
        transitionEffect: "fade",
        animationEffect: "fade",
        clickContent: "next",
        clickSlide: "close",
        dblclickContent: "zoom",
        dblclickSlide: "zoom",
    });

    Fancybox.bind('.lightbox', {
        loop: true,
        buttons: ["zoom", "slideShow", "fullScreen", "download", "thumbs", "close"],
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
    
    // Check for saved theme preference or use the system preference
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme == "light") {
        document.body.classList.toggle("light-mode");
    } else if (currentTheme == "dark") {
        document.body.classList.remove("light-mode");
    } else if (prefersDarkScheme.matches) {
        document.body.classList.remove("light-mode");
    } else {
        document.body.classList.toggle("light-mode");
    }

    themeToggle.addEventListener("click", function() {
        let theme;
        if (document.body.classList.contains("light-mode")) {
            document.body.classList.remove("light-mode");
            theme = "dark";
        } else {
            document.body.classList.add("light-mode");
            theme = "light";
        }
        localStorage.setItem("theme", theme);
    });

    // Add keyboard support
    themeToggle.addEventListener("keydown", function(e) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.click();
        }
    });
}