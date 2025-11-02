import React, { useState, useEffect } from "react";
import CollapsibleReport from "../components/CollapsibleReport";
import "./healthcare-landing.css";


export default function RadiologistDemo() {
  const [patientHistory, setPatientHistory] = useState("");
  const [visitReason, setVisitReason] = useState("");
  const [dicomFile, setDicomFile] = useState(null);
  const [studyId, setStudyId] = useState(null);
  const [status, setStatus] = useState("");
  const [urgency, setUrgency] = useState("");
  const [workflow, setWorkflow] = useState(null);
  const [findingsSummary, setFindingsSummary] = useState(null);
  const [workflowSteps, setWorkflowSteps] = useState([]);
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


  // NEW: Track what's currently happening
  const [currentPhase, setCurrentPhase] = useState("");

  /*
  const scans = [
    {
      title: "Scan 1 – John Doe",
      summary: "Pending AI analysis. Click to view details.",
      details: [
        { label: "Scan ID", value: "RAD001" },
        { label: "Patient", value: "John Doe" },
        { label: "AI Output", value: "Effusion probability: 0.21" },
        { label: "Observation", value: "Minimal findings" },
      ],
    },
    {
      title: "Scan 2 – Abdul Khan",
      summary: "AI flagged minor opacity, needs confirmation.",
      details: [
        { label: "Scan ID", value: "RAD002" },
        { label: "Patient", value: "Abdul Khan" },
        { label: "AI Output", value: "Opacity confidence: 0.78" },
        { label: "Observation", value: "Likely benign" },
      ],
    },
  ];
  */

  const handleFileChange = (e) => {
    setDicomFile(e.target.files[0]);
  };

  const pollStatus = async (id) => {
    while (true) {
      const response = await fetch(`http://localhost:8000/api/studies/${id}/status_check/`);
      const data = await response.json();
      
      setStatus(data.status);
      setUrgency(data.urgency || "");
      
      // Update current phase based on what's happening
      if (data.status === 'processing') {
        if (!data.workflow) {
          setCurrentPhase("Uploading to HOPPR and analyzing data...");
        } else if (data.workflow.strategy && !data.workflow.phases?.length) {
          setCurrentPhase(`Planning analysis strategy - ${data.workflow.strategy.urgency} urgency detected`);
        } else if (data.workflow.phases) {
          const lastPhase = data.workflow.phases[data.workflow.phases.length - 1];
          setCurrentPhase(`Analyzing ${lastPhase.system} system...`);
        }
      }
      
      // Update workflow info
      if (data.workflow) {
        setWorkflow(data.workflow);
      }
      
      // Update findings summary
      if (data.findings_summary) {
        setFindingsSummary(data.findings_summary);
      }
      
      console.log(`Status: ${data.status}`);
      if (data.workflow) {
        console.log("Workflow:", data.workflow);
      }
      
      if (["completed", "escalated", "failed"].includes(data.status)) {
        setCurrentPhase("");
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
    
    // Get detailed workflow
    const workflowResponse = await fetch(`http://localhost:8000/api/studies/${id}/workflow/`);
    if (workflowResponse.ok) {
      const workflowData = await workflowResponse.json();
      setWorkflowSteps(workflowData.workflow_steps || []);
    }
  };

  const handleUpload = async () => {
    if (!dicomFile || !patientHistory || !visitReason) {
      alert("Please fill in all fields and select a DICOM file");
      return;
    }

    setIsProcessing(true);
    setStatus("uploading");
    setCurrentPhase("Uploading study...");
    setWorkflow(null);
    setFindingsSummary(null);
    setWorkflowSteps([]);
    setClinicalReport("");
    setPatientSummary("");
    setUrgency("");

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
        setCurrentPhase("");
        return;
      }

      const data = JSON.parse(responseText);
      const newStudyId = data.id;
      setStudyId(newStudyId);
      console.log(`✅ Study created: ${newStudyId}`);
      
      setCurrentPhase("Study uploaded, starting AI analysis...");

      // 2. Poll for completion
      console.log("\n⏳ Processing...");
      await pollStatus(newStudyId);

      // 3. Get results
      console.log("\n📋 Results:");
      setCurrentPhase("Fetching final reports...");
      await getResults(newStudyId);

      console.log("\n✨ Done!");
      alert("Study processing complete!");
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
      setCurrentPhase("");
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

  const getUrgencyColor = (urgency) => {
    switch(urgency?.toLowerCase()) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'moderate': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusEmoji = (status) => {
    switch(status) {
      case 'uploading': return '📤';
      case 'processing': return '⚙️';
      case 'completed': return '✅';
      case 'escalated': return '🚨';
      case 'failed': return '❌';
      default: return '⏳';
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div style={{
      display: "inline-block",
      width: "20px",
      height: "20px",
      border: "3px solid #f3f3f3",
      borderTop: "3px solid #007bff",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginRight: "10px"
    }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

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
            {isProcessing ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LoadingSpinner />
                Processing...
              </span>
            ) : "Upload & Analyze"}
          </button>
        </div>

        {/* Live Processing Status - Shows IMMEDIATELY */}
        {isProcessing && (
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            border: "2px solid #007bff"
          }}>
            <h2 style={{ display: "flex", alignItems: "center" }}>
              <LoadingSpinner />
              🤖 AI Agent Working...
            </h2>
            
            {/* Current Phase Indicator */}
            <div style={{
              padding: "12px",
              marginBottom: "15px",
              background: "#e7f3ff",
              borderRadius: "4px",
              borderLeft: "4px solid #007bff",
              fontWeight: "500"
            }}>
              {currentPhase || "Initializing..."}
            </div>

            {/* Urgency Badge - appears as soon as available */}
            {urgency && (
              <div style={{ 
                padding: "10px", 
                marginBottom: "15px", 
                borderRadius: "4px",
                backgroundColor: getUrgencyColor(urgency) + "20",
                borderLeft: `4px solid ${getUrgencyColor(urgency)}`,
                animation: "fadeIn 0.5s"
              }}>
                <strong>Urgency Level:</strong> 
                <span style={{ 
                  color: getUrgencyColor(urgency), 
                  fontWeight: "bold",
                  marginLeft: "10px",
                  textTransform: "uppercase"
                }}>
                  {urgency}
                </span>
              </div>
            )}

            {/* Strategy - appears as soon as available */}
            {workflow?.strategy && (
              <div style={{ 
                marginBottom: "15px",
                animation: "fadeIn 0.5s"
              }}>
                <h3>📋 Analysis Strategy</h3>
                <p><strong>Priority Systems:</strong> {workflow.strategy.priority_systems?.join(', ')}</p>
              </div>
            )}

            {/* Phases - updates in real-time */}
            {workflow?.phases && workflow.phases.length > 0 && (
              <div style={{ marginBottom: "15px" }}>
                <h3>🔬 Analysis Phases</h3>
                {workflow.phases.map((phase, idx) => (
                  <div key={idx} style={{
                    padding: "8px",
                    margin: "5px 0",
                    background: "#f8f9fa",
                    borderRadius: "4px",
                    borderLeft: "3px solid #28a745",
                    animation: "slideIn 0.3s"
                  }}>
                    ✓ <strong>{phase.system}</strong>: {phase.findings_count} findings detected
                  </div>
                ))}
                {/* Show loading indicator for next phase */}
                <div style={{
                  padding: "8px",
                  margin: "5px 0",
                  background: "#f0f0f0",
                  borderRadius: "4px",
                  borderLeft: "3px solid #007bff",
                  display: "flex",
                  alignItems: "center",
                  opacity: 0.7
                }}>
                  <LoadingSpinner />
                  <span>Processing next system...</span>
                </div>
              </div>
            )}

            {/* Decision - appears when made */}
            {workflow?.action && (
              <div style={{
                padding: "10px",
                marginTop: "15px",
                borderRadius: "4px",
                backgroundColor: workflow.action === 'ESCALATE' ? '#dc354520' : '#28a74520',
                borderLeft: `4px solid ${workflow.action === 'ESCALATE' ? '#dc3545' : '#28a745'}`,
                animation: "fadeIn 0.5s"
              }}>
                <strong>Decision:</strong> 
                <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
                  {workflow.action === 'ESCALATE' ? '🚨 ESCALATE TO RADIOLOGIST' : '✅ ROUTINE REVIEW'}
                </span>
              </div>
            )}

            {/* Findings Summary - updates in real-time */}
            {findingsSummary && (
              <div style={{ marginTop: "15px", animation: "fadeIn 0.5s" }}>
                <h3>🔍 Findings Summary</h3>
                <p>
                  <strong>{findingsSummary.positive}</strong> positive out of {findingsSummary.total} total 
                  {findingsSummary.critical > 0 && (
                    <span style={{ color: '#dc3545', fontWeight: 'bold', marginLeft: '10px' }}>
                      ({findingsSummary.critical} critical)
                    </span>
                  )}
                </p>
                {findingsSummary.top_findings && findingsSummary.top_findings.length > 0 && (
                  <div style={{ marginTop: "10px" }}>
                    <strong>Top Findings:</strong>
                    {findingsSummary.top_findings.map((finding, idx) => (
                      <div key={idx} style={{
                        padding: "5px 10px",
                        margin: "5px 0",
                        background: finding.present ? "#fff3cd" : "#f8f9fa",
                        borderRadius: "4px",
                        fontSize: "0.9em",
                        animation: `slideIn 0.3s ${idx * 0.1}s both`
                      }}>
                        {finding.present ? "✓" : "○"} {finding.name}: {(finding.score * 100).toFixed(1)}%
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideIn {
                from { 
                  opacity: 0;
                  transform: translateY(-10px);
                }
                to { 
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
          </div>
        )}

        {/* Results Section */}
        {studyId && !isProcessing && (
          <div className="results-section" style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <h2>{getStatusEmoji(status)} Study Results (ID: {studyId})</h2>
            <p>
              <strong>Status:</strong> 
              <span style={{ 
                marginLeft: "10px",
                padding: "4px 8px",
                borderRadius: "4px",
                background: status === 'completed' ? '#28a74520' : status === 'escalated' ? '#dc354520' : '#6c757d20',
                fontWeight: "bold"
              }}>
                {status.toUpperCase()}
              </span>
            </p>
            
            {urgency && (
              <p>
                <strong>Urgency:</strong> 
                <span style={{ 
                  marginLeft: "10px",
                  color: getUrgencyColor(urgency),
                  fontWeight: "bold",
                  textTransform: "uppercase"
                }}>
                  {urgency}
                </span>
              </p>
            )}

            {/* Detailed Workflow Steps */}
            {workflowSteps.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h3>🔄 Detailed Workflow Execution</h3>
                {workflowSteps.map((step, idx) => (
                  <details key={idx} style={{
                    marginBottom: "10px",
                    padding: "10px",
                    background: "#f8f9fa",
                    borderRadius: "4px",
                    border: "1px solid #dee2e6"
                  }}>
                    <summary style={{ 
                      cursor: "pointer", 
                      fontWeight: "bold",
                      padding: "5px"
                    }}>
                      Step {step.step}: {step.phase}
                    </summary>
                    <div style={{ 
                      marginTop: "10px", 
                      paddingLeft: "15px",
                      borderLeft: "3px solid #007bff"
                    }}>
                      <p>{step.description}</p>
                      {step.details && (
                        <pre style={{
                          background: "#fff",
                          padding: "10px",
                          borderRadius: "4px",
                          fontSize: "0.85em",
                          overflow: "auto"
                        }}>
                          {JSON.stringify(step.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            )}
            
            {clinicalReport && (
              <div style={{ marginTop: "20px" }}>
                <h3>🏥 Clinical Report</h3>
                <div style={{
                  padding: "15px",
                  background: "#f8f9fa",
                  borderRadius: "4px",
                  whiteSpace: "pre-wrap",
                  fontSize: "0.95em",
                  lineHeight: "1.6"
                }}>
                  {clinicalReport}
                </div>
              </div>
            )}
            
            {patientSummary && (
              <div style={{ marginTop: "20px" }}>
                <h3>👤 Patient Summary</h3>
                <div style={{
                  padding: "15px",
                  background: "#e7f3ff",
                  borderRadius: "4px",
                  whiteSpace: "pre-wrap",
                  fontSize: "0.95em",
                  lineHeight: "1.6"
                }}>
                  {patientSummary}
                </div>
              </div>
            )}

            {/* ✅ OK Button */}
            <button
              // onClick={handleConfirm}
              // disabled={isProcessing}
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