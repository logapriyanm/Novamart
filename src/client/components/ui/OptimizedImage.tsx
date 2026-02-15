'use client';

import React, { useState, useEffect } from 'react';
import { CldImage, CldImageProps } from 'next-cloudinary';

interface OptimizedImageProps extends Omit<CldImageProps, 'src'> {
    src: string;
    alt: string;
    fallbackSrc?: string;
}

/**
 * A wrapper around CldImage that automatically applies quality and format optimizations.
 * Falls back to standard img if src is not a Cloudinary ID or if loading fails.
 */
const OptimizedImage: React.FC<OptimizedImageProps> = (props) => {
    const { src, fallbackSrc, ...rest } = props;
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [src]);

    if (hasError && fallbackSrc) {
        return (
            <img
                src={fallbackSrc}
                alt={props.alt}
                width={props.width as number}
                height={props.height as number}
                loading="lazy"
                className={props.className}
            />
        );
    }

    const isExternal = src?.startsWith('http') || src?.startsWith('https');
    const isLocal = src?.startsWith('/');

    if (isExternal || isLocal) {
        return (
            <img
                src={src}
                alt={props.alt}
                width={props.width as number}
                height={props.height as number}
                loading="lazy"
                className={props.className}
                onError={() => setHasError(true)}
            />
        );
    }

    return (
        <CldImage
            src={src}
            {...rest}
            loading="lazy"
            format="auto"
            quality="auto"
            crop="fill"
            gravity="auto"
            onError={() => setHasError(true)}
        />
    );
};

export default OptimizedImage;
