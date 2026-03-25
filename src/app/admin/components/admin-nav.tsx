'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { logout } from '../actions/auth';

export function AdminNav() {
    const pathname = usePathname();

    const links = [
        { href: '/admin', label: 'Dashboard', icon: '🏠' },
        { href: '/admin/nieuws', label: 'Nieuws', icon: '📰' },
        { href: '/admin/agenda', label: 'Agenda', icon: '📅' }
    ];

    return (
        <nav className='border-b border-[#f3d9ba] bg-[#faeacd]'>
            <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6'>
                <div className='flex items-center gap-6'>
                    <Link href='/admin' className='flex items-center gap-2.5'>
                        <Image
                            src='/images/bpglogo.png'
                            alt='BPG'
                            width={36}
                            height={36}
                            className='rounded-full'
                        />
                        <span className='text-lg font-bold text-[#43160c]'>Beheer</span>
                    </Link>
                    <div className='flex items-center gap-1'>
                        {links.map((link) => {
                            const isActive =
                                link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href);

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-[#43160c] text-white shadow-sm'
                                            : 'text-[#6c3d20] hover:bg-[#43160c]/10'
                                    }`}>
                                    <span className='mr-1.5'>{link.icon}</span>
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
                <div className='flex items-center gap-3'>
                    <a
                        href='/nl'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='rounded-lg px-3 py-2 text-sm text-[#6c3d20] transition-colors hover:bg-[#43160c]/10'>
                        Bekijk site
                    </a>
                    <form action={logout}>
                        <button
                            type='submit'
                            className='rounded-lg border border-[#43160c]/20 bg-white/60 px-3 py-2 text-sm text-[#43160c] transition-colors hover:bg-white'>
                            Uitloggen
                        </button>
                    </form>
                </div>
            </div>
        </nav>
    );
}
