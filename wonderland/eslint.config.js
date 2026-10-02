import js from '@eslint/js'
import ts from 'typescript-eslint'
import globals from 'globals'
import hooks from 'eslint-plugin-react-hooks'
export default ts.config(
  { ignores: ['dist', 'node_modules', 'tmp', 'public', '.vercel'] },
  js.configs.recommended, ...ts.configs.recommended,
  { files: ['src/**/*.{ts,tsx}'], languageOptions: { globals: globals.browser }, plugins: { 'react-hooks': hooks }, rules: { ...hooks.configs.recommended.rules } },
  { files: ['**/*.mjs', '*.js'], languageOptions: { globals: globals.node } },
)
