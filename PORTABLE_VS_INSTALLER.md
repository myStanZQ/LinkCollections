# 便携版 vs 安装包版本说明

## 📦 两种版本概述

根据你的 `package.json` 配置，构建会生成两种版本：

1. **LinkCollection 1.0.0.exe** - 便携版（Portables）
2. **LinkCollection Setup 1.0.0.exe** - 安装包版本（NSIS Installer）

---

## 🔍 版本区别

### 1. 便携版 (LinkCollection 1.0.0.exe)

**特点：**

- ✅ 无需安装，解压即用
- ✅ 不写入注册表
- ✅ 可以放在U盘、移动硬盘等便携设备上
- ✅ 不创建桌面快捷方式和开始菜单项
- ✅ 适合临时使用或测试

**目录结构（解压后）：**

```
LinkCollection/
├── LinkCollection.exe          # 主程序
├── chrome_100_percent.pak      # Chrome资源包
├── chrome_200_percent.pak
├── d3dcompiler_47.dll         # DirectX编译器
├── ffmpeg.dll                  # 媒体编解码库
├── icudtl.dat                  # ICU数据文件
├── libEGL.dll                  # OpenGL库
├── libGLESv2.dll               # OpenGL ES库
├── resources.pak               # 资源包
├── snapshot_blob.bin           # V8快照
├── v8_context_snapshot.bin    # V8上下文快照
├── vk_swiftshader.dll          # Vulkan软件渲染器
├── vulkan-1.dll                # Vulkan API
├── LICENSE.electron.txt
├── LICENSES.chromium.html
├── locales/                    # 多语言支持
└── resources/                  # 应用资源
    ├── app.asar               # 应用源码打包文件（~127MB）
    └── elevate.exe            # 权限提升工具
```

### 2. 安装包版本 (LinkCollection Setup 1.0.0.exe)

**特点：**

- ✅ 标准安装程序
- ✅ 可自定义安装路径
- ✅ 自动创建桌面快捷方式
- ✅ 自动添加到开始菜单
- ✅ 适合长期使用和正式部署

**安装后默认位置：**

```
C:\Users\<用户名>\AppData\Local\Programs\LinkCollection\
```

**目录结构（安装后）：**

```
C:\Users\<用户名>\AppData\Local\Programs\LinkCollection\
├── LinkCollection.exe
├── [同便携版的其他文件]
└── resources/
    ├── app.asar
    └── elevate.exe
```

---

## 💾 数据目录位置（相同）

**重要：无论使用哪种版本，数据存储位置都相同！**

根据 `electron/utils/storage.ts` 的配置：

```typescript
const DATA_DIR = path.join(app.getPath('userData'), 'data')
```

**Windows 上的数据目录：**

```
C:\Users\<用户名>\AppData\Roaming\LinkCollection\
├── data/
│   ├── bookmarks.json       # 书签数据
│   ├── folders.json         # 文件夹数据
│   ├── tags.json            # 标签数据
│   └── settings.json        # 设置数据
└── [其他配置文件]
```

**为什么数据位置相同？**

- 使用 `app.getPath('userData')` 获取系统标准的应用数据目录
- 便携版和安装版运行的都是同一个 Electron 应用
- 数据存储遵循跨平台标准，便于数据备份和迁移

---

## 📂 源码目录位置

### 应用源码（打包后）

**位置：**

```
resources/app.asar
```

**说明：**

- `app.asar` 是 Electron 的归档格式
- 包含了整个应用的源码和资源
- 文件大小约 127MB
- 内容包括：
  - `dist/` - Vue 前端构建产物
  - `dist-electron/` - Electron 主进程代码
  - `package.json` - 应用配置
  - `node_modules/` - 依赖库

**查看 asar 内容（开发调试用）：**

```bash
# 安装 asar 工具
npm install -g asar

# 列出 asar 内容
asar list resources/app.asar

# 解压 asar（仅用于调试）
asar extract resources/app.asar extracted-app
```

---

## 🔄 数据迁移

### 从便携版迁移到安装版

1. 复制便携版的整个文件夹
2. 运行安装包安装应用
3. 数据会自动共享（因为存储位置相同）
4. 删除便携版文件夹

### 从安装版迁移到便携版

1. 关闭运行中的应用
2. 将安装后的 `LinkCollection` 文件夹复制到新位置
3. 直接运行 `LinkCollection.exe`
4. 可选：卸载原安装版本

### 备份数据

```bash
# 备份整个数据目录
# 路径: C:\Users\<用户名>\AppData\Roaming\LinkCollection
```

---

## 📊 两种版本对比表

| 特性         | 便携版                          | 安装包版                                                |
| ------------ | ------------------------------- | ------------------------------------------------------- |
| 安装方式     | 解压或直接运行exe               | 通过安装向导安装                                        |
| 安装位置     | 任意位置（如D:\LinkCollection） | C:\Users\<用户名>\AppData\Local\Programs\LinkCollection |
| 数据位置     | 相同（AppData\Roaming）         | 相同（AppData\Roaming）                                 |
| 注册表       | 不写入                          | 写入（用于卸载）                                        |
| 桌面快捷方式 | 需手动创建                      | 自动创建                                                |
| 开始菜单     | 不添加                          | 自动添加                                                |
| 卸载方式     | 直接删除文件夹                  | 控制面板卸载                                            |
| 适合场景     | 临时使用、测试、U盘便携         | 长期使用、正式部署                                      |
| 文件大小     | ~95MB（包含运行时）             | ~95MB（安装包）                                         |
| 磁盘占用     | ~180MB（解压后）                | ~180MB（安装后）                                        |

---

## 💡 使用建议

### 推荐使用便携版的情况：

- 在公司或学校电脑上临时使用
- 需要在多台电脑间切换使用
- 希望彻底清除应用痕迹
- 测试应用新版本
- 放在U盘或移动硬盘上使用

### 推荐使用安装包版的情况：

- 个人电脑长期使用
- 需要自动更新功能
- 希望有标准的桌面快捷方式
- 通过开始菜单启动应用
- 企业内统一部署

---

## 🔧 调试技巧

### 查看实际运行的数据目录

在应用中打开 DevTools（如果启用），在控制台执行：

```javascript
require('electron').remote.app.getPath('userData')
```

### 查看 app.asar 内容

```bash
cd release/1.0.0/win-unpacked
npx asar list resources/app.asar
```

### 验证数据目录

```bash
dir "%APPDATA%\LinkCollection\data"
```

---

## 📌 总结

1. **便携版和安装包版的运行时结构完全相同**，都是 `win-unpacked` 目录的内容
2. **数据存储位置完全相同**，都在 `%APPDATA%\LinkCollection\`
3. **源码都在 `resources/app.asar` 中**，这是打包后的应用代码
4. **主要区别**：安装方式、快捷方式创建、是否写入注册表
5. **数据可以无缝迁移**，因为两种版本共享相同的数据目录

选择哪个版本取决于你的使用场景，两者功能完全相同！
