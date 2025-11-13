// routa.tsx
import { Routes, Route } from "react-router-dom";
import App from "./App";

export default function AppRoutes() {
  return (
    <Routes>
      {/* top-level root */}
      <Route path="/" element={<App />} />

      {/* explicit route with both tab + roleId — must come BEFORE catch-alls */}
      <Route path="/:tab/:roleId" element={<App />} />

      {/* optional: handle tab with any trailing segments (catch-all) */}
      <Route path="/:tab/*" element={<App />} />

      {/* fallback for single tab (if needed) */}
      <Route path="/:tab" element={<App />} />

      {/* keep direct apply-form route if you want /apply-form/:roleId to mount App directly */}
      <Route path="/apply-form/:roleId" element={<App />} />
    </Routes>
  );
}
