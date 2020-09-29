import { group } from 'console';
import * as THREE from 'three'
import React from 'react';

interface PlanetProps{
    propScale: number, 
    propX: number, 
    propY: number,
    name: string,
    hoverIn: any,
    hoverOut: any
}

const Planet = (props: PlanetProps) => {
    let planetScale = props.propScale / 250;
    planetScale = (3 * Math.sqrt(planetScale) + 5) / 3;

    let coordX = ((Math.sqrt(Math.abs(props.propX)) + (0.4 * Math.abs(props.propX))) * 100);
    let coordY = ((Math.sqrt(Math.abs(props.propY)) + (0.4 * Math.abs(props.propY))) * 100);

    // coordX = (Math.sqrt(Math.abs(props.propX)) * 100);
    // coordY = (Math.sqrt(Math.abs(props.propY)) * 100);

    if (props.propX <0) coordX *= -1;
    if (props.propY <0) coordY *= -1;
    

    let planetColor = "#bbbbbb"

    switch(props.name){
        default: break;
        case "Earth": planetColor="#3884c2"; break;
        case "Venus": planetColor="#f2eee9"; break;
        case "Mercury": planetColor="#cfcbc4"; break;
        case "Mars": planetColor="#e88564"; break;
        case "Jupiter": planetColor="#e6c395"; break;
        case "Saturn": planetColor="#edce79"; break;
        case "Uranus": planetColor="#517eb5"; break;

        case "Ceres": planetColor="#ded9cf"; break;
        case "Pluto": planetColor="#f5efe0"; break;
        case "Eris": planetColor="#ded9cf"; break;
        case "Haumea": planetColor="#ded9cf"; break;
        case "Makemake": planetColor="#cf8d72"; break;
    }

    const formatSaturnRing = () => {
        switch(props.name){
            default: return null
            case "Saturn": return(
                <mesh
                    // ref={...mesh}
                    visible geometry= {new THREE.RingGeometry( 7, 10, 16 )}
                    position={[coordX,  0, coordY]}
                    scale={[planetScale, planetScale, planetScale]}
                    rotation={[1.5708,0,0]}
    
                    onPointerOver={props.hoverIn}
                    onPointerOut={props.hoverOut}
                >
    
                <meshStandardMaterial
                    side={THREE.DoubleSide}
                    attach="material"
                    color={planetColor}
                    roughness={0.8}
                    metalness={0.4}
                />
                </mesh>
            )
        }
    }

    return(
        <group>
            <mesh
                // ref={...mesh}
                visible geometry= {new THREE.SphereGeometry( 5, 32, 32 )}
                position={[coordX,  0, coordY]}
                scale={[planetScale, planetScale, planetScale]}

                onPointerOver={props.hoverIn}
                onPointerOut={props.hoverOut}
            >

                <meshStandardMaterial
                    attach="material"
                    color={planetColor}
                    roughness={0.8}
                    metalness={0.4}
                />
            </mesh>

            {formatSaturnRing()}
        </group>
    )
}

export default Planet;