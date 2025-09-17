import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import ogPlugin from "vite-plugin-open-graph";

export default defineConfig({
  plugins: [
    tailwindcss(),
    ogPlugin({
      basic: {
        title: "AWS or Not",
        description: "Guess if a service is from AWS or not!",
        url: "https://aws.amanmeherally.com",
        image: "https://aws.amanmeherally.com/og-image.png",
        type: "website",
        siteName: "AWS or Not",
      },
    }),
  ],
  server: { allowedHosts: ["bce0785094c7.ngrok-free.app"] },
});
