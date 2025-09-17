import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: { allowedHosts: ["bce0785094c7.ngrok-free.app"] },
});
