import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://192.168.1.44:8081",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("ReportsManagement")) {
            return "reports-management";
          }
          if (id.includes("BillingManagement")) {
            return "billing-management";
          }
          if (id.includes("FamilyMembersManagement")) {
            return "family-members-management";
          }
          if (id.includes("AuditLogsManagement")) {
            return "audit-logs-management";
          }
          if (id.includes("features/patients")) {
            return "feature-patients";
          }
          if (id.includes("features/opd")) {
            return "feature-opd";
          }
          if (id.includes("features/appointments")) {
            return "feature-appointments";
          }
          if (id.includes("features/doctors")) {
            return "feature-doctors";
          }
          if (id.includes("node_modules")) {
            if (id.includes("recharts")) {
              return "vendor-recharts";
            }
            if (id.includes("lucide-react")) {
              return "vendor-lucide";
            }
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor-core";
            }
            if (id.includes("@tanstack")) {
              return "vendor-query";
            }
            return "vendor";
          }
        },
      },
    },
  },
});
