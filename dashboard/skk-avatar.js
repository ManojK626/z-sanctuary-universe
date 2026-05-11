// Z: dashboard\skk-avatar.js
export const initSkkAvatar = async (container) => {
  if (!container) return null;

  try {
    const THREE = await import('https://unpkg.com/three@0.161.0/build/three.module.js');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.4, 5.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0x9fd7ff, 0.6);
    const keyLight = new THREE.DirectionalLight(0xffd8a6, 0.9);
    keyLight.position.set(2.5, 3.5, 4.5);
    const rim = new THREE.PointLight(0x6fd1c7, 0.6, 10);
    rim.position.set(-3, 1.5, -2);
    scene.add(ambient, keyLight, rim);

    const featherMaterial = new THREE.MeshStandardMaterial({
      color: 0x172235,
      metalness: 0.1,
      roughness: 0.55,
      emissive: 0x0f1a2a,
      emissiveIntensity: 0.3,
    });

    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x24314f,
      metalness: 0.25,
      roughness: 0.35,
      emissive: 0x1b2947,
      emissiveIntensity: 0.45,
    });

    const glowMaterial = new THREE.MeshStandardMaterial({
      color: 0x6fd1c7,
      metalness: 0.1,
      roughness: 0.45,
      emissive: 0x6fd1c7,
      emissiveIntensity: 0.9,
    });

    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0xeaf9ff,
      emissive: 0xeaf9ff,
      emissiveIntensity: 1,
    });

    const beakMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4c36b,
      roughness: 0.4,
    });

    const auraMaterial = new THREE.MeshStandardMaterial({
      color: 0x6fd1c7,
      emissive: 0x6fd1c7,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.25,
    });

    const body = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), featherMaterial);
    body.scale.set(1.2, 1.35, 1.05);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.95, 0.2);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.65, 32, 32), coreMaterial);
    const eyeLeft = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 24), eyeMaterial);
    eyeLeft.position.set(-0.24, 0.12, 0.62);
    const eyeRight = eyeLeft.clone();
    eyeRight.position.x = 0.24;

    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.35, 20), beakMaterial);
    beak.position.set(0, -0.04, 0.86);
    beak.rotation.x = Math.PI / 2;

    const tuftGeometry = new THREE.ConeGeometry(0.12, 0.32, 12);
    const tuftLeft = new THREE.Mesh(tuftGeometry, coreMaterial);
    tuftLeft.position.set(-0.24, 0.7, -0.05);
    tuftLeft.rotation.x = Math.PI;
    const tuftRight = tuftLeft.clone();
    tuftRight.position.x = 0.24;

    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.06, 16, 60), glowMaterial);
    halo.rotation.x = Math.PI / 2;
    halo.position.set(0, 0.15, 0);

    headGroup.add(head, eyeLeft, eyeRight, beak, tuftLeft, tuftRight, halo);

    const wingGeometry = new THREE.BoxGeometry(0.2, 0.8, 1.1);
    const wingLeft = new THREE.Mesh(wingGeometry, featherMaterial);
    const wingRight = new THREE.Mesh(wingGeometry, featherMaterial);
    wingLeft.position.set(-1.05, 0.15, -0.05);
    wingRight.position.set(1.05, 0.15, -0.05);
    const wingBase = Math.PI / 10;
    wingLeft.rotation.z = wingBase;
    wingRight.rotation.z = -wingBase;
    wingLeft.rotation.y = Math.PI / 12;
    wingRight.rotation.y = -Math.PI / 12;

    const aura = new THREE.Mesh(new THREE.SphereGeometry(1.6, 32, 32), auraMaterial);
    aura.scale.set(1.05, 1.1, 1.05);

    const group = new THREE.Group();
    group.add(aura, body, wingLeft, wingRight, headGroup);
    scene.add(group);

    const palettes = {
      calm: {
        core: 0x24314f,
        feather: 0x172235,
        glow: 0x6fd1c7,
        aura: 0x6fd1c7,
        eye: 0xeaf9ff,
        beak: 0xf4c36b,
      },
      warn: {
        core: 0x2a1515,
        feather: 0x211010,
        glow: 0xf06b6b,
        aura: 0xf06b6b,
        eye: 0xffd5d5,
        beak: 0xf19a9a,
      },
      celebrate: {
        core: 0x2f2412,
        feather: 0x241a0f,
        glow: 0xf4c36b,
        aura: 0xf4c36b,
        eye: 0xfff0c9,
        beak: 0xf2b74a,
      },
    };

    let activeMood = 'calm';
    const setMood = (mood) => {
      const palette = palettes[mood] || palettes.calm;
      activeMood = palette === palettes[mood] ? mood : 'calm';
      coreMaterial.color.setHex(palette.core);
      coreMaterial.emissive.setHex(palette.core);
      featherMaterial.color.setHex(palette.feather);
      featherMaterial.emissive.setHex(palette.feather);
      glowMaterial.color.setHex(palette.glow);
      glowMaterial.emissive.setHex(palette.glow);
      auraMaterial.color.setHex(palette.aura);
      auraMaterial.emissive.setHex(palette.aura);
      eyeMaterial.color.setHex(palette.eye);
      eyeMaterial.emissive.setHex(palette.eye);
      beakMaterial.color.setHex(palette.beak);
      rim.color.setHex(palette.glow);
    };

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight || 1;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', resize);
    resize();
    setMood(activeMood);

    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.15;
      group.position.y = Math.sin(t * 0.9) * 0.05;
      headGroup.rotation.y = Math.sin(t * 0.6) * 0.12;
      headGroup.rotation.z = Math.sin(t * 0.7) * 0.05;
      wingLeft.rotation.z = wingBase + Math.sin(t * 1.3) * 0.12;
      wingRight.rotation.z = -wingBase - Math.sin(t * 1.3) * 0.12;
      halo.rotation.z = t * 0.5;
      aura.scale.setScalar(1.02 + Math.sin(t * 1.1) * 0.03);
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return {
      setMood,
      resize,
      dispose: () => {
        window.removeEventListener('resize', resize);
        renderer.dispose();
      },
    };
  } catch (err) {
    const fallback = document.createElement('div');
    fallback.className = 'skk-fallback-orb';
    container.appendChild(fallback);
    return {
      setMood: () => {},
      resize: () => {},
      dispose: () => {},
    };
  }
};
