import React from 'react';
import { X, Upload, Trash2 } from 'lucide-react';

const ImageModal = ({ isOpen, part, onClose, onImageUpload, onRemoveImage }) => {
  if (!isOpen || !part) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-70 backdrop-blur-sm px-4 print:hidden" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden transform transition-all flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()} style={{ fontFamily: '"supermarket", "Prompt", "Kanit", sans-serif' }}>
        
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0">
          <h3 className="font-semibold text-2xl text-slate-800 flex items-center gap-3">
            <span className="bg-slate-100 px-3 py-1.5 rounded text-lg text-slate-600 border border-slate-200">{part.partNo}</span>
            {part.description}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors">
            <X className="h-8 w-8" />
          </button>
        </div>
        
        <div className="p-6 bg-slate-50 flex-grow overflow-y-auto border-b border-slate-100 relative min-h-[50vh] flex items-center justify-center">
          <div className="w-full flex flex-col items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            {part.image ? (
              <>
                <img
                  src={part.image}
                  alt="Uploaded"
                  className="w-full max-h-[60vh] object-contain rounded-md shadow-sm bg-slate-50 border border-slate-200"
                />
                <div className="mt-4 flex gap-3">
                  <label className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded shadow-sm cursor-pointer font-medium transition-colors text-sm flex items-center gap-1.5">
                    <Upload className="h-4 w-4" /> เปลี่ยนรูปภาพ
                    <input type="file" accept="image/*" className="hidden" onChange={onImageUpload} />
                  </label>
                  <button 
                    onClick={onRemoveImage}
                    className="px-3 py-1.5 bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded shadow-sm font-medium transition-colors text-sm flex items-center gap-1.5"
                  >
                    <Trash2 className="h-4 w-4" /> ลบรูปภาพ
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center w-full aspect-video max-h-[60vh] min-h-[350px] border-4 border-dashed border-slate-300 rounded-xl bg-slate-50">
                <span className="text-xl text-slate-400 font-medium mb-4">ไม่มีรูปภาพ</span>
                <label className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg shadow-sm cursor-pointer font-medium transition-colors text-sm flex items-center gap-2">
                  <Upload className="h-4 w-4" /> อัปโหลดรูปภาพ
                  <input type="file" accept="image/*" className="hidden" onChange={onImageUpload} />
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-white flex-shrink-0">
          <div className="flex flex-col gap-3">
            <p className="text-lg text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-900 inline-block w-28">รายละเอียด :</span> {part.detail || '-'}
            </p>
            {part.remark && (
              <p className="text-lg text-red-600 leading-relaxed">
                <span className="font-semibold inline-block w-28">หมายเหตุ :</span> {part.remark}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
