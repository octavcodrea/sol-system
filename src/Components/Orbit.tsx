import { group } from 'console';
import * as THREE from 'three'
import React  from 'react';
// import { Canvas,  useLoader, useFrame, extend, useThree, ReactThreeFiber } from 'react-three-fiber';
// import { DoubleSide, FrontSide } from 'three';

interface OrbitProps{
    distX: number,
    distY: number,
    type: string
}

function calculateDistance(dx:number, dy:number):number{
    let sunCoords = new THREE.Vector3(0,0,0);

    let coordX = ((Math.sqrt(Math.abs(dx)) + (0.4 * Math.abs(dx))) * 100);
    let coordY = ((Math.sqrt(Math.abs(dy)) + (0.4 * Math.abs(dy))) * 100);

    let planetCoords = new THREE.Vector3(coordX, coordY, 0);
    let dist = sunCoords.distanceTo(planetCoords);

    return dist;
}

const Orbit = (props: OrbitProps) =>{

    // Creates a ring around the Sun (0,0) element. The size of the orbit is based on the planet's distance from the Sun.

    return(
        <mesh
                // ref={...mesh}
                visible geometry= {new THREE.RingGeometry( calculateDistance(props.distX, props.distY), calculateDistance(props.distX, props.distY) + 0.5, 48 )}
                
                rotation={[1.5708,0,0]}
                position={[0,0,0]}
                // scale={[planetScale, planetScale, planetScale]}
                // scale={[1,1,1]}
                // onPointerOver={hoverIn}
                // onPointerOut={hoverOut}
                >

                <meshStandardMaterial
                    side={THREE.DoubleSide}
                    attach="material"
                    color={ props.type === "planet" ? "white" : "#dec48b"} 
                    metalness={0}
                />
            </mesh>
    )
}

export default Orbit;