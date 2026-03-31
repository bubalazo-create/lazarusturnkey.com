const fs = require('fs');
const path = require('path');

const dir = 'd:/PROJECT';

fs.readdir(dir, (err, files) => {
    if (err) throw err;

    files.filter(f => f.endsWith('.html')).forEach(file => {
        const filePath = path.join(dir, file);
        if (file === 'temp_index.html' || file === 'make-favicon.html') return; // skip temp
        
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Hide the Projects link by commenting it out, or removing it
        const target = '<li><a href="projects.html" class="nav-link">Projects</a></li>';
        
        if (content.includes(target)) {
            // Replace with an empty string, or comment it out. Let's comment so we can restore later.
            content = content.replace(target, '<!-- ' + target + ' -->');
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Hid Projects link in ${file}`);
        } else {
            console.log(`Projects link not found in ${file}`);
        }
    });
});
