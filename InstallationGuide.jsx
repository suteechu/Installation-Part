import React from 'react';
import { BookText } from 'lucide-react';

export function InstallationGuide() {
  return (
    <div className="bg-[#181a20] border-b border-[#2b3139] p-3 shrink-0">
      <div className="flex items-center gap-2 mb-2">
        <BookText size={16} className="text-[#4ea8de]" />
        <span className="font-mono text-sm font-bold text-white">คู่มือติดตั้ง: ผนังภายนอก (POS 11)</span>
      </div>
      <div className="text-xs font-mono text-gray-400 space-y-1">
        <p>
          <span className="font-bold text-yellow-300">กรณีเกิดช่องเปิด (Gap):</span>
        </p>
        <p className="pl-2">
          เมื่อเกิดช่องเปิดที่ตำแหน่ง 11 ซึ่งไม่มีการติดตั้งประตูหรือหน้าต่าง จะต้องใช้วัสดุปิดขอบเพื่อความเรียบร้อยและป้องกันน้ำ
        </p>
        <div>
          <p className="font-bold text-gray-300 pl-2">วัสดุที่แนะนำ:</p>
          <ul className="list-disc list-inside pl-4 text-gray-500">
            <li>Flashing Cover (วัสดุปิดขอบ)</li>
            <li>Support Angle (เหล็กฉากรองรับ)</li>
            <li>Sealant (วัสดุอุดรอยต่อ)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}