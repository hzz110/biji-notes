# 📝 分类表数据库迁移指南

新增的分类功能需要在数据库中创建分类表。请按照以下步骤执行迁移。

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
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#2196f3',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

INSERT OR IGNORE INTO categories (id, name, color, created_at, updated_at) 
VALUES ('default', '默认', '#2196f3', datetime('now'), datetime('now'));
```

4. **验证迁移**
   - 执行以下查询验证表已创建：
   ```sql
   SELECT * FROM categories;
   ```
   - 应该能看到"默认"分类

### 方法二：使用 Wrangler CLI

```bash
# 执行迁移
wrangler d1 execute biji-notes-db --file=./migrations/0003_add_categories_table.sql
```

## ✅ 验证

迁移完成后，可以执行以下查询验证：

```sql
SELECT * FROM categories;
```

如果查询成功且返回了"默认"分类，说明迁移成功。

## 📋 迁移内容

本次迁移创建了：

1. **categories 表**：存储分类信息
   - `id`: 分类唯一标识
   - `name`: 分类名称（唯一）
   - `color`: 分类颜色
   - `created_at`: 创建时间
   - `updated_at`: 更新时间

2. **分类索引**：提高查询性能

3. **默认分类**：自动插入"默认"分类

## ⚠️ 注意事项

- 分类名称必须唯一
- "默认"分类会自动创建
- 删除分类时，使用该分类的笔记需要先处理（改为默认分类）

## 🐛 故障排除

### 如果表已存在

如果执行迁移时提示表已存在，说明已经迁移过了，可以跳过。

### 如果迁移失败

1. 检查数据库连接
2. 查看错误信息
3. 确认表结构是否正确

---

完成迁移后，重新部署应用即可使用分类管理功能！

