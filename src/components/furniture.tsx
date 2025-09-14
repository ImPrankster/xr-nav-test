import { useCompoundBody, useCylinder } from "@react-three/cannon";
import { SpotLight, useGLTF } from "@react-three/drei";
import type * as THREE from "three";
import type { PhysicalBodyCommonProps } from "~/helpers/types";
import { Block } from "./block";

export function Chair({ position, scale, rotation }: PhysicalBodyCommonProps) {
	const [ref] = useCompoundBody(() => ({
		mass: 0,
		linearDamping: 0.95,
		angularDamping: 0.95,
		shapes: [
			{ type: "Box", mass: 0, position: [0, 0, 0], args: [3.1, 3.1, 0.5] },
			{
				type: "Box",
				mass: 0,
				position: [0, -1.75, 1.25],
				args: [3.1, 0.5, 3.1],
			},
			{
				type: "Box",
				mass: 0,
				position: [5 + -6.25, -3.5, 0],
				args: [0.5, 3, 0.5],
			},
			{
				type: "Box",
				mass: 0,
				position: [5 + -3.75, -3.5, 0],
				args: [0.5, 3, 0.5],
			},
			{
				type: "Box",
				mass: 0,
				position: [5 + -6.25, -3.5, 2.5],
				args: [0.5, 3, 0.5],
			},
			{
				type: "Box",
				mass: 0,
				position: [5 + -3.75, -3.5, 2.5],
				args: [0.5, 3, 0.5],
			},
		],
		position,
		scale,
		rotation,
	}));
	return (
		<group ref={ref}>
			<Block position={[0, 0, 0]} scale={[3.1, 3.1, 0.5]} />
			<Block position={[0, -1.75, 1.25]} scale={[3.1, 0.5, 3.1]} />
			<Block position={[5 + -6.25, -3.5, 0]} scale={[0.5, 3, 0.5]} />
			<Block position={[5 + -3.75, -3.5, 0]} scale={[0.5, 3, 0.5]} />
			<Block position={[5 + -6.25, -3.5, 2.5]} scale={[0.5, 3, 0.5]} />
			<Block position={[5 + -3.75, -3.5, 2.5]} scale={[0.5, 3, 0.5]} />
		</group>
	);
}

export function Mug({ position, scale, rotation }: PhysicalBodyCommonProps) {
	const { nodes, materials } = useGLTF("cup.glb");
	const [cup] = useCylinder(() => ({
		mass: 1,
		args: [0.62, 0.62, 1.2, 16],
		linearDamping: 0.95,
		angularDamping: 0.95,
		position,
		scale,
		rotation,
	}));
	return (
		<group ref={cup} dispose={null}>
			<group rotation={[Math.PI / 2, 0, 0]} scale={[0.012, 0.012, 0.012]}>
				<mesh
					receiveShadow
					castShadow
					material={materials.default}
					geometry={(nodes["buffer-0-mesh-0"] as THREE.Mesh).geometry}
				/>
				<mesh
					material={materials.Liquid}
					geometry={(nodes["buffer-0-mesh-0_1"] as THREE.Mesh).geometry}
				/>
			</group>
		</group>
	);
}

export function Table({ position, scale, rotation }: PhysicalBodyCommonProps) {
	const [table] = useCompoundBody(() => ({
		mass: 0,
		linearDamping: 0.95,
		angularDamping: 0.95,
		shapes: [
			{ type: "Box", mass: 0, position: [0, 0, 0], args: [5, 0.5, 5] },
			{ type: "Box", mass: 0, position: [2, -2.25, 2], args: [0.5, 4, 0.5] },
			{ type: "Box", mass: 0, position: [-2, -2.25, -2], args: [0.5, 4, 0.5] },
			{ type: "Box", mass: 0, position: [-2, -2.25, 2], args: [0.5, 4, 0.5] },
			{ type: "Box", mass: 0, position: [2, -2.25, -2], args: [0.5, 4, 0.5] },
		],
		position,
		scale,
		rotation,
	}));
	return (
		<group ref={table}>
			<Block scale={[5, 0.5, 5]} position={[0, 0, 0]} />
			<Block scale={[0.5, 4, 0.5]} position={[2, -2.25, 2]} />
			<Block scale={[0.5, 4, 0.5]} position={[-2, -2.25, -2]} />
			<Block scale={[0.5, 4, 0.5]} position={[-2, -2.25, 2]} />
			<Block scale={[0.5, 4, 0.5]} position={[2, -2.25, -2]} />
		</group>
	);
}

export function Lamp(props: PhysicalBodyCommonProps) {
	return (
		<mesh position={[0, 10, 0]} {...props}>
			<cylinderGeometry args={[0.5, 1.5, 2, 32]} />
			<meshStandardMaterial />
			<SpotLight
				castShadow
				penumbra={0.2}
				radiusTop={0.4}
				radiusBottom={40}
				distance={80}
				angle={0.45}
				attenuation={20}
				anglePower={5}
				intensity={1}
				opacity={0.2}
			/>
		</mesh>
	);
}
