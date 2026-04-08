"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Text, PresentationControls, Float, RoundedBox, useTexture } from "@react-three/drei";
import { Badge, RARITY_COLORS } from "@/content/badges";
import { useRef, useEffect, useState, useMemo, Suspense } from "react";
import * as THREE from "three";
import { haptics } from "@/lib/haptics";

function CardModel({ badge, userName }: { badge: Badge; userName: string }) {
    const rarity = badge.rarity || "Common";
    const tierColor = RARITY_COLORS[rarity];
    
    // Extract hex color from rgba string
    const getHexFromRgba = (rgba: string) => {
        const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            return `#${((1 << 24) + (parseInt(match[1]) << 16) + (parseInt(match[2]) << 8) + parseInt(match[3])).toString(16).slice(1)}`;
        }
        return "#ffffff";
    };

    const cardColor = getHexFromRgba(tierColor.border);
    const glowColor = getHexFromRgba(tierColor.glow);

    const groupRef = useRef<THREE.Group>(null);
    const { viewport } = useThree();
    
    // Move useTexture inside Suspense-friendly structure
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
                        color={cardColor}
                        emissive={glowColor}
                        emissiveIntensity={0.2}
                        transmission={0.8}
                        opacity={1}
                        transparent={true}
                        roughness={0.1}
                        ior={1.5}
                        thickness={0.5}
                        attenuationColor={cardColor}
                        attenuationDistance={2}
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
                    args={[2.15, 3.9, 0.01]} 
                    radius={0.04} 
                    smoothness={12}
                    position={[0, 0, 0]}
                >
                    <meshStandardMaterial 
                        color={cardColor} 
                        emissive={glowColor}
                        emissiveIntensity={1.5}
                        transparent
                        opacity={0.85}
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

    const rarity = badge.rarity || "Common";
    const tierColor = RARITY_COLORS[rarity];
    const getHexFromRgba = (rgba: string) => {
        const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            return `#${((1 << 24) + (parseInt(match[1]) << 16) + (parseInt(match[2]) << 8) + parseInt(match[3])).toString(16).slice(1)}`;
        }
        return "#ffffff";
    };
    const spotLightColor = getHexFromRgba(tierColor.glow);

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
            style={{ 
                width: "100%", 
                height: "100%", 
                background: "#050508", 
                touchAction: "none",
                userSelect: "none"
            }}
        >
            <Canvas 
                style={{ touchAction: "none" }} 
                camera={{ position: [0, 0, 6], fov: 45 }}
                dpr={[1, 2]} // Optimizes pixel ratio for performance/stability
                gl={{ 
                    antialias: true, 
                    alpha: false, 
                    powerPreference: "high-performance",
                    preserveDrawingBuffer: false
                }}
                onCreated={({ gl }) => {
                    gl.setClearColor("#050508");
                }}
            >
                <color attach="background" args={["#050508"]} />
                
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
                <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={1} color={spotLightColor} />

                <Suspense fallback={null}>
                    <PresentationControls 
                        global 
                        rotation={[0, 0, 0]} 
                        polar={[-Math.PI / 4, Math.PI / 4]} 
                        azimuth={[-Math.PI, Math.PI]} 
                        snap={true}
                    >
                        <CardModel badge={badge} userName={userName} />
                    </PresentationControls>
                </Suspense>

                <Environment preset="studio" />
            </Canvas>
        </div>
    );
}

