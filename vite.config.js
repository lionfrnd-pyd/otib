import { defineConfig } from "vite";

export default defineConfig({
  base: "/otib/",
  server: {
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});
