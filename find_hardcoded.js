const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/Camilo/Desktop/ton618-bot/src';
const keys = ['content', 'title', 'description', 'label', 'footer', 'text'];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.js')) {
            const content = fs.readFileSync(file, 'utf8');
            const lines = content.split('\n');
            lines.forEach((line, index) => {
                keys.forEach(key => {
                    // Look for key: "something" where something is not just a variable or i18n call
                    const regex = new RegExp(`${key}:\\s*["']([^"{][^"']+)["']`, 'i');
                    const match = line.match(regex);
                    if (match && !line.includes('t(') && !line.includes('require(')) {
                        results.push(`${file}:${index + 1}: ${line.trim()}`);
                    }
                });
            });
        }
    });
    return results;
}

const hardcoded = walk(srcDir);
console.log(hardcoded.join('\n'));
