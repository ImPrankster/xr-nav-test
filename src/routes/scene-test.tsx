import { createXRStore } from "@react-three/xr";
import { createFileRoute } from "@tanstack/react-router";
import Scene from "~/components/scene";

export const Route = createFileRoute("/scene-test")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="h-screen w-screen">
			<Scene
				xrStore={createXRStore({
					hand: { touchPointer: false },
					secondaryInputSources: true,
					offerSession: "immersive-vr",
					emulate: {
						inject: true,
					},
				})}
			/>
		</main>
	);
}
