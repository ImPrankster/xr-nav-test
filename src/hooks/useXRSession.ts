import { useXRJointsContext } from "../components/XRJointsProvider";

/**
 * Custom hook for managing XR session and origin reference space.
 *
 * This hook provides the current session and origin reference space state from the shared XR context.
 *
 * @returns Object containing the current session and originReferenceSpace
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { session, originReferenceSpace } = useXRSession();
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
  const { session, originReferenceSpace } = useXRJointsContext();
  return { session, originReferenceSpace };
}
