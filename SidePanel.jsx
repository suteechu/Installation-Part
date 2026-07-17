import React, { useRef } from 'react';
import { PieChart as PieChartIcon, Activity, Download, Home, X, Trash2, Star } from 'lucide-react';
import * as Recharts from 'recharts';
const { PieChart, Pie, Cell, ResponsiveContainer, Tooltip: RechartsTooltip } = Recharts;

const CHART_COLORS = {
  'Architectural': '#fcd535', // Yellow
  'Electrical': '#b19cd9',    // Purple
  'Structure': '#ff9f43',     // Orange
  'Sanitary': '#64C5EB'      // Light Blue
};

export function SidePanel({ 
  chartData, 
  totalValue,
  historyLogs, 
  endOfLogsRef, 
  handleExportCSV,
  houseCostBoqs,
  activeHouseCostBoqId,
  handleSetActiveHouseCostBoq,
  handleRemoveHouseCostBoq,
  handleClearAllHouseCostBoqs
}) {
  const maxValue = chartData.length > 0 ? Math.max(...chartData.map(d => d.value)) : 0;

  return (
    <div className="w-80 flex flex-col bg-[#0b0e11] border-l border-[#2b3139]">
      <div className="border-b border-[#2b3139] bg-[#181a20]">
         <div className="p-3 border-b border-[#2b3139]">
            <div className="flex items-center gap-2">
              <PieChartIcon size={16} className="text-[#4ea8de]" />
              <span className="font-mono text-sm font-bold text-white">PORTFOLIO ALLOCATION</span>
            </div>
         </div>
         <div className="h-40 p-2">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[entry.name] || '#8884d8'} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value) => `฿${value.toLocaleString()}`}
                    contentStyle={{ backgroundColor: '#181a20', borderColor: '#2b3139', fontSize: '12px', fontFamily: 'monospace', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-gray-500 font-mono">No Data</div>
            )}
         </div>
         <div className="px-4 pb-4 flex flex-col gap-1.5 items-start">
            {chartData.slice().sort((a, b) => b.value - a.value).map((entry, idx) => {
                const isMax = entry.value === maxValue && maxValue > 0;
                return (
                  <div key={idx} className={`flex items-center justify-between w-full text-xs font-mono p-1.5 rounded-sm transition-colors ${isMax ? 'bg-yellow-400/10' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[entry.name] || '#8884d8' }}></span>
                      <span className={isMax ? "text-yellow-300 font-bold" : "text-gray-400"}>{entry.name.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={isMax ? "text-white font-bold" : "text-gray-500"}>฿{entry.value.toLocaleString()}</span>
                      {isMax && <Star size={14} className="text-yellow-400 fill-yellow-500" />}
                    </div>
                  </div>
                )
            })}
         </div>
      </div>

      {/* House Cost Comparison Section */}
      <div className="border-b border-[#2b3139] bg-[#181a20]">
        <div className="p-3 border-b border-[#2b3139] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Home size={16} className="text-[#4ea8de]" />
            <span className="font-mono text-sm font-bold text-white">HOUSE COST COMPARISON</span>
          </div>
          {houseCostBoqs.length > 0 && (
            <button onClick={handleClearAllHouseCostBoqs} className="text-gray-500 hover:text-red-400 text-[10px] font-mono flex items-center gap-1">
              <Trash2 size={12} /> CLEAR ALL
            </button>
          )}
        </div>
        <div className="p-4 space-y-3 min-h-[150px]">
          {houseCostBoqs.length === 0 && (
            <div className="text-center text-xs text-gray-600 font-mono py-8">
              <p>Import a House BOM</p>
              <p>on the upload screen</p>
              <p>to start comparing.</p>
            </div>
          )}
          {houseCostBoqs.map((houseCostBoq) => {
            const houseCostTotal = houseCostBoq.boqData.reduce((sum, item) => sum + (item.price * item.qty), 0);
            const costDifference = totalValue - houseCostTotal;
            const isActive = houseCostBoq.id === activeHouseCostBoqId;

            return (
              <div 
                key={houseCostBoq.id}
                onClick={() => handleSetActiveHouseCostBoq(houseCostBoq.id)}
                className={`cursor-pointer rounded p-3 text-xs font-mono space-y-2 transition-all border ${isActive ? 'bg-blue-900/30 border-blue-700' : 'bg-[#0b0e11] border-[#2b3139] hover:border-blue-800'}`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">HOUSE MODEL:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold truncate ml-2">{houseCostBoq.fileName.replace(/\.(csv|xlsx|xls)$/i, '')}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRemoveHouseCostBoq(houseCostBoq.id); }} 
                      className="text-gray-600 hover:text-red-500 p-0.5 rounded-full hover:bg-red-500/10"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">TOTAL COST:</span>
                  <span className="text-white font-bold">฿{houseCostTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center border-t border-dashed border-gray-600 pt-2 mt-2">
                  <span className="text-gray-500">DIFFERENCE:</span>
                  <span className={`font-bold ${costDifference > 0 ? 'text-[#f6465d]' : 'text-[#2ebd85]'}`}>
                    {costDifference >= 0 ? '+' : ''}฿{costDifference.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-3 border-b border-[#2b3139] bg-[#181a20]">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-[#fcd535]" />
          <span className="font-mono text-sm font-bold text-white">TRADE HISTORY</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        {historyLogs.length === 0 ? (
          <div className="text-xs text-gray-600 font-mono text-center mt-10 border border-dashed border-gray-800 p-4 rounded">
            Awaiting trade execution... <br/>(Swap assets to record history)
          </div>
        ) : (
          historyLogs.map((log, i) => (
            <div key={i} className="mb-4 text-xs font-mono border-b border-[#2b3139]/50 pb-3">
              <div className="flex justify-between text-gray-500 mb-1">
                <span>{log.time}</span>
              </div>
              <div className="text-white mb-2">{log.action}</div>
              
              <div className="flex justify-between items-center bg-[#0b0e11] border border-[#2b3139] p-2 rounded">
                 <span className="text-gray-400">Impact</span>
                 <div className="flex flex-col items-end">
                   <span className={log.priceDelta < 0 ? 'text-[#2ebd85]' : log.priceDelta > 0 ? 'text-[#f6465d]' : 'text-gray-400'}>
                     {log.priceDelta > 0 ? '+' : ''}{log.priceDelta.toLocaleString()} THB
                   </span>
                   {log.leadTimeDelta !== 0 && (
                      <span className={log.leadTimeDelta < 0 ? 'text-[#2ebd85] text-[10px]' : 'text-[#f6465d] text-[10px]'}>
                         {log.leadTimeDelta > 0 ? '+' : ''}{log.leadTimeDelta} Days Lead
                      </span>
                   )}
                 </div>
              </div>
            </div>
          ))
        )}
        <div ref={endOfLogsRef} />
      </div>
      
      <div className="p-4 border-t border-[#2b3139] bg-[#181a20]">
         <button 
            onClick={handleExportCSV}
            className="w-full bg-[#fcd535] text-black font-bold py-2.5 rounded text-sm hover:bg-[#e0bc2c] transition-colors flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(252,213,53,0.2)]"
         >
            <Download size={16} /> EXPORT CSV
         </button>
      </div>
    </div>
  );
}