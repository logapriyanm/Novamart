/**
 * HTML Sanitization Utility
 * Removes potentially dangerous HTML/scripts while preserving safe formatting
 */

export function sanitizeHtml(html: string): string {
    if (!html) return '';
    
    // Remove script tags and event handlers
    let sanitized = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/data:text\/html/gi, '');
    
    // Allow safe HTML tags (p, div, span, h1-h6, strong, em, ul, ol, li, a, img, br, hr)
    // This is a basic sanitizer - for production, use DOMPurify or similar
    const allowedTags = ['p', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                         'strong', 'em', 'b', 'i', 'u', 'ul', 'ol', 'li', 'a', 'img', 
                         'br', 'hr', 'blockquote', 'pre', 'code', 'table', 'thead', 
                         'tbody', 'tr', 'td', 'th'];
    
    // For now, return sanitized (script tags removed)
    // In production, use a library like DOMPurify for comprehensive sanitization
    return sanitized;
}

/**
 * Sanitize text content (removes all HTML)
 */
export function sanitizeText(text: string): string {
    if (!text) return '';
    return text
        .replace(/<[^>]*>/g, '')
        .replace(/&[^;]+;/g, '')
        .trim();
}
