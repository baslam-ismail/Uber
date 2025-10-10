import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		globals: true,
        environment: 'node',
		include: ["test/**/*.{spec,test}.{js,ts}"],
		coverage: {
			reporter: ["lcov", "text"],
			reportsDirectory: "./coverage",
			include: ["app/**/*.ts"],
		},
	},
});

