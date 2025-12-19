/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, memo } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import {
  useFBO,
  MeshTransmissionMaterial,
  Environment,
} from '@react-three/drei';
import { easing } from 'maath';

export default function FluidGlass({ 
  className, 
  intensity = 1,
  color = '#ffffff' 
}) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }} 
        gl={{ alpha: true }}
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 2]} // Handle high-dpi screens
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        {/* City preset gives good reflections for glass */}
        <Environment preset="city" />
        
        <GlassPlane intensity={intensity} color={color} />
      </Canvas>
    </div>
  );
}

const GlassPlane = memo(function GlassPlane({ intensity, color }) {
  const ref = useRef();
  const buffer = useFBO();
  const { viewport, size } = useThree();
  const [scene] = useState(() => new THREE.Scene());

  useFrame((state, delta) => {
    const { gl, camera, pointer } = state;
    
    if(ref.current) {
        // Subtle movement based on mouse
        // We use viewport dimensions to normalize movement
        const x = (pointer.x * viewport.width) / 8;
        const y = (pointer.y * viewport.height) / 8;
        
        easing.damp3(ref.current.position, [x, y, 0], 0.2, delta);
        
        // Slight rotation for "liquid" feel
        easing.dampE(ref.current.rotation, [pointer.y * 0.1, pointer.x * 0.1, 0], 0.2, delta);
    }

    // Render the scene to buffer for the transmission material
    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
  });

  return (
    <>
      {createPortal(
        <mesh>
            {/* Background geometry to refract - creates the "liquid" distortion */}
            <planeGeometry args={[viewport.width * 1.5, viewport.height * 1.5]} />
            <meshBasicMaterial color={color} transparent opacity={0.1} />
        </mesh>, 
        scene
      )}
      
      {/* The Glass Mesh */}
      <mesh ref={ref} scale={[viewport.width * 1.2, viewport.height * 1.2, 1]}>
        <planeGeometry args={[1, 1, 32, 32]} />
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={1.2}
          thickness={1.5 * intensity}
          anisotropy={0.2}
          chromaticAberration={0.06 * intensity}
          roughness={0.1}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.2}
          color={color}
          bg="#ffffff"
        />
      </mesh>
    </>
  );
});