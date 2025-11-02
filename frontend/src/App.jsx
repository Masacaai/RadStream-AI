import { Routes, Route } from "react-router-dom";
import HealthcareLanding from "./pages/HealthcareLanding";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import PatientDemo from "./pages/PatientDemo";
import RadiologistDemo from "./pages/RadiologistDemo";
import DoctorDemo from "./pages/DoctorDemo";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HealthcareLanding />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/patient" element={<PatientDemo />} />
      <Route path="/radiologist" element={<RadiologistDemo />} />
      <Route path="/doctor" element={<DoctorDemo />} />
    </Routes>
  );
}
