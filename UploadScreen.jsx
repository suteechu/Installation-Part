import React from 'react';
import { UploadCloud, FileSearch, CheckSquare, Square, Terminal, FileText, Home, Upload, Droplets } from 'lucide-react';

export function UploadScreen({
  isUploading,
  extractionLogs,
  endOfLogsRef,
  handleDrag,
  handleDrop,
  dragActive,
  fileName,
  scanCategories,
  toggleCategory,
  handleSimulateUpload,
  handleCompareDrag,
  handleComparisonDrop,
  dragActiveCompare,
  handleHouseCostImport,
  houseCostInputRef
}) {
  return (
    <div className="min-h-screen bg-[#0b0e11] text-gray-300 font-mono flex flex-col items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wider flex items-center justify-center gap-3">
            <Terminal size={32} className="text-[#fcd535]" />
            SMART BOM - HEIM TERMINAL
          </h1>
          <p className="text-gray-500 uppercase tracking-widest text-xs">AI-Powered Asset Extraction System</p>
        </div>

        <div className="border border-[#2b3139] bg-[#181a20] rounded-lg overflow-hidden shadow-2xl">
          <div className="bg-[#2b3139] px-4 py-2 flex items-center justify-between border-b border-black">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f6465d]"></div>
              <div className="w-3 h-3 rounded-full bg-[#fcd535]"></div>
              <div className="w-3 h-3 rounded-full bg-[#2ebd85]"></div>
            </div>
            <div className="text-[10px] text-gray-400">DATA_INGESTION_NODE</div>
          </div>
          
          <div className="p-8">
            {!isUploading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* LEFT COLUMN: AI EXTRACTION */}
                <div className="flex flex-col p-4 rounded-lg bg-[#0b0e11]/50">
                  <div className="text-center mb-4">
                    <h2 className="font-bold text-white">AI BOM EXTRACTION</h2>
                    <p className="text-xs text-gray-500">(.PDF)</p>
                  </div>
                  <div 
                    className={`flex-grow p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center mb-6 transition-all duration-300 ${
                      dragActive ? 'border-[#fcd535] bg-[#fcd535]/10' : 'border-[#2b3139] bg-[#0b0e11]'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <UploadCloud size={48} className={dragActive ? "text-[#fcd535] mb-4" : "text-gray-500 mb-4"} />
                    <p className="text-sm text-gray-300 mb-2 font-bold">DRAG & DROP CAD/PDF FILE</p>
                    <p className="text-xs text-gray-500 mb-4">or click to browse</p>
                    <div className="bg-[#181a20] border border-[#2b3139] px-4 py-2 rounded flex items-center gap-2 text-xs text-[#2ebd85] max-w-full">
                      <FileText size={14} className="shrink-0" /> <span className="truncate">{fileName}</span>
                    </div>
                  </div>
                  
                  <div className="w-full grid grid-cols-1 gap-4 mb-6">
                    <div className="bg-[#0b0e11] p-4 rounded border border-[#2b3139]">
                      <p className="text-[10px] text-gray-500 mb-3 font-bold">SELECT TARGET MODULES</p>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => toggleCategory('ARCHITECTURAL')} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors border ${scanCategories.ARCHITECTURAL ? 'bg-[#fcd535]/20 text-[#fcd535] border-[#fcd535]' : 'bg-transparent text-gray-500 border-[#2b3139]'}`}>
                          {scanCategories.ARCHITECTURAL ? <CheckSquare size={14} /> : <Square size={14} />} ARCHITECTURAL (Door/Window)
                        </button>
                        <button onClick={() => toggleCategory('ELECTRICAL')} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors border ${scanCategories.ELECTRICAL ? 'bg-[#b19cd9]/20 text-[#b19cd9] border-[#b19cd9]' : 'bg-transparent text-gray-500 border-[#2b3139]'}`}>
                          {scanCategories.ELECTRICAL ? <CheckSquare size={14} /> : <Square size={14} />} ELECTRICAL (MEP)
                        </button>
                        <button onClick={() => toggleCategory('STRUCTURE')} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors border ${scanCategories.STRUCTURE ? 'bg-[#ff9f43]/20 text-[#ff9f43] border-[#ff9f43]' : 'bg-transparent text-gray-500 border-[#2b3139]'}`}>
                          {scanCategories.STRUCTURE ? <CheckSquare size={14} /> : <Square size={14} />} STRUCTURE (Steel/Concrete)
                        </button>
                        <button onClick={() => toggleCategory('SANITARY')} className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors border ${scanCategories.SANITARY ? 'bg-[#64C5EB]/20 text-[#64C5EB] border-[#64C5EB]' : 'bg-transparent text-gray-500 border-[#2b3139]'}`}>
                          {scanCategories.SANITARY ? <CheckSquare size={14} /> : <Square size={14} />} SANITARY (Pipes/Fixtures)
                        </button>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleSimulateUpload}
                    className="w-full bg-[#fcd535] hover:bg-[#e0bc2c] text-black font-bold py-3 px-8 rounded flex items-center justify-center gap-3 transition-colors uppercase tracking-wider text-sm shadow-[0_0_15px_rgba(252,213,53,0.3)]"
                  >
                    <FileSearch size={18} /> EXECUTE AI EXTRACTION
                  </button>
                </div>

                {/* RIGHT COLUMN: HOUSE COST COMPARISON */}
                <div className="flex flex-col p-4 rounded-lg bg-[#0b0e11]/50">
                  <div className="text-center mb-4">
                    <h2 className="font-bold text-white">HOUSE COST COMPARISON</h2>
                    <p className="text-xs text-gray-500">(.CSV, .XLSX, .XLS)</p>
                  </div>
                  <input type="file" ref={houseCostInputRef} onChange={handleHouseCostImport} className="hidden" accept=".csv,.xlsx,.xls" />
                  <div 
                    className={`flex-grow p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center mb-6 transition-all duration-300 ${
                      dragActiveCompare ? 'border-blue-500 bg-blue-500/10' : 'border-[#2b3139] bg-[#0b0e11]'
                    }`}
                    onDragEnter={handleCompareDrag} onDragLeave={handleCompareDrag} onDragOver={handleCompareDrag} onDrop={handleComparisonDrop}
                  >
                    <Home size={48} className={dragActiveCompare ? "text-blue-400 mb-4" : "text-gray-500 mb-4"} />
                    <p className="text-sm text-gray-300 mb-2 font-bold">DRAG & DROP HOUSE BOM</p>
                    <p className="text-xs text-gray-500 mb-4">or</p>
                    <button onClick={() => houseCostInputRef.current.click()} className="bg-[#2b3139] text-gray-300 font-bold py-2 px-4 rounded text-xs hover:bg-[#474d57] transition-colors flex items-center justify-center gap-2">
                      <Upload size={16} /> CLICK TO IMPORT
                    </button>
                  </div>
                  <div className="bg-[#0b0e11] p-4 rounded border border-[#2b3139] text-xs text-gray-400 space-y-2">
                    <p className="font-bold text-gray-300">How it works:</p>
                    <p>1. Drop a CAD/PDF on the left to extract the main Bill of Materials (BOM).</p>
                    <p>2. After extraction, you can drop one or more House BOMs here to compare costs.</p>
                    <p>3. The comparison will appear in the side panel on the main screen.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full text-left bg-[#0b0e11] p-4 rounded border border-[#2b3139] h-64 overflow-y-auto font-mono text-xs shadow-inner custom-scrollbar">
                {extractionLogs.map((log, i) => (
                  <div key={i} className={`mb-1.5 ${
                    log.includes('FOUND_ASSET') ? 'text-[#2ebd85]' : 
                    log.includes('ALERT') ? 'text-[#f6465d]' : 'text-gray-400'
                  }`}>
                    {log}
                  </div>
                ))}
                <div ref={endOfLogsRef} />
                <div className="animate-pulse w-2 h-4 bg-[#fcd535] mt-2 inline-block"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}