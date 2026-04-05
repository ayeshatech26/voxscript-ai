import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Copy, Trash2, Sparkles, Languages, Volume2, Info, X, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += transcript + " ";
        else interim += transcript;
      }
      if (final) setText((prev) => prev + final);
      setInterimText(interim);
    };

    recognition.onend = () => {
      if (isRecording) {
        try { recognition.start(); } catch (e) { console.error(e); }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [language, isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      recognitionRef.current?.stop();
      setInterimText("");
    } else {
      setText("");
      setInterimText("");
      setIsRecording(true);
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center p-4 font-sans text-slate-900">
      
      {/* Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-rose-100 blur-[120px]" />
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
            <Sparkles className="text-white" size={24} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-800">VoxScript <span className="text-indigo-600">AI</span></h1>
        </div>
        <p className="text-slate-500 font-medium tracking-wide uppercase text-[10px] tracking-[0.2em]">ULTIMATE SPEECH-TO-TEXT STUDIO</p>
      </motion.div>

      {/* Main Glass Card */}
      <motion.div 
        layout
        className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white p-8 md:p-10 relative"
      >
        {/* Controls */}
        <div className="flex items-center justify-between mb-10 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2 px-3">
            <Languages size={18} className="text-indigo-500" />
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="en-US">English (US)</option>
              <option value="ur-PK">Urdu (Pakistan) 🇵🇰</option>
            </select>
          </div>
          
          <div className="flex gap-1">
            <button onClick={() => {navigator.clipboard.writeText(text); alert("Copied!")}} className="p-2.5 hover:bg-white rounded-xl transition-all text-slate-500 hover:text-indigo-600 hover:shadow-sm">
              <Copy size={20} />
            </button>
            <button onClick={() => {setText(""); setInterimText("");}} className="p-2.5 hover:bg-white rounded-xl transition-all text-slate-500 hover:text-red-500 hover:shadow-sm">
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Recorder Center */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            <AnimatePresence>
              {isRecording && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0.1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 bg-indigo-600 rounded-full"
                />
              )}
            </AnimatePresence>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleRecording}
              className={`relative h-32 w-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 z-10 ${
                isRecording ? 'bg-red-500 shadow-red-200' : 'bg-indigo-600 shadow-indigo-200'
              }`}
            >
              {isRecording ? <Square size={36} fill="white" className="text-white" /> : <Mic size={40} className="text-white" />}
            </motion.button>
          </div>
          
          <motion.div animate={{ opacity: isRecording ? 1 : 0.5 }} className="mt-6 flex flex-col items-center">
            <span className={`text-[10px] font-black tracking-[0.3em] uppercase ${isRecording ? 'text-red-500' : 'text-slate-400'}`}>
              {isRecording ? "System Live" : "Ready to Sync"}
            </span>
            <div className="h-1 w-12 bg-slate-200 rounded-full mt-2 overflow-hidden">
              {isRecording && <motion.div animate={{ x: [-48, 48] }} transition={{ repeat: Infinity, duration: 1 }} className="h-full w-full bg-red-500" />}
            </div>
          </motion.div>
        </div>

        {/* Text Display */}
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-[2rem] p-8 border border-slate-100 min-h-[250px] shadow-inner relative group mb-6">
          <div className="absolute top-4 right-6 opacity-20 group-hover:opacity-100 transition-opacity">
            <Volume2 size={16} className="text-slate-400" />
          </div>
          
          <div className="text-slate-700 text-xl md:text-2xl leading-relaxed font-semibold">
            {text === "" && interimText === "" ? (
              <div className="flex flex-col items-center justify-center py-12 opacity-20 text-center">
                <p className="italic">Begin speaking to transcribe...</p>
              </div>
            ) : (
              <p>
                {text}
                <span className="text-indigo-500/60 font-medium italic">{interimText}</span>
              </p>
            )}
          </div>
        </div>

        {/* Learn About Tool Link (Added Here) */}
        <div className="flex justify-center border-t border-slate-100 pt-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:text-indigo-700 transition-all group"
          >
            <Info size={16} className="group-hover:rotate-12 transition-transform" />
            Learn about tool
          </button>
        </div>
      </motion.div>

      {/* FOOTER MODAL / DESCRIPTION POPUP */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white max-w-lg w-full rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800">VoxScript Guide</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tool Documentation</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <Zap size={20} className="text-indigo-500 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Real-time Processing</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">Converts your voice to text instantly using the browser's native Web Speech engine.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <Languages size={20} className="text-indigo-500 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Bilingual Support</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">Specially optimized for English (US) and Urdu (Pakistan) with high phonetic accuracy.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <ShieldCheck size={20} className="text-indigo-500 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Privacy & Security</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">Zero cloud storage. Your audio stays in the browser and is never recorded or saved.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="mt-8 w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase text-xs tracking-widest"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-10 flex flex-col items-center gap-1">
        <p className="text-slate-400 text-[10px] font-black tracking-widest uppercase">
          VoxScript Studio v2.1 • Designed by Ayesha Shakir
        </p>
        <div className="h-1 w-1 bg-indigo-300 rounded-full" />
      </footer>
    </div>
  );
}

export default App;