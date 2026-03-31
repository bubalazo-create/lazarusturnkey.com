const fs = require('fs');
const path = require('path');

const dir = 'd:/PROJECT';

fs.readdir(dir, (err, files) => {
    if (err) throw err;

    files.filter(f => f.endsWith('.html')).forEach(file => {
        const filePath = path.join(dir, file);
        if (file === 'temp_index.html' || file === 'make-favicon.html') return; // skip temp files
        
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if FAQ is already in the nav menu nearby (just in case)
        if (content.includes('<a href="faq.html" class="nav-link">FAQ</a>')) {
            console.log(`Skipped ${file} - already has FAQ in nav`);
            return;
        }

        const target = '<li><a href="projects.html" class="nav-link">Projects</a></li>';
        const replacement = '<li><a href="projects.html" class="nav-link">Projects</a></li>\n                <li><a href="faq.html" class="nav-link">FAQ</a></li>';

        if (content.includes(target)) {
            content = content.replace(target, replacement);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${file}`);
        } else {
            console.log(`Target not found in ${file}`);
        }
    });
});
