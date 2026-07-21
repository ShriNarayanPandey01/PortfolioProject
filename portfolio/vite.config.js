import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const rawUrl = (env.VITE_BACKEND_URL);
  const targetUrl = rawUrl;

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: targetUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
