import { useXRStore } from "@react-three/xr";
import { useEffect, useState } from "react";

/**
 * Custom hook for managing XR session and origin reference space.
 *
 * This hook subscribes to the XR store and provides the current session
 * and origin reference space state.
 *
 * @param xrStore - The XR store containing session and reference space data
 * @returns Object containing the current session and originReferenceSpace
 *
 * @example
 * ```tsx
 * function MyComponent({ xrStore }: { xrStore: XRStore }) {
 *   const { session, originReferenceSpace } = useXRSession(xrStore);
 *
 *   return (
 *     <div>
 *       {session ? "XR Session Active" : "No XR Session"}
 *     </div>
 *   );
 * }
 * ```
 */
export function useXRSession() {
	const xrStore = useXRStore();
	const [session, setSession] = useState<XRSession | undefined>(undefined);
	const [originReferenceSpace, setOriginReferenceSpace] = useState<
		XRReferenceSpace | undefined
	>(undefined);

	// Subscribe to XR store changes
	useEffect(() => {
		const unsubscribe = xrStore.subscribe((state) => {
			const { session, originReferenceSpace } = state;
			setSession(session);
			setOriginReferenceSpace(originReferenceSpace);
		});
		return () => {
			unsubscribe();
		};
	}, [xrStore]);

	return { session, originReferenceSpace };
}
