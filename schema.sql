-- Cloudflare D1 数据库 Schema
-- 创建笔记表

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '新笔记',
  content TEXT NOT NULL DEFAULT '',
  category TEXT DEFAULT '默认',
  category_color TEXT DEFAULT '#2196f3',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_title ON notes(title);
CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category);

-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#2196f3',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 创建分类索引
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- 插入默认分类
INSERT OR IGNORE INTO categories (id, name, color, created_at, updated_at) 
VALUES ('default', '默认', '#2196f3', datetime('now'), datetime('now'));

