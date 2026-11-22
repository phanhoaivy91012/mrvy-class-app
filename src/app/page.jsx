'use client';

import dynamic from 'next/dynamic';

// TKB và toàn bộ giao diện cũ phụ thuộc document/window/Canvas.
// Không render chúng khi Next.js dựng trang tĩnh tại Vercel.
const ClientApp = dynamic(() => import('./tkb-client'), {
  ssr: false,
  loading: () => (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0a192f', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      <div role="status" aria-live="polite">Đang mở hệ thống quản lý lớp...</div>
    </main>
  ),
});

export default function Page() {
  return <ClientApp />;
}
