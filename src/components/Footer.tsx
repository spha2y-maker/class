import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          <span className="font-bold text-slate-700">중학교 3학년 국어 교육자료</span>
          <span className="mx-2">·</span>
          <span>4단원 점검과 조정 &gt; (2) 청중을 고려하여 자신 있게 말하기</span>
        </div>
        <div className="text-slate-400">
          청중을 배려하고 함께 호흡하는 즐거운 국어 발표 수업
        </div>
      </div>
    </footer>
  );
};
