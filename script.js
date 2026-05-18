/**
 * SRIYAN PORTFOLIO - CORE INTERACTION ENGINE
 * Premium Custom Javascript
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. PAGE PRELOADER & INITIAL REVEALS
       ========================================================================== */
    const preloader = document.getElementById('preloader');
    const loaderProgressBar = document.querySelector('.loader-progress-bar');
    const loaderText = document.querySelector('.loader-word');

    // Simulate loading cycles for futuristic loading effect
    const loadingStates = ['BOOTING SYSTEM', 'LOADING CONTEXT', 'INITIALIZING PARTICLES', 'RENDER COMPLETED'];
    let stateIdx = 0;

    const textInterval = setInterval(() => {
        if (stateIdx < loadingStates.length - 1) {
            stateIdx++;
            loaderText.textContent = loadingStates[stateIdx];
        }
    }, 450);

    window.addEventListener('load', () => {
        // Complete the progress animation
        loaderProgressBar.style.width = '100%';
        clearInterval(textInterval);
        loaderText.textContent = 'SYSTEM ACTIVE';

        setTimeout(() => {
            preloader.classList.add('hidden');
            // Trigger the initial reveals (Hero elements)
            triggerScrollReveal();
            // Start stat counters if they happen to be visible immediately
            checkStatsVisibility();
        }, 600);
    });

    // Fallback if load event takes too long
    setTimeout(() => {
        if (!preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            triggerScrollReveal();
        }
    }, 3000);


    /* ==========================================================================
       2. INTERACTIVE CANVAS BACKGROUND PARTICLES
       ========================================================================== */
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let particlesArray = [];
    const maxParticles = 65; // High performance cap
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
        x: null,
        y: null,
        radius: 130 // Mouse interaction zone
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
    });

    // Particle Object
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        // Draw particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // Update positions, bounce check, mouse interaction
        update() {
            // Screen boundaries collision
            if (this.x > width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Mouse repulsion/attraction effect
            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    // Soft push away from mouse
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let force = (mouse.radius - distance) / mouse.radius;
                    let directionX = forceDirectionX * force * 0.8;
                    let directionY = forceDirectionY * force * 0.8;

                    this.x -= directionX;
                    this.y -= directionY;
                }
            }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;

            this.draw();
        }
    }

    // Populate particles field
    function initParticles() {
        particlesArray = [];
        // Adjust particle density based on screen width
        const densityMultiplier = width < 768 ? 0.5 : 1;
        const total = Math.floor(maxParticles * densityMultiplier);

        // Colors from theme variables
        const colors = [
            'rgba(59, 130, 246, 0.15)', // Light blue
            'rgba(139, 92, 246, 0.15)', // Light purple
            'rgba(6, 182, 212, 0.12)'   // Light cyan
        ];

        for (let i = 0; i < total; i++) {
            let size = Math.random() * 2.5 + 1;
            let x = Math.random() * (width - size * 2) + size;
            let y = Math.random() * (height - size * 2) + size;
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = colors[Math.floor(Math.random() * colors.length)];

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Connect close nodes with neon web lines
    function connectNodes() {
        let opacityValue = 1;
        const lineMaxDist = width < 768 ? 95 : 135;
        const isLightTheme = document.body.classList.contains('light-theme');

        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < lineMaxDist) {
                    opacityValue = 1 - (distance / lineMaxDist);

                    // Connection line opacity adjusted to light/dark themes
                    const baseOpacity = isLightTheme ? 0.05 : 0.08;
                    const strokeOpacity = opacityValue * baseOpacity;

                    ctx.strokeStyle = isLightTheme
                        ? `rgba(37, 99, 235, ${strokeOpacity})`
                        : `rgba(99, 102, 241, ${strokeOpacity})`;

                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animateParticles() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectNodes();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();


    /* ==========================================================================
       3. PREMIUM FLUID CUSTOM CURSOR LERP
       ========================================================================== */
    const cursorDot = document.getElementById('custom-cursor-dot');
    const cursorOutline = document.getElementById('custom-cursor-outline');

    let cursorX = 0, cursorY = 0; // Target coordinates
    let outlineX = 0, outlineY = 0; // Current lerp coordinates
    const lerpFactor = 0.12; // Lower value = smoother drift

    // Hide default cursor and update tracking target on movement
    window.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;

        // Directly snap dot position
        cursorDot.style.left = `${cursorX}px`;
        cursorDot.style.top = `${cursorY}px`;
    });

    // Lerp Outline Frame loops
    function updateOutlinePosition() {
        outlineX += (cursorX - outlineX) * lerpFactor;
        outlineY += (cursorY - outlineY) * lerpFactor;

        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;

        requestAnimationFrame(updateOutlinePosition);
    }
    requestAnimationFrame(updateOutlinePosition);

    // Expand cursor hover effect on elements
    const hoverables = document.querySelectorAll('a, button, input, textarea, .project-demo-btn, .theme-toggle-btn, .social-circle-link');

    hoverables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('custom-cursor-hover');
            cursorDot.classList.add('custom-cursor-hover');
        });
        item.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('custom-cursor-hover');
            cursorDot.classList.remove('custom-cursor-hover');
        });
    });


    /* ==========================================================================
       4. ANIMATED TYPING EFFECT (TYPEWRITER)
       ========================================================================== */
    const typewriterElement = document.getElementById('typewriter');
    const phrases = [
        'Java Developer',
        'Full-Stack Developer',
        'ASP.NET Developer',
        'Software Engineering Undergraduate'
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function handleTypewriter() {
        const currentPhrase = phrases[phraseIdx];

        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 40; // Quicker deletions
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 90; // Steady typing
        }

        // Switch to deletion state
        if (!isDeleting && charIdx === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Static dwell time at full text
        }
        // Switch to typing state next word
        else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typingSpeed = 400; // Quick rest before next sentence starts
        }

        setTimeout(handleTypewriter, typingSpeed);
    }

    // Initiate typewriter loops
    if (typewriterElement) {
        setTimeout(handleTypewriter, 1200);
    }


    /* ==========================================================================
       5. STICKY NAVBAR, THEME TOGGLE, & PROGRESS BAR
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const scrollBar = document.getElementById('scroll-bar');
    const themeToggle = document.getElementById('theme-toggle');

    // Smooth Scroll progress horizontal indicator
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        scrollBar.style.width = `${scrolled}%`;

        // Sticky Header triggers
        if (winScroll > 40) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    });

    // Light/Dark Theme Switcher
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');

        // Add subtle theme trigger animation scale
        themeToggle.style.transform = 'scale(0.85)';
        setTimeout(() => themeToggle.style.transform = 'scale(1)', 150);

        // Update local storage preference
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    });

    // Check system/cookie preferences for loaded theme
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }


    /* ==========================================================================
       6. MOBILE DRAWER NAVIGATION MENU
       ========================================================================== */
    const mobileToggleBtn = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggleBtn.addEventListener('click', () => {
        mobileToggleBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        // Prevent background body scroll when drawer open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggleBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });


    /* ==========================================================================
       7. INTERSECTION OBSERVER FOR REVEAL ANIMATIONS
       ========================================================================== */
    const revealItems = document.querySelectorAll('.reveal-item');

    const revealObserverOptions = {
        root: null,
        threshold: 0.15, // Elements trigger when 15% visible
        rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // If it is a skill progress card, trigger inner bar percentage loads
                if (entry.target.classList.contains('skills-category-card')) {
                    const bars = entry.target.querySelectorAll('.skill-bar-fill');
                    bars.forEach(bar => {
                        const targetPct = bar.getAttribute('data-width');
                        bar.style.width = targetPct;
                    });
                }

                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, revealObserverOptions);

    function triggerScrollReveal() {
        revealItems.forEach(item => {
            revealObserver.observe(item);
        });
    }


    /* ==========================================================================
       8. STATS COUNTER MULTIPLIER ANIMATION
       ========================================================================== */
    const statsContainer = document.querySelector('.about-stats-container');
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function countUpStats() {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 1800; // 1.8 seconds complete duration
            const increment = target / (duration / 16); // 60 FPS tick speed

            let current = 0;
            const updateCount = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    setTimeout(updateCount, 16);
                } else {
                    stat.textContent = target + (target === 15 ? '+' : '');
                }
            };
            updateCount();
        });
    }

    function checkStatsVisibility() {
        if (!statsContainer || statsAnimated) return;

        const rect = statsContainer.getBoundingClientRect();
        const isInViewport = (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) * 1.15
        );

        if (isInViewport) {
            countUpStats();
            statsAnimated = true;
        }
    }

    window.addEventListener('scroll', checkStatsVisibility);


    /* ==========================================================================
       9. ACTIVE NAVIGATION SCROLL SPY TRACKER
       ========================================================================== */
    const sections = document.querySelectorAll('section');

    function scrollSpyActiveState() {
        const scrollPosition = window.scrollY + 120; // offset sticky navbar header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', scrollSpyActiveState);


    /* ==========================================================================
       10. PROJECT AND CERTIFICATIONS DYNAMIC MODAL ENGINE
       ========================================================================== */
    const projectModal = document.getElementById('project-modal');
    const modalProjectContent = document.getElementById('modal-project-content');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    const certModal = document.getElementById('cert-modal');
    const modalCertContent = document.getElementById('modal-cert-content');
    const certModalCloseBtn = document.getElementById('cert-modal-close-btn');

    // Rich Projects Metadata Object
    const projectsData = {
        tuition: {
            title: 'Online Tuition Class Management System',
            category: 'Full-Stack Web Application',
            duration: '3 Months',
            image: 'assets/project1.png',
            desc: 'Developed a full-stack web application to manage online tuition classes, including student registration, class scheduling, and payment tracking.',
            subhead: 'Core Implementations',
            features: [
                'Student registration and profile dashboard management.',
                'Class scheduling with interactive time slots and calendars.',
                'Payment tracking and billing history ledger for administrators.',
                'Seamless full-stack connection with RESTful API endpoints.'
            ],
            tech: ['React', 'Java Spring Boot', 'MS SQL Server']
        },
        examination: {
            title: 'Online Examination Management System',
            category: 'Backend Logic',
            duration: '2.5 Months',
            image: 'assets/project2.png',
            desc: 'Developed backend logic for exam management and result processing with responsive interfaces for students and administrators.',
            subhead: 'Core Implementations',
            features: [
                'Secure login and registration with validation frameworks.',
                'Result processing and instant grading calculations.',
                'Exam creation forms and dynamic questionnaire generators.',
                'Highly responsive views using HTML5, CSS3, and JavaScript.'
            ],
            tech: ['Java', 'HTML', 'CSS', 'JavaScript', 'MS SQL']
        },
        student: {
            title: 'Student Management System',
            category: 'Full-Stack Enterprise CRUD',
            duration: '3 Months',
            image: 'assets/project3.png',
            desc: 'Developed a CRUD-based student management system using ASP.NET MVC with role-based access control and normalized database design.',
            subhead: 'Core Implementations',
            features: [
                'Complete CRUD operations for managing student registries.',
                'Role-based access control for students and administrators.',
                'Normalized database schema structures preventing redundancies.',
                'Elegant MVC separation of concerns for robust scalability.'
            ],
            tech: ['React', 'C#', 'ASP.NET MVC', 'MS SQL']
        },
        queuepro: {
            title: 'QueuePro – Online Appointment Management System',
            category: 'Full-Stack Mobile Application',
            duration: '4 Months',
            image: 'assets/project4.png',
            desc: 'Developed a mobile application for managing appointments and reducing queue wait times with booking, scheduling, and user management features.',
            subhead: 'Core Implementations',
            features: [
                'Live queue wait-time calculations and token bookings.',
                'Schedule coordinator slots for service center administrators.',
                'Comprehensive user profile dashboards with booking histories.',
                'MongoDB backend operations with scalable Node.js API endpoints.'
            ],
            tech: ['React Native', 'Node.js', 'Express.js', 'MongoDB']
        }
    };

    // Certifications Metadata Object
    const certsData = {
        oracle: {
            title: 'Oracle Certified Associate, Java SE 8 Programmer',
            issuer: 'Oracle University',
            desc: 'Demonstrates deep fundamental mastery of Java syntax, Object-Oriented Programming principles, exception handling hierarchies, structural loops, array structures, and core library framework classes.',
            icon: 'fa-java'
        },
        fullstack: {
            title: 'Full-Stack Web Development Masterclass',
            issuer: 'Coursera / Udemy Certified',
            desc: 'Validates modern credentials in structuring web apps, writing secure REST APIs, handling advanced database schema queries, designing user interfaces, and managing server deployment architectures.',
            icon: 'fa-server'
        },
        responsive: {
            title: 'Responsive Web Design Certification',
            issuer: 'freeCodeCamp Developer Suite',
            desc: 'Confirms absolute mastery in responsive grid layouts, Flexbox styling, accessibility standard requirements (ARIA), and CSS styling variables for sleek multi-device UI/UX frameworks.',
            icon: 'fa-desktop'
        }
    };

    // Trigger details modal injection: PROJECTS
    document.querySelectorAll('.project-demo-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectKey = btn.getAttribute('data-project');
            const data = projectsData[projectKey];

            if (!data) return;

            // Generate content
            let featuresHtml = '';
            data.features.forEach(f => {
                featuresHtml += `<li><i class="fa-solid fa-square-check"></i> ${f}</li>`;
            });

            let techHtml = '';
            data.tech.forEach(t => {
                techHtml += `<span class="tech-tag">${t}</span>`;
            });

            modalProjectContent.innerHTML = `
                <img src="${data.image}" alt="${data.title}" class="modal-project-img">
                <div class="modal-project-header">
                    <h3 class="modal-project-title">${data.title}</h3>
                    <span class="project-category" style="color: var(--color-primary); font-weight:600; font-size:0.85rem;">${data.category}</span>
                </div>
                <p class="modal-project-text">${data.desc}</p>
                <h4 class="modal-project-subhead">${data.subhead}</h4>
                <ul class="modal-project-features">${featuresHtml}</ul>
                <div class="project-tags" style="margin-bottom:25px;">${techHtml}</div>
                <div class="modal-project-actions">
                    <a href="https://github.com" target="_blank" rel="noopener" class="btn btn-primary"><i class="fa-brands fa-github"></i> Source Code</a>
                    <button class="btn btn-outline" onclick="closeAllModals()"><i class="fa-solid fa-xmark"></i> Close Details</button>
                </div>
            `;

            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // lock scroll
        });
    });

    // Trigger details modal injection: CERTIFICATIONS
    document.querySelectorAll('.cert-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const certKey = btn.getAttribute('data-cert');
            const data = certsData[certKey];

            if (!data) return;

            modalCertContent.innerHTML = `
                <div class="modal-cert-viewer">
                    <div class="modal-cert-badge">
                        <i class="fa-solid ${data.icon}"></i>
                    </div>
                    <h3 class="modal-cert-title">${data.title}</h3>
                    <p class="modal-cert-issuer">${data.issuer}</p>
                    <p class="modal-cert-desc">${data.desc}</p>
                    
                    <div class="modal-cert-mock">
                        <i class="fa-solid fa-stamp"></i>
                        <span class="modal-cert-mock-text">VERIFIED DIGITAL BADGE INTEGRATED SECURELY</span>
                    </div>

                    <button class="btn btn-primary" onclick="closeAllModals()"><i class="fa-solid fa-circle-check"></i> Close Credentials</button>
                </div>
            `;

            certModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // lock scroll
        });
    });

    // Close Modals functions
    function closeAllModals() {
        projectModal.classList.remove('active');
        certModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Attach Close Click Listeners
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeAllModals);
    if (certModalCloseBtn) certModalCloseBtn.addEventListener('click', closeAllModals);

    // Click outside overlay to close modal
    window.addEventListener('click', (e) => {
        if (e.target === projectModal || e.target === certModal) {
            closeAllModals();
        }
    });

    // Bind to window to allow call from HTML inline buttons
    window.closeAllModals = closeAllModals;


    /* ==========================================================================
       11. PREMIUM CONTACT FORM DISPATCH & TOASTER SUCCESS
       ========================================================================== */
    const contactForm = document.getElementById('portfolio-contact-form');
    const submitBtn = document.getElementById('form-submit-btn');
    const toast = document.getElementById('success-toast');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Activate button loader state
            const spinner = submitBtn.querySelector('.spinner');
            const btnText = submitBtn.querySelector('.btn-text');

            spinner.classList.remove('hidden');
            btnText.style.opacity = '0.3';
            submitBtn.disabled = true;

            // Simulate server network dispatch (1.8s latency)
            setTimeout(() => {
                // Toast notification
                toast.classList.add('active');

                // Clear Form input values
                contactForm.reset();

                // Reset Button state
                spinner.classList.add('hidden');
                btnText.style.opacity = '1';
                submitBtn.disabled = false;

                // Dismiss Toast after 4 seconds
                setTimeout(() => {
                    toast.classList.remove('active');
                }, 4000);

            }, 1800);
        });
    }


    /* ==========================================================================
       12. INTERACTIVE COMPILATION CV DOWNLOAD SYSTEM
       ========================================================================== */
    const downloadBtn = document.getElementById('cv-download');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Change Toast details dynamically for premium compilation download notification
            const toastTitle = toast.querySelector('.toast-title');
            const toastMsg = toast.querySelector('.toast-msg');
            const toastIcon = toast.querySelector('.toast-icon i');

            // Backup standard values
            const oldTitle = toastTitle.textContent;
            const oldMsg = toastMsg.textContent;
            const oldIconClass = toastIcon.className;

            // Inject compile text
            toastTitle.textContent = 'Compiling CV...';
            toastMsg.textContent = 'Generating latest resume build. Download starting shortly.';
            toastIcon.className = 'fa-solid fa-gears';
            toast.style.borderColor = 'var(--color-secondary)';
            toast.classList.add('active');

            setTimeout(() => {
                toastTitle.textContent = 'Download Started!';
                toastMsg.textContent = 'Sriyan_Fernando_CV.pdf downloaded successfully.';
                toastIcon.className = 'fa-solid fa-file-arrow-down';

                // Trigger actual download of the local CV file
                const link = document.createElement('a');
                link.href = 'assets/Sriyan_Fernando_CV.pdf';
                link.setAttribute('download', 'Sriyan_Fernando_CV.pdf');
                document.body.appendChild(link);
                link.click(); // Trigger actual browser download!
                document.body.removeChild(link);

                setTimeout(() => {
                    toast.classList.remove('active');
                    // Reset to standard toast values after hide
                    setTimeout(() => {
                        toastTitle.textContent = oldTitle;
                        toastMsg.textContent = oldMsg;
                        toastIcon.className = oldIconClass;
                        toast.style.borderColor = 'var(--color-primary)';
                    }, 500);
                }, 3500);

            }, 2000);
        });
    }

});
