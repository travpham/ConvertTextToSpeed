import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Download, Volume2, RotateCcw, AlertTriangle, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AudioGeneration } from "../types";

interface AudioPlayerProps {
  currentAudio: AudioGeneration | null;
  isPlaying: boolean;
  onPlayPauseToggle: () => void;
  onReset: () => void;
}

export default function AudioPlayer({
  currentAudio,
  isPlaying,
  onPlayPauseToggle,
  onReset,
}: AudioPlayerProps) {
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Initialize and synchronise audio source
  useEffect(() => {
    if (!currentAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    // Set audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    
    // Convert base64 to data url or keep blob url
    const isBase64 = currentAudio.audioUrl.startsWith("data:") || !currentAudio.audioUrl.includes("blob:");
    const srcUrl = isBase64 ? currentAudio.audioUrl : `data:audio/wav;base64,${currentAudio.audioUrl}`;
    
    // Only re-set if source is different
    if (audio.src !== srcUrl) {
      audio.src = srcUrl;
      audio.load();
    }

    audio.playbackRate = playbackRate;
    audio.volume = volume;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setCurrentTime(0);
      if (isPlaying) {
        onPlayPauseToggle(); // Toggle state down to false
      }
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    // Initial play or pause triggered by prop
    if (isPlaying) {
      audio.play().catch((err) => {
        console.error("Audio playback interrupted/failed:", err);
        onPlayPauseToggle(); // Safety reset of state
      });
    } else {
      audio.pause();
    }

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentAudio, isPlaying]);

  // Synchronize playback rate
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Synchronize volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Scrubber control
  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Skip backward or forward helper
  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      let newTime = audioRef.current.currentTime + seconds;
      if (newTime < 0) newTime = 0;
      if (newTime > duration) newTime = duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Helper to format second thresholds nicely (e.g. 02:15)
  const formatTime = (timeInSecs: number) => {
    if (isNaN(timeInSecs)) return "0:00";
    const minutes = Math.floor(timeInSecs / 60);
    const seconds = Math.floor(timeInSecs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Download logic
  const handleDownload = () => {
    if (!currentAudio) return;
    const isDataUrl = currentAudio.audioUrl.startsWith("data:");
    const fileUrl = isDataUrl ? currentAudio.audioUrl : `data:audio/wav;base64,${currentAudio.audioUrl}`;
    
    // Create element and trigger click download
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = `phat-am-nu-${currentAudio.voiceName}-${Date.now()}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#5A5A40]/15 p-6 shadow-xs relative overflow-hidden transition-all duration-300">
      
      {/* Decorative Warm Top Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#5A5A40]"></div>

      {!currentAudio ? (
        <div className="flex flex-col items-center justify-center py-10 text-[#4A4A35]/60">
          <Volume2 className="w-12 h-12 text-[#5A5A40]/30 mb-3 stroke-[1.5]" />
          <p className="text-sm font-medium text-[#4A4A35]/80">Chưa có bản ghi âm nào</p>
          <p className="text-xs text-[#4A4A35]/60 text-center px-6 mt-1">
            Bấm chọn giọng đọc vàng rồi ấn "Chuyển giọng nói" để bắt đầu nghe thử
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          
          {/* Header Info */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#E0E0D0]/50 text-[#5A5A40] border border-[#5A5A40]/20">
                  Phát Âm Nữ {currentAudio.voiceName}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {currentAudio.timestamp}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-[#4A4A35] mt-1 line-clamp-1">
                {currentAudio.text}
              </h4>
            </div>
            
            <button
              id="action-btn-download"
              onClick={handleDownload}
              className={`p-2 rounded-xl border transition-all duration-200 flex items-center gap-1.5 ${
                downloadSuccess
                  ? "bg-emerald-50 border-emerald-250 text-emerald-700"
                  : "bg-white border-[#5A5A40]/20 text-[#4A4A35] hover:bg-[#F5F5F0]"
              }`}
              title="Tải tệp WAV về máy"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-semibold">Đã tải!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#5A5A40]" />
                  <span className="text-xs font-semibold">Tải WAV</span>
                </>
              )}
            </button>
          </div>

          {/* Custom Animated soundwave */}
          <div className="h-16 bg-[#F5F5F0] rounded-2xl flex items-center justify-center gap-[4px] px-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#5A5A40]/5 to-transparent pointer-events-none"></div>
            
            {/* Visual sound bar grids */}
            {Array.from({ length: 28 }).map((_, i) => {
              // Creating custom heights for wave effect
              const heights = [20, 42, 15, 30, 48, 25, 35, 52, 18, 40, 22, 32, 50, 16, 28, 45, 12, 38, 55, 24, 30, 44, 20, 36, 48, 14, 26, 40];
              const heightValue = heights[i % heights.length];
              
              return (
                <motion.div
                  key={i}
                  className="w-1 rounded-full bg-[#5A5A40]/80"
                  initial={{ height: 6 }}
                  animate={{
                    height: isPlaying ? [6, heightValue, 6] : 10,
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.04,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </div>

          {/* Time tracker and Scrubber slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-[#4A4A35]/70 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            
            <input
              id="slider-playback-progress"
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleScrub}
              className="w-full h-1.5 bg-[#F5F5F0] rounded-full appearance-none cursor-pointer accent-[#5A5A40] focus:outline-none"
            />
          </div>

          {/* Interactive Play/Pause, rate and skips Controls */}
          <div className="flex items-center justify-between pt-1">
            
            {/* Speed Multipliers */}
            <div className="flex bg-[#F5F5F0] p-0.5 rounded-xl border border-[#5A5A40]/10">
              {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setPlaybackRate(rate)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-150 ${
                    playbackRate === rate
                      ? "bg-[#5A5A40] text-white shadow-xs"
                      : "text-[#4A4A35]/80 hover:text-[#5A5A40]"
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Core Play Back actions */}
            <div className="flex items-center gap-3">
              <button
                id="btn-restart-audio"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    setCurrentTime(0);
                  }
                }}
                className="p-2 border border-[#5A5A40]/25 text-[#5A5A40] hover:bg-[#F5F5F0] rounded-full transition-all"
                title="Quay lại từ đầu"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                id="btn-play-pause-active"
                onClick={onPlayPauseToggle}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#5A5A40] text-white shadow-md hover:bg-[#4A4A30] transition-all transform hover:scale-105 active:scale-95"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-white stroke-none" />
                ) : (
                  <Play className="w-6 h-6 fill-white stroke-none translate-x-[1.5px]" />
                )}
              </button>
            </div>

            {/* Volume slider controls */}
            <div className="flex items-center gap-2 w-28 shrink-0">
              <Volume2 className="w-4 h-4 text-[#5A5A40]/70" />
              <input
                id="volume-slider-active"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-[#F5F5F0] rounded-full appearance-none cursor-pointer accent-[#5A5A40]"
              />
            </div>

          </div>

        </div>
      )}

      {/* Speed coaching helper */}
      {playbackRate < 1.0 && currentAudio && (
        <div className="mt-4 p-2.5 bg-[#5A5A40]/5 border border-[#5A5A40]/15 rounded-2xl flex items-center gap-2 text-xs text-[#5A5A40] font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0 text-[#5A5A40]" />
          <span>Tốc độ chậm hữu ích để hai bé nghe rõ các âm đuôi /s/, /st/, /θ/.</span>
        </div>
      )}
    </div>
  );
}
