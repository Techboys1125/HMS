import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
//http://192.168.1.44:8081
//https://api.hms.viyaninfo.com
//https://safe-hands-hms-backend.onrender.com
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http:///10.180.175.223:8888",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
