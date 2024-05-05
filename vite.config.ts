import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(() => {
  return {
    optimizeDeps: {
      include: ["metar-taf-parser", "gsl-parser"],
    },
    build: {
      outDir: "build",
      sourcemap: true,
    },
    plugins: [
      react({
        jsxImportSource: "@emotion/react",
        babel: {
          plugins: ["@emotion/babel-plugin"],
        },
      }),
      svgr(),
      VitePWA({
        strategies: "injectManifest",
        srcDir: "src",
        filename: "service-worker.ts",
        registerType: "autoUpdate",
        manifest: {
          name: "PPG.report",
          short_name: "PPG.report",
          start_url: "/",
          icons: [
            {
              src: "manifest-icon-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable any",
            },
            {
              src: "manifest-icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable any",
            },
          ],
          theme_color: "#001931",
          background_color: "#001931",
          display: "standalone",
          orientation: "any",
          description:
            "Weather report tailored for paramotor pilots, worldwide. Combines winds aloft, nearby Terminal Aerodrome Forecasts, hourly forecasts, NWS active alerts and TFRs.",
          categories: ["weather"],
          screenshots: [
            {
              src: "/screenshots/android/1.png",
              sizes: "1284x2778",
              type: "image/png",
              platform: "narrow",
              label: "Winds aloft for your favorite flying sites",
            },
            {
              src: "/screenshots/android/2.png",
              sizes: "1284x2778",
              type: "image/png",
              platform: "narrow",
              label: "NWS hourly forecast and nearby TAF seamlessly integrated",
            },
            {
              src: "/screenshots/android/3.png",
              sizes: "1284x2778",
              type: "image/png",
              platform: "narrow",
              label: "Why. Not just what.",
            },
            {
              src: "/screenshots/android/4.png",
              sizes: "1284x2778",
              type: "image/png",
              platform: "narrow",
              label: "Weather alerts, font and center",
            },
          ],
        },
      }),
    ],
    server: {
      proxy: {
        "/api": {
          target: "https://ppg.report",
          changeOrigin: true,
          secure: true,
        },
      },
    },
    test: {
      environment: "happy-dom",
      include: ["**/*.test.tsx", "**/*.test.ts"],
      globals: true,
    },
  };
});
