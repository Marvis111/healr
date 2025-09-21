// Component loader for header and footer
class ComponentLoader {
    constructor() {
        this.components = {};
        this.sectionObserver = null;
    }

    // Load a component from a file
    async loadComponent(elementId, filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            
            // Insert the content
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = html;
                this.components[elementId] = html;
                
                // Re-execute any scripts in the loaded HTML
                this.reExecuteScripts(element);
            }
        } catch (error) {
            console.error(`Error loading component ${filePath}:`, error);
        }
    }

    // Re-execute scripts in the loaded HTML
    reExecuteScripts(element) {
        const scripts = element.querySelectorAll('script');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.textContent = script.textContent;
            }
            script.parentNode.replaceChild(newScript, script);
        });
    }

    // Load header
    async loadHeader() {
        await this.loadComponent('header-component', 'layouts/header.html');
        // Trigger navigation active state after header is loaded
        this.setActiveNavigation();
        // Hide header buttons on index page
        this.hideHeaderButtonsOnIndex();
    }

    // Load footer
    async loadFooter() {
        await this.loadComponent('footer-component', 'layouts/footer.html');
    }

    // Load both header and footer
    async loadAll() {
        await Promise.all([
            this.loadHeader(),
            this.loadFooter()
        ]);
    }

    // Set active navigation based on current page
    setActiveNavigation() {
        var currentPath = window.location.pathname;
        var currentPage = currentPath.split('/').pop() || 'index.html';
        
        // Remove any hash from the current page
        if (currentPage.indexOf('#') !== -1) {
            currentPage = currentPage.split('#')[0];
        }
        
        // Remove any query parameters
        if (currentPage.indexOf('?') !== -1) {
            currentPage = currentPage.split('?')[0];
        }
        
        // Handle index.html and root path
        if (currentPage === '' || currentPage === '/') {
            currentPage = 'index.html';
        }
        
        console.log('Setting active navigation for page:', currentPage);
        
        var navLinks = $(".navbar-nav .nav-link");
        console.log('Found navigation links:', navLinks.length);
        
        navLinks.each(function () {
            var _this = $(this),
                aHref = _this.attr("href");
            
            console.log('Checking link:', aHref);
            
            // Skip links that don't have href or are external links
            if (!aHref || aHref.startsWith('http') || aHref.startsWith('#')) {
                console.log('Skipping link:', aHref);
                return;
            }
            
            // Check if the current page matches this link
            if (aHref === currentPage || 
                (currentPage === 'index.html' && aHref === 'index.html') ||
                (currentPage === 'index.html' && aHref === './') ||
                (currentPage === 'index.html' && aHref === '/')) {
                console.log('Setting active for:', aHref);
                _this.addClass("active");
                _this.parent().addClass("active");
            } else {
                _this.removeClass("active");
                _this.parent().removeClass("active");
            }
        });
        
        this.setupSmoothScrolling();

        // Setup scroll-spy using IntersectionObserver
        if (this.sectionObserver) {
            this.sectionObserver.disconnect();
        }

        const sections = document.querySelectorAll('section[id]');
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5 // 50% of section visible
        };

        const navLinksArray = Array.from(navLinks);

        this.sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const sectionId = entry.target.id;
                const homeLink = navLinksArray.find(link => {
                    const href = $(link).attr('href');
                    return href && (href === 'index.html' || href === './' || href === '/' || href === '');
                });
                const serviceLink = navLinksArray.find(link => {
                    const href = $(link).attr('href');
                    return href && href.includes('services');
                });

                if (entry.isIntersecting) {
                    // Remove active from all nav links
                    navLinksArray.forEach(link => {
                        $(link).removeClass('active');
                        $(link).parent().removeClass('active');
                    });

                    if (sectionId === 'services') {
                        // When services section is in view, activate services nav and deactivate home
                        if (serviceLink) {
                            $(serviceLink).addClass('active');
                            $(serviceLink).parent().addClass('active');
                        }
                        if (homeLink) {
                            $(homeLink).removeClass('active');
                            $(homeLink).parent().removeClass('active');
                        }
                    } else {
                        // For other sections, activate the corresponding nav link if exists
                        const targetLink = navLinksArray.find(link => {
                            const href = $(link).attr('href');
                            if (!href) return false;
                            let hrefPage = href.split('#')[0];
                            if (hrefPage === '') hrefPage = 'index.html';
                            return hrefPage === currentPage && href.includes(`#${sectionId}`);
                        });
                        if (targetLink) {
                            $(targetLink).addClass('active');
                            $(targetLink).parent().addClass('active');
                        } else if (homeLink) {
                            // Default to home if no other matches
                            $(homeLink).addClass('active');
                            $(homeLink).parent().addClass('active');
                        }
                    }
                } else {
                    // When services section is not intersecting, ensure home is active if no other section is active
                    if (sectionId === 'services') {
                        const anyActive = navLinksArray.some(link => $(link).hasClass('active'));
                        if (!anyActive && homeLink) {
                            navLinksArray.forEach(link => {
                                $(link).removeClass('active');
                                $(link).parent().removeClass('active');
                            });
                            $(homeLink).addClass('active');
                            $(homeLink).parent().addClass('active');
                        }
                    }
                }
            });
        }, options);

        sections.forEach(section => {
            this.sectionObserver.observe(section);
        });
    }
    
    setupSmoothScrolling() {
        $(".navbar-nav .nav-link").on('click', function(e) {
            var href = $(this).attr('href');
            
            if (href && href.indexOf('#') !== -1) {
                e.preventDefault();
                
                var target = href.split('#')[1];
                var targetElement = $('#' + target);
                
                // If we're on the index page and the target element exists
                if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
                    if (targetElement.length) {
                        $('html, body').animate({
                            scrollTop: targetElement.offset().top - 80 // Offset for header
                        }, 800);
                    }
                } else {
                    // If we're on another page, navigate to index.html with the hash
                    window.location.href = href;
                }
            }
        });
    }

    // Hide header buttons on index page
    hideHeaderButtonsOnIndex() {
        const currentPage = window.location.pathname;
        const currentUrl = window.location.href;
        const headerButtons = document.getElementById('header-buttons');
        
        console.log('Current pathname:', currentPage);
        console.log('Current URL:', currentUrl);
        console.log('Header buttons element:', headerButtons);
        
        // Check multiple conditions for index page
        const isIndexPage = currentPage === '/index.html' || 
                           currentPage === '/' || 
                           currentPage.endsWith('index.html') ||
                           currentUrl.includes('index.html') ||
                           (currentPage === '' && window.location.href.includes('index.html'));
        
        console.log('Is index page:', isIndexPage);
        
        if (isIndexPage && headerButtons) {
            console.log('Hiding header buttons');
            headerButtons.style.display = 'none';
        }
    }
}

// Initialize component loader when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const loader = new ComponentLoader();
    loader.loadAll();
});


// Initialize FAQ accordion when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    generateFAQAccordion();
    
    // Handle accordion icon changes
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-bs-toggle="collapse"]')) {
            const trigger = e.target.closest('[data-bs-toggle="collapse"]');
            const targetId = trigger.getAttribute('data-bs-target');
            const target = document.querySelector(targetId);
            const icon = trigger.querySelector('i:not(.navbar-icon)');
            if (target) {
                target.addEventListener('shown.bs.collapse', function() {
                    icon.className = 'feather icon-feather-minus icon-extra-medium';
                });
                
                target.addEventListener('hidden.bs.collapse', function() {
                    icon.className = 'feather icon-feather-plus icon-extra-medium';
                });
            }
        }
    });
});