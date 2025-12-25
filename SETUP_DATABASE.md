# 🗄️ 数据库设置指南 - 完整步骤

按照以下步骤创建和配置 Cloudflare D1 数据库。

## 📋 步骤概览

1. ✅ 创建 D1 数据库
2. ✅ 初始化数据库表（执行迁移）
3. ✅ 绑定数据库到 Pages 项目
4. ✅ 重新部署项目

---

## 步骤 1：创建 D1 数据库

### 方法一：通过 Cloudflare Dashboard（推荐）

1. **登录 Cloudflare Dashboard**
   - 访问：https://dash.cloudflare.com/
   - 使用你的账号登录

2. **进入 D1 数据库页面**
   - 在左侧菜单中找到 **Workers & Pages**
   - 点击 **Workers & Pages**
   - 在顶部标签栏中，点击 **D1**

3. **创建新数据库**
   - 点击右上角的 **Create database** 按钮
   - 在弹出窗口中：
     - **Database name**: 输入 `biji-notes-db`
     - **Location**: 选择离你最近的区域（或使用默认值）
   - 点击 **Create**

4. **确认创建成功**
   - 你应该能在列表中看到 `biji-notes-db` 数据库
   - 点击数据库名称进入详情页面

### 方法二：使用命令行（可选）

如果你已经安装了 Wrangler：

```bash
# 安装 Wrangler（如果还没有）
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 创建数据库
wrangler d1 create biji-notes-db
```

---

## 步骤 2：初始化数据库表

数据库创建后，需要创建 `notes` 表。

### 方法一：通过 Cloudflare Dashboard（推荐）

1. **进入数据库页面**
   - 在 D1 列表中，点击 `biji-notes-db` 数据库

2. **打开 Migrations 标签**
   - 在数据库详情页面，点击顶部的 **Migrations** 标签

3. **上传迁移文件**
   - 点击 **Upload migration** 按钮
   - 在弹出窗口中，选择以下方式之一：
     - **方式 A**：上传 `schema.sql` 文件（项目根目录）
     - **方式 B**：直接粘贴 SQL 代码（见下方）

4. **如果选择方式 B，复制以下 SQL 代码**：

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

5. **应用迁移**
   - 粘贴 SQL 代码后，点击 **Apply migration**
   - 等待几秒钟，应该会显示成功消息

6. **验证表已创建**
   - 在数据库页面，点击 **Open Console** 按钮
   - 在控制台中执行：`SELECT * FROM notes;`
   - 应该返回空结果（没有错误说明表已创建）

### 方法二：使用命令行

```bash
# 执行迁移
wrangler d1 execute biji-notes-db --file=./schema.sql
```

---

## 步骤 3：绑定数据库到 Pages 项目

这是**最关键的一步**！数据库必须绑定到 Pages 项目才能使用。

1. **进入 Pages 项目设置**
   - 在 Cloudflare Dashboard 左侧菜单，点击 **Workers & Pages**
   - 点击 **Pages**
   - 找到并点击你的项目（`biji-notes` 或你设置的名字）

2. **打开 Functions 设置**
   - 在项目页面，点击左侧菜单的 **Settings**
   - 在设置页面，点击 **Functions** 标签

3. **添加数据库绑定**
   - 向下滚动到 **D1 database bindings** 部分
   - 点击 **Add binding** 按钮
   - 在弹出窗口中：
     - **Variable name**: 输入 `DB`（**必须完全一致，区分大小写**）
     - **D1 database**: 从下拉菜单选择 `biji-notes-db`
   - 点击 **Save**

4. **确认绑定成功**
   - 你应该能在列表中看到：
     - Variable name: `DB`
     - Database: `biji-notes-db`

---

## 步骤 4：重新部署项目

**重要**：绑定数据库后，必须重新部署项目才能生效！

### 方法一：通过 Dashboard 重新部署

1. **进入部署页面**
   - 在 Pages 项目页面，点击 **Deployments** 标签

2. **重新部署**
   - 找到最新的部署记录
   - 点击右侧的 **...** 菜单（三个点）
   - 选择 **Retry deployment**
   - 等待部署完成（通常 1-3 分钟）

### 方法二：推送代码触发部署

```bash
# 在项目目录中
git add .
git commit -m "配置数据库绑定"
git push origin main
```

Cloudflare 会自动检测到代码变更并重新部署。

---

## ✅ 验证设置

完成所有步骤后，验证是否成功：

1. **检查数据库绑定**
   - 在 Pages 项目 > Settings > Functions
   - 确认 `DB` 绑定存在

2. **测试应用**
   - 访问你的网站（例如：`https://biji-notes.pages.dev`）
   - 打开浏览器开发者工具（按 F12）
   - 点击"新建笔记"按钮
   - 查看控制台是否有错误
   - 如果成功，应该能创建笔记了！

---

## 🐛 常见问题

### Q: 在绑定数据库时，下拉菜单中没有 `biji-notes-db`

**A**: 说明数据库还没有创建，请先完成步骤 1。

### Q: 绑定后点击"新建笔记"还是报错

**A**: 检查以下几点：
1. 变量名是否完全一致：`DB`（区分大小写）
2. 是否已经重新部署（步骤 4）
3. 数据库表是否已创建（步骤 2）
4. 打开浏览器控制台查看具体错误信息

### Q: 如何确认数据库表已创建？

**A**: 
1. 在数据库页面，点击 **Open Console**
2. 执行：`SELECT name FROM sqlite_master WHERE type='table';`
3. 应该能看到 `notes` 表

### Q: 重新部署需要多长时间？

**A**: 通常 1-3 分钟，你可以在 Deployments 页面查看进度。

---

## 📝 快速检查清单

完成以下所有项目：

- [ ] D1 数据库 `biji-notes-db` 已创建
- [ ] 数据库表 `notes` 已创建（执行了迁移）
- [ ] 数据库已绑定到 Pages 项目
- [ ] 绑定变量名是 `DB`（完全一致，区分大小写）
- [ ] 项目已重新部署（绑定后）
- [ ] 测试创建笔记功能正常

---

## 🆘 需要帮助？

如果按照以上步骤仍然无法解决问题：

1. 查看浏览器控制台的错误信息
2. 查看 Cloudflare Dashboard 中的部署日志
3. 参考 `TROUBLESHOOTING.md` 获取更详细的故障排除指南

---

**提示**：完成步骤 1-4 后，你的应用就可以正常工作了！🎉

