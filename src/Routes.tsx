import { Routes, Route } from "react-router-dom";
import App from "./App";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/:tab" element={<App />} />   {/* ✅ all tabs use same App */}
    </Routes>
  );
}
