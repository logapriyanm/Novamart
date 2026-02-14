'use client';

import React from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { FaCloudUploadAlt, FaTrash, FaImage } from 'react-icons/fa';
import Image from 'next/image';

interface CMSImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    folder?: string;
}

export default function CMSImageUpload({
    value,
    onChange,
    label = 'Image',
    folder = 'novamart/cms'
}: CMSImageUploadProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-wider text-foreground/40">{label}</label>

            {value ? (
                <div className="relative group w-full h-32 bg-surface rounded-[12px] border border-foreground/10 overflow-hidden">
                    <Image
                        src={value}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized // Allow external URLs without Next.js config hassle for now
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            title="Remove Image"
                        >
                            <FaTrash className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'novamart_unsigned'}
                    options={{
                        sources: ['local', 'url', 'camera', 'unsplash'],
                        multiple: false,
                        folder: folder,
                        resourceType: 'image',
                        maxFiles: 1,
                        styles: {
                            palette: {
                                window: '#FFFFFF',
                                windowBorder: '#067FF910',
                                tabIcon: '#067FF9',
                                menuIcons: '#067FF9',
                                textDark: '#1E293B',
                                textLight: '#FFFFFF',
                                link: '#067FF9',
                                action: '#067FF9',
                                inactiveTabIcon: '#067FF940',
                                error: '#F43F5E',
                                inProgress: '#067FF9',
                                complete: '#10B981',
                                sourceBg: '#F8FAFC'
                            }
                        }
                    }}
                    onSuccess={(result: any) => {
                        if (result?.info?.secure_url) {
                            onChange(result.info.secure_url);
                        }
                    }}
                >
                    {({ open }) => {
                        return (
                            <button
                                type="button"
                                onClick={() => {
                                    if (open && typeof open === 'function') {
                                        open();
                                    } else {
                                        console.error('Cloudinary widget not initialized');
                                    }
                                }}
                                className="w-full h-32 border border-dashed border-foreground/20 rounded-[12px] flex flex-col items-center justify-center gap-2 hover:bg-foreground/5 hover:border-primary/40 transition-all text-foreground/40 hover:text-primary group"
                            >
                                <div className="p-2 bg-surface rounded-full group-hover:scale-110 transition-transform">
                                    <FaCloudUploadAlt className="w-6 h-6" />
                                </div>
                                <span className="text-sm font-bold uppercase tracking-wider">Upload {label}</span>
                            </button>
                        );
                    }}
                </CldUploadWidget>
            )}
        </div>
    );
}
