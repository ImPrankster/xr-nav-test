import { Canvas } from "@react-three/fiber";
import { XR, type XRStore } from "@react-three/xr";

export default function Scene({ xrStore }: { xrStore: XRStore }) {
	return (
		<Canvas shadows camera={{ position: [5, 2, 10], fov: 50 }}>
			<XR store={xrStore}>
				<ambientLight intensity={0.5} />
				<pointLight position={[2, 2, 2]} intensity={1} />
				<mesh>
					<boxGeometry args={[1, 1, 1]} />
					<meshStandardMaterial color="#ff69b4" />
				</mesh>
			</XR>
		</Canvas>
	);
}
