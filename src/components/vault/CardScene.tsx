"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Text, PresentationControls, Float, RoundedBox, useTexture } from "@react-three/drei";
import { Badge } from "@/content";
import { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { haptics } from "@/lib/haptics";

const THEMES = {
    claude: { color: "#EF6C00", emissive: "#EF6C00" }, // Copper
    chatgpt: { color: "#10A37F", emissive: "#10A37F" }, // Teal
    gemini: { color: "#4285F4", emissive: "#4285F4" }, // Blue
};

function CardModel({ badge, userName }: { badge: Badge; userName: string }) {
    const theme = THEMES[badge.modelTheme || "claude"];
    const groupRef = useRef<THREE.Group>(null);
    const { viewport } = useThree();
    const backTexture = useTexture("/backofcard.png");

    useMemo(() => {
        if (backTexture) {
            backTexture.wrapS = backTexture.wrapT = THREE.ClampToEdgeWrapping;
            backTexture.repeat.set(1, 1);
            backTexture.offset.set(0, 0); 
            backTexture.anisotropy = 16;
        }
    }, [backTexture]);

    const shapeGeoRef = useRef<THREE.ShapeGeometry>(null);

    // Create a rounded rectangle shape for the back cover to ensure perfect UV mapping
    const cardShape = useMemo(() => {
        const w = 2.25, h = 4, r = 0.05;
        const x = -w / 2, y = -h / 2;
        const shape = new THREE.Shape();
        shape.moveTo(x, y + r);
        shape.lineTo(x, y + h - r);
        shape.quadraticCurveTo(x, y + h, x + r, y + h);
        shape.lineTo(x + w - r, y + h);
        shape.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
        shape.lineTo(x + w, y + r);
        shape.quadraticCurveTo(x + w, y, x + w - r, y);
        shape.lineTo(x + r, y);
        shape.quadraticCurveTo(x, y, x, y + r);
        return shape;
    }, []);

    // Manual UV normalization for ShapeGeometry
    useEffect(() => {
        if (shapeGeoRef.current) {
            const pos = shapeGeoRef.current.attributes.position;
            const uv = shapeGeoRef.current.attributes.uv;
            if (pos && uv) {
                for (let i = 0; i < pos.count; i++) {
                    const px = pos.getX(i);
                    const py = pos.getY(i);
                    // Map from world [-1.125, 1.125] to UV [0, 1]
                    // Map from world [-2, 2] to UV [0, 1]
                    uv.setXY(i, (px + 1.125) / 2.25, (py + 2) / 4);
                }
                uv.needsUpdate = true;
            }
        }
    }, [cardShape]);

    useEffect(() => {
        // Init logic if needed
    }, []);

    // Scale down the card if the viewport is narrower than the card's width + margin
    const responsiveScale = Math.min(1, (viewport.width * 0.85) / 3);

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group ref={groupRef} scale={responsiveScale}>
                {/* The Glass Card Body */}
                <RoundedBox 
                    args={[2.25, 4, 0.04]} 
                    radius={0.05} 
                    smoothness={12} 
                    castShadow 
                    receiveShadow
                >
                    <meshPhysicalMaterial 
                        color={0xffffff}
                        transmission={0.95}
                        opacity={1}
                        transparent={true}
                        roughness={0.15}
                        ior={1.5}
                        thickness={0.5}
                        iridescence={1.0}
                        iridescenceIOR={1.3}
                        clearcoat={1.0}
                        clearcoatRoughness={0.1}
                        envMapIntensity={1.5}
                    />
                </RoundedBox>

                {/* Back Texture Layer - Using ShapeGeometry for rounded corners matching the body */}
                <mesh position={[0, 0, -0.0201]} rotation={[0, Math.PI, 0]}>
                    <shapeGeometry ref={shapeGeoRef} args={[cardShape]} />
                    <meshBasicMaterial map={backTexture} transparent />
                </mesh>

                {/* Internal Glow / Accent Layer */}
                <RoundedBox 
                    args={[2.1, 3.85, 0.02]} 
                    radius={0.04} 
                    smoothness={12}
                    position={[0, 0, 0]}
                >
                    <meshStandardMaterial 
                        color={theme.color} 
                        emissive={theme.emissive}
                        emissiveIntensity={0.2}
                        transparent
                        opacity={0.15}
                    />
                </RoundedBox>

                {/* Front Side Etched Data */}
                <group position={[0, 0, 0.021]}>
                    <Text
                        position={[0, 1.2, 0]}
                        fontSize={0.6}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {badge.icon}
                    </Text>
                    
                    <Text
                        position={[0, 0.3, 0]}
                        fontSize={0.25}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        fontWeight="bold"
                    >
                        {badge.name}
                    </Text>
                    
                    <Text
                        position={[0, -0.2, 0]}
                        fontSize={0.15}
                        color="white"
                        fillOpacity={0.7}
                        anchorX="center"
                        anchorY="middle"
                        maxWidth={1.8}
                        textAlign="center"
                    >
                        {badge.description}
                    </Text>

                    <Text
                        position={[0, -1.5, 0]}
                        fontSize={0.12}
                        color="white"
                        fillOpacity={0.4}
                        anchorX="center"
                        anchorY="middle"
                    >
                        {userName || "לומד"}
                    </Text>
                </group>
            </group>
        </Float>
    );
}

export default function CardScene({ badge, userName }: { badge: Badge; userName: string }) {
    const [hapticTriggered, setHapticTriggered] = useState(false);

    // This haptic will only trigger ONCE upon user interaction
    const triggerHaptic = () => {
        if (!hapticTriggered) {
            haptics.success();
            setHapticTriggered(true);
        }
    };

    return (
        <div 
            onPointerDown={triggerHaptic}
            style={{ width: "100%", height: "100%", background: "#050508", touchAction: "none" }}
        >
            <Canvas 
                style={{ touchAction: "none" }} 
                camera={{ position: [0, 0, 6], fov: 45 }}
            >
                <color attach="background" args={["#050508"]} />
                
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
                <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={1} color="#4285F4" />

                <PresentationControls 
                    global 
                    rotation={[0, 0, 0]} 
                    polar={[-Math.PI / 4, Math.PI / 4]} 
                    azimuth={[-Math.PI, Math.PI]} 
                    snap={true}
                >
                    <CardModel badge={badge} userName={userName} />
                </PresentationControls>

                <Environment preset="studio" />
            </Canvas>
        </div>
    );
}

