"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Text, PresentationControls, Float, RoundedBox } from "@react-three/drei";
import { Badge } from "@/data/badges";
import { useRef, useEffect, useState } from "react";
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
    const [sn, setSn] = useState(1000);
    const { viewport } = useThree();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSn(Math.floor(Math.random() * 10000));
    }, []);

    // Scale down the card if the viewport is narrower than the card's width + margin
    const responsiveScale = Math.min(1, (viewport.width * 0.85) / 3);

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group ref={groupRef} scale={responsiveScale}>
                {/* The Glass Card Body */}
                <RoundedBox 
                    args={[3, 4, 0.1]} 
                    radius={0.15} 
                    smoothness={4} 
                    castShadow 
                    receiveShadow
                >
                    <meshPhysicalMaterial 
                        color={0xffffff}
                        transmission={0.95}
                        opacity={1}
                        transparent={true}
                        roughness={0.1}
                        ior={1.5}
                        thickness={0.5}
                        iridescence={1.0}
                        iridescenceIOR={1.3}
                        clearcoat={1.0}
                        clearcoatRoughness={0.1}
                        envMapIntensity={1.5}
                    />
                </RoundedBox>

                {/* Internal Glow / Accent Layer */}
                <RoundedBox 
                    args={[2.85, 3.85, 0.05]} 
                    radius={0.12} 
                    smoothness={4}
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
                <group position={[0, 0, 0.051]}>
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
                        maxWidth={2.5}
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

                {/* Back Side Specifications */}
                <group position={[0, 0, -0.051]} rotation={[0, Math.PI, 0]}>
                    <Text
                        position={[0, 1.5, 0]}
                        fontSize={0.18}
                        color={theme.color}
                        anchorX="center"
                        anchorY="middle"
                    >
                        TECHNICAL SPECS
                    </Text>

                    <Text
                        position={[0, 0.5, 0]}
                        fontSize={0.15}
                        color="white"
                        fillOpacity={0.8}
                        anchorX="center"
                        anchorY="middle"
                    >
                        Rarity: {badge.rarity || "Common"}
                    </Text>

                    <Text
                        position={[0, 0, 0]}
                        fontSize={0.15}
                        color="white"
                        fillOpacity={0.8}
                        anchorX="center"
                        anchorY="middle"
                    >
                        XP Reward: {badge.xpReward || 0}
                    </Text>
                    
                    <Text
                        position={[0, -1.5, 0]}
                        fontSize={0.1}
                        color="white"
                        fillOpacity={0.3}
                        anchorX="center"
                        anchorY="middle"
                    >
                        S/N: {badge.id.toUpperCase()}-{sn}
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