import React, { useState } from 'react';
import { Video, BookOpen, Download, Printer, CheckCircle, Sparkles, Send } from 'lucide-react';
import { playClickSound, playSuccessFanfare } from '../utils/sound';
import confetti from 'canvas-confetti';

export const TextbookActivities: React.FC = () => {
  // Activity 1: Video Plan Sheet
  const [videoTarget, setVideoTarget] = useState<string>('친구들');
  const [videoTitle, setVideoTitle] = useState<string>('우리 반과 함께한 빛나는 추억들');
  const [videoMessage, setVideoMessage] = useState<string>('3년 동안 함께 울고 웃었던 소중한 시간들, 고마웠어!');
  const [visualProps, setVisualProps] = useState<string>('수학여행 사진, 학급 롤링페이퍼, 졸업 앨범');

  // Activity 2: Alfred's story reflection
  const [alfredAnswers, setAlfredAnswers] = useState<{ [key: string]: string }>({
    q1: '',
    q2: '',
  });
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSavePlan = () => {
    playSuccessFanfare();
    confetti({ particleCount: 70, spread: 60 });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePrintPlan = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
            <span>교과서 단원 실천 활동</span>
            <span>·</span>
            <span>생활 속에서 실천하기 & 더 읽어 보기</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            실천 활동: 졸업 영상 기획 & 발표 공포 동화 읽기
          </h2>
          <p className="text-slate-600 text-sm mt-1 leading-relaxed">
            교과서 193쪽의 모둠 졸업 영상 말하기 기획서와 199쪽의 동화 &lt;발표하기 무서워요!&gt;를 탐구해 보세요.
          </p>
        </div>
      </div>

      {/* Grid: 2 Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Activity 1: Graduation Video Speech Planner (교과서 193쪽) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-indigo-600">교과서 193쪽 생활 속 실천</span>
              <h3 className="text-lg font-bold text-slate-900">졸업 영상 말하기 기획서</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                전하고 싶은 청중 (대상)
              </label>
              <select
                value={videoTarget}
                onChange={(e) => setVideoTarget(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500"
              >
                <option value="친구들">같은 반 친구들 (동고동락한 친구들에게)</option>
                <option value="선생님">선생님 (사랑과 가르침을 주신 선생님께)</option>
                <option value="후배들">1, 2학년 후배들 (앞으로 학교를 빛낼 후배들에게)</option>
                <option value="부모님">부모님 (항상 곁에서 응원해 주신 부모님께)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">영상 발표 제목</label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                청중에게 꼭 전하고 싶은 핵심 말 (발표 원고 요약)
              </label>
              <textarea
                rows={3}
                value={videoMessage}
                onChange={(e) => setVideoMessage(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                활용할 시각 자료 및 배경 음악 / 효과
              </label>
              <input
                type="text"
                value={visualProps}
                onChange={(e) => setVisualProps(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={handleSavePlan}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              기획서 저장하기
            </button>
            <button
              onClick={handlePrintPlan}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              인쇄하기
            </button>
          </div>

          {isSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2 animate-fade-in">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              졸업 영상 말하기 기획서가 성공적으로 저장되었습니다!
            </div>
          )}
        </div>

        {/* Activity 2: Story Reading: Alfred's story (교과서 199쪽) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-600">교과서 199쪽 더 읽어 보기</span>
              <h3 className="text-lg font-bold text-slate-900">&lt;발표하기 무서워요!&gt; (미나 뤼스타)</h3>
            </div>
          </div>

          {/* Story Snippet */}
          <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl text-xs text-slate-700 leading-relaxed space-y-2">
            <p className="italic font-serif">
              &ldquo;알프레드는 안절부절못했어요. 길을 걸어갈 때도 넘어질까 봐 조마조마했고 버스를 탈 때도 겁이 났죠.
              특히 친구들 앞에서 큰 소리로 발표하는 것을 그 무엇보다도 무서워했어요.
              다행히 알프레드는 긴 앞머리가 있어서 긴장될 때면 앞머리 뒤에 숨곤 했답니다...&rdquo;
            </p>
            <div className="text-[11px] text-amber-800 font-semibold pt-1">
              — 발표가 두려워 앞머리 뒤로 숨던 알프레드가 두려움을 극복해 나가는 감동적인 이야기
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">
                Q1. 알프레드가 앞머리 뒤로 숨었던 까닭은 무엇일까요?
              </label>
              <input
                type="text"
                placeholder="예: 친구들 앞에서 발표하는 것이 너무 두렵고 긴장되었기 때문에"
                value={alfredAnswers.q1}
                onChange={(e) => setAlfredAnswers({ ...alfredAnswers, q1: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">
                Q2. 내가 만약 알프레드의 짝이라면 알프레드에게 어떤 따뜻한 격려를 해 줄 수 있을까요?
              </label>
              <textarea
                rows={3}
                placeholder="예: '알프레드야, 실수해도 괜찮아! 내가 네 말을 제일 집중해서 들어줄게, 파이팅!'"
                value={alfredAnswers.q2}
                onChange={(e) => setAlfredAnswers({ ...alfredAnswers, q2: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>
          </div>

          <button
            onClick={() => {
              playSuccessFanfare();
              alert('성찰 답변이 기록되었습니다! 따뜻한 공감 능력이 돋보여요.');
            }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            동화 읽기 생각 제출하기
          </button>
        </div>
      </div>
    </div>
  );
};
