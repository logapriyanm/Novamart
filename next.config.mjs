/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            }
        ],
    },
    // Suppress the middleware deprecation warning if possible, 
    // though Next.js 15+ prefers 'middleware.ts/js' in 'src' or root.
    // The warning said "middleware" file convention is deprecated, use "proxy" instead.
    // This usually refers to the 'middleware.js' file in the root/src.
    // Suppress font preload warnings (they're often false positives)
    onDemandEntries: {
        maxInactiveAge: 25 * 1000,
        pagesBufferLength: 2,
    },
};

export default nextConfig;
