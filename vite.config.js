import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
	plugins: [vue()],
	publicDir: "static",
	base: "/ets-calculator/",
	build: {
		assetsDir: "bundle",
		outDir: "docs"	// For hosting on Github Pages
	},
	define: {
		__BUILD_TIMESTAMP__: Date.now().toString()
	}
})