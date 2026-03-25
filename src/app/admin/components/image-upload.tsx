'use client';

import { useRef, useState } from 'react';

import Image from 'next/image';

type ImageUploadProps = {
    value: string;
    onChange: (url: string) => void;
    error?: string;
};

export function ImageUpload({ value, onChange, error }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    async function handleUpload(file: File) {
        setUploading(true);
        setUploadError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();

            if (!res.ok) {
                setUploadError(data.error ?? 'Upload mislukt');

                return;
            }

            onChange(data.url);
        } catch {
            setUploadError('Upload mislukt. Controleer de verbinding.');
        } finally {
            setUploading(false);
        }
    }

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleUpload(file);
    }

    const displayError = uploadError ?? error;
    const isBlob = value.startsWith('http');
    const hasPreview = value && (isBlob || value.startsWith('/images/'));

    return (
        <div>
            <label className='mb-1.5 block text-sm font-medium text-[#43160c]'>Afbeelding</label>

            {hasPreview && (
                <div className='relative mb-3 h-32 w-48 overflow-hidden rounded-xl border border-[#f3d9ba] bg-[#faeacd]/30'>
                    <Image
                        src={value}
                        alt='Preview'
                        fill
                        className='object-cover'
                        sizes='192px'
                        unoptimized={isBlob}
                    />
                    <button
                        type='button'
                        onClick={() => onChange('')}
                        className='absolute top-1.5 right-1.5 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-red-600 shadow-sm transition-colors hover:bg-white'
                        aria-label='Verwijder afbeelding'>
                        ✕
                    </button>
                </div>
            )}

            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className='flex items-center gap-3'>
                <button
                    type='button'
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    className='rounded-xl border border-[#f3d9ba] bg-[#faeacd]/40 px-4 py-2.5 text-sm font-medium text-[#43160c] transition-colors hover:bg-[#faeacd] disabled:opacity-50'>
                    {uploading ? 'Uploaden...' : 'Afbeelding kiezen'}
                </button>
                <input
                    ref={inputRef}
                    type='file'
                    accept='image/jpeg,image/png,image/webp,image/gif,image/svg+xml'
                    onChange={handleFileSelect}
                    className='hidden'
                />
                <span className='text-xs text-[#c9832c]'>of sleep een bestand hierheen</span>
            </div>

            {/* Manual URL input as fallback */}
            <input
                type='text'
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder='Of plak een URL / pad...'
                className='mt-2 w-full rounded-xl border border-[#f3d9ba] bg-[#faeacd]/10 px-4 py-2 font-mono text-xs text-[#6c3d20] focus:border-[#d06129] focus:ring-2 focus:ring-[#ff4d00]/20 focus:outline-none'
            />

            {displayError && (
                <p className='mt-1 text-xs text-red-600'>{displayError}</p>
            )}
        </div>
    );
}
