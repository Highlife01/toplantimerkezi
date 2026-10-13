import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');
const distDir = path.resolve(__dirname, '../dist');

const sitemapFiles = fs.readdirSync(publicDir).filter(f => f.startsWith('sitemap-') && f.endsWith('.xml'));

let sitemapUrls = [];
for (const file of sitemapFiles) {
  const content = fs.readFileSync(path.join(publicDir, file), 'utf-8');
  const locs = content.match(/<loc>(.*?)<\/loc>/g) || [];
  locs.forEach(l => {
    const url = l.replace(/<\/?loc>/g, '');
    sitemapUrls.push({ file, url });
  });
}

console.log('Total sitemap URLs:', sitemapUrls.length);

let missing = [];
let canonicalMatches = [];
let canonicalMismatches = [];

for (const item of sitemapUrls) {
  const urlObj = new URL(item.url);
  const pathname = urlObj.pathname;
  let cleanPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  if (cleanPath.endsWith('/')) cleanPath = cleanPath.slice(0, -1);

  let htmlPath = '';
  if (cleanPath === '') {
    htmlPath = path.join(distDir, 'index.html');
  } else {
    const p1 = path.join(distDir, cleanPath, 'index.html');
    const p2 = path.join(distDir, cleanPath + '.html');
    if (fs.existsSync(p1)) htmlPath = p1;
    else if (fs.existsSync(p2)) htmlPath = p2;
  }

  if (!htmlPath || !fs.existsSync(htmlPath)) {
    missing.push({ file: item.file, url: item.url, pathname });
  } else {
    const html = fs.readFileSync(htmlPath, 'utf-8');
    const match = html.match(/<link rel=["']canonical["'] href=["'](.*?)["']/);
    const canonical = match ? match[1] : null;
    if (canonical === item.url || (cleanPath === '' && (canonical === item.url || canonical === item.url + '/'))) {
      canonicalMatches.push(item.url);
    } else {
      canonicalMismatches.push({ url: item.url, canonical, htmlPath });
    }
  }
}

console.log('Missing prerendered files count:', missing.length);
console.log('Canonical matches count:', canonicalMatches.length);
console.log('Canonical mismatches count:', canonicalMismatches.length);
console.log('\nMissing URLs breakdown by sitemap file:');
const byFile = {};
missing.forEach(m => {
  byFile[m.file] = (byFile[m.file] || 0) + 1;
});
console.log(JSON.stringify(byFile, null, 2));

console.log('\nSample missing URLs (first 25):');
missing.slice(0, 25).forEach(m => console.log(`[${m.file}] ${m.pathname}`));
