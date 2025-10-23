import { Routes, Route } from "react-router-dom";
import App from "./App"; // homepage
import AI_Strategy from "./AI_Strategy";
import GenerativeAI from "./GenerativeAI";
import AI_Chatbots from "./AI_Chatbots";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/ai-strategy" element={<AI_Strategy />} />
      <Route path="/generative-ai" element={<GenerativeAI />} />
      <Route path="/ai-chatbots" element={<AI_Chatbots />} />
    </Routes>
  );
}
