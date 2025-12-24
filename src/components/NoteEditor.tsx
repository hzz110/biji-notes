import { useState, useEffect } from 'react'
import { Note } from '../types'
import './NoteEditor.css'

interface NoteEditorProps {
  note: Note | undefined
  onUpdateNote: (id: string, updates: Partial<Note>) => void
}

function NoteEditor({ note, onUpdateNote }: NoteEditorProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
    } else {
      setTitle('')
      setContent('')
    }
  }, [note])

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (note) {
      onUpdateNote(note.id, { title: value })
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
      <input
        type="text"
        className="note-title-input"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="笔记标题..."
      />
      <textarea
        className="note-content-input"
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
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

