import fs from 'fs';
import path from 'path';

const sitemap0 = path.join('dist', 'sitemap-0.xml');
const sitemap = path.join('dist', 'sitemap.xml');
const sitemapIndex = path.join('dist', 'sitemap-index.xml');

try {
  if (fs.existsSync(sitemap0)) {
    fs.renameSync(sitemap0, sitemap);
    console.log(`Successfully renamed ${sitemap0} to ${sitemap}`);
  } else {
    console.log(`${sitemap0} does not exist, skipping rename.`);
  }
} catch (err) {
  console.error(`Error renaming sitemap: ${err.message}`);
}

try {
  if (fs.existsSync(sitemapIndex)) {
    fs.unlinkSync(sitemapIndex);
    console.log(`Successfully removed ${sitemapIndex}`);
  } else {
    console.log(`${sitemapIndex} does not exist, skipping removal.`);
  }
} catch (err) {
  console.error(`Error removing sitemap index: ${err.message}`);
}
