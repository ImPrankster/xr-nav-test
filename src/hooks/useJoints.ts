import { useXRJointsContext } from "../components/XRJointsProvider";
import { type Joints } from "~/helpers/joints";

/**
 * Custom hook for tracking hand joints in XR sessions.
 *
 * This hook provides the current joint data from the shared XR context.
 *
 * @returns The current joint data as a Float32Array containing 25 joints with 16 floats each (4x4 matrices)
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const joints = useJoints();
 *
 *   useEffect(() => {
 *     console.log('Current joints:', joints);
 *   }, [joints]);
 *
 *   return <div>Hand tracking active</div>;
 * }
 * ```
 */
export function useJoints(): Joints {
  const { joints } = useXRJointsContext();
  return joints;
}
