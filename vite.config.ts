import { defineConfig } from "vite";

// Relative base ("./") makes the built site work whether it is served from a
// custom domain root (https://example.com/) or a GitHub Pages project subpath
// (https://user.github.io/repo/) without any extra configuration. All asset
// and document references in this single-page site are relative for the same
// reason.
export default defineConfig({
  base: "./",
});
