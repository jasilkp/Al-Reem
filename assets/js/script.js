// Infinite sequential bounce for Why Choose Us icons
document.addEventListener('DOMContentLoaded', function () {
    var icons = document.querySelectorAll('.why-choose-icon');
    if (icons.length > 0) {
        let current = 0;
        function bounceNext() {
            icons.forEach((icon, i) => icon.classList.remove('bounce-loop'));
            icons[current].classList.add('bounce-loop');
            current = (current + 1) % icons.length;
            setTimeout(bounceNext, 1200); // 0.75s anim + 0.45s pause
        }
        bounceNext();
    }
});
// Contact section image fade-in effect
document.addEventListener('DOMContentLoaded', function () {
    var contactImg = document.querySelector('.contact-img-main');
    var blurBg = document.querySelector('.contact-img-blur');
    if (contactImg && blurBg) {
        if (contactImg.complete) {
            contactImg.classList.add('loaded');
            blurBg.classList.add('hide');
        } else {
            contactImg.addEventListener('load', function () {
                contactImg.classList.add('loaded');
                blurBg.classList.add('hide');
            });
        }
    }
});
// ======================= TEAM MODAL (LIGHTBOX) =======================
function initTeamModal() {
    const modal = document.getElementById('team-modal');
    const modalImg = document.getElementById('team-modal-image');
    const closeBtn = document.getElementById('team-modal-close');
    if (!modal || !modalImg || !closeBtn) return;
    function openModal(src, alt) {
        modalImg.src = src;
        modalImg.alt = alt || 'Team member large';
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        setTimeout(() => { modal.style.opacity = '1'; }, 10);
        document.body.style.overflow = 'hidden';
    }
    function closeModal() {
        modal.style.opacity = '0';
        modal.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
            modal.classList.add('hidden');
            modalImg.src = '';
            document.body.style.overflow = '';
        }, 300);
    }
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', e => {
        if (!modal.classList.contains('hidden') && (e.key === 'Escape' || e.key === 'Esc')) closeModal();
    });
    // Attach to all team images
    document.querySelectorAll('.team-card-imageonly img').forEach(img => {
        img.addEventListener('click', () => openModal(img.src, img.alt));
        img.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') openModal(img.src, img.alt);
        });
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', 'View team member photo');
    });
}
// Prevent multiple initializations if script is included twice
const __appInit = { done: false };

// Handle loading state
document.addEventListener('DOMContentLoaded', () => {
    // Fallback timeout to ensure content shows even if loading detection fails
    const fallbackTimeout = setTimeout(() => {
        // Never reveal the main content before the intro overlay runs.
        // If the intro overlay exists, keep content hidden and let the intro
        // sequence reveal it when finished. We only remove the lightweight
        // loading screen so users aren't staring at two overlays.
        const overlay = document.getElementById('logo-intro-overlay');
        if (overlay) {
            console.warn('Loading timed out, keeping intro overlay and holding content until intro completes');
            const loadingScreen = document.querySelector('.loading-screen');
            if (loadingScreen) {
                loadingScreen.remove();
            }
            return; // Do NOT add content-loaded here
        }

        console.warn('Loading detection timed out, revealing content (no intro overlay present)');
        document.body.classList.add('content-loaded');
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.remove();
        }
    }, 3000); // 3 second timeout

    // Ensure all critical resources are loaded before showing content
    Promise.all([
        // Wait for fonts to load
        document.fonts.ready,
        // Wait for critical images to load
        new Promise(resolve => {
            const criticalImages = document.querySelectorAll('img[loading="eager"], #home-logo, #about-logo');
            let loadedCount = 0;
            const totalImages = criticalImages.length;
            
            if (totalImages === 0) {
                resolve();
                return;
            }
            
            criticalImages.forEach(img => {
                if (img.complete) {
                    loadedCount++;
                    if (loadedCount === totalImages) resolve();
                } else {
                    img.onload = img.onerror = () => {
                        loadedCount++;
                        if (loadedCount === totalImages) resolve();
                    };
                }
            });
        })
    ]).then(() => {
        // Clear the fallback timeout since loading completed successfully
        clearTimeout(fallbackTimeout);

        // If the intro overlay exists and user does not prefer reduced motion,
        // keep the main content hidden — the intro sequence will reveal it when done.
        const overlay = document.getElementById('logo-intro-overlay');
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (overlay && !prefersReduced) {
            // Do not reveal content here; introLogoSequence will call `document.body.classList.add('content-loaded')`
            // Also keep the loading screen until the intro sequence removes it.
            return;
        }

        // Otherwise reveal immediately with a small delay for smoothness
        setTimeout(() => {
            document.body.classList.add('content-loaded');

            // Remove loading screen after transition
            setTimeout(() => {
                const loadingScreen = document.querySelector('.loading-screen');
                if (loadingScreen) {
                    loadingScreen.remove();
                }
            }, 500);
        }, 100);
    }).catch(error => {
        console.error('Error during loading:', error);
        // Clear timeout and show content even if there's an error
        clearTimeout(fallbackTimeout);
        document.body.classList.add('content-loaded');
    });

    if (__appInit.done) return;
    __appInit.done = true;
    try {
        initMobileMenu();
        initSmoothScroll();
        initActiveNavOnScroll();
        initScrollAnimations();
        initWhyUsParallax();
        initHomePageAnimations();
        initStorySlideshow();
        initInteractiveMenu();
        initArcDishCarousel();
        initStickyHeader();
        // Delay event carousel until events section is visible
        let eventCarouselStarted = false;
        const eventsSection = document.getElementById('events');
        if (eventsSection && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !eventCarouselStarted) {
                        eventCarouselStarted = true;
                        initEventCarousel();
                        obs.disconnect();
                    }
                });
            }, { threshold: 0.2 });
            observer.observe(eventsSection);
        } else {
            // Fallback: start immediately if IntersectionObserver not supported
            initEventCarousel();
        }
    initAboutSectionAnimations();
    try { initAboutShowMore(); } catch (e) { console.warn('About show more init failed', e); }
        initArcGuideToggle();
        initBackToTop();
        initContactForm();
        initOutlets();
        initTeamSection();
        initTeamModal();
        initEventsScrollOptimization();
        initMenuScrollOptimization();
    } catch (error) {
        console.error('An error occurred during script execution:', error);
        // Ensure content is shown even if there's an error
        document.body.classList.add('content-loaded');
    }
});

    /* Logo intro orchestration: rolling sequence (bottom→center rise with 360° roll, glint, then roll+move to header) */
    function introLogoSequence() {
    // Disable scrolling during intro
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
        try {
                const overlay = document.getElementById('logo-intro-overlay');
                const introInner = document.getElementById('logo-intro-inner');
                const introImg = document.getElementById('logo-intro-img');
                const targetLogo = document.getElementById('home-logo');
                const playedKey = 'alreem_intro_played_v1';
                // Play once per session: use sessionStorage so refreshes in the same tab skip the intro
                let alreadyPlayed = false;
                try { alreadyPlayed = !!(sessionStorage && sessionStorage.getItem && sessionStorage.getItem(playedKey)); } catch (e) { alreadyPlayed = false; }
                if (alreadyPlayed) {
                    // Remove overlay if present and reveal content immediately
                    if (overlay) try { overlay.remove(); } catch (e) {}
                    document.body.classList.add('content-loaded');
                    document.body.style.overflow = originalOverflow;
                    try {
                        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                        if (!prefersReduced) document.body.classList.add('home-anim-play');
                    } catch (e) {}
                    const loadingScreen = document.querySelector('.loading-screen'); if (loadingScreen) loadingScreen.remove();
                    try { targetLogo.classList.remove('intro-hidden'); targetLogo.classList.add('intro-pop'); } catch (e) {}
                    return;
                }
            // timeout ids we may need to clear if user skips
            let tRise = null, tHold = null, tShine = null, tMoveEnd = null, tTwinkle = null;
            if (!overlay || !introInner || !introImg || !targetLogo) {
                if (overlay) overlay.remove();
                return;
            }

            const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReduced) {
                overlay.remove();
                return;
            }

            // Play on every load/refresh — do not skip based on sessionStorage

            // Make overlay visible and prepare styles for hardware-accelerated transforms
            overlay.classList.add('intro-visible');
            // small delay to ensure display toggled before measured
            introInner.style.willChange = 'transform, opacity';
            introInner.style.position = 'fixed';
            introInner.style.left = '50%';
            // place element at top:0 and use translateY in px for consistent animation
            introInner.style.top = '0px';
            // Start just below the viewport so it visibly comes from the bottom.
            // Use a responsive multiplier so travel distance looks natural on all screens.
            const startY = Math.round(window.innerHeight * 1.15); // 115% of viewport height
            introInner.style.transform = `translate(-50%, ${startY}px) rotate(0deg)`;
            introInner.style.zIndex = '10000';

            // Start playing (this triggers mask fill and glint via CSS)
            overlay.classList.add('playing');
            // ARIA announcement: intro started
            const live = document.getElementById('intro-live');
            if (live) live.textContent = 'Opening animation playing.';

            // Wire up Skip button if present
                const skipBtn = document.getElementById('skip-intro');
                const cancelIntro = () => {
                    try {
                        // clear any outstanding timeouts
                        [tRise, tHold, tShine, tMoveEnd].forEach(id => { if (id) clearTimeout(id); });
                    } catch (e) {}
                    try { overlay.remove(); } catch (e) {}
                    // Set played flag so future loads skip the animation
                    try { if (sessionStorage && sessionStorage.setItem) sessionStorage.setItem(playedKey, '1'); } catch (e) {}
                    // reveal page
                    document.body.classList.add('content-loaded');
                    document.body.style.overflow = originalOverflow;
                    // Trigger home text animations unless reduced motion is preferred
                    try {
                        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                        if (!prefersReduced) document.body.classList.add('home-anim-play');
                    } catch (e) {}
                    const loadingScreen = document.querySelector('.loading-screen'); if (loadingScreen) loadingScreen.remove();
                    // reveal header logo
                    try { targetLogo.classList.remove('intro-hidden'); targetLogo.classList.add('intro-pop'); } catch (e) {}
            };
            if (skipBtn) {
                // If a skip button exists (removed by request), keep defensive hookup
                skipBtn.addEventListener('click', (e) => { e.preventDefault(); cancelIntro(); });
                // make it focusable for keyboard users
                skipBtn.tabIndex = 0;
            }

            const riseDuration = 1100; // ms for bottom→center with one roll (faster)
            // Very small gap before the stronger blink/shine so it doesn't feel instant
            // (a value ~60-120ms creates a subtle, perceptible pause).
            const pauseAfterRise = 90; // ms (very small)
            const centerHold = 800; // ms to hold at center before moving to header (slightly longer)
            const shineDuration = 1300; // ms duration of strong shine animation (slower)
            const moveDuration = 1400; // ms to move/roll to header (slower)

            // Easing: gentle overshoot for a natural feel
            const riseEasing = 'cubic-bezier(.175,.885,.32,1.275)'; // subtle overshoot
            // Improved move easing: smooth, gentle stop with slight overshoot
            const moveEasing = 'cubic-bezier(.77,0,.175,1)';

            // STEP 1: Rise from bottom to center while rolling 360deg
            requestAnimationFrame(() => {
                // Compute center Y in px (so we animate translateY from startY -> centerY)
                const introRectStart = introInner.getBoundingClientRect();
                const introH = introRectStart.height;
                const centerY = Math.round(window.innerHeight / 2 - introH / 2);
                introInner.style.transition = `transform ${riseDuration}ms ${riseEasing}`;
                introInner.style.transform = `translate(-50%, ${centerY}px) rotate(360deg)`;
            });

            // After rising and rolling, hold at center then trigger a stronger shine, then move+roll to header
            tRise = setTimeout(() => {
                // quick subtle glint (keeps previous behavior)
                overlay.classList.add('glint');
                // Add a short twinkle sparkle while the logo is centered
                overlay.classList.add('twinkle');

                // Immediately perform the stronger shine now that logo is centered (no lag)
                try { if (tTwinkle) clearTimeout(tTwinkle); } catch (e) {}
                overlay.classList.remove('twinkle');

                // Apply SVG filter that preserves the logo's own colors (colored glow)
                try {
                    const svgObj = document.getElementById('logo-intro-img');
                    if (svgObj && svgObj.contentDocument) {
                        const svg = svgObj.contentDocument.querySelector('svg');
                        if (svg && !svg.querySelector('#alreem-glow-filter')) {
                            // Inject filter definition
                            const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
                            filter.setAttribute('id', 'alreem-glow-filter');
                            // Blur the graphic and merge it back with the source so the blurred color
                            // halo matches the logo artwork (keeps original hues).
                            filter.innerHTML = `
                                                                    <feGaussianBlur stdDeviation="8" result="blur"/>
                                                                    <feMerge>
                                                                        <feMergeNode in="blur"/>
                                                                        <feMergeNode in="SourceGraphic"/>
                                                                    </feMerge>
                            `;
                            svg.insertBefore(filter, svg.firstChild);
                        }
                        // Apply the filter to the logo
                        if (svg) {
                            svg.style.filter = 'url(#alreem-glow-filter)';
                        } else if (svgObj) {
                            // Fallback: if we can't access inner svg, apply a CSS filter to the object element
                            // We can't reproduce multi-colored blur reliably in CSS; use a subtle drop-shadow
                            // fallback so there's still a glow effect even when inner svg access is blocked.
                            svgObj.style.filter = 'drop-shadow(0 0 18px rgba(255,255,255,0.85)) brightness(1.15) saturate(1.05)';
                        }
                        // Animate the filter intensity for a glowing effect (slower, more pronounced)
                        svg.animate([
                            { filter: 'url(#alreem-glow-filter) brightness(1.05) saturate(1.05)' },
                            { filter: 'url(#alreem-glow-filter) brightness(1.45) saturate(1.45)' },
                            { filter: 'url(#alreem-glow-filter) brightness(1.05) saturate(1.05)' }
                        ], {
                            duration: shineDuration,
                            easing: 'cubic-bezier(.35,.85,.3,1)'
                        });
                    }
                } catch (e) {}
                overlay.classList.add('gleam');
                // Add the circling red border while the logo is centered and shining
                try { overlay.classList.add('circle-glow'); } catch (e) {}
                // small pop: temporarily append a scale to the current transform so the logo
                // slightly pops up when the glow begins, then restore the original transform.
                try {
                    const popScale = 1.06;
                    const popMs = 140;
                    const origTransform = introInner.style.transform || getComputedStyle(introInner).transform || '';
                    // Append scale so we don't clobber translate/rotate already present
                    introInner.style.transform = origTransform + ` scale(${popScale})`;
                    setTimeout(() => {
                        try { introInner.style.transform = origTransform; } catch (e) {}
                    }, popMs);
                } catch (e) {}
                // Add active class shortly to emphasize the pulse while glow runs
                setTimeout(() => { try { overlay.classList.add('gleam-active'); } catch (e) {} }, 60);
                // Use shine overlay while centered; the injected SVG filter will make the glow
                // match the logo's own colors (no forced white variant).
                overlay.classList.add('shine');
                if (live) live.textContent = 'Logo glowing.';

                // Remove gleam and circling border shortly before moving to header so they only appear while centered
                setTimeout(() => {
                    try { overlay.classList.remove('gleam-active'); } catch (e) {}
                    try { overlay.classList.remove('gleam'); } catch (e) {}
                    try { overlay.classList.remove('circle-glow'); } catch (e) {}
                    try { const ss = document.getElementById('intro-glow-style'); if (ss) ss.remove(); } catch (e) {}
                    // Remove SVG filter before rolling begins
                    try {
                        const svgObj = document.getElementById('logo-intro-img');
                        if (svgObj) {
                            try {
                                const svg = svgObj.contentDocument && svgObj.contentDocument.querySelector && svgObj.contentDocument.querySelector('svg');
                                if (svg) svg.style.filter = '';
                                else svgObj.style.filter = '';
                            } catch (e) {
                                // If accessing contentDocument throws, clear any filter applied to the object element
                                svgObj.style.filter = '';
                            }
                        }
                    } catch (e) {}
                }, Math.max(40, shineDuration - 80));

                // After the shine plays, do a short fade-out of the glow then proceed to compute target and move
                tShine = setTimeout(() => {
                        // Start a short pre-roll fade so glow/shine eases out smoothly before the roll begins.
                        // Keep this duration small (120-160ms) for a subtle smoothing effect.
                        const fadeDuration = 140; // ms (kept in sync with CSS variable --intro-fade-duration)

                        try {
                            if (overlay) {
                                overlay.classList.add('fade-out');
                            }
                        } catch (e) {}

                        // After the fade completes, compute destination and run the move/roll.
                        setTimeout(() => {
                            // Ensure all visual glow effects are removed before we start the move/roll
                            try {
                                if (overlay) {
                                    try { overlay.classList.remove('gleam-active', 'gleam'); } catch (e) {}
                                    try { overlay.classList.remove('shine', 'white', 'golden', 'twinkle', 'circle-glow'); } catch (e) {}
                                }
                                // clear any filters applied to the <object> or inner svg as an extra safety
                                try {
                                    const svgObjClear = document.getElementById('logo-intro-img');
                                    if (svgObjClear) {
                                        try {
                                            const inner = svgObjClear.contentDocument && svgObjClear.contentDocument.querySelector && svgObjClear.contentDocument.querySelector('svg');
                                            if (inner) inner.style.filter = '';
                                            else svgObjClear.style.filter = '';
                                        } catch (e) {
                                            svgObjClear.style.filter = '';
                                        }
                                    }
                                } catch (e) {}
                            } catch (e) {}

                            // Compute destination translation relative to viewport top-left using px
                            const targetRect = targetLogo.getBoundingClientRect();
                            const targetCenterX = targetRect.left + targetRect.width / 2;
                            const targetCenterY = targetRect.top + targetRect.height / 2;
                            const viewportCenterX = Math.round(window.innerWidth / 2);
                            // deltaX is how much we need to shift horizontally from centered X
                            const deltaX = Math.round(targetCenterX - viewportCenterX);

                            // Compute current intro rect and scale factor
                            const introRect = introInner.getBoundingClientRect();
                            const introH = introRect.height;
                            const scale = (targetRect.width / introRect.width) || 0.22;

                            // Final Y should place the element centered on the header logo
                            const finalY = Math.round(targetCenterY - introH / 2);

                            // STEP 2: move and roll another 360deg while scaling down
                            requestAnimationFrame(() => {
                                // Animate to header with improved easing
                                introInner.style.transition = `transform ${moveDuration}ms ${moveEasing}`;
                                introInner.style.transform = `translate(calc(-50% + ${deltaX}px), ${finalY}px) rotate(720deg) scale(${scale})`;

                                // Add gentle overshoot/settle effect for perfect stop
                                setTimeout(() => {
                                    // Slightly overshoot and then settle back for a natural finish
                                    introInner.style.transition = 'transform 320ms cubic-bezier(.42,0,.58,1)';
                                    introInner.style.transform = `translate(calc(-50% + ${deltaX}px), ${finalY+8}px) rotate(715deg) scale(${scale*0.98})`;
                                    setTimeout(() => {
                                        introInner.style.transition = 'transform 260ms cubic-bezier(.42,0,.58,1)';
                                        introInner.style.transform = `translate(calc(-50% + ${deltaX}px), ${finalY}px) rotate(720deg) scale(${scale})`;
                                    }, 220);
                                }, moveDuration - 180);
                            });

                            // After move completes, reveal header logo and cleanup
                            tMoveEnd = setTimeout(() => {
                                // Reveal and pop the real header logo
                                targetLogo.classList.remove('intro-hidden');
                                targetLogo.classList.add('intro-pop');

                                // Reveal content and remove overlay after a short fade
                                document.body.classList.add('content-loaded');
                                document.body.style.overflow = originalOverflow;
                                // Persist that the intro has played so it won't run again on refresh
                                try { if (sessionStorage && sessionStorage.setItem) sessionStorage.setItem(playedKey, '1'); } catch (e) {}
                                // Start home text animations
                                try {
                                    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                                    if (!prefersReduced) document.body.classList.add('home-anim-play');
                                } catch (e) {}
                                const loadingScreen = document.querySelector('.loading-screen');
                                if (loadingScreen) loadingScreen.remove();

                                setTimeout(() => {
                                    try { overlay.classList.remove('shine','white','circle-glow'); } catch (e) {}
                                    try { overlay.remove(); } catch (e) {}
                                    // cleanup inline styles so logo isn't centered permanently
                                    try {
                                        // clear any transforms/filters applied during animation
                                        introInner.style.willChange = '';
                                        introInner.style.transition = '';
                                        introInner.style.position = '';
                                        introInner.style.left = '';
                                        introInner.style.top = '';
                                        introInner.style.transform = '';
                                        introInner.style.zIndex = '';
                                        introInner.style.filter = '';
                                        // Force a reflow/repaint so the header image paints crisply
                                        void document.body.offsetHeight;
                                    } catch (e) {}
                                    if (live) live.textContent = 'Opening animation finished.';
                                }, 260);

                                // Intentionally not persisting a 'played' flag so the intro runs on every refresh
                            }, moveDuration + 40);

                        }, fadeDuration);

                    }, shineDuration);

                // Ensure twinkle is removed if it lingers (safety timeout)
                try {
                    tTwinkle = setTimeout(() => { try { overlay.classList.remove('twinkle'); } catch (e) {} }, Math.max(600, shineDuration + 200));
                } catch (e) {}

            }, riseDuration + pauseAfterRise);
        } catch (err) {
            console.error('Intro sequence error:', err);
            const overlay = document.getElementById('logo-intro-overlay');
            if (overlay) overlay.remove();
            document.body.classList.add('content-loaded');
        }
    }

    // Start intro after window load, logo image load, and fonts ready
    window.addEventListener('load', () => {
        let introStarted = false;
        const startIntro = () => {
            if (!introStarted) {
                introStarted = true;
                    // Extra guard: only start if overlay still exists (wasn't removed prematurely)
                    const overlay = document.getElementById('logo-intro-overlay');
                    if (!overlay) {
                        // If overlay missing, reveal content immediately (avoid stuck hidden state)
                        document.body.classList.add('content-loaded');
                        return;
                    }
                    setTimeout(() => introLogoSequence(), 80);
            }
        };
        
        const logoImg = document.getElementById('logo-intro-img');
        const logoPng = new Image();
        logoPng.src = 'assets/images/logo.png';
        
        // Wait for SVG logo to load
        const waitForSvgLogo = new Promise(resolve => {
            if (!logoImg) return resolve();
            
            // For SVG object elements, check if contentDocument is loaded
            const checkSvgLoaded = () => {
                try {
                    if (logoImg.contentDocument && logoImg.contentDocument.querySelector('svg')) {
                        return true;
                    }
                } catch (e) {
                    // If accessing contentDocument fails, check complete status
                    if (logoImg.complete) return true;
                }
                return false;
            };
            
            if (checkSvgLoaded()) {
                resolve();
            } else {
                logoImg.addEventListener('load', resolve, { once: true });
                logoImg.addEventListener('error', resolve, { once: true });
                // Extra safety check for SVG
                setTimeout(() => {
                    if (checkSvgLoaded()) resolve();
                }, 500);
            }
        });
        
        // Wait for PNG logo to load
        const waitForPngLogo = new Promise(resolve => {
            if (logoPng.complete) {
                resolve();
            } else {
                logoPng.addEventListener('load', resolve, { once: true });
                logoPng.addEventListener('error', resolve, { once: true });
            }
        });
        
        // Wait for web fonts (if supported)
        const waitForFonts = (window.document.fonts && window.document.fonts.ready) ? window.document.fonts.ready : Promise.resolve();
        
        // Fallback: always start intro after 2 seconds if resources haven't loaded
        const fallback = setTimeout(startIntro, 2000);
        
        Promise.all([waitForSvgLogo, waitForPngLogo, waitForFonts]).then(() => {
            clearTimeout(fallback);
            // Small delay to ensure everything is painted
            setTimeout(startIntro, 100);
        }).catch(() => {
            // If any error occurs, start intro anyway
            clearTimeout(fallback);
            setTimeout(startIntro, 100);
        });
    });

// ======================= CORE UI HELPERS (RESTORED) =======================
function initMobileMenu() {
    const button = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    if (!button || !menu) return;

    button.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });

    // Close menu when a link is clicked
    menu.addEventListener('click', (e) => {
        if (e.target.matches('a')) menu.classList.add('hidden');
    });
}

// ======================= TEAM SECTION =======================
function initTeamSection() {
    const teamSection = document.getElementById('team');
    if (!teamSection) return;
    // Fallback image if any team image fails
    const imgs = teamSection.querySelectorAll('img');
    const fallback = 'assets/images/logo.png';
    imgs.forEach(img => {
        img.addEventListener('error', () => {
            if (img.src.endsWith('logo.png')) return;
            img.src = fallback;
        });
    });
}

// ======================= OUTLETS (cards + details panel) =======================
function initOutlets() {
    // Safety: ensure Show Less is hidden at the very start
    const _lessBtnEarly = document.getElementById('outlet-show-less');
    if (_lessBtnEarly) _lessBtnEarly.classList.add('hidden');
    // Outlet search bar logic
    const searchInput = document.getElementById('outlet-search');
    const grid = document.getElementById('outlet-cards-grid');
    let noResultsMsg = null;
    if (searchInput && grid) {
        const showMoreBtn = document.getElementById('outlet-show-more');
        const showLessBtn = document.getElementById('outlet-show-less');
        const statusEl = document.getElementById('outlet-search-status');
        // Ensure correct initial state for toggles at init
        if (showMoreBtn) showMoreBtn.classList.remove('hidden');
        if (showLessBtn) showLessBtn.classList.add('hidden');
        let debounceTimer = null;
        function revealAllOutlets() {
            // If Show More is visible, click it to reveal all outlets
            if (showMoreBtn && !showMoreBtn.classList.contains('hidden')) {
                showMoreBtn.click();
            }
        }
        function updateSearch() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const q = searchInput.value.trim().toLowerCase();
                if (q) {
                    // Reveal all to include Show More items
                    revealAllOutlets();
                    // Hide Show Less while searching to avoid confusion
                    if (showLessBtn) showLessBtn.classList.add('hidden');
                } else {
                    // Restore initial view when query cleared
                    grid.querySelectorAll('.extra-outlet').forEach(el => el.remove());
                    grid.classList.remove('lg:grid-cols-3');
                    grid.classList.add('lg:grid-cols-4');
                    if (showMoreBtn) showMoreBtn.classList.remove('hidden');
                    if (showLessBtn) showLessBtn.classList.add('hidden');
                }

                let visibleCount = 0;
                grid.querySelectorAll('[data-outlet]').forEach(card => {
                    const name = (card.getAttribute('data-outlet') || '').toLowerCase();
                    const show = !q || name.includes(q);
                    card.style.display = show ? '' : 'none';
                    if (show) visibleCount++;
                });

                if (!visibleCount) {
                    if (!noResultsMsg) {
                        noResultsMsg = document.createElement('div');
                        noResultsMsg.textContent = 'No outlets found.';
                        noResultsMsg.className = 'text-center text-gray-400 text-lg font-medium mt-8';
                        grid.parentNode.insertBefore(noResultsMsg, grid.nextSibling);
                    }
                } else if (noResultsMsg) {
                    noResultsMsg.remove();
                    noResultsMsg = null;
                }

                if (statusEl) {
                    statusEl.textContent = q ? `${visibleCount} result${visibleCount === 1 ? '' : 's'} for "${q}"` : '';
                }
            }, 180);
        }
        searchInput.addEventListener('input', updateSearch);
    }
    const container = document.getElementById('outlets');
    if (!container) return;

    const cards = container.querySelectorAll('[data-outlet]');
    const showMoreBtn = document.getElementById('outlet-show-more');
    const moreHint = document.getElementById('outlet-more-hint');
    // Modal elements
    const modal = document.getElementById('outlet-modal');
    const modalContent = document.getElementById('outlet-modal-content');
    const titleEl = document.getElementById('outlet-modal-title');
    const imageEl = document.getElementById('outlet-modal-image');
    const prevBtn = document.getElementById('outlet-modal-prev');
    const nextBtn = document.getElementById('outlet-modal-next');
    const imageCountEl = document.getElementById('outlet-modal-image-count');
    const contactEl = document.getElementById('outlet-modal-contact');
    const locationEl = document.getElementById('outlet-modal-location');
    const mapsLink = document.getElementById('outlet-modal-maps');
    const closeBtn = document.getElementById('outlet-modal-close');

    if (!cards.length || !modal || !modalContent || !titleEl || !imageEl || !prevBtn || !nextBtn || !imageCountEl || !contactEl || !locationEl || !closeBtn || !mapsLink) return;

    // Data model: names and folders; images exclude Main.jpg for gallery.
    const OUTLETS = [
        { name: 'Nedumbasseri', folder: 'Nadumbasseri', images: [
            'photo_2025-10-09_22-21-44.jpg'
        ], contact: '08893410410', location: 'Nedumbasseri, Kerala, India', maps: 'https://www.google.com/maps/search/?api=1&query=Al-Reem%20Mandi%20Nedumbasseri' },
        { name: 'Aroor', folder: 'Aroor', images: [
            'photo_2025-10-09_22-21-53.jpg',
            'photo_2025-10-09_22-21-58.jpg'
        ], contact: '09497510510', location: 'Aroor, Kerala, India', maps: 'https://maps.app.goo.gl/Gvpd1CRSdZjA1KXU7' },
        { name: 'Alappuzha', folder: 'Alappuzha', images: [
            'photo_2025-10-09_22-22-05.jpg',
            'photo_2025-10-09_22-22-09.jpg',
            'photo_2025-10-09_22-22-13.jpg'
        ], contact: '+91 7025410410', location: 'Alappuzha, Kerala, India', maps: 'https://www.google.com/maps/search/?api=1&query=Al-Reem%20Mandi%20Alappuzha' },
        { name: 'Muvattupuzha', folder: 'Muvattupuzha', images: [
            'photo_2025-10-09_22-23-04.jpg'
        ], contact: '09048410410', location: 'Muvattupuzha, Kerala, India', maps: 'https://www.google.com/maps/search/?api=1&query=Al-Reem%20Mandi%20Muvattupuzha' },
        { name: 'Kodungallur', folder: 'Kodungallur', images: [
            'photo_2025-10-09_22-23-15.jpg',
            'photo_2025-10-09_22-23-18.jpg'
        ], contact: '08589910910', location: 'Kodungallur, Kerala, India', maps: 'https://www.google.com/maps/search/?api=1&query=Al-Reem%20Mandi%20Kodungallur' },
        { name: 'Thammanam', folder: 'Thammanam', images: [
            'photo_2025-10-09_22-23-26.jpg'
        ], contact: '07034710710', location: 'Thammanam, Kerala, India', maps: 'https://www.google.com/maps/search/?api=1&query=Al-Reem%20Mandi%20Thammanam' },
        { name: 'Edappally', folder: 'Edappally', images: [
            'photo_2025-10-09_22-23-34.jpg',
            'photo_2025-10-09_22-23-37.jpg',
            'photo_2025-10-09_22-23-40.jpg'
        ], contact: '9072 210210', location: 'Edappally, Kerala, India', maps: 'https://www.google.com/maps/search/?api=1&query=Al-Reem%20Mandi%20Edappally' },
        { name: 'Kathrikadavu', folder: 'Kathrikadavu', images: [
            'photo_2025-10-09_22-23-47.jpg',
            'photo_2025-10-09_22-23-51.jpg'
        ], contact: '09574810810', location: 'Kathrikadavu, Kerala, India', maps: 'https://www.google.com/maps/search/?api=1&query=Al-Reem%20Mandi%20Kathrikadavu' },
        { name: 'Kottakkal', folder: 'Kottakkal', images: [
            'photo_2025-10-10_22-49-51.jpg',
            'photo_2025-10-10_22-49-56.jpg'
        ], contact: '09747410310', location: 'Kottakkal, Kerala, India', maps: 'https://www.google.com/maps/search/?api=1&query=Al-Reem%20Mandi%20Kottakkal' },
        { name: 'Chammed', folder: 'Chammed', images: [
            'photo_2025-10-10_22-50-48.jpg',
            'photo_2025-10-10_22-50-53.jpg'
        ], contact: '08606410410', location: 'Chammed, Kerala, India', maps: 'https://maps.app.goo.gl/UANTsKjWPiMnmirq7' },
        { name: 'Thrissur', folder: 'Thrissur', images: [
            'photo_2025-10-10_22-51-18.jpg',
            'photo_2025-10-10_22-51-21.jpg',
            'photo_2025-10-10_22-51-26.jpg',
            'photo_2025-10-10_22-51-29.jpg',
            'photo_2025-10-10_22-51-33.jpg'
        ], contact: '09947955955', location: 'Thrissur, Kerala, India', maps: 'https://www.google.com/maps/search/?api=1&query=Al-Reem%20Mandi%20Thrissur' },
        { name: 'Wayanad', folder: 'Wayanad', images: [
            'photo_2025-10-10_22-52-43.jpg',
            'photo_2025-10-10_22-52-46.jpg',
            'photo_2025-10-10_22-52-50.jpg'
        ], contact: '09544810810', location: 'Wayanad, Kerala, India', maps: 'https://www.google.com/maps/search/?api=1&query=Al-Reem%20Mandi%20Wayanad' },
        { name: 'Coimbatore', folder: 'Coimbatore', images: [
            'photo_2025-10-10_22-51-01.jpg'
        ], contact: '+91 8453410410', location: 'Coimbatore, Tamil Nadu, India', maps: 'https://www.google.com/maps/search/?api=1&query=Al-Reem%20Mandi%20Coimbatore' },
        { name: 'Palakkad', folder: 'Palakkad', images: [
            'photo_2025-10-10_22-51-40.jpg',
            'photo_2025-10-10_22-51-45.jpg'
        ], contact: '914-241-0410', location: 'Palakkad, Kerala, India', maps: 'https://www.google.com/maps/search/?api=1&query=Al-Reem%20Mandi%20Palakkad' },
        { name: 'Sri lanka (Colombo)', folder: 'Sri lanka (Colombo)', images: [
            'photo_2025-10-10_22-51-05.jpg',
            'photo_2025-10-10_22-51-10.jpg'
        ], contact: '+94114754500', location: 'Colombo, Sri Lanka', maps: 'https://www.google.com/maps/search/?api=1&query=Al-Reem%20Mandi%20Sri%20lanka%20(Colombo)' },
        { name: 'Sri Lanka (Negombo)', folder: 'Sri Lanka (Negombo)', images: [
            'photo_2025-10-10_22-52-04.jpg',
            'photo_2025-10-10_22-52-10.jpg'
        ], contact: '+94312263555', location: 'Negombo, Sri Lanka', maps: 'https://www.google.com/maps/search/?api=1&query=Al-Reem%20Mandi%20Sri%20Lanka%20(Negombo)' },
        { name: 'Saudi Arabia (Jizan)', folder: 'Saudi Arabia (Jizan)', images: [
            'photo_2025-10-10_22-51-57.jpg'
        ], contact: 'Nil', location: 'Jizan, Saudi Arabia', maps: null },
    ];

    const outletByName = new Map(OUTLETS.map(o => [o.name, o]));

    // Ensure Back/Forward navigation can reopen an outlet modal when the user returns
    // We push a small history state before navigating away to external Maps. When
    // the user comes back (Back button), popstate will fire and we reopen the modal.
    window.addEventListener('popstate', (ev) => {
        try {
            const st = ev.state;
            if (st && st.outletOpen) {
                // Only open if modal is currently closed
                if (modal && modal.classList.contains('hidden')) {
                    // Small timeout to ensure DOM is settled when page becomes visible again
                    setTimeout(() => {
                        populatePanel(st.outletOpen, { fromPop: true });
                    }, 30);
                }
            }
        } catch (e) { /* ignore */ }
    });
    // Update dynamic outlet count under the heading
    const outletCountEl = document.getElementById('outlet-count');
    if (outletCountEl) {
        outletCountEl.textContent = String(OUTLETS.length);
    }

    let currentImages = [];
    let currentIdx = 0;

    function showImage(idx) {
        if (!currentImages.length) {
            imageEl.src = '';
            imageEl.alt = 'No photo available';
            imageCountEl.textContent = 'No photos available.';
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            return;
        }
        imageEl.src = currentImages[idx].src;
        imageEl.alt = currentImages[idx].alt;
        imageCountEl.textContent = `Photo ${idx + 1} of ${currentImages.length}`;
        prevBtn.disabled = idx === 0;
        nextBtn.disabled = idx === currentImages.length - 1;
    }

    function populatePanel(outletName, opts = {}) {
        const data = outletByName.get(outletName);
        if (!data) return;

        // Title
        titleEl.textContent = data.name;

        // Contact & Location
        contactEl.textContent = data.contact || 'To be updated';
        locationEl.textContent = data.location || 'To be updated';

        // Maps link
        if (data.maps) {
            mapsLink.href = data.maps;
            // Instead of opening a new tab, push a small history state and navigate in the
            // same tab. This lets the Back button return here and popstate will reopen the modal.
            mapsLink.removeAttribute('target');
            mapsLink.removeAttribute('rel');
            mapsLink.classList.remove('pointer-events-none', 'opacity-50');
            mapsLink.setAttribute('aria-disabled', 'false');

            // Ensure we don't stack multiple handlers: assign onclick directly
            mapsLink.onclick = (e) => {
                // If this click was triggered from a popstate-induced populatePanel, do default
                if (opts.fromPop) return true;
                e.preventDefault();
                try {
                    // Push a short-lived state to the history so returning via Back gives us
                    // a popstate with { outletOpen: outletName }
                    history.pushState({ outletOpen: outletName }, '');
                } catch (err) { /* ignore */ }
                // Navigate to the external maps URL in the same tab
                window.location.href = data.maps;
                return false;
            };
        } else {
            // Remove any custom onclick and target/rel when there is no external maps URL
            mapsLink.onclick = null;
            mapsLink.removeAttribute('target');
            mapsLink.removeAttribute('rel');
            mapsLink.href = '#';
            mapsLink.classList.add('pointer-events-none', 'opacity-50');
            mapsLink.setAttribute('aria-disabled', 'true');
        }

        // Use explicit image list for gallery
        const base = `assets/images/${data.folder}/`;
        currentImages = [{
            src: base + 'Main.jpg',
            alt: `${data.name} main photo`
        }];
        if (data.images && data.images.length) {
            currentImages = currentImages.concat(
                data.images.map((file, idx) => ({
                    src: base + file,
                    alt: `${data.name} photo ${idx + 2}`
                }))
            );
        }
        currentIdx = 0;
        showImage(currentIdx);
        // Open modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);
    }

    prevBtn.addEventListener('click', () => {
        if (currentIdx > 0) {
            currentIdx--;
            showImage(currentIdx);
        }
    });
    nextBtn.addEventListener('click', () => {
        if (currentIdx < currentImages.length - 1) {
            currentIdx++;
            showImage(currentIdx);
        }
    });

    function attachCardHandlers(btn) {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-outlet');
            populatePanel(name);
        });
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const name = btn.getAttribute('data-outlet');
                populatePanel(name);
            }
        });
    }

    cards.forEach((el) => { if (!el.__bound) { attachCardHandlers(el); el.__bound = true; } });

    const closeModal = () => {
        modal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.95)';
        document.body.style.overflow = '';
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 250);
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Show More button: dynamically add additional outlets
    if (showMoreBtn) {
        const grid = document.getElementById('outlet-cards-grid');
        const showLessBtn = document.getElementById('outlet-show-less');
        const ADDITIONAL_NAMES = [
            'Kottakkal',
            'Chammed',
            'Thrissur',
            'Wayanad',
            'Thamarassery',
            'Coimbatore',
            'Palakkad',
            'Sri lanka (Colombo)',
            'Sri Lanka (Negombo)',
            'Saudi Arabia (Jizan)'
        ];

        function createCard(outlet) {
            const btn = document.createElement('button');
            btn.className = 'card outlet-card p-0 text-center scroll-animate focus:outline-none focus:ring-2 focus:ring-red-700 group extra-outlet';
            btn.setAttribute('data-outlet', outlet.name);
            btn.innerHTML = `
                <img src="assets/images/${outlet.folder}/Main.jpg" alt="AL-REEM MANDI - ${outlet.name} main" class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-[1.02]" loading="lazy">
                <div class="p-5">
                    <h3 class="text-xl font-bold text-white flex items-center justify-center gap-2">
                        <svg class="w-5 h-5 text-accent-red -mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21c-4.418 0-8-5.373-8-9a8 8 0 1116 0c0 3.627-3.582 9-8 9z"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>
                        ${outlet.name}
                    </h3>
                </div>`;
            const img = btn.querySelector('img');
            // Fallback if Main.jpg is not present yet
            img.addEventListener('error', () => {
                img.src = 'assets/images/logo.png';
                img.classList.remove('object-cover');
                img.classList.add('object-contain', 'bg-black');
            }, { once: true });
            return btn;
        }

        showMoreBtn.addEventListener('click', () => {
            if (!grid) return;
            const fragment = document.createDocumentFragment();
            ADDITIONAL_NAMES.forEach(name => {
                const data = outletByName.get(name);
                if (!data) return;
                const cardEl = createCard(data);
                fragment.appendChild(cardEl);
            });
            grid.appendChild(fragment);
            // Attach handlers after insertion
            grid.querySelectorAll('[data-outlet]').forEach(el => {
                if (!el.__bound) { attachCardHandlers(el); el.__bound = true; }
            });

            // Animate in newly added cards
            requestAnimationFrame(() => {
                grid.querySelectorAll('.scroll-animate').forEach(el => el.classList.add('is-visible'));
            });

            // Update UI
            showMoreBtn.classList.add('hidden');
            if (showLessBtn) showLessBtn.classList.remove('hidden');
            grid.classList.remove('lg:grid-cols-4');
            grid.classList.add('lg:grid-cols-3');
            if (moreHint) {
                moreHint.classList.add('hidden');
            }
        });

        if (showLessBtn) {
            showLessBtn.addEventListener('click', () => {
                // Remove extra outlet cards
                grid.querySelectorAll('.extra-outlet').forEach(el => el.remove());
                // Restore grid columns
                grid.classList.remove('lg:grid-cols-3');
                grid.classList.add('lg:grid-cols-4');
                // Toggle buttons
                showLessBtn.classList.add('hidden');
                showMoreBtn.classList.remove('hidden');
                showMoreBtn.disabled = false;
                showMoreBtn.textContent = 'Show More';
                if (moreHint) {
                    moreHint.classList.add('hidden');
                }
                // Scroll to top of outlets section for a smooth UX
                const outletsSection = document.getElementById('outlets');
                if (outletsSection) {
                    outletsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    }
}

function initSmoothScroll() {
    const header = document.getElementById('header');
    const headerOffset = header ? header.offsetHeight - 5 : 0;
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId.length > 1) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    const top = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        });
    });
}

function initActiveNavOnScroll() {
    const links = Array.from(document.querySelectorAll('header a.nav-link'));
    if (!links.length) return;
    const sections = links
        .map(a => {
            const id = a.getAttribute('href');
            if (!id || !id.startsWith('#') || id.length === 1) return null;
            const el = document.querySelector(id);
            return el ? { id, el, link: a } : null;
        })
        .filter(Boolean);

    const setActive = (id) => {
        links.forEach(l => l.classList.remove('active'));
        const target = links.find(l => l.getAttribute('href') === id);
        if (target) target.classList.add('active');
    };

    const onScroll = () => {
        const scrollPos = window.scrollY + (window.innerHeight * 0.25);
        let current = sections[0]?.id;
        for (const s of sections) {
            const rect = s.el.getBoundingClientRect();
            const top = window.scrollY + rect.top;
            if (scrollPos >= top) current = s.id;
        }
        if (current) setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('hashchange', () => setActive(location.hash));
    onScroll();
}

function initStickyHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    const toggle = () => {
        if (window.scrollY > 50) header.classList.add('header-scrolled');
        else header.classList.remove('header-scrolled');
    };
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
}

function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    
    // Keep button hidden until intro sequence completes
    let introComplete = document.body.classList.contains('content-loaded');
    
    if (!introComplete) {
        // Wait for intro to complete before showing button
        const checkIntro = () => {
            if (document.body.classList.contains('content-loaded')) {
                btn.style.display = '';
                introComplete = true;
            }
        };
        
        // Use MutationObserver for reliable detection
        const observer = new MutationObserver(checkIntro);
        observer.observe(document.body, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
        
        // Also check periodically as fallback
        const fallbackCheck = setInterval(() => {
            if (document.body.classList.contains('content-loaded')) {
                btn.style.display = '';
                introComplete = true;
                clearInterval(fallbackCheck);
                observer.disconnect();
            }
        }, 100);
    } else {
        // Intro already complete, show button immediately
        btn.style.display = '';
    }
    
    const showAt = 400; // px
    const onScroll = () => {
        // Don't show button if intro isn't complete yet
        if (!introComplete) return;
        
        if (window.scrollY > showAt) {
            btn.classList.remove('pointer-events-none');
            btn.style.opacity = '1';
        } else {
            btn.classList.add('pointer-events-none');
            btn.style.opacity = '0';
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('.scroll-animate');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('story-text-container')) return;
                requestAnimationFrame(() => {
                    entry.target.classList.add('is-visible');
                });
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '80px 0px' });
    scrollElements.forEach(el => scrollObserver.observe(el));
}

function initWhyUsParallax() {
    const whyUsSection = document.getElementById('why-us');
    if (!whyUsSection) return;

    // Respect user preference for reduced motion
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        // Keep a static focal point and exit
        whyUsSection.style.setProperty('--why-bg-y', '8%');
        return;
    }

    // Use eased interpolation and a CSS variable for silky movement
    const MIN_Y = 8;  // prevent showing the very top sliver of the image
    const MAX_Y = 72; // cap the very bottom at 72% to cut off more bottom
    let targetY = MIN_Y;
    let currentY = MIN_Y;
    let rafId = null;

    const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic

    const animate = () => {
        // Interpolate towards target for smoothness
        const diff = targetY - currentY;
        if (Math.abs(diff) < 0.02) {
            currentY = targetY;
        } else {
            // Blend using easing over small steps
            currentY += diff * 0.12; // smoothing factor
        }
        // Update CSS variable to avoid style recalcs on every property
        whyUsSection.style.setProperty('--why-bg-y', currentY.toFixed(2) + '%');
        if (Math.abs(diff) >= 0.02) rafId = requestAnimationFrame(animate);
        else rafId = null;
    };

    const computeTarget = () => {
        const rect = whyUsSection.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.bottom < -1 || rect.top > vh + 1) return; // out of view

        const sectionTop = window.scrollY + rect.top;
        const totalScroll = vh + rect.height;
        const scrolled = window.scrollY + vh - sectionTop;
        let progress = scrolled / totalScroll;
        progress = Math.max(0, Math.min(1, progress));
        // Map progress to range with easing for a softer curve
        const eased = ease(progress);
        targetY = MIN_Y + eased * (MAX_Y - MIN_Y);
        if (!rafId) rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', computeTarget, { passive: true });
    window.addEventListener('resize', computeTarget, { passive: true });
    // Initialize once
    computeTarget();
}

function initHomePageAnimations() {
    const homeLogo = document.getElementById('home-logo');
    let isAtTop = true; 
    
    const restartLogoAnimation = () => {
        if (!homeLogo) return;
        // Prefer Web Animations API with additive composite so we rotate on top of any
        // existing transforms (translate/scale) applied by other animations (homeTextIn, intro-pop).
        try {
            if (typeof homeLogo.getAnimations === 'function') {
                // Cancel any previous rotate-only animations to avoid stacking
                homeLogo.getAnimations().forEach(a => {
                    try {
                        const frames = (a.effect && a.effect.getKeyframes) ? a.effect.getKeyframes() : [];
                        const hasRotate = frames.some(f => JSON.stringify(f).includes('rotate('));
                        if (hasRotate) a.cancel();
                    } catch (e) {}
                });

                // Create an additive rotate animation so it doesn't clobber translate/scale
                homeLogo.animate(
                    [ { transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' } ],
                    {
                        duration: 1200,
                        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                        iterations: 1,
                        fill: 'none',
                        composite: 'add'
                    }
                );
                return;
            }
        } catch (e) {
            // fall through to class-based fallback
            console.warn('WAAPI rotation failed, falling back to CSS class method', e);
        }

        // Fallback for older browsers: toggle CSS class which animates transform.
        homeLogo.classList.remove('logo-rotate');
        void homeLogo.offsetWidth; // force reflow
        homeLogo.classList.add('logo-rotate');
    };
    
    if (homeLogo) {
        homeLogo.classList.add('logo-rotate');
    }

    const handleTopScrollCheck = () => {
        if (window.scrollY === 0) {
            if (!isAtTop) {
                restartLogoAnimation();
                isAtTop = true;
            }
        } else {
            if (isAtTop) isAtTop = false;
        }
    };
    window.addEventListener('scroll', handleTopScrollCheck);
    
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && window.scrollY === 0) {
            restartLogoAnimation();
            isAtTop = true;
        }
    });

    // Observe #home section so the logo rotates each time the section is scrolled into view
    // Do not trigger during the intro sequence (overlay playing) or when reduced motion is preferred
    try {
        const homeSection = document.getElementById('home');
        if (homeSection && 'IntersectionObserver' in window) {
            const homeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Skip if intro overlay is currently playing
                        const overlay = document.getElementById('logo-intro-overlay');
                        const introPlaying = overlay && overlay.classList.contains('playing');
                        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                        if (!introPlaying && !prefersReduced) {
                            // Restart the logo animation on every entry (re-entry)
                            restartLogoAnimation();
                        }
                    }
                });
            }, { threshold: 0.35 });
            homeObserver.observe(homeSection);
        }
    } catch (e) {
        // Defensive: don't break the page if observer setup fails
        console.warn('home logo observer setup failed', e);
    }
}

function initStorySlideshow() {
    const slideshowContainer = document.querySelector('.story-slideshow');
    if(!slideshowContainer) return;
    const storySlides = slideshowContainer.querySelectorAll('img');
    let currentSlideIndex = 0;
    
    if(storySlides.length > 0) {
        setInterval(() => {
            storySlides[currentSlideIndex].classList.remove('visible');
            currentSlideIndex = (currentSlideIndex + 1) % storySlides.length;
            storySlides[currentSlideIndex].classList.add('visible');
        }, 5000);
    }
}

function initAboutSectionAnimations() {
    const storyTextContainer = document.querySelector('.story-text-container');
    const aboutLogo = document.getElementById('about-logo');
    const aboutText = document.getElementById('about-text');
    const eventDetailsContainer = document.getElementById('event-details-container');

    if (!storyTextContainer || !aboutLogo || !aboutText) return;
    
    const originalText = "Al-Reem Mandi began in Athani, Ernakulam, born from a spark of culinary passion. Since 2010, we’ve introduced Kerala to the authentic soul of Arabian Mandi. Tradition guides our recipes while innovation keeps every plate fresh. We source quality ingredients and honor time-tested techniques. Our chefs are artisans, perfecting flavor, texture, and balance daily. What started as one kitchen has grown into a trusted family of outlets. Guests return for warmth, generosity, and that unmistakable Al‑Reem taste. We serve meals that are memorable, comforting, and genuinely Arabian. Welcome to Al‑Reem—where hospitality, heritage, and flavor meet.";
    aboutText.innerHTML = '&nbsp;'; // Use a non-breaking space to maintain height

    // Ensure the about logo rotates on each section visit (re-entry)
    const restartAnimation = (el, cls) => {
        el.classList.remove(cls);
        void el.offsetWidth; // force reflow
        el.classList.add(cls);
    };

    let hasTyped = false; // Only run typing once

    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                if (entry.target.classList.contains('story-text-container')) {
                    // Rotate logo every time the section is visited
                    restartAnimation(aboutLogo, 'logo-rotate');

                    // Trigger typing only once (first visit)
                    if (!hasTyped) {
                        hasTyped = true;
                        let typingInterval;
                        aboutLogo.addEventListener('animationend', () => {
                            let i = 0;
                            aboutText.innerHTML = '';
                            const textNode = document.createTextNode('');
                            aboutText.appendChild(textNode);
                            const cursorSpan = document.createElement('span');
                            cursorSpan.className = 'typing-cursor';
                            cursorSpan.innerHTML = '&nbsp;';
                            aboutText.appendChild(cursorSpan);

                            typingInterval = setInterval(() => {
                                // Remove any default full stop at the end
                                if (i < originalText.length) {
                                    // If last char and it's a dot, skip it
                                    if (i === originalText.length - 1 && originalText.charAt(i) === '.') {
                                        i++;
                                    } else {
                                        textNode.nodeValue += originalText.charAt(i);
                                        i++;
                                    }
                                } else {
                                    clearInterval(typingInterval);
                                    // Add plain red full stop (no animation)
                                    const redDot = document.createElement('span');
                                    redDot.className = 'plain-red-dot';
                                    redDot.innerHTML = '.';
                                    aboutText.appendChild(redDot);
                                    setTimeout(() => {
                                        if (aboutText.contains(cursorSpan)) {
                                            aboutText.removeChild(cursorSpan);
                                        }
                                    }, 2000);
                                }
                            }, 40);
                        }, { once: true });
                    }
                } else {
                    // For other observed elements, only animate once
                    aboutObserver.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.6 });

    aboutObserver.observe(storyTextContainer);
    if(eventDetailsContainer) aboutObserver.observe(eventDetailsContainer);
}

// Mobile: Our Story show more/less toggle
function initAboutShowMore() {
    const container = document.querySelector('#about .story-text-container');
    const text = document.getElementById('about-text');
    const btn = document.getElementById('about-toggle');
    if (!container || !text || !btn) return;

    // Only show the button on smaller screens (match our global mobile scope)
    const mq = window.matchMedia('(max-width: 720px)');

    // Helper: detect if text is visually clamped (overflowing)
    const isClamped = () => {
        // Force a reflow read to get up-to-date metrics
        return text.scrollHeight > text.clientHeight + 1; // +1 to avoid rounding issues
    };

    const refreshState = () => {
        if (!mq.matches) {
            // Desktop: reset to default state
            btn.classList.add('hidden');
            // Forcefully hide on desktop/big screens regardless of other classes
            try { btn.style.display = 'none'; } catch (e) {}
            container.classList.remove('expanded');
            btn.setAttribute('aria-expanded', 'false');
            btn.textContent = 'Show more';
            return;
        }

        // Mobile
        // If user expanded, keep the button visible for "Show less"
        if (container.classList.contains('expanded')) {
            btn.classList.remove('hidden');
            try { btn.style.removeProperty('display'); } catch (e) {}
            btn.setAttribute('aria-expanded', 'true');
            btn.textContent = 'Show less';
            return;
        }

        // Otherwise, show button only if text is actually clamped
        if (isClamped()) {
            btn.classList.remove('hidden');
            try { btn.style.removeProperty('display'); } catch (e) {}
            btn.setAttribute('aria-expanded', 'false');
            btn.textContent = 'Show more';
        } else {
            btn.classList.add('hidden');
            try { btn.style.display = 'none'; } catch (e) {}
            btn.setAttribute('aria-expanded', 'false');
            btn.textContent = 'Show more';
        }
    };

    // Initial evaluation with a tiny defer to allow styles to apply
    setTimeout(refreshState, 0);

    // Listen for changes
    if (mq.addEventListener) {
        mq.addEventListener('change', () => setTimeout(refreshState, 0));
    } else if (mq.addListener) {
        mq.addListener(() => setTimeout(refreshState, 0));
    }
    window.addEventListener('resize', () => setTimeout(refreshState, 50), { passive: true });

    btn.addEventListener('click', () => {
        const currentlyExpanded = container.classList.contains('expanded');

        // Prepare for animation
        const startHeight = text.clientHeight;
        const finishExpand = () => {
            const endHeight = text.scrollHeight;
            text.style.height = startHeight + 'px';
            text.style.overflow = 'hidden';
            requestAnimationFrame(() => {
                text.style.height = endHeight + 'px';
                const onEnd = () => {
                    text.style.height = '';
                    text.style.overflow = '';
                    text.removeEventListener('transitionend', onEnd);
                    setTimeout(refreshState, 0);
                };
                text.addEventListener('transitionend', onEnd, { once: true });
            });
        };

        const finishCollapse = () => {
            // After clamp reapplies, measure collapsed height and animate down
            requestAnimationFrame(() => {
                const target = text.clientHeight; // clamped height now
                text.style.height = startHeight + 'px';
                text.style.overflow = 'hidden';
                requestAnimationFrame(() => {
                    text.style.height = target + 'px';
                    const onEnd = () => {
                        text.style.height = '';
                        text.style.overflow = '';
                        text.removeEventListener('transitionend', onEnd);
                        setTimeout(refreshState, 0);
                    };
                    text.addEventListener('transitionend', onEnd, { once: true });
                });
            });
        };

        if (!currentlyExpanded) {
            // Expand
            container.classList.add('expanded');
            btn.setAttribute('aria-expanded', 'true');
            btn.textContent = 'Show less';
            finishExpand();
        } else {
            // Collapse
            btn.setAttribute('aria-expanded', 'false');
            btn.textContent = 'Show more';
            // Ensure we read the expanded height before clamping
            text.style.height = startHeight + 'px';
            text.style.overflow = 'hidden';
            // Apply clamp by removing expanded, then animate to clamped height
            container.classList.remove('expanded');
            finishCollapse();
        }
    });

    // Observe size/content changes to re-evaluate clamping (e.g., after typing animation)
    try {
        if ('ResizeObserver' in window) {
            const ro = new ResizeObserver(() => setTimeout(refreshState, 0));
            ro.observe(text);
        } else if ('MutationObserver' in window) {
            const mo = new MutationObserver(() => setTimeout(refreshState, 0));
            mo.observe(text, { childList: true, subtree: true, characterData: true });
        }
    } catch (e) { /* noop */ }
}

function initInteractiveMenu() {
    const menuGrid = document.getElementById('menu-grid');
    if (!menuGrid || typeof Isotope === 'undefined') {
        console.log('Isotope not loaded or menu-grid not found');
        return;
    }

    // Initialize Isotope after images are loaded
    imagesLoaded( menuGrid, function() {
        const iso = new Isotope(menuGrid, {
            itemSelector: '.menu-item-card',
            layoutMode: 'fitRows',
            transitionDuration: '0.6s',
        });

        // Filter functionality
        const filterContainer = document.getElementById('menu-filters');
        if (filterContainer) {
            filterContainer.addEventListener('click', (e) => {
                if (!e.target.matches('.menu-filter-btn')) return;
                
                const filterValue = e.target.getAttribute('data-filter');
                iso.arrange({ filter: filterValue });

                // Update active button state
                const currentActive = filterContainer.querySelector('.active');
                if (currentActive) currentActive.classList.remove('active');
                e.target.classList.add('active');
            });
        }
    });
    
    // Modal functionality
    const modal = document.getElementById('menu-modal');
    const modalContent = document.getElementById('modal-content');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalPrice = document.getElementById('modal-price');

    if (!modal || !modalCloseBtn || !modalImg || !modalTitle || !modalDescription || !modalPrice) return;

    menuGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.menu-item-card');
        if (!card) return;

        // Populate modal
        const title = card.querySelector('.menu-card-title').textContent;
        const description = card.querySelector('.menu-card-description').textContent;
        const price = card.querySelector('.menu-card-price').textContent;
        const imgSrc = card.querySelector('img').src;

        modalTitle.textContent = title;
        modalDescription.textContent = description + " A detailed description about the ingredients and the way it is cooked to make it more appealing.";
        modalPrice.textContent = price;
        modalImg.src = imgSrc;

        // Show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);
    });

    const closeModal = () => {
        modal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.95)';
        document.body.style.overflow = '';
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    };

    modalCloseBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Removed duplicate immediate initialization calls (handled on DOMContentLoaded)

// Single Large Dish Carousel on Existing Red Arc
function initArcDishCarousel() {
    const carousel = document.getElementById('single-arc-carousel');
    if (!carousel) return;

    const dishSlides = Array.from(carousel.querySelectorAll('.single-dish-slide'));
    const prevBtn = document.getElementById('single-arc-prev');
    const nextBtn = document.getElementById('single-arc-next');
    const chips = Array.from(document.querySelectorAll('.dish-chip'));
    const currentTitle = document.getElementById('current-dish-title');
    const currentDesc = document.getElementById('current-dish-desc');
    const ctaBtn = document.getElementById('current-dish-cta');
    const fullMenuOverlay = document.getElementById('full-menu-overlay');
    const fullMenuGrid = document.getElementById('full-menu-grid');
    const fullMenuBack = document.getElementById('full-menu-back');
    const chipList = document.querySelector('.dish-top-list');
    const chipWrapper = document.querySelector('.dish-top-list-wrapper');
    const chipPrev = document.querySelector('.dish-scroll-btn.prev');
    const chipNext = document.querySelector('.dish-scroll-btn.next');
    const activeIndicator = null;

    const dishData = [
            {
                name: 'Chicken Mandi',
                desc: 'Tender, marinated chicken cooked low and slow, served on fragrant basmati mandi rice infused with whole spices. Finished with a gentle smoke and paired with house salsa and garlic sauce.',
                details: [
                    'Protein: Chicken (marinated overnight with Arabian spices)',
                    'Rice: Long-grain basmati mandi rice infused with whole spices',
                    'Sides: Tomato salsa, garlic toum, and pickled vegetables',
                    'Finish: Light smoke for authentic Yemeni-style aroma'
                ],
                image: 'assets/images/Chicken Mandi.jpg'
            },
            {
                name: 'Chicken Masala Mandi',
                desc: 'Our classic chicken mandi enriched with a warm, aromatic masala. The spiced glaze clings to the chicken while the rice soaks up the juices for a deeper, fuller flavor.',
                details: [
                    'Protein: Chicken with aromatic masala glaze',
                    'Rice: Mandi rice enriched with masala juices',
                    'Sides: Tomato chutney and garlic sauce',
                    'Heat level: Medium-warm spice, balanced finish'
                ],
                image: 'assets/images/Chicken Masala Mandi.jpg'
            },
            {
                name: 'Alfaham Mandi',
                desc: 'Char-grilled alfaham chicken with a light, smoky crust and juicy center, plated over fluffy mandi rice. Balanced with cooling toum and a tangy tomato chutney.',
                details: [
                    'Protein: Char-grilled Alfaham chicken',
                    'Texture: Smoky crust with juicy center',
                    'Accompaniments: Toum and tangy tomato chutney',
                    'Best for: Grill lovers seeking balance of smoke and freshness'
                ],
                image: 'assets/images/Alfaham Mandi.jpg'
            },
            {
                name: 'Peri Peri Alfaham Mandi',
                desc: 'Alfaham chicken marinated in citrusy peri-peri for a lively heat that builds gently. Served over aromatic rice with mint yogurt to cool and round the spice.',
                details: [
                    'Marinade: Citrus-forward peri-peri',
                    'Heat: Lively, builds gently',
                    'Cooling: Mint yogurt on the side',
                    'Pairing: Fresh herbs and lime for brightness'
                ],
                image: 'assets/images/Peri Peri Alfaham Mandi.jpg'
            },
            {
                name: 'Honey Alfaham Mandi',
                desc: 'Smoky, char-grilled alfaham finished with a delicate honey glaze. A subtle sweet note complements the savory spice and the buttery grains of the mandi rice.',
                details: [
                    'Glaze: Delicate honey finish',
                    'Flavor: Sweet-savory balance over smoky grill notes',
                    'Texture: Caramelized edges, juicy inside',
                    'Sides: Garlic toum, house salsa'
                ],
                image: 'assets/images/Honey Alfaham Mandi.jpg'
            },
            {
                name: 'Mutton Mandi',
                desc: 'Fall-off-the-bone mutton, slow-cooked until buttery tender so the rendered juices enrich every spoon of rice. A saffron lift and fried onions add warmth and depth.',
                details: [
                    'Protein: Slow-cooked mutton, fall-off-the-bone',
                    'Enrichment: Rendered juices flavor the rice',
                    'Aromatics: Saffron and fried onions',
                    'Comfort: Rich, warming, deeply satisfying'
                ],
                image: 'assets/images/Mutton Mandi.jpg'
            },
            {
                name: 'Beef Mandi',
                desc: 'Slow-braised beef with a deep spice crust and succulent bite, resting on aromatic mandi rice. Rich, comforting, and balanced with pickles and a squeeze of lime.',
                details: [
                    'Protein: Braised beef with spice crust',
                    'Balance: Pickles and fresh lime',
                    'Texture: Succulent, hearty',
                    'Occasion: Perfect for rich, comforting meals'
                ],
                image: 'assets/images/Beef Mandi.jpg'
            },
            {
                name: 'Beef Ribs Mandi',
                desc: 'Meaty beef ribs cooked until spoon-tender, lightly lacquered and served over spiced mandi rice. Finished with herbs and pickled onions for brightness.',
                details: [
                    'Cut: Meaty beef ribs, spoon-tender',
                    'Finish: Light lacquer for shine',
                    'Lift: Herbs and pickled onions',
                    'Serving: Over aromatic mandi rice'
                ],
                image: 'assets/images/Beef Ribs Mandi.jpg'
            }
    ];

    if (dishSlides.length === 0) return;

    let currentIndex = 0;
    let isAnimating = false;

    // Helper: convert rgb to hsl (0..1 ranges)
    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h, s, l };
    }

    // Remove only border-connected near-black background using flood fill
    async function removeDarkBackground(img, opts = {}) {
        const {
            luminanceThreshold = 0.1,   // stricter luminance (0..1)
            saturationThreshold = 0.2,  // low saturation (0..1)
            hardRgbCutoff = 38,         // absolute 0..255 cutoff for very dark rgb
            featherPx = 1               // light feather along edges
        } = opts;

        if (!img || img.dataset.processed === '1') return;

        // Check cache first to avoid reprocessing
        try {
            const cached = sessionStorage.getItem(`dish_bg_${img.alt || img.src}`);
            if (cached) {
                img.src = cached;
                img.dataset.processed = '1';
                return;
            }
        } catch (e) {
            // Cache not available, continue processing
        }

        await new Promise(resolve => {
            if (img.complete) resolve();
            else {
                img.addEventListener('load', resolve, { once: true });
                img.addEventListener('error', resolve, { once: true });
            }
        });

        try {
            const natW = img.naturalWidth || img.width || 0;
            const natH = img.naturalHeight || img.height || 0;
            if (!natW || !natH) return;

            // Determine ideal processing size based on on-screen size and device pixel ratio
            const natMax = Math.max(natW, natH);
            // Use maximum available resolution up to a safe cap for performance
            const SAFE_MAX_EDGE = 6144;
            const targetMax = Math.min(natMax, SAFE_MAX_EDGE);
            const scale = targetMax / natMax;
            const targetW = Math.round(natW * scale);
            const targetH = Math.round(natH * scale);

            const canvas = document.createElement('canvas');
            canvas.width = targetW;
            canvas.height = targetH;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            // Use high quality resampling to preserve sharpness
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            if (window.createImageBitmap) {
                try {
                    const bmp = await createImageBitmap(img, { resizeWidth: targetW, resizeHeight: targetH, resizeQuality: 'high' });
                    ctx.drawImage(bmp, 0, 0, targetW, targetH);
                } catch (_) {
                    ctx.drawImage(img, 0, 0, targetW, targetH);
                }
            } else {
                ctx.drawImage(img, 0, 0, targetW, targetH);
            }
            const imgData = ctx.getImageData(0, 0, targetW, targetH);
            const data = imgData.data;

            // helper to test near-black low-sat pixel
            const isBg = (r, g, b) => {
                if (r <= hardRgbCutoff && g <= hardRgbCutoff && b <= hardRgbCutoff) return true;
                const { s, l } = rgbToHsl(r, g, b);
                return l <= luminanceThreshold && s <= saturationThreshold;
            };

            const W = targetW, H = targetH;
            const visited = new Uint8Array(W * H);
            const qx = new Int32Array(W * H);
            const qy = new Int32Array(W * H);
            let qs = 0, qe = 0;

            const push = (x, y) => { qx[qe] = x; qy[qe] = y; qe++; };
            const pop = () => ({ x: qx[qs], y: qy[qs++] });

            // seed from all four borders where pixel is background-like
            const seed = (x, y) => {
                const idx = (y * W + x) * 4;
                const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
                if (a === 0) return;
                if (isBg(r, g, b) && !visited[y * W + x]) {
                    visited[y * W + x] = 1;
                    push(x, y);
                }
            };
            for (let x = 0; x < W; x++) { seed(x, 0); seed(x, H - 1); }
            for (let y = 0; y < H; y++) { seed(0, y); seed(W - 1, y); }

            // 4-neighborhood flood fill
            while (qs < qe) {
                const { x, y } = pop();
                const idx = (y * W + x) * 4;
                data[idx + 3] = 0; // transparent
                if (x > 0) {
                    const nx = x - 1, ny = y; const ni = (ny * W + nx) * 4;
                    if (!visited[ny * W + nx]) {
                        const r = data[ni], g = data[ni + 1], b = data[ni + 2], a = data[ni + 3];
                        if (a !== 0 && isBg(r, g, b)) { visited[ny * W + nx] = 1; push(nx, ny); }
                    }
                }
                if (x + 1 < W) {
                    const nx = x + 1, ny = y; const ni = (ny * W + nx) * 4;
                    if (!visited[ny * W + nx]) {
                        const r = data[ni], g = data[ni + 1], b = data[ni + 2], a = data[ni + 3];
                        if (a !== 0 && isBg(r, g, b)) { visited[ny * W + nx] = 1; push(nx, ny); }
                    }
                }
                if (y > 0) {
                    const nx = x, ny = y - 1; const ni = (ny * W + nx) * 4;
                    if (!visited[ny * W + nx]) {
                        const r = data[ni], g = data[ni + 1], b = data[ni + 2], a = data[ni + 3];
                        if (a !== 0 && isBg(r, g, b)) { visited[ny * W + nx] = 1; push(nx, ny); }
                    }
                }
                if (y + 1 < H) {
                    const nx = x, ny = y + 1; const ni = (ny * W + nx) * 4;
                    if (!visited[ny * W + nx]) {
                        const r = data[ni], g = data[ni + 1], b = data[ni + 2], a = data[ni + 3];
                        if (a !== 0 && isBg(r, g, b)) { visited[ny * W + nx] = 1; push(nx, ny); }
                    }
                }
            }

            // Optional light feather around edges to avoid harsh cut
            if (featherPx > 0) {
                const tmp = new Uint8Array(W * H);
                for (let y = 0; y < H; y++) {
                    for (let x = 0; x < W; x++) {
                        const vi = visited[y * W + x];
                        const di = (y * W + x) * 4;
                        if (vi) { tmp[y * W + x] = 255; continue; }
                        // if any neighbor is transparent, reduce alpha slightly
                        let neighborTransparent = false;
                        for (let dy = -1; dy <= 1 && !neighborTransparent; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                if (dx === 0 && dy === 0) continue;
                                const nx = x + dx, ny = y + dy;
                                if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
                                if (visited[ny * W + nx]) { neighborTransparent = true; break; }
                            }
                        }
                        if (neighborTransparent) {
                            tmp[y * W + x] = 200; // slight softening
                        }
                    }
                }
                for (let y = 0; y < H; y++) {
                    for (let x = 0; x < W; x++) {
                        const t = tmp[y * W + x];
                        if (!t) continue;
                        const di = (y * W + x) * 4;
                        if (t === 255) data[di + 3] = 0;
                        else if (data[di + 3] > t) data[di + 3] = t;
                    }
                }
            }

            ctx.putImageData(imgData, 0, 0);
            // Keep PNG format to preserve transparency (alpha channel)
            const dataUrl = canvas.toDataURL('image/png');
            const prevVisibility = img.style.visibility;
            img.style.visibility = 'hidden';
            img.src = dataUrl;
            img.dataset.processed = '1';
            // Cache processed image in sessionStorage to avoid reprocessing
            try {
                sessionStorage.setItem(`dish_bg_${img.alt || img.src}`, dataUrl);
            } catch (storageErr) {
                // Storage full, ignore
            }
            requestAnimationFrame(() => { img.style.visibility = prevVisibility || 'visible'; });
        } catch (e) {
            console.warn('Background removal failed:', e);
        }
    }

    // Crop transparent borders so the dish fills more of the circle
    async function cropTransparentBorders(img) {
        // Check cache first to avoid reprocessing
        try {
            const cached = sessionStorage.getItem(`dish_crop_${img.alt || img.src}`);
            if (cached) {
                img.src = cached;
                return;
            }
        } catch (e) {
            // Cache not available, continue processing
        }
        
        await new Promise(resolve => {
            if (img.complete) resolve();
            else { img.addEventListener('load', resolve, { once: true }); img.addEventListener('error', resolve, { once: true }); }
        });
        try {
            const natW = img.naturalWidth || img.width;
            const natH = img.naturalHeight || img.height;
            if (!natW || !natH) return;
            const canvas = document.createElement('canvas');
            canvas.width = natW; canvas.height = natH;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0);
            const imgData = ctx.getImageData(0, 0, natW, natH);
            const { data, width: W, height: H } = imgData;
            let top = 0, left = 0, right = W - 1, bottom = H - 1;
            const alphaCutoff = 10; // trim faint halos
            const rowHasOpaque = (y) => {
                for (let x = 0; x < W; x++) { if (data[(y * W + x) * 4 + 3] > alphaCutoff) return true; } return false;
            };
            const colHasOpaque = (x) => {
                for (let y = 0; y < H; y++) { if (data[(y * W + x) * 4 + 3] > alphaCutoff) return true; } return false;
            };
            while (top < H && !rowHasOpaque(top)) top++;
            while (bottom >= 0 && !rowHasOpaque(bottom)) bottom--;
            while (left < W && !colHasOpaque(left)) left++;
            while (right >= 0 && !colHasOpaque(right)) right--;
            if (right <= left || bottom <= top) return;
            const cw = right - left + 1; const ch = bottom - top + 1;
            const cropCanvas = document.createElement('canvas');
            cropCanvas.width = cw; cropCanvas.height = ch;
            const cctx = cropCanvas.getContext('2d');
            cctx.imageSmoothingEnabled = true;
            cctx.imageSmoothingQuality = 'high';
            cctx.drawImage(canvas, left, top, cw, ch, 0, 0, cw, ch);
            // Keep PNG format to preserve transparency (alpha channel)
            const dataUrl = cropCanvas.toDataURL('image/png');
            img.src = dataUrl;
            // Cache cropped image in sessionStorage
            try {
                sessionStorage.setItem(`dish_crop_${img.alt || img.src}`, dataUrl);
            } catch (storageErr) {
                // Storage full, ignore
            }
        } catch (e) { /* ignore */ }
    }

    // Kick off background removal and cropping for all dish images
    const dishImgs = carousel.querySelectorAll('.single-dish-img');
    // Hint the browser for best quality and prioritize loading of these images
    dishImgs.forEach((img) => {
        try {
            img.loading = 'eager';
            img.decoding = 'sync';
            if ('fetchPriority' in img) img.fetchPriority = 'high';
        } catch (_) {}
    });
    dishImgs.forEach(async (img) => {
        await removeDarkBackground(img);
        await cropTransparentBorders(img);
    });

    function centerActiveChip(index) {
        if (!chipList) return;
        const chip = chips.find(ch => Number(ch.dataset.index) === index);
        if (!chip) return;
        const listRect = chipList.getBoundingClientRect();
        const chipRect = chip.getBoundingClientRect();
        const offset = (chipRect.left + chipRect.width / 2) - (listRect.left + listRect.width / 2);
        chipList.scrollBy({ left: offset, behavior: 'smooth' });
    }

    function setActiveChip(index) {
        if (!chips.length) return;
        chips.forEach(ch => ch.classList.remove('active'));
        const chip = chips.find(ch => Number(ch.dataset.index) === index);
        if (chip) chip.classList.add('active');
        if (currentTitle && dishData[index]) currentTitle.textContent = dishData[index].name;
        if (currentDesc && dishData[index]) currentDesc.textContent = dishData[index].desc;
        centerActiveChip(index);
        // Update dots active state
        updateDots(index);
        // no active indicator underline
    }

    // Create and manage navigation dots
    function initCarouselDots() {
        const dotsContainer = document.getElementById('dish-carousel-dots');
        if (!dotsContainer || dishSlides.length === 0) return;

        // Create dots
        dishSlides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dish-dot');
            dot.setAttribute('aria-label', `Go to dish ${index + 1}`);
            dot.dataset.index = index;
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                if (currentIndex !== index) {
                    updateCarousel(index, index > currentIndex ? 'next' : 'prev');
                }
            });
            
            dotsContainer.appendChild(dot);
        });
    }

    function updateDots(index) {
        const dotsContainer = document.getElementById('dish-carousel-dots');
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.dish-dot');
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function openDishModal(index) {
        const modal = document.getElementById('menu-modal');
        const modalContent = document.getElementById('modal-content');
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const modalDetails = document.getElementById('modal-details');
        const modalPrice = document.getElementById('modal-price');
        if (!modal || !modalContent || !modalImg || !modalTitle || !modalDescription || !modalPrice) return;

        const slide = dishSlides[index];
        const img = slide ? slide.querySelector('img') : null;
        const data = dishData[index];
        modalTitle.textContent = data.name;
        modalDescription.textContent = data.desc;
        if (modalDetails) {
            modalDetails.innerHTML = '';
            (data.details || []).forEach(d => {
                const li = document.createElement('li');
                li.textContent = d;
                modalDetails.appendChild(li);
            });
        }
        modalPrice.textContent = '';
        // Use the original image path for maximum clarity in the modal
        modalImg.src = data.image || (img ? img.src : '');

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);
    }

    function updateCarousel(newIndex, direction = 'next') {
        if (isAnimating) return;
        isAnimating = true;

        dishSlides[currentIndex].classList.remove('active');

        setTimeout(() => {
            dishSlides[newIndex].classList.add('active');
            setActiveChip(newIndex);
        }, 100);

        currentIndex = newIndex;

        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }

    function nextDish() {
        const newIndex = (currentIndex + 1) % dishSlides.length;
        updateCarousel(newIndex, 'next');
    }

    function prevDish() {
        const newIndex = (currentIndex - 1 + dishSlides.length) % dishSlides.length;
        updateCarousel(newIndex, 'prev');
    }

    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevDish);
    if (nextBtn) nextBtn.addEventListener('click', nextDish);

    // Chips click navigation
    if (chips.length) {
        chips.forEach(ch => {
            ch.addEventListener('click', () => {
                const idx = Number(ch.dataset.index);
                if (!Number.isNaN(idx)) {
                    updateCarousel(idx, idx > currentIndex ? 'next' : 'prev');
                }
            });
        });
    }

    // Scroll button behavior (desktop)
    const scrollAmount = () => Math.max(240, chipList.clientWidth * 0.5);
    if (chipPrev && chipNext && chipList) {
        chipPrev.addEventListener('click', () => {
            chipList.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
        });
        chipNext.addEventListener('click', () => {
            chipList.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
        });

        const updateButtons = () => {
            const maxScroll = chipList.scrollWidth - chipList.clientWidth - 2;
            const atStart = chipList.scrollLeft <= 2;
            const atEnd = chipList.scrollLeft >= maxScroll;
            chipPrev.style.opacity = atStart ? '0.35' : '1';
            chipNext.style.opacity = atEnd ? '0.35' : '1';
        };
        chipList.addEventListener('scroll', updateButtons, { passive: true });
        window.addEventListener('resize', updateButtons);
        setTimeout(updateButtons, 100);
    }

    // Keep active indicator aligned on scroll/resize
    // underline indicator removed per request

    // Build full menu grid once
    function buildFullMenu() {
        if (!fullMenuGrid) return;
        if (fullMenuGrid.dataset.built === '1') return;
        fullMenuGrid.innerHTML = '';
        dishData.forEach((d) => {
            const card = document.createElement('article');
            card.className = 'rounded-lg overflow-hidden bg-[#1a1a1a] border border-[#222] shadow-md hover:shadow-lg transition';
            card.innerHTML = `
                <div class="h-48 bg-black overflow-hidden">
                    <img src="${d.image}" alt="${d.name}" class="w-full h-full object-cover" loading="lazy" decoding="async" />
                </div>
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-white mb-2">${d.name}</h3>
                    <p class="text-gray-300 leading-relaxed text-sm">${d.desc}</p>
                </div>
            `;
            fullMenuGrid.appendChild(card);
        });
        fullMenuGrid.dataset.built = '1';
    }

    // CTA button to open full menu overlay
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            buildFullMenu();
            if (fullMenuOverlay) {
                fullMenuOverlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
                requestAnimationFrame(() => { fullMenuOverlay.style.opacity = '1'; });
            }
        });
    }

    // Auto-play carousel
    let autoPlayInterval = setInterval(nextDish, 4000);

    // Pause on hover (desktop only). Keep autoplay uninterrupted on global mobile screens.
    const allowHoverPause = (
        window.matchMedia &&
        window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
        !window.matchMedia('(max-width: 720px)').matches
    );
    if (allowHoverPause) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });

        carousel.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(nextDish, 4000);
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevDish();
        if (e.key === 'ArrowRight') nextDish();
        if (e.key === 'Escape') {
            // Close overlays on Escape
            const modal = document.getElementById('menu-modal');
            const overlay = document.getElementById('full-menu-overlay');
            if (modal && !modal.classList.contains('hidden')) {
                document.getElementById('modal-close-btn')?.click();
            }
            if (overlay && !overlay.classList.contains('hidden')) {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.classList.add('hidden');
                    document.body.style.overflow = '';
                }, 200);
            }
        }
    });

    // Initialize chip state
    setActiveChip(0);
    
    // Initialize navigation dots
    initCarouselDots();

    // Back button and overlay background to close full menu
    if (fullMenuBack && fullMenuOverlay) {
        fullMenuBack.addEventListener('click', () => {
            fullMenuOverlay.style.opacity = '0';
            setTimeout(() => {
                fullMenuOverlay.classList.add('hidden');
                document.body.style.overflow = '';
            }, 200);
        });
        fullMenuOverlay.addEventListener('click', (e) => {
            if (e.target === fullMenuOverlay) {
                fullMenuBack.click();
            }
        });
    }
}

// Original dish carousel animation restoration (kept for backward compatibility)
function initDishCarousel() {
    const track = document.querySelector('.dish-carousel-track');
    const nameDisplay = document.getElementById('dish-name-display');
    if (!track || !nameDisplay) return;

    const items = Array.from(track.children);
    const dishNames = [
        'Chicken Mandi', 'Chicken Masala Mandi', 'Chicken Alfaham Mandi',
        'Chicken Periperi Alfaham Mandi', 'Chicken Honey Alfaham Mandi',
        'Mutton Mandi', 'Beef Mandi', 'Beef Ribs Mandi'
    ];

    if (items.length === 0) return;
    let currentIndex = 0;

    function showDishName(name) {
        nameDisplay.textContent = name;
        nameDisplay.classList.add('visible');
    }
    function hideDishName() { nameDisplay.classList.remove('visible'); }

    async function animateDishFlow() {
        while (true) {
            const currentItem = items[currentIndex];
            const dishName = dishNames[currentIndex];
            items.forEach(item => { item.className = 'dish-item'; });
            currentItem.classList.add('flow-in');
            await new Promise(r => setTimeout(r, 2500));
            currentItem.className = 'dish-item at-center';
            showDishName(dishName);
            await new Promise(r => setTimeout(r, 3500));
            hideDishName();
            await new Promise(r => setTimeout(r, 300));
            currentItem.className = 'dish-item flow-out';
            await new Promise(r => setTimeout(r, 2500));
            currentIndex = (currentIndex + 1) % items.length;
            await new Promise(r => setTimeout(r, 400));
        }
    }
    setTimeout(() => animateDishFlow(), 1000);
}

// (Obsolete arc carousel variant removed during revert)

// Temporary: Toggle menu arc alignment guides (press 'g' to toggle)
function initArcGuideToggle() {
    const enableFromHash = () => {
        if (location.hash === '#guide') {
            document.body.classList.add('show-arc-guide');
        }
    };
    enableFromHash();

    window.addEventListener('hashchange', enableFromHash);

    window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'g') {
            document.body.classList.toggle('show-arc-guide');
        }
    });
}

// ======================= EVENTS CAROUSEL (RESTORED) =======================
function initEventCarousel() {
    const carouselContainer = document.querySelector('.events-carousel-container');
    if (!carouselContainer) return;
    // Hide carousel during setup to prevent initial blink
    carouselContainer.style.visibility = 'hidden';
    carouselContainer.style.display = 'none';


    // Use DOM order as authored
    let slides = Array.from(carouselContainer.querySelectorAll('.event-slide'));
    if (slides.length === 0) return;

    const originalSlideCount = slides.length;
    // Clone slides for seamless looping (one set of clones)
    slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        carouselContainer.appendChild(clone);
    });

    const allSlides = Array.from(carouselContainer.querySelectorAll('.event-slide'));
    const totalSlides = allSlides.length;
    const prevArrow = document.getElementById('prev-event');
    const nextArrow = document.getElementById('next-event');
    const dotsContainer = document.getElementById('event-dots');
    const detailsContainer = document.getElementById('event-details-container');

    if (!prevArrow || !nextArrow || !dotsContainer || !detailsContainer) return;

    // Event metadata: explicit titles & descriptions for each poster (order matches poster filenames)
    const eventMeta = [
        {
            title: 'Happy Diwali',
            description: 'Celebrate Diwali with Al‑Reem Mandi — enjoy a festive special menu, traditional sweets, and family-style platters crafted for the season. Reserve a table for intimate family gatherings or lively community celebrations.',
            cta: 'Learn More'
        },
        {
            title: 'Classic dishes',
            description: 'Savour our timeless classics: slow‑cooked Mandi, Alfaham, and signature rice dishes prepared with house spices and slow heat. Perfect comfort food for any occasion — tried, tested, and loved by generations.',
            cta: 'Learn More'
        },
        {
            title: 'Our New world',
            description: 'We’ve opened a new outlet in Bathery — come experience our new world of flavours at the Bathery location. Expect inventive menu additions that blend tradition with contemporary twists, fresh ingredients, and bold spices.',
            badge: 'New Outlet',
            cta: 'Learn More'
        },
        {
            title: 'Happy onam',
            description: 'Join us for Onam celebrations with delightful Sadya platters, seasonal specialties, and festive hospitality. Enjoy limited‑time offerings crafted to honour the season and its traditions.',
            cta: 'Learn More'
        }
    ];

    let currentIndex = 0; // Index within original set
    let autoTimer;
    const AUTO_DELAY = 4200; // Slightly slower to reduce rapid layout churn

    function buildDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < originalSlideCount; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', 'Go to event ' + (i + 1));
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateDetails(idx) {
        const meta = eventMeta[idx % originalSlideCount];
        detailsContainer.style.opacity = '0';
        setTimeout(() => {
            detailsContainer.innerHTML = `
                <div class="event-details-card">
                    <h3 class="text-2xl font-bold mb-4 main-title">${meta.title}</h3>
                    <p class="text-gray-300 leading-relaxed mb-6">${meta.description}</p>
                    <a href="event-details.html" class="learn-more-btn inline-block" aria-label="View all upcoming events">${meta.cta}</a>
                </div>
            `;
            detailsContainer.style.opacity = '1';
        }, 200);
    }

    function positionSlides() {
        // Remove all positional classes first
        allSlides.forEach(s => s.className = 'event-slide');

        // Determine effective index offset for clones
        const active = currentIndex; // within original range

        // We mirror classes around active index across both original and cloned set
        function applyState(slideEl, state) {
            slideEl.classList.add(state);
        }

        // Map states for original slides only, then mirror to corresponding clone
        for (let i = 0; i < originalSlideCount; i++) {
            const relative = (i - active + originalSlideCount) % originalSlideCount; // 0 = active
            let state;
            if (i === active) state = 'active';
            else if (relative === (originalSlideCount + 1 - 1) % originalSlideCount || relative === originalSlideCount - 1) state = 'prev';
            else if (relative === 1) state = 'next';
            else if (relative > 1 && relative < originalSlideCount / 2) state = 'hidden-next';
            else state = 'hidden-prev';

            // original
            applyState(allSlides[i], state);
            // clone counterpart (offset by originalSlideCount)
            const cloneIdx = i + originalSlideCount;
            if (allSlides[cloneIdx]) applyState(allSlides[cloneIdx], state);
        }
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === currentIndex);
        });
    }

    function goTo(index) {
        currentIndex = (index + originalSlideCount) % originalSlideCount;
        positionSlides();
        updateDots();
        updateDetails(currentIndex);
        restartAuto();
    }

    function next() { goTo(currentIndex + 1); }
    function prev() { goTo(currentIndex - 1); }

    function startAuto() { autoTimer = setInterval(next, AUTO_DELAY); }
    function stopAuto() { clearInterval(autoTimer); }
    function restartAuto() { stopAuto(); startAuto(); }

    prevArrow.addEventListener('click', () => { prev(); });
    nextArrow.addEventListener('click', () => { next(); });

    // Removed hover pause to keep animation running continuously

    // Navigate to events page on slide click (same as Learn More button)
    carouselContainer.addEventListener('click', (e) => {
        const slide = e.target.closest('.event-slide');
        if (!slide) return;
        window.location.href = 'event-details.html';
    });

    buildDots();
    goTo(0);
    // Show carousel after initial positioning to prevent blink
    carouselContainer.style.display = '';
    carouselContainer.style.visibility = 'visible';
    startAuto();
}

// (Removed events background preloader – simplified direct CSS background for performance)
// ======================= EVENTS PARALLAX =======================
// Removed parallax effect per user request (static background retained)

// ======================= EVENTS BG TUNER (DEV UTILITY) =======================
(function initEventsBgTuner(){
    const section = document.getElementById('events');
    if(!section) return;
    if(!(location.hash.includes('tune-events') || document.body.classList.contains('events-bg-tuner'))) return;
    document.body.classList.add('events-bg-tuner');
    const panel = document.createElement('div');
    panel.className = 'events-bg-tuner-panel';
    panel.innerHTML = `
      <strong>Events BG Tuner</strong><br>
      X: <span id="ebg-x"></span>%  Y: <span id="ebg-y"></span>%<br>
      <div style="margin-top:4px;display:flex;flex-wrap:wrap;max-width:160px;">
        <button data-dx="-1">◀ X-</button><button data-dx="1">X+ ▶</button>
        <button data-dy="-1">▲ Y-</button><button data-dy="1">Y+ ▼</button>
        <button data-reset="1">Reset</button>
        <button data-close="1">Close</button>
      </div>
      <div style="margin-top:4px;opacity:0.7">Arrow Keys work</div>`;
    document.body.appendChild(panel);
    function getVals(){
        const styles = getComputedStyle(section);
        let x = parseFloat(styles.getPropertyValue('--events-bg-x'));
        let y = parseFloat(styles.getPropertyValue('--events-bg-y'));
        return {x,y};
    }
    function setVals(x,y){
        x = Math.min(100, Math.max(0, x));
        y = Math.min(100, Math.max(0, y));
        section.style.setProperty('--events-bg-x', x + '%');
        section.style.setProperty('--events-bg-y', y + '%');
        sync();
    }
    function sync(){
        const {x,y} = getVals();
        panel.querySelector('#ebg-x').textContent = x.toFixed(1);
        panel.querySelector('#ebg-y').textContent = y.toFixed(1);
    }
    panel.addEventListener('click', (e)=>{
        const btn = e.target.closest('button');
        if(!btn) return;
        if(btn.dataset.close){ panel.remove(); document.body.classList.remove('events-bg-tuner'); return; }
        if(btn.dataset.reset){ setVals(72,26); return; }
        const {x,y} = getVals();
        if(btn.dataset.dx){ setVals(x + parseFloat(btn.dataset.dx), y); }
        if(btn.dataset.dy){ setVals(x, y + parseFloat(btn.dataset.dy)); }
    });
    window.addEventListener('keydown', (e)=>{
        if(!document.body.classList.contains('events-bg-tuner')) return;
        const {x,y} = getVals();
        if(e.key==='ArrowLeft'){ setVals(x-0.5,y); }
        else if(e.key==='ArrowRight'){ setVals(x+0.5,y); }
        else if(e.key==='ArrowUp'){ setVals(x,y-0.5); }
        else if(e.key==='ArrowDown'){ setVals(x,y+0.5); }
    }, {passive:true});
    sync();
})();

// ======================= EVENTS SECTION SCROLL OPTIMIZATION =======================
function initEventsScrollOptimization() {
    const eventsSection = document.querySelector('.events-section-bg');
    const eventSlides = document.querySelectorAll('.event-slide');
    
    if (!eventsSection) return;
    
    let isInViewport = false;
    let rafId = null;
    let lastScrollY = window.scrollY;
    let isScrolling = false;
    let scrollTimeout = null;
    
    // Optimize: Only enable will-change when section is in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isInViewport = entry.isIntersecting;
            
            if (isInViewport) {
                // Section entering viewport - enable optimizations
                eventsSection.style.willChange = 'transform';
            } else {
                // Section out of viewport - remove will-change to free GPU memory
                eventsSection.style.willChange = 'auto';
                // Also clear will-change from slides when not visible
                eventSlides.forEach(slide => {
                    slide.style.willChange = 'auto';
                });
            }
        });
    }, {
        rootMargin: '100px 0px', // Start optimization slightly before section enters
        threshold: 0
    });
    
    observer.observe(eventsSection);
    
    // Optimize scroll performance: reduce paint during rapid scroll
    function handleScroll() {
        if (rafId) return;
        
        rafId = requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            const scrollDelta = Math.abs(currentScrollY - lastScrollY);
            
            // Only apply optimizations when section is in viewport
            if (isInViewport) {
                if (!isScrolling && scrollDelta > 5) {
                    // Rapid scroll detected
                    isScrolling = true;
                    
                    // Temporarily reduce slide will-change during scroll
                    eventSlides.forEach(slide => {
                        slide.style.willChange = 'auto';
                    });
                }
                
                // Reset scroll state after scroll stops
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                    // Re-enable will-change for smooth transitions when scroll stops
                    if (isInViewport) {
                        eventSlides.forEach(slide => {
                            slide.style.willChange = 'transform, opacity';
                        });
                    }
                }, 150); // 150ms after scroll stops
            }
            
            lastScrollY = currentScrollY;
            rafId = null;
        });
    }
    
    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (rafId) cancelAnimationFrame(rafId);
        clearTimeout(scrollTimeout);
    });
}

// ======================= MENU SECTION SCROLL OPTIMIZATION =======================
function initMenuScrollOptimization() {
    const menuSection = document.getElementById('menu');
    const menuInnerContainer = document.querySelector('.menu-inner-container');
    const dishSlides = document.querySelectorAll('.single-dish-slide');
    const dishImages = document.querySelectorAll('.single-dish-img');
    
    if (!menuSection) return;
    
    let isInViewport = false;
    let isInitialLoad = true;
    let rafId = null;
    let lastScrollY = window.scrollY;
    let isScrolling = false;
    let scrollTimeout = null;
    
    // Preload and fade-in dish images for smooth initial appearance
    function initDishImageLoading() {
        dishImages.forEach((img, index) => {
            // Add loaded class when image loads
            if (img.complete && img.naturalHeight !== 0) {
                // Image already loaded
                setTimeout(() => img.classList.add('loaded'), index * 80);
            } else {
                // Wait for image to load
                img.addEventListener('load', function() {
                    setTimeout(() => this.classList.add('loaded'), index * 80);
                }, { once: true });
                
                // Fallback: force loaded class after timeout
                setTimeout(() => {
                    if (!img.classList.contains('loaded')) {
                        img.classList.add('loaded');
                    }
                }, 2000 + (index * 80));
            }
        });
    }
    
    // Initialize image loading
    initDishImageLoading();
    
    // Optimize: Only enable will-change when section is in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isInViewport = entry.isIntersecting;
            
            if (isInViewport) {
                // Section entering viewport
                if (menuSection) menuSection.style.willChange = 'transform';
                if (menuInnerContainer) menuInnerContainer.style.willChange = 'transform';
                
                // On first load, add will-change to active slide only
                if (isInitialLoad) {
                    isInitialLoad = false;
                    const activeSlide = document.querySelector('.single-dish-slide.active');
                    if (activeSlide) {
                        activeSlide.style.willChange = 'transform, opacity';
                    }
                }
            } else {
                // Section out of viewport - free GPU memory
                if (menuSection) menuSection.style.willChange = 'auto';
                if (menuInnerContainer) menuInnerContainer.style.willChange = 'auto';
                dishSlides.forEach(slide => {
                    slide.style.willChange = 'auto';
                });
            }
        });
    }, {
        rootMargin: '150px 0px', // Start optimization earlier due to complex animations
        threshold: 0
    });
    
    observer.observe(menuSection);
    
    // Optimize scroll performance: manage will-change during scroll
    function handleScroll() {
        if (rafId) return;
        
        rafId = requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            const scrollDelta = Math.abs(currentScrollY - lastScrollY);
            
            // Only apply optimizations when section is in viewport
            if (isInViewport) {
                if (!isScrolling && scrollDelta > 5) {
                    // Rapid scroll detected
                    isScrolling = true;
                    
                    // Temporarily reduce will-change during scroll
                    dishSlides.forEach(slide => {
                        slide.style.willChange = 'auto';
                    });
                }
                
                // Reset scroll state after scroll stops
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                    // Re-enable will-change for smooth transitions when scroll stops
                    if (isInViewport) {
                        // Only enable for active and adjacent slides
                        const activeSlide = document.querySelector('.single-dish-slide.active');
                        if (activeSlide) {
                            activeSlide.style.willChange = 'transform, opacity';
                        }
                    }
                }, 150); // 150ms after scroll stops
            }
            
            lastScrollY = currentScrollY;
            rafId = null;
        });
    }
    
    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Optimize dish slide transitions: add will-change only during transitions
    const carouselObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const slide = mutation.target;
                if (slide.classList.contains('active')) {
                    // Slide becoming active - enable will-change
                    slide.style.willChange = 'transform, opacity';
                    // Remove after transition completes
                    setTimeout(() => {
                        if (slide.classList.contains('active') && !isScrolling) {
                            slide.style.willChange = 'auto';
                        }
                    }, 1000); // After 0.8s transition + buffer
                } else {
                    // Slide not active - remove will-change
                    setTimeout(() => {
                        if (!slide.classList.contains('active')) {
                            slide.style.willChange = 'auto';
                        }
                    }, 1000);
                }
            }
        });
    });
    
    // Observe all dish slides for class changes
    dishSlides.forEach(slide => {
        carouselObserver.observe(slide, { attributes: true, attributeFilter: ['class'] });
    });
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (rafId) cancelAnimationFrame(rafId);
        clearTimeout(scrollTimeout);
        carouselObserver.disconnect();
    });
}

// ======================= CONTACT FORM =======================
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const statusEl = document.getElementById('contact-status');
    const submitBtn = document.getElementById('contact-submit');

    const setStatus = (msg, ok=false) => {
        if (!statusEl) return;
        statusEl.textContent = msg;
        // default gray for neutral/loading, green when ok, red on error (set below)
        statusEl.style.color = ok ? '#22c55e' : '#9ca3af';
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const payload = Object.fromEntries(fd.entries());

        // Basic validation
        if (!payload.name || !payload.email || !payload.message) {
            setStatus('Please fill in name, email, and message.');
            return;
        }
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        setStatus('Submitting...');

        try {
            // Add FormSubmit options
            const enhanced = {
                ...payload,
                _subject: 'New contact form message - AL REEM Website',
                _template: 'table',
                _captcha: 'false',
            };

            const res = await fetch('https://formsubmit.co/ajax/alreemrestaurant2010@gmail.com', {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(enhanced)
            });
            if (!res.ok) {
                let msg = 'Request failed';
                try {
                    const data = await res.json();
                    if (data && data.message) msg = data.message;
                } catch {}
                throw new Error(msg);
            }
            setStatus('Your response has been submitted. Thank you!', true);
            form.reset();
        } catch (err) {
            console.error(err);
            if (statusEl) statusEl.style.color = '#ef4444'; // red
            setStatus('Sorry, something went wrong. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
}


// ===================== Home background video sequence =====================
function initHomeBgVideoSequence() {
    const video = document.getElementById('home-bg-video');
    const overlay = document.getElementById('home-video-overlay');
    if (!video || !overlay) return;
    // User requirement: do not show any poster image before video
    try {
        // Remove poster attribute to prevent UA from rendering poster frame
        video.removeAttribute('poster');
        // Ensure no poster value remains
        video.poster = '';
        // Hide decorative fill layer so only video shows
        const fill = document.querySelector('.home-bg-video-fill');
        if (fill) fill.style.display = 'none';
    } catch (e) {}
    // Guard to prevent double-starts
    let videoStartRequested = false;
    // Configuration: keep the semi-dark overlay visible permanently instead of removing it after first reveal
    const KEEP_OVERLAY = true;
    function keepOverlayPersistent() {
        try {
            overlay.style.display = '';
            overlay.classList.add('persistent');
            overlay.classList.remove('hidden');
            overlay.classList.remove('split-open');
            // Ensure halves reset
            const left = overlay.querySelector('.overlay-half.left');
            const right = overlay.querySelector('.overlay-half.right');
            if (left) left.style.transform = 'translateX(0)';
            if (right) right.style.transform = 'translateX(0)';
        } catch (e) { /* swallow */ }
    }

    // Simple infinite loop with native loop attribute + safety fallback
    // This ensures continuous playback without complex crossfade logic that can fail
    (function setupInfiniteLoop(v) {
        try {
            if (!v) return;
            // Ensure native loop attribute is present
            v.setAttribute('loop', 'loop');
            v.loop = true;
            
            // Safety fallback: if video stops for any reason, restart it
            const safetyCheck = () => {
                try {
                    if (v.paused && !document.hidden) {
                        v.play().catch(() => {});
                    }
                } catch (e) {}
            };
            
            // Check every few seconds
            setInterval(safetyCheck, 3000);
            
            // Also restart if video ends (shouldn't happen with loop, but just in case)
            v.addEventListener('ended', () => {
                try {
                    v.currentTime = 0;
                    v.play().catch(() => {});
                } catch (e) {}
            });
            
            // Removed complex crossfade logic - native loop is more reliable and doesn't stop
            
        } catch (err) {
            console.warn('Video loop setup failed', err);
        }
    })(video);

    // Respect reduced motion preference
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        // keep overlay hidden (or show poster only)
        if (KEEP_OVERLAY) {
            keepOverlayPersistent();
        } else {
            revealOverlay(overlay, { mode: 'fade' });
        }
        return;
    }

    function startWhenReady() {
        // Always wait for ALL animations (text, rails, nav) to complete before starting video
        // This ensures smooth, coordinated reveal without overlapping motion

        const fullWait = () => {
            if (!videoStartRequested) waitForHomeAnimations();
        };

        if (!document.body.classList.contains('home-anim-play')) {
            const mo = new MutationObserver(() => {
                if (document.body.classList.contains('home-anim-play')) {
                    mo.disconnect();
                    fullWait();
                }
            });
            mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        } else {
            fullWait();
        }
    }

    function waitForHomeAnimations() {
        // Desktop/tablet path: wait for primary animated items and rails/nav to finish.
        const elems = Array.from(document.querySelectorAll('.home-anim-item, .home-anim-side-left, .home-anim-side-right, .home-anim-nav-inner'));
        let pending = elems.length;
        if (!pending) return triggerVideoStart();

        const onEnd = (e) => {
            e.target.removeEventListener('animationend', onEnd);
            pending--;
            if (pending <= 0) triggerVideoStart();
        };

        elems.forEach(el => {
            const cs = window.getComputedStyle(el);
            if (!cs || cs.animationName === 'none') {
                pending--; // no animation running
                return;
            }
            // add listener (some elements may already have finished — animationend will still fire if animation occurred)
            el.addEventListener('animationend', onEnd, { once: true });
        });

        // safety fallback if animationend doesn't fire for any reason
        setTimeout(() => { if (pending > 0) triggerVideoStart(); }, 3000);
    }

    function triggerVideoStart() {
        if (videoStartRequested) return; // guard
        videoStartRequested = true;
        // If user opted for reduced data or connection is poor, skip autoplay and remove overlay
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const slowNet = connection && (connection.saveData || /2g|slow-2g/.test(connection.effectiveType || ''));
        if (slowNet) { revealOverlay(overlay, { mode: 'fade' }); return; }

        function onReady() {
            video.removeEventListener('canplaythrough', onReady);
            video.removeEventListener('loadeddata', onReady);
            // Attempt to play first (muted allows autoplay). We'll reveal the visual progressively.
            // Sequence: start playback -> wait a small settle delay -> animate video visible (deblur/opacity/scale) -> then fade overlay
                try {
                    // Ensure playback starts from the beginning of the clip
                    if (typeof video.currentTime === 'number') {
                        try { video.currentTime = 0; } catch (e) { /* some browsers may reject if not allowed */ }
                    }
                } catch (e) {}

                video.play().then(() => {
                // Optimized reveal with smooth multi-stage fade-in
                const doReveal = () => {
                    // Verify video is decoded and ready
                    if (video.videoWidth > 0 && video.videoHeight > 0 && video.readyState >= 2) {
                        // Enable GPU acceleration for smooth transitions
                        video.style.willChange = 'opacity, filter';
                        
                        // Poster and fill are already disabled; proceed with reveal
                        
                        // Stage 1: Begin video fade-in FIRST (before fading overlay)
                        requestAnimationFrame(() => {
                            video.classList.add('visible-partial');
                            
                            // Stage 2: Start fading overlay once video starts appearing
                            setTimeout(() => {
                                revealOverlay(overlay, { mode: 'fade' });
                            }, 50); // Small delay to ensure video is rendering
                            
                            // Stage 3: Progressive reveal to full visibility with smooth deblur
                            setTimeout(() => {
                                requestAnimationFrame(() => {
                                    video.classList.add('visible');
                                    video.classList.remove('visible-partial');
                                    
                                    // Clean up GPU optimization hints after transition
                                    setTimeout(() => {
                                        video.style.willChange = 'auto';
                                    }, 1000);
                                    
                                    // If persistent overlay requested, restore it
                                    if (KEEP_OVERLAY) keepOverlayPersistent();
                                });
                            }, 500); // Smooth 500ms fade
                        });
                    } else {
                        // Video not fully ready, retry quickly
                        setTimeout(doReveal, 60);
                    }
                };

                // Wait for multiple frames to ensure smooth start (no stutter)
                if (typeof video.requestVideoFrameCallback === 'function') {
                    try {
                        video.requestVideoFrameCallback(() => {
                            // Second frame ensures decode is stable
                            video.requestVideoFrameCallback(() => {
                                setTimeout(doReveal, 30);
                            });
                        });
                    } catch (e) {
                        setTimeout(doReveal, 120);
                    }
                } else {
                    // Fallback for browsers without requestVideoFrameCallback
                    setTimeout(doReveal, 120);
                }
            }).catch(() => {
                // If autoplay is blocked, do not show any poster; reveal area gracefully.
                try {
                    // Keep the area clean (black background) and softly fade overlay
                    video.classList.remove('visible-partial');
                    // Do not add 'visible' to avoid forcing a poster frame; background stays black
                } catch (e) {}

                if (KEEP_OVERLAY) {
                    // Keep a subtle dim, but don't fully hide the content area
                    keepOverlayPersistent();
                } else {
                    // Fade the overlay away so at least the poster is clearly visible
                    revealOverlay(overlay, { mode: 'fade' });
                }
            });
        }

        if (video.readyState >= 3) {
            onReady();
        } else {
            video.addEventListener('canplaythrough', onReady, { once: true });
            video.addEventListener('loadeddata', onReady, { once: true });
            // safety net
            setTimeout(onReady, 2600);
        }

        // Pause when tab not visible to save CPU/battery
        document.addEventListener('visibilitychange', () => {
            try {
                if (document.hidden) video.pause(); else video.play().catch(()=>{});
            } catch (e) {}
        });
    }

    // Start the sequence after the intro has completed (body.content-loaded) — watch for it
    if (document.body.classList.contains('content-loaded')) {
        startWhenReady();
    } else {
        const mo2 = new MutationObserver((m) => {
            if (document.body.classList.contains('content-loaded')) {
                mo2.disconnect();
                startWhenReady();
            }
        });
        mo2.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }
}

// revealOverlay helper: splits the black overlay into two halves (or fades as fallback)
function revealOverlay(overlay, opts = { mode: 'split' }) {
    if (!overlay) return;
    const mode = opts.mode || 'split';
    // If already hidden or in the process, do nothing
    if (overlay.classList.contains('hidden') || overlay.classList.contains('split-open')) return;

    if (mode === 'fade') {
        overlay.classList.add('hidden');
        // keep a small timeout to ensure transition completes before removing from flow
        setTimeout(() => {
            try { overlay.style.display = 'none'; } catch (e) {}
        }, 1000);
        return;
    }

    // Default split animation
    // Ensure halves exist (they were added in HTML). Force a reflow then trigger split-open.
    overlay.style.display = '';
    overlay.classList.remove('hidden');
    // force reflow
    void overlay.offsetWidth;
    overlay.classList.add('split-open');
    // After the split animation finishes, remove overlay from flow
    const cleanupMs = 900; // match CSS transition duration for split/vignette
    // After split animation finishes, fade overlay (add hidden) then remove from flow
    setTimeout(() => {
        overlay.classList.add('hidden');
        // After opacity transition completes, remove split classes and take overlay out of flow
        setTimeout(() => {
            overlay.classList.remove('split-open');
            overlay.style.display = 'none';
        }, cleanupMs + 80);
    }, cleanupMs);
}

// Initialize home video sequence (hook up watchers)
try { initHomeBgVideoSequence(); } catch (e) { console.warn('Home bg video init failed', e); }


