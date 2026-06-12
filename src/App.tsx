import React, { useState, useEffect } from "react";
import {
  Volume2,
  Sparkles,
  Settings,
  History,
  FileText,
  RefreshCw,
  Info,
  Mic,
  Play,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Megaphone,
  MicOff,
  Sliders,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { INITIAL_FULL_TEXT, VOICE_OPTIONS, MOODS } from "./data";
import { AudioGeneration } from "./types";
import AudioPlayer from "./components/AudioPlayer";
import FeedbackDashboard from "./components/FeedbackDashboard";

export default function App() {
  // TTS States
  const [textToSpeak, setTextToSpeak] = useState<string>(INITIAL_FULL_TEXT);
  const [selectedVoice, setSelectedVoice] = useState<string>("Kore");
  const [selectedMood, setSelectedMood] = useState<string>("warmly");
  
  // Loading and player states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentAudio, setCurrentAudio] = useState<AudioGeneration | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [apiError, setApiError] = useState<string | null>(null);

  // Quick speak loading state (saves which word/section is loading)
  const [isLoadingQuick, setIsLoadingQuick] = useState<string | null>(null);

  // Audio history state
  const [historyList, setHistoryList] = useState<AudioGeneration[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem("kids_coaching_tts_history");
      if (cached) {
        const parsed = JSON.parse(cached);
        setHistoryList(parsed);
        if (parsed.length > 0) {
          setCurrentAudio(parsed[0]);
        }
      }
    } catch (e) {
      console.error("Failed to load audio history from cache", e);
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (newHistory: AudioGeneration[]) => {
    setHistoryList(newHistory);
    try {
      localStorage.setItem("kids_coaching_tts_history", JSON.stringify(newHistory));
    } catch (e) {
      console.warn("History exceeds local storage limits, can't parse or cache fully", e);
    }
  };

  // Main TTS Generation Function
  const generateSpeech = async (customText?: string) => {
    const textTarget = customText || textToSpeak;
    if (!textTarget.trim()) {
      setApiError("Vui lòng điền nội dung cần chuyển sang giọng nói.");
      return;
    }

    setIsGenerating(true);
    setApiError(null);
    setIsPlaying(false);
    setLoadingStep("Đang phân tích ngữ điệu văn bản...");

    // Periodic simulation steps for rich user feedback
    const timers = [
      setTimeout(() => setLoadingStep("Đang tải giọng nói truyền cảm..."), 1000),
      setTimeout(() => setLoadingStep("Đang căn chỉnh âm sắc chuẩn phát âm..."), 2200),
      setTimeout(() => setLoadingStep("Đang khởi tạo tệp âm thanh WAV sạch..."), 3500),
    ];

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textTarget,
          voiceName: selectedVoice,
          mood: selectedMood,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Không thể khởi tạo dịch vụ TTS.");
      }

      const data = await response.json();
      if (!data.audio) {
        throw new Error("Không có tệp âm thanh được trả về.");
      }

      // Add standard timestamp
      const now = new Date();
      const timestampString = now.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const newAudioItem: AudioGeneration = {
        id: `aud-${Date.now()}`,
        text: textTarget.length > 60 ? textTarget.substring(0, 60) + "..." : textTarget,
        voiceName: selectedVoice,
        mood: selectedMood,
        timestamp: timestampString,
        audioUrl: data.audio, // base64 string
      };

      setCurrentAudio(newAudioItem);
      setIsPlaying(true); // Auto-play generated file
      saveHistory([newAudioItem, ...historyList]);
    } catch (err: any) {
      console.error("Error generating speech:", err);
      setApiError(err.message || "Lỗi không xác định khi kết nối với máy chủ AI.");
    } finally {
      timers.forEach(clearTimeout);
      setIsGenerating(false);
      setLoadingStep("");
    }
  };

  // Quick Speak triggers from dashboard elements
  const handleQuickPronounce = async (text: string) => {
    if (isGenerating || isLoadingQuick) return;
    setIsLoadingQuick(text);
    setIsPlaying(false);

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          voiceName: selectedVoice, // maintains selected voice options
          mood: "slowly and clearly", // uses slower clear mode for teaching individual words
        }),
      });

      if (!response.ok) {
        throw new Error("Lỗi nạp âm thanh nhanh");
      }

      const data = await response.json();
      if (!data.audio) throw new Error("Null data");

      const now = new Date();
      const timestampString = now.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const quickAudioItem: AudioGeneration = {
        id: `aud-quick-${Date.now()}`,
        text: `Mẫu phát âm: "${text}"`,
        voiceName: selectedVoice,
        mood: "slowly and clearly",
        timestamp: timestampString,
        audioUrl: data.audio,
      };

      setCurrentAudio(quickAudioItem);
      setIsPlaying(true);
    } catch (err) {
      console.error("Quick TTS failed:", err);
      setApiError("Không tải được âm nhanh cho từ vựng này. Hãy sử dụng bảng chuyển âm tay.");
    } finally {
      setIsLoadingQuick(null);
    }
  };

  const handlePlayPauseToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const clearHistory = () => {
    if (confirm("Bạn có chắc chắn muốn xóa lịch sử bản ghi âm của phiên này?")) {
      saveHistory([]);
      setCurrentAudio(null);
      setIsPlaying(false);
    }
  };

  const loadFromHistory = (item: AudioGeneration) => {
    setCurrentAudio(item);
    setIsPlaying(true);
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = historyList.filter((item) => item.id !== id);
    saveHistory(updated);
    if (currentAudio?.id === id) {
      setCurrentAudio(updated.length > 0 ? updated[0] : null);
      setIsPlaying(false);
    }
  };

  const getSelectedVoiceGenderLabel = () => {
    const opt = VOICE_OPTIONS.find((o) => o.value === selectedVoice);
    return opt?.gender === "female" ? "Giọng Nữ" : "Giọng Nam";
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#4A4A35] flex flex-col antialiased font-sans">
      
      {/* Decorative Brand Top Margin */}
      <div className="bg-[#5A5A40] h-1.5 w-full"></div>

      {/* Main Header navigation */}
      <header className="border-b border-[#5A5A40]/15 py-6 px-6 bg-white/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#5A5A40] rounded-2xl shadow-xs text-[#F5F5F0]">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <h1 id="app-title-main" className="font-serif text-3xl text-[#5A5A40] italic font-medium">
                  Báo Cáo Nhận Xét Phát Âm
                </h1>
                <span className="text-xs text-[#4A4A35]/80 uppercase tracking-widest mt-1 font-semibold">
                  Học viên: Bắp & Chị Hai
                </span>
              </div>
              <p className="text-xs text-[#4A4A35]/70 font-mono mt-1">
                Phát âm chuẩn tiếng Anh • Female Voice AI với Gemini 3.1 tts-preview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="bg-white/80 px-4 py-2 rounded-full border border-[#5A5A40]/10 flex items-center gap-2 text-xs font-semibold text-[#5A5A40]">
              <div className="w-2 h-2 rounded-full bg-[#5A5A40] animate-ping"></div>
              <span>Gemini 3.1 TTS Active</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Layout Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (Control Panel, Editor, and Quick Configuration) - Takes 8 columns */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          
          {/* Section 1: Active Configuration of voice & mood */}
          <div className="bg-white rounded-3xl border border-[#5A5A40]/15 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#5A5A40]/10 pb-3">
              <Settings className="w-5 h-5 text-[#5A5A40]" />
              <h2 className="font-serif font-bold text-[#5A5A40] text-lg italic">Cài đặt giọng nói vàng</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Voice Choice */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider block">
                  Chọn Giọng Đọc (Bộ Mẫu)
                </label>
                <div className="relative">
                  <select
                    id="select-voice-option"
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full bg-[#F5F5F0] border border-[#5A5A40]/20 text-[#4A4A35] text-sm font-semibold rounded-2xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[#5A5A40] focus:bg-white transition-all"
                  >
                    {VOICE_OPTIONS.map((v) => (
                      <option key={v.value} value={v.value}>
                        {v.label} {v.gender === "female" ? "♀" : "♂"}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#5A5A40]">
                    ▼
                  </div>
                </div>
                <p className="text-[11px] text-[#4A4A35]/80 font-medium italic mt-1">
                  {VOICE_OPTIONS.find((v) => v.value === selectedVoice)?.description}
                </p>
              </div>

              {/* Mood Choice */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider block">
                  Phong Thái Hoạt Bát / Cảm Xúc
                </label>
                <div className="relative">
                  <select
                    id="select-mood-option"
                    value={selectedMood}
                    onChange={(e) => setSelectedMood(e.target.value)}
                    className="w-full bg-[#F5F5F0] border border-[#5A5A40]/20 text-[#4A4A35] text-sm font-semibold rounded-2xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[#5A5A40] focus:bg-white transition-all"
                  >
                    {MOODS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#5A5A40]">
                    ▼
                  </div>
                </div>
                <p className="text-[11px] text-[#4A4A35]/80 font-medium italic mt-1">
                  Gợi ý tâm lý cho mô hình AI biến chuyển giọng nói phù hợp ngữ cảnh.
                </p>
              </div>

            </div>
          </div>

          {/* Section 2: Text Editor Canvas */}
          <div className="bg-white rounded-3xl border border-[#5A5A40]/15 p-6 shadow-xs flex flex-col space-y-4">
            
            <div className="flex justify-between items-center border-b border-[#5A5A40]/10 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#5A5A40]" />
                <h2 className="font-serif font-bold text-[#5A5A40] text-lg italic">Soạn văn bản sửa sai phát âm</h2>
              </div>
              
              <div className="flex items-center gap-2.5">
                <button
                  id="btn-restore-preset"
                  onClick={() => {
                    if (confirm("Khôi phục lại nhận xét gốc mộc về phát âm Kate & Bố của hai bé?")) {
                      setTextToSpeak(INITIAL_FULL_TEXT);
                    }
                  }}
                  className="text-xs text-[#5A5A40] hover:text-[#4A4A30] font-bold flex items-center gap-1.5 py-1 px-3.5 rounded-full hover:bg-[#5A5A40]/10 border border-[#5A5A40]/25 transition-all cursor-pointer"
                  title="Nhập lại bài nhận xét ban đầu"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Đặt Lại Bản Gốc
                </button>
              </div>
            </div>

            {/* Rich Editor Field */}
            <div className="relative">
              <textarea
                id="textarea-tts-content"
                value={textToSpeak}
                onChange={(e) => setTextToSpeak(e.target.value)}
                placeholder="Nhập bất kỳ đoạn nhận xét, bài khóa hoặc câu tiếng Anh cần phát âm thử..."
                className="w-full min-h-[300px] max-h-[450px] p-4 bg-[#F5F5F0] text-[#4A4A35] text-sm font-medium leading-relaxed rounded-2xl border border-[#5A5A40]/20 focus:outline-none focus:ring-2 focus:ring-[#5A5A40] focus:bg-white transition-all resize-y"
              />
              <div className="absolute bottom-3 right-3 text-[10px] font-mono text-[#5A5A40] font-semibold bg-white px-2 py-0.5 rounded-md border border-[#5A5A40]/10">
                Ký tự: {textToSpeak.length}
              </div>
            </div>

            {/* TTS Core Button actions */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
              <span className="text-xs text-[#4A4A35]/70 font-medium">
                Sử dụng giọng nữ thanh thoát của <b>Kore</b> để nghe phát âm hoàn mỹ nhất.
              </span>

              <button
                id="btn-trigger-tts"
                onClick={() => generateSpeech()}
                disabled={isGenerating || !textToSpeak.trim()}
                className={`w-full sm:w-auto h-12 px-8 rounded-full font-bold text-sm tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                  isGenerating 
                    ? "bg-[#E0E0D0] text-[#5A5A40]/65 border border-[#5A5A40]/15"
                    : "bg-[#5A5A40] text-white hover:bg-[#4A4A30] transform hover:-translate-y-0.5 active:translate-y-0"
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#5A5A40] border-t-transparent rounded-full animate-spin"></div>
                    <span>{loadingStep || "Đang xử lý..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 fill-white stroke-none animate-bounce" />
                    <span>Chuyển Giọng Nói Nữ AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Error notifications */}
            <AnimatePresence>
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">⚠️</span>
                    <span>{apiError}</span>
                  </div>
                  <button
                    onClick={() => setApiError(null)}
                    className="text-xs font-semibold underline text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    Đóng
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Section 3: High Fidelity Structured dashboard tabs */}
          <FeedbackDashboard
            onQuickPronounce={handleQuickPronounce}
            isLoadingQuick={isLoadingQuick}
          />

        </div>

        {/* RIGHT COLUMN (Audio Station, History list) - Takes 4 columns */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Section 1: Custom audio playback component */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#5A5A40]/70 uppercase tracking-wider px-1">
              Trạm Phát Phát Âm
            </h3>
            <AudioPlayer
              currentAudio={currentAudio}
              isPlaying={isPlaying}
              onPlayPauseToggle={handlePlayPauseToggle}
              onReset={() => {
                setCurrentAudio(null);
                setIsPlaying(false);
              }}
            />
          </div>

          {/* Section 2: Session Audio History Logs */}
          <div className="bg-white rounded-3xl border border-[#5A5A40]/15 p-5 shadow-xs space-y-4">
            
            <div className="flex justify-between items-center border-b border-[#5A5A40]/10 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#5A5A40]" />
                <h3 className="font-bold text-[#5A5A40] text-sm">Lịch sử bản dịch</h3>
              </div>

              {historyList.length > 0 && (
                <button
                  id="btn-clear-history"
                  onClick={clearHistory}
                  className="text-xs text-red-600 hover:text-red-700 font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="Xoá sách toàn bộ lịch sử bản ghi"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Xoá Hết
                </button>
              )}
            </div>

            {historyList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <p className="text-xs font-semibold text-[#4A4A35]/70">Chưa có lịch sử chuyển âm</p>
                <p className="text-[11px] text-[#4A4A35]/50">Các âm thanh được tạo âm sẽ lưu tạm tại đây để nghe lướt nhanh.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                {historyList.map((item) => {
                  const isCurrent = currentAudio?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className={`w-full text-left p-2.5 rounded-2xl border transition-all flex justify-between items-center gap-2 cursor-pointer ${
                        isCurrent
                          ? "bg-[#F5F5F0] border-[#5A5A40]/30 shadow-xs"
                          : "bg-[#F5F5F0]/30 border-[#5A5A40]/10 hover:bg-[#F5F5F0]/60"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-[#5A5A40]' : 'bg-[#E0E0D0]'}`}></span>
                          <span className="text-[11px] font-bold text-[#4A4A35] line-clamp-1">
                            {item.text}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-[#4A4A35]/60">
                          <span>{item.voiceName} ({item.mood})</span>
                          <span>•</span>
                          <span>{item.timestamp}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <span className="p-1.5 bg-white border border-[#5A5A40]/15 rounded-xl text-[#5A5A40] hover:text-[#4A4A30]">
                          <Play className={`w-3 h-3 ${isCurrent && isPlaying ? 'fill-[#5A5A40] text-[#5A5A40] stroke-none' : 'fill-[#4A4A35]/30 text-[#4A4A35]/30 stroke-none'}`} />
                        </span>
                        
                        <button
                          id={`btn-delete-history-${item.id}`}
                          onClick={(e) => deleteHistoryItem(item.id, e)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-xl hover:bg-slate-200/50 transition-all"
                          title="Xoá bản ghi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </button>
                  );
                })}
              </div>
            )}

            {/* Session usage tips */}
            <div className="p-3 bg-[#F5F5F0] border border-[#5A5A40]/10 rounded-2xl space-y-1">
              <h4 className="text-[11px] font-bold text-[#5A5A40] flex items-center gap-1">
                <Info className="w-3 h-3 text-[#5A5A40] shrink-0" />
                Dùng như máy nghe tiếng Anh:
              </h4>
              <p className="text-[10px] text-[#4A4A35]/80 leading-relaxed">
                Khi các bé đọc bài hội thoại tiếng Anh, hãy soạn từng câu của bài hội thoại vào khung chữ hoặc nhấp vào Từ vựng để nghe giọng phát âm mẫu liên tục và chuẩn xác.
              </p>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
