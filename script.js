// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
    
    // Set Current Year in Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // 1. Lenis Smooth Scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate GSAP ScrollTrigger with Lenis
    if(typeof gsap !== 'undefined') {
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }

    // 2. Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    
    if (cursor && follower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Fast cursor
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
            
            // Particles for Three.js
            targetX = (mouseX / window.innerWidth) * 2 - 1;
            targetY = -(mouseY / window.innerHeight) * 2 + 1;
        });

        // Loop for smooth follower
        gsap.ticker.add(() => {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;
        });

        // Hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .magnetic, .skill-card, .project-card, .stat-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // 3. Navbar logic
    const nav = document.querySelector('.glass-nav');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // 4. Magnetic Buttons
    const magnets = document.querySelectorAll('.magnetic');
    magnets.forEach(magnet => {
        magnet.addEventListener('mousemove', function(e) {
            const position = magnet.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;
            
            gsap.to(this, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.5,
                ease: "power2.out"
            });
        });
        
        magnet.addEventListener('mouseleave', function() {
            gsap.to(this, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    });

    // 5. GSAP Animations
    // Hero Text Reveal
    gsap.from(".badge", { y: 20, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out" });
    gsap.from(".hero-title", { y: 50, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });
    gsap.from(".hero-roles", { y: 20, opacity: 0, duration: 1, delay: 0.6, ease: "power3.out" });
    gsap.from(".hero-desc", { y: 20, opacity: 0, duration: 1, delay: 0.8, ease: "power3.out" });
    gsap.from(".hero-actions", { y: 20, opacity: 0, duration: 1, delay: 1, ease: "power3.out" });
    
    // Scroll triggers for sections
    gsap.utils.toArray('.section').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Stats Counter Animation
    const stats = document.querySelectorAll('.stat-num');
    stats.forEach(stat => {
        let text = stat.innerText;
        let num = parseInt(text.replace(/[^0-9]/g, ''));
        if(!isNaN(num)) {
            gsap.from(stat, {
                scrollTrigger: {
                    trigger: stat,
                    start: "top 90%",
                },
                textContent: 0,
                duration: 2,
                ease: "power1.out",
                snap: { textContent: 1 },
                stagger: 1,
                onUpdate: function() {
                    stat.innerHTML = this.targets()[0].textContent + text.replace(/[0-9]/g, '');
                }
            });
        }
    });

    // 6. Three.js Hero Canvas Setup (Massive Premium 3D Object)
    const canvas = document.getElementById('hero-canvas');
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        let width = canvas.parentElement.clientWidth;
        let height = canvas.parentElement.clientHeight;
        
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 15;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Glass Material
        const material = new THREE.MeshPhysicalMaterial({
            color: 0x8B5CF6,
            metalness: 0.1,
            roughness: 0.1,
            transmission: 0.9,
            thickness: 1.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            ior: 1.5,
            transparent: true,
            opacity: 1
        });

        // Massive Abstract Object (Torus Knot)
        const geometry = new THREE.TorusKnotGeometry(3.5, 1, 200, 32);
        const torusKnot = new THREE.Mesh(geometry, material);
        scene.add(torusKnot);

        // Add rings/orbits - REMOVED for performance optimization
        
        // Floating Particles - Reduced by 70% for performance
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 90; // Reduced from 300
        const posArray = new Float32Array(particlesCount * 3);
        
        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 25;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            color: 0x06B6D4,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x8B5CF6, 2, 50); // Purple
        pointLight1.position.set(5, 5, 5);
        scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x06B6D4, 2, 50); // Cyan
        pointLight2.position.set(-5, -5, 5);
        scene.add(pointLight2);

        // Animation Loop
        let mouseTargetX = 0;
        let mouseTargetY = 0;

        window.addEventListener('mousemove', (event) => {
            mouseTargetX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseTargetY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Rotate object naturally
            torusKnot.rotation.y += 0.005;
            torusKnot.rotation.x += 0.002;
            
            // Orbits rotation Removed for performance

            // Animate particles
            particlesMesh.rotation.y = elapsedTime * -0.05;

            // Mouse interaction (parallax)
            torusKnot.rotation.y += 0.05 * (mouseTargetX - torusKnot.rotation.y);
            torusKnot.rotation.x += 0.05 * (mouseTargetY - torusKnot.rotation.x);
            
            scene.rotation.x += 0.05 * (mouseTargetY * 0.1 - scene.rotation.x);
            scene.rotation.y += 0.05 * (mouseTargetX * 0.1 - scene.rotation.y);

            // Floating effect
            torusKnot.position.y = Math.sin(elapsedTime * 0.5) * 0.5;

            renderer.render(scene, camera);
        }

        animate();

        // Handle Resize
        window.addEventListener('resize', () => {
            width = canvas.parentElement.clientWidth;
            height = canvas.parentElement.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });
    }
});
