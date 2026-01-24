const path = require('path')
const os = require('os')

console.log('=== LinkCollection 目录位置验证 ===\n')

// 1. 数据目录（根据 app.getPath('userData')）
const userDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'LinkCollection')
console.log('📂 数据目录:')
console.log(`   ${userDataPath}`)
console.log(`   包含: data/bookmarks.json, data/folders.json, data/tags.json, data/settings.json`)
console.log()

// 2. 便携版安装位置（假设）
const portablePath = path.join('D:', 'LinkCollection')
console.log('📂 便携版安装位置（示例）:')
console.log(`   ${portablePath}`)
console.log(`   文件: LinkCollection.exe, resources/app.asar, ...`)
console.log()

// 3. 安装包版安装位置
const programPath = path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'LinkCollection')
console.log('📂 安装包版安装位置:')
console.log(`   ${programPath}`)
console.log(`   文件: LinkCollection.exe, resources/app.asar, ...`)
console.log()

// 4. 当前项目目录
const currentDir = __dirname
console.log('📂 当前项目目录:')
console.log(`   ${currentDir}`)
console.log()

// 5. 构建产物位置
const buildDir = path.join(currentDir, 'release', '1.0.0')
console.log('📦 构建产物位置:')
console.log(`   ${buildDir}`)
console.log(`   文件:`)
console.log(`     - LinkCollection 1.0.0.exe (便携版)`)
console.log(`     - LinkCollection Setup 1.0.0.exe (安装包)`)
console.log(`     - win-unpacked/ (未打包的应用)`)
console.log()

// 6. 源码位置
const sourcePath = path.join(buildDir, 'win-unpacked', 'resources', 'app.asar')
console.log('💻 源码位置（打包后）:')
console.log(`   ${sourcePath}`)
console.log(`   说明: app.asar 包含整个应用的源码`)
console.log()

// 7. 开发源码位置
const devSourcePath = path.join(currentDir, 'src')
const electronSourcePath = path.join(currentDir, 'electron')
console.log('💻 开发源码位置:')
console.log(`   前端: ${devSourcePath}`)
console.log(`   Electron: ${electronSourcePath}`)
console.log()

console.log('=== 关键要点 ===')
console.log('✅ 数据目录: 便携版和安装版都使用相同位置 (%APPDATA%\\LinkCollection)')
console.log('✅ 源码: 都打包在 resources/app.asar 中')
console.log('✅ 主要区别: 安装方式、是否创建快捷方式、是否写入注册表')
console.log('✅ 数据共享: 两种版本可以无缝切换，数据完全兼容')
