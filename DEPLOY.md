# 🚀 部署指南

本指南将帮助你将在线笔记应用部署到 Cloudflare Pages。

## 📋 前置要求

1. GitHub 账号
2. Cloudflare 账号（免费注册：https://dash.cloudflare.com/sign-up）
3. Node.js 18+ （用于本地开发，可选）

## 🔧 部署步骤

### 第一步：准备 GitHub 仓库

1. **在 GitHub 上创建新仓库**
   - 访问 https://github.com/new
   - 仓库名称：`biji-notes`（或你喜欢的名称）
   - 设置为 Public 或 Private（都可以）
   - 不要初始化 README、.gitignore 或 license（我们已经有了）

2. **将代码推送到 GitHub**
   ```bash
   # 在项目目录中执行
   git init
   git add .
   git commit -m "Initial commit: 在线笔记应用"
   git branch -M main
   git remote add origin https://github.com/你的用户名/biji-notes.git
   git push -u origin main
   ```

### 第二步：在 Cloudflare Pages 中创建项目

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com/
   - 使用你的账号登录

2. **创建 Pages 项目**
   - 在左侧菜单中找到 **Workers & Pages**
   - 点击 **Create application**
   - 选择 **Pages** 标签
   - 点击 **Connect to Git**

3. **连接 GitHub 仓库**
   - 点击 **Connect GitHub** 按钮
   - 授权 Cloudflare 访问你的 GitHub 仓库
   - 选择你刚创建的 `biji-notes` 仓库
   - 点击 **Begin setup**

4. **配置构建设置**
   - **Project name**: `biji-notes`（或你喜欢的名称）
   - **Production branch**: `main`
   - **Framework preset**: `Vite`（或选择 None）
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`（留空或填写 `/`）

5. **创建 D1 数据库**
   - 在 Cloudflare Dashboard 中，进入 **Workers & Pages** > **D1**
   - 点击 **Create database**
   - 数据库名称：`biji-notes-db`
   - 点击 **Create**
   - 复制数据库的 **Database ID**（稍后需要）

6. **初始化数据库**
   - 在数据库页面，点击 **Migrations** 标签
   - 点击 **Upload migration**
   - 上传 `schema.sql` 文件（或复制其内容）
   - 或者使用 Wrangler CLI：
     ```bash
     # 安装 Wrangler（如果还没有）
     npm install -g wrangler
     
     # 登录 Cloudflare
     wrangler login
     
     # 执行迁移（需要先绑定数据库，见下一步）
     wrangler d1 execute biji-notes-db --file=./schema.sql
     ```

7. **绑定 D1 数据库到 Pages 项目**
   - 在 Pages 项目设置中，进入 **Settings** > **Functions**
   - 在 **D1 database bindings** 部分，点击 **Add binding**
   - **Variable name**: `DB`（必须与代码中的绑定名称一致）
   - **D1 database**: 选择 `biji-notes-db`
   - 点击 **Save**

8. **更新 wrangler.toml（可选，用于本地开发）**
   - 编辑 `.wrangler.toml` 文件
   - 将 `database_id` 替换为你复制的 Database ID
   - 注意：这个文件主要用于本地开发，生产环境通过 Dashboard 配置

9. **环境变量（可选）**
   - 目前不需要额外的环境变量
   - 点击 **Save and Deploy**

### 第三步：等待部署完成

- Cloudflare 会自动开始构建和部署
- 构建过程通常需要 1-3 分钟
- 部署完成后，你会看到一个预览 URL，格式类似：`https://biji-notes.pages.dev`

### 第四步：自定义域名（可选）

1. **添加自定义域名**
   - 在项目页面点击 **Custom domains**
   - 输入你的域名（例如：`notes.yourdomain.com`）
   - 按照提示添加 DNS 记录

2. **配置 HTTPS**
   - Cloudflare 会自动为你的域名配置 HTTPS
   - 通常几分钟内生效

## 🔄 自动部署

配置完成后，每次你向 `main` 分支推送代码时，Cloudflare Pages 会自动：
1. 检测到代码变更
2. 运行构建命令
3. 部署新版本

你可以在 Cloudflare Dashboard 中查看部署历史和状态。

## 📝 使用 GitHub Actions（高级选项）

如果你想使用 GitHub Actions 进行更精细的控制，可以：

1. **获取 Cloudflare API Token**
   - 访问 https://dash.cloudflare.com/profile/api-tokens
   - 点击 **Create Token**
   - 使用 **Edit Cloudflare Workers** 模板
   - 或者自定义权限：
     - Account: Cloudflare Pages: Edit
   - 复制生成的 Token

2. **获取 Account ID**
   - 在 Cloudflare Dashboard 右侧栏找到 **Account ID**

3. **在 GitHub 中添加 Secrets**
   - 进入你的 GitHub 仓库
   - 点击 **Settings** > **Secrets and variables** > **Actions**
   - 点击 **New repository secret**
   - 添加以下 Secrets：
     - Name: `CLOUDFLARE_API_TOKEN`，Value: 你的 API Token
     - Name: `CLOUDFLARE_ACCOUNT_ID`，Value: 你的 Account ID

4. **推送代码**
   ```bash
   git push origin main
   ```
   GitHub Actions 会自动触发部署。

## 🐛 故障排除

### 构建失败

1. **检查构建日志**
   - 在 Cloudflare Dashboard 中查看构建日志
   - 查找错误信息

2. **常见问题**
   - **依赖安装失败**：确保 `package.json` 中的依赖版本正确
   - **构建命令错误**：确认 `npm run build` 在本地可以正常运行
   - **输出目录错误**：确认 `dist` 目录存在且包含构建产物

### 页面无法访问

1. **检查部署状态**
   - 确认部署已完成且成功
   - 查看是否有错误信息

2. **清除缓存**
   - 在浏览器中按 `Ctrl+Shift+R`（Windows）或 `Cmd+Shift+R`（Mac）强制刷新

### 本地测试

在部署前，建议先在本地测试：

```bash
# 安装依赖
npm install

# 创建本地 D1 数据库（首次运行）
wrangler d1 create biji-notes-db --local

# 初始化本地数据库
npm run db:migrate:local

# 启动本地开发服务器（需要配置 wrangler.toml）
# 注意：本地开发需要 Wrangler 来运行 Functions
wrangler pages dev dist --d1=DB=biji-notes-db

# 或者只测试前端构建
npm run build
npm run preview
```

**注意**：本地开发 Cloudflare Pages Functions 需要使用 Wrangler。如果你只想测试前端，可以使用 `npm run preview`，但 API 功能将不可用。

## 📚 更多资源

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare D1 文档](https://developers.cloudflare.com/d1/)
- [Cloudflare Pages Functions 文档](https://developers.cloudflare.com/pages/platform/functions/)
- [Vite 文档](https://vitejs.dev/)
- [React 文档](https://react.dev/)

## 💡 提示

- Cloudflare Pages 提供免费的构建和部署服务
- 每个项目每月有 500 次构建限制（免费计划）
- Cloudflare D1 免费计划提供：
  - 5GB 存储空间
  - 每天 5 百万次读取
  - 每天 10 万次写入
- 部署速度通常很快，全球 CDN 加速
- 支持自动 HTTPS 和自定义域名
- 数据存储在 Cloudflare 的全球边缘网络中，访问速度快

---

如有问题，请查看 Cloudflare Pages 的官方文档或提交 Issue。

