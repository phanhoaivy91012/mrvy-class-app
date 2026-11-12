'use client';

import { useEffect } from 'react';
import * as actions from '../actions';

const RAW_BODY_HTML = `
  <!-- 1. MÀN HÌNH ĐĂNG NHẬP (FULL MÀN HÌNH ẢNH LỚP) -->
  <div id="loginSection" class="min-h-screen flex items-center justify-center md:justify-end bg-[#0a192f] bg-cover bg-center bg-no-repeat px-4 sm:px-12 md:px-20 py-8 relative transition-all duration-500">
    <!-- Lớp phủ tối nhẹ để làm nổi bật ảnh tập thể và khung đăng nhập -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/40"></div>
    
    <div class="relative z-10 bg-white/85 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-white/50 text-center">
      <h2 id="loginBrandTitle" class="text-2xl sm:text-3xl font-black text-slate-900 mb-1 tracking-tight">MR Vy</h2>
      <p id="loginBrandSub" class="text-xs text-emerald-700 mb-6 font-extrabold uppercase tracking-widest">Hệ Thống Quản Lý</p>
      
      <div class="space-y-4 text-left">
        <div>
          <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">Tên đăng nhập / Mã HS</label>
          <input type="text" id="loginUsername" class="w-full p-3 text-base bg-white/90 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold shadow-inner">
        </div>
        <div>
          <label class="block text-xs font-extrabold text-slate-700 uppercase mb-1">Mật khẩu</label>
          <input type="password" id="loginPassword" class="w-full p-3 text-base bg-white/90 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold shadow-inner">
        </div>
        <button onclick="handleLogin()" id="btnLoginSubmit" class="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/40 transition text-base flex items-center justify-center gap-2">
          <i class="fa-solid fa-right-to-bracket"></i> Đăng Nhập
        </button>
      </div>
    </div>
  </div>

  <!-- 2. GIAO DIỆN CHÍNH (DASHBOARD) -->
  <div id="dashboardSection" class="hidden min-h-screen flex flex-col">
    
    <!-- TOPBAR THÔNG MINH -->
    <header class="bg-[#0a192f] text-white px-3 sm:px-6 py-2.5 sticky top-0 z-30 shadow-md">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-3">
          <img id="topbarAvatarImg" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-emerald-500 shadow" src="" alt="Logo">
          <div>
            <div id="topbarBrandTitle" class="font-extrabold text-sm sm:text-lg tracking-wide text-white leading-tight">MR Vy</div>
            <div id="topbarBrandSub" class="text-[9px] sm:text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Hệ thống quản lý</div>
          </div>
        </div>

        <div class="hidden md:flex items-center justify-center">
          <div class="bg-gradient-to-r from-blue-900/60 via-emerald-900/60 to-blue-900/60 border border-emerald-500/40 px-5 py-1.5 rounded-2xl shadow-inner text-center">
            <span id="topbarSloganText" class="font-black text-sm lg:text-base text-yellow-300 tracking-wider flex items-center gap-2">
              <i class="fa-solid fa-star text-amber-400 text-xs"></i> 10A4 - Đoàn Kết - Học Tốt <i class="fa-solid fa-star text-amber-400 text-xs"></i>
            </span>
          </div>
        </div>
        
        <div class="flex items-center gap-1.5 text-xs">
          <div class="hidden sm:flex items-center gap-1.5 bg-slate-800/80 text-emerald-400 px-3 py-1.5 rounded-xl border border-slate-700 font-semibold">
            <i class="fa-regular fa-calendar-check"></i> <span id="currentDateBadge">Hôm nay</span>
          </div>
          
          <div class="hidden sm:flex items-center gap-1.5 bg-slate-800/80 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 font-bold">
            <i class="fa-solid fa-circle-user text-emerald-400"></i> <span id="userDisplayName" class="max-w-[140px] truncate">...</span>
          </div>

          <button onclick="openChangePassModal()" class="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition shadow flex items-center gap-1 font-bold" title="Đổi mật khẩu">
            <i class="fa-solid fa-key"></i> <span class="hidden lg:inline text-[11px]">Đổi MK</span>
          </button>

          <button onclick="loadData()" class="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition" title="Tải lại">
            <i class="fa-solid fa-arrows-rotate"></i>
          </button>
          <button onclick="handleLogout()" class="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl transition" title="Đăng xuất">
            <i class="fa-solid fa-power-off"></i>
          </button>
        </div>
      </div>

      <div class="flex md:hidden items-center justify-between mt-2 pt-1.5 border-t border-slate-800 text-[11px]">
        <div class="flex items-center gap-1 text-slate-200 font-bold truncate">
          <i class="fa-solid fa-circle-user text-emerald-400"></i> 
          <span id="userDisplayNameMobile" class="truncate max-w-[160px]">...</span> 
          <span id="userRoleBadgeMobile" class="text-[9px] bg-emerald-900 text-emerald-300 px-1 py-0.5 rounded uppercase font-extrabold ml-0.5">...</span>
        </div>
        <div class="text-emerald-400 font-semibold flex items-center gap-1">
          <i class="fa-regular fa-calendar-check"></i> <span id="currentDateBadgeMobile">Hôm nay</span>
        </div>
      </div>
    </header>

    <div class="md:hidden bg-[#0e2444] text-center py-1.5 px-3 border-b border-slate-800">
      <span id="mobileSloganText" class="font-extrabold text-xs text-yellow-300 tracking-wide">
        🌟 10A4 - Đoàn Kết - Học Tốt 🌟
      </span>
    </div>

    <div class="flex-1 flex overflow-hidden">
      <!-- SIDEBAR -->
      <aside id="sidebar" class="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col justify-between flex-shrink-0 z-40 fixed md:static inset-y-0 left-0 pt-16 md:pt-0 overflow-y-auto">
        <div class="p-4 space-y-1.5">
          <button onclick="switchTab('tkb')" id="nav-tkb" class="nav-btn w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 transition text-sm font-semibold active-nav-btn">
            <i class="fa-solid fa-calendar-days text-lg text-emerald-600"></i> Lịch Dạy & TKB
          </button>
          <button onclick="switchTab('overview')" id="nav-overview" class="nav-btn w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 transition text-sm font-semibold">
            <span class="flex items-center gap-3.5"><i class="fa-solid fa-list-check text-lg text-blue-600"></i> Tổng quan (Việc)</span>
            <span id="sidebarBadge" class="hidden w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
          </button>
          <button onclick="switchTab('bonus')" id="nav-bonus" class="nav-btn w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 transition text-sm font-semibold">
            <i class="fa-solid fa-star text-lg text-amber-500"></i> Điểm cộng / trừ
          </button>
          <button onclick="switchTab('violation')" id="nav-violation" class="nav-btn w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 transition text-sm font-semibold">
            <i class="fa-solid fa-triangle-exclamation text-lg text-red-500"></i> Vi phạm
          </button>
          <button onclick="switchTab('lucky')" id="nav-lucky" class="nav-btn w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 transition text-sm font-semibold">
            <i class="fa-solid fa-dice text-lg text-purple-600"></i> Quay số & Sơ đồ
          </button>
          <button onclick="switchTab('fund')" id="nav-fund" class="nav-btn w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 transition text-sm font-semibold">
            <span class="flex items-center gap-3.5"><i class="fa-solid fa-wallet text-lg text-indigo-600"></i> Quỹ lớp</span>
            <span id="sidebarFundBadge" class="hidden w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
          </button>

          <!-- TAB THÔNG TIN (CHỈ ADMIN) -->
          <button onclick="switchTab('thongtin')" id="nav-thongtin" class="hidden nav-btn w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 transition text-sm font-semibold">
            <i class="fa-solid fa-user-gear text-lg text-rose-600"></i> Thông Tin & Cài Đặt
          </button>
        </div>

        <div class="p-4 border-t border-slate-100 bg-slate-50/50">
          <div class="text-[11px] text-slate-400">Quyền hạn:</div>
          <div id="userRoleBadge" class="text-xs text-emerald-700 font-extrabold uppercase mt-0.5">...</div>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="flex-1 p-3 sm:p-5 md:p-6 overflow-y-auto max-w-6xl mx-auto w-full">

        <!-- ================= TAB: THÔNG TIN & CÀI ĐẶT ================= -->
        <div id="tab-thongtin" class="tab-content hidden space-y-6">
          <div class="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-4">
            <div class="flex items-center justify-between border-b pb-3">
              <h3 class="font-extrabold text-base sm:text-lg text-slate-800 flex items-center gap-2">
                <i class="fa-solid fa-palette text-rose-600"></i> Cấu Hình Giao Diện & Thương Hiệu
              </h3>
              <button onclick="saveBrandSettings()" id="btnSaveBrand" class="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2">
                <i class="fa-solid fa-floppy-disk"></i> Lưu Cài Đặt Giao Diện
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div class="space-y-2 bg-slate-50 p-4 rounded-2xl border">
                <label class="block font-bold text-slate-700 uppercase"><i class="fa-solid fa-image mr-1"></i> Logo Góc Trái (Trên Thanh Menu)</label>
                <div class="flex items-center gap-4">
                  <img id="cfgLogoPreview" class="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow" src="" alt="Preview">
                  <div class="flex-1 space-y-2">
                    <input type="file" id="cfgLogoFile" accept="image/*" onchange="previewLogoFile(this)" class="w-full text-[11px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100">
                    <input type="text" id="cfgLogoUrl" placeholder="Hoặc dán link ảnh trực tiếp..." class="w-full p-2 border rounded-xl bg-white outline-none">
                  </div>
                </div>
              </div>

              <div class="space-y-2 bg-slate-50 p-4 rounded-2xl border">
                <label class="block font-bold text-slate-700 uppercase"><i class="fa-solid fa-panorama mr-1 text-blue-600"></i> Ảnh Nền Toàn Màn Hình Lúc Đăng Nhập</label>
                <div class="flex items-center gap-4">
                  <img id="cfgLoginBgPreview" class="w-24 h-14 rounded-xl object-cover border-2 border-blue-500 shadow bg-slate-200" src="" alt="Background Preview">
                  <div class="flex-1 space-y-2">
                    <input type="file" id="cfgLoginBgFile" accept="image/*" onchange="previewLoginBgFile(this)" class="w-full text-[11px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
                    <input type="text" id="cfgLoginBgUrl" placeholder="Hoặc dán link ảnh nền..." class="w-full p-2 border rounded-xl bg-white outline-none">
                  </div>
                </div>
              </div>

              <div class="space-y-3 bg-slate-50 p-4 rounded-2xl border">
                <div>
                  <label class="block font-bold text-slate-700 uppercase mb-1"><i class="fa-solid fa-signature mr-1"></i> Tên Thương Hiệu (Kế Logo)</label>
                  <input type="text" id="cfgBrandTitle" class="w-full p-2.5 border rounded-xl bg-white outline-none font-bold text-sm" placeholder="VD: MR Vy">
                </div>
                <div>
                  <label class="block font-bold text-slate-700 uppercase mb-1"><i class="fa-solid fa-tag mr-1"></i> Dòng Chữ Phụ Dưới Tên</label>
                  <input type="text" id="cfgBrandSub" class="w-full p-2.5 border rounded-xl bg-white outline-none font-semibold text-xs" placeholder="VD: Hệ thống quản lý">
                </div>
              </div>

              <div class="md:col-span-2 space-y-1 bg-slate-50 p-4 rounded-2xl border">
                <label class="block font-bold text-slate-700 uppercase mb-1"><i class="fa-solid fa-bullhorn mr-1"></i> Dòng Tiêu Đề Khẩu Hiệu Giữa Header</label>
                <input type="text" id="cfgHeaderSlogan" class="w-full p-2.5 border rounded-xl bg-white outline-none font-bold text-sm text-yellow-700" placeholder="VD: 10A4 - Đoàn Kết - Học Tốt">
              </div>
              <div class="md:col-span-2 space-y-1 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
                <label class="block font-bold text-emerald-800 uppercase mb-1"><i class="fa-solid fa-envelope mr-1"></i> Email Giáo Viên (Admin nhận thông báo)</label>
                <input type="email" id="cfgAdminEmail" class="w-full p-2.5 border rounded-xl bg-white outline-none font-mono font-bold text-sm text-emerald-700" placeholder="VD: vyphan@gmail.com">
              </div>
            </div>
          </div>

          <div class="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
              <div>
                <h3 class="font-extrabold text-base sm:text-lg text-slate-800 flex items-center gap-2">
                  <i class="fa-solid fa-users-gear text-blue-600"></i> Quản Lý Thông Tin & Phân Quyền Học Sinh
                </h3>
                <p class="text-xs text-slate-400">Sửa thông tin, số điện thoại, đổi mật khẩu và phân quyền cán sự</p>
              </div>
              <div class="flex items-center gap-2">
                <input type="text" id="searchStudentInput" onkeyup="filterStudentTable()" placeholder="🔍 Tìm kiếm học sinh..." class="p-2 border rounded-xl text-xs bg-slate-50 outline-none w-56">
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-200 text-xs text-left">
                <thead class="bg-[#19376D] text-white font-bold uppercase text-[11px]">
                  <tr>
                    <th class="p-3 text-center w-10">STT</th>
                    <th class="p-3">Mã HS</th>
                    <th class="p-3">Mật Khẩu</th>
                    <th class="p-3">Họ và Tên</th>
                    <th class="p-3 text-center">Giới Tính</th>
                    <th class="p-3 text-center">Ngày Sinh</th>
                    <th class="p-3 text-center">Số HS</th>
                    <th class="p-3 text-center">Số PH</th>
                    <th class="p-3">Email Học Sinh</th>
                    <th class="p-3 text-center">Chức Vụ</th>
                    <th class="p-3 text-center w-24">Thao Tác</th>
                  </tr>
                </thead>
                <tbody id="studentManagerTableBody" class="divide-y divide-slate-100"></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================= TAB: THỜI KHÓA BIỂU & GHI CHÚ ================= -->
        <div id="tab-tkb" class="tab-content space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2 bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200">
            <h2 class="text-base sm:text-lg font-bold text-[#0a192f] flex items-center gap-2">
              <i class="fa-solid fa-calendar-days text-emerald-600"></i> Thời Khóa Biểu
            </h2>
            <div class="flex flex-wrap items-center gap-2">
              <input type="file" id="tkbImageInput" accept="image/*" class="hidden" onchange="handleScanTKBImage(this)">
              <button onclick="openPasteTKBModal()" id="btnPasteTKB" class="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-1.5">
                <i class="fa-solid fa-paste"></i> Dán từ Excel
              </button>
              <button onclick="document.getElementById('tkbImageInput').click()" id="btnScanTKB" class="hidden bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-1.5">
                <i class="fa-solid fa-wand-magic-sparkles"></i> Nhập TKB từ Ảnh (5s)
              </button>
              <button onclick="saveAllScheduleAndNotes(false)" id="btnSaveSchedule" class="hidden bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2">
                <i class="fa-solid fa-floppy-disk"></i> Lưu Thay Đổi
              </button>
            </div>
          </div>

          <div class="bg-white p-3 sm:p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 class="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
                <i class="fa-solid fa-clock text-amber-500"></i> Thời Khóa Biểu Tuần
              </h3>
              <span class="text-[11px] text-slate-400 italic">Nhập môn (Enter xuống dòng tự động tô đỏ chữ dòng 2)</span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-center border-collapse text-xs">
                <thead class="bg-[#19376D] text-white font-bold uppercase sticky top-0 z-10">
                  <tr>
                    <th class="p-2.5 border border-slate-600 w-24 bg-[#19376D]">Ca / Giờ</th>
                    <th class="p-2.5 border border-slate-600 min-w-[95px]">Thứ 2</th>
                    <th class="p-2.5 border border-slate-600 min-w-[95px]">Thứ 3</th>
                    <th class="p-2.5 border border-slate-600 min-w-[95px]">Thứ 4</th>
                    <th class="p-2.5 border border-slate-600 min-w-[95px]">Thứ 5</th>
                    <th class="p-2.5 border border-slate-600 min-w-[95px]">Thứ 6</th>
                    <th class="p-2.5 border border-slate-600 min-w-[95px]">Thứ 7</th>
                    <th class="p-2.5 border border-slate-600 min-w-[95px]">Chủ Nhật</th>
                  </tr>
                </thead>
                <tbody id="tblFullTKBBody"></tbody>
              </table>
            </div>
          </div>

          <div class="bg-white p-3 sm:p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 class="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
                <i class="fa-solid fa-note-sticky text-amber-500"></i> Ghi Chú và Công Việc
              </h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-3 border border-blue-100 p-3.5 rounded-2xl bg-blue-50/30">
                <div class="flex items-center justify-between border-b border-blue-200 pb-2">
                  <span class="font-bold text-blue-900 text-xs flex items-center gap-1.5 uppercase">
                    <i class="fa-solid fa-school text-blue-600"></i> Ở Trường
                  </span>
                  <button type="button" id="btnAddNoteTruong" onclick="addNoteRow('truong')" class="hidden bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded-xl text-xs shadow-sm transition flex items-center gap-1">
                    <i class="fa-solid fa-plus"></i> Thêm dòng
                  </button>
                </div>
                <div id="noteTruongList" class="space-y-2 max-h-[300px] overflow-y-auto pr-1"></div>
              </div>

              <div class="space-y-3 border border-purple-100 p-3.5 rounded-2xl bg-purple-50/30">
                <div class="flex items-center justify-between border-b border-purple-200 pb-2">
                  <span class="font-bold text-purple-900 text-xs flex items-center gap-1.5 uppercase">
                    <i class="fa-solid fa-house-user text-purple-600"></i> Ở Nhà
                  </span>
                  <button type="button" id="btnAddNoteNha" onclick="addNoteRow('nha')" class="hidden bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1 rounded-xl text-xs shadow-sm transition flex items-center gap-1">
                    <i class="fa-solid fa-plus"></i> Thêm dòng
                  </button>
                </div>
                <div id="noteNhaList" class="space-y-2 max-h-[300px] overflow-y-auto pr-1"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= TAB: TỔNG QUAN (CÔNG VIỆC) ================= -->
        <div id="tab-overview" class="tab-content hidden space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-sm border">
            <div>
              <h2 class="text-xl font-extrabold text-slate-800">Bảng Phân Công & Nhắc Việc</h2>
              <p class="text-xs text-slate-500">Xem việc cần làm, xác nhận và theo dõi tiến độ</p>
            </div>
            <button id="btnAddTask" onclick="openTaskModal()" class="hidden bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow transition flex items-center justify-center gap-2">
              <i class="fa-solid fa-circle-plus"></i> Giao việc mới
            </button>
          </div>

          <div class="bg-white p-3.5 rounded-2xl shadow-sm border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-500 uppercase mb-1">Lọc theo tháng</label>
              <select id="filterMonth" onchange="renderTasks()" class="w-full p-2 border rounded-xl text-xs font-semibold bg-slate-50 outline-none">
                <option value="all">📅 Tất cả các tháng</option>
                <option value="1">Tháng 1</option><option value="2">Tháng 2</option><option value="3">Tháng 3</option>
                <option value="4">Tháng 4</option><option value="5">Tháng 5</option><option value="6">Tháng 6</option>
                <option value="7">Tháng 7</option><option value="8">Tháng 8</option><option value="9">Tháng 9</option>
                <option value="10">Tháng 10</option><option value="11">Tháng 11</option><option value="12">Tháng 12</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-500 uppercase mb-1">Lọc trạng thái</label>
              <select id="filterStatus" onchange="renderTasks()" class="w-full p-2 border rounded-xl text-xs font-semibold bg-slate-50 outline-none">
                <option value="all">📋 Tất cả công việc</option>
                <option value="my_pending">🚨 Việc của tôi (Chưa xong)</option>
                <option value="my_done">✅ Việc của tôi (Đã xong)</option>
                <option value="class_pending">⏳ Lớp chưa xong 100%</option>
                <option value="class_done">🎉 Lớp đã xong 100%</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-500 uppercase mb-1">Sắp xếp theo</label>
              <select id="sortTaskBy" onchange="renderTasks()" class="w-full p-2 border rounded-xl text-xs font-semibold bg-slate-50 outline-none">
                <option value="deadline_asc">⏳ Hạn chót (Sắp tới trước)</option>
                <option value="created_desc">🕒 Ngày đăng (Mới nhất)</option>
                <option value="created_asc">🕒 Ngày đăng (Cũ nhất)</option>
              </select>
            </div>
            <div class="flex items-end">
              <button onclick="loadData()" class="w-full p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-arrows-rotate"></i> Làm mới
              </button>
            </div>
          </div>

          <div id="taskList" class="flex flex-col gap-3.5"></div>
        </div>

        <!-- ================= TAB: ĐIỂM CỘNG / TRỪ TÍCH LŨY ================= -->
        <div id="tab-bonus" class="tab-content hidden space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-sm border">
            <div>
              <h2 class="text-xl font-extrabold text-slate-800">Sổ Tích Lũy Điểm Cộng & Điểm Trừ</h2>
              <p class="text-xs text-slate-500">Ghi nhận điểm thi đua, cộng phát biểu bài & trừ điểm nề nếp</p>
            </div>
            <div class="flex items-center gap-2">
              <button id="btnAddBonus" onclick="openBonusBatchModal()" class="hidden bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2">
                <i class="fa-solid fa-plus-circle"></i> Ghi Điểm Cộng / Trừ
              </button>
            </div>
          </div>

          <div class="bg-white p-3 rounded-2xl shadow-sm border flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <button onclick="switchBonusSubView('summary')" id="btnSubBonusSummary" class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 transition">
                <i class="fa-solid fa-chart-simple mr-1"></i> Bảng Tổng Điểm
              </button>
              <button onclick="switchBonusSubView('history')" id="btnSubBonusHistory" class="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition">
                <i class="fa-solid fa-clock-rotate-left mr-1"></i> Lịch Sử Chi Tiết
              </button>
            </div>

            <div class="flex items-center gap-2 flex-1 max-w-xs">
              <select id="filterBonusSubject" onchange="renderBonusView()" class="p-2 border rounded-xl text-xs bg-slate-50 outline-none w-full font-semibold">
                <option value="all">📚 Tất cả các môn</option>
                <optgroup label="── Môn bắt buộc ──">
                  <option value="Toán">Toán</option>
                  <option value="Ngữ văn">Ngữ văn</option>
                  <option value="Tiếng Anh">Tiếng Anh</option>
                  <option value="Lịch sử">Lịch sử</option>
                  <option value="Giáo dục thể chất">Giáo dục thể chất</option>
                  <option value="GDQP&AN">Giáo dục Quốc phòng & An ninh</option>
                </optgroup>
                <optgroup label="── Môn lựa chọn & Hoạt động ──">
                  <option value="Vật lí">Vật lí</option>
                  <option value="Hóa học">Hóa học</option>
                  <option value="Sinh học">Sinh học</option>
                  <option value="Địa lí">Địa lí</option>
                  <option value="GDKT&PL">GDKT & Pháp luật (KTPL)</option>
                  <option value="Tin học">Tin học</option>
                  <option value="Công nghệ">Công nghệ</option>
                  <option value="Âm nhạc">Âm nhạc</option>
                  <option value="Mĩ thuật">Mĩ thuật</option>
                  <option value="HĐTN-HN">HĐ Trải nghiệm, Hướng nghiệp</option>
                  <option value="GDĐP">Giáo dục địa phương</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div id="bonusSummaryView" class="bg-white rounded-2xl shadow-sm border overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 text-xs text-left">
              <thead class="bg-[#19376D] text-white font-bold uppercase text-[11px]">
                <tr>
                  <th class="p-3 text-center w-12">STT</th>
                  <th class="p-3">Mã HS</th>
                  <th class="p-3">Họ và Tên</th>
                  <th class="p-3 text-center">Tổng Điểm Cộng</th>
                  <th class="p-3 text-center">Tổng Điểm Trừ</th>
                  <th class="p-3 text-center font-extrabold">Điểm Còn Lại</th>
                  <th class="p-3 text-center">Xem Lịch Sử</th>
                </tr>
              </thead>
              <tbody id="bonusSummaryTableBody" class="divide-y divide-slate-100"></tbody>
            </table>
          </div>

          <div id="bonusHistoryView" class="hidden bg-white rounded-2xl shadow-sm border overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 text-xs text-left">
              <thead class="bg-[#19376D] text-white font-bold uppercase text-[11px]">
                <tr>
                  <th class="p-3 text-center w-10">STT</th>
                  <th class="p-3">Học Sinh</th>
                  <th class="p-3">Môn Học</th>
                  <th class="p-3 text-center">Điểm Ghi</th>
                  <th class="p-3 text-center">Quy Ước</th>
                  <th class="p-3">Lý Do / Nội Dung</th>
                  <th class="p-3">Thời Gian</th>
                  <th class="p-3">Người Ghi</th>
                  <th id="thBonusAction" class="p-3 text-center w-20">Thao Tác</th>
                </tr>
              </thead>
              <tbody id="bonusHistoryTableBody" class="divide-y divide-slate-100"></tbody>
            </table>
          </div>
        </div>

        <!-- ================= TAB: VI PHẠM & NỀ NẾP ================= -->
        <div id="tab-violation" class="tab-content hidden space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <div>
              <h2 class="text-lg sm:text-xl font-extrabold text-slate-800 flex items-center gap-2">
                <i class="fa-solid fa-triangle-exclamation text-amber-600"></i> Sổ Quản Lý Vi Phạm & Nề Nếp
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">Khởi điểm 100 điểm/tháng. Thống kê điểm thi đua theo tuần & tháng</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button id="btnConfigVp" onclick="openVpConfigModal()" class="bg-slate-700 hover:bg-slate-800 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs shadow transition flex items-center gap-1.5">
                <i class="fa-solid fa-gear"></i> Quản Lý Danh Mục
              </button>
              <button id="btnAddViolation" onclick="openViolationBatchModal()" class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2">
                <i class="fa-solid fa-plus-circle"></i> Ghi Nhận Nề Nếp
              </button>
            </div>
          </div>

          <div class="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button onclick="switchViolationSubView('summary')" id="btnSubVpSummary" class="flex-1 py-1.5 rounded-lg text-xs font-bold bg-amber-200/80 text-amber-900 transition shadow-sm">
                Bảng Điểm
              </button>
              <button onclick="switchViolationSubView('history')" id="btnSubVpHistory" class="flex-1 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 transition">
                Lịch Sử
              </button>
            </div>

            <div>
              <select id="filterVpMonth" onchange="renderViolationsView()" class="w-full p-2 border border-slate-300 rounded-xl text-xs font-semibold bg-slate-50 outline-none">
                <option value="all">📅 Cả năm học</option>
                <option value="1">Tháng 1</option><option value="2">Tháng 2</option><option value="3">Tháng 3</option>
                <option value="4">Tháng 4</option><option value="5">Tháng 5</option><option value="6">Tháng 6</option>
                <option value="7">Tháng 7</option><option value="8">Tháng 8</option><option value="9">Tháng 9</option>
                <option value="10">Tháng 10</option><option value="11">Tháng 11</option><option value="12">Tháng 12</option>
              </select>
            </div>

            <div>
              <select id="filterVpWeek" onchange="renderViolationsView()" class="w-full p-2 border border-slate-300 rounded-xl text-xs font-semibold bg-slate-50 outline-none">
                <option value="all">🗓️ Cả tháng (Tất cả các tuần)</option>
                <option value="1">Tuần 1 (T2 - CN đầu tháng)</option>
                <option value="2">Tuần 2 (T2 - CN)</option>
                <option value="3">Tuần 3 (T2 - CN)</option>
                <option value="4">Tuần 4 (T2 - CN)</option>
                <option value="5">Tuần 5 (T2 - CN)</option>
                <option value="6">Tuần 6 (T2 - CN cuối tháng)</option>
              </select>
            </div>

            <div>
              <button onclick="exportVpExcel()" class="w-full p-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm">
                <i class="fa-solid fa-file-excel text-sm"></i> Xuất Excel (Bản Đẹp)
              </button>
            </div>

            <div>
              <button onclick="loadData()" class="w-full p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5 border border-slate-200">
                <i class="fa-solid fa-arrows-rotate"></i> Làm mới
              </button>
            </div>
          </div>

          <div id="vpSummaryView" class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 text-xs text-left">
              <thead class="bg-[#19376D] text-white font-bold uppercase text-[11px]">
                <tr>
                  <th class="p-3 text-center w-12">STT</th>
                  <th class="p-3">Mã HS</th>
                  <th class="p-3">Họ và Tên</th>
                  <th class="p-3 text-center">Điểm Gốc</th>
                  <th class="p-3 text-center">Tổng Thưởng (+)</th>
                  <th class="p-3 text-center">Tổng Phạt (-)</th>
                  <th class="p-3 text-center font-extrabold">Điểm Nề Nếp Hiện Tại</th>
                  <th class="p-3 text-center">Chi Tiết</th>
                </tr>
              </thead>
              <tbody id="vpSummaryTableBody" class="divide-y divide-slate-100"></tbody>
            </table>
          </div>

          <div id="vpHistoryView" class="hidden bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 text-xs text-left">
              <thead class="bg-[#19376D] text-white font-bold uppercase text-[11px]">
                <tr>
                  <th class="p-3 text-center w-10">STT</th>
                  <th class="p-3">Học Sinh</th>
                  <th class="p-3">Danh Mục</th>
                  <th class="p-3 text-center">Điểm</th>
                  <th class="p-3">Chi Tiết / Lý Do</th>
                  <th class="p-3">Thời Gian</th>
                  <th class="p-3">Người Nhập</th>
                  <th id="thVpAction" class="p-3 text-center w-16">Xóa</th>
                </tr>
              </thead>
              <tbody id="violationTableBody" class="divide-y divide-slate-100"></tbody>
            </table>
          </div>
        </div>

        <!-- ================= TAB: QUAY SỐ & SƠ ĐỒ THI ================= -->
        <div id="tab-lucky" class="tab-content hidden space-y-5">
          <div class="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-4">
            <div class="flex items-center justify-between border-b pb-3">
              <div>
                <h3 class="font-extrabold text-slate-800 text-base flex items-center gap-2">
                  <i class="fa-solid fa-dice text-purple-600 text-lg"></i> Quay Số Bốc Thăm Ngẫu Nhiên
                </h3>
                <p class="text-xs text-slate-400">Chọn danh sách tham gia và bốc ngẫu nhiên số lượng cần</p>
              </div>
              <div id="luckyDrawControl" class="flex items-center gap-2">
                <span class="text-xs font-bold text-slate-600">Số lượng:</span>
                <input type="number" id="luckyQuantity" min="1" value="1" class="border rounded-xl p-2 w-16 text-center font-bold text-sm outline-none">
                <button onclick="runLuckyDraw()" id="btnStartLucky" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow transition flex items-center gap-1.5">
                  <i class="fa-solid fa-shuffle"></i> Bắt đầu quay
                </button>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-slate-600 uppercase">Danh sách tham gia quay số (<span id="luckyPoolCount">0</span> bạn)</label>
                <button type="button" onclick="toggleSelectAllLuckyPool()" class="text-blue-600 font-bold text-xs hover:underline">Chọn / Bỏ chọn cả lớp</button>
              </div>
              <div id="luckyStudentPool" class="border rounded-2xl p-2.5 max-h-36 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 bg-slate-50 text-xs"></div>
            </div>

            <div id="luckyResultContainer" class="hidden bg-purple-50/60 p-4 rounded-2xl border border-purple-200 space-y-2">
              <div class="text-xs font-bold text-purple-800 uppercase flex items-center gap-1">
                <i class="fa-solid fa-award"></i> Kết quả trúng thăm:
              </div>
              <div id="luckyResult" class="flex flex-wrap gap-2 pt-1"></div>
            </div>
          </div>

          <div class="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
              <div>
                <h3 class="font-extrabold text-slate-800 text-base flex items-center gap-2">
                  <i class="fa-solid fa-chair text-emerald-600 text-lg"></i> Xếp Chỗ Ngồi Kiểm Tra / Thi
                </h3>
                <p class="text-xs text-slate-400">Tùy biến số dãy, hàng và ghim cố định học sinh mong muốn</p>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <div class="flex items-center gap-1 text-xs">
                  <span class="font-semibold text-slate-600">Dãy:</span>
                  <input type="number" id="seatCols" value="4" min="1" max="10" onchange="initSeatingGrid()" class="border rounded-xl p-1.5 w-12 text-center font-bold">
                </div>
                <div class="flex items-center gap-1 text-xs">
                  <span class="font-semibold text-slate-600">Hàng:</span>
                  <input type="number" id="seatRows" value="6" min="1" max="15" onchange="initSeatingGrid()" class="border rounded-xl p-1.5 w-12 text-center font-bold">
                </div>
                <button id="btnGenerateSeating" onclick="randomizeUnpinnedSeats()" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow transition flex items-center gap-1.5">
                  <i class="fa-solid fa-shuffle"></i> Trộn sơ đồ
                </button>
                <button onclick="resetAllSeats()" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl font-bold text-xs transition">
                  <i class="fa-solid fa-arrow-rotate-left"></i> Đặt lại
                </button>
              </div>
            </div>

            <div class="bg-slate-100 border border-slate-300 py-1.5 rounded-xl text-center font-bold text-xs text-slate-600 uppercase tracking-widest">
              👨‍🏫 BỤC GIẢNG / BÀN GIÁO VIÊN
            </div>

            <div id="seatingGridContainer" class="overflow-x-auto p-1">
              <div id="seatingPlan" class="grid gap-2.5"></div>
            </div>
          </div>
        </div>

        <!-- ================= TAB: QUỸ LỚP ================= -->
        <div id="tab-fund" class="tab-content hidden space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-sm border">
            <div>
              <h2 class="text-xl font-extrabold text-slate-800">Quản Lý Thu - Chi & Quỹ Lớp</h2>
              <p class="text-xs text-slate-500">Minh bạch thu chi, quỹ thưởng và tình trạng nộp quỹ của từng học sinh</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button id="btnAddFundThu" onclick="openCreateFundModal('THU')" class="hidden bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow transition flex items-center gap-1.5">
                <i class="fa-solid fa-hand-holding-dollar"></i> Tạo Khoản Thu
              </button>
              <button id="btnAddFundChi" onclick="openCreateFundModal('CHI')" class="hidden bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow transition flex items-center gap-1.5">
                <i class="fa-solid fa-money-bill-transfer"></i> Tạo Khoản Chi
              </button>
              <button id="btnAddFundThuong" onclick="openCreateFundModal('THUONG')" class="hidden bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow transition flex items-center gap-1.5">
                <i class="fa-solid fa-gift"></i> Thưởng Khác
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div class="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm">
              <div class="text-slate-400 font-bold uppercase text-[10px]">Đã Thu Từ HS</div>
              <div id="statFundCollected" class="text-base sm:text-lg font-black text-purple-700 mt-1">0 đ</div>
            </div>
            <div class="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
              <div class="text-slate-400 font-bold uppercase text-[10px]">Thưởng Khác (+)</div>
              <div id="statFundBonus" class="text-base sm:text-lg font-black text-amber-600 mt-1">0 đ</div>
            </div>
            <div class="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm">
              <div class="text-slate-400 font-bold uppercase text-[10px]">Tổng Đã Chi (-)</div>
              <div id="statFundSpent" class="text-base sm:text-lg font-black text-rose-600 mt-1">0 đ</div>
            </div>
            <div class="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm bg-gradient-to-br from-white to-emerald-50/50">
              <div class="text-slate-400 font-bold uppercase text-[10px]">Quỹ Còn Lại</div>
              <div id="statFundBalance" class="text-base sm:text-lg font-black text-emerald-700 mt-1">0 đ</div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-extrabold text-sm sm:text-base text-slate-800 flex items-center gap-2">
                <i class="fa-solid fa-receipt text-slate-600"></i> Lịch Sử Chi Tiêu & Quỹ Thưởng Khác
              </h3>
              <span class="text-[11px] text-slate-400 italic">(Hiển thị tự động cuộn)</span>
            </div>
            
            <div class="overflow-x-auto rounded-xl border border-slate-200 max-h-[360px] overflow-y-auto">
              <table class="min-w-full divide-y divide-slate-200 text-xs text-left">
                <thead class="bg-[#19376D] text-white font-bold uppercase text-[11px] sticky top-0 z-10 shadow">
                  <tr>
                    <th class="p-3 text-center w-10 bg-[#19376D]">STT</th>
                    <th class="p-3 bg-[#19376D]">Phân Loại</th>
                    <th class="p-3 bg-[#19376D]">Nội Dung</th>
                    <th class="p-3 text-right bg-[#19376D]">Số Tiền</th>
                    <th class="p-3 bg-[#19376D]">Thời Gian</th>
                    <th class="p-3 bg-[#19376D]">Người Nhập</th>
                    <th id="thFundOtherAction" class="p-3 text-center w-16 bg-[#19376D]">Xóa</th>
                  </tr>
                </thead>
                <tbody id="fundOtherTransactionTableBody" class="divide-y divide-slate-100"></tbody>
              </table>
            </div>
          </div>

          <div class="space-y-3">
            <h3 class="font-extrabold text-sm sm:text-base text-slate-800 flex items-center gap-2">
              <i class="fa-solid fa-list-check text-purple-600"></i> Các Khoản Thu Từ Học Sinh
            </h3>
            <div id="fundCollectionList" class="space-y-4"></div>
          </div>
        </div>

      </main>
    </div>
  </div>

  <!-- ================= CÁC MODAL ================= -->

  <!-- MODAL GHI VI PHẠM / THƯỞNG NỀ NẾP -->
  <div id="violationBatchModal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200 mb-3">
        <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
          <i class="fa-solid fa-triangle-exclamation text-amber-600"></i> Ghi Nhận Nề Nếp & Vi Phạm
        </h3>
        <button type="button" onclick="closeViolationBatchModal()" class="text-slate-400 hover:text-slate-600 text-xl p-1"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="overflow-y-auto flex-1 space-y-3.5 pr-1 text-xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-600 uppercase mb-1">Loại ghi nhận *</label>
            <select id="vpType" onchange="onVpTypeChange()" class="w-full p-2.5 border rounded-xl outline-none font-bold">
              <option value="TRU">➖ Vi Phạm / Trừ Điểm</option>
              <option value="CONG">➕ Khen Thưởng / Cộng Điểm</option>
            </select>
          </div>
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block font-bold text-slate-600 uppercase">Danh mục nề nếp *</label>
              <button type="button" onclick="openVpConfigModal()" class="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1">
                <i class="fa-solid fa-gear"></i> Quản lý
              </button>
            </div>
            <select id="vpPresetCategory" onchange="onVpCategorySelect()" class="w-full p-2.5 border rounded-xl outline-none font-bold text-blue-700 bg-blue-50/50"></select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border">
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase mb-1">Số điểm (Điểm)</label>
            <input type="number" id="vpScoreInput" step="1" oninput="updateVpScoreBadge()" class="w-full p-2 border rounded-xl text-center font-bold bg-white outline-none">
          </div>
          <div class="flex items-center justify-center">
            <span id="vpScoreBadgePreview" class="px-4 py-2 rounded-xl font-extrabold text-sm bg-red-100 text-red-700">-2 điểm</span>
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-600 uppercase mb-1">
            Nội dung chi tiết <span id="vpNoteRequiredSign" class="text-red-500 hidden">*</span>
          </label>
          <input type="text" id="vpDetailInput" placeholder="Nhập ghi chú chi tiết nếu có..." class="w-full p-2.5 border rounded-xl outline-none">
        </div>

        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="block font-bold text-slate-600 uppercase">Chọn những học sinh *</label>
            <button type="button" onclick="toggleSelectAllVpStudents()" class="text-blue-600 font-bold hover:underline">Chọn cả lớp</button>
          </div>
          <div id="vpStudentCheckList" class="border rounded-2xl p-2.5 max-h-40 overflow-y-auto grid grid-cols-2 gap-1.5 bg-slate-50 text-xs"></div>
        </div>
      </div>

      <div class="pt-3 border-t border-slate-200 flex justify-end gap-2 mt-3">
        <button type="button" onclick="closeViolationBatchModal()" class="px-4 py-2 text-slate-600 rounded-xl font-semibold text-xs">Hủy</button>
        <button type="button" onclick="submitBatchViolations()" id="btnSubmitVpBatch" class="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow">Lưu Tất Cả</button>
      </div>
    </div>
  </div>

  <!-- MODAL TẠO GIAO DỊCH QUỸ -->
  <div id="fundCreateModal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl text-left">
      <div class="flex justify-between items-center pb-3 border-b mb-4">
        <h3 id="fundModalTitle" class="font-bold text-slate-800 text-base flex items-center gap-2">
          <i class="fa-solid fa-plus-circle text-purple-600"></i> Tạo Giao Dịch Quỹ
        </h3>
        <button onclick="closeCreateFundModal()" class="text-slate-400 hover:text-slate-600 text-xl"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <input type="hidden" id="fundType">
      <div class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-slate-600 uppercase mb-1">Nội dung giao dịch <span class="text-red-500">*</span></label>
          <input type="text" id="fundTitle" class="w-full p-2.5 border rounded-xl outline-none font-semibold" placeholder="VD: Thu tiền quỹ lớp HK1, Mua nước uống...">
        </div>

        <div>
          <label id="fundAmountLabel" class="block font-bold text-slate-600 uppercase mb-1">Số tiền (VNĐ) <span class="text-red-500">*</span></label>
          <input type="number" id="fundAmount" min="1000" step="1000" class="w-full p-2.5 border rounded-xl outline-none font-mono font-bold text-sm" placeholder="VD: 50000">
        </div>

        <div id="fundDeadlineContainer">
          <label class="block font-bold text-slate-600 uppercase mb-1">Hạn đóng (Tùy chọn)</label>
          <input type="date" id="fundDeadline" class="w-full p-2.5 border rounded-xl outline-none">
        </div>
      </div>

      <div class="pt-4 border-t flex justify-end gap-2 mt-4">
        <button onclick="closeCreateFundModal()" class="px-4 py-2 text-slate-600 rounded-xl font-semibold text-xs">Hủy</button>
        <button onclick="submitCreateFund()" id="btnSubmitCreateFund" class="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow">Xác nhận tạo</button>
      </div>
    </div>
  </div>

  <!-- MODAL GHI ĐIỂM CỘNG/TRỪ HÀNG LOẠT -->
  <div id="bonusBatchModal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-3xl p-6 w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl">
      <div class="flex justify-between items-center pb-3 border-b mb-3">
        <h3 class="font-bold text-slate-800 text-base flex items-center gap-2"><i class="fa-solid fa-award text-emerald-600"></i> Ghi Điểm Cộng / Điểm Trừ</h3>
        <button onclick="closeBonusBatchModal()" class="text-slate-400 hover:text-slate-600 text-xl"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="overflow-y-auto flex-1 space-y-3.5 pr-1 text-xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-600 uppercase mb-1">Môn học *</label>
            <select id="bnSubject" class="w-full p-2.5 border rounded-xl outline-none font-bold text-blue-700 bg-blue-50/50">
              <optgroup label="── Môn bắt buộc ──">
                <option value="Toán">Toán</option><option value="Ngữ văn">Ngữ văn</option><option value="Tiếng Anh">Tiếng Anh</option><option value="Lịch sử">Lịch sử</option><option value="Giáo dục thể chất">Giáo dục thể chất</option><option value="GDQP&AN">Giáo dục Quốc phòng & An ninh</option>
              </optgroup>
              <optgroup label="── Môn lựa chọn & Hoạt động ──">
                <option value="Vật lí">Vật lí</option><option value="Hóa học">Hóa học</option><option value="Sinh học">Sinh học</option><option value="Địa lí">Địa lí</option><option value="GDKT&PL">GDKT & Pháp luật (KTPL)</option><option value="Tin học">Tin học</option><option value="Công nghệ">Công nghệ</option><option value="Âm nhạc">Âm nhạc</option><option value="Mĩ thuật">Mĩ thuật</option><option value="HĐTN-HN">HĐ Trải nghiệm, Hướng nghiệp</option><option value="GDĐP">Giáo dục địa phương</option>
              </optgroup>
            </select>
          </div>
          <div>
            <label class="block font-bold text-slate-600 uppercase mb-1">Loại điểm *</label>
            <select id="bnType" onchange="calculateBonusTotalScore()" class="w-full p-2.5 border rounded-xl outline-none font-bold">
              <option value="plus">➕ Điểm Cộng (Khen thưởng, phát biểu)</option>
              <option value="minus">➖ Điểm Trừ (Nhắc nhở, thiếu bài)</option>
            </select>
          </div>
        </div>

        <div class="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
          <div class="font-bold text-slate-700 uppercase flex items-center justify-between">
            <span><i class="fa-solid fa-calculator mr-1"></i> Quy ước tính điểm:</span>
            <span id="bnFinalScorePreview" class="text-emerald-700 font-extrabold text-sm">+0.25 điểm</span>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] text-slate-500 font-semibold mb-0.5">Số lượng dấu (+ / -)</label>
              <input type="number" id="bnCount" value="1" min="1" step="1" oninput="calculateBonusTotalScore()" class="w-full p-2 border rounded-xl text-center font-bold bg-white outline-none">
            </div>
            <div>
              <label class="block text-[11px] text-slate-500 font-semibold mb-0.5">Hệ số đổi (1 dấu = bao nhiêu điểm)</label>
              <input type="number" id="bnRate" value="0.25" min="0.05" step="0.05" oninput="calculateBonusTotalScore()" class="w-full p-2 border rounded-xl text-center font-bold bg-white outline-none">
            </div>
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-600 uppercase mb-1">Lý do / Nội dung ghi nhận (Tùy chọn)</label>
          <input type="text" id="bnReason" placeholder="Để trống nếu không có (VD: Phát biểu bài, làm bài tập...)" class="w-full p-2.5 border rounded-xl outline-none">
        </div>

        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="block font-bold text-slate-600 uppercase">Chọn những học sinh nhận điểm *</label>
            <button type="button" onclick="toggleSelectAllBonusStudents()" class="text-blue-600 font-bold hover:underline">Chọn cả lớp</button>
          </div>
          <div id="bonusStudentCheckList" class="border rounded-2xl p-2.5 max-h-40 overflow-y-auto grid grid-cols-2 gap-1.5 bg-slate-50 text-xs"></div>
        </div>
      </div>

      <div class="pt-3 border-t flex justify-end gap-2 mt-3">
        <button onclick="closeBonusBatchModal()" class="px-4 py-2 text-slate-600 rounded-xl font-semibold text-xs">Hủy</button>
        <button onclick="submitBatchBonus()" id="btnSubmitBonusBatch" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow">Lưu Tất Cả</button>
      </div>
    </div>
  </div>

  <!-- MODAL SỬA ĐIỂM CỘNG ĐÃ GHI -->
  <div id="editBonusModal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-left">
      <div class="flex justify-between items-center pb-3 border-b mb-3">
        <h3 class="font-bold text-slate-800 text-sm"><i class="fa-solid fa-pen text-blue-600 mr-1"></i> Sửa Điểm Đã Ghi</h3>
        <button onclick="closeEditBonusModal()" class="text-slate-400 hover:text-slate-600 text-xl"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <input type="hidden" id="edBonusId">
      <div class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-slate-600 uppercase mb-1">Học sinh</label>
          <input type="text" id="edBonusStudentName" readonly class="w-full p-2 bg-slate-100 border rounded-xl font-bold text-slate-700 outline-none">
        </div>
        <div>
          <label class="block font-bold text-slate-600 uppercase mb-1">Môn học</label>
          <select id="edBonusSubject" class="w-full p-2 border rounded-xl outline-none font-bold">
            <option value="Toán">Toán</option><option value="Ngữ văn">Ngữ văn</option><option value="Tiếng Anh">Tiếng Anh</option>
            <option value="Vật lí">Vật lí</option><option value="Hóa học">Hóa học</option><option value="Sinh học">Sinh học</option>
            <option value="Lịch sử">Lịch sử</option><option value="Địa lí">Địa lí</option><option value="GDKT&PL">GDKT & Pháp luật</option>
            <option value="Tin học">Tin học</option>
          </select>
        </div>
        <div>
          <label class="block font-bold text-slate-600 uppercase mb-1">Số điểm</label>
          <input type="number" id="edBonusScore" step="0.05" class="w-full p-2 border rounded-xl outline-none font-bold">
        </div>
        <div>
          <label class="block font-bold text-slate-600 uppercase mb-1">Lý do</label>
          <input type="text" id="edBonusReason" class="w-full p-2 border rounded-xl outline-none">
        </div>
      </div>
      <div class="pt-4 border-t flex justify-end gap-2 mt-4">
        <button onclick="closeEditBonusModal()" class="px-4 py-2 text-slate-600 rounded-xl font-semibold text-xs">Hủy</button>
        <button onclick="submitUpdateBonus()" id="btnSubmitUpdateBonus" class="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs shadow">Cập nhật</button>
      </div>
    </div>
  </div>

  <!-- MODAL SỬA THÔNG TIN HỌC SINH -->
  <div id="editStudentModal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl text-left">
      <div class="flex justify-between items-center pb-3 border-b mb-4">
        <h3 class="font-bold text-slate-800 text-base flex items-center gap-2"><i class="fa-solid fa-user-pen text-blue-600"></i> Sửa Thông Tin Học Sinh</h3>
        <button onclick="closeEditStudentModal()" class="text-slate-400 hover:text-slate-600 text-xl"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-slate-600 uppercase mb-1">Mã Học Sinh</label>
          <input type="text" id="edStudentMaHS" readonly class="w-full p-2.5 border rounded-xl bg-slate-100 font-mono font-bold text-slate-700 outline-none">
        </div>
        <div>
          <label class="block font-bold text-slate-600 uppercase mb-1">Họ và Tên</label>
          <input type="text" id="edStudentHoTen" class="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold">
        </div>
        <div>
          <label class="block font-bold text-slate-600 uppercase mb-1">Mật Khẩu</label>
          <input type="text" id="edStudentPass" class="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-mono">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-600 uppercase mb-1">Giới Tính</label>
            <select id="edStudentGioiTinh" class="w-full p-2.5 border rounded-xl outline-none">
              <option value="Nữ">Nữ</option>
              <option value="Nam">Nam</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-slate-600 uppercase mb-1">Ngày Sinh</label>
            <input type="text" id="edStudentNgaySinh" class="w-full p-2.5 border rounded-xl outline-none font-mono" placeholder="dd/mm/yyyy">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-600 uppercase mb-1">Số ĐT Học Sinh</label>
            <input type="text" id="edStudentSoHS" class="w-full p-2.5 border rounded-xl outline-none font-mono" placeholder="090...">
          </div>
          <div>
            <label class="block font-bold text-slate-600 uppercase mb-1">Số ĐT Phụ Huynh</label>
            <input type="text" id="edStudentSoPH" class="w-full p-2.5 border rounded-xl outline-none font-mono" placeholder="012...">
          </div>
        </div>
        <div>
          <label class="block font-bold text-slate-600 uppercase mb-1">Email Học Sinh (Nhận thông báo)</label>
          <input type="email" id="edStudentEmail" class="w-full p-2.5 border rounded-xl outline-none font-mono" placeholder="hocsinh@gmail.com">
        </div>
        <div>
          <label class="block font-bold text-slate-600 uppercase mb-1">Phân Quyền / Chức Vụ</label>
          <select id="edStudentRole" class="w-full p-2.5 border rounded-xl outline-none font-bold text-blue-700 bg-blue-50">
            <option value="STUDENT">Học sinh thông thường (STUDENT)</option>
            <option value="LopTruong">Lớp Trưởng</option>
            <option value="BiThu">Bí Thư</option>
            <option value="LopPhoHocTap">Lớp Phó Học Tập</option>
            <option value="LopPhoKyLuat">Lớp Phó Kỷ Luật / Trật Tự</option>
            <option value="ThuQuy">Thủ Quỹ</option>
          </select>
        </div>
      </div>
      <div class="pt-4 border-t flex justify-end gap-2 mt-4">
        <button onclick="closeEditStudentModal()" class="px-4 py-2 text-slate-600 rounded-xl font-semibold text-xs">Hủy</button>
        <button onclick="submitEditStudent()" id="btnSubmitEditStudent" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow transition">Lưu Thay Đổi</button>
      </div>
    </div>
  </div>

  <!-- MODAL ĐỔI MẬT KHẨU CÁ NHÂN -->
  <div id="changePassModal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-left">
      <div class="flex justify-between items-center pb-3 border-b mb-4">
        <h3 class="font-bold text-slate-800 text-base flex items-center gap-2"><i class="fa-solid fa-key text-amber-500"></i> Đổi Mật Khẩu</h3>
        <button onclick="closeChangePassModal()" class="text-slate-400 hover:text-slate-600 text-xl"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-slate-600 uppercase mb-1">Mật khẩu hiện tại</label>
          <input type="password" id="cpOldPass" class="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500">
        </div>
        <div>
          <label class="block font-bold text-slate-600 uppercase mb-1">Mật khẩu mới</label>
          <input type="password" id="cpNewPass" class="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500">
        </div>
        <div>
          <label class="block font-bold text-slate-600 uppercase mb-1">Xác nhận mật khẩu mới</label>
          <input type="password" id="cpConfirmPass" class="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500">
        </div>
      </div>
      <div class="pt-4 border-t flex justify-end gap-2 mt-4">
        <button onclick="closeChangePassModal()" class="px-4 py-2 text-slate-600 rounded-xl font-semibold text-xs">Hủy</button>
        <button onclick="submitChangePassword()" id="btnSubmitChangePass" class="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow transition">Lưu mật khẩu</button>
      </div>
    </div>
  </div>

  <!-- MODAL HỌC SINH NỘP MINH CHỨNG -->
  <div id="proofUploadModal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl text-left">
      <div class="flex justify-between items-center pb-3 border-b mb-4">
        <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
          <i class="fa-solid fa-cloud-arrow-up text-emerald-600"></i> Nộp Minh Chứng Hoàn Thành
        </h3>
        <button onclick="closeProofUploadModal()" class="text-slate-400 hover:text-slate-600 text-xl"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <input type="hidden" id="proofModalTaskId">
      <div class="space-y-3 text-xs">
        <div class="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-emerald-900">
          <div class="font-bold mb-1">📌 Nhiệm vụ: <span id="proofModalTaskTitle">...</span></div>
          <div class="text-[11px] text-emerald-700">File nộp lên sẽ tự động đặt tên thành: <b id="proofModalAutoName" class="font-mono bg-white px-1.5 py-0.5 rounded border">...</b></div>
        </div>
        <div>
          <label class="block font-bold text-slate-600 uppercase mb-1">Chọn ảnh hoặc file minh chứng *</label>
          <input type="file" id="studentProofFile" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip" class="w-full p-2 border rounded-xl bg-slate-50 text-xs">
        </div>
      </div>
      <div class="pt-4 border-t flex justify-end gap-2 mt-4">
        <button onclick="closeProofUploadModal()" class="px-4 py-2 text-slate-600 rounded-xl font-semibold text-xs">Hủy</button>
        <button onclick="submitStudentProof()" id="btnSubmitProof" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow transition flex items-center gap-1.5">
          <i class="fa-solid fa-check-double"></i> Tải lên & Hoàn thành
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL GIAO VIỆC -->
  <div id="taskModal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-3xl p-5 w-full max-w-lg flex flex-col shadow-2xl">
      <div class="flex justify-between items-center pb-2 border-b mb-3">
        <h3 class="font-bold text-slate-800"><i class="fa-solid fa-bullhorn text-blue-600 mr-1.5"></i> Giao Công Việc</h3>
        <button onclick="closeTaskModal()" class="text-slate-400 hover:text-slate-600 text-xl"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="space-y-3 overflow-y-auto max-h-[75vh] pr-1 text-xs">
        <div>
          <label class="block font-bold text-slate-600 uppercase mb-1">Tên công việc *</label>
          <input type="text" id="taskTitle" class="w-full p-2.5 border rounded-xl outline-none font-semibold">
        </div>
        <div>
          <label class="block font-bold text-slate-600 uppercase mb-1">Chi tiết</label>
          <textarea id="taskDesc" rows="2" class="w-full p-2.5 border rounded-xl outline-none"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-600 uppercase mb-1">Link đính kèm</label>
            <input type="text" id="taskLink" class="w-full p-2 border rounded-xl">
          </div>
          <div>
            <label class="block font-bold text-slate-600 uppercase mb-1">Hạn chót</label>
            <input type="date" id="taskDeadline" class="w-full p-2 border rounded-xl">
          </div>
        </div>
      <div>
          <label class="block font-bold text-slate-600 uppercase mb-1">File Drive đính kèm (Đề bài/Tài liệu)</label>
          <input type="file" id="taskFile" class="w-full text-xs">
        </div>
        <div class="bg-amber-50/70 p-3 rounded-2xl border border-amber-200 space-y-2">
          <label class="flex items-center gap-2 cursor-pointer font-bold text-amber-900 text-xs">
            <input type="checkbox" id="taskRequireProof" onchange="toggleProofCodeInput()" class="w-4 h-4 rounded text-amber-600">
            <span>📸 Bắt buộc học sinh nộp file/ảnh minh chứng khi xác nhận xong</span>
          </label>
          <div id="proofCodeContainer" class="hidden pt-1">
            <label class="block font-bold text-slate-600 uppercase mb-1 text-[11px]">Mã minh chứng (Hệ thống tự ghép: Mã - ID học sinh 6 số) *</label>
            <input type="text" id="taskProofCode" placeholder="VD: BTVN01, DOANPHI, ..." class="w-full p-2 border border-amber-300 rounded-xl bg-white outline-none font-mono font-bold text-xs text-amber-800">
          </div>
        </div>
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="block font-bold text-slate-600 uppercase">Giao cho ai *</label>
            <button type="button" onclick="toggleSelectAllStudents()" class="text-blue-600 font-bold hover:underline">Chọn cả lớp</button>
          </div>
          <div id="studentCheckList" class="border rounded-xl p-2 max-h-36 overflow-y-auto grid grid-cols-2 gap-1.5 bg-slate-50"></div>
        </div>
      </div>
      <div class="pt-3 border-t flex justify-end gap-2 mt-3">
        <button onclick="closeTaskModal()" class="px-4 py-2 text-slate-600 rounded-xl font-semibold text-xs">Hủy</button>
        <button onclick="submitNewTask()" id="btnSubmitTask" class="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs">Giao việc</button>
      </div>
    </div>
  </div>

  <!-- MODAL QUẢN LÝ DANH MỤC NỀ NẾP & THƯỞNG -->
  <div id="vpConfigModal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl text-xs">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200 mb-3">
        <h3 class="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
          <i class="fa-solid fa-gear text-slate-700"></i> Quản Lý Danh Mục Nề Nếp & Thưởng
        </h3>
        <button type="button" onclick="closeVpConfigModal()" class="text-slate-400 hover:text-slate-600 text-xl p-1"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="overflow-y-auto flex-1 space-y-4 pr-1">
        <div class="bg-red-50/60 p-3 rounded-2xl border border-red-200">
          <div class="flex justify-between items-center mb-2">
            <label class="font-bold text-red-600 uppercase text-xs">Lỗi vi phạm (Trừ điểm)</label>
            <button type="button" onclick="addPresetRow('TRU')" class="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-[11px] shadow-sm flex items-center gap-1">
              <i class="fa-solid fa-plus"></i> Thêm lỗi
            </button>
          </div>
          <div id="presetTruContainer" class="space-y-2"></div>
        </div>

        <div class="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200">
          <div class="flex justify-between items-center mb-2">
            <label class="font-bold text-emerald-700 uppercase text-xs">Khen thưởng (Cộng điểm)</label>
            <button type="button" onclick="addPresetRow('CONG')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] shadow-sm flex items-center gap-1">
              <i class="fa-solid fa-plus"></i> Thêm thưởng
            </button>
          </div>
          <div id="presetCongContainer" class="space-y-2"></div>
        </div>
      </div>

      <div class="pt-3 border-t border-slate-200 flex justify-end gap-2 mt-3">
        <button type="button" onclick="closeVpConfigModal()" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold">Hủy</button>
        <button type="button" onclick="saveVpPresetsConfigToServer()" id="btnSavePresetConfig" class="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow">Lưu Vào Hệ Thống</button>
      </div>
    </div>
  </div>

  <!-- THANH ĐIỀU HƯỚNG DƯỚI CHO MOBILE -->
  <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around py-2 px-1 z-50 shadow-2xl text-[10px] font-bold">
    <button onclick="switchTab('tkb')" id="bnav-tkb" class="bnav-btn flex flex-col items-center gap-1 p-1 text-emerald-600 transition">
      <i class="fa-solid fa-calendar-days text-base"></i>
      <span>TKB</span>
    </button>
    <button onclick="switchTab('overview')" id="bnav-overview" class="bnav-btn relative flex flex-col items-center gap-1 p-1 text-slate-400 transition">
      <i class="fa-solid fa-list-check text-base"></i>
      <span>Công việc</span>
      <span id="bnavBadgeWork" class="hidden absolute top-0.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
    </button>
    <button onclick="switchTab('bonus')" id="bnav-bonus" class="bnav-btn flex flex-col items-center gap-1 p-1 text-slate-400 transition">
      <i class="fa-solid fa-star text-base"></i>
      <span>Điểm số</span>
    </button>
    <button onclick="switchTab('violation')" id="bnav-violation" class="bnav-btn flex flex-col items-center gap-1 p-1 text-slate-400 transition">
      <i class="fa-solid fa-triangle-exclamation text-base"></i>
      <span>Vi phạm</span>
    </button>
    <button onclick="switchTab('lucky')" id="bnav-lucky" class="bnav-btn flex flex-col items-center gap-1 p-1 text-slate-400 transition">
      <i class="fa-solid fa-dice text-base"></i>
      <span>Quay số</span>
    </button>
    <button onclick="switchTab('fund')" id="bnav-fund" class="bnav-btn relative flex flex-col items-center gap-1 p-1 text-slate-400 transition">
      <i class="fa-solid fa-wallet text-base"></i>
      <span>Quỹ lớp</span>
      <span id="bnavBadgeFund" class="hidden absolute top-0.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
    </button>
  </div>
  <div class="h-16 md:hidden"></div>
`;

export default function FullAppPage() {
  useEffect(() => {
    if (window.__MRVY_INITIALIZED__) return;
    window.__MRVY_INITIALIZED__ = true;

    // 1. Cầu nối giả lập google.script.run gọi thẳng vào Server Actions của Next.js
    const createRunner = (onSuccess, onFailure) =>
      new Proxy(
        {},
        {
          get(_, prop) {
            if (prop === 'withSuccessHandler') return (fn) => createRunner(fn, onFailure);
            if (prop === 'withFailureHandler') return (fn) => createRunner(onSuccess, fn);
            return (...args) => {
              if (typeof actions[prop] === 'function') {
                actions[prop](...args)
                  .then((res) => {
                    if (onSuccess) onSuccess(res);
                  })
                  .catch((err) => {
                    if (onFailure) onFailure(err);
                    else console.error(err);
                  });
              }
            };
          },
        }
      );

    window.google = { script: { run: createRunner(null, null) } };

    // 2. Toàn bộ biến trạng thái & logic từ Index.html gốc
    function getAuthToken() { return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || ''; }
    let currentUser = null;
    let appData = {
      students: [], tasks: [], bonusPoints: [], violations: [], funds: [],
      tkbData: { grid: [], notes: { truong: [], nha: [] } },
      appConfig: { logoUrl: '', brandTitle: 'MR Vy', brandSub: 'Hệ thống quản lý', headerSlogan: '10A4 - Đoàn Kết - Học Tốt' }
    };
    let currentLogoBase64 = '';
    let currentBonusSubView = 'summary';
    let currentVpSubView = 'summary';
    let isAllLuckyPoolSelected = true;
    let seatState = [];
    let isAllSelected = false;
    let editingTaskId = null;
    let isAllBonusSelected = false;
    let isAllVpSelected = false;

    let VP_PRESETS = {
      TRU: [
        { name: "Đi học muộn / Trễ tiết", score: -2 },
        { name: "Không mặc đúng đồng phục / Không đeo phù hiệu", score: -2 },
        { name: "Sử dụng điện thoại trong giờ học", score: -5 },
        { name: "Mất trật tự / Làm việc riêng trong lớp", score: -2 },
        { name: "Không thuộc bài / Không làm bài tập", score: -2 },
        { name: "Vắng học không phép", score: -10 },
        { name: "Trực nhật bẩn / Quên trực nhật", score: -5 },
        { name: "Vứt rác bừa bãi trong lớp", score: -3 },
        { name: "Khác... (Tự nhập điểm & ghi chú)", score: 0 }
      ],
      CONG: [
        { name: "Nhặt được của rơi trả lại người mất", score: 5 },
        { name: "Giúp đỡ bạn bè / Tham gia dọn vệ sinh gương mẫu", score: 3 },
        { name: "Đạt thành tích thi đua / Phong trào Đoàn", score: 10 },
        { name: "Được giáo viên khen ngợi nề nếp", score: 5 },
        { name: "Khác... (Tự nhập điểm & ghi chú)", score: 0 }
      ]
    };

    const subjectColorPalette = [
      { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
      { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' },
      { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
      { bg: '#f3e8ff', text: '#7e22ce', border: '#e9d5ff' },
      { bg: '#ffe4e6', text: '#be123c', border: '#fecdd3' },
      { bg: '#ccfbf1', text: '#0f766e', border: '#99f6e4' },
      { bg: '#ffedd5', text: '#c2410c', border: '#fed7aa' }
    ];

    const tkbRowsConfig = [
      { type: 'header', label: '▼ BUỔI SÁNG (TRƯỜNG)', bg: '#e0f2fe', color: '#0369a1' },
      { id: 'S1', label: 'T1: 7h-7h45' },
      { id: 'S2', label: 'T2: 7h50-8h35' },
      { id: 'S3', label: 'T3: 9h-9h45' },
      { id: 'S4', label: 'T4: 9h50-10h35' },
      { id: 'S5', label: 'T5: 10h40-11h25' },
      { type: 'header', label: '▼ BUỔI CHIỀU (TRƯỜNG)', bg: '#fef3c7', color: '#92400e' },
      { id: 'C1', label: 'T1: 1h30-2h15' },
      { id: 'C2', label: 'T2: 2h20-3h05' },
      { id: 'C3', label: 'T3: 3h10-3h55' },
      { id: 'C4', label: 'T4: 4h-4h45' }
    ];

    window.applyLoggedInState = function(user, token) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('savedUser', JSON.stringify(user));
      sessionStorage.setItem('authToken', token);
      currentUser = user;

      document.getElementById('loginSection').classList.add('hidden');
      document.getElementById('dashboardSection').classList.remove('hidden');
      
      document.getElementById('userDisplayName').innerText = currentUser.hoTen;
      document.getElementById('userRoleBadge').innerText = currentUser.role;
      
      const uMob = document.getElementById('userDisplayNameMobile');
      const rMob = document.getElementById('userRoleBadgeMobile');
      if (uMob) uMob.innerText = currentUser.hoTen;
      if (rMob) rMob.innerText = currentUser.role;
      
      window.checkRoleAccess();
      window.loadData();
    };

    window.handleLogin = function() {
      const u = document.getElementById('loginUsername').value.trim();
      const p = document.getElementById('loginPassword').value.trim();
      if (!u || !p) { alert('Vui lòng nhập đầy đủ tên đăng nhập & mật khẩu!'); return; }

      const btn = document.getElementById('btnLoginSubmit');
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang vào...';
      btn.disabled = true;

      window.google.script.run.withSuccessHandler(res => {
        btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Đăng Nhập';
        btn.disabled = false;
        if (res.success) {
          window.applyLoggedInState(res.user, res.token);
        } else {
          alert(res.message);
        }
      }).loginUser(u, p);
    };

    window.handleLogout = function() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('savedUser');
      sessionStorage.removeItem('authToken');
      currentUser = null;
      document.getElementById('dashboardSection').classList.add('hidden');
      document.getElementById('loginSection').classList.remove('hidden');
      document.getElementById('loginPassword').value = '';
    };

    window.checkRoleAccess = function() {
      const r = (currentUser && currentUser.role) ? currentUser.role.toLowerCase() : '';
      const isAdmin = (r === 'admin');
      const isLopTruong = (r === 'loptruong' || r.includes('lớp trưởng') || r.includes('lop truong'));
      const isBiThu = (r === 'bithu' || r.includes('bí thư') || r.includes('bi thu'));
      const isHocTap = (r === 'lopphohoctap' || r.includes('học tập') || r.includes('hoc tap'));
      const isKyLuat = (r === 'lopphokyluat' || r.includes('kỷ luật') || r.includes('ky luat') || r.includes('trật tự') || r.includes('trat tu'));
      const isThuQuy = (r === 'thuquy' || r.includes('thủ quỹ') || r.includes('thu quy'));

      const navThongTin = document.getElementById('nav-thongtin');
      if (navThongTin) navThongTin.classList.toggle('hidden', !isAdmin);

      ['btnPasteTKB', 'btnScanTKB', 'btnSaveSchedule', 'btnAddNoteTruong', 'btnAddNoteNha', 'btnAddBonus'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('hidden', !(isAdmin || isHocTap));
      });

      const btnTask = document.getElementById('btnAddTask');
      if (btnTask) btnTask.classList.toggle('hidden', !(isAdmin || isLopTruong || isBiThu));

      ['btnAddViolation', 'btnConfigVp'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('hidden', !(isAdmin || isKyLuat));
      });

      ['luckyDrawControl', 'btnGenerateSeating'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('hidden', !(isAdmin || isLopTruong));
      });

      ['btnAddFundThu', 'btnAddFundChi', 'btnAddFundThuong'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('hidden', !(isAdmin || isThuQuy));
      });
    };

    window.loadData = function() {
      const today = new Date();
      const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const dateStr = `${days[today.getDay()]}, ${today.getDate()}/${today.getMonth()+1}`;

      const dtPC = document.getElementById('currentDateBadge');
      const dtMob = document.getElementById('currentDateBadgeMobile');
      if (dtPC) dtPC.innerText = dateStr;
      if (dtMob) dtMob.innerText = dateStr;

      window.google.script.run.withSuccessHandler(data => {
        appData = data;
        window.applyAppConfig(data.appConfig);
        const elAdmMail = document.getElementById('cfgAdminEmail');
        if (elAdmMail) elAdmMail.value = data.adminEmail || '';
        window.renderStudentsForModal();
        window.renderTasks();
        window.renderTKBTable();
        window.renderNotes();
        window.renderBonusView();
        window.renderViolationsView();
        window.renderFunds();
        window.renderStudentManagerTable();
        window.renderLuckyStudentPool();
        window.initSeatingGrid();
      }).getInitialData(getAuthToken());
    };

   let currentLoginBgBase64 = '';

    window.applyAppConfig = function(cfg) {
      if (!cfg) return;
      const logo = cfg.logoUrl || 'https://ui-avatars.com/api/?name=MV&background=10b981&color=fff';
      const loginBg = cfg.loginBgUrl || '';
      const title = cfg.brandTitle || "MR Vy";
      const sub = cfg.brandSub || "Hệ thống quản lý";
      const slogan = cfg.headerSlogan || "10A4 - Đoàn Kết - Học Tốt";

      ['topbarAvatarImg', 'cfgLogoPreview'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.src = logo;
      });

      const loginSec = document.getElementById('loginSection');
      if (loginSec) {
        if (loginBg) {
          loginSec.style.backgroundImage = `url('${loginBg}')`;
        } else {
          loginSec.style.backgroundImage = 'none';
        }
      }

      const bgPrev = document.getElementById('cfgLoginBgPreview');
      if (bgPrev) {
        bgPrev.src = loginBg || 'https://placehold.co/600x400/e2e8f0/64748b?text=Chua+co+anh+nen';
      }

      ['loginBrandTitle', 'topbarBrandTitle'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = title;
      });
      ['loginBrandSub', 'topbarBrandSub'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = sub;
      });

      const elTopSlogan = document.getElementById('topbarSloganText');
      const elMobSlogan = document.getElementById('mobileSloganText');
      if (elTopSlogan) elTopSlogan.innerHTML = `<i class="fa-solid fa-star text-amber-400 text-xs"></i> ${slogan} <i class="fa-solid fa-star text-amber-400 text-xs"></i>`;
      if (elMobSlogan) elMobSlogan.innerText = `🌟 ${slogan} 🌟`;

      const elInputUrl = document.getElementById('cfgLogoUrl');
      const elInputBgUrl = document.getElementById('cfgLoginBgUrl');
      const elInputTitle = document.getElementById('cfgBrandTitle');
      const elInputSub = document.getElementById('cfgBrandSub');
      const elInputSlogan = document.getElementById('cfgHeaderSlogan');
      if (elInputUrl) elInputUrl.value = (cfg.logoUrl && !cfg.logoUrl.startsWith('data:image/')) ? cfg.logoUrl : '';
      if (elInputBgUrl) elInputBgUrl.value = (cfg.loginBgUrl && !cfg.loginBgUrl.startsWith('data:image/')) ? cfg.loginBgUrl : '';
      if (elInputTitle) elInputTitle.value = title;
      if (elInputSub) elInputSub.value = sub;
      if (elInputSlogan) elInputSlogan.value = slogan;
    };

    window.previewLogoFile = function(input) {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
          const img = new Image();
          img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const size = 160;
            canvas.width = size;
            canvas.height = size;
            ctx.drawImage(img, 0, 0, size, size);
            currentLogoBase64 = canvas.toDataURL('image/jpeg', 0.85);
            document.getElementById('cfgLogoPreview').src = currentLogoBase64;
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    window.previewLoginBgFile = function(input) {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
          const img = new Image();
          img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const maxW = 1600;
            const scale = img.width > maxW ? (maxW / img.width) : 1;
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            currentLoginBgBase64 = canvas.toDataURL('image/jpeg', 0.82);
            document.getElementById('cfgLoginBgPreview').src = currentLoginBgBase64;
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    window.saveBrandSettings = function() {
      const title = document.getElementById('cfgBrandTitle').value.trim();
      const sub = document.getElementById('cfgBrandSub').value.trim();
      const slogan = document.getElementById('cfgHeaderSlogan').value.trim();
      const adminEmail = document.getElementById('cfgAdminEmail') ? document.getElementById('cfgAdminEmail').value.trim() : '';

      let logoUrl = document.getElementById('cfgLogoUrl').value.trim();
      if (currentLogoBase64) logoUrl = currentLogoBase64;
      else if (!logoUrl && appData.appConfig.logoUrl) logoUrl = appData.appConfig.logoUrl;

      let loginBgUrl = document.getElementById('cfgLoginBgUrl') ? document.getElementById('cfgLoginBgUrl').value.trim() : '';
      if (currentLoginBgBase64) loginBgUrl = currentLoginBgBase64;
      else if (!loginBgUrl && appData.appConfig.loginBgUrl) loginBgUrl = appData.appConfig.loginBgUrl;

      const configObj = {
        brandTitle: title,
        brandSub: sub,
        headerSlogan: slogan,
        logoUrl: logoUrl,
        loginBgUrl: loginBgUrl,
        adminEmail: adminEmail
      };

      const btn = document.getElementById('btnSaveBrand');
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang lưu...';
      btn.disabled = true;

      window.google.script.run.withSuccessHandler(res => {
        btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Lưu Cài Đặt Giao Diện';
        btn.disabled = false;
        if (res.success) {
          alert('Đã lưu cài đặt giao diện & ảnh nền thành công!');
          window.loadData();
        } else alert('Lỗi: ' + res.message);
      }).saveAppConfig(configObj, getAuthToken());
    };

    window.renderStudentManagerTable = function() {
      const tbody = document.getElementById('studentManagerTableBody');
      if (!tbody) return;
      tbody.innerHTML = appData.students.map((s, idx) => `
        <tr class="hover:bg-slate-50 transition">
          <td class="p-3 text-center font-bold text-slate-400">${idx + 1}</td>
          <td class="p-3 font-mono font-bold text-blue-700">${s.maHS}</td>
          <td class="p-3 font-mono text-slate-600 bg-slate-50/50">${s.password}</td>
          <td class="p-3 font-bold text-slate-800">${s.hoTen}</td>
          <td class="p-3 text-center"><span class="px-2 py-0.5 rounded text-[11px] ${s.gioiTinh === 'Nam' ? 'bg-blue-100 text-blue-700 font-bold' : 'bg-pink-100 text-pink-700 font-bold'}">${s.gioiTinh || '---'}</span></td>
          <td class="p-3 text-center font-medium text-slate-600">${s.ngaySinh || '---'}</td>
          <td class="p-3 text-center font-mono font-semibold text-blue-600">${s.soHS || '---'}</td>
          <td class="p-3 text-center font-mono font-semibold text-emerald-600">${s.soPH || '---'}</td>
          <td class="p-3 font-mono text-slate-600">${s.email || '---'}</td>
          <td class="p-3 text-center"><span class="px-2.5 py-1 rounded-xl text-xs font-extrabold ${s.role === 'STUDENT' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-800'}">${s.role}</span></td>
          <td class="p-3 text-center">
            <button onclick="openEditStudentModal('${s.maHS}')" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow transition">
              <i class="fa-solid fa-user-pen"></i> Sửa
            </button>
          </td>
        </tr>
      `).join('');
    };

    window.filterStudentTable = function() {
      const keyword = document.getElementById('searchStudentInput').value.toLowerCase().trim();
      const rows = document.querySelectorAll('#studentManagerTableBody tr');
      rows.forEach(r => {
        const text = r.innerText.toLowerCase();
        r.style.display = text.includes(keyword) ? '' : 'none';
      });
    };

    window.openEditStudentModal = function(maHS) {
      const s = appData.students.find(x => x.maHS === maHS);
      if (!s) return;
      document.getElementById('edStudentMaHS').value = s.maHS;
      document.getElementById('edStudentHoTen').value = s.hoTen;
      document.getElementById('edStudentPass').value = s.password === '••••••' ? '' : s.password;
      document.getElementById('edStudentGioiTinh').value = s.gioiTinh || 'Nữ';
      document.getElementById('edStudentNgaySinh').value = s.ngaySinh || '';
      document.getElementById('edStudentSoHS').value = s.soHS || '';
      document.getElementById('edStudentSoPH').value = s.soPH || '';
      document.getElementById('edStudentEmail').value = s.email || '';
      document.getElementById('edStudentRole').value = s.role || 'STUDENT';
      document.getElementById('editStudentModal').classList.remove('hidden');
    };

    window.closeEditStudentModal = function() {
      document.getElementById('editStudentModal').classList.add('hidden');
    };

    window.submitEditStudent = function() {
      const obj = {
        maHS: document.getElementById('edStudentMaHS').value,
        hoTen: document.getElementById('edStudentHoTen').value.trim(),
        password: document.getElementById('edStudentPass').value.trim(),
        gioiTinh: document.getElementById('edStudentGioiTinh').value,
        ngaySinh: document.getElementById('edStudentNgaySinh').value.trim(),
        soHS: document.getElementById('edStudentSoHS').value.trim(),
        soPH: document.getElementById('edStudentSoPH').value.trim(),
        email: document.getElementById('edStudentEmail').value.trim(),
        role: document.getElementById('edStudentRole').value
      };

      const btn = document.getElementById('btnSubmitEditStudent');
      btn.innerText = 'Đang lưu...';
      btn.disabled = true;

      window.google.script.run.withSuccessHandler(res => {
        btn.innerText = 'Lưu Thay Đổi';
        btn.disabled = false;
        if (res.success) {
          window.closeEditStudentModal();
          window.loadData();
        } else alert('Lỗi: ' + res.message);
      }).updateStudentAccount(obj, getAuthToken());
    };

    window.switchTab = function(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
      const activeContent = document.getElementById('tab-' + tabId);
      if (activeContent) activeContent.classList.remove('hidden');
      
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active-nav-btn'));
      const activeBtn = document.getElementById('nav-' + tabId);
      if (activeBtn) activeBtn.classList.add('active-nav-btn');

      document.querySelectorAll('.bnav-btn').forEach(b => {
        b.classList.remove('text-emerald-600', 'text-blue-600', 'text-amber-500', 'text-red-500', 'text-purple-600', 'text-indigo-600', 'font-extrabold');
        b.classList.add('text-slate-400');
      });

      const activeBnav = document.getElementById('bnav-' + tabId);
      if (activeBnav) {
        activeBnav.classList.remove('text-slate-400');
        let colorClass = 'text-emerald-600';
        if (tabId === 'overview') colorClass = 'text-blue-600';
        if (tabId === 'bonus') colorClass = 'text-amber-500';
        if (tabId === 'violation') colorClass = 'text-red-500';
        if (tabId === 'lucky') colorClass = 'text-purple-600';
        if (tabId === 'fund') colorClass = 'text-indigo-600';
        activeBnav.classList.add(colorClass, 'font-extrabold');
      }
    };

    window.openChangePassModal = function() {
      document.getElementById('cpOldPass').value = '';
      document.getElementById('cpNewPass').value = '';
      document.getElementById('cpConfirmPass').value = '';
      document.getElementById('changePassModal').classList.remove('hidden');
    };
    window.closeChangePassModal = function() {
      document.getElementById('changePassModal').classList.add('hidden');
    };

    window.submitChangePassword = function() {
      const oldP = document.getElementById('cpOldPass').value.trim();
      const newP = document.getElementById('cpNewPass').value.trim();
      const confP = document.getElementById('cpConfirmPass').value.trim();

      if (!oldP || !newP) { alert('Vui lòng nhập đầy đủ mật khẩu cũ và mới!'); return; }
      if (newP !== confP) { alert('Xác nhận mật khẩu mới không khớp!'); return; }

      const btn = document.getElementById('btnSubmitChangePass');
      btn.innerText = 'Đang lưu...';
      btn.disabled = true;

      window.google.script.run.withSuccessHandler(res => {
        btn.innerText = 'Lưu mật khẩu';
        btn.disabled = false;
        if (res.success) {
          alert('Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới.');
          window.closeChangePassModal();
        } else {
          alert('Lỗi: ' + res.message);
        }
      }).changeUserPassword(currentUser.username, oldP, newP, getAuthToken());
    };

    // ================= THỜI KHÓA BIỂU =================
    window.renderTKBTable = function() {
      const tbody = document.getElementById('tblFullTKBBody');
      if (!tbody) return;
      tbody.innerHTML = '';
      const r = (currentUser && currentUser.role) ? currentUser.role.toLowerCase() : '';
      const canEditTKB = (r === 'admin' || r === 'lopphohoctap' || r.includes('học tập') || r.includes('hoc tap'));

      const subjectColorMap = {};
      let colorIndex = 0;

      (appData.tkbData.grid || []).forEach(row => {
        (row.cols || []).forEach(cellText => {
          if (cellText) {
            const firstLine = String(cellText).split('\n')[0].trim().toLowerCase();
            if (firstLine && !subjectColorMap[firstLine]) {
              subjectColorMap[firstLine] = subjectColorPalette[colorIndex % subjectColorPalette.length];
              colorIndex++;
            }
          }
        });
      });

      tkbRowsConfig.forEach((cfg) => {
        if (cfg.type === 'header') {
          tbody.innerHTML += `
            <tr style="background-color: ${cfg.bg}; color: ${cfg.color}; font-weight: 800;" class="text-[11px] uppercase tracking-wider">
              <td colspan="8" class="p-1.5 border border-slate-200 text-center">${cfg.label}</td>
            </tr>
          `;
        } else {
          let rowData = (appData.tkbData.grid || []).find(r => r.id === cfg.id) || { id: cfg.id, cols: ['', '', '', '', '', '', ''] };
          let cellsHtml = '';

          for (let d = 0; d < 7; d++) {
            const rawContent = String(rowData.cols[d] || '');
            const lines = rawContent.split('\n').filter(l => l.trim() !== '');
            const mainText = lines[0] || '';
            const subLines = lines.slice(1);

            let cellStyle = 'background-color: #ffffff; color: #334155;';
            if (mainText.trim()) {
              const matchedColor = subjectColorMap[mainText.trim().toLowerCase()];
              if (matchedColor) {
                cellStyle = `background-color: ${matchedColor.bg}; color: ${matchedColor.text}; border: 1px solid ${matchedColor.border};`;
              }
            }

            let formattedDisplay = '';
            if (mainText) {
              formattedDisplay = `<div>${mainText}</div>`;
              if (subLines.length > 0) {
                formattedDisplay += subLines.map(sl => `<span class="sub-line-red">${sl}</span>`).join('');
              }
            }

            cellsHtml += `
              <td class="p-1 border border-slate-200 align-middle">
                <div class="tkb-cell-editable" 
                     style="${cellStyle}" 
                     contenteditable="${canEditTKB}" 
                     data-row="${cfg.id}" 
                     data-col="${d}" 
                     onfocus="onTKBCellFocus(this)"
                     onblur="onTKBCellBlur(this)">${formattedDisplay}</div>
              </td>
            `;
          }

          tbody.innerHTML += `
            <tr class="hover:bg-slate-50/60">
              <td class="p-2 border border-slate-200 font-bold bg-slate-50 text-slate-700 text-center sticky left-0 z-0 whitespace-nowrap">${cfg.label}</td>
              ${cellsHtml}
            </tr>
          `;
        }
      });
    };

    window.onTKBCellFocus = function(element) {
      const rowId = element.getAttribute('data-row');
      const colIdx = parseInt(element.getAttribute('data-col'));
      let row = (appData.tkbData.grid || []).find(r => r.id === rowId);
      if (row && row.cols[colIdx]) {
        element.innerText = row.cols[colIdx];
      }
    };

    window.onTKBCellBlur = function(element) {
      const rowId = element.getAttribute('data-row');
      const colIdx = parseInt(element.getAttribute('data-col'));
      const textVal = element.innerText.trim();

      let row = appData.tkbData.grid.find(r => r.id === rowId);
      if (!row) {
        row = { id: rowId, cols: ['', '', '', '', '', '', ''] };
        appData.tkbData.grid.push(row);
      }
      row.cols[colIdx] = textVal;
      window.renderTKBTable();
      window.saveAllScheduleAndNotes(true);
    };

    window.renderNotes = function() {
      const renderList = (containerId, type) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        const list = (appData.tkbData.notes && appData.tkbData.notes[type]) ? appData.tkbData.notes[type] : [];
        const r = (currentUser && currentUser.role) ? currentUser.role.toLowerCase() : '';
        const canEditNotes = (r === 'admin' || r === 'lopphohoctap' || r.includes('học tập') || r.includes('hoc tap'));

        container.innerHTML = list.map((item, idx) => `
          <div class="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleNoteCheck('${type}', ${idx}, this.checked)" class="w-4 h-4 rounded text-blue-600">
            <input type="text" value="${item.text}" ${canEditNotes ? `onchange="updateNoteText('${type}', ${idx}, this.value)"` : 'readonly'} class="flex-1 text-xs outline-none ${item.done ? 'line-through text-slate-400' : 'text-slate-700 font-medium'} bg-transparent">
            ${canEditNotes ? `<button onclick="deleteNoteRow('${type}', ${idx})" class="text-slate-300 hover:text-red-500 text-xs"><i class="fa-solid fa-xmark"></i></button>` : ''}
          </div>
        `).join('');
      };

      renderList('noteTruongList', 'truong');
      renderList('noteNhaList', 'nha');
    };

    window.addNoteRow = function(type) {
      if (!appData.tkbData.notes) appData.tkbData.notes = { truong: [], nha: [] };
      if (!appData.tkbData.notes[type]) appData.tkbData.notes[type] = [];
      appData.tkbData.notes[type].push({ text: 'Nhiệm vụ mới...', done: false });
      window.renderNotes();
      window.saveAllScheduleAndNotes(true);
    };

    window.updateNoteText = function(type, idx, val) {
      appData.tkbData.notes[type][idx].text = val;
      window.saveAllScheduleAndNotes(true);
    };
    window.toggleNoteCheck = function(type, idx, done) {
      appData.tkbData.notes[type][idx].done = done;
      window.renderNotes();
      window.saveAllScheduleAndNotes(true);
    };
    window.deleteNoteRow = function(type, idx) {
      appData.tkbData.notes[type].splice(idx, 1);
      window.renderNotes();
      window.saveAllScheduleAndNotes(true);
    };

    window.saveAllScheduleAndNotes = function(silent = false) {
      const btn = document.getElementById('btnSaveSchedule');
      if (btn && !silent) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang lưu...';
        btn.disabled = true;
      }

      window.google.script.run.withSuccessHandler(() => {
        if (btn && !silent) {
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Đã lưu';
          btn.classList.replace('bg-emerald-600', 'bg-blue-600');
          setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Lưu Thay Đổi';
            btn.classList.replace('bg-blue-600', 'bg-emerald-600');
            btn.disabled = false;
          }, 1500);
        }
      }).saveTKBPackage(appData.tkbData.grid, appData.tkbData.notes, getAuthToken());
    };

    
  function removeVN(str) {
      return String(str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    function normalizeSubjectFromText(rawText) {
      if (!rawText) return '';
      const s = removeVN(rawText);
      const compact = s.replace(/\s+/g, '');
      if (!compact || compact.length < 2) return '';

      // 1. Ưu tiên kiểm tra GDĐP, GDKT&PL, GDQP&AN, GDTC trước để không bị trùng từ "giáo dục" / "nội dung"
      if (
        s.includes('dia phuong') || s.includes('noi dung') || s.includes('cua dia') ||
        compact.includes('gddp') || compact.includes('diaphuong') || compact.includes('noidung') || compact.includes('phuong')
      ) return 'GDĐP';

      if (s.includes('kinh te') || s.includes('phap luat') || compact.includes('gdkt') || compact.includes('kinhte') || compact.includes('phapluat')) return 'GDKT&PL';
      if (s.includes('quoc phong') || s.includes('an ninh') || compact.includes('gdqp') || compact.includes('quocphong') || compact.includes('anninh')) return 'GDQP&AN';
      if (s.includes('the chat') || s.includes('the duc') || compact.includes('gdtc') || compact.includes('thechat')) return 'GDTC';

      // 2. Hoạt động trải nghiệm, hướng nghiệp
      if (
        s.includes('trai nghiem') || s.includes('huong nghiep') || s.includes('hoat dong') ||
        compact.includes('hdtn') || compact.includes('trainghiem') || compact.includes('huongnghiep') || compact.includes('nghiem')
      ) return 'HĐTN-HN';

      // 3. Các môn học cơ bản (Bắt cả lỗi OCR đọc nhầm "Địa lí" -> "Đàa lí", "Đla lí", "Đja lí")
      if (compact.includes('chaoco') || compact.includes('cha0c0') || s.includes('chao co') || compact.includes('chao')) return 'Chào cờ';
      if (s.includes('sinh hoat') || compact.includes('sinhhoat') || compact.includes('shl')) return 'Sinh hoạt';
      if (s.includes('ngoai ngu') || s.includes('tieng anh') || compact.includes('ngoaingu') || compact.includes('ngoai')) return 'Tiếng Anh';
      if (s.includes('toan') || compact.includes('toan') || compact.includes('t0an')) return 'Toán';
      if (s.includes('ngu van') || /\bvan\b/.test(s) || compact.includes('nguvan')) return 'Ngữ văn';
      if (s.includes('vat li') || s.includes('vat ly') || compact.includes('vatli') || compact.includes('vatly') || compact.includes('vatl') || /\bvat\b/.test(s)) return 'Vật lí';
      if (s.includes('hoa hoc') || /\bhoa\b/.test(s) || compact.includes('hoahoc')) return 'Hóa học';
      if (s.includes('sinh hoc') || compact.includes('sinhhoc')) return 'Sinh học';
      if (s.includes('lich su') || compact.includes('lichsu') || compact.includes('lich')) return 'Lịch sử';
      if (
        s.includes('dia li') || s.includes('dia ly') || s.includes('daa li') ||
        compact.includes('diali') || compact.includes('dialy') || compact.includes('daali') ||
        compact.includes('d1ali') || compact.includes('dlali') || compact.includes('djali') ||
        compact.includes('iali') || compact.includes('aali') || /^d[a-z]{1,3}li/.test(compact) || /\bdia\b/.test(s)
      ) return 'Địa lí';
      if (s.includes('cong nghe') || compact.includes('congnghe') || compact.includes('cong')) return 'Công nghệ';
      if (s.includes('tin hoc') || /\btin\b/.test(s) || compact.includes('tinhoc')) return 'Tin học';

      return rawText.trim().split('\n')[0].substring(0, 18);
    }

    // CÁCH 1: DÁN TRỰC TIẾP TỪ EXCEL / WORD (0.5 GIÂY - CHÍNH XÁC 100%)
    window.openPasteTKBModal = function() {
      const raw = prompt('📋 Copy vùng bảng Thời Khóa Biểu từ Excel/Word rồi dán (Ctrl+V) vào ô dưới đây:');
      if (!raw || !raw.trim()) return;

      const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const targetIds = ['S1', 'S2', 'S3', 'S4', 'S5', 'C1', 'C2', 'C3', 'C4'];
      const validRows = [];

      for (const line of lines) {
        const low = removeVN(line);
        if (low.includes('buoi sang') || low.includes('buoi chieu') || (low.includes('thu 2') && low.includes('thu 3'))) continue;
        let cells = line.split('\t');
        // Nếu cột đầu là số thứ tự tiết (1..5) thì bỏ cột đầu đi
        if (cells.length >= 2 && /^[1-5]$/.test(cells[0].trim())) {
          cells = cells.slice(1);
        }
        const mapped = [0, 1, 2, 3, 4, 5, 6].map(i => normalizeSubjectFromText(cells[i] || ''));
        if (mapped.some(Boolean) || cells.length >= 5) {
          validRows.push(mapped);
        }
      }

      const newGrid = targetIds.map((id, idx) => ({
        id,
        cols: validRows[idx] || ['', '', '', '', '', '', '']
      }));

      appData.tkbData.grid = newGrid;
      window.renderTKBTable();
      alert('🎉 Đã điền Thời Khóa Biểu tức thì! Hãy kiểm tra và bấm "Lưu Thay Đổi".');
    };

    // CÁCH 2: QUÉT ẢNH SIÊU TỐC TRONG 5 GIÂY (1-PASS OCR + ĐỊNH VỊ THANH MÀU XANH XÁM)
    async function runFastOnePassOCR(imgElement, btn, oldHtml, input) {
      try {
        btn.innerHTML = '<i class="fa-solid fa-bolt fa-beat"></i> Đang quét siêu tốc (5s)...';
        if (!window.Tesseract) {
          await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
          });
        }

        const W = imgElement.width;
        const H = imgElement.height;
        const c = document.createElement('canvas');
        c.width = W; c.height = H;
        const ctx = c.getContext('2d');
        ctx.drawImage(imgElement, 0, 0);
        const px = ctx.getImageData(0, 0, W, H).data;

        // 1. Dò 7 đường kẻ dọc chia 6 cột Thứ 2 -> Thứ 7
        const vRaw = [];
        for (let x = Math.floor(W * 0.04); x < W; x++) {
          let dark = 0;
          for (let y = Math.floor(H * 0.05); y < Math.floor(H * 0.90); y += 2) {
            const i = (y * W + x) * 4;
            if (px[i] < 170 && px[i + 1] < 170 && px[i + 2] < 170) dark++;
          }
          if (dark > H * 0.22) vRaw.push(x);
        }
        const vLines = [];
        for (const x of vRaw) {
          if (vLines.length === 0 || x - vLines[vLines.length - 1] > W * 0.05) vLines.push(x);
        }

        let colBounds = [];
        if (vLines.length >= 7) {
          const last7 = vLines.slice(vLines.length - 7);
          for (let i = 0; i < 6; i++) colBounds.push({ x1: last7[i], x2: last7[i + 1] });
        } else {
          const lefts = [0.073, 0.227, 0.381, 0.536, 0.690, 0.845];
          for (let i = 0; i < 6; i++) colBounds.push({ x1: Math.round(W * lefts[i]), x2: Math.round(W * (lefts[i] + 0.153)) });
        }

        // 2. Dò đúng 2 thanh tiêu đề màu xanh xám ("Thứ 2..Thứ 7" Buổi sáng và Buổi chiều)
        // Màu nền của thanh "Thứ 2..Thứ 7" trong Excel có màu xanh lam nhạt (Blue > Red + 6)
        const blueRows = [];
        const sampleXStart = colBounds[0].x1 + 10;
        const sampleXEnd = colBounds[4].x2 - 10;
        for (let y = 0; y < H; y++) {
          let blueCount = 0, total = 0;
          for (let x = sampleXStart; x < sampleXEnd; x += 8) {
            const i = (y * W + x) * 4;
            const r = px[i], g = px[i + 1], b = px[i + 2];
            total++;
            if (b > r + 6 && b > 200 && r > 180 && r < 245) blueCount++;
          }
          if (blueCount > total * 0.6) blueRows.push(y);
        }

        // Gom thành 2 dải băng màu xanh (Header Sáng & Header Chiều)
        const blueBands = [];
        for (const y of blueRows) {
          if (blueBands.length === 0 || y - blueBands[blueBands.length - 1].end > 25) {
            blueBands.push({ start: y, end: y });
          } else {
            blueBands[blueBands.length - 1].end = y;
          }
        }

        // Tìm các đường kẻ ngang thực tế trong vùng bảng
        const hRaw = [];
        for (let y = 0; y < H; y++) {
          let dark = 0;
          for (let x = sampleXStart; x < sampleXEnd; x += 2) {
            const i = (y * W + x) * 4;
            if (px[i] < 175 && px[i + 1] < 175 && px[i + 2] < 175) dark++;
          }
          if (dark > ((sampleXEnd - sampleXStart) / 2) * 0.50) hRaw.push(y);
        }
        const hLines = [];
        for (const y of hRaw) {
          if (hLines.length === 0 || y - hLines[hLines.length - 1] > 8) hLines.push(y);
        }

        // Hàm chia đúng N hàng tiết học giữa 2 mốc Y, ưu tiên bám theo vạch kẻ ngang nếu có, nếu chữ đè làm mất vạch thì tự động chia đôi!
        function splitSectionIntoRows(yTop, yBottom, numRows) {
          let internal = hLines.filter(y => y > yTop + 12 && y < yBottom - 12);
          const pts = [yTop, ...internal, yBottom];
          // Nếu có 1 khoảng bị gộp đôi do chữ "nghiệp" đè mất vạch kẻ (chiều cao gấp ~2 lần bình thường), tự động chẻ đôi khoảng đó!
          const avgH = (yBottom - yTop) / numRows;
          const fixedPts = [pts[0]];
          for (let i = 0; i < pts.length - 1; i++) {
            const gap = pts[i + 1] - pts[i];
            if (gap > avgH * 1.65 && fixedPts.length + (pts.length - 1 - i) <= numRows) {
              fixedPts.push(Math.round((pts[i] + pts[i + 1]) / 2));
            }
            fixedPts.push(pts[i + 1]);
          }
          const rows = [];
          if (fixedPts.length === numRows + 1) {
            for (let i = 0; i < numRows; i++) rows.push({ y1: fixedPts[i], y2: fixedPts[i + 1] });
          } else {
            for (let i = 0; i < numRows; i++) {
              rows.push({
                y1: Math.round(yTop + i * avgH),
                y2: Math.round(yTop + (i + 1) * avgH)
              });
            }
          }
          return rows;
        }

        let morningYTop = Math.round(H * 0.045);
        let morningYBottom = Math.round(H * 0.585);
        let afternoonYTop = Math.round(H * 0.665);

        if (blueBands.length >= 2) {
          morningYTop = blueBands[0].end + 2;
          // Đáy buổi sáng nằm ngay phía trên dòng chữ "Buổi chiều" (tức là cách đỉnh thanh xanh thứ 2 một khoảng bằng chiều cao thanh xanh)
          const headerH = Math.max(20, blueBands[1].end - blueBands[1].start);
          const lineAboveChieu = hLines.filter(y => y < blueBands[1].start - 8 && y > blueBands[0].end + 100).pop();
          morningYBottom = lineAboveChieu || (blueBands[1].start - headerH);
          afternoonYTop = blueBands[1].end + 2;
        }

        // Chia chính xác 5 tiết Buổi sáng (S1..S5), không bao giờ bị gộp Tiết 3 & Tiết 4 nữa!
        const sRows = splitSectionIntoRows(morningYTop, morningYBottom, 5);

        // Lấy các dòng Buổi chiều từ dưới thanh xanh thứ 2 trở xuống
        const cLines = [afternoonYTop, ...hLines.filter(y => y > afternoonYTop + 15)];
        const cRows = [];
        for (let i = 0; i < 4; i++) {
          if (i + 1 < cLines.length) {
            cRows.push({ y1: cLines[i], y2: cLines[i + 1] });
          } else {
            cRows.push({ y1: 0, y2: 0 });
          }
        }

        const allRowDefs = [
          { id: 'S1', ...sRows[0] },
          { id: 'S2', ...sRows[1] },
          { id: 'S3', ...sRows[2] },
          { id: 'S4', ...sRows[3] },
          { id: 'S5', ...sRows[4] },
          { id: 'C1', ...cRows[0] },
          { id: 'C2', ...cRows[1] },
          { id: 'C3', ...cRows[2] },
          { id: 'C4', ...cRows[3] }
        ];

       
    // 3. LỌC Ô CÓ CHỮ VỚI ĐỘ NHẠY CAO (KHÔNG BỎ SÓT CHỮ NGẮN NHƯ "VẬT LÍ", "ĐỊA LÍ")
        const activeCells = [];
        for (let rIdx = 0; rIdx < allRowDefs.length; rIdx++) {
          const r = allRowDefs[rIdx];
          const rh = r.y2 - r.y1;
          if (rh < 18) continue;

          for (let cIdx = 0; cIdx < 6; cIdx++) {
            const cw = colBounds[cIdx].x2 - colBounds[cIdx].x1;
            const sx = colBounds[cIdx].x1 + 6;
            const sy = r.y1 + 4;
            const sw = Math.max(10, cw - 12);
            const sh = Math.max(10, rh - 8);

            // Quét vùng trung tâm của ô (nơi chứa chữ) từng pixel một để không bao giờ sót chữ ngắn
            let darkCount = 0;
            const checkY1 = sy + Math.floor(sh * 0.15);
            const checkY2 = sy + Math.floor(sh * 0.85);
            const checkX1 = sx + Math.floor(sw * 0.12);
            const checkX2 = sx + Math.floor(sw * 0.88);

            for (let y = checkY1; y < checkY2; y++) {
              for (let x = checkX1; x < checkX2; x++) {
                const idx = (y * W + x) * 4;
                if (px[idx] < 200 && px[idx + 1] < 200 && px[idx + 2] < 200) darkCount++;
              }
            }
            // Chỉ cần có hơn 25 điểm ảnh tối trong vùng trung tâm là đưa vào đọc
            if (darkCount > 25) {
              activeCells.push({ rIdx, cIdx, id: r.id, sx, sy, sw, sh });
            }
          }
        }

        const worker = await window.Tesseract.createWorker('vie');
        await worker.setParameters({ tessedit_pageseg_mode: '6' });

        const resultGrid = allRowDefs.map(r => ({ id: r.id, cols: ['', '', '', '', '', '', ''] }));
        const singleCanvas = document.createElement('canvas');
        const singleCtx = singleCanvas.getContext('2d');

        for (let i = 0; i < activeCells.length; i++) {
          const cell = activeCells[i];
          btn.innerHTML = `<i class="fa-solid fa-bolt"></i> Đang đọc ô ${i + 1}/${activeCells.length}...`;

          const scale = 2.2;
          const pad = 24;
          const cw = Math.round(cell.sw * scale);
          const ch = Math.round(cell.sh * scale);
          singleCanvas.width = cw + pad * 2;
          singleCanvas.height = ch + pad * 2;

          singleCtx.fillStyle = '#ffffff';
          singleCtx.fillRect(0, 0, singleCanvas.width, singleCanvas.height);
          singleCtx.drawImage(imgElement, cell.sx, cell.sy, cell.sw, cell.sh, pad, pad, cw, ch);

          // Làm nét chữ đen và xóa vệt kẻ ngang nếu có dính ở sát mép trên/dưới
          const imgData = singleCtx.getImageData(0, 0, singleCanvas.width, singleCanvas.height);
          const d = imgData.data;
          for (let p = 0; p < d.length; p += 4) {
            const gray = (d[p] + d[p + 1] + d[p + 2]) / 3;
            const val = gray < 195 ? 0 : 255;
            d[p] = d[p + 1] = d[p + 2] = val;
          }
          singleCtx.putImageData(imgData, 0, 0);

          const { data: { text } } = await worker.recognize(singleCanvas);
          resultGrid[cell.rIdx].cols[cell.cIdx] = normalizeSubjectFromText(text);
        }

        await worker.terminate();
        appData.tkbData.grid = resultGrid;
        window.renderTKBTable();
        btn.innerHTML = oldHtml;
        btn.disabled = false;
        input.value = '';
        alert(`🎉 Đã quét chuẩn xác ${activeCells.length} tiết học! Hãy kiểm tra và bấm "Lưu Thay Đổi" nhé!`);
      } catch (err) {
        btn.innerHTML = oldHtml;
        btn.disabled = false;
        input.value = '';
        alert('Lỗi quét ảnh: ' + err.message);
      }
    }

    window.handleScanTKBImage = function(input) {
      if (!input.files || !input.files[0]) return;
      const file = input.files[0];
      const btn = document.getElementById('btnScanTKB');
      const oldHtml = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý ảnh...';
      btn.disabled = true;

      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          runFastOnePassOCR(img, btn, oldHtml, input);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    };
    // ================= CÔNG VIỆC =================
    window.renderStudentsForModal = function() {
      const container = document.getElementById('studentCheckList');
      if (!container) return;
      container.innerHTML = appData.students.map(s => `
        <label class="flex items-center gap-2 p-1.5 bg-white rounded-lg cursor-pointer border border-slate-200">
          <input type="checkbox" class="student-checkbox w-3.5 h-3.5 rounded text-blue-600" value="${s.maHS}" data-name="${s.hoTen}">
          <span class="truncate text-[11px] font-medium">${s.hoTen}</span>
        </label>
      `).join('');
    };

    window.toggleSelectAllStudents = function() {
      isAllSelected = !isAllSelected;
      document.querySelectorAll('.student-checkbox').forEach(cb => cb.checked = isAllSelected);
    };

    
    window.toggleProofCodeInput = function() {
      const checked = document.getElementById('taskRequireProof').checked;
      document.getElementById('proofCodeContainer').classList.toggle('hidden', !checked);
    };

    window.openTaskModal = function() {
      editingTaskId = null;
      document.getElementById('taskTitle').value = '';
      document.getElementById('taskDesc').value = '';
      document.getElementById('taskLink').value = '';
      document.getElementById('taskDeadline').value = '';
      document.getElementById('taskFile').value = '';
      document.getElementById('taskRequireProof').checked = false;
      document.getElementById('taskProofCode').value = '';
      window.toggleProofCodeInput();

      const btn = document.getElementById('btnSubmitTask');
      if (btn) {
        btn.innerText = 'Giao việc';
        btn.onclick = window.submitNewTask;
      }
      document.getElementById('taskModal').classList.remove('hidden');
    };
    window.closeTaskModal = function() { document.getElementById('taskModal').classList.add('hidden'); };

    window.submitNewTask = function() {
      const tieuDe = document.getElementById('taskTitle').value.trim();
      const noiDung = document.getElementById('taskDesc').value.trim();
      const link = document.getElementById('taskLink').value.trim();
      const hanChot = document.getElementById('taskDeadline').value;
      const fileInput = document.getElementById('taskFile');
      const requireProof = document.getElementById('taskRequireProof').checked;
      const proofCode = document.getElementById('taskProofCode').value.trim();
      
      const assignees = [];
      document.querySelectorAll('.student-checkbox:checked').forEach(cb => {
        assignees.push({ maHS: cb.value, hoTen: cb.getAttribute('data-name'), done: false, proofUrl: '' });
      });

      if (!tieuDe) { alert('Vui lòng nhập tên công việc!'); return; }
      if (requireProof && !proofCode) { alert('Vui lòng đặt tên Mã minh chứng (VD: BTVN01)!'); return; }
      if (assignees.length === 0) { alert('Vui lòng chọn ít nhất 1 học sinh nhận việc!'); return; }

      const formObj = {
        tieuDe: tieuDe, noiDung: noiDung, link: link,
        hanChot: hanChot ? hanChot.split('-').reverse().join('/') : 'Không thời hạn',
        nguoiGiao: currentUser.hoTen,
        requireProof: requireProof,
        proofCode: proofCode,
        assignees: assignees
      };

      const btn = document.getElementById('btnSubmitTask');
      btn.innerText = 'Đang lưu...';
      btn.disabled = true;

      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
          const fileData = { fileName: file.name, mimeType: file.type, base64: e.target.result };
          sendTaskToServer(formObj, fileData);
        };
        reader.readAsDataURL(file);
      } else {
        sendTaskToServer(formObj, null);
      }
    };

    function sendTaskToServer(formObj, fileData) {
      window.google.script.run.withSuccessHandler(res => {
        document.getElementById('btnSubmitTask').innerText = 'Giao việc';
        document.getElementById('btnSubmitTask').disabled = false;
        if (res.success) {
          if (res.emailSentCount > 0) {
            alert(`Đã giao việc và gửi email thông báo thành công cho ${res.emailSentCount} học sinh!`);
          }
          window.closeTaskModal();
          window.loadData();
        } else {
          alert('Lỗi: ' + res.message);
        }
      }).createTaskWithFile(formObj, fileData, getAuthToken());
    }

    function extractMonthFromDateStr(dateStr) {
      if (!dateStr || String(dateStr).toLowerCase().includes('không')) return '';
      const clean = String(dateStr).trim();
      if (clean.includes('/')) {
        const parts = clean.split('/');
        if (parts.length >= 2) return String(parseInt(parts[1], 10));
      }
      if (clean.includes('-')) {
        const parts = clean.split('-');
        if (parts.length >= 2) return String(parseInt(parts[1], 10));
      }
      return '';
    }

    function parseDateDDMMYYYY(dateStr) {
      if (!dateStr || String(dateStr).toLowerCase().includes('không')) return null;
      const parts = String(dateStr).trim().split('/');
      if (parts.length === 3) {
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
      }
      return null;
    }

    function getTaskCreatedTime(task) {
      if (task.id && task.id.startsWith('CV_')) {
        const ts = parseInt(task.id.replace('CV_', ''), 10);
        if (!isNaN(ts)) return ts;
      }
      return 0;
    }

    function isTaskExpired(dateStr) {
      if (!dateStr || String(dateStr).toLowerCase().includes('không')) return false;
      const dl = parseDateDDMMYYYY(dateStr);
      if (!dl) return false;
      const endOfDeadlineDay = dl + (24 * 60 * 60 * 1000) - 1;
      return Date.now() > endOfDeadlineDay;
    }

    window.renderTasks = function() {
      const container = document.getElementById('taskList');
      if (!container) return;
      const filterMonth = document.getElementById('filterMonth').value;
      const filterStatus = document.getElementById('filterStatus').value;
      const sortTaskBy = document.getElementById('sortTaskBy') ? document.getElementById('sortTaskBy').value : 'deadline_asc';
      
      container.innerHTML = '';
      let hasMyPendingTask = false;
      const r = (currentUser && currentUser.role) ? currentUser.role.toLowerCase() : '';
      const isAdmin = (r === 'admin');
      const isLopTruong = (r === 'loptruong' || r.includes('lớp trưởng') || r.includes('lop truong'));
      const isBiThu = (r === 'bithu' || r.includes('bí thư') || r.includes('bi thu'));
      const isManager = (isAdmin || isLopTruong || isBiThu);

      let filteredTasks = appData.tasks.filter(t => {
        let month = extractMonthFromDateStr(t.hanChot) || extractMonthFromDateStr(t.ngayTao);
        if (filterMonth !== 'all' && month !== String(filterMonth)) return false;

        const myAss = t.assignees.find(a => String(a.maHS).toLowerCase() === String(currentUser.username).toLowerCase());
        const isAss = !!myAss;
        const isDone = myAss ? myAss.done : false;
        const isClassDone = t.assignees.length > 0 && t.assignees.every(a => a.done);

        if (filterStatus === 'my_pending' && (!isAss || isDone)) return false;
        if (filterStatus === 'my_done' && (!isAss || !isDone)) return false;
        if (filterStatus === 'class_pending' && isClassDone) return false;
        if (filterStatus === 'class_done' && !isClassDone) return false;
        return true;
      });

      filteredTasks.sort((a, b) => {
        const timeCreatedA = getTaskCreatedTime(a);
        const timeCreatedB = getTaskCreatedTime(b);
        if (sortTaskBy === 'created_desc') return timeCreatedB - timeCreatedA;
        if (sortTaskBy === 'created_asc') return timeCreatedA - timeCreatedB;
        if (sortTaskBy === 'deadline_asc') {
          const dlA = parseDateDDMMYYYY(a.hanChot);
          const dlB = parseDateDDMMYYYY(b.hanChot);
          if (dlA !== null && dlB !== null) {
            if (dlA !== dlB) return dlA - dlB;
            return timeCreatedB - timeCreatedA;
          }
          if (dlA !== null && dlB === null) return -1;
          if (dlA === null && dlB !== null) return 1;
          return timeCreatedB - timeCreatedA;
        }
        return 0;
      });

      if (filteredTasks.length === 0) {
        container.innerHTML = `<div class="bg-white p-6 rounded-2xl text-center text-slate-400 text-xs font-medium border">Không có công việc nào phù hợp với bộ lọc!</div>`;
      } else {
        filteredTasks.forEach(t => {
          const myAss = t.assignees.find(a => String(a.maHS).toLowerCase() === String(currentUser.username).toLowerCase());
          const isAssignedToMe = !!myAss;
          const isMyTaskDone = myAss ? myAss.done : false;
          const myProofUrl = myAss ? (myAss.proofUrl || '') : '';
          const isExpired = isTaskExpired(t.hanChot);

          if (isAssignedToMe && !isMyTaskDone && !isExpired) {
            hasMyPendingTask = true;
          }

          const total = t.assignees.length;
          const completed = t.assignees.filter(a => a.done).length;
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
          const uncompletedList = t.assignees.filter(a => !a.done);
          const submittedProofs = t.assignees.filter(a => a.done && a.proofUrl);
          const isClassAllDone = (total > 0 && completed === total);

          let cardStyle = 'border-slate-200 bg-white shadow-sm';
          let statusBadge = '';

          if (isManager) {
            if (isClassAllDone) {
              cardStyle = 'border-2 border-emerald-500 bg-emerald-50/15 shadow-sm';
              statusBadge = `<span class="bg-emerald-600 text-white font-extrabold px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm"><i class="fa-solid fa-circle-check"></i> Đã xong 100%</span>`;
            } else if (isExpired) {
              cardStyle = 'border-2 border-slate-700 bg-slate-100/70 shadow-sm';
              statusBadge = `<span class="bg-slate-800 text-white font-extrabold px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm"><i class="fa-solid fa-clock-rotate-left"></i> Đã hết hạn (${uncompletedList.length})</span>`;
            } else {
              cardStyle = 'border-2 border-red-500 bg-red-50/15 shadow-sm';
              statusBadge = `<span class="bg-red-600 text-white font-extrabold px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm"><i class="fa-solid fa-clock"></i> Chưa xong (${uncompletedList.length})</span>`;
            }
          } else {
            if (isAssignedToMe) {
              if (isMyTaskDone) {
                cardStyle = 'border-2 border-emerald-400 bg-emerald-50/20 shadow-sm';
                statusBadge = `<span class="bg-emerald-600 text-white font-extrabold px-3 py-1 rounded-full text-xs flex items-center gap-1"><i class="fa-solid fa-check"></i> Đã xong</span>`;
              } else if (isExpired) {
                cardStyle = 'border-2 border-slate-800 bg-slate-900/5 shadow-sm';
                statusBadge = `<span class="bg-slate-800 text-white font-extrabold px-3 py-1 rounded-full text-xs flex items-center gap-1"><i class="fa-solid fa-ban"></i> Đã quá hạn</span>`;
              } else {
                cardStyle = 'urgent-blink';
                statusBadge = `<span class="bg-red-600 text-white font-extrabold px-3 py-1 rounded-full text-xs animate-pulse tracking-wide flex items-center gap-1 shadow-sm"><i class="fa-solid fa-triangle-exclamation"></i> GẤP GẤP!!</span>`;
              }
            } else {
              statusBadge = `<span class="bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full text-xs">Việc chung</span>`;
            }
          }

          container.innerHTML += `
            <div class="rounded-3xl p-5 border ${cardStyle} transition flex flex-col justify-between">
              <div>
                <div class="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 class="font-extrabold ${isExpired && !isClassAllDone ? 'text-slate-900' : 'text-slate-800'} text-base leading-snug">${t.tieuDe}</h3>
                    ${t.requireProof ? `<span class="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-800 font-bold text-[11px]"><i class="fa-solid fa-camera"></i> Bắt buộc nộp minh chứng (Mã: ${t.proofCode})</span>` : ''}
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    ${statusBadge}
                    ${isManager ? `
                      <button onclick="openEditTaskModal('${t.id}')" class="text-blue-600 hover:text-blue-800 text-sm p-1" title="Sửa / Gia hạn hạn chót">
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                    ` : ''}
                    ${isAdmin ? `
                      <button onclick="deleteTaskAction('${t.id}')" class="text-slate-300 hover:text-red-500 text-sm p-1" title="Xóa nhiệm vụ (Chỉ GV)">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    ` : ''}
                  </div>
                </div>

                <p class="text-sm text-slate-700 mb-3 whitespace-pre-line">${t.noiDung || 'Không có mô tả chi tiết.'}</p>

                <div class="flex flex-wrap gap-2 mb-3">
                  ${t.link ? `<a href="${t.link}" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition"><i class="fa-solid fa-link"></i> Mở link</a>` : ''}
                  ${t.file ? `<a href="${t.file}" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-100 transition"><i class="fa-solid fa-file-arrow-down"></i> Tải File</a>` : ''}
                  ${myProofUrl ? `<a href="${myProofUrl}" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold hover:bg-purple-100 transition"><i class="fa-solid fa-file-circle-check"></i> Minh chứng của tôi</a>` : ''}
                </div>

                <div class="mb-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                  <div class="flex justify-between items-center font-bold text-slate-600 mb-1">
                    <span>Tiến độ: <b class="${isClassAllDone ? 'text-emerald-600' : 'text-blue-600'}">${completed}/${total}</b> (${percent}%)</span>
                    <span class="${isExpired && !isClassAllDone ? 'text-red-600 font-bold' : 'text-slate-500'}">Hạn: ${t.hanChot} ${isExpired && !isClassAllDone ? '(Đã hết hạn)' : ''}</span>
                  </div>
                  <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div class="${isClassAllDone ? 'bg-emerald-500' : (isExpired ? 'bg-slate-700' : 'bg-blue-600')} h-2 rounded-full transition-all" style="width: ${percent}%"></div>
                  </div>
                </div>

                ${isManager && submittedProofs.length > 0 ? `
                  <div class="text-xs bg-purple-50/70 p-2.5 rounded-xl border border-purple-200 mb-2">
                    <b class="font-bold text-purple-900 block mb-1"><i class="fa-solid fa-folder-open mr-1"></i> Minh chứng đã nộp (${submittedProofs.length}):</b>
                    <div class="flex flex-wrap gap-1.5">
                      ${submittedProofs.map(sp => `<a href="${sp.proofUrl}" target="_blank" class="px-2 py-0.5 bg-white border border-purple-200 rounded-lg text-[11px] text-purple-700 font-semibold hover:bg-purple-100">${t.proofCode} - ${sp.maHS} (${sp.hoTen})</a>`).join('')}
                    </div>
                  </div>
                ` : ''}

                ${uncompletedList.length > 0 ? `
                  <div class="text-xs text-amber-900 bg-amber-50/90 p-2.5 rounded-xl border border-amber-200 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <b class="font-bold">Chưa hoàn thành (${uncompletedList.length}):</b> <span>${uncompletedList.map(u => u.hoTen).join(', ')}</span>
                    </div>
                    ${isAdmin ? `
                      <button onclick="penalizeUnfinishedTask('${t.id}')" class="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-[11px] flex-shrink-0 shadow transition flex items-center gap-1">
                        <i class="fa-solid fa-gavel"></i> Phạt vi phạm
                      </button>
                    ` : ''}
                  </div>
                ` : `
                  <div class="text-xs text-emerald-800 bg-emerald-50 p-2 rounded-xl text-center font-bold border border-emerald-200 mb-2">
                    <i class="fa-solid fa-circle-check text-emerald-600 mr-1"></i> Tất cả đã hoàn thành 100%!
                  </div>
                `}
              </div>

              <div class="pt-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
                <span class="text-xs text-slate-400">Giao bởi: <b>${t.nguoiGiao}</b> | ${t.ngayTao || ''}</span>
                ${isAssignedToMe ? (
                  isMyTaskDone ? `
                    <button onclick="toggleDone('${t.id}', false)" class="px-4 py-2 rounded-xl font-bold text-xs bg-emerald-100 text-emerald-800 transition flex items-center justify-center gap-1.5">
                      <i class="fa-solid fa-check"></i> Đã hoàn thành (Hủy)
                    </button>
                  ` : (
                    isExpired ? `
                      <button disabled class="px-4 py-2 rounded-xl font-bold text-xs bg-slate-200 text-slate-500 cursor-not-allowed flex items-center justify-center gap-1.5">
                        <i class="fa-solid fa-lock"></i> Đã khóa (Quá hạn)
                      </button>
                    ` : (
                      t.requireProof ? `
                        <button onclick="openProofUploadModal('${t.id}')" class="px-4 py-2 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white shadow-md transition flex items-center justify-center gap-1.5">
                          <i class="fa-solid fa-camera"></i> Nộp minh chứng & Hoàn thành
                        </button>
                      ` : `
                        <button onclick="toggleDone('${t.id}', true)" class="px-4 py-2 rounded-xl font-bold text-xs bg-red-600 text-white shadow-md shadow-red-500/30 transition flex items-center justify-center gap-1.5">
                          <i class="fa-solid fa-check-double"></i> Xác nhận xong
                        </button>
                      `
                    )
                  )
                ) : `<span class="text-xs text-slate-400 italic">Không phân công cho bạn</span>`}
              </div>
            </div>
          `;
        });
      }

      const badge = document.getElementById('sidebarBadge');
      if (badge) badge.classList.toggle('hidden', !hasMyPendingTask);
      const bnavBadgeWork = document.getElementById('bnavBadgeWork');
      if (bnavBadgeWork) bnavBadgeWork.classList.toggle('hidden', !hasMyPendingTask);
    };

    window.openProofUploadModal = function(taskId) {
      const t = appData.tasks.find(x => x.id === taskId);
      if (!t) return;
      document.getElementById('proofModalTaskId').value = t.id;
      document.getElementById('proofModalTaskTitle').innerText = t.tieuDe;
      document.getElementById('proofModalAutoName').innerText = `${t.proofCode || 'MC'} - ${currentUser.username}`;
      document.getElementById('studentProofFile').value = '';
      document.getElementById('proofUploadModal').classList.remove('hidden');
    };

    window.closeProofUploadModal = function() {
      document.getElementById('proofUploadModal').classList.add('hidden');
    };

    window.submitStudentProof = function() {
      const taskId = document.getElementById('proofModalTaskId').value;
      const fileInput = document.getElementById('studentProofFile');
      if (!fileInput.files || fileInput.files.length === 0) {
        alert('Vui lòng chọn ảnh hoặc file minh chứng trước khi xác nhận!');
        return;
      }

      const file = fileInput.files[0];
      const btn = document.getElementById('btnSubmitProof');
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang tải minh chứng...';
      btn.disabled = true;

      const reader = new FileReader();
      reader.onload = function(e) {
        const proofFileData = {
          fileName: file.name,
          mimeType: file.type,
          base64: e.target.result
        };
        window.google.script.run.withSuccessHandler(res => {
          btn.innerHTML = '<i class="fa-solid fa-check-double"></i> Tải lên & Hoàn thành';
          btn.disabled = false;
          if (res.success) {
            window.closeProofUploadModal();
            window.loadData();
          } else {
            alert('Lỗi: ' + res.message);
          }
        }).toggleTaskStatus(taskId, currentUser.username, true, getAuthToken(), proofFileData);
      };
      reader.readAsDataURL(file);
    };

    window.openEditTaskModal = function(taskId) {
      const t = appData.tasks.find(x => x.id === taskId);
      if (!t) return;
      editingTaskId = taskId;

      document.getElementById('taskTitle').value = t.tieuDe;
      document.getElementById('taskDesc').value = t.noiDung || '';
      document.getElementById('taskLink').value = t.link || '';
      document.getElementById('taskRequireProof').checked = !!t.requireProof;
      document.getElementById('taskProofCode').value = t.proofCode || '';
      window.toggleProofCodeInput();
      
      if (t.hanChot && t.hanChot.includes('/')) {
        const p = t.hanChot.split('/');
        if (p.length === 3) document.getElementById('taskDeadline').value = `${p[2]}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`;
      } else {
        document.getElementById('taskDeadline').value = '';
      }

      const assignedIds = t.assignees.map(a => String(a.maHS).toLowerCase());
      document.querySelectorAll('.student-checkbox').forEach(cb => {
        cb.checked = assignedIds.includes(String(cb.value).toLowerCase());
      });

      const btn = document.getElementById('btnSubmitTask');
      btn.innerText = 'Lưu / Gia hạn';
      btn.onclick = window.submitEditTask;

      document.getElementById('taskModal').classList.remove('hidden');
    };

    window.submitEditTask = function() {
      if (!editingTaskId) return;
      const tieuDe = document.getElementById('taskTitle').value.trim();
      const noiDung = document.getElementById('taskDesc').value.trim();
      const link = document.getElementById('taskLink').value.trim();
      const hanChot = document.getElementById('taskDeadline').value;
      const requireProof = document.getElementById('taskRequireProof').checked;
      const proofCode = document.getElementById('taskProofCode').value.trim();

      if (!tieuDe) { alert('Vui lòng nhập tên công việc!'); return; }
      if (requireProof && !proofCode) { alert('Vui lòng đặt tên Mã minh chứng!'); return; }

      const currentTask = appData.tasks.find(x => x.id === editingTaskId);
      const existingMap = {};
      if (currentTask) {
        currentTask.assignees.forEach(a => {
          existingMap[a.maHS] = { done: a.done, proofUrl: a.proofUrl || '' };
        });
      }

      const assignees = [];
      document.querySelectorAll('.student-checkbox:checked').forEach(cb => {
        const oldState = existingMap[cb.value] || { done: false, proofUrl: '' };
        assignees.push({
          maHS: cb.value,
          hoTen: cb.getAttribute('data-name'),
          done: oldState.done,
          proofUrl: oldState.proofUrl
        });
      });

      if (assignees.length === 0) { alert('Vui lòng chọn ít nhất 1 học sinh!'); return; }

      const taskObj = {
        id: editingTaskId,
        tieuDe: tieuDe,
        noiDung: noiDung,
        link: link,
        hanChot: hanChot ? hanChot.split('-').reverse().join('/') : 'Không thời hạn',
        requireProof: requireProof,
        proofCode: proofCode,
        assignees: assignees
      };

      const btn = document.getElementById('btnSubmitTask');
      btn.innerText = 'Đang lưu...';
      btn.disabled = true;

      window.google.script.run.withSuccessHandler(res => {
        btn.innerText = 'Giao việc';
        btn.disabled = false;
        btn.onclick = window.submitNewTask;
        editingTaskId = null;
        if (res.success) {
          window.closeTaskModal();
          window.loadData();
        } else alert('Lỗi: ' + res.message);
      }).updateTaskDetails(taskObj, getAuthToken());
    };

    window.penalizeUnfinishedTask = function(taskId) {
      if (confirm('Xác nhận phạt vi phạm lỗi "Không hoàn thành NV" (-1 điểm) vào điểm nề nếp tháng hiện tại đối với các bạn chưa xong việc?')) {
        window.google.script.run.withSuccessHandler(res => {
          if (res.success) {
            alert(`Đã ghi nhận phạt trừ -1 điểm cho ${res.count} học sinh vào bảng điểm Tháng ${res.month}!`);
            window.loadData();
          } else {
            alert('Lỗi: ' + res.message);
          }
        }).penalizeUnfinishedTaskStudents(taskId, getAuthToken());
      }
    };

    window.toggleDone = function(taskId, isChecked) {
      window.google.script.run.withSuccessHandler(res => {
        if (res.success) window.loadData();
        else alert('Lỗi: ' + res.message);
      }).toggleTaskStatus(taskId, currentUser.username, isChecked, getAuthToken());
    };

    window.deleteTaskAction = function(taskId) {
      if (confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
        window.google.script.run.withSuccessHandler(res => { if (res.success) window.loadData(); }).deleteTask(taskId, getAuthToken());
      }
    };
    
    // ================= ĐIỂM CỘNG / TRỪ =================
    window.switchBonusSubView = function(view) {
      currentBonusSubView = view;
      if (view === 'summary') {
        document.getElementById('bonusSummaryView').classList.remove('hidden');
        document.getElementById('bonusHistoryView').classList.add('hidden');
        document.getElementById('btnSubBonusSummary').className = "px-4 py-2 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 transition";
        document.getElementById('btnSubBonusHistory').className = "px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition";
      } else {
        document.getElementById('bonusSummaryView').classList.add('hidden');
        document.getElementById('bonusHistoryView').classList.remove('hidden');
        document.getElementById('btnSubBonusSummary').className = "px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition";
        document.getElementById('btnSubBonusHistory').className = "px-4 py-2 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 transition";
      }
      window.renderBonusView();
    };

    window.renderBonusView = function() {
      const filterSubEl = document.getElementById('filterBonusSubject');
      if (!filterSubEl) return;
      const filterSub = filterSubEl.value;
      const r = (currentUser && currentUser.role) ? currentUser.role.toLowerCase() : '';
      const canManageBonus = (r === 'admin' || r === 'lopphohoctap' || r.includes('học tập') || r.includes('hoc tap'));

      const studentMap = {};
      appData.students.forEach(s => {
        studentMap[String(s.maHS).toLowerCase()] = { maHS: s.maHS, hoTen: s.hoTen, plusTotal: 0, minusTotal: 0 };
      });

      appData.bonusPoints.forEach(b => {
        if (filterSub !== 'all' && b.monHoc !== filterSub) return;
        const key = String(b.maHS).trim().toLowerCase();
        if (studentMap[key]) {
          const score = parseFloat(b.diem) || 0;
          if (score >= 0) studentMap[key].plusTotal += score;
          else studentMap[key].minusTotal += Math.abs(score);
        }
      });

      const summaryBody = document.getElementById('bonusSummaryTableBody');
      summaryBody.innerHTML = Object.values(studentMap).map((st, idx) => {
        const netScore = Math.round((st.plusTotal - st.minusTotal) * 100) / 100;
        return `
          <tr class="hover:bg-slate-50 transition">
            <td class="p-3 text-center font-bold text-slate-400">${idx + 1}</td>
            <td class="p-3 font-mono font-bold text-blue-700">${st.maHS}</td>
            <td class="p-3 font-bold text-slate-800">${st.hoTen}</td>
            <td class="p-3 text-center"><span class="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full text-xs">+${st.plusTotal.toFixed(2)}</span></td>
            <td class="p-3 text-center"><span class="bg-red-50 text-red-600 font-bold px-2.5 py-1 rounded-full text-xs">-${st.minusTotal.toFixed(2)}</span></td>
            <td class="p-3 text-center font-extrabold text-sm ${netScore >= 0 ? 'text-emerald-700' : 'text-red-600'}">
              ${netScore >= 0 ? '+' : ''}${netScore.toFixed(2)} đ
            </td>
            <td class="p-3 text-center">
              <button onclick="viewStudentBonusHistory('${st.maHS}')" class="text-xs text-blue-600 font-bold hover:underline">
                <i class="fa-solid fa-eye mr-1"></i> Chi tiết
              </button>
            </td>
          </tr>
        `;
      }).join('');

      const historyBody = document.getElementById('bonusHistoryTableBody');
      const thAction = document.getElementById('thBonusAction');
      if (thAction) thAction.classList.toggle('hidden', !canManageBonus);

      let filteredBonus = appData.bonusPoints.filter(b => filterSub === 'all' || b.monHoc === filterSub);

      if (filteredBonus.length === 0) {
        historyBody.innerHTML = `<tr><td colspan="9" class="p-6 text-center text-slate-400">Chưa có lịch sử ghi điểm nào!</td></tr>`;
        return;
      }

      historyBody.innerHTML = filteredBonus.map((b, idx) => {
        const score = parseFloat(b.diem) || 0;
        return `
          <tr class="hover:bg-slate-50 transition">
            <td class="p-3 text-center font-bold text-slate-400">${idx + 1}</td>
            <td class="p-3 font-bold text-slate-800">${b.hoTen} <span class="text-[10px] text-slate-400 block">${b.maHS}</span></td>
            <td class="p-3 font-bold text-blue-600">${b.monHoc}</td>
            <td class="p-3 text-center">
              <span class="px-2.5 py-1 rounded-full font-extrabold text-xs ${score >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}">
                ${score >= 0 ? '+' : ''}${score}
              </span>
            </td>
            <td class="p-3 text-center text-slate-500 font-mono text-[11px]">${b.quyUoc || '---'}</td>
            <td class="p-3 text-slate-700">${b.lyDo}</td>
            <td class="p-3 text-slate-400 text-[11px]">${b.ngay}</td>
            <td class="p-3 text-slate-500 text-[11px] font-medium">${b.nguoiNhap}</td>
            ${canManageBonus ? `
              <td class="p-3 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button onclick="openEditBonusModal('${b.id}')" class="text-blue-500 hover:text-blue-700 p-1" title="Sửa"><i class="fa-solid fa-pen"></i></button>
                  <button onclick="deleteBonusItem('${b.id}')" class="text-red-400 hover:text-red-600 p-1" title="Xóa"><i class="fa-solid fa-trash"></i></button>
                </div>
              </td>
            ` : ''}
          </tr>
        `;
      }).join('');
    };

    window.viewStudentBonusHistory = function(maHS) {
      window.switchBonusSubView('history');
      const rows = document.querySelectorAll('#bonusHistoryTableBody tr');
      rows.forEach(r => {
        r.style.display = r.innerText.includes(maHS) ? '' : 'none';
      });
    };

    window.calculateBonusTotalScore = function() {
      const type = document.getElementById('bnType').value;
      const countVal = document.getElementById('bnCount').value.replace(',', '.');
      const rateVal = document.getElementById('bnRate').value.replace(',', '.');
      const count = parseFloat(countVal) || 1;
      const rate = parseFloat(rateVal) || 0.25;
      let total = Math.round(count * rate * 100) / 100;
      if (type === 'minus') total = -total;

      const preview = document.getElementById('bnFinalScorePreview');
      if (preview) {
        preview.innerText = (total > 0 ? '+' : '') + total + ' điểm';
        preview.className = total >= 0 ? 'text-emerald-700 font-extrabold text-sm' : 'text-red-600 font-extrabold text-sm';
      }
      return total;
    };

    window.openBonusBatchModal = function() {
      document.getElementById('bnReason').value = '';
      document.getElementById('bnCount').value = '1';
      document.getElementById('bnRate').value = '0.25';
      window.calculateBonusTotalScore();

      const container = document.getElementById('bonusStudentCheckList');
      container.innerHTML = appData.students.map(s => `
        <label class="flex items-center gap-2 p-1.5 bg-white rounded-lg cursor-pointer border border-slate-200 hover:bg-emerald-50/40">
          <input type="checkbox" class="bonus-student-checkbox w-3.5 h-3.5 rounded text-emerald-600" value="${s.maHS}" data-name="${s.hoTen}">
          <span class="truncate font-medium">${s.hoTen}</span>
        </label>
      `).join('');

      document.getElementById('bonusBatchModal').classList.remove('hidden');
    };

    window.closeBonusBatchModal = function() {
      document.getElementById('bonusBatchModal').classList.add('hidden');
    };

    window.toggleSelectAllBonusStudents = function() {
      isAllBonusSelected = !isAllBonusSelected;
      document.querySelectorAll('.bonus-student-checkbox').forEach(cb => cb.checked = isAllBonusSelected);
    };

    window.submitBatchBonus = function() {
      const monHoc = document.getElementById('bnSubject').value;
      let lyDo = document.getElementById('bnReason').value.trim();
      const count = document.getElementById('bnCount').value;
      const rate = document.getElementById('bnRate').value;
      const finalScore = window.calculateBonusTotalScore();

      const selectedStudents = [];
      document.querySelectorAll('.bonus-student-checkbox:checked').forEach(cb => {
        selectedStudents.push({ maHS: cb.value, hoTen: cb.getAttribute('data-name') });
      });

      if (selectedStudents.length === 0) { alert('Vui lòng chọn ít nhất 1 học sinh nhận điểm!'); return; }
      if (!lyDo) {
        lyDo = finalScore >= 0 ? 'Phát biểu / Đóng góp xây dựng bài' : 'Nhắc nhở / Chưa hoàn thành bài';
      }

      const quyUocText = `${count} ${finalScore >= 0 ? 'cộng' : 'trừ'} (${count}x${rate}=${finalScore})`;

      const batchObj = {
        monHoc: monHoc,
        diem: finalScore,
        soCong: count,
        quyUoc: quyUocText,
        lyDo: lyDo,
        nguoiNhap: currentUser.hoTen + ' (' + currentUser.role + ')',
        students: selectedStudents
      };

      const btn = document.getElementById('btnSubmitBonusBatch');
      btn.innerText = 'Đang lưu...';
      btn.disabled = true;

      window.google.script.run.withSuccessHandler(res => {
        btn.innerText = 'Lưu Tất Cả';
        btn.disabled = false;
        if (res.success) {
          window.closeBonusBatchModal();
          window.loadData();
        } else alert('Lỗi: ' + res.message);
      }).addBatchBonusPoints(batchObj, getAuthToken());
    };

    window.openEditBonusModal = function(id) {
      const b = appData.bonusPoints.find(x => x.id === id);
      if (!b) return;
      document.getElementById('edBonusId').value = b.id;
      document.getElementById('edBonusStudentName').value = b.hoTen + ' (' + b.maHS + ')';
      document.getElementById('edBonusSubject').value = b.monHoc;
      document.getElementById('edBonusScore').value = b.diem;
      document.getElementById('edBonusReason').value = b.lyDo;
      document.getElementById('editBonusModal').classList.remove('hidden');
    };

    window.closeEditBonusModal = function() {
      document.getElementById('editBonusModal').classList.add('hidden');
    };

    window.submitUpdateBonus = function() {
      const item = {
        id: document.getElementById('edBonusId').value,
        monHoc: document.getElementById('edBonusSubject').value,
        diem: parseFloat(document.getElementById('edBonusScore').value) || 0,
        lyDo: document.getElementById('edBonusReason').value.trim()
      };

      const btn = document.getElementById('btnSubmitUpdateBonus');
      btn.innerText = 'Đang lưu...';
      btn.disabled = true;

      window.google.script.run.withSuccessHandler(res => {
        btn.innerText = 'Cập nhật';
        btn.disabled = false;
        if (res.success) {
          window.closeEditBonusModal();
          window.loadData();
        } else alert('Lỗi: ' + res.message);
      }).updateBonusPoint(item, getAuthToken());
    };

    window.deleteBonusItem = function(id) {
      if (confirm('Bạn có chắc chắn muốn xóa dòng điểm này?')) {
        window.google.script.run.withSuccessHandler(res => {
          if (res.success) window.loadData();
          else alert('Lỗi: ' + res.message);
        }).deleteBonusPoint(id, getAuthToken());
      }
    };

    

    // ================= VI PHẠM & NỀ NẾP =================
    window.switchViolationSubView = function(view) {
      currentVpSubView = view;
      if (view === 'summary') {
        document.getElementById('vpSummaryView').classList.remove('hidden');
        document.getElementById('vpHistoryView').classList.add('hidden');
        document.getElementById('btnSubVpSummary').className = "flex-1 py-1.5 rounded-lg text-xs font-bold bg-amber-200/80 text-amber-900 transition shadow-sm";
        document.getElementById('btnSubVpHistory').className = "flex-1 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 transition";
      } else {
        document.getElementById('vpSummaryView').classList.add('hidden');
        document.getElementById('vpHistoryView').classList.remove('hidden');
        document.getElementById('btnSubVpSummary').className = "flex-1 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 transition";
        document.getElementById('btnSubVpHistory').className = "flex-1 py-1.5 rounded-lg text-xs font-bold bg-amber-200/80 text-amber-900 transition shadow-sm";
      }
      window.renderViolationsView();
    };

    window.onVpTypeChange = function() {
      const typeEl = document.getElementById('vpType');
      const select = document.getElementById('vpPresetCategory');
      if (!typeEl || !select) return;

      const type = typeEl.value;
      const list = VP_PRESETS[type] || [];
      select.innerHTML = list.map(p => `
        <option value="${p.name}" data-score="${p.score}">${p.name} (${p.score !== 0 ? (p.score > 0 ? '+' : '') + p.score + 'đ' : 'Tùy chọn'})</option>
      `).join('');

      window.onVpCategorySelect();
    };

    window.onVpCategorySelect = function() {
      const select = document.getElementById('vpPresetCategory');
      const scoreInput = document.getElementById('vpScoreInput');
      const reqSign = document.getElementById('vpNoteRequiredSign');
      if (!select || !scoreInput) return;

      const selectedOption = select.options[select.selectedIndex];
      if (!selectedOption) return;

      const defaultScore = parseFloat(selectedOption.getAttribute('data-score')) || 0;
      scoreInput.value = defaultScore;

      if (selectedOption.value.startsWith('Khác')) {
        scoreInput.readOnly = false;
        if (reqSign) reqSign.classList.remove('hidden');
      } else {
        scoreInput.readOnly = true;
        if (reqSign) reqSign.classList.add('hidden');
      }
      window.updateVpScoreBadge();
    };

    window.updateVpScoreBadge = function() {
      const scoreInput = document.getElementById('vpScoreInput');
      const badge = document.getElementById('vpScoreBadgePreview');
      if (!scoreInput || !badge) return;

      const score = parseFloat(scoreInput.value) || 0;
      badge.innerText = (score > 0 ? '+' : '') + score + ' điểm';
      badge.className = score >= 0 ? 'px-4 py-2 rounded-xl font-extrabold text-sm bg-emerald-100 text-emerald-800' : 'px-4 py-2 rounded-xl font-extrabold text-sm bg-red-100 text-red-700';
    };

    window.openViolationBatchModal = function() {
      const modal = document.getElementById('violationBatchModal');
      if (!modal) return;
      const detailInput = document.getElementById('vpDetailInput');
      if (detailInput) detailInput.value = '';
      window.onVpTypeChange();

      const container = document.getElementById('vpStudentCheckList');
      if (container && appData && appData.students) {
        container.innerHTML = appData.students.map(s => `
          <label class="flex items-center gap-2 p-1.5 bg-white rounded-lg cursor-pointer border border-slate-200 hover:bg-amber-50/40">
            <input type="checkbox" class="vp-student-checkbox w-3.5 h-3.5 rounded text-amber-600" value="${s.maHS}" data-name="${s.hoTen}">
            <span class="truncate font-medium">${s.hoTen}</span>
          </label>
        `).join('');
      }
      modal.classList.remove('hidden');
    };

    window.closeViolationBatchModal = function() {
      document.getElementById('violationBatchModal').classList.add('hidden');
    };

    window.toggleSelectAllVpStudents = function() {
      isAllVpSelected = !isAllVpSelected;
      document.querySelectorAll('.vp-student-checkbox').forEach(cb => cb.checked = isAllVpSelected);
    };

    window.submitBatchViolations = function() {
      const type = document.getElementById('vpType').value;
      const category = document.getElementById('vpPresetCategory').value;
      const score = parseFloat(document.getElementById('vpScoreInput').value) || 0;
      const detail = document.getElementById('vpDetailInput').value.trim();

      if (category.startsWith('Khác') && !detail) {
        alert('Khi chọn mục "Khác...", bạn bắt buộc phải ghi rõ lý do chi tiết!');
        return;
      }

      const selectedStudents = [];
      document.querySelectorAll('.vp-student-checkbox:checked').forEach(cb => {
        selectedStudents.push({ maHS: cb.value, hoTen: cb.getAttribute('data-name') });
      });

      if (selectedStudents.length === 0) { alert('Vui lòng chọn ít nhất 1 học sinh!'); return; }

      const batchObj = {
        loai: type,
        danhMuc: category,
        diem: score,
        chiTiet: detail || category,
        nguoiNhap: currentUser.hoTen + ' (' + currentUser.role + ')',
        students: selectedStudents
      };

      const btn = document.getElementById('btnSubmitVpBatch');
      btn.innerText = 'Đang lưu...';
      btn.disabled = true;

      window.google.script.run.withSuccessHandler(res => {
        btn.innerText = 'Lưu Tất Cả';
        btn.disabled = false;
        if (res.success) {
          window.closeViolationBatchModal();
          window.loadData();
        } else alert('Lỗi: ' + res.message);
      }).addBatchViolations(batchObj, getAuthToken());
    };

    window.openVpConfigModal = function() {
      const modal = document.getElementById('vpConfigModal');
      if (!modal) return;

      const renderRows = (type, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        const list = (VP_PRESETS && VP_PRESETS[type]) ? VP_PRESETS[type] : [];
        container.innerHTML = list.filter(p => !p.name.startsWith('Khác')).map(p => `
          <div class="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <input type="text" value="${p.name}" class="preset-name-${type} flex-1 p-1.5 border rounded-lg bg-slate-50 outline-none font-medium text-xs">
            <input type="number" value="${p.score}" class="preset-score-${type} w-20 p-1.5 border rounded-lg bg-slate-50 outline-none text-center font-bold text-xs">
            <button type="button" onclick="removePresetRow(this)" class="text-slate-400 hover:text-red-500 p-1"><i class="fa-solid fa-trash"></i></button>
          </div>
        `).join('');
      };

      renderRows('TRU', 'presetTruContainer');
      renderRows('CONG', 'presetCongContainer');
      modal.classList.remove('hidden');
    };

    window.closeVpConfigModal = function() {
      document.getElementById('vpConfigModal').classList.add('hidden');
    };

    window.addPresetRow = function(type) {
      const containerId = type === 'TRU' ? 'presetTruContainer' : 'presetCongContainer';
      const container = document.getElementById(containerId);
      if (!container) return;

      const div = document.createElement('div');
      div.className = "flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm";
      div.innerHTML = `
        <input type="text" value="Mục mới..." class="preset-name-${type} flex-1 p-1.5 border rounded-lg bg-slate-50 outline-none font-medium text-xs">
        <input type="number" value="${type === 'TRU' ? -2 : 2}" class="preset-score-${type} w-20 p-1.5 border rounded-lg bg-slate-50 outline-none text-center font-bold text-xs">
        <button type="button" onclick="removePresetRow(this)" class="text-slate-400 hover:text-red-500 p-1"><i class="fa-solid fa-trash"></i></button>
      `;
      container.appendChild(div);
    };

    window.removePresetRow = function(btn) {
      if (btn && btn.parentElement) btn.parentElement.remove();
    };

    window.saveVpPresetsConfigToServer = function() {
      const getList = (type) => {
        const list = [];
        const names = document.querySelectorAll(`.preset-name-${type}`);
        const scores = document.querySelectorAll(`.preset-score-${type}`);
        for (let i = 0; i < names.length; i++) {
          const val = names[i].value.trim();
          if (val) list.push({ name: val, score: parseFloat(scores[i].value) || (type === 'TRU' ? -2 : 2) });
        }
        list.push({ name: "Khác... (Tự nhập điểm & ghi chú)", score: 0 });
        return list;
      };

      VP_PRESETS.TRU = getList('TRU');
      VP_PRESETS.CONG = getList('CONG');

      const btn = document.getElementById('btnSavePresetConfig');
      btn.innerText = 'Đang lưu...';
      btn.disabled = true;

      window.google.script.run.withSuccessHandler(res => {
        btn.innerText = 'Lưu Vào Hệ Thống';
        btn.disabled = false;
        if (res && res.success) {
          window.closeVpConfigModal();
          window.onVpTypeChange();
        } else alert('Lỗi: ' + (res ? res.message : 'Không xác định'));
      }).saveVpPresetsConfig(VP_PRESETS, getAuthToken());
    };

    function getWeekOfMonthFromDateStr(dateStr) {
      if (!dateStr) return 1;
      const clean = dateStr.split(' ')[0].trim();
      const parts = clean.includes('/') ? clean.split('/') : clean.split('-');
      if (parts.length >= 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const firstDayOfMonth = new Date(year, month, 1);
        const dayOfWeekOfFirst = (firstDayOfMonth.getDay() + 6) % 7;
        return Math.ceil((day + dayOfWeekOfFirst) / 7);
      }
      return 1;
    }

    window.renderViolationsView = function() {
      const filterMonthEl = document.getElementById('filterVpMonth');
      if (!filterMonthEl) return;
      const filterMonth = filterMonthEl.value;
      const filterWeek = document.getElementById('filterVpWeek').value;
      const r = (currentUser && currentUser.role) ? currentUser.role.toLowerCase() : '';
      const canManage = (r === 'admin' || r === 'lopphokyluat' || r.includes('kỷ luật') || r.includes('trật tự'));

      const studentMap = {};
      appData.students.forEach(s => {
        studentMap[String(s.maHS).toLowerCase()] = { maHS: s.maHS, hoTen: s.hoTen, baseScore: 100, plusTotal: 0, minusTotal: 0 };
      });

      appData.violations.forEach(v => {
        let month = extractMonthFromDateStr(v.ngay);
        let week = getWeekOfMonthFromDateStr(v.ngay);
        if (filterMonth !== 'all' && month !== String(filterMonth)) return;
        if (filterWeek !== 'all' && String(week) !== String(filterWeek)) return;

        const key = String(v.maHS).trim().toLowerCase();
        if (studentMap[key]) {
          const score = parseFloat(v.diem) || 0;
          if (score >= 0) studentMap[key].plusTotal += score;
          else studentMap[key].minusTotal += Math.abs(score);
        }
      });

      const summaryBody = document.getElementById('vpSummaryTableBody');
      summaryBody.innerHTML = Object.values(studentMap).map((st, idx) => {
        const currentScore = st.baseScore + st.plusTotal - st.minusTotal;
        return `
          <tr class="hover:bg-slate-50 transition">
            <td class="p-3 text-center font-bold text-slate-400">${idx + 1}</td>
            <td class="p-3 font-mono font-bold text-blue-700">${st.maHS}</td>
            <td class="p-3 font-bold text-slate-800">${st.hoTen}</td>
            <td class="p-3 text-center font-bold text-slate-500">100</td>
            <td class="p-3 text-center"><span class="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full text-xs">+${st.plusTotal}</span></td>
            <td class="p-3 text-center"><span class="bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full text-xs">-${st.minusTotal}</span></td>
            <td class="p-3 text-center font-extrabold text-sm ${currentScore >= 90 ? 'text-emerald-700' : (currentScore >= 70 ? 'text-amber-600' : 'text-red-600')}">
              ${currentScore} điểm
            </td>
            <td class="p-3 text-center">
              <button onclick="viewStudentVpHistory('${st.maHS}')" class="text-xs text-blue-600 font-bold hover:underline">
                <i class="fa-solid fa-eye mr-1"></i> Chi tiết
              </button>
            </td>
          </tr>
        `;
      }).join('');

      const historyBody = document.getElementById('violationTableBody');
      const thAction = document.getElementById('thVpAction');
      if (thAction) thAction.classList.toggle('hidden', !canManage);

      let filteredVp = appData.violations.filter(v => {
        let month = extractMonthFromDateStr(v.ngay);
        let week = getWeekOfMonthFromDateStr(v.ngay);
        if (filterMonth !== 'all' && month !== String(filterMonth)) return false;
        if (filterWeek !== 'all' && String(week) !== String(filterWeek)) return false;
        return true;
      });

      if (filteredVp.length === 0) {
        historyBody.innerHTML = `<tr><td colspan="8" class="p-6 text-center text-slate-400">Không có vi phạm hay khen thưởng nào trong thời gian này!</td></tr>`;
        return;
      }

      historyBody.innerHTML = filteredVp.map((v, idx) => `
        <tr class="hover:bg-slate-50 transition">
          <td class="p-3 text-center font-bold text-slate-400">${idx + 1}</td>
          <td class="p-3 font-bold text-slate-800">${v.hoTen} <span class="text-[10px] text-slate-400 block">${v.maHS}</span></td>
          <td class="p-3 font-semibold text-slate-700">${v.danhMuc || 'Nề nếp'}</td>
          <td class="p-3 text-center">
            <span class="px-2.5 py-0.5 rounded-full font-extrabold text-xs ${v.diem >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}">
              ${v.diem >= 0 ? '+' : ''}${v.diem}
            </span>
          </td>
          <td class="p-3 text-slate-600">${v.chiTiet}</td>
          <td class="p-3 text-slate-400 text-[11px]">${v.ngay}</td>
          <td class="p-3 text-slate-500 text-[11px] font-medium">${v.nguoiNhap}</td>
          ${canManage ? `
            <td class="p-3 text-center">
              <button onclick="deleteViolationItem('${v.id}')" class="text-red-400 hover:text-red-600 p-1" title="Xóa"><i class="fa-solid fa-trash"></i></button>
            </td>
          ` : ''}
        </tr>
      `).join('');
    };

    window.viewStudentVpHistory = function(maHS) {
      window.switchViolationSubView('history');
      const rows = document.querySelectorAll('#violationTableBody tr');
      rows.forEach(r => {
        r.style.display = r.innerText.includes(maHS) ? '' : 'none';
      });
    };

    window.deleteViolationItem = function(id) {
      if (confirm('Bạn có chắc chắn muốn xóa dòng vi phạm này?')) {
        window.google.script.run.withSuccessHandler(res => {
          if (res.success) window.loadData();
          else alert('Lỗi: ' + res.message);
        }).deleteViolationRecord(id, getAuthToken());
      }
    };

    window.exportVpExcel = function() {
      const filterMonth = document.getElementById('filterVpMonth').value;
      const filterWeek = document.getElementById('filterVpWeek').value;
      let html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="utf-8"><title>Thống Kê Nề Nếp Lớp</title></head>
        <body>
          <h2 style="text-align: center; color: #19376D; font-family: Arial;">BẢNG TỔNG HỢP ĐIỂM NỀ NẾP & THI ĐUA HỌC SINH</h2>
          <p style="text-align: center; font-family: Arial; font-size: 12px;">Tháng: ${filterMonth === 'all' ? 'Cả năm' : filterMonth} | Tuần: ${filterWeek === 'all' ? 'Cả tháng' : 'Tuần ' + filterWeek}</p>
          <table border="1" style="border-collapse: collapse; width: 100%; font-family: Arial; font-size: 11px;">
            <tr style="background-color: #19376D; color: #ffffff; font-weight: bold; text-align: center;">
              <th style="padding: 8px;">STT</th><th style="padding: 8px;">Mã HS</th><th style="padding: 8px;">Họ và Tên</th>
              <th style="padding: 8px;">Điểm Gốc</th><th style="padding: 8px;">Tổng Thưởng (+)</th><th style="padding: 8px;">Tổng Phạt (-)</th><th style="padding: 8px;">Điểm Hiện Tại</th>
            </tr>
      `;
      const rows = document.querySelectorAll('#vpSummaryTableBody tr');
      rows.forEach((r, idx) => {
        const cols = r.querySelectorAll('td');
        if (cols.length >= 7) {
          html += `
            <tr style="text-align: center;">
              <td>${idx + 1}</td><td style="mso-number-format:'\\@';">${cols[1].innerText}</td>
              <td style="text-align: left; padding-left: 5px;">${cols[2].innerText}</td>
              <td>${cols[3].innerText}</td><td style="color: green;">${cols[4].innerText}</td>
              <td style="color: red;">${cols[5].innerText}</td><td style="font-weight: bold;">${cols[6].innerText}</td>
            </tr>
          `;
        }
      });
      html += `</table></body></html>`;
      const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ThongKeNenNep_Thang_${filterMonth}_Tuan_${filterWeek}.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    // ================= QUAY SỐ & XẾP CHỖ =================
    window.renderLuckyStudentPool = function() {
      const container = document.getElementById('luckyStudentPool');
      if (!container) return;
      container.innerHTML = appData.students.map(s => `
        <label class="flex items-center gap-2 p-1.5 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-purple-50/50">
          <input type="checkbox" checked onchange="updateLuckyPoolCount()" value="${s.maHS}" data-name="${s.hoTen}" class="lucky-student-cb w-3.5 h-3.5 rounded text-purple-600">
          <span class="truncate font-medium">${s.hoTen}</span>
        </label>
      `).join('');
      window.updateLuckyPoolCount();
    };

    window.updateLuckyPoolCount = function() {
      const checked = document.querySelectorAll('.lucky-student-cb:checked').length;
      const countEl = document.getElementById('luckyPoolCount');
      if (countEl) countEl.innerText = checked;
    };

    window.toggleSelectAllLuckyPool = function() {
      isAllLuckyPoolSelected = !isAllLuckyPoolSelected;
      document.querySelectorAll('.lucky-student-cb').forEach(cb => cb.checked = isAllLuckyPoolSelected);
      window.updateLuckyPoolCount();
    };

    window.runLuckyDraw = function() {
      const selectedCheckboxes = Array.from(document.querySelectorAll('.lucky-student-cb:checked'));
      if (selectedCheckboxes.length === 0) { alert('Vui lòng chọn ít nhất 1 học sinh tham gia quay!'); return; }

      const qInput = document.getElementById('luckyQuantity');
      let q = parseInt(qInput.value) || 1;
      if (q > selectedCheckboxes.length) q = selectedCheckboxes.length;

      const candidates = selectedCheckboxes.map(cb => ({ maHS: cb.value, hoTen: cb.getAttribute('data-name') }));
      const resBox = document.getElementById('luckyResultContainer');
      const resList = document.getElementById('luckyResult');
      resBox.classList.remove('hidden');

      let counter = 0;
      const timer = setInterval(() => {
        const temp = [...candidates].sort(() => 0.5 - Math.random()).slice(0, q);
        resList.innerHTML = temp.map(s => `
          <div class="bg-white border border-purple-300 text-purple-800 px-3.5 py-2 rounded-2xl font-bold text-xs shadow-sm flex items-center gap-2 animate-pulse">
            <i class="fa-solid fa-user text-purple-500"></i> ${s.hoTen} <span class="text-[10px] text-slate-400">(${s.maHS})</span>
          </div>
        `).join('');
        counter++;
        if (counter > 10) {
          clearInterval(timer);
          const finalResult = [...candidates].sort(() => 0.5 - Math.random()).slice(0, q);
          resList.innerHTML = finalResult.map((s, idx) => `
            <div class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-2xl font-extrabold text-xs shadow-md flex items-center gap-2 animate-bounce">
              <span class="bg-white text-purple-700 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">${idx + 1}</span>
              ${s.hoTen} <span class="text-purple-200 text-[10px]">(${s.maHS})</span>
            </div>
          `).join('');
        }
      }, 80);
    };

    window.initSeatingGrid = function() {
      const colsEl = document.getElementById('seatCols');
      if (!colsEl) return;
      const cols = parseInt(colsEl.value) || 4;
      const rows = parseInt(document.getElementById('seatRows').value) || 6;
      const totalSeats = cols * rows;

      const container = document.getElementById('seatingPlan');
      container.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;

      const oldPinned = seatState.filter(s => s.isPinned);
      seatState = [];

      for (let i = 0; i < totalSeats; i++) {
        const foundPinned = oldPinned.find(p => p.seatIndex === i);
        seatState.push(foundPinned || { seatIndex: i, maHS: '', hoTen: '', isPinned: false });
      }
      window.renderSeatingDOM();
    };

    window.renderSeatingDOM = function() {
      const container = document.getElementById('seatingPlan');
      if (!container) return;
      const r = (currentUser && currentUser.role) ? currentUser.role.toLowerCase() : '';
      const canManage = (r === 'admin' || r === 'loptruong' || r.includes('lớp trưởng'));

      container.innerHTML = seatState.map((seat, idx) => `
        <div class="p-2.5 rounded-2xl border transition relative flex flex-col justify-between min-h-[90px] ${seat.isPinned ? 'bg-amber-50 border-amber-300 shadow-sm' : (seat.hoTen ? 'bg-white border-emerald-200 shadow-sm' : 'bg-slate-50/70 border-dashed border-slate-300')}">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] font-black ${seat.isPinned ? 'text-amber-700' : 'text-slate-400'}">BÀN ${idx + 1}</span>
            ${canManage ? `
              <button onclick="togglePinSeat(${idx})" class="text-xs p-1 ${seat.isPinned ? 'text-amber-600 font-bold' : 'text-slate-300 hover:text-amber-500'}">
                <i class="fa-solid fa-thumbtack ${seat.isPinned ? 'rotate-45 text-amber-600' : ''}"></i>
              </button>
            ` : ''}
          </div>
          <div class="my-auto">
            ${canManage ? `
              <select onchange="onManualSelectSeat(${idx}, this.value)" class="w-full text-xs font-bold p-1 rounded-lg border border-transparent hover:border-slate-300 bg-transparent outline-none truncate ${seat.hoTen ? 'text-slate-800' : 'text-slate-400 italic'}">
                <option value="">-- Trống --</option>
                ${appData.students.map(st => `<option value="${st.maHS}" ${st.maHS === seat.maHS ? 'selected' : ''}>${st.hoTen}</option>`).join('')}
              </select>
            ` : `<div class="font-bold text-xs text-slate-800 truncate text-center">${seat.hoTen || '<span class="text-slate-300 font-normal italic">Trống</span>'}</div>`}
          </div>
          <div class="text-[10px] text-slate-400 text-center font-mono">${seat.maHS || ''}</div>
        </div>
      `).join('');
    };

    window.onManualSelectSeat = function(seatIdx, maHS) {
      if (!maHS) {
        seatState[seatIdx] = { ...seatState[seatIdx], maHS: '', hoTen: '', isPinned: false };
      } else {
        const student = appData.students.find(s => s.maHS === maHS);
        if (student) {
          seatState.forEach((s, i) => {
            if (i !== seatIdx && s.maHS === maHS) { s.maHS = ''; s.hoTen = ''; s.isPinned = false; }
          });
          seatState[seatIdx] = { ...seatState[seatIdx], maHS: student.maHS, hoTen: student.hoTen, isPinned: true };
        }
      }
      window.renderSeatingDOM();
    };

    window.togglePinSeat = function(seatIdx) {
      if (!seatState[seatIdx].maHS) { alert('Vui lòng chọn học sinh trước khi ghim cố định!'); return; }
      seatState[seatIdx].isPinned = !seatState[seatIdx].isPinned;
      window.renderSeatingDOM();
    };

    window.randomizeUnpinnedSeats = function() {
      const pinnedMaHSList = seatState.filter(s => s.isPinned && s.maHS).map(s => s.maHS);
      const availableStudents = appData.students.filter(s => !pinnedMaHSList.includes(s.maHS));
      const shuffled = [...availableStudents].sort(() => 0.5 - Math.random());

      let studentIdx = 0;
      seatState.forEach(seat => {
        if (!seat.isPinned) {
          if (studentIdx < shuffled.length) {
            seat.maHS = shuffled[studentIdx].maHS;
            seat.hoTen = shuffled[studentIdx].hoTen;
            studentIdx++;
          } else {
            seat.maHS = '';
            seat.hoTen = '';
          }
        }
      });
      window.renderSeatingDOM();
    };

    window.resetAllSeats = function() {
      if (confirm('Bạn có muốn đặt lại toàn bộ sơ đồ chỗ ngồi về trạng thái trống?')) {
        seatState.forEach(seat => { seat.maHS = ''; seat.hoTen = ''; seat.isPinned = false; });
        window.renderSeatingDOM();
      }
    };

    // ================= QUỸ LỚP =================
    window.openCreateFundModal = function(type) {
      document.getElementById('fundType').value = type;
      document.getElementById('fundTitle').value = '';
      document.getElementById('fundAmount').value = '';
      document.getElementById('fundDeadline').value = '';

      const modalTitle = document.getElementById('fundModalTitle');
      const amountLabel = document.getElementById('fundAmountLabel');
      const deadlineBox = document.getElementById('fundDeadlineContainer');

      if (type === 'THU') {
        modalTitle.innerHTML = '<i class="fa-solid fa-hand-holding-dollar text-purple-600"></i> Tạo Khoản Thu Từ Học Sinh';
        amountLabel.innerHTML = 'Số tiền mỗi học sinh cần nộp (VNĐ) <span class="text-red-500">*</span>';
        deadlineBox.classList.remove('hidden');
      } else if (type === 'CHI') {
        modalTitle.innerHTML = '<i class="fa-solid fa-money-bill-transfer text-rose-600"></i> Tạo Khoản Chi Tiêu';
        amountLabel.innerHTML = 'Tổng số tiền chi (VNĐ) <span class="text-red-500">*</span>';
        deadlineBox.classList.add('hidden');
      } else {
        modalTitle.innerHTML = '<i class="fa-solid fa-gift text-amber-500"></i> Ghi Nhận Quỹ Thưởng Khác / Tài Trợ';
        amountLabel.innerHTML = 'Số tiền thưởng nhận được (VNĐ) <span class="text-red-500">*</span>';
        deadlineBox.classList.add('hidden');
      }
      document.getElementById('fundCreateModal').classList.remove('hidden');
    };

    window.closeCreateFundModal = function() {
      document.getElementById('fundCreateModal').classList.add('hidden');
    };

    window.submitCreateFund = function() {
      const type = document.getElementById('fundType').value;
      const title = document.getElementById('fundTitle').value.trim();
      const amount = parseFloat(document.getElementById('fundAmount').value) || 0;
      const deadline = document.getElementById('fundDeadline').value;

      if (!title) { alert('Vui lòng nhập nội dung!'); return; }
      if (amount <= 0) { alert('Vui lòng nhập số tiền hợp lệ (> 0)!'); return; }

      const fundObj = {
        loai: type,
        tenKhoan: title,
        soTien: amount,
        hanDong: deadline ? deadline.split('-').reverse().join('/') : 'Không thời hạn',
        nguoiNhap: currentUser.hoTen + ' (' + currentUser.role + ')'
      };

      const btn = document.getElementById('btnSubmitCreateFund');
      btn.innerText = 'Đang tạo...';
      btn.disabled = true;

      window.google.script.run.withSuccessHandler(res => {
        btn.innerText = 'Xác nhận tạo';
        btn.disabled = false;
        if (res.success) {
          window.closeCreateFundModal();
          window.loadData();
        } else alert('Lỗi: ' + res.message);
      }).createFundTransaction(fundObj, getAuthToken());
    };

    window.renderFunds = function() {
      const r = (currentUser && currentUser.role) ? currentUser.role.toLowerCase() : '';
      const isAdmin = (r === 'admin');
      const isThuQuy = (r === 'thuquy' || r.includes('thủ quỹ') || r.includes('thu quy'));
      const canManageFund = (isAdmin || isThuQuy);

      let totalCollected = 0;
      let totalBonus = 0;
      let totalSpent = 0;
      let hasMyPendingFund = false;

      const thuItems = [];
      const otherItems = [];

      appData.funds.forEach(f => {
        if (f.loai === 'THU') {
          thuItems.push(f);
          totalCollected += (f.daDong.length * f.soTien);
          const isPaidByMe = f.daDong.some(m => String(m).toLowerCase() === String(currentUser.username).toLowerCase());
          if (!isPaidByMe && !isAdmin) hasMyPendingFund = true;
        } else if (f.loai === 'CHI') {
          otherItems.push(f);
          totalSpent += f.soTien;
        } else if (f.loai === 'THUONG') {
          otherItems.push(f);
          totalBonus += f.soTien;
        }
      });

      const currentBalance = totalCollected + totalBonus - totalSpent;

      document.getElementById('statFundCollected').innerText = totalCollected.toLocaleString() + ' đ';
      document.getElementById('statFundBonus').innerText = totalBonus.toLocaleString() + ' đ';
      document.getElementById('statFundSpent').innerText = totalSpent.toLocaleString() + ' đ';
      document.getElementById('statFundBalance').innerText = currentBalance.toLocaleString() + ' đ';

      const fundBadge = document.getElementById('sidebarFundBadge');
      if (fundBadge) fundBadge.classList.toggle('hidden', !hasMyPendingFund);
      const bnavBadgeFund = document.getElementById('bnavBadgeFund');
      if (bnavBadgeFund) bnavBadgeFund.classList.toggle('hidden', !hasMyPendingFund);

      const otherTbody = document.getElementById('fundOtherTransactionTableBody');
      const thOtherAction = document.getElementById('thFundOtherAction');
      if (thOtherAction) thOtherAction.classList.toggle('hidden', !isAdmin);

      if (otherItems.length === 0) {
        otherTbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-slate-400">Chưa có giao dịch chi tiêu hoặc quỹ thưởng nào!</td></tr>`;
      } else {
        otherTbody.innerHTML = otherItems.map((item, idx) => `
          <tr class="hover:bg-slate-50 transition">
            <td class="p-2.5 text-center font-bold text-slate-400">${idx + 1}</td>
            <td class="p-2.5">
              <span class="px-2 py-0.5 rounded-full font-extrabold text-[11px] ${item.loai === 'CHI' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}">
                ${item.loai === 'CHI' ? '➖ KHOẢN CHI' : '➕ THƯỞNG KHÁC'}
              </span>
            </td>
            <td class="p-2.5 font-bold text-slate-800">${item.tenKhoanThu}</td>
            <td class="p-2.5 text-right font-mono font-bold text-xs sm:text-sm ${item.loai === 'CHI' ? 'text-rose-600' : 'text-emerald-700'}">
              ${item.loai === 'CHI' ? '-' : '+'}${item.soTien.toLocaleString()} đ
            </td>
            <td class="p-2.5 text-slate-400 text-[11px]">${item.ngayTao}</td>
            <td class="p-2.5 text-slate-600 text-[11px] font-medium">${item.nguoiNhap}</td>
            ${isAdmin ? `
              <td class="p-2.5 text-center">
                <button onclick="deleteFundAction('${item.id}')" class="text-red-400 hover:text-red-600 p-1" title="Xóa"><i class="fa-solid fa-trash"></i></button>
              </td>
            ` : ''}
          </tr>
        `).join('');
      }

      const thuContainer = document.getElementById('fundCollectionList');
      if (thuItems.length === 0) {
        thuContainer.innerHTML = `<div class="bg-white p-6 rounded-2xl border text-center text-slate-400 text-xs font-medium">Chưa có khoản thu nào!</div>`;
      } else {
        thuContainer.innerHTML = thuItems.map(f => {
          const totalStudents = appData.students.length;
          const paidCount = f.daDong.length;
          const isPaidByMe = f.daDong.some(m => String(m).toLowerCase() === String(currentUser.username).toLowerCase());
          const isAllPaid = (totalStudents > 0 && paidCount === totalStudents);

          let cardStyle = 'border-slate-200 bg-white shadow-sm';
          let myStatusBadge = '';

          if (isAdmin) {
            if (isAllPaid) {
              cardStyle = 'border-2 border-emerald-500 bg-emerald-50/15 shadow-sm';
              myStatusBadge = `<span class="bg-emerald-600 text-white font-extrabold px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm"><i class="fa-solid fa-circle-check"></i> Đã thu đủ 100%</span>`;
            } else {
              cardStyle = 'border-2 border-purple-500 bg-purple-50/15 shadow-sm';
              myStatusBadge = `<span class="bg-purple-600 text-white font-extrabold px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm"><i class="fa-solid fa-clock"></i> Đang thu (${paidCount}/${totalStudents})</span>`;
            }
          } else {
            if (!isPaidByMe) {
              cardStyle = 'urgent-blink';
              myStatusBadge = `<span class="bg-red-600 text-white font-extrabold px-3 py-1 rounded-full text-xs animate-pulse tracking-wide flex items-center gap-1 shadow-sm"><i class="fa-solid fa-triangle-exclamation"></i> Bạn chưa đóng!</span>`;
            } else {
              cardStyle = 'border-2 border-emerald-400 bg-emerald-50/20 shadow-sm';
              myStatusBadge = `<span class="bg-emerald-600 text-white font-extrabold px-3 py-1 rounded-full text-xs flex items-center gap-1"><i class="fa-solid fa-check"></i> Đã nộp xong</span>`;
            }
          }

          return `
            <div class="rounded-3xl p-5 border ${cardStyle} transition flex flex-col justify-between">
              <div>
                <div class="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 class="font-extrabold text-slate-800 text-base leading-snug">${f.tenKhoanThu}</h4>
                    <div class="text-xs text-slate-500 mt-1">
                      Mỗi bạn: <b class="text-purple-700 font-bold">${f.soTien.toLocaleString()} VNĐ</b> | Hạn: <span class="font-semibold text-slate-700">${f.hanDong}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    ${myStatusBadge}
                    ${isAdmin ? `<button onclick="deleteFundAction('${f.id}')" class="text-slate-300 hover:text-red-500 text-sm p-1" title="Xóa khoản thu"><i class="fa-solid fa-trash"></i></button>` : ''}
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-100">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-slate-600 uppercase">
                      Danh Sách Nộp Quỹ (${paidCount}/${totalStudents} bạn đã đóng)
                    </span>
                    ${canManageFund ? `
                      <button onclick="saveBatchFundPayment('${f.id}')" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1">
                        <i class="fa-solid fa-floppy-disk"></i> Lưu Danh Sách Nộp Tiền
                      </button>
                    ` : ''}
                  </div>

                  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
                    ${appData.students.map(s => {
                      const isPaid = f.daDong.some(m => String(m).toLowerCase() === String(s.maHS).toLowerCase());
                      return `
                        <label class="flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer ${isPaid ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-white border-slate-200 text-slate-600'}">
                          <input type="checkbox" data-fund="${f.id}" value="${s.maHS}" ${isPaid ? 'checked' : ''} ${canManageFund ? '' : 'disabled'} class="fund-student-cb-${f.id} w-3.5 h-3.5 rounded text-emerald-600">
                          <span class="truncate">${s.hoTen}</span>
                        </label>
                      `;
                    }).join('')}
                  </div>
                </div>
              </div>

              <div class="mt-3 pt-2 text-[11px] text-slate-400 flex justify-between">
                <span>Tạo bởi: <b>${f.nguoiNhap}</b></span>
                <span>Ngày tạo: ${f.ngayTao || '---'}</span>
              </div>
            </div>
          `;
        }).join('');
      }
    };

    window.saveBatchFundPayment = function(fundId) {
      const checkboxes = document.querySelectorAll(`.fund-student-cb-${fundId}:checked`);
      const paidArray = [];
      checkboxes.forEach(cb => paidArray.push(cb.value));

      window.google.script.run.withSuccessHandler(res => {
        if (res.success) window.loadData();
        else alert('Lỗi: ' + res.message);
      }).updateFundPaidList(fundId, paidArray, getAuthToken());
    };

    window.deleteFundAction = function(fundId) {
      if (confirm('Bạn có chắc chắn muốn xóa mục giao dịch quỹ này?')) {
        window.google.script.run.withSuccessHandler(res => {
          if (res.success) window.loadData();
          else alert('Lỗi: ' + res.message);
        }).deleteFundTransaction(fundId, getAuthToken());
      }
    };

    // 3. Khởi chạy tải cấu hình ban đầu & tự động khôi phục phiên đăng nhập
    window.google.script.run.withSuccessHandler(cfg => {
      if (cfg) window.applyAppConfig(cfg);
    }).getPublicAppConfig();

    window.google.script.run.withSuccessHandler(res => {
      if (res && res.TRU && res.CONG && res.TRU.length > 0) {
        VP_PRESETS = res;
      }
    }).getVpPresetsConfig();

    try {
      const savedToken = localStorage.getItem('authToken');
      const savedUserStr = localStorage.getItem('savedUser');
      if (savedToken && savedUserStr) {
        const parsedUser = JSON.parse(savedUserStr);
        if (parsedUser && parsedUser.username) {
          window.applyLoggedInState(parsedUser, savedToken);
        }
      }
    } catch (e) {}
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: RAW_BODY_HTML }} />;
}
