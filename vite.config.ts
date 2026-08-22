import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
//http://192.168.1.44:8081
//https://safe-hands-hms-backend.onrender.com
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://safe-hands-hms-backend.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
