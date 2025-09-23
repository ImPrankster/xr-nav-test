import type { XRStore } from "@react-three/xr";
import { useCallback, useEffect, useState } from "react";
import { getJointTransform, getJointXYZ, type Joints } from "~/helpers/joints";
import { useJoints } from "./useJoints";
import { useXRSession } from "./useXRSession";

/**
 * Custom hook for detecting when both hands are in a neutral position
 * by checking if the thumb tips of both hands are close together.
 *
 * This hook directly accesses the XR session to get joint data from both hands
 * and determines when the user's hands are in a neutral/resting position.
 *
 * @param xrStore - The XR store containing session and reference space data
 * @param threshold - Distance threshold in meters to consider thumb tips "close" (default: 0.05m)
 * @returns Object containing:
 *   - isNeutral: boolean indicating if hands are in neutral position
 *
 * @example
 * ```tsx
 * function MyComponent({ xrStore }: { xrStore: XRStore }) {
 *   const { isNeutral } = useNeutralHandPos(xrStore);
 *
 *   return (
 *     <div>
 *       <p>Hands neutral: {isNeutral ? "Yes" : "No"}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useNeutralHandPos(xrStore: XRStore, threshold: number = 0.05) {
	const { session, originReferenceSpace } = useXRSession(xrStore);

	const [isNeutral, setIsNeutral] = useState(false);
	const joints = useJoints(session, originReferenceSpace, 100);

	const checkNeutralPosition = useCallback(
		(joints: Joints | null) => {
			if (!joints) {
				setIsNeutral(false);
				return;
			}

			const thumbPos = getJointXYZ(getJointTransform("Thumb_Tip", joints));
			const indexPos = getJointXYZ(getJointTransform("Index_Tip", joints));

			// Calculate distance between thumb tips
			const thumbDistance = thumbPos.distanceTo(indexPos);

			setIsNeutral(thumbDistance <= threshold);
		},
		[threshold],
	);

	useEffect(() => {
		checkNeutralPosition(joints);
	}, [joints, checkNeutralPosition]);

	return {
		isNeutral,
	};
}
