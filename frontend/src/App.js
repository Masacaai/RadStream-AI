// src/App.js
import { useMemo, useState } from "react";
import {
  Container, Typography, Box, Paper, Stack,
  Button, TextField, Divider, Chip, Alert, CircularProgress,
  FormGroup, FormControlLabel, Checkbox
} from "@mui/material";

const VLM_MODEL = { id: "cxr-vlm-experimental", label: "VLM: Chest X-ray Report" };

// A short starter list from the workshop PDF (add more as you like)
const CLASSIFIERS = [
  { id: "mc_chestradiography_pneumothorax:v1.20250828", label: "Pneumothorax" },
  { id: "mc_chestradiography_cardiomegaly:v1.20250828", label: "Cardiomegaly" },
  { id: "mc_chestradiography_pleural_effusion:v1.20250828", label: "Pleural Effusion" },
  { id: "mc_chestradiography_atelectasis:v1.20250828", label: "Atelectasis" },
];

const ORG = "hoppr"; // required for classification models per workshop doc

export default function App() {
  const [dicomFile, setDicomFile] = useState(null);
  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vlmChecked, setVlmChecked] = useState(true);
  const [clfChecked, setClfChecked] = useState(() => new Set([CLASSIFIERS[0].id]));
  const [vlmText, setVlmText] = useState("");
  const [scores, setScores] = useState({});
  const [error, setError] = useState("");

  const selectedClassifiers = useMemo(
    () => CLASSIFIERS.filter(c => clfChecked.has(c.id)),
    [clfChecked]
  );

  async function createStudy() {
    const r = await fetch("http://localhost:4000/api/create-study", { method: "POST" });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }

  async function uploadDicom(studyId, file) {
    const fd = new FormData();
    fd.append("dicom", file);
    const r = await fetch(`http://localhost:4000/api/upload-image/${studyId}`, {
      method: "POST",
      body: fd
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }

  async function infer({ studyId, model, prompt, organization }) {
    const r = await fetch("http://localhost:4000/api/infer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studyId, model, prompt, organization })
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  }

  async function run() {
    try {
      setError("");
      setLoading(true);
      setVlmText("");
      setScores({});
      setStudy(null);

      if (!dicomFile) throw new Error("Please choose a DICOM file first.");

      // 1) Create study
      const s = await createStudy();
      setStudy(s);

      // 2) Upload image
      await uploadDicom(s.id, dicomFile);

      // 3) Run VLM (optional)
      if (vlmChecked) {
        const vlm = await infer({
          studyId: s.id,
          model: VLM_MODEL.id,
          prompt: "Provide a description of the findings in the radiology image."
        });
        // Workshop sample shows VLM returns { response: { ...findings } }
        setVlmText(vlm?.response?.findings || JSON.stringify(vlm, null, 2));
      }

      // 4) Run selected classifiers
      const out = {};
      for (const c of selectedClassifiers) {
        const r = await infer({
          studyId: s.id,
          model: c.id,
          prompt: "prompt is ignored for classification",
          organization: ORG
        });
        // Workshop sample shows { model_id, score }
        out[c.id] = Number(r?.score ?? NaN);
      }
      setScores(out);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Hoppr Chest X-ray Demo
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Upload a DICOM, optionally generate a VLM report, and run selected classifiers.
      </Typography>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Box>
            <Button component="label" variant="contained">
              Choose DICOM
              <input type="file" hidden accept=".dcm,application/dicom" onChange={(e) => {
                const f = e.target.files?.[0];
                setDicomFile(f || null);
              }} />
            </Button>
            <Typography variant="caption" sx={{ ml: 2 }}>
              {dicomFile ? dicomFile.name : "No file selected"}
            </Typography>
          </Box>

          <Divider><Chip label="Models" /></Divider>

          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={vlmChecked} onChange={(_, v) => setVlmChecked(v)} />}
              label={`${VLM_MODEL.label} (${VLM_MODEL.id})`}
            />
          </FormGroup>

          <Typography variant="subtitle2">Classification models (select any):</Typography>
          <FormGroup>
            {CLASSIFIERS.map(c => (
              <FormControlLabel
                key={c.id}
                control={
                  <Checkbox
                    checked={clfChecked.has(c.id)}
                    onChange={(_, v) => {
                      const next = new Set(clfChecked);
                      v ? next.add(c.id) : next.delete(c.id);
                      setClfChecked(next);
                    }}
                  />
                }
                label={`${c.label} (${c.id})`}
              />
            ))}
          </FormGroup>

          {error && <Alert severity="error">{error}</Alert>}

          <Box>
            <Button onClick={run} variant="contained" disabled={loading}>
              {loading ? <><CircularProgress size={18} sx={{ mr: 1 }} /> Running…</> : "Run Inference"}
            </Button>
          </Box>
        </Stack>
      </Paper>

      {study && (
        <Paper variant="outlined" sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom>Results</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Study ID: <code>{study.id}</code>
          </Typography>

          {vlmChecked && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">VLM Report</Typography>
              <Paper variant="outlined" sx={{ p: 2, whiteSpace: "pre-wrap" }}>
                {vlmText || "…"}
              </Paper>
            </Box>
          )}

          <Typography variant="subtitle1" sx={{ mt: 1 }}>Classifier Scores</Typography>
          <Paper variant="outlined" sx={{ p: 2 }}>
            {selectedClassifiers.length === 0
              ? <Typography variant="body2" color="text.secondary">No classifiers selected.</Typography>
              : (
                <Stack spacing={1}>
                  {selectedClassifiers.map(c => (
                    <Box key={c.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography>{c.label}</Typography>
                      <Typography fontFamily="monospace">
                        {scores[c.id] == null ? "…" : scores[c.id].toFixed(3)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )
            }
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
              Use a threshold (e.g., 0.5) depending on desired sensitivity/specificity.
            </Typography>
          </Paper>
        </Paper>
      )}
    </Container>
  );
}
