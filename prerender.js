import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8')
const { render } = await import('./dist/server/entry-server.js')

// Routes from App.tsx
const routesToPrerender = [
  '/',
  '/auth',
  '/onboarding',
  '/dashboard',
  '/study-pods',
  '/mentors',
  '/workshops',
  '/study-materials',
  '/events',
  '/about',
  '/opportunities',
  '/impact',
  '/contact',
  '/ai-tools',
  '/community',
  '/gamification',
  '/resources',
  '/leadership'
]

;(async () => {
  for (const url of routesToPrerender) {
    const appHtml = render(url);
    const html = template.replace(`<!--app-html-->`, appHtml)

    const filePath = `dist${url === '/' ? '/index' : url}.html`
    const absoluteFilePath = toAbsolute(filePath)
    
    // Ensure directory exists
    const dir = path.dirname(absoluteFilePath)
    fs.mkdirSync(dir, { recursive: true })
    
    fs.writeFileSync(absoluteFilePath, html)
    console.log('pre-rendered:', filePath)
  }
})()