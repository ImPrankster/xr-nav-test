import { useCallback, useEffect, useState } from "react";
import { getJointsFromXRFrame, type Joints } from "~/helpers/joints";

/**
 * Custom hook for tracking hand joints in XR sessions.
 *
 * This hook encapsulates all the logic needed to track hand joints from an XR session,
 * including setting up the tracking interval and managing the joint data state.
 *
 * @param session - The XR session to track joints from
 * @param originReferenceSpace - The origin reference space for coordinate transformations
 * @param updateInterval - How often to update joints in milliseconds (default: 100ms)
 * @returns The current joint data as a Float32Array containing 25 joints with 16 floats each (4x4 matrices)
 *
 * @example
 * ```tsx
 * function MyComponent({ xrStore }: { xrStore: XRStore }) {
 *   const { session, originReferenceSpace } = useXRSession(xrStore);
 *   const joints = useJoints(session, originReferenceSpace, 100); // Update every 100ms
 *
 *   useEffect(() => {
 *     // Process joint data
 *     console.log('Current joints:', joints);
 *   }, [joints]);
 *
 *   return <div>Hand tracking active</div>;
 * }
 * ```
 */
export function useJoints(
	session: XRSession | undefined,
	originReferenceSpace: XRReferenceSpace | undefined,
	updateInterval: number = 100,
): Joints {
	const [joints, setJoints] = useState<Joints>(new Float32Array(25 * 16));

	const onXRFrame = useCallback(
		(
			time: number,
			frame: XRFrame,
			session: XRSession,
			originReferenceSpace: XRReferenceSpace,
		) => {
			const jointTransforms = getJointsFromXRFrame(
				time,
				frame,
				session,
				originReferenceSpace,
			);

			if (jointTransforms) {
				setJoints(jointTransforms);
			}
		},
		[],
	);

	// Set up joint tracking interval
	useEffect(() => {
		let intervalId: number | undefined;
		if (session && originReferenceSpace) {
			// Run at the specified interval
			intervalId = window.setInterval(() => {
				if (session && originReferenceSpace) {
					// Request a single frame to get the latest hand data
					session.requestAnimationFrame((time, frame) => {
						onXRFrame(time, frame, session, originReferenceSpace);
					});
				}
			}, updateInterval);
			console.log("started hand tracking interval", intervalId);
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
				console.log("cleared hand tracking interval", intervalId);
			}
		};
	}, [session, originReferenceSpace, updateInterval, onXRFrame]);

	return joints;
}
