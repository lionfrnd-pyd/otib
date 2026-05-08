import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.VITE_BASE ?? "/otib/",
  server: {
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});
