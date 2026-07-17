import React, { useState, useEffect, useRef } from 'react';

import { UploadScreen } from '../UploadScreen';
import { Header } from '../Header';
import { StatsBar } from '../StatsBar';
import { ProjectInfoBar } from '../ProjectInfoBar';
import { BoqTable } from '../BoqTable';
import { InstallationGuide } from '../InstallationGuide';
import { SidePanel } from '../SidePanel';

const PRODUCT_DATABASE = {
  // Architectural - Doors
  "DCI-900-S1": { id: "DCI-900-S1", name: "ประตูบานเปิดเดี่ยว (DCI)", type: "Door", unit: "บาน", cost: 4500, price: 6500, leadTime: 14, longLead: false, stock: 10 },
  "DCG-1800-S2": { id: "DCG-1800-S2", name: "ประตูบานเลื่อนคู่ กระจก (DCG)", type: "Door", unit: "ชุด", cost: 12000, price: 18500, leadTime: 30, longLead: false, stock: 5 },
  "DCG-3600-S4": { id: "DCG-3600-S4", name: "ประตูบานเลื่อน 4 บาน (DCG)", type: "Door", unit: "ชุด", cost: 22000, price: 32000, leadTime: 45, longLead: true, stock: 2 },
  "H-C-3600-S4": { id: "H-C-3600-S4", name: "ประตูบานเลื่อน 4 บาน (เดิม)", type: "Door", unit: "ชุด", cost: 18000, price: 25000, leadTime: 45, longLead: true, stock: 0 },
  
  // Architectural - Windows
  "Hi-C-3600-S4-F4": { id: "Hi-C-3600-S4-F4", name: "หน้าต่างบานเลื่อน 4 บาน Hi-", type: "Window", unit: "ชุด", cost: 15000, price: 21000, leadTime: 30, longLead: false, stock: 8 },
  "Top3-1200-S2": { id: "Top3-1200-S2", name: "หน้าต่างบานเปิดคู่ Top3", type: "Window", unit: "ชุด", cost: 8500, price: 12500, leadTime: 60, longLead: true, stock: 3 },
  "H-K-900-S2": { id: "H-K-900-S2", name: "หน้าต่างบานเลื่อนเดี่ยว", type: "Window", unit: "ชุด", cost: 3500, price: 5000, leadTime: 14, longLead: false, stock: 20 },
  "H-S-900-S2-FT": { id: "H-S-900-S2-FT", name: "หน้าต่างบานกระทุ้ง กระจกฝ้า", type: "Window", unit: "ชุด", cost: 4000, price: 5800, leadTime: 20, longLead: false, stock: 15 },
  
  // Electrical - MEP
  "CBL-THW-2.5": { id: "CBL-THW-2.5", name: "สายไฟ THW 2.5 sq.mm", type: "Electrical", unit: "ม้วน", cost: 1200, price: 1500, leadTime: 3, longLead: false, stock: 100 },
  "BOX-SQ-2x4": { id: "BOX-SQ-2x4", name: "บล็อกฝังเหล็ก 2x4", type: "Electrical", unit: "ใบ", cost: 15, price: 25, leadTime: 2, longLead: false, stock: 500 },
  "TRF-1000KVA": { id: "TRF-1000KVA", name: "หม้อแปลง 1000 KVA", type: "Electrical", unit: "ชุด", cost: 450000, price: 520000, leadTime: 90, longLead: true, stock: 1 },
  "CBL-NYY-50": { id: "CBL-NYY-50", name: "สายไฟ NYY 50 sq.mm", type: "Electrical", unit: "เมตร", cost: 450, price: 580, leadTime: 40, longLead: true, stock: 200 },

  // Structure
  "RB-DB12": { id: "RB-DB12", name: "เหล็กข้ออ้อย DB12", type: "Structure", unit: "ตัน", cost: 22000, price: 24500, leadTime: 7, longLead: false, stock: 50 },
  "ST-H-200": { id: "ST-H-200", name: "เหล็ก H-Beam 200x200", type: "Structure", unit: "ตัน", cost: 35000, price: 42000, leadTime: 45, longLead: true, stock: 10 },
  
  // Sanitary
  "SN-T01": { id: "SN-T01", name: "โถสุขภัณฑ์", type: "Sanitary", unit: "ชุด", cost: 3000, price: 4500, leadTime: 10, longLead: false, stock: 25 },
};

export default function App() {
  const [appState, setAppState] = useState('upload'); // 'upload' | 'scanning' | 'review'
  const [activeTab, setActiveTab] = useState('ALL');
  const [isUploading, setIsUploading] = useState(false);
  const [extractionLogs, setExtractionLogs] = useState([]);
  const [boqData, setBoqData] = useState([]);
  const [historyLogs, setHistoryLogs] = useState([]);
  
  // UPDATED: House Cost Comparison State
  const [houseCostBoqs, setHouseCostBoqs] = useState([]);
  const [activeHouseCostBoqId, setActiveHouseCostBoqId] = useState(null);
  
  // UPDATED: File Drag & Drop State
  const [dragActive, setDragActive] = useState(false);
  const [dragActiveCompare, setDragActiveCompare] = useState(false);
  const [fileName, setFileName] = useState("ลากไฟล์มาวาง หรือ คลิกเพื่อเลือกไฟล์");
  
  // NEW: Project Info State
  const [projectInfo, setProjectInfo] = useState({
    type: '', location: '', project: '', platform: ''
  });

  const [scanCategories, setScanCategories] = useState({
    ARCHITECTURAL: true,
    ELECTRICAL: true,
    STRUCTURE: false,
    SANITARY: true
  });
  
  const [lastUpdateIdx, setLastUpdateIdx] = useState(null);
  const endOfLogsRef = useRef(null);
  const houseCostInputRef = useRef(null);

  useEffect(() => {
    if (endOfLogsRef.current) {
      endOfLogsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [extractionLogs, historyLogs]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleCompareDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveCompare(true);
    } else if (e.type === "dragleave") {
      setDragActiveCompare(false);
    }
  };

  const toggleCategory = (category) => {
    setScanCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSimulateUpload = () => {
    if (!scanCategories.ARCHITECTURAL && !scanCategories.ELECTRICAL && !scanCategories.STRUCTURE && !scanCategories.SANITARY) {
      alert("กรุณาเลือกหมวดหมู่อย่างน้อย 1 หมวดเพื่อทำการสแกน");
      return;
    }

    setIsUploading(true);
    setAppState('scanning');
    setExtractionLogs([]);
    setProjectInfo({
        type: 'CUSTOMIZED',
        location: 'PAK KRET, NONTHABURI',
        project: 'S25104A - TAPSUPAN A.#3, S25I04B - TAPSUPAN A.#3(C3)',
        platform: 'SMART'
    });
    
    const allMockFoundAssets = [
      { id: "H-K-900-S2", qty: 4, category: 'ARCHITECTURAL' },
      { id: "Hi-C-3600-S4-F4", qty: 2, category: 'ARCHITECTURAL' },
      { id: "DCI-900-S1", qty: 3, category: 'ARCHITECTURAL' },
      { id: "DCG-3600-S4", qty: 1, category: 'ARCHITECTURAL' },
      { id: "CBL-THW-2.5", qty: 50, category: 'ELECTRICAL' },
      { id: "TRF-1000KVA", qty: 1, category: 'ELECTRICAL' },
      { id: "RB-DB12", qty: 15, category: 'STRUCTURE' },
      { id: "ST-H-200", qty: 5, category: 'STRUCTURE' },
      { id: "SN-T01", qty: 5, category: 'SANITARY' }
    ];

    const targetAssets = allMockFoundAssets.filter(asset => scanCategories[asset.category]);
    
    const initialSteps = [
      `[SYSTEM] Connecting to Master DB: Code_Component-LongLeadTime.xlsx...`,
      `[AI_VISION] Parsing Vector Node: ${fileName}...`,
      `[AI_VISION] Extracting Project Info...`,
      `[AI_VISION] > TYPE: CUSTOMIZED`,
      `[AI_VISION] > LOCATION: PAK KRET, NONTHABURI`,
      `[AI_VISION] > PROJECT: S25104A - TAPSUPAN A.#3, S25I04B - TAPSUPAN A.#3(C3)`,
      `[AI_VISION] > PLATFORM: SMART`,
    ];

    const assetLogSteps = targetAssets.map(asset => {
      const product = PRODUCT_DATABASE[asset.id];
      return `▶ FOUND_ASSET: $${product.id} | VOL: ${asset.qty} | UNIT: ${product.unit} | TYPE: ${product.type}`;
    });

    const finalSteps = [
      "[CALC] Cross-referencing current market prices...",
      "[SYSTEM] Data extraction complete. Booting Terminal."
    ];

    const allSteps = [...initialSteps, ...assetLogSteps, ...finalSteps];

    allSteps.forEach((step, index) => {
      setTimeout(() => {
        setExtractionLogs(prev => [...prev, step]);
        if (index === allSteps.length - 1) {
          setTimeout(() => {
            const finalBoqData = targetAssets.map(asset => ({
              ...PRODUCT_DATABASE[asset.id],
              qty: asset.qty,
              originalId: asset.id
            }));
            
            setBoqData(finalBoqData);
            setIsUploading(false);
            setAppState('review');
          }, 1500);
        }
      }, index * 350); 
    });
  };

  const handleModelChange = (index, newModelCode) => {
    const newProduct = PRODUCT_DATABASE[newModelCode];
    if (!newProduct) return;

    const oldProduct = boqData[index];
    const qty = oldProduct.qty;
    
    const priceDelta = (newProduct.price - oldProduct.price) * qty;
    const leadTimeDelta = newProduct.leadTime - oldProduct.leadTime;
    
    const time = new Date().toLocaleTimeString('th-TH');
    const logType = priceDelta < 0 ? 'PROFIT' : priceDelta > 0 ? 'LOSS' : 'NEUTRAL';
    
    setHistoryLogs(prev => [{
      time, 
      action: `SWAPPED: $${oldProduct.originalId} ➔ $${newModelCode}`,
      priceDelta,
      leadTimeDelta,
      type: logType
    }, ...prev]); // Add to top

    const updatedData = [...boqData];
    updatedData[index] = {
      ...newProduct,
      qty: qty,
      originalId: oldProduct.originalId
    };
    
    setBoqData(updatedData);
    setLastUpdateIdx(index);
    setTimeout(() => setLastUpdateIdx(null), 1000);
  };

  const processComparisonFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = event.target.result;
      let data;

      try {
        if (file.name.toLowerCase().endsWith('.csv')) {
          const lines = fileData.split('\n').filter(line => line.trim() !== '');
          data = lines.map(line => line.split(',').map(cell => cell.trim().replace(/"/g, '')));
        } else {
          /* global XLSX */
          const workbook = XLSX.read(fileData, {type: 'binary'});
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
        }
      } catch (err) {
        alert('Error parsing file: ' + err.message);
        return;
      }

      if (!data || data.length < 2) {
        alert("File is empty or has only a header.");
        return;
      }

      const header = data[0].map(h => String(h).trim().toLowerCase());
      
      const tickerVariations = ['part_id', 'part id', 'part no', 'part no.', 'ticker'];
      const qtyVariations = ['qty', 'quantity', 'vol', 'volume'];

      let tickerIndex = -1;
      tickerVariations.forEach(v => {
        if (tickerIndex === -1) tickerIndex = header.indexOf(v);
      });

      let qtyIndex = -1;
      qtyVariations.forEach(v => {
        if (qtyIndex === -1) qtyIndex = header.indexOf(v);
      });

      if (tickerIndex === -1 || qtyIndex === -1) {
        alert("CSV/XLSX must contain 'Part ID' (or similar) and 'Qty' (or similar) columns.");
        return;
      }

      const houseBoqItems = {};
      data.slice(1).forEach(row => {
        if (row.length > Math.max(tickerIndex, qtyIndex)) {
            const id = String(row[tickerIndex]).trim();
            const qty = parseFloat(row[qtyIndex]);
            const product = PRODUCT_DATABASE[id];

            if (product && !isNaN(qty)) {
                if (houseBoqItems[id]) {
                    houseBoqItems[id].qty += qty;
                } else {
                    houseBoqItems[id] = { ...product, qty: qty };
                }
            }
        }
      });

      const houseBoqData = Object.values(houseBoqItems);
      const newHouse = { id: Date.now(), fileName: file.name, boqData: houseBoqData };

      setHouseCostBoqs(prevBoqs => {
        if (prevBoqs.some(b => b.fileName === newHouse.fileName)) {
          alert(`File "${newHouse.fileName}" has already been imported.`);
          return prevBoqs;
        }
        const updatedBoqs = [...prevBoqs, newHouse];
        if (activeHouseCostBoqId === null) {
          setActiveHouseCostBoqId(newHouse.id);
        }
        return updatedBoqs;
      });
    };

    if (file.name.toLowerCase().endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file, {type: 'binary'});
    }
  };

  const handleHouseCostImport = (e) => {
    const file = e.target.files[0];
    processComparisonFile(file);
    if (e.target) e.target.value = null; // Reset file input
  };

  const handleComparisonDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveCompare(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processComparisonFile(file);
    }
  };

  const handleExportCSV = () => {
    const headers = ["TICKER", "NAME", "CATEGORY", "VOLUME", "UNIT", "UNIT_PRICE_THB", "TOTAL_PRICE_THB", "LEAD_TIME_DAYS", "IS_LONG_LEAD"];

    const csvRows = boqData.map(item => {
      return [
        item.id, `"${item.name}"`, item.type, item.qty, item.unit,
        item.price, item.price * item.qty, item.leadTime, item.longLead ? "YES" : "NO"
      ].join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Smart_BOM_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleRemoveHouseCostBoq = (idToRemove) => {
    setHouseCostBoqs(prevBoqs => {
      const newBoqs = prevBoqs.filter(b => b.id !== idToRemove);
      if (activeHouseCostBoqId === idToRemove) {
        setActiveHouseCostBoqId(newBoqs.length > 0 ? newBoqs[0].id : null);
      }
      return newBoqs;
    });
  };

  const handleClearAllHouseCostBoqs = () => {
    setHouseCostBoqs([]);
    setActiveHouseCostBoqId(null);
  };


  const totalValue = boqData.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const maxLeadTime = boqData.reduce((max, item) => item.leadTime > max ? item.leadTime : max, 0);
  const longLeadCount = boqData.filter(item => item.longLead).length;
  const stockShortageCount = boqData.filter(item => item.qty > item.stock).length;

  // Prepare data for Chart
  const chartData = boqData.reduce((acc, item) => {
    let category = item.type === 'Door' || item.type === 'Window' ? 'Architectural' : item.type;
    const existing = acc.find(x => x.name === category);
    if (existing) {
      existing.value += (item.price * item.qty);
    } else {
      acc.push({ name: category, value: item.price * item.qty });
    }
    return acc;
  }, []);

  const filteredData = boqData.filter(item => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'LONG_LEAD') return item.longLead;
    if (activeTab === 'SHORT_STOCK') return item.qty > item.stock;
    if (activeTab === 'ELECTRICAL') return item.type === 'Electrical';
    if (activeTab === 'STRUCTURE') return item.type === 'Structure';
    if (activeTab === 'ARCHITECTURAL') return item.type === 'Door' || item.type === 'Window';
    if (activeTab === 'SANITARY') return item.type === 'Sanitary';
    return true;
  });

  const activeHouseCostBoq = houseCostBoqs.find(b => b.id === activeHouseCostBoqId) || null;

  if (appState !== 'review') {
    return (
      <UploadScreen
        isUploading={appState === 'scanning'}
        extractionLogs={extractionLogs}
        endOfLogsRef={endOfLogsRef}
        handleDrag={handleDrag}
        handleDrop={handleDrop}
        dragActive={dragActive}
        handleCompareDrag={handleCompareDrag}
        handleComparisonDrop={handleComparisonDrop}
        dragActiveCompare={dragActiveCompare}
        fileName={fileName}
        scanCategories={scanCategories}
        toggleCategory={toggleCategory}
        handleSimulateUpload={handleSimulateUpload}
        handleHouseCostImport={handleHouseCostImport}
        houseCostInputRef={houseCostInputRef}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0e11] text-gray-300 flex flex-col h-screen overflow-hidden">
      <Header setAppState={setAppState} />

      <ProjectInfoBar info={projectInfo} />

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT COLUMN: STATS & BOQ TABLE */}
        <div className="flex-1 flex flex-col border-r border-[#2b3139]">
          <InstallationGuide />
          <StatsBar 
            totalValue={totalValue}
            boqData={boqData}
            maxLeadTime={maxLeadTime}
            stockShortageCount={stockShortageCount}
            scanCategories={scanCategories}
          />
          <BoqTable 
            filteredData={filteredData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            longLeadCount={longLeadCount}
            stockShortageCount={stockShortageCount}
            lastUpdateIdx={lastUpdateIdx}
            handleModelChange={handleModelChange}
            boqData={boqData}
            PRODUCT_DATABASE={PRODUCT_DATABASE}
            houseCostBoq={activeHouseCostBoq}
          />
        </div>

        {/* RIGHT COLUMN: CHARTS & EXECUTION LOGS */}
        <SidePanel 
          chartData={chartData}
          totalValue={totalValue}
          historyLogs={historyLogs}
          endOfLogsRef={endOfLogsRef}
          handleExportCSV={handleExportCSV}
          houseCostBoqs={houseCostBoqs}
          activeHouseCostBoqId={activeHouseCostBoqId}
          handleSetActiveHouseCostBoq={setActiveHouseCostBoqId}
          handleRemoveHouseCostBoq={handleRemoveHouseCostBoq}
          handleClearAllHouseCostBoqs={handleClearAllHouseCostBoqs}
        />
        
      </div>
    </div>
  );
}