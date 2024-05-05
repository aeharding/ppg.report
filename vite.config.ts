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
        srcDir: "src",
        registerType: "autoUpdate",
        workbox: {
          runtimeCaching: [
            {
              handler: "CacheFirst",
              urlPattern: /\/api\/position.*/,
              options: {
                cacheName: "apiPositionCache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 Days
                },
              },
            },
            {
              handler: "NetworkFirst",
              urlPattern: /\/api\/rap.*/,
              options: {
                cacheName: "apiRapCache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 4, // 4 Hours
                },
              },
            },
            {
              handler: "NetworkFirst",
              urlPattern: /\/api\/weather.*/,
              options: {
                cacheName: "apiWeatherCache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 4, // 4 Hours
                },
              },
            },
            {
              handler: "NetworkFirst",
              urlPattern: /\/api\/weather.*/,
              options: {
                cacheName: "apiWeatherCache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 4, // 4 Hours
                },
              },
            },
            {
              handler: "NetworkFirst",
              urlPattern: /\/api\/tfr.*/,
              options: {
                cacheName: "apiTfrCache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 4, // 4 Hours
                },
              },
            },
            {
              handler: "NetworkFirst",
              urlPattern: /\/api\/pqs.*/,
              options: {
                cacheName: "apiElevationCache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 Days
                },
              },
            },
            {
              handler: "NetworkFirst",
              urlPattern: /\/api\/googleelevation.*/,
              options: {
                cacheName: "apiGoogleElevationCache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 Days
                },
              },
            },
            {
              handler: "NetworkFirst",
              urlPattern: /\/api\/aviationweather.*/,
              options: {
                cacheName: "apiAviationWeatherCache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 4, // 4 Hours
                },
              },
            },
            {
              handler: "NetworkFirst",
              urlPattern: /\/api\/aviationalerts.*/,
              options: {
                cacheName: "apiAviationAlertsCache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 4, // 4 Hours
                },
              },
            },
          ],
        },
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
