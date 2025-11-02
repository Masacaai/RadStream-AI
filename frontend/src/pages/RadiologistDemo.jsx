import React, { useState, useEffect } from "react";
import CollapsibleReport from "../components/CollapsibleReport";
import "./healthcare-landing.css";


export default function RadiologistDemo() {
  const [patientHistory, setPatientHistory] = useState("");
  const [visitReason, setVisitReason] = useState("");
  const [dicomFile, setDicomFile] = useState(null);
  const [studyId, setStudyId] = useState(null);
  const [status, setStatus] = useState("");
  const [clinicalReport, setClinicalReport] = useState("");
  const [patientSummary, setPatientSummary] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [scans, setScans] = useState([])
  
  const fetchScans = async () => {
  try {
    const response = await fetch("http://localhost:8000/get_results/", {
      method: "POST",
    });
    const data = await response.json();
    console.log("Loaded scans:", data);
    setScans(data.scans || []);
    } catch (error) {
      console.error("Error fetching scans:", error);
    }
  };

  // 📥 Run once when the component mounts
  useEffect(() => {
    fetchScans();
  }, []);



  const handleFileChange = (e) => {
    setDicomFile(e.target.files[0]);
  };

  const pollStatus = async (id) => {
    while (true) {
      const response = await fetch(`http://localhost:8000/api/studies/${id}/status_check/`);
      const data = await response.json();
      setStatus(data.status);
      
      console.log(`Status: ${data.status}`);
      
      if (["completed", "escalated", "failed"].includes(data.status)) {
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  };

  const getResults = async (id) => {
    const clinicalResponse = await fetch(`http://localhost:8000/api/studies/${id}/clinical_report/`);
    const clinicalData = await clinicalResponse.json();
    setClinicalReport(clinicalData.clinical_report);

    const patientResponse = await fetch(`http://localhost:8000/api/studies/${id}/patient_summary/`);
    const patientData = await patientResponse.json();
    setPatientSummary(patientData.patient_summary);
  };

  const handleUpload = async () => {
    if (!dicomFile || !patientHistory || !visitReason) {
      alert("Please fill in all fields and select a DICOM file");
      return;
    }

    setIsProcessing(true);
    setStatus("uploading");

    try {
      // 1. Upload
      console.log("📤 Uploading study...");
      const formData = new FormData();
      formData.append("dicom_file", dicomFile);
      formData.append("patient_history", patientHistory);
      formData.append("visit_reason", visitReason);

      const response = await fetch("http://localhost:8000/api/studies/", {
        method: "POST",
        body: formData,
      });

      console.log(`Status Code: ${response.status}`);
      const responseText = await response.text();
      console.log(`Response Body: ${responseText}`);

      if (response.status !== 201) {
        alert("❌ Upload failed!");
        setIsProcessing(false);
        return;
      }

      const data = JSON.parse(responseText);
      const newStudyId = data.id;
      setStudyId(newStudyId);
      console.log(`✅ Study created: ${newStudyId}`);

      // 2. Poll for completion
      console.log("\n⏳ Processing...");
      await pollStatus(newStudyId);

      // 3. Get results
      console.log("\n📋 Results:");
      await getResults(newStudyId);

      console.log("\n✨ Done!");
      alert("Study processing complete!");
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const test_integ = async () => {
    try {
      const payload = { data: "Hellooooo" };
      const response = await fetch("http://localhost:8000/test_api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log("Response from backend:", data);
      alert(`Backend says: ${data.message}`);
    } catch (error) {
      console.error("Error calling API:", error);
      alert("Error calling backend API");
    }
  };

  const handleConfirm = async () => {
    try {
      if (!studyId) {
        alert("No study to confirm!");
        return;
      }

      const payload = {
        study_id: studyId,
        patient_history: patientHistory,
        visit_reason: visitReason,
        clinical_report: clinicalReport,
        patient_summary: patientSummary,
      };

      // 🔥 POST to backend to save the confirmed study
      const response = await fetch("http://localhost:8000/api/studies/save_results/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        alert("Error saving study review");
        return;
      }

      const result = await response.json();
      console.log("✅ Saved:", result);

      // 🧩 Add to "Previous Scans" (top of list)
      const newScan = {
        title: `Scan – ${result.patient_name || "Unknown"}`,
        summary: "Review saved and finalized.",
        details: [
          { label: "Study ID", value: studyId },
          { label: "Patient History", value: patientHistory },
          { label: "Visit Reason", value: visitReason },
          { label: "Clinical Report", value: clinicalReport.slice(0, 80) + "..." },
        ],
      };

      setScans((prev) => [newScan, ...prev]);

      // 🧹 Clear current state
      setStudyId(null);
      setPatientHistory("");
      setVisitReason("");
      setDicomFile(null);
      setStatus("");
      setClinicalReport("");
      setPatientSummary("");

      alert("✅ Study confirmed and saved!");
    } catch (error) {
      console.error("Error confirming study:", error);
      alert("Error saving study review");
    }
  };

  return (
    <div className="demo-root">
      <header className="demo-header">
        <h1>Radiologist Workbench</h1>
        <p>Analyze, visualize, and verify AI findings</p>
        {/* <button onClick={test_integ}>test_api</button> */}
      </header>

      <main className="demo-container">
        {/* Upload Form */}
        <div className="upload-section" style={{ 
          background: "white", 
          padding: "20px", 
          borderRadius: "8px", 
          marginBottom: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h2>Upload New Study</h2>
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Patient History:
            </label>
            <input
              type="text"
              value={patientHistory}
              onChange={(e) => setPatientHistory(e.target.value)}
              placeholder="e.g., 62yo male, smoker, COPD"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc"
              }}
              disabled={isProcessing}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Visit Reason:
            </label>
            <input
              type="text"
              value={visitReason}
              onChange={(e) => setVisitReason(e.target.value)}
              placeholder="e.g., SOB, chest pain"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc"
              }}
              disabled={isProcessing}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              DICOM File:
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".dcm"
              style={{
                width: "100%",
                padding: "8px"
              }}
              disabled={isProcessing}
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={isProcessing}
            style={{
              padding: "10px 20px",
              backgroundColor: isProcessing ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isProcessing ? "not-allowed" : "pointer",
              fontWeight: "500"
            }}
          >
            {isProcessing ? `Processing... (${status})` : "Upload & Analyze"}
          </button>
        </div>

        {/* Results Section */}
        {studyId && (
          <div className="results-section" style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <h2>Study Results (ID: {studyId})</h2>
            <p><strong>Status:</strong> {status}</p>
            
            {clinicalReport && (
              <div style={{ marginTop: "15px" }}>
                <h3>🏥 Clinical Report:</h3>
                <p style={{ whiteSpace: "pre-wrap" }}>{clinicalReport}</p>
              </div>
            )}
            
            {patientSummary && (
              <div style={{ marginTop: "15px" }}>
                <h3>👤 Patient Summary:</h3>
                <p style={{ whiteSpace: "pre-wrap" }}>{patientSummary}</p>
              </div>
            )}

            {/* ✅ OK Button */}
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Approve
            </button>

          </div>
        )}

        {/* Existing Scans */}
        <h2>Previous Scans</h2>
        {scans.map((s, i) => (
          <CollapsibleReport
            key={i}
            title={s.title}
            summary={s.summary}
            details={s.details}
          />
        ))}
      </main>
    </div>
  );
}