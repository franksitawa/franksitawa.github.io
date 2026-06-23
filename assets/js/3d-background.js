// assets/js/3d-background.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    
    // Add fog to hide particles far away
    scene.fog = new THREE.FogExp2(0x0d1117, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 200;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create particles
    const particleCount = 400; // Adjust for density vs performance
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    // Colors
    const color = new THREE.Color(0x00C9A7); // Electric Teal

    for (let i = 0; i < particleCount; i++) {
        // Random positions within a cube
        positions[i * 3] = (Math.random() - 0.5) * 600;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 600;

        // Random velocities
        velocities.push({
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5,
            z: (Math.random() - 0.5) * 0.5
        });
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Create a soft round particle texture
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 32;
    particleCanvas.height = 32;
    const ctx = particleCanvas.getContext('2d');
    
    // Draw a soft circle with a radial gradient
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    // Particle Material
    const pMaterial = new THREE.PointsMaterial({
        color: color,
        size: 6, // Increased size to show the soft edge better
        map: particleTexture,
        transparent: true,
        opacity: 0.8,
        depthWrite: false, // Prevents alpha blending issues
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particles, pMaterial);
    scene.add(particleSystem);

    // Lines connecting particles
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00C9A7, // Electric Teal
        transparent: true,
        opacity: 0.15
    });
    
    // We will dynamically build the line geometry in the animation loop
    const lines = new THREE.LineSegments(new THREE.BufferGeometry(), lineMaterial);
    scene.add(lines);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    const targetX = 0;
    const targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.1;
        mouseY = (event.clientY - windowHalfY) * 0.1;
    });

    // Animation Loop
    let lastTime = 0;
    function animate(time) {
        requestAnimationFrame(animate);
        
        // Use delta time for smooth movement independent of framerate
        const delta = time - lastTime;
        lastTime = time;

        // Subtle camera movement based on mouse
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        // Move particles
        const positions = particleSystem.geometry.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += velocities[i].x;
            positions[i * 3 + 1] += velocities[i].y;
            positions[i * 3 + 2] += velocities[i].z;

            // Bounce off boundaries
            if (Math.abs(positions[i * 3]) > 300) velocities[i].x *= -1;
            if (Math.abs(positions[i * 3 + 1]) > 300) velocities[i].y *= -1;
            if (Math.abs(positions[i * 3 + 2]) > 300) velocities[i].z *= -1;
        }
        
        particleSystem.geometry.attributes.position.needsUpdate = true;

        // Rotate the entire system slowly
        particleSystem.rotation.y += 0.001;
        lines.rotation.y += 0.001;

        // Render
        renderer.render(scene, camera);
    }

    animate(0);

    // Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Handle Theme Change
    function updateTheme() {
        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
        if (theme === 'light') {
            scene.fog.color.setHex(0xF0EDE6); // Warm off-white
            pMaterial.color.setHex(0x00C9A7); // Electric Teal
            lineMaterial.color.setHex(0x00C9A7);
        } else {
            scene.fog.color.setHex(0x0D1B2A); // Deep Navy
            pMaterial.color.setHex(0x00C9A7); // Electric Teal
            lineMaterial.color.setHex(0x00C9A7); 
        }
    }
    
    // Initial theme setup
    updateTheme();

    // Listen for theme changes from the toggle button
    window.addEventListener('themechange', updateTheme);
});
