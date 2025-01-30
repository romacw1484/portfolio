class ThreeScene {
    constructor() {
        this.init();
        this.createObjects();
        this.animate();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: document.querySelector('#three-canvas'),
            alpha: true,
            antialias: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.position.z = 15;

        // Add floating geometry
        this.geometry = new THREE.IcosahedronGeometry(5, 1);
        this.material = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            metalness: 0.7,
            roughness: 0.3,
            envMap: new THREE.CubeTextureLoader()
                .setPath('assets/textures/')
                .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);

        // Add dynamic lighting
        this.pointLight = new THREE.PointLight(0x00ff00, 1);
        this.pointLight.position.set(10, 10, 10);
        this.scene.add(this.pointLight);

        // Add ambient light
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(this.ambientLight);

        // Mouse interaction
        document.addEventListener('mousemove', (e) => {
            this.mesh.rotation.x = (e.clientY - window.innerHeight/2) * 0.0005;
            this.mesh.rotation.y = (e.clientX - window.innerWidth/2) * 0.0005;
        });
    }

    createObjects() {
        // Add floating particles system
        this.particlesGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(5000 * 3);
        
        for(let i = 0; i < 5000 * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 10;
            positions[i + 1] = (Math.random() - 0.5) * 10;
            positions[i + 2] = (Math.random() - 0.5) * 10;
        }

        this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.particlesMaterial = new THREE.PointsMaterial({
            size: 0.005,
            color: 0x00ff00
        });

        this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial);
        this.scene.add(this.particles);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        this.mesh.rotation.x += 0.002;
        this.mesh.rotation.y += 0.003;
        this.particles.rotation.y += 0.001;
        
        this.renderer.render(this.scene, this.camera);
    }
}

new ThreeScene();
