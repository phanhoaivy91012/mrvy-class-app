export const metadata = {
  title: 'MR Vy - Hệ Thống Quản Lý',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes redPulse {
            0%, 100% { border-color: #ef4444; box-shadow: 0 0 12px rgba(239, 68, 68, 0.4); background-color: #fff5f5; }
            50% { border-color: #fca5a5; box-shadow: 0 0 0 transparent; background-color: #ffffff; }
          }
          .urgent-blink {
            animation: redPulse 1.2s infinite ease-in-out;
            border-width: 2px !important;
          }
          .active-nav-btn {
            background-color: #e6f7f0 !important;
            color: #059669 !important;
            font-weight: 700;
          }
          .active-nav-btn i { color: #059669 !important; }
          .tkb-cell-editable {
            min-height: 48px; padding: 6px 4px; outline: none; font-size: 12px;
            font-weight: 700; line-height: 1.3; border-radius: 8px; transition: all 0.2s;
            display: flex; flex-direction: column; justify-content: center;
            align-items: center; text-align: center; cursor: pointer;
          }
          .tkb-cell-editable:focus {
            background-color: #ffffff !important; color: #0f172a !important;
            box-shadow: inset 0 0 0 2px #2563eb;
          }
          .sub-line-red {
            color: #dc2626 !important; font-weight: 800 !important;
            font-style: italic; font-size: 11px; margin-top: 2px; display: block;
          }
          ::-webkit-scrollbar { width: 5px; height: 5px; }
          ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        `}} />
      </head>
      <body className="bg-[#f1f5f9] font-sans text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
