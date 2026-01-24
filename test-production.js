const { app, BrowserWindow } = require('electron')
const path = require('path')

// Test production mode detection
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('app.isPackaged:', app.isPackaged)

const isDevelopment = process.env.NODE_ENV === 'development' || !app.isPackaged
console.log('isDevelopment:', isDevelopment)

// Test file paths
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('__dirname:', __dirname)
console.log('preload path:', path.join(__dirname, 'preload', 'preload.js'))
console.log('html path:', path.join(__dirname, '../dist/index.html'))

// Check if files exist
const fs = require('fs')
const preloadPath = path.join(__dirname, 'preload', 'preload.js')
const htmlPath = path.join(__dirname, '../dist/index.html')

console.log('preload exists:', fs.existsSync(preloadPath))
console.log('html exists:', fs.existsSync(htmlPath))

console.log('\nTest completed!')
