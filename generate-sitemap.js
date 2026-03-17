const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://www.lazarusturnkey.com';
const FOLDER = __dirname;
const IGNORE_FILES = ['temp_index.html'];

function generateSitemap() {
    try {
        const files = fs.readdirSync(FOLDER);
        
        const htmlFiles = files.filter(file => {
            return path.extname(file) === '.html' && !IGNORE_FILES.includes(file);
        });

        let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        htmlFiles.forEach(file => {
            let loc = `${DOMAIN}/${file}`;
            let priority = 0.6; // default for most pages

            if (file === 'index.html') {
                loc = `${DOMAIN}/`;
                priority = 1.0;
            } else if (file === 'services.html' || file === 'gallery.html') {
                priority = 0.8;
            }

            sitemapContent += `  <url>\n    <loc>${loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${priority.toFixed(1)}</priority>\n  </url>\n`;
        });

        sitemapContent += `</urlset>\n`;

        fs.writeFileSync(path.join(FOLDER, 'sitemap.xml'), sitemapContent);
        console.log(`Successfully generated sitemap.xml with ${htmlFiles.length} pages.`);
    } catch (error) {
        console.error('Error generating sitemap:', error);
    }
}

generateSitemap();
