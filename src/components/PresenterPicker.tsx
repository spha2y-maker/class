import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, Shuffle, Users, CheckCircle, Volume2, VolumeX, ListOrdered, Award, Flame } from 'lucide-react';
import { playTickSound, playSuccessFanfare, playClickSound } from '../utils/sound';
import { PresenterHistory } from '../types';

const CHEER_MESSAGES = [
  '작은 실수쯤은 괜찮아! 우리 반 친구들은 모두 너의 편이야!',
  '심호흡 3초(숨 깊게 들이마시고 천천히 내쉬기) 하고 당당하게 출발!',
  '거울 보며 연습했던 멋진 너의 모습을 그대로 보여줘!',
  '친구들과 따뜻하게 눈을 맞추며 또박또박 이야기해 보자!',
  '준비한 만큼 자신 있게! 너의 이야기를 친구들이 기다리고 있어!',
  '청중에게 질문 하나 툭 던지며 여유롭게 시작해 볼까?',
  '긴장되는 건 당연해! 그 떨림을 신나는 열정으로 바꿔보자!',
];

export const PresenterPicker: React.FC = () => {
  const [totalStudents, setTotalStudents] = useState<number>(28);
  const [startNum, setStartNum] = useState<number>(1);
  const [drawCount, setDrawCount] = useState<number>(1);
  const [excludeDrawn, setExcludeDrawn] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Custom student names mapping
  const [useNames, setUseNames] = useState<boolean>(false);
  const [customNamesInput, setCustomNamesInput] = useState<string>('');
  const [studentNames, setStudentNames] = useState<{ [key: number]: string }>({});

  // Drawing state
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [displayNumber, setDisplayNumber] = useState<number | null>(null);
  const [drawnList, setDrawnList] = useState<PresenterHistory[]>([]);
  const [latestDraw, setLatestDraw] = useState<PresenterHistory[] | null>(null);

  // Full order shuffle state
  const [shuffledOrder, setShuffledOrder] = useState<number[] | null>(null);
  const [showShuffleModal, setShowShuffleModal] = useState<boolean>(false);

  const rollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Parse student names if input changes
  useEffect(() => {
    if (!useNames || !customNamesInput.trim()) {
      setStudentNames({});
      return;
    }
    const lines = customNamesInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const mapping: { [key: number]: string } = {};
    lines.forEach((line, idx) => {
      // Support formats like "1. 김철수" or just "김철수"
      const match = line.match(/^(\d+)[.\s-]+(.*)$/);
      if (match) {
        mapping[parseInt(match[1], 10)] = match[2].trim();
      } else {
        mapping[startNum + idx] = line;
      }
    });
    setStudentNames(mapping);
  }, [customNamesInput, useNames, startNum]);

  // Available numbers
  const allNumbers = Array.from({ length: totalStudents }, (_, i) => startNum + i);
  const drawnNumbersSet = new Set(drawnList.map((d) => d.number));
  const availableNumbers = excludeDrawn ? allNumbers.filter((n) => !drawnNumbersSet.has(n)) : allNumbers;

  // Cleanup rolling timer on unmount
  useEffect(() => {
    return () => {
      if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
    };
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0284c7', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
    });
  };

  const handleStartDraw = () => {
    if (availableNumbers.length === 0) {
      alert('모든 번호가 이미 뽑혔습니다! 초기화 후 다시 진행해 주세요.');
      return;
    }

    if (soundEnabled) playClickSound();
    setIsRolling(true);
    setLatestDraw(null);

    const needed = Math.min(drawCount, availableNumbers.length);
    const duration = 2200; // 2.2 seconds animation
    const startTime = Date.now();

    // Fast rolling animation
    rollIntervalRef.current = setInterval(() => {
      const randomCandidate = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
      setDisplayNumber(randomCandidate);
      if (soundEnabled) playTickSound();

      if (Date.now() - startTime >= duration) {
        if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);

        // Pick 'needed' distinct numbers
        const pool = [...availableNumbers];
        const selectedNums: number[] = [];
        for (let i = 0; i < needed; i++) {
          const randIdx = Math.floor(Math.random() * pool.length);
          selectedNums.push(pool[randIdx]);
          pool.splice(randIdx, 1);
        }

        const newRecords: PresenterHistory[] = selectedNums.map((num) => ({
          id: `${num}-${Date.now()}-${Math.random()}`,
          number: num,
          name: studentNames[num],
          time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          cheerMessage: CHEER_MESSAGES[Math.floor(Math.random() * CHEER_MESSAGES.length)],
        }));

        setDisplayNumber(selectedNums[0]);
        setLatestDraw(newRecords);
        setDrawnList((prev) => [...newRecords, ...prev]);
        setIsRolling(false);

        if (soundEnabled) playSuccessFanfare();
        triggerConfetti();
      }
    }, 80);
  };

  const handleReset = () => {
    if (confirm('뽑기 기록을 모두 초기화하시겠습니까?')) {
      if (soundEnabled) playClickSound();
      setDrawnList([]);
      setLatestDraw(null);
      setDisplayNumber(null);
    }
  };

  const handleShuffleAll = () => {
    if (soundEnabled) playClickSound();
    const shuffled = [...allNumbers].sort(() => Math.random() - 0.5);
    setShuffledOrder(shuffled);
    setShowShuffleModal(true);
    triggerConfetti();
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Heading */}
      <div className="bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center pointer-events-none">
          <Sparkles className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-sky-100 text-xs font-semibold mb-2">
            <span>중3 국어 발표 활동 지원 도구</span>
            <span>·</span>
            <span>공정하고 신나는 발표자 추첨</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            자신감 충전! 오늘의 행운 발표자 뽑기
          </h2>
          <p className="mt-2 text-sky-50 text-sm md:text-base leading-relaxed">
            반 인원수를 입력하고 버튼을 누르면 두근두근 랜덤으로 발표자를 선정합니다.
            발표자에게 전하는 따뜻한 응원 메시지와 발표 미션도 함께 확인해 보세요!
          </p>
        </div>
      </div>

      {/* Main Grid: Controls & Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Settings Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-600" />
              학급 인원 및 뽑기 설정
            </h3>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-sky-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
            </button>
          </div>

          {/* Setting 1: Total Students & Range */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                우리 반 총 인원 (학생 수)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={2}
                  max={60}
                  value={totalStudents}
                  disabled={isRolling}
                  onChange={(e) => setTotalStudents(Math.max(2, Math.min(60, parseInt(e.target.value) || 2)))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
                <span className="text-slate-500 font-medium whitespace-nowrap">명</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                {[20, 24, 25, 28, 30, 32].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setTotalStudents(cnt)}
                    disabled={isRolling}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                      totalStudents === cnt
                        ? 'bg-sky-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cnt}명
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">시작 번호</label>
                <input
                  type="number"
                  min={1}
                  value={startNum}
                  disabled={isRolling}
                  onChange={(e) => setStartNum(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">끝 번호 (자동)</label>
                <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-bold tabular-nums">
                  {startNum + totalStudents - 1}번
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">한 번에 뽑을 인원</label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => setDrawCount(n)}
                    disabled={isRolling}
                    className={`py-2 text-xs font-bold rounded-xl transition-all ${
                      drawCount === n
                        ? 'bg-sky-500 text-white shadow-sm ring-2 ring-sky-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {n}명
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle: Exclude Already Drawn */}
            <div className="flex items-center justify-between p-3 bg-sky-50/70 border border-sky-100 rounded-xl">
              <div>
                <div className="text-xs font-bold text-sky-950">중복 당첨 방지</div>
                <div className="text-[11px] text-sky-700">이미 뽑힌 학생은 다음 추첨에서 자동 제외</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={excludeDrawn}
                  disabled={isRolling}
                  onChange={(e) => setExcludeDrawn(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
              </label>
            </div>

            {/* Toggle: Custom Names */}
            <div className="pt-1">
              <button
                onClick={() => setUseNames(!useNames)}
                className="text-xs font-semibold text-sky-700 hover:text-sky-800 underline flex items-center gap-1"
              >
                {useNames ? '▼ 학생 명단 직접 입력 닫기' : '▶ 학생 이름도 함께 등록하기 (선택)'}
              </button>

              {useNames && (
                <div className="mt-2 space-y-2">
                  <textarea
                    rows={4}
                    value={customNamesInput}
                    placeholder="학생 이름을 줄바꿈하여 순서대로 입력하세요.&#10;예:&#10;김민준&#10;이서연&#10;박도윤"
                    onChange={(e) => setCustomNamesInput(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white font-mono"
                  />
                  <p className="text-[11px] text-slate-500">
                    * 등록된 이름은 추첨 시 번호와 함께 화면에 나타납니다.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Status Bar */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs font-medium text-slate-600">
            <div>
              전체 <span className="font-bold text-slate-900 tabular-nums">{totalStudents}</span>명 중
            </div>
            <div>
              뽑힌 인원: <span className="font-bold text-emerald-600 tabular-nums">{drawnList.length}</span>명
            </div>
            <div>
              남은 후보: <span className="font-bold text-sky-600 tabular-nums">{availableNumbers.length}</span>명
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleShuffleAll}
              disabled={isRolling}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Shuffle className="w-4 h-4 text-slate-600" />
              전체 발표 순서표 일괄 생성 (랜덤 셔플)
            </button>
            {drawnList.length > 0 && (
              <button
                onClick={handleReset}
                disabled={isRolling}
                className="w-full py-2 px-3 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                뽑기 기록 초기화
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Draw Stage & Lucky Card (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Stage Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-sky-100/50 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-100/50 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-sky-50 text-sky-700 border border-sky-100 rounded-full text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>행운의 발표자 추첨 스테이지</span>
              </div>

              {/* Number Rolling Display Box */}
              <div className="py-8 flex flex-col items-center justify-center">
                <div
                  className={`w-48 h-48 md:w-56 md:h-56 rounded-3xl flex flex-col items-center justify-center border-4 shadow-xl transition-all duration-200 ${
                    isRolling
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 scale-105 text-white animate-pulse'
                      : latestDraw
                      ? 'bg-gradient-to-br from-sky-500 to-indigo-600 border-sky-300 text-white shadow-sky-200'
                      : 'bg-slate-50 border-dashed border-slate-200 text-slate-400'
                  }`}
                >
                  {isRolling ? (
                    <div className="text-center">
                      <div className="text-6xl md:text-7xl font-black tabular-nums tracking-tighter">
                        {displayNumber ?? '...'}
                      </div>
                      <div className="text-xs font-bold tracking-widest mt-2 uppercase opacity-90 animate-bounce">
                        추첨 중!
                      </div>
                    </div>
                  ) : latestDraw ? (
                    <div className="text-center px-4">
                      <div className="text-xs font-semibold text-sky-200 mb-1">
                        {latestDraw.length > 1 ? `선택된 ${latestDraw.length}명 중 1번째` : '당첨 번호'}
                      </div>
                      <div className="text-6xl md:text-7xl font-black tabular-nums tracking-tight">
                        {latestDraw[0].number}
                        <span className="text-2xl font-bold ml-1">번</span>
                      </div>
                      {latestDraw[0].name && (
                        <div className="mt-1 text-lg font-bold text-amber-300 truncate max-w-[180px]">
                          {latestDraw[0].name}
                        </div>
                      )}
                      <div className="mt-2 inline-flex items-center gap-1 text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full font-medium">
                        <Award className="w-3 h-3 text-amber-300" /> 오늘의 발표자
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                      <div className="text-sm font-semibold text-slate-500">발표자 뽑기 대기 중</div>
                      <div className="text-xs text-slate-400 mt-1">아래 버튼을 눌러주세요</div>
                    </div>
                  )}
                </div>

                {/* Multiple winners display if drawCount > 1 */}
                {!isRolling && latestDraw && latestDraw.length > 1 && (
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    {latestDraw.map((record, idx) => (
                      <div
                        key={record.id}
                        className="px-4 py-2 bg-sky-50 border border-sky-200 rounded-xl text-slate-800 font-bold text-sm shadow-sm flex items-center gap-2"
                      >
                        <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span>{record.number}번</span>
                        {record.name && <span className="text-sky-700">({record.name})</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Main Draw Button */}
              <div className="max-w-md mx-auto">
                <button
                  onClick={handleStartDraw}
                  disabled={isRolling || availableNumbers.length === 0}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-lg shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-3 ${
                    isRolling
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                      : availableNumbers.length === 0
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white shadow-sky-500/25 hover:shadow-sky-500/40'
                  }`}
                >
                  <Sparkles className="w-6 h-6 animate-spin text-amber-300" style={{ animationDuration: '3s' }} />
                  <span>
                    {isRolling
                      ? '두근두근 발표자 뽑는 중...'
                      : availableNumbers.length === 0
                      ? '모든 학생이 뽑혔습니다'
                      : `행운의 발표자 뽑기 (${drawCount}명)`}
                  </span>
                </button>
              </div>

              {/* Cheer Mission Card */}
              {latestDraw && (
                <div className="mt-6 p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl text-left shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>발표자를 위한 자신감 응원 메시지</span>
                  </div>
                  <p className="text-slate-800 font-medium text-sm leading-relaxed">
                    &ldquo;{latestDraw[0].cheerMessage}&rdquo;
                  </p>
                  <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs text-amber-700">
                    <span className="font-semibold">발표 팁: 심호흡 3번하고 친구들의 눈을 바라보세요!</span>
                    <span className="tabular-nums text-[11px] opacity-75">{latestDraw[0].time}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* History List */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                뽑힌 학생 명단 ({drawnList.length}명)
              </h3>
              {drawnList.length > 0 && (
                <span className="text-xs text-slate-400">최근 순서대로 표시</span>
              )}
            </div>

            {drawnList.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                아직 추첨된 학생이 없습니다. 상단의 뽑기 버튼을 눌러주세요!
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                {drawnList.map((item, idx) => (
                  <div
                    key={item.id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:border-sky-300 transition-colors"
                  >
                    <span className="text-slate-400 tabular-nums">#{drawnList.length - idx}</span>
                    <span className="font-bold text-sky-700">{item.number}번</span>
                    {item.name && <span className="text-slate-800">{item.name}</span>}
                    <span className="text-[10px] text-slate-400 tabular-nums">{item.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shuffled Order Modal */}
      {showShuffleModal && shuffledOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <ListOrdered className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">우리 반 발표 순서표 (랜덤 셔플)</h3>
                  <p className="text-xs text-slate-500">총 {shuffledOrder.length}명의 발표 순서가 정해졌습니다.</p>
                </div>
              </div>
              <button
                onClick={() => setShowShuffleModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold p-2 rounded-lg"
              >
                닫기
              </button>
            </div>

            <div className="overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 p-1">
              {shuffledOrder.map((num, idx) => (
                <div
                  key={num}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-sky-600 tabular-nums">{idx + 1}번째</span>
                  <span className="text-sm font-extrabold text-slate-800 tabular-nums">
                    {num}번
                    {studentNames[num] && (
                      <span className="block text-[11px] font-normal text-slate-500 truncate max-w-[80px]">
                        {studentNames[num]}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handleShuffleAll}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Shuffle className="w-4 h-4" />
                다시 섞기
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const text = shuffledOrder
                      .map((num, idx) => `${idx + 1}번째: ${num}번 ${studentNames[num] ? `(${studentNames[num]})` : ''}`)
                      .join('\n');
                    navigator.clipboard.writeText(text);
                    alert('발표 순서가 클립보드에 복사되었습니다!');
                  }}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  순서 복사하기
                </button>
                <button
                  onClick={() => setShowShuffleModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
