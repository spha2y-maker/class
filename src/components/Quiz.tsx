import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { CheckCircle2, XCircle, RotateCcw, Award, ChevronRight, ChevronLeft, HelpCircle, BookOpen } from 'lucide-react';
import { playClickSound, playSuccessFanfare } from '../utils/sound';
import confetti from 'canvas-confetti';

export const Quiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [showExplanation, setShowExplanation] = useState<{ [qId: number]: boolean }>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'step' | 'all'>('step');

  const currentQuestion = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (qId: number, optionIdx: number) => {
    playClickSound();
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
    setShowExplanation((prev) => ({ ...prev, [qId]: true }));

    // Check if this was the last question answered
    const totalAnswered = Object.keys({ ...selectedAnswers, [qId]: optionIdx }).length;
    if (totalAnswered === QUIZ_QUESTIONS.length) {
      setIsCompleted(true);
      playSuccessFanfare();
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    }
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const score = calculateScore();
  const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);

  const handleResetQuiz = () => {
    if (confirm('형성평가를 처음부터 다시 푸시겠습니까?')) {
      playClickSound();
      setSelectedAnswers({});
      setShowExplanation({});
      setIsCompleted(false);
      setCurrentIdx(0);
    }
  };

  const handleRetryIncorrect = () => {
    playClickSound();
    const newAnswers = { ...selectedAnswers };
    const newExplanation = { ...showExplanation };
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] !== q.correctAnswer) {
        delete newAnswers[q.id];
        delete newExplanation[q.id];
      }
    });
    setSelectedAnswers(newAnswers);
    setShowExplanation(newExplanation);
    setIsCompleted(false);

    // Jump to first unanswered
    const firstUnanswered = QUIZ_QUESTIONS.findIndex((q) => newAnswers[q.id] === undefined);
    if (firstUnanswered !== -1) setCurrentIdx(firstUnanswered);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
              <span>단원 확인 형성평가</span>
              <span>·</span>
              <span>총 8문항 / 교과서 핵심 개념</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              (2) 청중을 고려하여 자신 있게 말하기 형성평가
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              교과서 본문 및 만화 학습 내용을 바탕으로 핵심 개념을 확인하는 형성평가입니다.
              정답을 선택하면 즉시 정답 여부와 상세한 해설을 확인할 수 있습니다.
            </p>
          </div>

          {/* Mode Switch & Score Status */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('step')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  viewMode === 'step' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                한 문항씩 풀기
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  viewMode === 'all' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                전체 문항 보기
              </button>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              진행: <span className="font-bold text-sky-600 tabular-nums">{Object.keys(selectedAnswers).length}</span> / {QUIZ_QUESTIONS.length} 문항 완료
            </div>
          </div>
        </div>
      </div>

      {/* Completion Score Card (when all answered) */}
      {isCompleted && (
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-600 rounded-3xl p-6 md:p-8 text-white shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                <Award className="w-4 h-4 text-amber-300" />
                형성평가 완료!
              </div>
              <h3 className="text-2xl md:text-3xl font-black">
                {score === QUIZ_QUESTIONS.length
                  ? '🎉 만점입니다! 말하기의 달인이 되었어요!'
                  : score >= 6
                  ? '👏 훌륭해요! 교과서 핵심을 잘 이해했습니다.'
                  : '💪 조금만 더 복습하면 완벽해질 수 있어요!'}
              </h3>
              <p className="text-sm text-emerald-100">
                총 {QUIZ_QUESTIONS.length}문항 중 {score}문항 정답 ({percentage}점)
              </p>
            </div>

            <div className="flex items-center gap-2">
              {score < QUIZ_QUESTIONS.length && (
                <button
                  onClick={handleRetryIncorrect}
                  className="px-4 py-2.5 bg-white text-emerald-700 font-bold text-xs rounded-xl shadow-md hover:bg-emerald-50 transition-colors"
                >
                  틀린 문제 다시 풀기
                </button>
              )}
              <button
                onClick={handleResetQuiz}
                className="px-4 py-2.5 bg-emerald-700/80 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                처음부터 다시
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step View Mode */}
      {viewMode === 'step' && (
        <div className="space-y-6">
          {/* Question Nav Dots */}
          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {QUIZ_QUESTIONS.map((q, idx) => {
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
                const isCurrent = idx === currentIdx;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`w-8 h-8 rounded-xl font-bold text-xs transition-all flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'ring-2 ring-sky-500 bg-sky-600 text-white'
                        : isAnswered
                        ? isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="text-xs font-semibold text-slate-500 tabular-nums">
              문제 {currentIdx + 1} / {QUIZ_QUESTIONS.length}
            </div>
          </div>

          {/* Current Question Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-sky-700 mb-2">
                <span>[문항 {currentIdx + 1}]</span>
                <span>·</span>
                <span>{currentQuestion.textbookRef}</span>
              </div>
              <h3 className="text-lg md:text-xl font-extrabold text-slate-900 leading-snug">
                {currentQuestion.question}
              </h3>
            </div>

            {/* Passage if exists */}
            {currentQuestion.passage && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs md:text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                {currentQuestion.passage}
              </div>
            )}

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === optIdx;
                const hasAnswered = selectedAnswers[currentQuestion.id] !== undefined;
                const isThisCorrect = optIdx === currentQuestion.correctAnswer;

                let stateClass = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300';
                if (hasAnswered) {
                  if (isThisCorrect) {
                    stateClass = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
                  } else if (isSelected) {
                    stateClass = 'bg-rose-50 border-rose-300 text-rose-900 font-semibold';
                  } else {
                    stateClass = 'bg-slate-50/60 border-slate-100 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                    className={`w-full text-left p-4 rounded-2xl border text-xs md:text-sm transition-all flex items-start gap-3.5 ${stateClass}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        hasAnswered && isThisCorrect
                          ? 'bg-emerald-600 text-white'
                          : hasAnswered && isSelected
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {optIdx + 1}
                    </span>
                    <span className="flex-1 leading-relaxed">{option}</span>
                    {hasAnswered && isThisCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    {hasAnswered && isSelected && !isThisCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Box */}
            {showExplanation[currentQuestion.id] && (
              <div
                className={`p-5 rounded-2xl border text-xs md:text-sm leading-relaxed space-y-2 ${
                  selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/80 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer ? (
                    <span className="flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" /> 정답입니다!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-600">
                      <XCircle className="w-4 h-4" /> 다시 생각해 보세요! (정답: {currentQuestion.correctAnswer + 1}번)
                    </span>
                  )}
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" /> {currentQuestion.textbookRef}
                  </span>
                </div>
                <p className="text-slate-700">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Step Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> 이전 문제
              </button>
              <button
                onClick={() => setCurrentIdx((prev) => Math.min(QUIZ_QUESTIONS.length - 1, prev + 1))}
                disabled={currentIdx === QUIZ_QUESTIONS.length - 1}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
              >
                다음 문제 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All View Mode */}
      {viewMode === 'all' && (
        <div className="space-y-6">
          {QUIZ_QUESTIONS.map((q, idx) => {
            const hasAnswered = selectedAnswers[q.id] !== undefined;

            return (
              <div
                key={q.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm space-y-5"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-700 mb-2">
                    <span>[문항 {idx + 1}]</span>
                    <span>·</span>
                    <span>{q.textbookRef}</span>
                  </div>
                  <h3 className="text-base md:text-lg font-extrabold text-slate-900 leading-snug">
                    {q.question}
                  </h3>
                </div>

                {q.passage && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                    {q.passage}
                  </div>
                )}

                <div className="space-y-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[q.id] === optIdx;
                    const isThisCorrect = optIdx === q.correctAnswer;

                    let stateClass = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
                    if (hasAnswered) {
                      if (isThisCorrect) {
                        stateClass = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
                      } else if (isSelected) {
                        stateClass = 'bg-rose-50 border-rose-300 text-rose-900 font-semibold';
                      } else {
                        stateClass = 'bg-slate-50/60 border-slate-100 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full text-left p-3.5 rounded-2xl border text-xs md:text-sm transition-all flex items-start gap-3 ${stateClass}`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                            hasAnswered && isThisCorrect
                              ? 'bg-emerald-600 text-white'
                              : hasAnswered && isSelected
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {optIdx + 1}
                        </span>
                        <span className="flex-1 leading-relaxed">{opt}</span>
                        {hasAnswered && isThisCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                        {hasAnswered && isSelected && !isThisCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {showExplanation[q.id] && (
                  <div
                    className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 ${
                      selectedAnswers[q.id] === q.correctAnswer
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-amber-50/80 border-amber-200 text-amber-950'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold">
                      {selectedAnswers[q.id] === q.correctAnswer ? (
                        <span className="flex items-center gap-1 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 정답!
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-600">
                          <XCircle className="w-3.5 h-3.5" /> 오답 (정답: {q.correctAnswer + 1}번)
                        </span>
                      )}
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600">{q.textbookRef}</span>
                    </div>
                    <p className="text-slate-700">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
