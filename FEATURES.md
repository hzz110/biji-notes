# 🎯 功能说明

## 已实现的功能

### 1. 密码保护 🔒

- **功能**：打开应用时需要输入密码
- **默认密码**：`nmghzz110`
- **实现方式**：使用 sessionStorage 存储认证状态
- **位置**：`src/components/PasswordProtection.tsx`

### 2. 富文本编辑器 ✏️

- **功能**：支持格式化文本编辑
- **特性**：
  - 标题（H1, H2, H3）
  - 粗体、斜体、下划线、删除线
  - 有序列表、无序列表
  - 文字颜色、背景色
  - 文本对齐
  - 链接
  - 图片插入
- **使用的库**：React Quill
- **位置**：`src/components/RichTextEditor.tsx`

### 3. 图片上传 🖼️

- **功能**：在编辑器中插入图片
- **存储**：Cloudflare R2 对象存储
- **限制**：单张图片最大 5MB
- **支持格式**：所有图片格式（jpg, png, gif, webp 等）
- **API**：
  - 上传：`POST /api/upload`
  - 访问：`GET /api/images/[path]`
- **位置**：
  - 上传 API：`functions/api/upload.ts`
  - 图片代理：`functions/api/images/[path].ts`

### 4. URL 自动链接 🔗

- **功能**：输入 URL 时自动转换为可点击的超链接
- **实现方式**：在富文本编辑器中自动检测 URL 并添加链接格式
- **位置**：`src/components/RichTextEditor.tsx`

### 5. 数据存储 💾

- **数据库**：Cloudflare D1（SQLite）
- **存储内容**：笔记标题和内容（HTML 格式）
- **API**：
  - 获取笔记：`GET /api/notes`
  - 创建笔记：`POST /api/notes`
  - 更新笔记：`PUT /api/notes/[id]`
  - 删除笔记：`DELETE /api/notes/[id]`

## 配置要求

### 必需的配置

1. **D1 数据库**
   - 创建数据库：`biji-notes-db`
   - 绑定到 Pages 项目：变量名 `DB`
   - 参考：`SETUP_DATABASE.md`

2. **R2 对象存储**（用于图片上传）
   - 创建存储桶：`biji-images`
   - 绑定到 Pages 项目：变量名 `R2_BUCKET`
   - 参考：`SETUP_R2.md`

### 可选配置

- **自定义域名**：为 R2 存储桶配置自定义域名（推荐）
- **密码修改**：在 `src/components/PasswordProtection.tsx` 中修改 `CORRECT_PASSWORD`

## 使用说明

### 修改密码

编辑 `src/components/PasswordProtection.tsx`：

```typescript
const CORRECT_PASSWORD = 'nmghzz110'; // 修改为你想要的密码
```

### 修改图片大小限制

编辑 `functions/api/upload.ts`：

```typescript
if (file.size > 5 * 1024 * 1024) {
  // 修改 5 为你想要的大小（MB）
}
```

### 自定义图片 URL

如果配置了 R2 自定义域名，编辑 `functions/api/upload.ts`：

```typescript
// 使用自定义域名
const customDomain = 'images.yourdomain.com';
const publicUrl = `https://${customDomain}/${fileName}`;
```

## 技术栈

- **前端框架**：React 18 + TypeScript
- **富文本编辑器**：React Quill
- **构建工具**：Vite
- **后端**：Cloudflare Pages Functions
- **数据库**：Cloudflare D1 (SQLite)
- **对象存储**：Cloudflare R2

## 文件结构

```
src/
├── components/
│   ├── PasswordProtection.tsx    # 密码保护组件
│   ├── RichTextEditor.tsx        # 富文本编辑器
│   ├── NoteEditor.tsx            # 笔记编辑器（使用富文本编辑器）
│   └── NoteList.tsx              # 笔记列表
├── services/
│   └── api.ts                    # API 服务
└── App.tsx                       # 主应用组件

functions/
├── api/
│   ├── notes.ts                  # 笔记 CRUD API
│   ├── notes/[id].ts            # 单个笔记操作
│   ├── upload.ts                 # 图片上传 API
│   └── images/[path].ts          # 图片代理访问
```

## 下一步计划

- [ ] 支持 Markdown 格式
- [ ] 支持代码块高亮
- [ ] 支持表格编辑
- [ ] 支持文件附件
- [ ] 支持笔记分类/标签
- [ ] 支持导出笔记（PDF、Markdown）

---

如有问题或建议，请提交 Issue！

