const { useState, useEffect, useCallback } = React;
const { AnimatePresence, motion } = window.Motion;

// استدعاء المكونات
const UploadStep = window.UploadStep;
const ConfigStep = window.ConfigStep;
const ProcessingStep = window.ProcessingStep;
const ResultsStep = window.ResultsStep;

function App() {
  const [step, setStep] = useState("upload");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [jobId] = useState(() => Math.random().toString(36).substring(2, 10).toUpperCase());

  const addLog = useCallback((text) => setLogs(prev => [...prev, text]), []);

  const startProcessing = useCallback(() => {
    setStep("processing");
    setProgress(0);
    setLogs([]);
    
    const steps = [
      { p: 10, msg: "تحليل الفيديو..." },
      { p: 40, msg: "استخراج المقاطع..." },
      { p: 70, msg: "توليد الترجمة..." },
      { p: 90, msg: "دمج التأثيرات..." },
      { p: 100, msg: "اكتمل المعالجة." }
    ];

    steps.forEach((s, i) => {
      setTimeout(() => {
        setProgress(s.p);
        addLog(s.msg);
        if (s.p === 100) setTimeout(() => setStep("results"), 800);
      }, i * 1500);
    });

  }, [addLog]);

  const resetApp = useCallback(() => {
    setFile(null);
    setProgress(0);
    setLogs([]);
    setStep("upload");
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">SmartClip AI</h1>
        <p className="text-center text-slate-400 mb-4">JOB_ID: {jobId}</p>

        <AnimatePresence mode="wait">
          {step === "upload" && <UploadStep key="upload" setFile={setFile} setStep={setStep} />}
          {step === "config" && <ConfigStep key="config" file={file} startProcessing={startProcessing} setStep={setStep} />}
          {step === "processing" && <ProcessingStep key="processing" progress={progress} logs={logs} />}
          {step === "results" && <ResultsStep key="results" resetApp={resetApp} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Render
ReactDOM.render(<App />, document.getElementById("root"));
