import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig } from "vite";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
		}),
		react(),
		basicSsl(),
		tailwindcss(),
	],
	resolve: {
		alias: {
			"~": path.resolve(__dirname, "./src/"),
		},
		dedupe: ["@react-three/fiber", "three"],
	},
});
