// Publish only the website, with real media bytes instead of Git LFS pointers.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const site = path.join(root, 'mint-catgirl');
const output = path.join(root, '_site');
const required = [
  'models/catgirl.glb', 'models/anime-girl.glb',
  'models/anime-catgirl-figure.glb', 'models/catgirl-04.glb',
  'models/ip-nav-fairy.glb', 'assets/bag/media/product.mp4',
  'assets/portfolio/undone/film.mp4',
  ...['forest', 'dancer', 'witch', 'apprentice', 'parade', 'world', 'final-film']
    .map(name => `assets/portfolio/caviar/${name}.mp4`)
];
for (const file of required) {
  if (!fs.existsSync(path.join(site, file))) throw new Error(`Missing media: ${file}`);
}
let bytes = 0, media = 0;
function check(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Unsupported symlink: ${file}`);
    if (entry.isDirectory()) { check(file); continue; }
    const size = fs.statSync(file).size;
    bytes += size;
    const fd = fs.openSync(file, 'r');
    const header = Buffer.alloc(160);
    try { fs.readSync(fd, header, 0, header.length, 0); } finally { fs.closeSync(fd); }
    if (header.toString('utf8').startsWith('version https://git-lfs.github.com/spec/v1')) {
      throw new Error(`LFS pointer was not downloaded: ${path.relative(root, file)}`);
    }
    if (/\.glb$/i.test(file)) {
      if (header.toString('ascii', 0, 4) !== 'glTF' || header.readUInt32LE(8) !== size) {
        throw new Error(`Invalid GLB: ${file}`);
      }
      media++;
    }
    if (/\.mp4$/i.test(file)) {
      if (header.toString('ascii', 4, 8) !== 'ftyp') throw new Error(`Invalid MP4: ${file}`);
      media++;
    }
  }
}
check(site);
if (bytes > 950 * 1024 * 1024) throw new Error('Website is approaching the 1 GB Pages limit. Move large media to external hosting first.');
// Overwrite known website files only; no source or unrelated directories are removed.
fs.mkdirSync(output, { recursive: true });
fs.cpSync(site, path.join(output, 'mint-catgirl'), { recursive: true });
fs.copyFileSync(path.join(root, 'index.html'), path.join(output, 'index.html'));
fs.writeFileSync(path.join(output, '.nojekyll'), '');
if (fs.existsSync(path.join(root, 'CNAME'))) fs.copyFileSync(path.join(root, 'CNAME'), path.join(output, 'CNAME'));
console.log(`Validated ${media} media files; prepared ${(bytes / 1024 / 1024).toFixed(1)} MB in _site.`);
