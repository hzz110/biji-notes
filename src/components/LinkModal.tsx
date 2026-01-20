import { useState, useEffect } from 'react'
import './LinkModal.css'

interface LinkModalProps {
  onClose: () => void
  onConfirm: (title: string, url: string) => void
}

function LinkModal({ onClose, onConfirm }: LinkModalProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  const normalizeUrl = (input: string) => {
    if (!input) return ''
    if (!/^https?:\/\//i.test(input)) {
      return `https://${input}`
    }
    return input
  }

  const handleFetchTitle = async () => {
    if (!url) return
    
    const targetUrl = normalizeUrl(url)
    setIsFetching(true)
    
    try {
      // 优先尝试 microlink API，它专门用于提取网页元数据
      try {
        const microlinkUrl = `https://api.microlink.io?url=${encodeURIComponent(targetUrl)}`
        const response = await fetch(microlinkUrl)
        const data = await response.json()
        
        if (data.status === 'success' && data.data?.title) {
          setTitle(data.data.title)
          setIsFetching(false)
          return
        }
      } catch (e) {
        console.warn('Microlink fetch failed, trying fallback...', e)
      }

      // 备选：使用 allorigins 作为代理来绕过 CORS
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`
      const response = await fetch(proxyUrl)
      const data = await response.json()
      
      if (data.contents) {
        const parser = new DOMParser()
        const doc = parser.parseFromString(data.contents, 'text/html')
        const pageTitle = doc.querySelector('title')?.innerText
        
        if (pageTitle) {
          setTitle(pageTitle.trim())
        } else {
          throw new Error('No title found')
        }
      } else {
        throw new Error('No content returned')
      }
    } catch (error) {
      console.error('获取标题失败:', error)
      // 失败时尝试从 URL 中提取域名
      try {
        const urlObj = new URL(targetUrl)
        setTitle(urlObj.hostname)
      } catch {
        setTitle(targetUrl)
      }
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = () => {
    if (!url) return
    onConfirm(title || url, normalizeUrl(url))
  }

  return (
    <div className="link-modal" onClick={onClose}>
      <div className="link-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="link-modal-title">插入链接</h3>
        
        <div className="link-input-group">
          <label>链接地址</label>
          <div className="link-input-row">
            <input
              type="text"
              className="link-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              onKeyDown={(e) => e.key === 'Enter' && handleFetchTitle()}
              autoFocus
            />
            <button 
              className="fetch-btn"
              onClick={handleFetchTitle}
              disabled={!url || isFetching}
            >
              {isFetching ? '获取中...' : '获取标题'}
            </button>
          </div>
        </div>

        <div className="link-input-group">
          <label>链接标题</label>
          <input
            type="text"
            className="link-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入标题或点击获取..."
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <div className="link-modal-actions">
          <button className="link-modal-btn btn-cancel" onClick={onClose}>
            取消
          </button>
          <button 
            className="link-modal-btn btn-confirm" 
            onClick={handleSubmit}
            disabled={!url}
          >
            插入
          </button>
        </div>
      </div>
    </div>
  )
}

export default LinkModal
