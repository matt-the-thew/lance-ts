import { defineConfig } from "tsup";

export default defineConfig({
  // 1. Specify your entry point(s)
  entry: ["src/index.ts"],
  // 2. Output formats (CommonJS and ES Modules)
  format: ["cjs", "esm"],
  // 3. Generate declaration files (.d.ts)
  dts: true,
  // 4. Clean the dist directory before each build
  clean: true,
  // 5. Generate sourcemaps for debugging
  sourcemap: true,
  // 6. Don't bundle code-split chunks into a single file
  splitting: false,
  // 7. Minify output (optional, good for production)
  minify: false,
});
