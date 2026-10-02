import { copyFile, mkdir, writeFile } from 'node:fs/promises'
// GitHub Pages has no SPA rewrites. Give each public route a real entry file
// so direct links and refreshes work with BrowserRouter as well as navigation.
const routes = ['about', 'contact', 'shop', 'ip-models', 'bag-details', 'model-details',
  'work/caviar', 'work/on-the-eve', 'work/anicat', 'work/please-lie-here']
for (const route of routes) {
  await mkdir(`dist/${route}`, { recursive: true })
  await copyFile('dist/index.html', `dist/${route}/index.html`)
}
await copyFile('dist/index.html', 'dist/404.html')
await writeFile('dist/.nojekyll', '')
console.log(`Static entry files ready for ${routes.length} routes.`)
