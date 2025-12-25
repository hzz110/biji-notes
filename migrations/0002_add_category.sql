-- 添加分类字段到 notes 表

ALTER TABLE notes ADD COLUMN category TEXT DEFAULT '默认';
ALTER TABLE notes ADD COLUMN category_color TEXT DEFAULT '#2196f3';

-- 创建分类索引
CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category);

