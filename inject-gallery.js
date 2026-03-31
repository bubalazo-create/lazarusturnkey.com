const fs = require('fs');
const path = require('path');

const dir = 'd:/PROJECT';

const categoryMap = {
    'service-electrical.html': { category: 'electrical', icon: 'fa-bolt', label: 'Electrical' },
    'service-plumbing.html': { category: 'plumbing', icon: 'fa-wrench', label: 'Plumbing' },
    'service-tiling.html': { category: 'tiling', icon: 'fa-th', label: 'Tiling' },
    'service-plastering.html': { category: 'plastering', icon: 'fa-paint-roller', label: 'Plastering' },
    'service-painting.html': { category: 'plastering', icon: 'fa-brush', label: 'Painting' },
    'service-gypsum.html': { category: 'gypsum', icon: 'fa-layer-group', label: 'Gypsum' },
    'service-screed.html': { category: 'screed', icon: 'fa-layer-group', label: 'Screeding' },
    'service-waterproofing.html': { category: 'waterproofing', icon: 'fa-tint', label: 'Waterproofing' },
    'service-stretched-ceiling.html': { category: 'ceiling', icon: 'fa-border-all', label: 'Ceiling' },
    'service-facade.html': { category: 'exterior', icon: 'fa-building', label: 'Facade' },
    'service-pool.html': { category: 'exterior', icon: 'fa-swimming-pool', label: 'Pools' },
    'service-bathroom.html': { category: 'plumbing', icon: 'fa-shower', label: 'Bathroom' }
};

let additionalGalleryItems = "";

fs.readdirSync(dir).forEach(file => {
    if (file.startsWith('service-') && file.endsWith('.html')) {
        const mapping = categoryMap[file];
        if (!mapping) return;

        const content = fs.readFileSync(path.join(dir, file), 'utf8');
        
        // Find everything inside <div class="service-gallery">...</div>
        const galleryMatch = content.match(/<div class="service-gallery">([\s\S]*?)<\/div>/);
        if (galleryMatch) {
            const innerHTML = galleryMatch[1];
            
            // Extract all <img ...>
            const imgRegex = /<img[^>]+src="([^"]+)"[^>]*alt="([^"]+)"[^>]*>/g;
            let match;
            while ((match = imgRegex.exec(innerHTML)) !== null) {
                const src = match[1];
                const alt = match[2];

                additionalGalleryItems += `
                <div class="gallery-item" data-category="${mapping.category}" data-label="${alt}">
                    <img src="${src}" alt="${alt}" loading="lazy">
                    <div class="gallery-overlay">
                        <div class="gallery-overlay-label"><i class="fas ${mapping.icon}"></i> ${mapping.label}</div>
                    </div>
                    <div class="zoom-icon"><i class="fas fa-expand-alt"></i></div>
                </div>`;
            }
        }
    }
});

const galleryPath = path.join(dir, 'gallery.html');
let galleryHTML = fs.readFileSync(galleryPath, 'utf8');

// Insert the new additional gallery items at the end of the <div class="gallery-grid" id="galleryGrid"> section
// specifically just before its closing </div> which is followed by <p class="no-results"
galleryHTML = galleryHTML.replace(/(<\/div>\s*<p class="no-results" id="noResults">)/, additionalGalleryItems + '\n            $1');

fs.writeFileSync(galleryPath, galleryHTML);
console.log('Successfully injected service pictures into gallery.html');
