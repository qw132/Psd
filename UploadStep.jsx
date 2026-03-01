window.UploadStep = function UploadStep({ setFile, setStep }) {
  const handleFile = (file) => {
    if (!file) return;

    const validTypes = ["video/mp4", "video/quicktime", "video/x-matroska"];
    if (!validTypes.includes(file.type)) return alert("نوع الملف غير مدعوم");
    if (file.size > 1024*1024*1024) return alert("حجم الملف أكبر من 1GB");

    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      if (video.duration > 7200) return alert("المدة تتجاوز 120 دقيقة");
      setFile(file);
      setStep("config");
    };
    video.src = URL.createObjectURL(file);
  };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="border border-slate-700 p-8 rounded-xl text-center">
      <input type="file" accept="video/*" onChange={e => handleFile(e.target.files[0])} className="mb-4" />
      <p className="text-slate-400">الحد الأقصى 1GB - 120 دقيقة</p>
    </motion.div>
  );
};
