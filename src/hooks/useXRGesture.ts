import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { gestureAtom } from "~/helpers/gesture";
import { getJointTransform, getJointXYZ, type Joints } from "~/helpers/joints";
import { useXRJointsContext } from "../components/XRJointsProvider";

/**
 * Custom hook for detecting when both hands are in a neutral position
 * by checking if the thumb tips of both hands are close together.
 *
 * This hook directly accesses the XR session to get joint data from both hands
 * and determines when the user's hands are in a neutral/resting position.
 *
 * @param threshold - Distance threshold in meters to consider thumb tips "close" (default: 0.05m)
 * @returns Object containing:
 *   - isNeutral: boolean indicating if hands are in neutral position
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isNeutral } = useNeutralHandPos();
 *
 *   return (
 *     <div>
 *       <p>Hands neutral: {isNeutral ? "Yes" : "No"}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useNeutralHandPos(threshold: number = 0.01) {
  const { joints } = useXRJointsContext();

  const [isNeutral, setIsNeutral] = useState(false);
  const [thumbDistance, setThumbDistance] = useState(0);

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

      setThumbDistance(thumbDistance);
      setIsNeutral(thumbDistance <= threshold);
    },
    [threshold]
  );

  useEffect(() => {
    checkNeutralPosition(joints);
  }, [joints, checkNeutralPosition]);

  return {
    isNeutral,
    thumbDistance,
  };
}

export function useUpdateGesture() {
  const { isNeutral, thumbDistance } = useNeutralHandPos();
  const [_, setGesture] = useAtom(gestureAtom);

  useEffect(() => {
    setGesture({
      neutral: isNeutral,
      thumbDistance,
    });
  }, [isNeutral, thumbDistance, setGesture]);
}
