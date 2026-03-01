window.ProcessingStep = function ProcessingStep({ progress, logs }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="border border-slate-700 p-6 rounded-xl">
      <div className="w-full bg-slate-800 rounded-full h-4 mb-4">
        <div className="bg-emerald-500 h-4 rounded-full transition-all" style={{ width:`${progress}%` }}></div>
      </div>
      <div className="h-40 overflow-y-auto p-2 text-sm bg-slate-900 rounded">
        {logs.map((log,i)=><p key={i} className="text-slate-400">{'>'} {log}</p>)}
      </div>
    </motion.div>
  );
};
