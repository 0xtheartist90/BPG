import { AdminNav } from '../components/admin-nav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='min-h-screen bg-gradient-to-b from-[#faeacd]/40 to-[#f5e6d0]/20'>
            <AdminNav />
            <main className='mx-auto max-w-6xl px-4 py-8 sm:px-6'>{children}</main>
        </div>
    );
}
