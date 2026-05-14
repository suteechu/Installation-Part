import React, { useState, useRef } from 'react';
import { Search, Save, Printer, Image as ImageIcon, Upload, ArrowUpDown, ArrowUp, ArrowDown, Download } from 'lucide-react';
import { initialData } from './data'; 
import { parseBomCsv, exportToCsv } from './utils';
import ImageModal from './ImageModal';

export default function App() {
  const [parts, setParts] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);
  
  const [imageModal, setImageModal] = useState({ isOpen: false, part: null });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  const [jobInfo, setJobInfo] = useState({
    houseId: 'S25D02A',
    houseName: 'Adisak P.',
    globalRemark: ''
  });

  const handleJobInfoChange = (e) => {
    const { name, value } = e.target;
    setJobInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleRowDataChange = (id, field, value) => {
    setParts(parts.map(part => {
      if (part.id === id) {
        if (field === 'bomQty') {
          const parsed = parseFloat(value);
          return { ...part, [field]: isNaN(parsed) && value !== '' ? part.bomQty : value };
        }
        return { ...part, [field]: value };
      }
      return part;
    }));
  };

  const handleSave = () => {
    const installedParts = parts.filter(p => p.bomQty !== '' && parseFloat(p.bomQty) > 0);
    alert(`บันทึกข้อมูลสำเร็จ!\nHouse ID: ${jobInfo.houseId}\nHouse Name: ${jobInfo.houseName}\nจำนวน Part ID ที่มีการแตก BOM: ${installedParts.length} รายการ\nรวม BOM Q'ty ทั้งหมด: ${displayTotalQuantity} ชิ้น`);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const qtyMap = await parseBomCsv(file);

      let updatedCount = 0;
      setParts(prevParts => prevParts.map(part => {
        if (qtyMap[part.partNo] !== undefined) {
          updatedCount++;
          const newQty = Number(qtyMap[part.partNo].toFixed(4));
          return { ...part, bomQty: newQty };
        }
        return part;
      }));

      alert(`โหลดข้อมูลสำเร็จ!\nพบข้อมูลตรงกับเทมเพลตในตารางและอัปเดตจำนวนอัตโนมัติทั้งหมด ${updatedCount} รายการ\nกรุณาตรวจสอบความถูกต้องก่อนกดบันทึก`);
    } catch (error) {
      alert(error.message);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const openImageModal = (part) => {
    setImageModal({ isOpen: true, part });
  };

  const closeImageModal = () => {
    setImageModal({ isOpen: false, part: null });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !imageModal.part) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      handleRowDataChange(imageModal.part.id, 'image', dataUrl);
      setImageModal(prev => ({
        ...prev,
        part: {
          ...prev.part,
          image: dataUrl
        }
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    if (!imageModal.part) return;
    
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรูปภาพนี้?')) {
      handleRowDataChange(imageModal.part.id, 'image', '');
      setImageModal(prev => ({
        ...prev,
        part: {
          ...prev.part,
          image: ''
        }
      }));
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // ฟังก์ชันสำหรับปุ่มส่งออก CSV
  const handleExportCsv = () => {
    exportToCsv(parts, `${jobInfo.houseId}_${jobInfo.houseName.replace(/\s+/g, '_')}_BOM.csv`);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="inline h-4 w-4 ml-1 text-slate-400 opacity-50" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="inline h-4 w-4 ml-1 text-blue-600" /> 
      : <ArrowDown className="inline h-4 w-4 ml-1 text-blue-600" />;
  };

  // กรองข้อมูล
  let displayParts = parts.filter(part => 
    part.partNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // เรียงลำดับข้อมูล
  if (sortConfig.key) {
    displayParts.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'bomQty') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const totalQuantity = parts.reduce((sum, part) => {
    const qty = parseFloat(part.bomQty);
    return sum + (isNaN(qty) ? 0 : qty);
  }, 0);
  
  const displayTotalQuantity = Number(totalQuantity.toFixed(4));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12 print:bg-white print:pb-0" style={{ fontFamily: '"supermarket", "Prompt", "Kanit", sans-serif' }}>
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0">
        
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 print:hidden">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="ค้นหา หมวดงาน, รหัส, หรือชื่อรายการ..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontFamily: 'inherit' }}
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <input 
              type="file" 
              accept=".csv" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileUpload} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm text-base"
              title="โหลดไฟล์ BOM_DATA หรือ BOM_ADD_CLOSE_DEMAND.csv"
            >
              <Upload className="h-5 w-5" />
              โหลด BOM (CSV)
            </button>

            <button 
              onClick={handleExportCsv}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm text-base"
              title="ส่งออกข้อมูลตารางทั้งหมดเป็นไฟล์ CSV"
            >
              <Download className="h-5 w-5" />
              ส่งออก CSV
            </button>
            <button 
              onClick={() => window.print()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm text-base"
            >
              <Printer className="h-5 w-5" />
              พิมพ์
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm text-base"
            >
              <Save className="h-5 w-5" />
              บันทึกข้อมูล
            </button>
          </div>
        </div>

        {/* SCG HEIM Header Block */}
        <div className="bg-white border-2 border-slate-400 flex flex-col md:flex-row shadow-sm rounded-t-md overflow-hidden mb-8">
          <div className="w-full md:w-1/4 p-4 flex items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-slate-400 bg-white min-h-[100px]">
            <div className="text-[#E3000F] font-black text-5xl tracking-tighter flex flex-col leading-none items-center font-sans">
              <span className="mb-1">SCG</span>
              <span className="tracking-widest">HEIM</span>
            </div>
          </div>
          
          <div className="w-full md:w-3/4 flex flex-col">
            <div className="bg-slate-700 p-4 border-b-2 border-slate-400 flex items-center justify-center min-h-[50px]">
              <h2 className="text-xl md:text-3xl font-bold text-white tracking-wide">เอกสารบันทึกการแตก BOM ส่วน Installation Part</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 bg-white flex-grow">
              <div className="p-3 border-b md:border-b-0 md:border-r border-slate-300 flex items-center justify-center font-semibold text-base text-center text-slate-600 bg-slate-50">
                House ID
              </div>
              <div className="p-2 border-b md:border-b-0 md:border-r border-slate-300 flex items-center bg-white">
                <input type="text" name="houseId" value={jobInfo.houseId} onChange={handleJobInfoChange} className="w-full px-2 py-1 text-center focus:outline-none focus:bg-slate-100 text-base font-semibold text-slate-800 bg-transparent rounded" placeholder="S25D02A" style={{ fontFamily: 'inherit' }} />
              </div>
              <div className="p-3 border-b md:border-b-0 md:border-r border-slate-300 flex items-center justify-center font-semibold text-base text-center text-slate-600 bg-slate-50">
                House Name
              </div>
              <div className="p-2 flex items-center bg-white">
                <input type="text" name="houseName" value={jobInfo.houseName} onChange={handleJobInfoChange} className="w-full px-2 py-1 text-center focus:outline-none focus:bg-slate-100 text-base font-semibold text-slate-800 bg-transparent rounded" placeholder="Adisak P." style={{ fontFamily: 'inherit' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border-2 border-slate-400 overflow-hidden shadow-sm rounded-md mb-8 print:border-none print:shadow-none">
          <div className="overflow-x-auto max-h-[75vh] print:max-h-none print:overflow-visible">
            <table className="w-full text-left text-sm whitespace-nowrap border-collapse relative print:static">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b-2 border-slate-400 sticky top-0 z-10 shadow-sm print:static print:shadow-none">
                <tr>
                  <th 
                    className="px-2 py-3 border-r border-slate-300 text-center w-[10%] bg-slate-200 cursor-pointer hover:bg-slate-300 select-none transition-colors"
                    onClick={() => handleSort('category')}
                  >
                    หมวดงาน {renderSortIcon('category')}
                  </th>
                  <th 
                    className="px-2 py-3 border-r border-slate-300 text-center w-[12%] cursor-pointer hover:bg-slate-200 select-none transition-colors"
                    onClick={() => handleSort('partNo')}
                  >
                    Part ID {renderSortIcon('partNo')}
                  </th>
                  <th 
                    className="px-2 py-3 border-r border-slate-300 text-center w-[26%] cursor-pointer hover:bg-slate-200 select-none transition-colors"
                    onClick={() => handleSort('description')}
                  >
                    Part Name {renderSortIcon('description')}
                  </th>
                  <th className="px-2 py-3 border-r border-slate-300 text-center w-[12%]">คำอธิบาย (รูป)</th>
                  <th 
                    className="px-2 py-3 border-r border-slate-300 text-center w-[8%] cursor-pointer hover:bg-slate-200 select-none transition-colors"
                    onClick={() => handleSort('bomQty')}
                  >
                    BOM Q'ty {renderSortIcon('bomQty')}
                  </th>
                  <th className="px-2 py-3 border-r border-slate-300 text-center w-[6%]">Method</th>
                  <th className="px-2 py-3 border-r border-slate-300 text-center w-[6%]">Place</th>
                  <th className="px-2 py-3 border-r border-slate-300 text-center w-[6%]">Station</th>
                  <th className="px-2 py-3 text-center w-[12%]">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {displayParts.length > 0 ? (
                  displayParts.map((part, index) => {
                    const isGroupedByCategory = sortConfig.key === null || sortConfig.key === 'category';
                    const isFirstInCategory = isGroupedByCategory && (index === 0 || displayParts[index - 1].category !== part.category);
                    
                    return (
                      <tr key={part.id} className="hover:bg-slate-50 transition-colors">
                        
                        {/* Column Category */}
                        {isGroupedByCategory ? (
                          isFirstInCategory ? (
                            <td 
                              className="px-2 py-2 border-r border-slate-300 text-center bg-slate-100 align-top font-medium text-slate-700"
                              rowSpan={displayParts.filter(p => p.category === part.category).length}
                            >
                              <div className="mt-2">{part.category}</div>
                            </td>
                          ) : null
                        ) : (
                          <td className="px-2 py-2 border-r border-slate-300 text-center bg-slate-50 text-slate-500 text-xs whitespace-normal">
                            {part.category}
                          </td>
                        )}

                        <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-800 text-center">
                          {part.partNo}
                        </td>

                        <td className="px-2 py-1 border-r border-slate-300">
                          <input type="text" value={part.description} onChange={(e) => handleRowDataChange(part.id, 'description', e.target.value)} className="w-full px-1 py-1 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-200 rounded text-slate-700" style={{ fontFamily: 'inherit' }} />
                        </td>

                        <td className="px-2 py-1 border-r border-slate-300 text-center align-middle">
                          <button 
                            type="button" 
                            onClick={() => openImageModal(part)} 
                            className={`p-2 rounded-full border transition-colors ${part.image ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                            title="คลิกเพื่อดูหรือเพิ่มรูปภาพ"
                          >
                            <ImageIcon className="h-5 w-5 mx-auto" />
                          </button>
                        </td>

                        <td className={`px-2 py-1 border-r border-slate-300 text-center transition-colors ${part.bomQty !== '' && parseFloat(part.bomQty) > 0 ? 'bg-blue-50' : ''}`}>
                          <input 
                            type="number" 
                            min="0"
                            step="any"
                            value={part.bomQty}
                            onChange={(e) => handleRowDataChange(part.id, 'bomQty', e.target.value)}
                            className="w-full text-center px-1 py-1 bg-transparent border border-transparent focus:border-blue-300 focus:bg-white rounded focus:outline-none text-slate-900 font-semibold text-base"
                            placeholder=""
                            style={{ fontFamily: 'inherit' }}
                          />
                        </td>

                        <td className="px-1 py-1 border-r border-slate-300 text-center">
                          <input type="text" value={part.method} onChange={(e) => handleRowDataChange(part.id, 'method', e.target.value)} className="w-full text-center px-1 py-1 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-200 rounded text-slate-600" style={{ fontFamily: 'inherit' }} />
                        </td>
                        <td className="px-1 py-1 border-r border-slate-300 text-center">
                          <input type="text" value={part.place} onChange={(e) => handleRowDataChange(part.id, 'place', e.target.value)} className="w-full text-center px-1 py-1 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-200 rounded text-slate-600" style={{ fontFamily: 'inherit' }} />
                        </td>
                        <td className="px-1 py-1 border-r border-slate-300 text-center">
                          <input type="text" value={part.station} onChange={(e) => handleRowDataChange(part.id, 'station', e.target.value)} className="w-full text-center px-1 py-1 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-200 rounded text-slate-600" style={{ fontFamily: 'inherit' }} />
                        </td>
                        <td className="px-2 py-1">
                          <input type="text" value={part.remark} onChange={(e) => handleRowDataChange(part.id, 'remark', e.target.value)} className="w-full px-1 py-1 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-200 rounded text-red-600" style={{ fontFamily: 'inherit' }} />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-8 text-center text-slate-500">
                      ไม่พบข้อมูลที่ค้นหา
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-slate-50 border-t-2 border-slate-300">
                <tr>
                  <td colSpan="4" className="px-6 py-3 text-right font-semibold text-slate-700 border-r border-slate-300 text-base">รวม BOM Q'ty ทั้งหมด :</td>
                  <td className="px-2 py-3 text-center font-bold text-blue-700 text-base border-r border-slate-300 bg-blue-100">{displayTotalQuantity}</td>
                  <td colSpan="4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-white border-2 border-slate-400 flex flex-col pt-4 pb-6 px-6 rounded-md shadow-sm mt-8">
          <div className="flex w-full mb-8">
            <div className="w-24 font-semibold text-base text-slate-700 py-1">Remark :</div>
            <div className="flex-1 border-l-2 border-slate-200 pl-4">
               <textarea 
                  value={jobInfo.globalRemark}
                  onChange={handleJobInfoChange}
                  name="globalRemark"
                  className="w-full h-16 resize-none focus:outline-none leading-relaxed text-base text-slate-700 bg-transparent"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, #cbd5e1 24px)',
                    lineHeight: '24px',
                    padding: '0',
                    border: 'none',
                    fontFamily: 'inherit'
                  }}
                  placeholder="เพิ่มหมายเหตุเพิ่มเติมที่นี่..."
               />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <table className="w-[450px] border-collapse border border-slate-300 text-base text-center text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border border-slate-300 font-medium py-2 w-1/3">ผู้แตก BOM</th>
                  <th className="border border-slate-300 font-medium py-2 w-1/3">ผู้ตรวจสอบ</th>
                  <th className="border border-slate-300 font-medium py-2 w-1/3">วันที่</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 h-16 align-bottom pb-2"></td>
                  <td className="border border-slate-300 h-16 align-bottom pb-2"></td>
                  <td className="border border-slate-300 h-16 align-bottom pb-2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <ImageModal 
          isOpen={imageModal.isOpen}
          part={imageModal.part}
          onClose={closeImageModal}
          onImageUpload={handleImageUpload}
          onRemoveImage={handleRemoveImage}
        />

      </main>
    </div>
  );
}
