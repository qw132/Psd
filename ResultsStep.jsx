window.ResultsStep = function ResultsStep({ resetApp }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="border border-slate-700 p-6 rounded-xl text-center">
      <h2 className="text-xl font-bold mb-4">تم إنشاء المقاطع بنجاح 🎉</h2>
      <button onClick={resetApp} className="bg-emerald-600 px-6 py-2 rounded hover:bg-emerald-700">فيديو جديد</button>
    </motion.div>
  );
};
