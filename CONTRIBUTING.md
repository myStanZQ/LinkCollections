# Contributing to LinkCollection

感谢你有兴趣为 LinkCollection 做出贡献！我们欢迎所有形式的贡献。

## 📋 目录

- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [开发流程](#开发流程)
- [测试](#测试)
- [文档](#文档)

---

## 代码规范

### TypeScript/Vue

- 使用 TypeScript 类型定义
- 使用 Vue 3 Composition API
- 组件使用 `<script setup>` 语法

```vue
<template>
  <div>{{ message }}</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Hello World')
</script>

<style scoped></style>
```

### 命名规范

- **组件名**: PascalCase (例如 `BookmarkCard.vue`)
- **文件名**: kebab-case (例如 `bookmark-card.ts`)
- **变量/函数**: camelCase (例如 `fetchBookmarks`)
- **常量**: UPPER_SNAKE_CASE (例如 `MAX_BOOKMARKS`)
- **接口/类型**: PascalCase (例如 `interface Bookmark`)

### 代码格式化

在提交代码前，请运行以下命令：

```bash
# 格式化代码
npm run format

# 运行 linter
npm run lint

# 类型检查
npm run type-check
```

---

## 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

### 提交格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具变动
- `revert`: 回退提交

### 示例

```bash
feat(bookmark): add folder organization feature

- Implement folder-based bookmark organization
- Add create/edit/delete folder operations
- Update UI to show folder tree

Closes #123
```

---

## 开发流程

### 1. Fork 和 Clone

```bash
# Fork 仓库后
git clone https://github.com/your-username/LinkCollections.git
cd LinkCollections
```

### 2. 安装依赖

```bash
npm install
```

### 3. 创建分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 4. 开发和测试

```bash
# 启动开发服务器
npm run dev
```

### 5. 提交代码

```bash
git add .
git commit -m "feat(component): add new feature"
git push origin feature/your-feature-name
```

### 6. 创建 Pull Request

- 访问 GitCode 仓库
- 点击 "New Pull Request"
- 选择你的分支
- 填写 PR 模板
- 等待代码审查

---

## 测试

### 单元测试

```bash
# 运行所有测试
npm run test

# 运行特定测试
npm run test -- Bookmark
```

### E2E 测试

```bash
# 运行 E2E 测试
npm run test:e2e
```

### 测试覆盖率

```bash
# 生成测试覆盖率报告
npm run test:coverage
```

---

## 文档

### API 文档

所有公共 API 都应该有 JSDoc 注释：

```typescript
/**
 * Fetches all bookmarks from storage
 * @returns {Promise<Bookmark[]>} Array of bookmarks
 */
export async function fetchBookmarks(): Promise<Bookmark[]> {
  // implementation
}
```

### 组件文档

组件应该包含：

- Props 类型定义
- Emits 事件定义
- 使用示例

```vue
<script setup lang="ts">
/**
 * BookmarkCard component for displaying bookmark information
 *
 * @example
 * <BookmarkCard :bookmark="bookmark" @edit="handleEdit" />
 */

interface Props {
  bookmark: Bookmark
  searchQuery?: string
}

interface Emits {
  (e: 'edit', bookmark: Bookmark): void
}
</script>
```

---

## 🎉 感谢

再次感谢你的贡献！如果你有任何问题，请随时联系我们。
