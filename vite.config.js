//The reason we create a manual config bcs, the defualt kaboom has a bit of bugs.
import { defineConfig } from "vite";

export default defineConfig({
    base: "./",
    build: {
        minify: "terser",
    },
});