export default function PatientDemo() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #F3D9E5, #C6BADE)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: "#2E243F"
    }}>
      <h1>Patient Dashboard</h1>
      <p>Welcome, Patient! Here you can view your reports, upload X-rays, and track progress.</p>
    </div>
  );
}
