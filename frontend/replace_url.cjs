const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const dirEntries = fs.readdirSync(pagesDir, { withFileTypes: true });

for (const dirent of dirEntries) {
    if (dirent.isFile() && dirent.name.endsWith('.jsx')) {
        const filePath = path.join(pagesDir, dirent.name);
        let content = fs.readFileSync(filePath, 'utf8');
        
        content = content.replace(/['"`]http:\/\/localhost:5000(.*?)['"`]/g, (match, pathPart) => {
            return `\`\${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}${pathPart}\``;
        });

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${dirent.name}`);
    }
}
