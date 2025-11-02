import { Routes, Route } from "react-router-dom";
import App from "./App";

export default function AppRoutes() {
  return (
  // Option A: catch-all tabs

<Routes>
  <Route path="/" element={<App />} />
 <Route path="/:tab/*" element={<App />} />
  <Route path="/apply-form/:roleId" element={<App />} />
</Routes>

  );
}
