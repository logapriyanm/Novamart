'use client';

import React from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { FaCloudUploadAlt, FaImages, FaVideo } from 'react-icons/fa';

interface MediaUploadProps {
    onUploadSuccess?: (result: any) => void;
    folder?: string;
    resourceType?: 'image' | 'video' | 'auto';
    label?: string;
    multiple?: boolean;
}

const MediaUpload: React.FC<MediaUploadProps> = ({
    onUploadSuccess,
    folder = 'novamart',
    resourceType = 'auto',
    label = 'Upload Media',
    multiple = false
}) => {
    return (
        <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{
                sources: ['local', 'url', 'camera'],
                multiple,
                folder,
                resourceType,
                styles: {
                    palette: {
                        window: '#FFFFFF',
                        windowBorder: '#10367D10',
                        tabIcon: '#10367D',
                        menuIcons: '#10367D',
                        textDark: '#1E293B',
                        textLight: '#FFFFFF',
                        link: '#10367D',
                        action: '#10367D',
                        inactiveTabIcon: '#10367D40',
                        error: '#F43F5E',
                        inProgress: '#10367D',
                        complete: '#10B981',
                        sourceBg: '#F8FAFC'
                    }
                }
            }}
            onSuccess={(result) => {
                if (onUploadSuccess && result.info) {
                    onUploadSuccess(result.info);
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
                        className="w-full h-40 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-[#10367D]/20 hover:bg-[#10367D]/5 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-[#10367D] group-hover:bg-white group-hover:scale-110 transition-all">
                            {resourceType === 'video' ? <FaVideo className="w-5 h-5" /> :
                                resourceType === 'image' ? <FaImages className="w-5 h-5" /> :
                                    <FaCloudUploadAlt className="w-6 h-6" />}
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-black text-slate-800 uppercase tracking-widest">{label}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Click or Drag & Drop</p>
                        </div>
                    </button>
                );
            }}
        </CldUploadWidget>
    );
};

export default MediaUpload;
