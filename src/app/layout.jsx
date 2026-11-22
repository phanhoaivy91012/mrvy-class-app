import Script from 'next/script';

// Root layout của Next.js App Router.
// TUYỆT ĐỐI không đặt 'use server' hoặc code Supabase/actions.js trong file này.
export const metadata = {
  title: 'MR Vy - Hệ thống quản lý lớp',
  description: 'Hệ thống quản lý lớp chủ nhiệm và thời khóa biểu',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        {/* Giao diện hiện tại dùng các utility class Tailwind ngay trong HTML. */}
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        {/* Biểu tượng fa-solid/fa-regular được dùng trong page.jsx và tkb-client.jsx. */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
      </head>
      <body style={{ margin: 0, fontFamily: 'Arial, Helvetica, sans-serif', backgroundColor: '#f8fafc' }}>
        {children}
      </body>
    </html>
  );
}
