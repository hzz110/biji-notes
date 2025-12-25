import { useState, useEffect, useRef } from 'react'
import { Note } from '../types'
import RichTextEditor from './RichTextEditor'
import './NoteEditor.css'

interface NoteEditorProps {
  note: Note | undefined
  onUpdateNote: (id: string, updates: Partial<Note>) => void
  categories: string[]
  onCategoryChange?: (category: string, color: string) => void
}

function NoteEditor({ note, onUpdateNote, categories, onCategoryChange }: NoteEditorProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('默认')
  const [categoryColor, setCategoryColor] = useState('#2196f3')
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [isTitleFocused, setIsTitleFocused] = useState(false)

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content || '')
      setCategory(note.category || '默认')
      setCategoryColor(note.categoryColor || '#2196f3')
    } else {
      setTitle('新笔记')
      setContent('')
      setCategory('默认')
      setCategoryColor('#2196f3')
    }
  }, [note])

  const handleTitleFocus = () => {
    setIsTitleFocused(true)
    if (title === '新笔记' && titleInputRef.current) {
      titleInputRef.current.select()
    }
  }

  const handleTitleBlur = () => {
    setIsTitleFocused(false)
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (note) {
      onUpdateNote(note.id, { title: value })
    }
  }

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory)
    if (note) {
      onUpdateNote(note.id, { category: newCategory })
    }
  }

  const handleCategoryColorChange = (color: string) => {
    setCategoryColor(color)
    if (note) {
      onUpdateNote(note.id, { categoryColor: color })
    }
    if (onCategoryChange) {
      onCategoryChange(category, color)
    }
  }

  const handleContentChange = (value: string) => {
    setContent(value)
    if (note) {
      onUpdateNote(note.id, { content: value })
    }
  }

  if (!note) {
    return (
      <div className="note-editor empty">
        <p>选择一个笔记开始编辑</p>
      </div>
    )
  }

  return (
    <div className="note-editor">
      <div className="note-editor-header">
        <input
          ref={titleInputRef}
          type="text"
          className="note-title-input"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          onFocus={handleTitleFocus}
          onBlur={handleTitleBlur}
          placeholder="笔记标题..."
        />
        <div className="note-category-selector">
          <label>分类：</label>
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="category-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="color"
            value={categoryColor}
            onChange={(e) => handleCategoryColorChange(e.target.value)}
            className="category-color-picker"
            title="分类颜色"
          />
        </div>
      </div>
      <RichTextEditor
        value={content}
        onChange={handleContentChange}
        placeholder="开始记录你的想法..."
      />
      <div className="note-meta">
        <span>创建于: {new Date(note.createdAt).toLocaleString('zh-CN')}</span>
        <span>更新于: {new Date(note.updatedAt).toLocaleString('zh-CN')}</span>
      </div>
    </div>
  )
}

export default NoteEditor

