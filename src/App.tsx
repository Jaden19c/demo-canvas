import DemoPage from "@/pages/DemoPage";
import HomePage from "@/pages/HomePage";
import MapPage from "@/pages/MapPage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/demo" element={<DemoPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
