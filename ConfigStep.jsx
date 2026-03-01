window.ConfigStep = function ConfigStep({ file, startProcessing, setStep }) {
  const [clipCount, setClipCount] = React.useState(5);
  const [duration, setDuration] = React.useState(30);

  return (
    <motion.div initial={{ opacity:0, x:-50 }} animate={{ opacity:1, x:0 }} className="space-y-6">
      <div className="border border-slate-700 p-6 rounded-xl">
        <h3 className="font-bold mb-4">ملف المصدر</h3>
        <p>{file.name}</p>
        <p className="text-slate-400">جاهز للمعالجة</p>
      </div>

      <div className="border border-slate-700 p-6 rounded-xl">
        <h3 className="font-bold mb-2">إعدادات المقطع</h3>
        <label>عدد المقاطع</label>
        <select className="w-full p-2 mt-1 mb-4 bg-slate-800 rounded" value={clipCount} onChange={e=>setClipCount(Number(e.target.value))}>
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
        <label>مدة كل مقطع (ثانية)</label>
        <select className="w-full p-2 mt-1 rounded bg-slate-800" value={duration} onChange={e=>setDuration(Number(e.target.value))}>
          <option value={15}>15</option>
          <option value={30}>30</option>
          <option value={45}>45</option>
          <option value={60}>60</option>
        </select>
      </div>

      <div className="flex justify-between mt-4">
        <button onClick={()=>setStep("upload")} className="px-4 py-2 rounded bg-slate-700">رجوع</button>
        <button onClick={startProcessing} className="px-6 py-2 rounded bg-indigo-600 hover:bg-indigo-700">توليد المقاطع</button>
      </div>
    </motion.div>
  );
};
