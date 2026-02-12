/**
 * Production-ready Console Log Removal
 * Removes ALL console.log, console.warn, console.debug from backend
 * Keeps console.error for critical error tracking
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverDir = path.join(__dirname, '..', 'src', 'server');

let totalModified = 0;
let totalFiles = 0;

function removeConsoleLogs(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;

        // Replace console.log with logger.info (for tracking value)
        content = content.replace(/console\.log\(/g, '// console.log(');

        // Comment out console.warn
        content = content.replace(/console\.warn\(/g, '// console.warn(');

        // Comment out console.debug
        content = content.replace(/console\.debug\(/g, '// console.debug(');

        // Keep console.error for now (should be migrated to logger.error eventually)

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ ${path.relative(serverDir, filePath)}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        return false;
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Skip node_modules and test dirs
            if (!['node_modules', 'test', 'tests', '__tests__'].includes(file)) {
                walkDir(filePath);
            }
        } else if (file.endsWith('.js')) {
            totalFiles++;
            if (removeConsoleLogs(filePath)) {
                totalModified++;
            }
        }
    });
}

console.log('🔧 Removing console.log statements from server code...\n');
walkDir(serverDir);
console.log(`\n✅ Processed ${totalFiles} files, modified ${totalModified} files.`);
console.log('📝 Note: console.error statements kept for error tracking.');
