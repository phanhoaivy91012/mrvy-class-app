'use server';

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const SECRET_KEY = process.env.SECRET_KEY || "MRVY_SECRET_2026_@!";
const HASH_SALT = process.env.HASH_SALT || "MRVY_SALT_2026_#$";
const GAS_DRIVE_WEBHOOK_URL = process.env.GAS_DRIVE_WEBHOOK_URL || "";

// ================= HỆ THỐNG BẢO MẬT (GIỮ NGUYÊN LOGIC CŨ) =================
function hashPassword(pass) {
  if (!pass && pass !== 0) return '';
  return crypto.createHash('sha256').update(String(pass).trim() + HASH_SALT, 'utf8').digest('hex');
}

function generateSecureToken(username, role) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString('base64');
  const payload = Buffer.from(JSON.stringify({ usr: username, role: role, exp: Date.now() + 86400000 })).toString('base64');
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(header + "." + payload).digest('base64');
  return `${header}.${payload}.${signature}`;
}

function verifyAuthToken(token) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const sig = crypto.createHmac('sha256', SECRET_KEY).update(parts[0] + "." + parts[1]).digest('base64');
  if (sig !== parts[2]) return false;
  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
    if (payload.exp < Date.now()) return false;
    return String(payload.role).toLowerCase();
  } catch (e) {
    return false;
  }
}

function enforceRole(token, group) {
  const role = verifyAuthToken(token);
  if (!role) throw new Error('CẢNH BÁO BẢO MẬT: Phiên đăng nhập không hợp lệ hoặc đã hết hạn!');
  if (role === 'admin' || group === 'ANY') return true;
  if (group === 'ADMIN') throw new Error('Từ chối: Yêu cầu quyền Admin!');
  if (group === 'HOC_TAP' && role !== 'lopphohoctap' && !role.includes('học tập') && !role.includes('hoc tap')) throw new Error('Từ chối: Yêu cầu quyền Lớp phó học tập!');
  if (group === 'KY_LUAT' && role !== 'lopphokyluat' && !role.includes('kỷ luật') && !role.includes('trật tự')) throw new Error('Từ chối: Yêu cầu quyền Lớp phó kỷ luật!');
  if (group === 'THU_QUY' && role !== 'thuquy' && !role.includes('thủ quỹ') && !role.includes('thu quy')) throw new Error('Từ chối: Yêu cầu quyền Thủ quỹ!');
  if (group === 'MANAGER' && role !== 'loptruong' && !role.includes('lớp trưởng') && role !== 'bithu' && !role.includes('bí thư')) throw new Error('Từ chối: Yêu cầu quyền Lớp trưởng/Bí thư!');
  return true;
}

function getVNDateString() {
  const now = new Date(new Date().getTime() + 7 * 3600 * 1000);
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = now.getUTCFullYear();
  const hh = String(now.getUTCHours()).padStart(2, '0');
  const min = String(now.getUTCMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

// ================= CÁC HÀM XỬ LÝ CHÍNH =================
export async function getPublicAppConfig() {
  const defaultCfg = { logoUrl: '', brandTitle: 'MR Vy', brandSub: 'Hệ thống quản lý', headerSlogan: '10A14 - Đoàn Kết - Học Tốt' };
  try {
    const { data } = await supabase.from('app_config').select('*');
    if (data) data.forEach(r => { if (r.key) defaultCfg[r.key] = r.value || ''; });
  } catch (e) {}
  return defaultCfg;
}

export async function loginUser(username, password) {
  try {
    const u = String(username || '').trim().toLowerCase();
    const p = String(password || '').trim();

    const { data: attempt } = await supabase.from('login_attempts').select('*').eq('username', u).maybeSingle();
    if (attempt && attempt.locked_until && new Date(attempt.locked_until) > new Date()) {
      return { success: false, message: "Tài khoản bị khóa 5 phút do nhập sai quá 5 lần!" };
    }

    const { data: users } = await supabase.from('users').select('*');
    const userRow = (users || []).find(row => String(row.username).trim().toLowerCase() === u);
    const currentFail = (attempt && attempt.locked_until && new Date(attempt.locked_until) <= new Date()) ? 0 : (attempt?.fail_count || 0);

    if (!userRow) {
      const nextFail = currentFail + 1;
      await supabase.from('login_attempts').upsert({
        username: u, fail_count: nextFail,
        locked_until: nextFail >= 5 ? new Date(Date.now() + 300000).toISOString() : null
      });
      return { success: false, message: 'Tên đăng nhập không tồn tại!' };
    }

    const inputHash = hashPassword(p);
    const storedPass = String(userRow.password || '').trim();

    if (storedPass === inputHash || storedPass === p) {
      await supabase.from('login_attempts').delete().eq('username', u);
      if (storedPass !== inputHash) {
        await supabase.from('users').update({ password: inputHash }).eq('username', userRow.username);
      }
      const role = String(userRow.role || 'STUDENT').trim();
      const token = generateSecureToken(u, role);
      return {
        success: true, token,
        user: { username: String(userRow.username).trim(), hoTen: String(userRow.ho_ten || '').trim(), role }
      };
    } else {
      const nextFail = currentFail + 1;
      await supabase.from('login_attempts').upsert({
        username: u, fail_count: nextFail,
        locked_until: nextFail >= 5 ? new Date(Date.now() + 300000).toISOString() : null
      });
      return { success: false, message: `Sai mật khẩu! (Sai ${nextFail}/5 lần)` };
    }
  } catch (err) {
    return { success: false, message: 'Lỗi: ' + err.message };
  }
}

export async function changeUserPassword(username, oldPass, newPass, authToken) {
  try {
    enforceRole(authToken, 'ANY');
    if (!newPass) return { success: false, message: 'Mật khẩu mới không hợp lệ!' };
    const { data: users } = await supabase.from('users').select('*');
    const userRow = (users || []).find(r => String(r.username).trim().toLowerCase() === String(username).trim().toLowerCase());
    if (!userRow) return { success: false, message: 'Không tìm thấy tài khoản!' };

    const inputOldHash = hashPassword(oldPass);
    if (userRow.password !== inputOldHash && userRow.password !== String(oldPass).trim()) {
      return { success: false, message: 'Mật khẩu hiện tại không chính xác!' };
    }
    await supabase.from('users').update({ password: hashPassword(newPass) }).eq('username', userRow.username);
    return { success: true, message: 'Đổi mật khẩu thành công!' };
  } catch (err) {
    return { success: false, message: 'Lỗi: ' + err.message };
  }
}

export async function getInitialData(authToken) {
  const role = verifyAuthToken(authToken);
  const appConfig = await getPublicAppConfig();
  if (!role) {
    return {
      students: [], tasks: [], bonusPoints: [], violations: [], funds: [],
      tkbData: { grid: [], notes: { truong: [], nha: [] } }, appConfig
    };
  }

  const isAdminUser = (role === 'admin');
  const [uRes, tRes, bRes, vRes, fRes, tkbRes] = await Promise.all([
    supabase.from('users').select('*').order('stt', { ascending: true }),
    supabase.from('cong_viec').select('*').order('created_at', { ascending: false }),
    supabase.from('diem_cong').select('*').order('created_at', { ascending: false }),
    supabase.from('vi_pham').select('*').order('created_at', { ascending: false }),
    supabase.from('quy_lop').select('*').order('created_at', { ascending: false }),
    supabase.from('tkb').select('*')
  ]);

  const students = (uRes.data || [])
    .filter(u => u.username && String(u.role || '').toLowerCase() !== 'admin')
    .map(u => ({
      maHS: u.username,
      password: isAdminUser ? '••••••' : '',
      hoTen: u.ho_ten || '',
      role: u.role || 'STUDENT',
      gioiTinh: u.gioi_tinh || '',
      ngaySinh: isAdminUser ? (u.ngay_sinh || '') : '',
      soHS: isAdminUser ? (u.so_hs || '') : '',
      soPH: isAdminUser ? (u.so_ph || '') : ''
    }));

  const tasks = (tRes.data || []).map(t => {
    let taskMonth = 'all';
    if (t.ngay_tao) {
      const parts = String(t.ngay_tao).split('/');
      if (parts.length >= 2) taskMonth = String(parseInt(parts[1]));
    }
    return {
      id: t.id, tieuDe: t.tieu_de, noiDung: t.noi_dung, link: t.link_dinh_kem,
      file: t.file_dinh_kem, nguoiGiao: t.nguoi_giao, hanChot: t.han_chot,
      assignees: Array.isArray(t.danh_sach_hs) ? t.danh_sach_hs : [],
      ngayTao: t.ngay_tao, thang: taskMonth
    };
  });

  const bonusPoints = (bRes.data || []).map(b => ({
    id: b.id, maHS: b.ma_hs, hoTen: b.ho_ten, monHoc: b.mon_hoc,
    diem: parseFloat(b.diem) || 0, soCong: b.so_cong || '', quyUoc: b.quy_uoc || '',
    lyDo: b.ly_do || '', ngay: b.ngay_tao || '', nguoiNhap: b.nguoi_nhap || ''
  }));

  const violations = (vRes.data || []).map(v => ({
    id: v.id, maHS: v.ma_hs, hoTen: v.ho_ten, loai: v.loai || 'TRU',
    danhMuc: v.danh_muc || '', diem: parseFloat(v.diem) || 0,
    chiTiet: v.chi_tiet || '', ngay: v.ngay_tao || '', nguoiNhap: v.nguoi_nhap || ''
  }));

  const funds = (fRes.data || []).map(f => ({
    id: f.id, loai: ['THU', 'CHI', 'THUONG'].includes(f.loai) ? f.loai : 'THU',
    tenKhoanThu: f.ten_khoan, soTien: parseFloat(f.so_tien) || 0,
    hanDong: f.han_dong || 'Không có',
    daDong: f.danh_sach_da_dong ? String(f.danh_sach_da_dong).split(',').map(x => x.trim()).filter(Boolean) : [],
    ngayTao: f.ngay_tao || '', nguoiNhap: f.nguoi_nhap || ''
  }));

  let tkbData = { grid: [], notes: { truong: [], nha: [] } };
  (tkbRes.data || []).forEach(r => {
    if (r.key === 'TKB_GRID') tkbData.grid = r.data_json || [];
    if (r.key === 'NOTES_DATA') tkbData.notes = r.data_json || { truong: [], nha: [] };
  });

  return { students, tasks, bonusPoints, violations, funds, tkbData, appConfig };
}

export async function updateStudentAccount(studentObj, authToken) {
  try {
    enforceRole(authToken, 'ADMIN');
    const updatePayload = {
      ho_ten: String(studentObj.hoTen || ''),
      role: String(studentObj.role || 'STUDENT'),
      gioi_tinh: String(studentObj.gioiTinh || ''),
      ngay_sinh: String(studentObj.ngaySinh || ''),
      so_hs: String(studentObj.soHS || ''),
      so_ph: String(studentObj.soPH || '')
    };
    if (studentObj.password && studentObj.password !== '••••••') {
      updatePayload.password = hashPassword(studentObj.password);
    }
    const { error } = await supabase.from('users').update(updatePayload).ilike('username', String(studentObj.maHS).trim());
    if (error) return { success: false, message: error.message };
    return { success: true };
  } catch (e) { return { success: false, message: e.message }; }
}

export async function saveAppConfig(configObj, authToken) {
  try {
    enforceRole(authToken, 'ADMIN');
    await supabase.from('app_config').upsert([
      { key: 'logoUrl', value: configObj.logoUrl || '' },
      { key: 'brandTitle', value: configObj.brandTitle || 'MR Vy' },
      { key: 'brandSub', value: configObj.brandSub || 'Hệ thống quản lý' },
      { key: 'headerSlogan', value: configObj.headerSlogan || '10A14 - Đoàn Kết - Học Tốt' }
    ]);
    return { success: true };
  } catch (e) { return { success: false, message: e.message }; }
}

export async function saveTKBPackage(gridData, notesData, authToken) {
  try {
    enforceRole(authToken, 'HOC_TAP');
    await supabase.from('tkb').upsert([
      { key: 'TKB_GRID', data_json: gridData },
      { key: 'NOTES_DATA', data_json: notesData }
    ]);
    return { success: true };
  } catch (err) { return { success: false, message: err.message }; }
}

export async function createTaskWithFile(formObj, fileData, authToken) {
  try {
    enforceRole(authToken, 'MANAGER');
    let fileUrl = '';
    // Đẩy file qua Google Drive Folder thông qua Webhook GAS của bạn
    if (fileData && fileData.base64 && GAS_DRIVE_WEBHOOK_URL) {
      const driveRes = await fetch(GAS_DRIVE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          secret: SECRET_KEY,
          fileName: fileData.fileName,
          mimeType: fileData.mimeType,
          base64: fileData.base64
        })
      });
      const driveJson = await driveRes.json();
      if (driveJson && driveJson.success) {
        fileUrl = driveJson.fileUrl;
      } else {
        throw new Error(driveJson?.message || 'Lỗi tải file lên Google Drive');
      }
    }

    await supabase.from('cong_viec').insert({
      id: 'CV_' + Date.now(),
      tieu_de: formObj.tieuDe,
      noi_dung: formObj.noiDung,
      link_dinh_kem: formObj.link || '',
      file_dinh_kem: fileUrl,
      nguoi_giao: formObj.nguoiGiao,
      han_chot: formObj.hanChot || 'Không thời hạn',
      danh_sach_hs: formObj.assignees || [],
      ngay_tao: getVNDateString()
    });
    return { success: true };
  } catch (err) { return { success: false, message: err.message }; }
}

export async function toggleTaskStatus(taskId, username, isDone, authToken) {
  try {
    enforceRole(authToken, 'ANY');
    const { data: task } = await supabase.from('cong_viec').select('danh_sach_hs').eq('id', String(taskId)).single();
    if (!task) return { success: false, message: 'Không tìm thấy ID công việc' };
    const assignees = (task.danh_sach_hs || []).map(a => {
      if (String(a.maHS).toLowerCase() === String(username).toLowerCase()) return { ...a, done: isDone };
      return a;
    });
    await supabase.from('cong_viec').update({ danh_sach_hs: assignees }).eq('id', String(taskId));
    return { success: true };
  } catch (err) { return { success: false, message: err.message }; }
}

export async function updateTaskDetails(taskObj, authToken) {
  try {
    enforceRole(authToken, 'MANAGER');
    await supabase.from('cong_viec').update({
      tieu_de: taskObj.tieuDe,
      noi_dung: taskObj.noiDung,
      link_dinh_kem: taskObj.link || '',
      han_chot: taskObj.hanChot || 'Không thời hạn',
      danh_sach_hs: taskObj.assignees
    }).eq('id', String(taskObj.id));
    return { success: true };
  } catch (err) { return { success: false, message: err.message }; }
}

export async function deleteTask(taskId, authToken) {
  try {
    enforceRole(authToken, 'ADMIN');
    await supabase.from('cong_viec').delete().eq('id', String(taskId));
    return { success: true };
  } catch (e) { return { success: false, message: e.message }; }
}

export async function penalizeUnfinishedTaskStudents(taskId, authToken) {
  try {
    enforceRole(authToken, 'ADMIN');
    const { data: task } = await supabase.from('cong_viec').select('*').eq('id', String(taskId)).single();
    if (!task) return { success: false, message: 'Không tìm thấy nhiệm vụ!' };
    const uncompleted = (task.danh_sach_hs || []).filter(a => !a.done);
    if (uncompleted.length === 0) return { success: false, message: 'Tất cả học sinh đều đã hoàn thành nhiệm vụ này!' };

    const now = Date.now();
    const dateStr = getVNDateString();
    const currentMonth = new Date().getMonth() + 1;
    const rows = uncompleted.map((st, idx) => ({
      id: 'VP_' + (now + idx),
      ma_hs: st.maHS, ho_ten: st.hoTen, loai: 'TRU',
      danh_muc: 'Không hoàn thành NV', diem: -1,
      chi_tiet: 'Chưa xong: ' + task.tieu_de,
      ngay_tao: dateStr, nguoi_nhap: 'Hệ thống (Phạt theo nhiệm vụ)'
    }));
    await supabase.from('vi_pham').insert(rows);
    return { success: true, count: uncompleted.length, month: currentMonth };
  } catch (e) { return { success: false, message: e.message }; }
}

export async function getVpPresetsConfig() {
  try {
    const { data } = await supabase.from('vp_presets').select('*').order('id', { ascending: true });
    let presets = { TRU: [], CONG: [] };
    if (data && data.length > 0) {
      data.forEach(r => {
        if (r.ten_muc && !r.ten_muc.startsWith('Khác')) {
          if (r.loai === 'TRU') presets.TRU.push({ name: r.ten_muc.trim(), score: parseFloat(r.diem) || 0 });
          if (r.loai === 'CONG') presets.CONG.push({ name: r.ten_muc.trim(), score: parseFloat(r.diem) || 0 });
        }
      });
    }
    presets.TRU.push({ name: "Khác... (Tự nhập điểm & ghi chú)", score: 0 });
    presets.CONG.push({ name: "Khác... (Tự nhập điểm & ghi chú)", score: 0 });
    return presets;
  } catch (e) { return null; }
}

export async function saveVpPresetsConfig(presetsObj, authToken) {
  try {
    enforceRole(authToken, 'KY_LUAT');
    await supabase.from('vp_presets').delete().neq('id', 0);
    const rows = [];
    (presetsObj.TRU || []).forEach(p => { if (p.name && !p.name.startsWith('Khác')) rows.push({ loai: 'TRU', ten_muc: p.name, diem: p.score }); });
    (presetsObj.CONG || []).forEach(p => { if (p.name && !p.name.startsWith('Khác')) rows.push({ loai: 'CONG', ten_muc: p.name, diem: p.score }); });
    if (rows.length > 0) await supabase.from('vp_presets').insert(rows);
    return { success: true };
  } catch (e) { return { success: false, message: e.message }; }
}

export async function addBatchViolations(batchObj, authToken) {
  try {
    enforceRole(authToken, 'KY_LUAT');
    const today = getVNDateString();
    const now = Date.now();
    const rows = batchObj.students.map((st, idx) => ({
      id: 'VP_' + (now + idx), ma_hs: st.maHS, ho_ten: st.hoTen,
      loai: batchObj.loai, danh_muc: batchObj.danhMuc, diem: batchObj.diem,
      chi_tiet: batchObj.chiTiet, ngay_tao: today, nguoi_nhap: batchObj.nguoiNhap
    }));
    if (rows.length > 0) await supabase.from('vi_pham').insert(rows);
    return { success: true };
  } catch (e) { return { success: false, message: e.message }; }
}

export async function deleteViolationRecord(id, authToken) {
  try {
    enforceRole(authToken, 'KY_LUAT');
    await supabase.from('vi_pham').delete().eq('id', String(id));
    return { success: true };
  } catch (e) { return { success: false, message: e.message }; }
}

export async function createFundTransaction(fundObj, authToken) {
  try {
    enforceRole(authToken, 'THU_QUY');
    await supabase.from('quy_lop').insert({
      id: 'F_' + Date.now(), loai: fundObj.loai, ten_khoan: fundObj.tenKhoan,
      so_tien: fundObj.soTien, han_dong: fundObj.hanDong || 'Không thời hạn',
      danh_sach_da_dong: '', ngay_tao: getVNDateString(), nguoi_nhap: fundObj.nguoiNhap
    });
    return { success: true };
  } catch (e) { return { success: false, message: e.message }; }
}

export async function updateFundPaidList(fundId, paidListArray, authToken) {
  try {
    enforceRole(authToken, 'THU_QUY');
    await supabase.from('quy_lop').update({ danh_sach_da_dong: paidListArray.join(',') }).eq('id', String(fundId));
    return { success: true };
  } catch (e) { return { success: false, message: e.message }; }
}

export async function deleteFundTransaction(fundId, authToken) {
  try {
    enforceRole(authToken, 'THU_QUY');
    await supabase.from('quy_lop').delete().eq('id', String(fundId));
    return { success: true };
  } catch (e) { return { success: false, message: e.message }; }
}

export async function addBatchBonusPoints(batchObj, authToken) {
  try {
    enforceRole(authToken, 'HOC_TAP');
    const today = getVNDateString();
    const now = Date.now();
    const rows = batchObj.students.map((st, idx) => ({
      id: 'DC_' + (now + idx), ma_hs: st.maHS, ho_ten: st.hoTen,
      mon_hoc: batchObj.monHoc, diem: batchObj.diem, so_cong: String(batchObj.soCong || '1'),
      quy_uoc: batchObj.quyUoc, ly_do: batchObj.lyDo, ngay_tao: today, nguoi_nhap: batchObj.nguoiNhap
    }));
    if (rows.length > 0) await supabase.from('diem_cong').insert(rows);
    return { success: true };
  } catch (e) { return { success: false, message: e.message }; }
}

export async function updateBonusPoint(item, authToken) {
  try {
    enforceRole(authToken, 'HOC_TAP');
    await supabase.from('diem_cong').update({
      mon_hoc: item.monHoc, diem: item.diem, ly_do: item.lyDo
    }).eq('id', String(item.id));
    return { success: true };
  } catch (e) { return { success: false, message: e.message }; }
}

export async function deleteBonusPoint(id, authToken) {
  try {
    enforceRole(authToken, 'HOC_TAP');
    await supabase.from('diem_cong').delete().eq('id', String(id));
