import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { boardPlugin } from "./server/boardPlugin.ts";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const adminPassword = env.ADMIN_PASSWORD || "seva-bridge";

  return {
    plugins: [boardPlugin(adminPassword), react(), tailwindcss()],
  };
});
