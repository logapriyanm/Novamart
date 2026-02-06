const fs = require('fs');
const path = require('path');

const colors = {
    '#1243B2': '#10367D',
    '#A9CDE5': '#74B4DA',
    '#F8FAFC': '#EBEBEB'
};

function replaceInFile(filepath) {
    try {
        const content = fs.readFileSync(filepath, 'utf8');
        let newContent = content;
        for (const [oldColor, newColor] of Object.entries(colors)) {
            newContent = newContent.split(oldColor).join(newColor);
        }
        if (newContent !== content) {
            fs.writeFileSync(filepath, newContent, 'utf8');
            console.log(`Updated: ${filepath}`);
        }
    } catch (err) {
        // Silently skip binary files or permission issues
    }
}

function walk(dir) {
    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const filepath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (!['node_modules', '.next', '.git'].includes(entry.name)) {
                    walk(filepath);
                }
            } else if (/\.(tsx|ts|css|js|mjs)$/.test(entry.name)) {
                replaceInFile(filepath);
            }
        }
    } catch (err) {
        // console.error(`Walk error in ${dir}: ${err.message}`);
    }
}

walk('.');
console.log('Migration Completed.');
