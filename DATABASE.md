# 🗄️ 数据库配置指南

本指南详细说明如何配置和使用 Cloudflare D1 数据库。

## 📋 数据库 Schema

数据库使用 SQLite（通过 Cloudflare D1），包含一个 `notes` 表：

```sql
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '新笔记',
  content TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

## 🚀 创建数据库

### 方法一：通过 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** > **D1**
3. 点击 **Create database**
4. 输入数据库名称：`biji-notes-db`
5. 选择区域（建议选择离你最近的区域）
6. 点击 **Create**

### 方法二：使用 Wrangler CLI

```bash
# 安装 Wrangler（如果还没有）
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 创建数据库
wrangler d1 create biji-notes-db
```

## 📝 初始化数据库

### 方法一：通过 Cloudflare Dashboard

1. 在数据库页面，点击 **Migrations** 标签
2. 点击 **Upload migration**
3. 上传 `schema.sql` 文件或复制其内容
4. 点击 **Apply migration**

### 方法二：使用 Wrangler CLI

```bash
# 执行迁移到生产数据库
wrangler d1 execute biji-notes-db --file=./schema.sql

# 或者执行到本地数据库（用于开发）
wrangler d1 execute biji-notes-db --local --file=./schema.sql
```

## 🔗 绑定数据库到 Pages 项目

### 在 Cloudflare Dashboard 中绑定

1. 进入你的 Pages 项目
2. 点击 **Settings** > **Functions**
3. 在 **D1 database bindings** 部分，点击 **Add binding**
4. 配置绑定：
   - **Variable name**: `DB`（必须与代码中的绑定名称一致）
   - **D1 database**: 选择 `biji-notes-db`
5. 点击 **Save**

### 在 wrangler.toml 中配置（本地开发）

编辑 `.wrangler.toml` 文件：

```toml
[[d1_databases]]
binding = "DB"
database_name = "biji-notes-db"
database_id = "你的数据库ID"  # 在 Dashboard 中创建数据库后获取
```

## 🧪 本地开发

### 创建本地数据库

```bash
# 创建本地 D1 数据库
wrangler d1 create biji-notes-db --local

# 初始化本地数据库
npm run db:migrate:local
```

### 运行本地开发服务器

```bash
# 使用 Wrangler 运行 Pages 开发服务器
wrangler pages dev dist --d1=DB=biji-notes-db

# 或者使用 npm 脚本（需要在 package.json 中添加）
npm run dev:pages
```

## 📊 数据库操作

### 查看数据库内容

```bash
# 查询所有笔记
wrangler d1 execute biji-notes-db --command="SELECT * FROM notes"

# 本地数据库
wrangler d1 execute biji-notes-db --local --command="SELECT * FROM notes"
```

### 备份数据库

```bash
# 导出数据库
wrangler d1 export biji-notes-db --output=backup.sql

# 导入数据库
wrangler d1 execute biji-notes-db --file=backup.sql
```

## 🔍 故障排除

### 数据库连接失败

1. **检查绑定配置**
   - 确认在 Pages 项目设置中已正确绑定数据库
   - 确认绑定名称是 `DB`（与代码中一致）

2. **检查数据库是否存在**
   - 在 Dashboard 中确认数据库已创建
   - 确认数据库名称正确

3. **检查迁移是否执行**
   - 确认 `notes` 表已创建
   - 可以在 Dashboard 的数据库页面查看表结构

### 查询失败

1. **检查 SQL 语法**
   - 确认 SQL 语句正确
   - D1 使用 SQLite 语法

2. **检查数据类型**
   - 确认插入的数据类型与表结构匹配
   - 日期时间使用 ISO 8601 格式字符串

### 本地开发问题

1. **Wrangler 未安装**
   ```bash
   npm install -g wrangler
   ```

2. **未登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **本地数据库未创建**
   ```bash
   wrangler d1 create biji-notes-db --local
   ```

## 📚 更多资源

- [Cloudflare D1 文档](https://developers.cloudflare.com/d1/)
- [D1 API 参考](https://developers.cloudflare.com/d1/api/)
- [SQLite 文档](https://www.sqlite.org/docs.html)

## 💡 提示

- D1 免费计划提供 5GB 存储空间
- 每天 500 万次读取和 10 万次写入
- 数据存储在 Cloudflare 的全球边缘网络中
- 支持事务和索引，性能优秀
- 可以使用标准的 SQL 查询

---

如有问题，请查看 Cloudflare D1 的官方文档或提交 Issue。

