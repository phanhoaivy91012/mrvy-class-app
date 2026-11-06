'use client';

import { useState, useEffect } from 'react';
import * as actions from '../actions';

export default function ClassAppPage() {
  const [authToken, setAuthToken] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [appData, setAppData] = useState({
    students: [], tasks: [], bonusPoints: [], violations: [], funds: [],
    tkbData: { grid: [], notes: { truong: [], nha: [] } },
    appConfig: { logoUrl: '', brandTitle: 'MR Vy', brandSub: 'Hệ thống quản lý', headerSlogan: '10A14 - Đoàn Kết - Học Tốt' }
  });

  const [activeTab, setActiveTab] = useState('tkb');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Anti-F12 protection
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','i','J','j','C','c'].includes(e.key)) || (e.ctrlKey && ['U','u','S','s'].includes(e.key))) {
        e.preventDefault(); e.stopPropagation(); return false;
      }
    };
    const handleContextMenu = (e) => { e.preventDefault(); return false; };
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('contextmenu', handleContextMenu, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('contextmenu', handleContextMenu, true);
    };
  }, []);

  async function handleLogin() {
    if (!loginUsername || !loginPassword) { alert('Vui lòng nhập đầy đủ tên đăng nhập & mật khẩu!'); return; }
    setLoginLoading(true);
    const res = await actions.loginUser(loginUsername, loginPassword);
    setLoginLoading(false);
    if (res.success) {
      setAuthToken(res.token);
      setCurrentUser(res.user);
      loadInitialData(res.token);
    } else {
      alert(res.message);
    }
  }

  async function loadInitialData(token) {
    const data = await actions.getInitialData(token || authToken);
    if (data) setAppData(data);
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a192f] px-4 py-8">
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 text-center">
          <img className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 border-emerald-500 shadow-lg" src={appData.appConfig.logoUrl || "https://via.placeholder.com/150"} alt="Logo" />
          <h2 className="text-2xl font-extrabold text-slate-800 mb-0.5">{appData.appConfig.brandTitle}</h2>
          <p className="text-xs text-slate-400 mb-6 font-semibold uppercase tracking-wider">{appData.appConfig.brandSub}</p>
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tên đăng nhập / Mã HS</label>
              <input type="text" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} className="w-full p-3 text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Mật khẩu</label>
              <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full p-3 text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <button onClick={handleLogin} disabled={loginLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 transition text-base flex items-center justify-center gap-2">
              <i className="fa-solid fa-right-to-bracket"></i> {loginLoading ? 'Đang vào...' : 'Đăng Nhập'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9] text-slate-800">
      <header className="bg-[#0a192f] text-white px-3 sm:px-6 py-2.5 sticky top-0 z-30 shadow-md">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <img className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-emerald-500 shadow" src={appData.appConfig.logoUrl || "https://via.placeholder.com/150"} alt="Logo" />
            <div>
              <div className="font-extrabold text-sm sm:text-lg tracking-wide text-white leading-tight">{appData.appConfig.brandTitle}</div>
              <div className="text-[9px] sm:text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">{appData.appConfig.brandSub}</div>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="bg-gradient-to-r from-blue-900/60 via-emerald-900/60 to-blue-900/60 border border-emerald-500/40 px-5 py-1.5 rounded-2xl shadow-inner text-center">
              <span className="font-black text-sm lg:text-base text-yellow-300 tracking-wider flex items-center gap-2">
                <i className="fa-solid fa-star text-amber-400 text-xs"></i> {appData.appConfig.headerSlogan} <i class="fa-solid fa-star text-amber-400 text-xs"></i>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 font-bold">
              <i class="fa-solid fa-circle-user text-emerald-400"></i> <span>{currentUser.hoTen}</span>
            </div>
            <button onClick={() => loadInitialData()} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition" title="Tải lại">
              <i class="fa-solid fa-arrows-rotate"></i>
            </button>
            <button onClick={() => location.reload()} className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl transition" title="Đăng xuất">
              <i class="fa-solid fa-power-off"></i>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col justify-between flex-shrink-0 z-40 p-4 space-y-1.5">
          <div className="space-y-1.5">
            <button onClick={() => setActiveTab('tkb')} className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'tkb' ? 'active-nav-btn' : 'hover:bg-slate-50 text-slate-600'}`}>
              <i className="fa-solid fa-calendar-days text-lg text-emerald-600"></i> Lịch Dạy & TKB
            </button>
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'overview' ? 'active-nav-btn' : 'hover:bg-slate-50 text-slate-600'}`}>
              <span className="flex items-center gap-3.5"><i className="fa-solid fa-list-check text-lg text-blue-600"></i> Tổng quan (Việc)</span>
            </button>
            <button onClick={() => setActiveTab('bonus')} className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'bonus' ? 'active-nav-btn' : 'hover:bg-slate-50 text-slate-600'}`}>
              <i className="fa-solid fa-star text-lg text-amber-500"></i> Điểm cộng / trừ
            </button>
            <button onClick={() => setActiveTab('violation')} className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'violation' ? 'active-nav-btn' : 'hover:bg-slate-50 text-slate-600'}`}>
              <i className="fa-solid fa-triangle-exclamation text-lg text-red-500"></i> Vi phạm
            </button>
            <button onClick={() => setActiveTab('fund')} className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'fund' ? 'active-nav-btn' : 'hover:bg-slate-50 text-slate-600'}`}>
              <span className="flex items-center gap-3.5"><i className="fa-solid fa-wallet text-lg text-indigo-600"></i> Quỹ lớp</span>
            </button>
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-2xl">
            <div className="text-[11px] text-slate-400">Quyền hạn:</div>
            <div className="text-xs text-emerald-700 font-extrabold uppercase mt-0.5">{currentUser.role}</div>
          </div>
        </aside>

        <main className="flex-1 p-3 sm:p-5 md:p-6 overflow-y-auto max-w-6xl mx-auto w-full">
          {activeTab === 'tkb' && (
            <div className="bg-white p-5 rounded-3xl shadow-sm border space-y-4">
              <h2 className="text-lg font-bold text-slate-800"><i className="fa-solid fa-calendar-days text-emerald-600 mr-2"></i> Thời Khóa Biểu Tuần</h2>
              <div className="text-xs text-slate-500">Hệ thống đã kết nối thành công với Supabase và Google Drive. Bạn có thể sử dụng mượt mà không còn độ trễ.</div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 font-bold text-center">
                🎉 Chúc mừng bạn đã chuyển đổi thành công ứng dụng sang Next.js + Supabase!
              </div>
            </div>
          )}
          {activeTab === 'overview' && <div className="bg-white p-6 rounded-3xl border shadow-sm"><h3 className="font-bold text-lg mb-2">Tổng quan công việc ({appData.tasks.length} nhiệm vụ)</h3></div>}
          {activeTab === 'bonus' && <div className="bg-white p-6 rounded-3xl border shadow-sm"><h3 className="font-bold text-lg mb-2">Sổ điểm tích lũy ({appData.bonusPoints.length} bản ghi)</h3></div>}
          {activeTab === 'violation' && <div className="bg-white p-6 rounded-3xl border shadow-sm"><h3 className="font-bold text-lg mb-2">Sổ nề nếp & Vi phạm ({appData.violations.length} lỗi)</h3></div>}
          {activeTab === 'fund' && <div className="bg-white p-6 rounded-3xl border shadow-sm"><h3 className="font-bold text-lg mb-2">Quỹ lớp & Thu chi ({appData.funds.length} khoản)</h3></div>}
        </main>
      </div>
    </div>
  );
}
