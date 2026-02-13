'use client';

import React from 'react';
import { CldImage, CldImageProps } from 'next-cloudinary';

interface OptimizedImageProps extends Omit<CldImageProps, 'src'> {
    src: string;
    alt: string;
}

/**
 * A wrapper around CldImage that automatically applies quality and format optimizations.
 * Falls back to standard img if src is not a Cloudinary ID (optional logic can be added).
 */
const OptimizedImage: React.FC<OptimizedImageProps> = (props) => {
    const isExternal = props.src?.startsWith('http') || props.src?.startsWith('https');
    const isLocal = props.src?.startsWith('/');

    if (isExternal || isLocal) {
        return (
            <img
                src={props.src}
                alt={props.alt}
                width={props.width as number}
                height={props.height as number}
                loading="lazy"
                className={props.className}
            />
        );
    }

    return (
        <CldImage
            {...props}
            loading="lazy"
            format="auto"
            quality="auto"
            crop="fill"
            gravity="auto"
        />
    );
};

export default OptimizedImage;
