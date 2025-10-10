import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { createXRStore, PointerEvents, XR } from "@react-three/xr";
import { createFileRoute } from "@tanstack/react-router";
import HandWithIndicator from "~/components/hand";
import Scene from "~/components/scene";
import { XRJointsProvider } from "~/components/XRJointsProvider";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const store = createXRStore({
    hand: { left: false, right: HandWithIndicator },
    offerSession: "immersive-vr",
    emulate: {
      inject: false,
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-4">
      <h1 className="font-bold text-2xl">Create VR App</h1>
      <p>
        This is a simple boilerplate that allows you to create VR apps using
        Three.js and React Three Fiber.
      </p>
      <div className="relative h-[800px] w-[800px] grow-0 rounded-lg bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Canvas
          dpr={[1, 2]}
          shadows
          camera={{ position: [-40, 40, 40], fov: 25 }}
        >
          <PointerEvents />
          <OrbitControls />
          <XR store={store}>
            <XRJointsProvider>
              <Scene />
            </XRJointsProvider>
          </XR>
        </Canvas>
        <button
          type="button"
          className="absolute right-4 bottom-4 rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
          onClick={() => {
            store.enterVR();
          }}
        >
          Enter VR
        </button>
      </div>
    </main>
  );
}
