import React from 'react';
import { Terminal } from 'lucide-react';

export function Header({ setAppState }) {
  return (
    <header className="bg-[#181a20] border-b border-[#2b3139] h-14 flex items-center justify-between px-4 shrink-0 shadow-md">
      <div className="flex items-center gap-3">
        <Terminal className="text-[#fcd535]" size={20} />
        <h1 className="font-bold text-white tracking-wider text-sm">SMART BOM - HEIM TERMINAL</h1>
        <div className="px-2 py-0.5 bg-[#2b3139] rounded text-[10px] font-mono text-[#2ebd85] flex items-center gap-1 border border-[#2ebd85]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2ebd85] animate-pulse"></span> SYSTEM ONLINE
        </div>
      </div>
      
      <div className="flex items-center gap-6">
         <div className="flex flex-col items-end">
          <span className="text-[10px] text-gray-500 font-mono">DB CONNECTED</span>
          <span className="text-xs text-[#2ebd85] font-mono">Code_Component-LongLeadTime.xlsx</span>
        </div>
        <div className="w-px h-6 bg-[#2b3139]"></div>
        <button className="text-gray-400 hover:text-white transition-colors flex items-center gap-2" onClick={() => setAppState('upload')}>
          <span className="text-[10px] border border-gray-600 px-2 py-1 rounded hover:bg-gray-800">RESTART TERMINAL</span>
        </button>
      </div>
    </header>
  );
}