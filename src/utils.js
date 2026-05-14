export const parseBomCsv = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split(/\r?\n/);
        
        if (lines.length < 2) {
          throw new Error("ไฟล์ว่างเปล่าหรือมีข้อมูลไม่เพียงพอ");
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const partIdx = headers.findIndex(h => h.toLowerCase().trim() === 'part id' || h.toLowerCase().trim() === 'part no.');
        const qtyIdx = headers.findIndex(h => h.toLowerCase().trim() === 'quantity' || h.toLowerCase().trim() === 'qty.');

        if (partIdx === -1 || qtyIdx === -1) {
          throw new Error('รูปแบบไฟล์ CSV ไม่ถูกต้อง! ไม่พบคอลัมน์ Part ID/Part No. หรือ Quantity/Qty.');
        }

        const qtyMap = {};
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          if (!line.trim()) continue;
          
          const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
          const cols = line.split(regex).map(c => c.trim().replace(/^"|"$/g, ''));
          
          const partNo = cols[partIdx];
          const qty = parseFloat(cols[qtyIdx]) || 0;
          
          if (partNo && qty > 0) {
            qtyMap[partNo] = (qtyMap[partNo] || 0) + qty;
          }
        }

        resolve(qtyMap);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("เกิดข้อผิดพลาดขณะอ่านไฟล์"));
    };

    reader.readAsText(file);
  });
};

export const exportToCsv = (data, filename = 'export.csv') => {
  // กำหนดหัวคอลัมน์ของไฟล์ CSV
  const headers = ['หมวดงาน', 'Part ID', 'Part Name', "BOM Q'ty", 'Method', 'Place', 'Station', 'หมายเหตุ'];

  // ฟังก์ชันสำหรับครอบเครื่องหมายคำพูด (ป้องกันกรณีที่มีเครื่องหมายคอมม่าในข้อความ)
  const escapeCsv = (str) => `"${(str || '').toString().replace(/"/g, '""')}"`;

  // แมปข้อมูลให้อยู่ในรูปแบบ Array ของแต่ละแถว
  const rows = data.map(part => [
    escapeCsv(part.category),
    escapeCsv(part.partNo),
    escapeCsv(part.description),
    escapeCsv(part.bomQty !== '' ? part.bomQty : 0),
    escapeCsv(part.method),
    escapeCsv(part.place),
    escapeCsv(part.station),
    escapeCsv(part.remark)
  ]);

  // ใส่ \uFEFF (BOM) เพื่อให้ Excel อ่านภาษาไทยเป็น UTF-8 ได้อย่างถูกต้อง
  const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows.map(e => e.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
