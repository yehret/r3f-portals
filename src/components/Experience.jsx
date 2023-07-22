import {
  CameraControls,
  Environment,
  MeshPortalMaterial,
  OrbitControls,
  RoundedBox,
  Text,
  useTexture,
} from '@react-three/drei';
import * as THREE from 'three';
import { Bird } from './Bird';
import { Demon } from './Demon';
import { Orc } from './Orc';
import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';

export const Experience = () => {
  const [active, setActive] = useState(null);
  const controlsRef = useRef();
  const scene = useThree((state) => state.scene);

  useFrame(() => {
    if (active) {
      const targetPosition = new THREE.Vector3();
      scene.getObjectByName(active).getWorldPosition(targetPosition);
      controlsRef.current.setLookAt(
        0,
        0,
        5,
        targetPosition.x,
        targetPosition.y,
        targetPosition.z,
        true,
      );
    } else {
      controlsRef.current.setLookAt(0, 0, 10, 0, 0, 0);
    }
  }, [active]);

  return (
    <>
      <CameraControls ref={controlsRef} />
      <MonsterStage
        texture={'textures/water-world.jpg'}
        name={'Bird'}
        color={'#38adcf'}
        active={active}
        setActive={setActive}>
        <Bird scale={0.6} position-y={-1} />
      </MonsterStage>
      <MonsterStage
        texture={'textures/lava-world.jpg'}
        name={'Demon'}
        color={'#df8d52'}
        position-x={-2.5}
        rotation-y={Math.PI / 8}
        active={active}
        setActive={setActive}>
        <Demon scale={0.6} position-y={-1} />
      </MonsterStage>
      <MonsterStage
        texture={'textures/desert-world.jpg'}
        name={'Orc'}
        color={'#739d3c'}
        position-x={2.5}
        rotation-y={-Math.PI / 8}
        active={active}
        setActive={setActive}>
        <Orc scale={0.6} position-y={-1} />
      </MonsterStage>
    </>
  );
};

const MonsterStage = ({ children, texture, name, color, active, setActive, ...props }) => {
  const portalMaterial = useRef();
  const map = useTexture(texture);

  useFrame((_state, delta) => {
    const worldOpen = active === name;
    easing.damp(portalMaterial.current, 'blend', worldOpen ? 1 : 0, 0.2, delta);
  });

  return (
    <group {...props}>
      <Text
        font="/fonts/Roboto-Regular.ttf"
        fontSize={0.3}
        position={[0, -1.4, 0.051]}
        anchorY={'bottom'}>
        {name}
        <meshBasicMaterial color={color} toneMapped={false} />
      </Text>
      <RoundedBox
        name={name}
        args={[2, 3, 0.1]}
        onDoubleClick={() => setActive(active === name ? null : name)}>
        <MeshPortalMaterial ref={portalMaterial} side={THREE.DoubleSide}>
          <Environment preset={'dawn'} />
          <ambientLight intensity={0.5} />
          <ambientLight intensity={0.5} />
          {children}
          <mesh>
            <sphereGeometry args={[5, 64, 64]} />
            <meshStandardMaterial map={map} side={THREE.BackSide} />
          </mesh>
        </MeshPortalMaterial>
      </RoundedBox>
    </group>
  );
};
