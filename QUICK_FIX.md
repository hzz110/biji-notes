# ⚡ 快速修复指南

## 问题：点击"新建笔记"没有反应

### 🎯 最可能的原因：数据库未绑定

这是最常见的问题！按照以下步骤快速修复：

### 步骤 1：检查数据库绑定（最重要！）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入你的 Pages 项目（`biji-notes`）
3. 点击左侧菜单的 **Settings**
4. 点击 **Functions** 标签
5. 向下滚动到 **D1 database bindings** 部分
6. **检查是否有绑定**：
   - ✅ 如果有绑定，确认变量名是 `DB`（必须完全一致）
   - ❌ 如果没有绑定，继续下一步

### 步骤 2：绑定数据库

如果没有绑定，立即添加：

1. 在 **D1 database bindings** 部分，点击 **Add binding**
2. **Variable name**: 输入 `DB`（必须完全一致，区分大小写）
3. **D1 database**: 从下拉菜单选择 `biji-notes-db`
4. 点击 **Save**

### 步骤 3：检查数据库是否存在

如果下拉菜单中没有 `biji-notes-db`：

1. 在 Cloudflare Dashboard 中，进入 **Workers & Pages** > **D1**
2. 点击 **Create database**
3. 名称：`biji-notes-db`
4. 点击 **Create**

### 步骤 4：初始化数据库表

1. 在数据库页面，点击 **Migrations** 标签
2. 点击 **Upload migration**
3. 复制以下 SQL 代码并粘贴：

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

4. 点击 **Apply migration**

### 步骤 5：重新部署

绑定数据库后，必须重新部署：

1. 在 Pages 项目页面
2. 点击 **Deployments** 标签
3. 找到最新的部署，点击右侧的 **...** 菜单
4. 选择 **Retry deployment**
5. 或者推送新的代码到 GitHub（会自动触发部署）

### 步骤 6：测试

等待部署完成后：

1. 刷新你的网站
2. 打开浏览器开发者工具（F12）
3. 点击"新建笔记"按钮
4. 查看控制台是否有错误

## ✅ 检查清单

完成以下所有项目后，问题应该就解决了：

- [ ] D1 数据库 `biji-notes-db` 已创建
- [ ] 数据库表 `notes` 已创建（执行了迁移）
- [ ] 数据库已绑定到 Pages 项目
- [ ] 绑定变量名是 `DB`（完全一致）
- [ ] 项目已重新部署（绑定后）
- [ ] 浏览器控制台没有错误

## 🔍 如果还是不行

### 查看详细错误信息

1. 打开浏览器开发者工具（按 F12）
2. 切换到 **Console** 标签
3. 点击"新建笔记"
4. 查看错误信息
5. 切换到 **Network** 标签
6. 找到 `/api/notes` 请求
7. 查看响应内容

### 常见错误信息

| 错误信息 | 解决方案 |
|---------|---------|
| "数据库未配置" | 绑定数据库（步骤 2） |
| "no such table: notes" | 执行迁移（步骤 4） |
| "404 Not Found" | 检查 Functions 文件是否存在 |
| "500 Internal Server Error" | 查看 Cloudflare 日志 |

### 需要更多帮助？

查看详细的故障排除指南：`TROUBLESHOOTING.md`

---

**提示**：99% 的问题都是因为数据库未绑定。确保完成步骤 2 和步骤 5（重新部署）！

