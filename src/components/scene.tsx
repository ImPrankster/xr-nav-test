import { Physics, usePlane } from "@react-three/cannon";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
	noEvents,
	PointerEvents,
	XR,
	XROrigin,
	type XRStore,
} from "@react-three/xr";
import { Suspense } from "react";
import type { PhysicalBodyCommonProps } from "~/helpers/types";
import { Chair, Lamp, Mug, Table } from "./furniture";

export default function Scene({ xrStore }: { xrStore: XRStore }) {
	return (
		<Canvas
			onPointerMissed={() => console.log("missed")}
			dpr={[1, 2]}
			shadows
			events={noEvents}
			camera={{ position: [-40, 40, 40], fov: 25 }}
		>
			<PointerEvents />
			<OrbitControls />
			<XR store={xrStore}>
				<color attach="background" args={["#171720"]} />
				<ambientLight intensity={0.2} />
				<pointLight position={[-20, -5, -20]} color="red" />
				<Suspense>
					<Physics allowSleep={false} iterations={15} gravity={[0, -50, 0]}>
						<Floor position={[0, -5, 0]} />
						<Chair position={[0, 0, -2.52]} />
						<Table position={[8, -0.5, 0]} />
						<Mug position={[8, 3, 0]} />
						<Lamp position={[0, 15, 0]} />
					</Physics>
				</Suspense>
				<group position={[0, -5, 0]}>
					<XROrigin />
				</group>
			</XR>
		</Canvas>
	);
}

function Floor(props: PhysicalBodyCommonProps) {
	const [ref] = usePlane(() => ({
		type: "Static",
		rotation: [-Math.PI / 2, 0, 0],
		...props,
	}));
	return (
		<mesh ref={ref} receiveShadow>
			<planeGeometry args={[100, 100]} />
			<meshPhongMaterial color="#878790" />
		</mesh>
	);
}
