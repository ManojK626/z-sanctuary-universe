// Z: dashboard\rkpk-avatar.js
export const initRkpkAvatar = async (container) => {
  if (!container) return null;

  try {
    const THREE = await import('https://unpkg.com/three@0.161.0/build/three.module.js');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.35, 5.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xfff2e6, 0.6);
    const keyLight = new THREE.DirectionalLight(0xffd4b2, 0.9);
    keyLight.position.set(2.5, 3.6, 4.4);
    const rim = new THREE.PointLight(0xc5f0da, 0.5, 10);
    rim.position.set(-3, 1.8, -2);
    scene.add(ambient, keyLight, rim);

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x3e4659,
      metalness: 0.1,
      roughness: 0.6,
      emissive: 0x1a1f2d,
      emissiveIntensity: 0.2,
    });

    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0xf2b8b8,
      metalness: 0.05,
      roughness: 0.5,
      emissive: 0x2a1f22,
      emissiveIntensity: 0.15,
    });

    const glowMaterial = new THREE.MeshStandardMaterial({
      color: 0xc5f0da,
      metalness: 0.1,
      roughness: 0.4,
      emissive: 0xc5f0da,
      emissiveIntensity: 0.8,
    });

    const auraMaterial = new THREE.MeshStandardMaterial({
      color: 0xc5f0da,
      emissive: 0xc5f0da,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.25,
    });

    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0xfff3ec,
      emissive: 0xfff3ec,
      emissiveIntensity: 0.9,
    });

    const tuskMaterial = new THREE.MeshStandardMaterial({
      color: 0xf0ddc7,
      roughness: 0.4,
    });

    const body = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), bodyMaterial);
    body.scale.set(1.35, 1.1, 1.15);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.55, 0.65);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.72, 32, 32), bodyMaterial);

    const earGeometry = new THREE.SphereGeometry(0.5, 24, 24);
    const earLeft = new THREE.Mesh(earGeometry, accentMaterial);
    earLeft.scale.set(1.3, 1.7, 0.25);
    earLeft.position.set(-0.95, 0.05, 0.05);
    const earRight = earLeft.clone();
    earRight.position.x = 0.95;

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.85, 18), accentMaterial);
    trunk.position.set(0, -0.3, 0.95);
    trunk.rotation.x = Math.PI / 2;

    const tuskGeometry = new THREE.ConeGeometry(0.06, 0.24, 12);
    const tuskLeft = new THREE.Mesh(tuskGeometry, tuskMaterial);
    tuskLeft.position.set(-0.2, -0.18, 1.05);
    tuskLeft.rotation.x = Math.PI / 2;
    const tuskRight = tuskLeft.clone();
    tuskRight.position.x = 0.2;

    const eyeLeft = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), eyeMaterial);
    eyeLeft.position.set(-0.22, 0.12, 0.68);
    const eyeRight = eyeLeft.clone();
    eyeRight.position.x = 0.22;

    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.05, 16, 60), glowMaterial);
    halo.rotation.x = Math.PI / 2;
    halo.position.set(0, 0.05, 0);

    headGroup.add(head, earLeft, earRight, trunk, tuskLeft, tuskRight, eyeLeft, eyeRight, halo);

    const aura = new THREE.Mesh(new THREE.SphereGeometry(1.7, 32, 32), auraMaterial);
    aura.scale.set(1.02, 1.04, 1.02);

    const group = new THREE.Group();
    group.add(aura, body, headGroup);
    scene.add(group);

    const palettes = {
      calm: {
        body: 0x3e4659,
        accent: 0xf2b8b8,
        glow: 0xc5f0da,
        aura: 0xc5f0da,
        eye: 0xfff3ec,
        tusk: 0xf0ddc7,
      },
      warn: {
        body: 0x3a2b2b,
        accent: 0xf3c6a8,
        glow: 0xf4c36b,
        aura: 0xf4c36b,
        eye: 0xffe6da,
        tusk: 0xf0ddc7,
      },
      celebrate: {
        body: 0x4a3a2a,
        accent: 0xf7d9b6,
        glow: 0xf4c36b,
        aura: 0xf4c36b,
        eye: 0xfff0d8,
        tusk: 0xf4e0c8,
      },
    };

    let activeMood = 'calm';
    const setMood = (mood) => {
      const palette = palettes[mood] || palettes.calm;
      activeMood = palette === palettes[mood] ? mood : 'calm';
      bodyMaterial.color.setHex(palette.body);
      bodyMaterial.emissive.setHex(palette.body);
      accentMaterial.color.setHex(palette.accent);
      accentMaterial.emissive.setHex(palette.accent);
      glowMaterial.color.setHex(palette.glow);
      glowMaterial.emissive.setHex(palette.glow);
      auraMaterial.color.setHex(palette.aura);
      auraMaterial.emissive.setHex(palette.aura);
      eyeMaterial.color.setHex(palette.eye);
      eyeMaterial.emissive.setHex(palette.eye);
      tuskMaterial.color.setHex(palette.tusk);
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

    const earBase = Math.PI / 7;
    earLeft.rotation.z = earBase;
    earRight.rotation.z = -earBase;

    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      group.rotation.y = Math.sin(t * 0.2) * 0.12;
      group.position.y = Math.sin(t * 0.8) * 0.04;
      headGroup.rotation.y = Math.sin(t * 0.6) * 0.08;
      trunk.rotation.x = Math.PI / 2 + Math.sin(t * 1.2) * 0.1;
      earLeft.rotation.z = earBase + Math.sin(t * 1.1) * 0.08;
      earRight.rotation.z = -earBase - Math.sin(t * 1.1) * 0.08;
      halo.rotation.z = t * 0.4;
      aura.scale.setScalar(1.02 + Math.sin(t * 1.0) * 0.02);
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
    fallback.className = 'rkpk-fallback-orb';
    container.appendChild(fallback);
    return {
      setMood: () => {},
      resize: () => {},
      dispose: () => {},
    };
  }
};
