import React, { useState } from "react";
import { Play, Volume2, BookOpen, Star, HelpCircle, ArrowRight, Lightbulb, UserCheck } from "lucide-react";
import { CHILDREN_FEEDBACK, VOCABULARY_LIST, SUGGESTIONS, METHOD_TIPS } from "../data";
import { motion } from "motion/react";

interface FeedbackDashboardProps {
  onQuickPronounce: (text: string) => void;
  isLoadingQuick: string | null;
}

export default function FeedbackDashboard({
  onQuickPronounce,
  isLoadingQuick,
}: FeedbackDashboardProps) {
  const [activeTab, setActiveTab] = useState<"kids" | "vocab" | "methods">("kids");

  return (
    <div className="space-y-6">
      
      {/* Tab Selectors */}
      <div className="flex bg-white/60 p-1.5 rounded-2xl border border-[#5A5A40]/15">
        <button
          onClick={() => setActiveTab("kids")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "kids"
              ? "bg-[#5A5A40] text-white shadow-xs"
              : "text-[#4A4A35]/75 hover:text-[#5A5A40] hover:bg-[#5A5A40]/5"
          }`}
        >
          <UserCheck className="w-4 h-4 font-semibold" />
          Nhận Xét 2 Bé
        </button>

        <button
          onClick={() => setActiveTab("vocab")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "vocab"
              ? "bg-[#5A5A40] text-white shadow-xs"
              : "text-[#4A4A35]/75 hover:text-[#5A5A40] hover:bg-[#5A5A40]/5"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Từ Vựng & Phát Âm
        </button>

        <button
          onClick={() => setActiveTab("methods")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "methods"
              ? "bg-[#5A5A40] text-white shadow-xs"
              : "text-[#4A4A35]/75 hover:text-[#5A5A40] hover:bg-[#5A5A40]/5"
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          Phương Pháp Luyện Tập
        </button>
      </div>

      {/* Tab 1: Kids Detailed Feedback */}
      {activeTab === "kids" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CHILDREN_FEEDBACK.map((child, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-[#5A5A40]/15 hover:border-[#5A5A40]/30 shadow-xs hover:shadow-xs transition-all duration-300 p-6 flex flex-col justify-between"
            >
              <div>
                {/* Child Name Header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl p-2 bg-[#F5F5F0] rounded-2xl">{child.avatar}</span>
                  <div>
                    <h3 className="font-serif font-bold text-[#5A5A40] text-xl">{child.name}</h3>
                    <p className="text-xs font-semibold text-[#4A4A35]/65 uppercase tracking-wider">
                      {child.role}
                    </p>
                  </div>
                </div>

                {/* Pros Section */}
                <div className="mb-5 space-y-2">
                  <h4 className="text-xs font-bold text-[#5A5A40] bg-[#E0E0D0]/50 uppercase inline-block px-3 py-1 rounded-full mb-2">
                     Ưu Điểm Nổi Bật
                  </h4>
                  <ul className="space-y-2.5">
                    {child.pros.map((pro, pIndex) => (
                      <li key={pIndex} className="text-sm text-[#4A4A35]/90 flex items-start gap-2">
                        <Star className="w-4 h-4 text-[#5A5A40] fill-[#E0E0D0]/50 shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements Section */}
                <div className="space-y-3.5 border-t border-[#5A5A40]/10 pt-4">
                  <h4 className="text-xs font-bold text-orange-950 bg-orange-50 border border-orange-100 uppercase inline-block px-3 py-1 rounded-full">
                     Điểm Cần Cải Thiện
                  </h4>
                  <div className="space-y-4">
                    {child.improvements.map((imp, impIdx) => (
                      <div key={impIdx} className="bg-[#F5F5F0]/65 rounded-2xl p-4 space-y-2 border border-[#5A5A40]/10">
                        <p className="font-semibold text-[#4A4A35] text-sm flex items-center justify-between">
                          <span>{imp.category}</span>
                        </p>
                        <p className="text-xs text-[#4A4A35]/80 leading-relaxed">{imp.details}</p>
                        
                        {/* Interactive Word Tags */}
                        {imp.exampleWords.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {imp.exampleWords.map((word, wIdx) => {
                              // Extract pure word without parenthetical notes
                              const cleanWord = word.split(" ")[0].replace(/[()]/g, "");
                              return (
                                <button
                                  key={wIdx}
                                  onClick={() => onQuickPronounce(cleanWord)}
                                  disabled={isLoadingQuick !== null}
                                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-white border border-[#5A5A40]/15 py-1 px-3 rounded-full hover:bg-[#5A5A40]/10 hover:border-[#5A5A40]/25 text-[#5A5A40] focus:outline-none transition-all duration-150 cursor-pointer"
                                >
                                  <Volume2 className="w-3 h-3 text-[#5A5A40] shrink-0" />
                                  <span>{word}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Read Aloud Individual Child Summary card */}
              <div className="mt-5 pt-3.5 border-t border-[#5A5A40]/10">
                <button
                  id={`btn-pronounce-summary-${idx}`}
                  onClick={() => {
                    const textToRead = `Phần nhận xét cụ thể về ${child.name}, vai ${child.role}: Ưu điểm: ${child.pros.join(". ")}. Điểm cần cải thiện: ${child.improvements.map(i => `${i.category}: ${i.details}`).join(". ")}`;
                    onQuickPronounce(textToRead);
                  }}
                  disabled={isLoadingQuick !== null}
                  className="w-full h-11 px-4 rounded-xl flex items-center justify-center gap-2 bg-[#F5F5F0] hover:bg-[#E0E0D0]/50 text-[#5A5A40] font-bold text-sm border border-[#5A5A40]/15 transition-all cursor-pointer"
                >
                  {isLoadingQuick?.includes(child.name) ? (
                    <div className="w-4 h-4 border-2 border-[#5A5A40] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Volume2 className="w-4 h-4 text-[#5A5A40]" />
                  )}
                  <span>Nghe đánh giá chi tiết về {child.name}</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Vocabulary & Standard IPA Pronunciation */}
      {activeTab === "vocab" && (
        <div className="space-y-6">
          
          {/* Section 2.1: IPA Standards Words */}
          <div className="bg-white rounded-3xl border border-[#5A5A40]/15 p-6 shadow-xs">
            <h3 className="font-serif font-bold text-[#5A5A40] text-base mb-1 flex items-center gap-1.5">
              <span className="p-1 px-2.5 bg-[#E0E0D0]/60 text-[#5A5A40] text-xs font-bold rounded-lg border border-[#5A5A40]/10">1</span>
              Gợi ý cách đọc chuẩn từ khó
            </h3>
            <p className="text-xs text-[#4A4A35]/65 mb-5">Click vào biểu tượng loa để nghe giọng nữ phát âm chuẩn từ vựng tương ứng</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SUGGESTIONS.map((s, i) => (
                <div
                  key={i}
                  className="p-4 bg-[#F5F5F0]/40 border border-[#5A5A40]/10 rounded-2xl flex items-start justify-between hover:bg-[#F5F5F0]/80 hover:border-[#5A5A40]/25 transition-all duration-200"
                >
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-[#5A5A40] text-base">{s.word}</span>
                      <span className="text-xs text-[#5A5A40]/80 font-mono font-semibold">{s.ipa}</span>
                    </div>
                    <p className="text-xs text-[#4A4A35]/70 leading-relaxed">{s.tip}</p>
                  </div>

                  <button
                    id={`btn-custom-suggestion-${i}`}
                    onClick={() => {
                      // Trigger audio of word + phonetic
                      const text = `How to pronounce clearly, American English accent: "${s.word}". I Repeat, "${s.word}".`;
                      onQuickPronounce(text);
                    }}
                    disabled={isLoadingQuick !== null}
                    className="p-2 bg-white rounded-xl border border-[#5A5A40]/15 text-[#5A5A35] hover:text-[#4A4A30] hover:border-[#5A5A40] transition-all cursor-pointer"
                    title="Nghe phát âm chuẩn"
                  >
                    {isLoadingQuick === `How to pronounce clearly, American English accent: "${s.word}". I Repeat, "${s.word}".` ? (
                      <div className="w-4 h-4 border-2 border-[#5A5A40] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Volume2 className="w-4.5 h-4.5 text-[#5A5A40]" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2.2: Vocabulary Meanings */}
          <div className="bg-white rounded-3xl border border-[#5A5A40]/15 p-6 shadow-xs">
            <h3 className="font-serif font-bold text-[#5A5A40] text-base mb-1 flex items-center gap-1.5">
              <span className="p-1 px-2.5 bg-[#E0E0D0]/60 text-[#5A5A40] text-xs font-bold rounded-lg border border-[#5A5A40]/10">2</span>
              Giải thích từ vựng trong bài hội thoại
            </h3>
            <p className="text-xs text-[#4A4A35]/65 mb-5">Học cấu trúc chuẩn, IPA và nghĩa câu tương tác của các bé</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {VOCABULARY_LIST.map((v, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-[#5A5A40]/10 bg-white hover:border-[#5A5A40]/25 transition-all shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#5A5A40] text-base">{v.word}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#E0E0D0]/50 text-[#5A5A40] border border-[#5A5A40]/10 uppercase">
                          {v.partOfSpeech}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-medium text-slate-400">{v.ipa}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs text-[#4A4A35]"><span className="text-[#5A5A40] font-semibold">Ý nghĩa:</span> {v.meaning}</p>
                      <p className="text-xs text-[#4A4A35]/90 bg-[#F5F5F0]/60 p-2.5 rounded-xl italic border-l-2 border-[#5A5A40]">
                        <span className="text-[#5A5A40] font-semibold not-italic">Ví dụ:</span> {v.example}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-[#5A5A40]/10 flex justify-end">
                    <button
                      id={`btn-pronounce-vocab-${i}`}
                      onClick={() => {
                        const pronunciationPrompt = `Vocabulary instruction in english speaking clearly: Word "${v.word}". Part of speech: "${v.partOfSpeech}". Phonetic spelling "${v.ipa}". Example usage: "${v.example}"`;
                        onQuickPronounce(pronunciationPrompt);
                      }}
                      disabled={isLoadingQuick !== null}
                      className="text-xs text-[#5A5A40] font-semibold hover:text-[#4A4A30] flex items-center gap-1 bg-[#F5F5F0] hover:bg-[#E0E0D0]/50 px-3 py-1.5 rounded-lg border border-[#5A5A40]/15 transition-all cursor-pointer"
                    >
                      {isLoadingQuick?.includes(v.word) ? (
                        <div className="w-3.5 h-3.5 border-2 border-[#5A5A40] border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                      <span>Luyện đọc từ &amp; ví dụ</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Interactive Methodologies */}
      {activeTab === "methods" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {METHOD_TIPS.map((tip, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-[#5A5A40]/15 p-6 shadow-xs hover:border-[#5A5A40]/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-3xl p-2 bg-[#F5F5F0] rounded-2xl inline-block">{tip.icon}</span>
                <h3 className="font-serif font-bold text-[#5A5A40] text-sm leading-snug">{tip.title}</h3>
                <p className="text-xs text-[#4A4A35]/80 leading-relaxed">{tip.description}</p>
              </div>

              <div className="border-t border-[#5A5A40]/10 pt-4 mt-5">
                <button
                  id={`btn-read-method-${idx}`}
                  onClick={() => {
                    const prompt = `Lập tức đọc rõ mẹo phương pháp rèn luyện bằng tiếng Việt: Mẹo: "${tip.title}". Nội dung hướng dẫn: "${tip.description}"`;
                    onQuickPronounce(prompt);
                  }}
                  disabled={isLoadingQuick !== null}
                  className="w-full text-xs font-semibold text-[#5A5A40] hover:text-[#4A4A30] flex items-center justify-center gap-1 py-2 bg-[#F5F5F0] hover:bg-[#E0E0D0]/50 border border-[#5A5A40]/15 rounded-xl transition-all cursor-pointer"
                >
                  {isLoadingQuick?.includes(tip.title) ? (
                    <div className="w-3 h-3 border-2 border-[#5A5A40] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                  <span>Nghe đọc mẹo này</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
