import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Voitures from "./pages/Voitures";
import Reservations from "./pages/Reservations";
import Utilisateurs from "./pages/Utilisateurs";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/voitures" element={<Voitures />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/utilisateurs" element={<Utilisateurs />} />
      </Routes>
    </BrowserRouter>
  );
}
