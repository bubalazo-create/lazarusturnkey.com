const fs = require('fs');
const path = require('path');

const dir = 'd:/PROJECT';

fs.readdir(dir, (err, files) => {
    if (err) throw err;

    files.filter(f => f.endsWith('.html')).forEach(file => {
        const filePath = path.join(dir, file);
        if (file === 'temp_index.html' || file === 'make-favicon.html') return;
        
        let content = fs.readFileSync(filePath, 'utf8');

        // Regex to match the construction banner block.
        // It matches: <!-- Under Construction Banner --> down to the first closing </div>
        const bannerRegex = /<!--\s*Under Construction Banner\s*-->[\s\S]*?<div class="construction-banner" id="constructionBanner">[\s\S]*?<\/div>/i;

        if (bannerRegex.test(content)) {
            content = content.replace(bannerRegex, '');
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Removed banner from ${file}`);
        } else {
            console.log(`No banner found in ${file}`);
        }
    });
});
