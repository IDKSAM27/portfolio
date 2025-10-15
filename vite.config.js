//The reason we create a manual config bcs, the defualt kaboom has a bit of bugs.
import { defineConfig } from "vite";

export default defineConfig({
    //base: "/", // usually the base should be the github repo name. (/portfolio/) 
    build: {
        minify: "terser",
    },
});

// Change the base directory
