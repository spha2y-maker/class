import React, { useState, useEffect } from 'react';
import { UNIT_INFO, COMIC_SCENES, CORE_CONCEPTS, WORD_QUIZ_DATA } from '../data/lessonData';
import { BookOpen, Users, HeartHandshake, Smile, Sparkles, Check, Play, Pause, RotateCcw, Volume2, ArrowRight } from 'lucide-react';
import { playClickSound, playSuccessFanfare } from '../utils/sound';

export const ConceptViewer: React.FC<{ onNavigateToPicker: () => void; onNavigateToChecklist: () => void }> = ({
  onNavigateToPicker,
  onNavigateToChecklist,
}) => {
  const [activeComicScene, setActiveComicScene] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'comic' | 'audience' | 'anxiety' | 'breathing' | 'words'>('comic');

  // Breathing Trainer State
  const [isBreathing, setIsBreathing] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathTimer, setBreathTimer] = useState<number>(4);
  const [breathCycles, setBreathCycles] = useState<number>(0);

  // Word quiz state
  const [wordAnswers, setWordAnswers] = useState<{ [idx: number]: string }>({});

  // Breathing timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            if (breathPhase === 'inhale') {
              setBreathPhase('hold');
              return 4;
            } else if (breathPhase === 'hold') {
              setBreathPhase('exhale');
              return 4;
            } else {
              setBreathPhase('inhale');
              setBreathCycles((c) => c + 1);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathing, breathPhase]);

  const toggleBreathing = () => {
    playClickSound();
    setIsBreathing(!isBreathing);
  };

  const resetBreathing = () => {
    playClickSound();
    setIsBreathing(false);
    setBreathPhase('inhale');
    setBreathTimer(4);
    setBreathCycles(0);
  };

  const handleWordSelect = (qIdx: number, selected: string) => {
    playClickSound();
    setWordAnswers((prev) => ({ ...prev, [qIdx]: selected }));
    if (selected === WORD_QUIZ_DATA[qIdx].correct) {
      playSuccessFanfare();
    }
  };

  return (
    <div className="space-y-10">
      {/* Hero Visual Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Text / Overview */}
          <div className="lg:col-span-7 p-6 md:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-700">
                <span>{UNIT_INFO.grade}</span>
                <span>·</span>
                <span>{UNIT_INFO.unitTitle}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                (2) 청중을 고려하여
                <br />
                <span className="text-sky-600">자신 있게 말하기</span>
              </h1>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                발표는 혼자서 외치는 것이 아니라 듣는 사람(청중)과 마음을 나누는 소통입니다.
                청중의 관심사와 눈높이를 배려하고, 자연스러운 말하기 불안을 당당하게 극복하는 방법을 함께 배워봅시다.
              </p>
            </div>

            {/* Learning Goals */}
            <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-sky-600" />
                단원 핵심 학습 목표
              </div>
              <ul className="text-xs md:text-sm text-slate-700 space-y-1 pl-1">
                {UNIT_INFO.goals.map((goal, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-sky-500 font-bold">✓</span>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onNavigateToChecklist}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs md:text-sm font-bold rounded-xl transition-colors shadow-sm shadow-sky-500/20 flex items-center gap-2"
              >
                <span>발표 체크리스트 점검</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onNavigateToPicker}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs md:text-sm font-bold rounded-xl transition-colors flex items-center gap-2"
              >
                <span>발표자 랜덤 뽑기</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </button>
            </div>
          </div>

          {/* Right Image Canvas */}
          <div className="lg:col-span-5 relative bg-slate-100 min-h-[280px] lg:min-h-full">
            <img
              src="/src/assets/images/hero_speaking_confidence_1792671599264.jpg"
              alt="발표를 자신 있게 하는 교실 풍경"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                // styled fallback if image fails
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>

      {/* Concept Segmented Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-fit mx-auto border border-slate-200/70">
        <button
          onClick={() => setActiveTab('comic')}
          className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition-all ${
            activeTab === 'comic' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📖 연우의 말하기 만화 스토리
        </button>
        <button
          onClick={() => setActiveTab('audience')}
          className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition-all ${
            activeTab === 'audience' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          👥 청중 고려 4대 요소
        </button>
        <button
          onClick={() => setActiveTab('anxiety')}
          className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition-all ${
            activeTab === 'anxiety' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          💪 말하기 불안 대처법
        </button>
        <button
          onClick={() => setActiveTab('breathing')}
          className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition-all ${
            activeTab === 'breathing' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🌬️ 실전 심호흡 트레이너
        </button>
        <button
          onClick={() => setActiveTab('words')}
          className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition-all ${
            activeTab === 'words' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          💬 우리말 톡톡 낱말 퀴즈
        </button>
      </div>

      {/* TAB 1: COMIC SCENES */}
      {activeTab === 'comic' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-sky-600">교과서 182~185쪽 본문 만화 재구성</span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  말하기의 달인이 되기까지: 연우의 발표 성장기
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                {COMIC_SCENES.map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => setActiveComicScene(scene.id)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                      activeComicScene === scene.id
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {scene.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Scene Presentation */}
            {(() => {
              const currentScene = COMIC_SCENES.find((s) => s.id === activeComicScene) || COMIC_SCENES[0];
              return (
                <div className="mt-6 space-y-6">
                  <div className="p-6 bg-gradient-to-br from-slate-50 to-sky-50/50 rounded-2xl border border-slate-200/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-bold rounded-lg">
                        {currentScene.stage}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">화자: {currentScene.speaker}</span>
                    </div>

                    <h4 className="text-xl font-bold text-slate-900">{currentScene.title}</h4>

                    <div className="p-4 bg-white rounded-xl border border-slate-200/60 shadow-xs space-y-2">
                      <div className="text-xs font-bold text-slate-500">대화 및 상황:</div>
                      <p className="text-slate-800 text-sm md:text-base leading-relaxed font-medium whitespace-pre-line">
                        {currentScene.dialogue}
                      </p>
                    </div>

                    {currentScene.thought && (
                      <div className="p-3.5 bg-amber-50/80 border border-amber-200/70 rounded-xl text-xs text-amber-900 space-y-1">
                        <span className="font-bold">💡 연우의 마음속 생각:</span>
                        <p>{currentScene.thought}</p>
                      </div>
                    )}

                    <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/70 rounded-xl text-xs text-emerald-900 space-y-1">
                      <span className="font-bold">🎯 교과서 핵심 포인트:</span>
                      <p>{currentScene.tip}</p>
                    </div>
                  </div>

                  {/* Navigation Footer */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setActiveComicScene((p) => Math.max(1, p - 1))}
                      disabled={activeComicScene === 1}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                    >
                      ◀ 이전 장면
                    </button>
                    <span className="text-xs text-slate-400 tabular-nums">
                      {activeComicScene} / {COMIC_SCENES.length} 장면
                    </span>
                    <button
                      onClick={() => setActiveComicScene((p) => Math.min(COMIC_SCENES.length, p + 1))}
                      disabled={activeComicScene === COMIC_SCENES.length}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      다음 장면 ▶
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* TAB 2: AUDIENCE FACTORS */}
      {activeTab === 'audience' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm">
            <div className="max-w-2xl">
              <span className="text-xs font-bold text-sky-600">교과서 187쪽 핵심 개념</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                청중을 고려하여 말할 때 꼭 챙겨야 할 4가지
              </h3>
              <p className="text-xs md:text-sm text-slate-600 mt-1 leading-relaxed">
                말하는 이와 듣는 이의 마음이 연결될 때 최고의 발표가 완성됩니다.
                다음 네 가지 요소를 항상 점검해 보세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {CORE_CONCEPTS[0].points.map((pt, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition-colors space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-sky-500 text-white font-bold text-xs flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{pt.title}</h4>
                  </div>
                  <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                    {pt.content}
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-slate-100 text-xs text-sky-800">
                    <span className="font-bold">실천 팁:</span> {pt.example}
                  </div>
                </div>
              ))}
            </div>

            {/* In-presentation audience reaction tip */}
            <div className="mt-6 p-5 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-900 mb-1.5">
                <Users className="w-4 h-4 text-sky-600" />
                <span>말하는 동안 청중의 반응 살피기 요령</span>
              </div>
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                발표 중 청중에게 질문을 던졌다면 <strong>1~2초간 호응을 기다려 주세요.</strong> 청중이 고개를 갸우뚱거리거나 지루해하는 기색이 보이면
                어려운 개념을 친근한 사물(예: 머리카락 굵기)과 비교하거나, 말의 빠르기와 분량을 알맞게 조절하세요!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SPEECH ANXIETY */}
      {activeTab === 'anxiety' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm space-y-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold text-sky-600">교과서 188~189쪽 핵심 개념</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                말하기 불안(Speech Anxiety) 왜 생기고 어떻게 대처할까?
              </h3>
              <p className="text-xs md:text-sm text-slate-600 mt-1 leading-relaxed">
                여러 사람 앞에서 떨리는 것은 너무나 자연스러운 현상입니다. 두려워하지 말고 과학적이고 효과적인 방법으로 극복해 보세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Causes */}
              <div className="p-5 bg-rose-50/50 border border-rose-100 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
                  <span>❓ 말하기 불안이 생기는 주요 원인</span>
                </h4>
                <ul className="text-xs md:text-sm text-slate-700 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>말할 내용을 충분히 준비하지 못했거나 확신이 부족할 때</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>공식적인 발표 환경이나 많은 청중 앞에서 말한 경험이 적을 때</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>&ldquo;실수 없이 완벽하게 잘해야만 한다&rdquo;는 과도한 부담감을 가질 때</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>청중이 내 말을 부정적으로 평가하거나 비웃을까 봐 걱정될 때</span>
                  </li>
                </ul>
              </div>

              {/* Overcoming 5 steps */}
              <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                  <span>✨ 말하기 불안을 이겨내는 5대 비법</span>
                </h4>
                <ul className="text-xs md:text-sm text-slate-700 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">1.</span>
                    <span><strong>긍정적 사고:</strong> &ldquo;작은 실수는 괜찮아! 나는 잘 해낼 거야!&rdquo;</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">2.</span>
                    <span><strong>실전 연습:</strong> 거울을 보고 소리 내어 말하며 발표 시간 측정하기</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">3.</span>
                    <span><strong>메모 카드:</strong> 핵심 단어와 순서가 적힌 작은 메모지 지참하기</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">4.</span>
                    <span><strong>심호흡 & 스트레칭:</strong> 깊은 들숨-날숨과 어깨·목 가벼운 체조</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">5.</span>
                    <span><strong>청중의 배려:</strong> 듣는 친구들의 따뜻한 끄덕임과 격려의 박수</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Audience Role Callout */}
            <div className="p-5 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-3">
              <HeartHandshake className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs md:text-sm text-slate-800">
                <div className="font-bold text-amber-900">발표를 함께 만드는 청중의 따뜻한 역할 (교과서 189쪽)</div>
                <p className="leading-relaxed">
                  발표자의 말하기 불안을 덜어주는 가장 큰 힘은 <strong>청중의 긍정적인 반응</strong>입니다.
                  친구의 발표를 들을 때는 딴짓을 하지 말고, 눈을 맞추며 고개를 끄덕이고 미소를 보내주세요.
                  따뜻한 격려가 교실 전체의 발표 자신감을 키웁니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INTERACTIVE BREATHING TRAINER */}
      {activeTab === 'breathing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm text-center space-y-6 max-w-2xl mx-auto">
            <div>
              <span className="text-xs font-bold text-sky-600">교과서 184쪽 및 191쪽 부록 연계</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                발표 전 긴장을 풀어주는 4-4-4 심호흡 트레이너
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                코로 깊게 들이마시고, 잠시 숨을 멈추고, 입으로 천천히 내쉬며 떨리는 가슴을 진정시켜 보세요.
              </p>
            </div>

            {/* Interactive Breathing Visual Circle */}
            <div className="py-6 flex flex-col items-center justify-center">
              <div
                className={`w-52 h-52 rounded-full flex flex-col items-center justify-center border-4 shadow-xl transition-all duration-1000 ${
                  !isBreathing
                    ? 'bg-slate-50 border-slate-200 text-slate-500'
                    : breathPhase === 'inhale'
                    ? 'bg-sky-100 border-sky-400 scale-110 text-sky-900 shadow-sky-200'
                    : breathPhase === 'hold'
                    ? 'bg-indigo-100 border-indigo-400 scale-110 text-indigo-900 shadow-indigo-200'
                    : 'bg-emerald-100 border-emerald-400 scale-95 text-emerald-900 shadow-emerald-200'
                }`}
              >
                <div className="text-xs font-bold tracking-wider uppercase mb-1">
                  {!isBreathing
                    ? '대기 중'
                    : breathPhase === 'inhale'
                    ? '코로 들이마시기 (들숨)'
                    : breathPhase === 'hold'
                    ? '잠시 숨 멈추기'
                    : '입으로 천천히 내쉬기 (날숨)'}
                </div>
                <div className="text-5xl font-black tabular-nums">
                  {isBreathing ? breathTimer : 4}
                </div>
                <div className="text-[11px] mt-1 font-semibold opacity-75">
                  {isBreathing ? `완료된 호흡: ${breathCycles}회` : '시작 버튼을 누르세요'}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={toggleBreathing}
                className={`px-6 py-3 rounded-xl font-bold text-xs md:text-sm shadow-md transition-all flex items-center gap-2 ${
                  isBreathing
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-sky-600 hover:bg-sky-700 text-white'
                }`}
              >
                {isBreathing ? (
                  <>
                    <Pause className="w-4 h-4" /> 일시 정지
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> 심호흡 시작하기
                  </>
                )}
              </button>
              <button
                onClick={resetBreathing}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs md:text-sm rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> 초기화
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs text-slate-600 text-left space-y-1">
              <div className="font-bold text-slate-800">💡 함께 하면 좋은 가벼운 스트레칭:</div>
              <div>• 양손을 깍지 끼고 머리 위로 기지개 켜기 (5초간 유지)</div>
              <div>• 목과 어깨를 시계 방향, 반시계 방향으로 천천히 3회 돌리기</div>
              <div>• 얼굴 근육을 &ldquo;아-에-이-오-우&rdquo; 크게 움직이며 입 풀기</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: KOREAN WORDS TALK (교과서 193쪽) */}
      {activeTab === 'words' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-sm space-y-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold text-sky-600">교과서 193쪽 [우리말 톡]</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                상황에 알맞은 흉내말(의태어) 짝맞추기 퀴즈
              </h3>
              <p className="text-xs md:text-sm text-slate-600 mt-1 leading-relaxed">
                발표를 앞두고 긴장될 때의 신체 변화를 나타내는 우리말 표현을 알맞게 골라보세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WORD_QUIZ_DATA.map((item, idx) => {
                const answered = wordAnswers[idx];
                const isCorrect = answered === item.correct;

                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border transition-all space-y-3 ${
                      answered
                        ? isCorrect
                          ? 'bg-emerald-50/70 border-emerald-300'
                          : 'bg-rose-50/70 border-rose-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-800 flex items-center justify-between">
                      <span>{item.clue}</span>
                      {answered && (
                        <span className={`text-xs font-extrabold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isCorrect ? '정답!' : '다시 골라보세요'}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleWordSelect(idx, opt)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
                            answered === opt
                              ? isCorrect
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-rose-500 text-white'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {answered && isCorrect && (
                      <div className="text-xs text-emerald-800 pt-1">
                        📖 <strong>사전 뜻:</strong> {item.meaning}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
