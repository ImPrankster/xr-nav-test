import { createXRStore } from "@react-three/xr";
import Scene from "./components/scene";

function App() {
  const store = createXRStore({
    hand: { touchPointer: false },
    secondaryInputSources: true,
    offerSession: "immersive-vr",
    emulate: {
      inject: true,
    },
  });
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-4">
      <h1 className="text-2xl font-bold">Create VR App</h1>
      <p>
        This is a simple app that allows you to create VR apps using Three.js
        and React Three Fiber.
      </p>
      <div className="relative h-[800px] w-[800px] grow-0 rounded-lg bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Scene xrStore={store} />
        <button
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

export default App;
