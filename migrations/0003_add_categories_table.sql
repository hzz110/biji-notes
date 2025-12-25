-- 创建分类表

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#2196f3',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- 插入默认分类
INSERT OR IGNORE INTO categories (id, name, color, created_at, updated_at) 
VALUES ('default', '默认', '#2196f3', datetime('now'), datetime('now'));

