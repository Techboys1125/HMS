import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
//http://192.168.1.44:8081
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://safe-hands-hms-backend.onrender.com/swagger-ui/index.html",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});