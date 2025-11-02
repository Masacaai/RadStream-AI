import { Routes, Route } from "react-router-dom";
import HealthcareLanding from "./pages/HealthcareLanding";
import LoginPage from "./pages/LoginPage";
import PatientDemo from "./pages/PatientDemo";
import RadiologistDemo from "./pages/RadiologistDemo";
import DoctorDemo from "./pages/DoctorDemo";
import DemoApp from "./DemoApp";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HealthcareLanding />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/patient-demo" element={<PatientDemo />} />
      <Route path="/radiologist-demo" element={<RadiologistDemo />} />
      <Route path="/doctor-demo" element={<DoctorDemo />} />
      <Route path="/app" element={<DemoApp />} />
      <Route path="*" element={<HealthcareLanding />} />
    </Routes>
  );
}
