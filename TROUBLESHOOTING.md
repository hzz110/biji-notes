# 🔧 故障排除指南

## 问题：点击"新建笔记"没有反应或显示错误

### 可能的原因和解决方案

#### 1. 数据库未绑定 ⚠️ 最常见问题

**症状**：
- 点击"新建笔记"显示错误
- 浏览器控制台显示 500 错误
- 错误信息包含"数据库未配置"

**解决方案**：

1. **检查数据库绑定**
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 进入你的 Pages 项目
   - 点击 **Settings** > **Functions**
   - 在 **D1 database bindings** 部分，确认是否有绑定
   - 如果没有，点击 **Add binding**：
     - **Variable name**: `DB`（必须完全一致，区分大小写）
     - **D1 database**: 选择 `biji-notes-db`
     - 点击 **Save**

2. **重新部署**
   - 绑定数据库后，需要重新部署项目
   - 在 Pages 项目页面，点击 **Retry deployment** 或推送新的代码

#### 2. 数据库表未创建

**症状**：
- 错误信息包含"no such table: notes"
- 数据库操作失败

**解决方案**：

1. **检查数据库是否存在**
   - 在 Cloudflare Dashboard 中，进入 **Workers & Pages** > **D1**
   - 确认 `biji-notes-db` 数据库存在

2. **执行数据库迁移**
   - 在数据库页面，点击 **Migrations** 标签
   - 点击 **Upload migration**
   - 上传 `schema.sql` 文件（项目根目录）
   - 或者复制以下 SQL 并粘贴：
     ```sql
     CREATE TABLE IF NOT EXISTS notes (
       id TEXT PRIMARY KEY,
       title TEXT NOT NULL DEFAULT '新笔记',
       content TEXT NOT NULL DEFAULT '',
       created_at TEXT NOT NULL,
       updated_at TEXT NOT NULL
     );
     
     CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);
     CREATE INDEX IF NOT EXISTS idx_notes_title ON notes(title);
     ```
   - 点击 **Apply migration**

3. **使用 Wrangler CLI（推荐）**
   ```bash
   # 安装 Wrangler
   npm install -g wrangler
   
   # 登录 Cloudflare
   wrangler login
   
   # 执行迁移
   wrangler d1 execute biji-notes-db --file=./schema.sql
   ```

#### 3. API 路由未正确部署

**症状**：
- 404 错误
- 网络请求失败
- 控制台显示 "Failed to fetch"

**解决方案**：

1. **检查 Functions 目录结构**
   - 确认 `functions/api/notes.ts` 文件存在
   - 确认文件结构正确：
     ```
     functions/
       api/
         notes.ts
         notes/
           [id].ts
     ```

2. **检查部署日志**
   - 在 Cloudflare Dashboard 中查看部署日志
   - 确认 Functions 已正确部署
   - 查找任何错误信息

3. **重新部署**
   - 推送新的代码到 GitHub
   - 或手动触发重新部署

#### 4. CORS 问题

**症状**：
- 浏览器控制台显示 CORS 错误
- 预检请求失败

**解决方案**：

- 代码中已包含 CORS 头，通常不需要额外配置
- 如果仍有问题，检查 Functions 代码中的 CORS 设置

#### 5. 网络连接问题

**症状**：
- 请求超时
- 网络错误

**解决方案**：

- 检查网络连接
- 尝试刷新页面
- 检查 Cloudflare 服务状态

## 🔍 调试步骤

### 步骤 1：检查浏览器控制台

1. 打开浏览器开发者工具（F12）
2. 切换到 **Console** 标签
3. 点击"新建笔记"按钮
4. 查看错误信息

### 步骤 2：检查网络请求

1. 在开发者工具中切换到 **Network** 标签
2. 点击"新建笔记"按钮
3. 查找 `/api/notes` 请求
4. 查看请求状态和响应内容

### 步骤 3：检查 Cloudflare Dashboard

1. 登录 Cloudflare Dashboard
2. 进入 Pages 项目
3. 查看 **Functions** 标签，确认 Functions 已部署
4. 查看 **Deployments** 标签，确认最新部署成功

### 步骤 4：检查数据库

1. 在 Cloudflare Dashboard 中，进入 **Workers & Pages** > **D1**
2. 选择 `biji-notes-db` 数据库
3. 点击 **Open Console**
4. 执行查询：`SELECT * FROM notes;`
5. 如果表不存在，执行迁移

## 📝 快速检查清单

- [ ] D1 数据库已创建（名称：`biji-notes-db`）
- [ ] 数据库表已创建（执行了迁移）
- [ ] 数据库已绑定到 Pages 项目（变量名：`DB`）
- [ ] Functions 文件在正确的位置（`functions/api/notes.ts`）
- [ ] 项目已重新部署（绑定数据库后）
- [ ] 浏览器控制台没有错误
- [ ] 网络请求返回正确的状态码

## 🆘 仍然无法解决？

如果按照以上步骤仍然无法解决问题：

1. **查看详细错误信息**
   - 打开浏览器控制台
   - 复制完整的错误信息
   - 包括堆栈跟踪

2. **检查 Cloudflare 日志**
   - 在 Pages 项目页面，查看 **Logs** 标签
   - 查找相关的错误日志

3. **验证本地开发**
   - 在本地使用 Wrangler 测试
   - 确认本地环境正常工作

4. **提交 Issue**
   - 包含错误信息
   - 包含部署配置截图
   - 包含浏览器控制台截图

## 💡 常见错误信息

| 错误信息 | 可能原因 | 解决方案 |
|---------|---------|---------|
| "数据库未配置" | 数据库未绑定 | 在 Pages 设置中绑定数据库 |
| "no such table: notes" | 表未创建 | 执行数据库迁移 |
| "404 Not Found" | API 路由不存在 | 检查 Functions 文件结构 |
| "500 Internal Server Error" | 服务器错误 | 查看 Cloudflare 日志 |
| "Failed to fetch" | 网络问题 | 检查网络连接 |

---

希望这些信息能帮助你解决问题！如果还有疑问，请查看 [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/) 或 [D1 文档](https://developers.cloudflare.com/d1/)。

