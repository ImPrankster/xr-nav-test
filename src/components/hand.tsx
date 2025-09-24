import { XRHandModel, XRSpace } from "@react-three/xr";
import { useAtom } from "jotai";
import { Suspense } from "react";
import { gestureAtom } from "~/helpers/gesture";

const HandWithIndicator = () => {
	const [gesture, _] = useAtom(gestureAtom);

	return (
		<>
			<Suspense>
				<XRHandModel />
			</Suspense>
			<Suspense>
				<XRSpace space="wrist">
					<mesh scale={0.06}>
						<boxGeometry />
						<meshBasicMaterial color={gesture.neutral ? "green" : "red"} />
					</mesh>
				</XRSpace>
			</Suspense>
		</>
	);
};

export default HandWithIndicator;
