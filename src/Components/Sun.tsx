import React from 'react';
import * as THREE from 'three'

interface SunProps{
    hoverIn: any,
    hoverOut: any
}

const Sun = (props: SunProps) => {
    return(
        <group>
            <mesh
                // ref={...mesh}
                visible geometry= {new THREE.SphereGeometry( 5, 32, 32 )}
                position={[0, 0, 0]}
                scale={[4.5, 4.5, 4.5]}
                onPointerOver={props.hoverIn}
                onPointerOut={props.hoverOut}
            >

                <meshStandardMaterial
                    attach="material"
                    color={'#fff899'}
                    roughness={0.8}
                    metalness={0}
                />
            </mesh>
        </group>
    )
}

export default Sun;