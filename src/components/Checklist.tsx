import React, { useState, useEffect } from 'react';
import { CHECKLIST_SECTIONS } from '../data/checklistData';
import { CheckCircle2, Circle, RotateCcw, Copy, Printer, Award, Lightbulb, Star, MessageSquare } from 'lucide-react';
import { playClickSound, playSuccessFanfare } from '../utils/sound';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'speech_confidence_checklist_v1';
const REFLECTION_STORAGE_KEY = 'speech_confidence_reflection_v1';

export const Checklist: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<{ [id: string]: boolean }>({});
  const [expandedSections, setExpandedSections] = useState<{ [id: string]: boolean }>({
    stage_1_prep: true,
    stage_2_anxiety: true,
    stage_3_presentation: true,
    stage_4_reflection: true,
  });

  // Self-reflection ratings (1-5 stars)
  const [interestRating, setInterestRating] = useState<number>(5);
  const [focusRating, setFocusRating] = useState<number>(5);
  const [participationRating, setParticipationRating] = useState<number>(5);
  const [peerPraise, setPeerPraise] = useState<string>('');
  const [learningDiary, setLearningDiary] = useState<string>('');

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCheckedItems(JSON.parse(saved));
      }
      const savedReflection = localStorage.getItem(REFLECTION_STORAGE_KEY);
      if (savedReflection) {
        const data = JSON.parse(savedReflection);
        if (data.interestRating) setInterestRating(data.interestRating);
        if (data.focusRating) setFocusRating(data.focusRating);
        if (data.participationRating) setParticipationRating(data.participationRating);
        if (data.peerPraise) setPeerPraise(data.peerPraise);
        if (data.learningDiary) setLearningDiary(data.learningDiary);
      }
    } catch {
      // LocalStorage error handled
    }
  }, []);

  // Save to localStorage
  const saveChecklist = (newChecked: { [id: string]: boolean }) => {
    setCheckedItems(newChecked);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newChecked));
    } catch {
      // ignore
    }
  };

  const saveReflections = () => {
    try {
      localStorage.setItem(
        REFLECTION_STORAGE_KEY,
        JSON.stringify({ interestRating, focusRating, participationRating, peerPraise, learningDiary })
      );
    } catch {
      // ignore
    }
  };

  const totalItemsCount = CHECKLIST_SECTIONS.reduce((acc, sec) => acc + sec.items.length, 0);
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalItemsCount) * 100);

  const toggleItem = (id: string) => {
    playClickSound();
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    saveChecklist(updated);

    const newCompleted = Object.values(updated).filter(Boolean).length;
    if (newCompleted === totalItemsCount) {
      playSuccessFanfare();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }
  };

  const toggleSection = (secId: string) => {
    setExpandedSections((prev) => ({ ...prev, [secId]: !prev[secId] }));
  };

  const handleReset = () => {
    if (confirm('체크리스트를 초기화하시겠습니까?')) {
      playClickSound();
      saveChecklist({});
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyReport = () => {
    const lines = [
      '📋 [중3 국어] (2) 청중을 고려하여 자신 있게 말하기 - 발표 점검표',
      `달성률: ${progressPercent}% (${completedCount}/${totalItemsCount}항목 완료)`,
      '',
    ];

    CHECKLIST_SECTIONS.forEach((sec) => {
      lines.push(`[${sec.step}: ${sec.title}]`);
      sec.items.forEach((item) => {
        lines.push(`${checkedItems[item.id] ? '✅' : '⬜'} ${item.text}`);
      });
      lines.push('');
    });

    if (peerPraise) {
      lines.push(`💬 짝에게 보내는 칭찬: ${peerPraise}`);
    }
    if (learningDiary) {
      lines.push(`📝 나의 학습 일기: ${learningDiary}`);
    }

    navigator.clipboard.writeText(lines.join('\n'));
    alert('체크리스트 점검 결과가 클립보드에 복사되었습니다!');
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <span>발표 자가 점검표</span>
              <span>·</span>
              <span>교과서 186~192쪽 연계</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              청중을 고려한 자신 있는 말하기 체크리스트
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              발표를 준비하는 단계부터 실전 발표, 그리고 발표 후 자기 평가까지 꼼꼼하게 점검해 보세요.
              각 항목을 클릭하여 스스로 달성 여부를 체크할 수 있습니다.
            </p>
          </div>

          {/* Progress Gauge Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 min-w-[240px] text-center shadow-inner">
            <div className="text-xs font-semibold text-slate-500 mb-1">발표 점검 달성률</div>
            <div className="text-4xl font-black text-sky-600 tabular-nums">
              {progressPercent}
              <span className="text-xl font-bold ml-0.5">%</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 tabular-nums">
              총 <span className="font-bold text-slate-700">{totalItemsCount}</span>개 중{' '}
              <span className="font-bold text-emerald-600">{completedCount}</span>개 완료
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-5 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyReport}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5 text-slate-600" />
              점검표 텍스트 복사
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              점검표 인쇄하기
            </button>
          </div>
          <button
            onClick={handleReset}
            className="px-3 py-2 text-rose-600 hover:bg-rose-50 font-semibold rounded-xl transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            초기화
          </button>
        </div>
      </div>

      {/* Checklist Sections */}
      <div className="space-y-6">
        {CHECKLIST_SECTIONS.map((section) => {
          const sectionItems = section.items;
          const sectionCompleted = sectionItems.filter((item) => checkedItems[item.id]).length;
          const isAllCompleted = sectionCompleted === sectionItems.length;

          return (
            <div
              key={section.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                isAllCompleted ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-slate-200/90'
              }`}
            >
              {/* Section Header */}
              <div
                onClick={() => toggleSection(section.id)}
                className="p-5 md:p-6 bg-slate-50/80 cursor-pointer flex items-center justify-between hover:bg-slate-100/70 transition-colors border-b border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-xs font-bold rounded-lg">
                    {section.step}
                  </span>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2">
                      {section.title}
                      {isAllCompleted && (
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-semibold">
                          완료
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{section.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 tabular-nums">
                    {sectionCompleted}/{sectionItems.length}
                  </span>
                  <span className="text-slate-400 text-sm">{expandedSections[section.id] ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Items List */}
              {expandedSections[section.id] && (
                <div className="divide-y divide-slate-100 p-2 md:p-4">
                  {sectionItems.map((item) => {
                    const isChecked = !!checkedItems[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`p-3.5 md:p-4 rounded-xl cursor-pointer transition-all flex items-start gap-3.5 ${
                          isChecked ? 'bg-emerald-50/50 hover:bg-emerald-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <button
                          type="button"
                          className="mt-0.5 shrink-0 focus:outline-none"
                          aria-label={isChecked ? '완료 취소' : '완료 체크'}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                          )}
                        </button>
                        <div className="flex-1 space-y-1">
                          <div
                            className={`text-sm font-semibold transition-colors ${
                              isChecked ? 'text-slate-800 line-through opacity-85' : 'text-slate-800'
                            }`}
                          >
                            {item.text}
                          </div>
                          {item.tip && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span>{item.tip}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Self-Reflection & Peer Feedback (교과서 192~199쪽 연계) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
            <span>교과서 192쪽 & 199쪽 활동</span>
            <span>·</span>
            <span>나의 학습 태도 및 동료 칭찬</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            발표 후 나의 학습 태도 돌아보기 & 짝 칭찬하기
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            자신의 수업 참여 태도를 스스로 평가해 보고, 함께 활동한 짝에게 전할 따뜻한 칭찬 메시지를 남겨보세요.
          </p>
        </div>

        {/* 3 Metrics: 흥미도, 집중도, 참여도 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>수업 흥미도</span>
              <span className="text-sky-600">{interestRating}점</span>
            </div>
            <div className="flex items-center gap-1 justify-center py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setInterestRating(star);
                    saveReflections();
                  }}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= interestRating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 text-center">주제에 얼마나 흥미를 가졌나요?</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>발표 집중도</span>
              <span className="text-sky-600">{focusRating}점</span>
            </div>
            <div className="flex items-center gap-1 justify-center py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setFocusRating(star);
                    saveReflections();
                  }}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= focusRating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 text-center">친구들의 말에 귀 기울였나요?</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>모둠 참여도</span>
              <span className="text-sky-600">{participationRating}점</span>
            </div>
            <div className="flex items-center gap-1 justify-center py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setParticipationRating(star);
                    saveReflections();
                  }}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= participationRating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 text-center">적극적으로 소통에 참여했나요?</p>
          </div>
        </div>

        {/* Text Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-sky-600" />
              짝의 발표를 떠올리며 잘한 점 칭찬하기 (상호 피드백)
            </label>
            <textarea
              rows={3}
              value={peerPraise}
              onChange={(e) => {
                setPeerPraise(e.target.value);
                saveReflections();
              }}
              placeholder="예: 또박또박한 목소리로 말해서 끝까지 잘 들렸어! 시각 자료 사진이 이해하기 쉬워서 정말 좋았어."
              className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              나의 학습 일기 (새롭게 배운 점과 앞으로의 다짐)
            </label>
            <textarea
              rows={3}
              value={learningDiary}
              onChange={(e) => {
                setLearningDiary(e.target.value);
                saveReflections();
              }}
              placeholder="예: 발표할 때 긴장되는 건 자연스러운 일이라는 것을 배웠다. 앞으로는 심호흡을 하고 '실수해도 괜찮다'는 마음으로 자신 있게 말해야겠다."
              className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
