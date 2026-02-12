/**
 * Remove console.log statements from client code for production
 * Keeps console.error for critical error tracking (can be replaced with Sentry later)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '..', 'src', 'client');

function removeConsoleLogs(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // Remove console.log statements (but keep console.error for error tracking)
        // Pattern: console.log(...) -> // console.log(...) (commented out)
        content = content.replace(/console\.log\([^)]*\);?/g, (match) => {
            // Don't remove if it's in a comment already
            if (match.trim().startsWith('//')) return match;
            return '// ' + match;
        });
        
        // Also remove console.debug and console.warn
        content = content.replace(/console\.(debug|warn)\([^)]*\);?/g, (match) => {
            if (match.trim().startsWith('//')) return match;
            return '// ' + match;
        });
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        return false;
    }
}

function walkDir(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            walkDir(filePath, fileList);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

console.log('Removing console.log statements from client code...\n');
const files = walkDir(srcDir);
let modified = 0;

files.forEach(file => {
    if (removeConsoleLogs(file)) {
        modified++;
        console.log(`Modified: ${path.relative(srcDir, file)}`);
    }
});

console.log(`\n✅ Processed ${files.length} files, modified ${modified} files.`);
console.log('Note: console.error statements kept for error tracking (replace with Sentry in production).');
