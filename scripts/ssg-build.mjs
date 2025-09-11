import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

function run(cmd) {
  console.log(`\n$ ${cmd}`)
  execSync(cmd, { stdio: 'inherit', cwd: projectRoot })
}

// 1) Build client
run('npx vite build')

// 2) Build server bundle for SSG
run('npx vite build --ssr src/entry-server.tsx --outDir dist/server')

// 3) Prerender static HTML
run('node prerender.js')

console.log('\nSSG build complete. You can preview with: npx vite preview')
