//The reason we create a manual config bcs, the defualt kaboom has a bit of bugs.
import { defineConfig } from "vite";

export default defineConfig({
    base: "./2d-portfolio", // usually the base should be the github repo name. (eg. 2d-portfolio)
    build: {
        minify: "terser",
    },
});