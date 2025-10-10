import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useXRStore } from "@react-three/xr";
import {
  getJointsFromXRFrame,
  printHandJoints2D,
  type Joints,
} from "~/helpers/joints";

const XRContext = createContext<{
  session: XRSession | undefined;
  originReferenceSpace: XRReferenceSpace | undefined;
  joints: Joints;
} | null>(null);

export const XRJointsProvider = ({ children }: { children: ReactNode }) => {
  const xrStore = useXRStore();
  const [session, setSession] = useState<XRSession | undefined>();
  const [originReferenceSpace, setOriginReferenceSpace] = useState<
    XRReferenceSpace | undefined
  >();
  const [joints, setJoints] = useState<Joints>(new Float32Array(25 * 16));

  useEffect(() => {
    const unsubscribe = xrStore.subscribe((state) => {
      setSession(state.session);
      setOriginReferenceSpace(state.originReferenceSpace);
    });
    return unsubscribe;
  }, [xrStore]);

  useEffect(() => {
    let intervalId: number | undefined;
    if (session && originReferenceSpace) {
      intervalId = window.setInterval(() => {
        if (session && originReferenceSpace) {
          session.requestAnimationFrame((time, frame) => {
            const jointTransforms = getJointsFromXRFrame(
              time,
              frame,
              session,
              originReferenceSpace
            );
            if (jointTransforms) {
              setJoints(jointTransforms);
              printHandJoints2D(jointTransforms);
            }
          });
        }
      }, 100);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [session, originReferenceSpace]);

  return (
    <XRContext.Provider
      value={{
        session,
        originReferenceSpace,
        joints,
      }}
    >
      {children}
    </XRContext.Provider>
  );
};

export const useXRJointsContext = () => {
  const context = useContext(XRContext);
  if (!context) throw new Error("useXRContext must be used within XRProvider");
  return context;
};
