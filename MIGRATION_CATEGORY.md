# 📝 分类功能数据库迁移指南

新增的分类功能需要在数据库中添加新字段。请按照以下步骤执行迁移。

## 🚀 迁移步骤

### 方法一：通过 Cloudflare Dashboard（推荐）

1. **登录 Cloudflare Dashboard**
   - 访问：https://dash.cloudflare.com/
   - 进入 **Workers & Pages** > **D1**

2. **选择数据库**
   - 点击 `biji-notes-db` 数据库

3. **执行迁移**
   - 点击 **"控制台"**（Console）标签
   - 在控制台中执行以下 SQL：

```sql
ALTER TABLE notes ADD COLUMN category TEXT DEFAULT '默认';
ALTER TABLE notes ADD COLUMN category_color TEXT DEFAULT '#2196f3';
CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category);
```

4. **验证迁移**
   - 执行以下查询验证字段已添加：
   ```sql
   SELECT sql FROM sqlite_master WHERE type='table' AND name='notes';
   ```

### 方法二：使用 Wrangler CLI

```bash
# 执行迁移
wrangler d1 execute biji-notes-db --file=./migrations/0002_add_category.sql
```

## ✅ 验证

迁移完成后，可以执行以下查询验证：

```sql
SELECT id, title, category, category_color FROM notes LIMIT 1;
```

如果查询成功且返回了 `category` 和 `category_color` 字段，说明迁移成功。

## 📋 迁移内容

本次迁移添加了以下内容：

1. **category 字段**：存储笔记分类名称（默认值：'默认'）
2. **category_color 字段**：存储分类颜色（默认值：'#2196f3'）
3. **分类索引**：提高按分类查询的性能

## ⚠️ 注意事项

- 现有笔记会自动获得默认分类（'默认'）和默认颜色（'#2196f3'）
- 迁移不会影响现有数据
- 如果字段已存在，SQL 会报错，可以忽略（说明已经迁移过了）

## 🐛 故障排除

### 如果字段已存在

如果执行迁移时提示字段已存在，说明已经迁移过了，可以跳过。

### 如果迁移失败

1. 检查数据库连接
2. 查看错误信息
3. 确认表结构是否正确

---

完成迁移后，重新部署应用即可使用分类功能！

