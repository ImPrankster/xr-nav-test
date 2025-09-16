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
import { Suspense, useEffect, useState } from "react";
import {
	getJointsFromXRFrame,
	getJointsPositions,
	type Joints,
	printHandJoints2D,
} from "~/helpers/joints";
import type { PhysicalBodyCommonProps } from "~/helpers/types";
import { Chair, Lamp, Mug, Table } from "./furniture";

export default function Scene({ xrStore }: { xrStore: XRStore }) {
	const [session, setSession] = useState<XRSession | undefined>(undefined);
	const [originReferenceSpace, setOriginReferenceSpace] = useState<
		XRReferenceSpace | undefined
	>(undefined);
	const [joints, setJoints] = useState<Joints>(new Float32Array(25 * 16));

	function onXRFrame(
		time: number,
		frame: XRFrame,
		session: XRSession,
		originReferenceSpace: XRReferenceSpace,
	) {
		const jointTransforms = getJointsFromXRFrame(
			time,
			frame,
			session,
			originReferenceSpace,
		);

		if (jointTransforms) {
			setJoints(jointTransforms);
		}
	}

	useEffect(() => {
		const unsubscribe = xrStore.subscribe((state) => {
			const { session, originReferenceSpace } = state;
			setSession(session);
			setOriginReferenceSpace(originReferenceSpace);
			console.log("session", session);
		});
		return () => {
			unsubscribe();
		};
	}, [xrStore]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: we need to keep the session in the dependency array
	useEffect(() => {
		let intervalId: number | undefined;
		if (session && originReferenceSpace) {
			// Run at 10 times per second (every 100ms)
			intervalId = window.setInterval(() => {
				if (session && originReferenceSpace) {
					// Request a single frame to get the latest hand data
					session.requestAnimationFrame((time, frame) => {
						onXRFrame(time, frame, session, originReferenceSpace);
					});
				}
			}, 100); // 100ms = 10 times per second
			console.log("started hand tracking interval", intervalId);
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
				console.log("cleared hand tracking interval", intervalId);
			}
		};
	}, [session, originReferenceSpace]);

	useEffect(() => {
		printHandJoints2D(joints);
	}, [joints]);

	return (
		<Canvas
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
