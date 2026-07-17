import React from 'react';
import { Layers, AlertTriangle, Package, Zap, Hammer, ChevronDown, Droplets } from 'lucide-react';

export function BoqTable({ 
  filteredData, 
  activeTab, 
  setActiveTab, 
  longLeadCount,
  stockShortageCount,
  lastUpdateIdx, 
  handleModelChange, 
  boqData,
  PRODUCT_DATABASE,
  houseCostBoq
}) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#181a20] m-3 border border-[#2b3139] rounded">
      <div className="flex items-center justify-between bg-[#0b0e11] border-b border-[#2b3139] shrink-0 rounded-t pr-2">
        <div className="flex text-[10px] font-mono overflow-x-auto">
          {[
            { id: 'ALL', label: 'ALL ASSETS', icon: <Layers size={12} />, count: 0 },
            { id: 'LONG_LEAD', label: 'LONG LEAD', icon: <AlertTriangle size={12} />, count: longLeadCount, color: 'text-[#f6465d]' },
            { id: 'SHORT_STOCK', label: 'STOCK SHORTAGE', icon: <AlertTriangle size={12} />, count: stockShortageCount, color: 'text-[#f6465d]' },
            { id: 'ARCHITECTURAL', label: 'ARCHITECTURAL', icon: <Package size={12} /> },
            { id: 'ELECTRICAL', label: 'ELECTRICAL', icon: <Zap size={12} /> },
            { id: 'STRUCTURE', label: 'STRUCTURE', icon: <Hammer size={12} /> },
            { id: 'SANITARY', label: 'SANITARY', icon: <Droplets size={12} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? `border-[#fcd535] text-white bg-[#fcd535]/10`
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-[#2b3139]/10'
              }`}
            >
              {tab.icon} {tab.label}
              {tab.count > 0 && (
                <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${tab.color ? `${tab.color.replace('text-', 'bg-')}/20` : ''}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        <table className="w-full text-left border-collapse text-sm font-mono whitespace-nowrap">
          <thead className="sticky top-0 bg-[#0b0e11] z-10 shadow-sm">
            <tr className="text-gray-500 text-[10px]">
              <th className="p-3 border-b border-[#2b3139] font-normal w-1/4">TICKER / NAME</th>
              <th className="p-3 border-b border-[#2b3139] font-normal text-right">BOM VOL</th>
              {houseCostBoq && <th className="p-3 border-b border-[#2b3139] font-normal text-right">HOUSE VOL</th>}
              <th className="p-3 border-b border-[#2b3139] font-normal text-right">PRICE</th>
              <th className="p-3 border-b border-[#2b3139] font-normal text-right">TOTAL (THB)</th>
              <th className="p-3 border-b border-[#2b3139] font-normal text-center">LEAD</th>
              <th className="p-3 border-b border-[#2b3139] font-normal text-right">TRADE (SWAP ASSET)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2b3139]">
            {filteredData.map((item, idx) => {
              const originalIdx = boqData.findIndex(b => b.originalId === item.originalId && b.id === item.id);
              const isUpdated = lastUpdateIdx === originalIdx;
              const houseItem = houseCostBoq ? houseCostBoq.boqData.find(h => h.id === item.id) : null;
              const houseQty = houseItem ? houseItem.qty : 0;
              const qtyDiff = item.qty - houseQty;
              return (
                <tr 
                  key={idx} 
                  className={`
                    hover:bg-[#2b3139]/50 transition-all duration-300
                    ${isUpdated ? 'bg-[#2ebd85]/20' : houseCostBoq && qtyDiff !== 0 ? 'bg-blue-900/20' : ''}
                    ${item.longLead ? 'border-l-2 border-l-[#f6465d]' : 'border-l-2 border-l-transparent'}
                  `}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                       {item.type === 'Door' && <span className="text-[#fcd535] font-bold text-xs bg-[#fcd535]/10 px-1 rounded">DR</span>}
                       {item.type === 'Window' && <span className="text-[#4ea8de] font-bold text-xs bg-[#4ea8de]/10 px-1 rounded">WN</span>}
                       {item.type === 'Electrical' && <span className="text-[#b19cd9] font-bold text-xs bg-[#b19cd9]/10 px-1 rounded">EL</span>}
                       {item.type === 'Structure' && <span className="text-[#ff9f43] font-bold text-xs bg-[#ff9f43]/10 px-1 rounded">ST</span>}
                       <span className="text-white font-bold">${item.originalId}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1 truncate max-w-[200px]">{item.name}</div>
                  </td>
                  <td className="p-3 text-right align-top">
                    <div>
                      <span className="text-white font-bold">{item.qty}</span>
                      <span className="text-[10px] text-gray-500 ml-1">{item.unit}</span>
                    </div>
                    <div className={`text-[10px] mt-1 font-bold ${item.qty > item.stock ? 'text-[#f6465d]' : 'text-gray-500'}`}>
                      (Stock: {item.stock})
                      {item.qty > item.stock && ` | Short: ${item.qty - item.stock}`}
                    </div>
                  </td>
                  {houseCostBoq && (
                    <td className="p-3 text-right align-top">
                      <div>
                        <span className="text-white font-bold">{houseQty}</span>
                        <span className="text-[10px] text-gray-500 ml-1">{item.unit}</span>
                      </div>
                      <div className={`text-[10px] mt-1 font-bold ${qtyDiff > 0 ? 'text-[#2ebd85]' : qtyDiff < 0 ? 'text-[#f6465d]' : 'text-gray-500'}`}>
                        (Diff: {qtyDiff > 0 ? '+' : ''}{qtyDiff})
                      </div>
                    </td>
                  )}
                  <td className="p-3 text-right text-white">
                    {item.price.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-bold text-white">
                    {(item.price * item.qty).toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                     <span className={item.longLead ? "text-[#f6465d] bg-[#f6465d]/10 px-2 py-0.5 rounded font-bold" : "text-gray-400"}>
                      {item.leadTime}d
                     </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="relative inline-block w-48 text-left">
                      <select 
                        className="w-full appearance-none bg-[#0b0e11] border border-[#2b3139] hover:border-[#fcd535] px-2 py-1.5 pr-6 rounded text-xs text-white cursor-pointer transition-colors focus:outline-none focus:border-[#2ebd85]"
                        value={item.id}
                        onChange={(e) => handleModelChange(originalIdx, e.target.value)}
                      >
                        <optgroup label="CURRENT POSITION">
                          <option value={item.id}>KEEP: {item.id}</option>
                        </optgroup>
                        <optgroup label={`AVAILABLE SWAPS (${item.type.toUpperCase()})`}>
                          {Object.values(PRODUCT_DATABASE)
                            .filter(p => p.type === item.type && p.id !== item.id)
                            .map(p => {
                              const diff = p.price - item.price;
                              const diffText = diff > 0 ? `+฿${diff.toLocaleString()}` : diff < 0 ? `-฿${Math.abs(diff).toLocaleString()}` : '฿0';
                              return (
                                <option key={p.id} value={p.id}>
                                  SWAP: {p.id} ({diffText})
                                </option>
                              );
                            })}
                        </optgroup>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <ChevronDown size={14} />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredData.length === 0 && (
           <div className="flex flex-col items-center justify-center h-32 text-gray-500 font-mono text-sm">
              No assets found in this category.
           </div>
        )}
      </div>
    </div>
  );
}