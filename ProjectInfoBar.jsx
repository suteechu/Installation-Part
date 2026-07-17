import React from 'react';

export function ProjectInfoBar({ info }) {
  if (!info || !info.project) {
    return null;
  }

  return (
    <div className="bg-[#181a20] border-b border-[#2b3139] px-4 py-2 text-xs font-mono print:border-t-2 print:border-b-2 print:border-slate-400 print:bg-white">
      <div className="grid grid-cols-1 md:grid-cols-4 print:grid-cols-4 gap-x-4 gap-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-gray-500 print:text-slate-600">TYPE:</span>
          <span className="text-white font-bold print:text-black">{info.type}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-gray-500 print:text-slate-600">PLATFORM:</span>
          <span className="text-white font-bold print:text-black">{info.platform}</span>
        </div>
        <div className="flex items-baseline gap-2 col-span-2">
          <span className="text-gray-500 print:text-slate-600">LOCATION:</span>
          <span className="text-white font-bold print:text-black">{info.location}</span>
        </div>
        <div className="flex items-baseline gap-2 col-span-4">
          <span className="text-gray-500 print:text-slate-600">PROJECT:</span>
          <span className="text-white font-bold print:text-black">{info.project}</span>
        </div>
      </div>
    </div>
  );
}