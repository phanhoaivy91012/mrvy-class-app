// Nhận diện TKB cục bộ: tìm khung ô bằng Canvas, sau đó OCR chữ bằng Tesseract.js.
// Không gọi Gemini, không gửi ảnh đến dịch vụ nhận diện AI.
// Tesseract cần tải worker và dữ liệu ngôn ngữ từ CDN khi mới sử dụng.

const ROW_IDS = ['S1', 'S2', 'S3', 'S4', 'S5', 'C1', 'C2', 'C3', 'C4'];

function groupCoordinates(coords, gap = 3) {
  const groups = [];
  for (const n of coords) {
    if (!groups.length || n - groups[groups.length - 1].end > gap) groups.push({ start: n, end: n });
    else groups[groups.length - 1].end = n;
  }
  return groups.map(g => ({ ...g, middle: Math.round((g.start + g.end) / 2) }));
}

function median(numbers) {
  const arr = numbers.slice().sort((a, b) => a - b);
  if (!arr.length) return 0;
  return arr[Math.floor(arr.length / 2)];
}

function closeLine(lines, target, tolerance = 7) {
  const candidate = lines.slice().sort((a, b) => Math.abs(a - target) - Math.abs(b - target))[0];
  if (candidate === undefined || Math.abs(candidate - target) > tolerance) throw new Error('Không xác định được ranh giới hàng TKB. Hãy gửi ảnh rõ, đủ toàn bảng.');
  return candidate;
}

export function detectTKBGeometry(canvas) {
  const { width: W, height: H } = canvas;
  if (W < 500 || H < 300) throw new Error('Ảnh quá nhỏ. Hãy dùng ảnh có chiều rộng tối thiểu 500 px và đủ cả hai buổi.');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Trình duyệt không hỗ trợ Canvas.');
  const pixels = ctx.getImageData(0, 0, W, H).data;
  const dark = (x, y) => {
    const k = (y * W + x) * 4;
    return pixels[k] < 145 && pixels[k + 1] < 145 && pixels[k + 2] < 145;
  };
  // Tìm các vạch ngang kéo dài trên phần lớn bề rộng bảng.
  const horizontalIndexes = [];
  for (let y = 1; y < H - 1; y++) {
    let count = 0, total = 0;
    for (let x = 6; x < W - 6; x += 3) { count += dark(x, y) ? 1 : 0; total++; }
    if (count / total > 0.55) horizontalIndexes.push(y);
  }
  const horizontals = groupCoordinates(horizontalIndexes).map(g => g.middle);

  // Tìm hai dải tiêu đề xanh nhạt: Thứ 2... ở buổi sáng và buổi chiều.
  // Kiểm tra màu chứ không dựa vào vị trí cố định trên ảnh.
  const blueIndexes = [];
  for (let y = 1; y < H - 1; y++) {
    let count = 0, total = 0;
    for (let x = Math.max(8, Math.round(W * 0.09)); x < Math.round(W * 0.89); x += 5) {
      const k = (y * W + x) * 4;
      const r = pixels[k], b = pixels[k + 2];
      count += (b > r + 8 && b > 198 && r > 150 && r < 245) ? 1 : 0;
      total++;
    }
    if (total && count / total > 0.55) blueIndexes.push(y);
  }
  const blueBands = groupCoordinates(blueIndexes, 3).filter(g => g.end - g.start >= 7);
  if (blueBands.length < 2) throw new Error('Không tìm thấy 2 hàng tiêu đề màu xanh (sáng/chiều). Chức năng này dành cho mẫu TKB đã gửi.');
  const morningHeader = blueBands[0], afternoonHeader = blueBands[1];
  const morningTop = closeLine(horizontals, morningHeader.end + 1);
  const afternoonTop = closeLine(horizontals, afternoonHeader.end + 1);
  const morningBottom = horizontals.filter(y => y > morningTop + 40 && y < afternoonHeader.start - 10).pop();
  if (!morningBottom) throw new Error('Thiếu đường kẻ cuối phần buổi sáng.');
  const morningLines = horizontals.filter(y => y >= morningTop && y <= morningBottom);
  const afternoonLines = horizontals.filter(y => y >= afternoonTop);
  if (morningLines.length !== 6 || afternoonLines.length !== 5) {
    throw new Error(`Không xác định đủ hàng: sáng thấy ${Math.max(0, morningLines.length - 1)}/5 tiết; chiều thấy ${Math.max(0, afternoonLines.length - 1)}/4 tiết. Hãy chụp trọn bảng, không nghiêng.`);
  }
  const rows = ROW_IDS.map((id, idx) => {
    const line = idx < 5 ? morningLines : afternoonLines;
    const slot = idx < 5 ? idx : idx - 5;
    if (line[slot + 1] - line[slot] < 18) throw new Error('Có hàng tiết học quá hẹp để đọc chữ.');
    return { id, y1: line[slot], y2: line[slot + 1] };
  });

  // Dò đường kẻ dọc từ toàn bộ vùng tiết học, không dùng các tỷ lệ cột cố định.
  const verticalIndexes = [];
  const yStart = Math.max(1, morningTop + 4);
  const yStop = Math.min(H - 1, afternoonLines[afternoonLines.length - 1] - 2);
  for (let x = 1; x < W - 3; x++) {
    let count = 0, total = 0;
    for (let y = yStart; y < yStop; y += 3) { count += dark(x, y) ? 1 : 0; total++; }
    if (count / Math.max(1, total) > 0.53) verticalIndexes.push(x);
  }
  const vLines = groupCoordinates(verticalIndexes).map(g => g.middle);
  const gaps = vLines.slice(1).map((x, i) => x - vLines[i]);
  const typicalWidth = median(gaps.filter(d => d > W * 0.085)) || median(gaps);
  if (!typicalWidth || vLines.length < 5) throw new Error('Không đọc đủ đường kẻ cột Thứ 2...Thứ 6.');
  let firstDayLine = 0;
  // Nếu ảnh chứa vạch lề ngoài bên trái trước cột 'Tiết', bỏ qua vạch đó.
  if (vLines.length >= 3 && vLines[0] < Math.max(18, W * 0.025) && vLines[1] - vLines[0] < typicalWidth * 0.60) firstDayLine = 1;
  const bounds = [];
  for (let i = firstDayLine; i < vLines.length - 1 && bounds.length < 7; i++) {
    const dist = vLines[i + 1] - vLines[i];
    if (dist >= typicalWidth * 0.65 && dist <= typicalWidth * 1.45) {
      bounds.push({ x1: vLines[i], x2: vLines[i + 1] });
    } else if (bounds.length) break;
  }
  if (bounds.length < 5) throw new Error(`Chỉ xác định được ${bounds.length} cột ngày hoàn chỉnh, cần ít nhất Thứ 2–Thứ 6.`);
  return { rows, dayColumns: bounds, headerTop: morningHeader.start, width: W, height: H };
}

function asciiVN(s) {
  return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}

const SUBJECTS = [
  ['HĐTN-HN', ['hoat dong trai nghiem huong nghiep', 'hoat dong trai nghiem', 'trai nghiem huong nghiep', 'hdtn hn', 'hdtn']],
  ['GDĐP', ['noi dung giao duc cua dia phuong', 'noi dung giao duc dia phuong', 'giao duc dia phuong', 'gddp']],
  ['GDQP&AN', ['giao duc quoc phong va an ninh', 'giao duc quoc phong an ninh', 'quoc phong va an ninh', 'gdqp an', 'gdqpan']],
  ['GDKT&PL', ['giao duc kinh te va phap luat', 'giao duc kinh te phap luat', 'gdkt pl', 'gdktpl']],
  ['GDTC', ['giao duc the chat', 'giao duc the duc', 'gdtc']],
  ['Tiếng Anh', ['ngoai ngu', 'tieng anh', 'anh van']],
  ['Toán', ['toan hoc', 'toan']],
  ['Ngữ văn', ['ngu van', 'van hoc']],
  ['Vật lí', ['vat li', 'vat ly', 'vat li hoc']],
  ['Hóa học', ['hoa hoc', 'hoa']],
  ['Sinh học', ['sinh hoc']],
  ['Lịch sử', ['lich su']],
  ['Địa lí', ['dia li', 'dia ly']],
  ['Công nghệ', ['cong nghe']],
  ['Tin học', ['tin hoc']],
  ['Chào cờ', ['chao co']],
  ['Sinh hoạt', ['sinh hoat', 'sinh hoat lop']],
  ['Âm nhạc', ['am nhac']],
  ['Mĩ thuật', ['mi thuat', 'my thuat']]
];
function levenshtein(a, b) {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let old = prev[0]; prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, old + (a[i - 1] === b[j - 1] ? 0 : 1));
      old = temp;
    }
  }
  return prev[b.length];
}
export function normalizeRecognizedSubject(raw) {
  const text = String(raw || '').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return { value: '', uncertain: true };
  const key = asciiVN(text);
  if (!key || key.length < 2) return { value: text, uncertain: true };
  // Các cụm đặc trưng đủ dài, đọc thiếu 1-2 từ ở cuối vẫn xác định được môn.
  if (key.includes('hoat dong trai nghiem') || key.includes('trai nghiem huong nghiep')) {
    return { value: 'HĐTN-HN', uncertain: false };
  }
  if (key.includes('noi dung giao duc') && (key.includes('dia') || key.includes('phuong'))) {
    return { value: 'GDĐP', uncertain: false };
  }
  for (const [value, aliases] of SUBJECTS) {
    if (aliases.includes(key)) return { value, uncertain: false };
  }
  let best = { value: text, score: 0 };
  for (const [value, aliases] of SUBJECTS) {
    for (const alias of aliases) {
      const lenRatio = Math.min(key.length, alias.length) / Math.max(key.length, alias.length);
      if (lenRatio < 0.82) continue; // Không tự khôi phục tên môn bị cắt nửa chừng.
      const sim = 1 - levenshtein(key, alias) / Math.max(key.length, alias.length);
      if (sim > best.score) best = { value, score: sim };
    }
  }
  if (best.score >= 0.89) return { value: best.value, uncertain: false };
  return { value: text, uncertain: true };
}

export function nextMondayVietnamISO(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(now).filter(x => x.type !== 'literal').map(x => [x.type, Number(x.value)]));
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  const wd = date.getUTCDay();
  date.setUTCDate(date.getUTCDate() + 8 - (wd === 0 ? 7 : wd));
  return date.toISOString().slice(0, 10);
}

export function extractEffectiveDate(headerText) {
  // Chỉ tìm trong vùng thông tin phía trên bảng, không nhầm ngày ở hàng Thứ.
  const match = String(headerText || '').match(/\b(\d{1,2})\s*[\/\.\-]\s*(\d{1,2})\s*[\/\.\-]\s*(20\d{2})\b/);
  if (!match) return '';
  const d = +match[1], m = +match[2], y = +match[3];
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return '';
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function cropForOCR(src, x1, y1, x2, y2, scale = 2.5) {
  const sx = Math.max(0, Math.round(x1)); const sy = Math.max(0, Math.round(y1));
  const sw = Math.max(1, Math.round(x2 - x1)); const sh = Math.max(1, Math.round(y2 - y1));
  const out = document.createElement('canvas'); const pad = 16;
  out.width = Math.round(sw * scale) + pad * 2;
  out.height = Math.round(sh * scale) + pad * 2;
  const ctx = out.getContext('2d');
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, out.width, out.height);
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(src, sx, sy, sw, sh, pad, pad, out.width - pad * 2, out.height - pad * 2);
  return out;
}

function hasInk(canvas, box) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const x1 = Math.ceil(box.x1 + 5), x2 = Math.floor(box.x2 - 5);
  const y1 = Math.ceil(box.y1 + 6), y2 = Math.floor(box.y2 - 6);
  if (x1 >= x2 || y1 >= y2) return false;
  const data = ctx.getImageData(x1, y1, x2 - x1, y2 - y1).data;
  let count = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] < 155 && data[i + 1] < 155 && data[i + 2] < 155 && ++count > 18) return true;
  }
  return false;
}

async function loadLocalOCR() {
  if (typeof window === 'undefined') throw new Error('OCR chỉ chạy trong trình duyệt.');
  if (window.Tesseract) return window.Tesseract;
  if (!window.__MRVY_TESS_LOAD__) {
    window.__MRVY_TESS_LOAD__ = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      script.onload = () => window.Tesseract ? resolve(window.Tesseract) : reject(new Error('Không nạp được Tesseract.'));
      script.onerror = () => reject(new Error('Không tải được thư viện OCR. Kiểm tra kết nối Internet và thử lại.'));
      document.head.appendChild(script);
    }).catch(err => { window.__MRVY_TESS_LOAD__ = null; throw err; });
  }
  return window.__MRVY_TESS_LOAD__;
}

export async function scanTKBLocally(file, onProgress = () => {}) {
  if (!file || !/^image\/(png|jpeg|webp)$/i.test(file.type)) throw new Error('Chỉ hỗ trợ ảnh PNG, JPG hoặc WebP.');
  if (file.size > 18 * 1024 * 1024) throw new Error('Ảnh vượt 18 MB. Vui lòng giảm kích thước ảnh.');
  onProgress('Đang mở ảnh và dò ranh giới các ô...');
  const url = URL.createObjectURL(file);
  let worker = null;
  try {
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Không đọc được ảnh.'));
      image.src = url;
    });
    const scale = Math.min(1, 2600 / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const layout = detectTKBGeometry(canvas);

    onProgress('Đang nạp bộ OCR tiếng Việt ngay trên trình duyệt...');
    const Tess = await loadLocalOCR();
    worker = await Tess.createWorker(['vie', 'eng']);
    await worker.setParameters({ tessedit_pageseg_mode: '6', preserve_interword_spaces: '1' });
    onProgress('Đang tìm ngày bắt đầu áp dụng...');
    const header = cropForOCR(canvas, 1, 1, canvas.width - 2, Math.max(10, layout.headerTop - 2), 2.4);
    const headerData = await worker.recognize(header);
    const detectedDate = extractEffectiveDate(headerData?.data?.text || '');
    const effectiveDate = detectedDate || nextMondayVietnamISO();
    const warnings = [];
    if (!detectedDate) warnings.push('Không đọc được ngày hiệu lực trong ảnh: mặc định Thứ Hai tuần tới (' + effectiveDate.split('-').reverse().join('/') + '). Hãy kiểm tra lại.');
    if (layout.dayColumns.length < 7) warnings.push(`Ảnh chỉ chứa ${layout.dayColumns.length} cột ngày đầy đủ; các ngày còn lại để trống, không tự đoán.`);
    const grid = layout.rows.map(r => ({ id: r.id, cols: Array(7).fill('') }));
    const uncertainCells = [];
    const cells = [];
    layout.rows.forEach((row, ri) => layout.dayColumns.forEach((col, ci) => {
      const box = { x1: col.x1, x2: col.x2, y1: row.y1, y2: row.y2 };
      if (hasInk(canvas, box)) cells.push({ ri, ci, row, col });
    }));
    if (cells.length === 0) throw new Error('Không thấy chữ trong các ô TKB. Không thay đổi dữ liệu cũ.');
    for (let n = 0; n < cells.length; n++) {
      const { ri, ci, row, col } = cells[n];
      onProgress(`Đang nhận diện ô ${n + 1}/${cells.length} (${row.id}, Thứ ${ci + 2})...`);
      // Chỉ bỏ 3px đường kẻ, KHÔNG cắt theo phần trăm bề rộng làm mất tên môn dài.
      const crop = cropForOCR(canvas, col.x1 + 3, row.y1 + 3, col.x2 - 3, row.y2 - 3);
      const data = (await worker.recognize(crop)).data || {};
      const normalized = normalizeRecognizedSubject(data.text || '');
      grid[ri].cols[ci] = normalized.value.slice(0, 150);
      if (normalized.uncertain || (Number.isFinite(data.confidence) && data.confidence < 58)) {
        const ref = row.id + '-' + ci;
        uncertainCells.push(ref);
        warnings.push(`${row.id} / Thứ ${ci + 2}: đọc được “${normalized.value || '(chưa đọc được)'}” — cần đối chiếu ảnh gốc.`);
      }
    }
    return {
      grid, effectiveDate, dateSource: detectedDate ? 'image' : 'default',
      warnings, uncertainCells, completeDays: layout.dayColumns.length,
      scannedCount: cells.length
    };
  } finally {
    if (worker) await worker.terminate().catch(() => {});
    URL.revokeObjectURL(url);
  }
}
