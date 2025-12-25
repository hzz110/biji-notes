import { useState, useEffect, useCallback } from 'react'
import NoteList from './components/NoteList'
import NoteEditor from './components/NoteEditor'
import PasswordProtection from './components/PasswordProtection'
import CategoryManager from './components/CategoryManager'
import { Note } from './types'
import * as api from './services/api'
import './App.css'

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  
  // 获取所有分类（从笔记中提取，并添加默认分类）
  const categories = Array.from(
    new Set(['默认', ...notes.map(note => note.category || '默认')])
  ).sort()

  // 从 API 加载笔记
  const loadNotes = useCallback(async (query?: string) => {
    try {
      setLoading(true)
      setError(null)
      const fetchedNotes = await api.fetchNotes(query)
      setNotes(fetchedNotes)
      if (fetchedNotes.length > 0 && !selectedNoteId) {
        setSelectedNoteId(fetchedNotes[0].id)
      }
    } catch (err) {
      console.error('加载笔记失败:', err)
      setError('加载笔记失败，请刷新页面重试')
    } finally {
      setLoading(false)
    }
  }, [selectedNoteId])

  // 初始加载和搜索
  useEffect(() => {
    loadNotes(searchQuery)
  }, [searchQuery, loadNotes])

  // 创建新笔记
  const handleCreateNote = async () => {
    try {
      setError(null)
      const newNote = await api.createNote({
        id: Date.now().toString(),
        title: '新笔记',
        content: '',
        category: '默认',
        categoryColor: '#2196f3',
      })
      setNotes([newNote, ...notes])
      setSelectedNoteId(newNote.id)
    } catch (err) {
      console.error('创建笔记失败:', err)
      const errorMessage = err instanceof Error ? err.message : '创建笔记失败，请重试'
      setError(errorMessage)
    }
  }

  // 更新笔记
  const handleUpdateNote = async (id: string, updates: Partial<Note>) => {
    try {
      const updatedNote = await api.updateNote(id, updates)
      setNotes(notes.map(note => 
        note.id === id ? updatedNote : note
      ))
    } catch (err) {
      console.error('更新笔记失败:', err)
      setError('更新笔记失败，请重试')
      // 重新加载笔记以同步状态
      loadNotes(searchQuery)
    }
  }

  // 删除笔记
  const handleDeleteNote = async (id: string) => {
    try {
      await api.deleteNote(id)
      const updatedNotes = notes.filter(note => note.id !== id)
      setNotes(updatedNotes)
      if (selectedNoteId === id) {
        setSelectedNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null)
      }
    } catch (err) {
      console.error('删除笔记失败:', err)
      setError('删除笔记失败，请重试')
      // 重新加载笔记以同步状态
      loadNotes(searchQuery)
    }
  }

  // 添加分类
  const handleAddCategory = (_categoryName: string) => {
    // 分类已通过笔记自动提取，这里只是触发重新渲染
    // 实际分类会在创建笔记时使用
    // 使用下划线前缀表示参数未使用
    setShowCategoryManager(false)
  }

  // 删除分类
  const handleDeleteCategory = async (categoryName: string) => {
    if (categoryName === '默认') {
      alert('不能删除默认分类')
      return
    }
    
    // 检查是否有笔记使用此分类
    const notesWithCategory = notes.filter(note => note.category === categoryName)
    if (notesWithCategory.length > 0) {
      const confirmMessage = `有 ${notesWithCategory.length} 条笔记使用此分类。删除分类后，这些笔记将归入"默认"分类。确定要删除吗？`
      if (!confirm(confirmMessage)) {
        return
      }
      
      // 将使用此分类的笔记改为默认分类
      try {
        for (const note of notesWithCategory) {
          await api.updateNote(note.id, {
            category: '默认',
            categoryColor: '#2196f3'
          })
        }
        // 重新加载笔记
        loadNotes(searchQuery)
      } catch (err) {
        console.error('更新笔记分类失败:', err)
        setError('更新笔记分类失败，请重试')
      }
    }
    
    setShowCategoryManager(false)
  }

  // 使用搜索查询过滤（后端已处理，这里直接使用 notes）
  const filteredNotes = notes

  const selectedNote = notes.find(note => note.id === selectedNoteId)

  // 如果未认证，显示密码保护
  if (!isAuthenticated) {
    return (
      <PasswordProtection onPasswordCorrect={() => setIsAuthenticated(true)} />
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 在线笔记</h1>
        <div className="header-actions">
          <input
            type="text"
            placeholder="搜索笔记..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <div className="header-buttons">
            <button 
              onClick={() => setShowCategoryManager(true)} 
              className="btn btn-secondary"
              title="分类管理"
            >
              📁 分类管理
            </button>
            <button onClick={handleCreateNote} className="btn btn-primary" disabled={loading}>
              + 新建笔记
            </button>
          </div>
        </div>
      </header>
      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      {loading && notes.length === 0 ? (
        <div className="loading">加载中...</div>
      ) : (
        <div className="app-content">
          <NoteList
            notes={filteredNotes}
            selectedNoteId={selectedNoteId}
            onSelectNote={setSelectedNoteId}
            onDeleteNote={handleDeleteNote}
          />
          <NoteEditor
            note={selectedNote}
            onUpdateNote={handleUpdateNote}
            categories={categories}
          />
        </div>
      )}
      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onClose={() => setShowCategoryManager(false)}
        />
      )}
    </div>
  )
}

export default App

