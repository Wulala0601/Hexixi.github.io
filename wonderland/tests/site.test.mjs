import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
const root = path.resolve('.')
test('required routes are present in the source map', () => {
  const content = fs.readFileSync(path.join(root, 'src/content.ts'), 'utf8')
  for (const slug of ['caviar','on-the-eve','anicat','please-lie-here']) assert.match(content, new RegExp(slug))
})
test('public contact data does not expose a residential address', () => {
  const source = fs.readFileSync(path.join(root, 'src/Pages.tsx'), 'utf8')
  assert.doesNotMatch(source, /street|district|residential|address/i)
  assert.match(source, /xixihe@ln\.hk/)
})
test('critical public assets exist', () => {
  for (const file of ['public/images/caviar-hero.webp','public/images/anicat-hero.webp','public/images/please-hero.webp','public/images/home-lace-background.jpg','public/images/user-iron-fence.png','public/images/heart-cursor.png','public/models/standing-catgirl.glb']) assert.ok(fs.existsSync(path.join(root,file)), file)
})
test('reference visual direction is wired into the app', () => {
  const theme = fs.readFileSync(path.join(root, 'src/reference-theme.css'), 'utf8')
  const scene = fs.readFileSync(path.join(root, 'src/Scene.tsx'), 'utf8')
  assert.match(theme, /home-lace-background\.jpg/)
  assert.match(theme, /#c5f6e5/)
  assert.match(theme, /#ffb3c6/)
  assert.match(scene, /standing-catgirl\.glb/)
})
