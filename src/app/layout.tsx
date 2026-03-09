import type { Metadata } from 'next';

import '@/app/globals.css';

export const metadata: Metadata = {
    icons: {
        icon: '/icon.png',
        shortcut: '/icon.png',
        apple: '/icon.png'
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='nl'>
            <body>{children}</body>
        </html>
    );
}
