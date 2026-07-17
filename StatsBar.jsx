import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export function StatsBar({ totalValue, boqData, maxLeadTime, scanCategories, stockShortageCount }) {
  return (
    <div className="grid grid-cols-5 bg-[#181a20] border-b border-[#2b3139] p-3 gap-4 shrink-0">
      <div className="flex flex-col border-r border-[#2b3139] pr-4">
        <span className="text-[10px] text-gray-500 font-mono">TOTAL BOM VALUE</span>
        <span className="text-xl text-white font-bold tracking-tight">฿{totalValue.toLocaleString()}</span>
      </div>

      <div className="flex flex-col border-r border-[#2b3139] pr-4">
        <span className="text-[10px] text-gray-500 font-mono">TOTAL ASSETS</span>
        <span className="text-xl text-white font-bold">{boqData.length}</span>
      </div>
      
      <div className="flex flex-col border-r border-[#2b3139] pr-4">
        <span className="text-[10px] text-gray-500 font-mono">STOCK SHORTAGE</span>
        <span className={`text-xl font-bold flex items-center gap-1 ${stockShortageCount > 0 ? 'text-[#f6465d]' : 'text-[#2ebd85]'}`}>
          {stockShortageCount > 0 && <AlertTriangle size={14} className="mt-0.5" />}
          {stockShortageCount}
          <span className="text-xs text-gray-500 font-normal mt-1 ml-1">ITEMS</span>
        </span>
      </div>

      <div className="flex flex-col border-r border-[#2b3139] pr-4">
        <span className="text-[10px] text-gray-500 font-mono">MAX LEAD (CRITICAL)</span>
        <span className="text-xl text-[#f6465d] font-bold flex items-center gap-1">
          {maxLeadTime} <span className="text-xs text-gray-500 font-normal mt-1">DAYS</span>
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] text-gray-500 font-mono">MODULES</span>
        <span className="text-xs text-[#2ebd85] font-bold flex items-center gap-1 mt-1 truncate">
           {[
             scanCategories.ARCHITECTURAL && 'ARCH',
             scanCategories.ELECTRICAL && 'ELEC',
             scanCategories.STRUCTURE && 'STRUC',
             scanCategories.SANITARY && 'SANI'
           ].filter(Boolean).join(' | ')}
        </span>
      </div>
    </div>
  );
}