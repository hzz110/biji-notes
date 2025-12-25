import { Note } from '../types'
import './NoteList.css'

interface NoteListProps {
  notes: Note[]
  selectedNoteId: string | null
  onSelectNote: (id: string) => void
  onDeleteNote: (id: string) => void
  categories: string[]
}

function NoteList({ notes, selectedNoteId, onSelectNote, onDeleteNote, categories }: NoteListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return '昨天'
    } else if (days < 7) {
      return `${days}天前`
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
    }
  }

  const getPreview = (content: string) => {
    // 移除 HTML 标签
    const text = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim()
    return text.length > 50 ? text.substring(0, 50) + '...' : text || '无内容'
  }

  if (notes.length === 0) {
    return (
      <div className="note-list empty">
        <p>还没有笔记</p>
        <p className="hint">点击"新建笔记"开始记录</p>
      </div>
    )
  }

  // 按分类分组，每个分类显示最新的3条笔记
  const notesByCategory = categories.map(category => {
    const categoryNotes = notes
      .filter(note => (note.category || '默认') === category)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3) // 每个分类最多3条
    
    // 获取分类颜色（从第一条笔记或默认颜色）
    const color = categoryNotes[0]?.categoryColor || '#2196f3'
    
    return {
      category,
      notes: categoryNotes,
      color
    }
  }).filter(group => group.notes.length > 0) // 只显示有笔记的分类

  if (notesByCategory.length === 0) {
    return (
      <div className="note-list empty">
        <p>还没有笔记</p>
        <p className="hint">点击"新建笔记"开始记录</p>
      </div>
    )
  }

  return (
    <div className="note-list">
      {notesByCategory.map(({ category, notes: categoryNotes, color }) => (
        <div key={category} className="category-group">
          <div
            className="category-header"
            style={{ borderLeftColor: color }}
          >
            <span className="category-name">{category}</span>
          </div>
          {categoryNotes.map(note => (
            <div
              key={note.id}
              className={`note-item ${selectedNoteId === note.id ? 'active' : ''}`}
              onClick={() => onSelectNote(note.id)}
            >
              <div
                className="note-category-indicator"
                style={{ borderLeftColor: note.categoryColor || '#2196f3' }}
              />
              <div className="note-item-content">
                <div className="note-item-header">
                  <h3 className="note-title">{note.title}</h3>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm('确定要删除这条笔记吗？')) {
                        onDeleteNote(note.id)
                      }
                    }}
                    title="删除笔记"
                  >
                    ×
                  </button>
                </div>
                <p className="note-preview">{getPreview(note.content)}</p>
                <span className="note-date">{formatDate(note.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default NoteList

