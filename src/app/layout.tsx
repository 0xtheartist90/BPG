import type { Metadata } from 'next';

import '@/app/globals.css';

export const metadata: Metadata = {
    icons: {
        icon: '/images/bpglogo.png',
        shortcut: '/images/bpglogo.png',
        apple: '/images/bpglogo.png'
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='nl'>
            <body>{children}</body>
        </html>
    );
}
