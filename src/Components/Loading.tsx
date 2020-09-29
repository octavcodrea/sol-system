import React from 'react';
// import { Canvas, useFrame, extend, useThree, ReactThreeFiber } from 'react-three-fiber';
import * as THREE from 'three'

interface LoadingProps{
    hoverIn?: any,
    hoverOut?: any
}

const Loading = (props: LoadingProps) => {

    return (
      <mesh 
        visible geometry= {new THREE.SphereGeometry( 5, 32, 32 )}
        position={[0, 0, 0]}
        scale={[4.5, 4.5, 4.5]}

        onPointerOver={props.hoverIn}
        onPointerOut={props.hoverOut}
      >
        <meshStandardMaterial
          attach="material"
          color="white"

          opacity={1}
          roughness={1}
          metalness={0}
        />
      </mesh>
    )
}

export default Loading;