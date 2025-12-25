import { useEffect } from 'react'
import './ImageModal.css'

interface ImageModalProps {
  imageUrl: string
  onClose: () => void
}

function ImageModal({ imageUrl, onClose }: ImageModalProps) {
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

  return (
    <div className="image-modal" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="image-modal-close" onClick={onClose}>×</button>
        <img src={imageUrl} alt="预览" className="image-modal-img" />
        <div className="image-modal-controls">
          <button onClick={onClose} className="image-modal-btn">关闭</button>
        </div>
      </div>
    </div>
  )
}

export default ImageModal

