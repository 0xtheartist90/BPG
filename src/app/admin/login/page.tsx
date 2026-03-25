'use client';

import { useRef, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { login } from '../actions/auth';

export default function AdminLoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [lockedUntil, setLockedUntil] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isLocked) return;

        setError(null);
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await login(formData);

        if (result.success) {
            router.push('/admin');
        } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            if (newAttempts >= 5) {
                setLockedUntil(Date.now() + 60_000);
                setError('Te veel pogingen. Wacht 1 minuut.');
                setAttempts(0);
                setTimeout(() => setLockedUntil(null), 60_000);
            } else {
                setError(result.error ?? 'Onjuist wachtwoord. Probeer opnieuw.');
            }

            setLoading(false);
            inputRef.current?.focus();
        }
    }

    return (
        <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-[#faeacd] via-[#f5e6d0] to-[#edd5b8] px-4'>
            <div className='w-full max-w-sm'>
                <div className='mb-8 flex justify-center'>
                    <Image
                        src='/images/bpglogo.png'
                        alt='Buurt Platform Gein'
                        width={80}
                        height={80}
                        className='rounded-full shadow-lg'
                        priority
                    />
                </div>

                <div className='rounded-2xl border border-[#f3d9ba] bg-white p-8 shadow-xl'>
                    <h1 className='mb-1 text-center text-2xl font-bold text-[#43160c]'>BPG Beheer</h1>
                    <p className='mb-6 text-center text-sm text-[#6c3d20]'>Buurt Platform Gein</p>

                    <form onSubmit={handleSubmit}>
                        <div className='mb-4'>
                            <label htmlFor='password' className='mb-1.5 block text-sm font-medium text-[#43160c]'>
                                Wachtwoord
                            </label>
                            <input
                                ref={inputRef}
                                id='password'
                                name='password'
                                type='password'
                                autoComplete='current-password'
                                className='w-full rounded-xl border border-[#f3d9ba] bg-[#faeacd]/20 px-4 py-2.5 text-[#43160c] shadow-sm focus:border-[#d06129] focus:ring-2 focus:ring-[#ff4d00]/20 focus:outline-none disabled:opacity-50'
                                aria-describedby={error ? 'login-error' : undefined}
                                disabled={loading || isLocked}
                            />
                        </div>

                        {error && (
                            <div className='mb-4 rounded-xl border border-red-200 bg-red-50 p-3'>
                                <p id='login-error' role='alert' className='text-center text-sm text-red-600'>
                                    {error}
                                </p>
                            </div>
                        )}

                        <button
                            type='submit'
                            disabled={loading || isLocked}
                            className='w-full rounded-xl bg-[#ff4d00] px-4 py-2.5 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#e04400] hover:shadow-md focus:ring-2 focus:ring-[#ff4d00]/50 focus:ring-offset-2 focus:outline-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none'>
                            {isLocked ? 'Vergrendeld...' : loading ? 'Bezig...' : 'Inloggen'}
                        </button>
                    </form>
                </div>

                <p className='mt-6 text-center text-xs text-[#c9832c]'>
                    Buurt Platform Gein — Amsterdam-Zuidoost
                </p>
            </div>
        </div>
    );
}
