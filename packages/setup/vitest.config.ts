import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    mockReset: true,
    clearMocks: true,
  },
  plugins: [tsconfigPaths()],
});
