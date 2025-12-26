import { useMemo, useRef, useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import BlotFormatter from 'quill-blot-formatter'
import 'react-quill/dist/quill.snow.css'
import ImageModal from './ImageModal'
import './RichTextEditor.css'

// 安全地获取 Quill 对象
// 注意：在 Vite 生产构建中，Quill 对象可能需要通过不同方式获取
let Quill: any = null
try {
  Quill = ReactQuill.Quill
} catch (e) {
  console.warn('Failed to get Quill from ReactQuill directly', e)
}

// 模块注册状态
let isModuleRegistered = false

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null)
  const [isReady, setIsReady] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    // 在组件挂载后注册模块
    if (!isModuleRegistered) {
      try {
        // 再次尝试获取 Quill（如果顶层获取失败）
        if (!Quill && (ReactQuill as any)?.default?.Quill) {
          Quill = (ReactQuill as any).default.Quill
        }
        
        if (!Quill) {
          // 最后的尝试：从 quill 包导入（如果环境允许）
          // 但通常 ReactQuill 应该已经带了。
          // 这里如果还是拿不到，就只能报错了
          console.error('Quill object not found, skipping module registration')
          setIsReady(true)
          return
        }

        const BaseImage = Quill.import('formats/image')
        class ImageBlot extends BaseImage {
          static create(value: any) {
            const node = super.create(value)
            if (typeof value === 'string') {
              node.setAttribute('src', value)
            }
            return node
          }

          static formats(node: HTMLElement) {
            const formats: any = {}
            if (node.hasAttribute('width')) formats.width = node.getAttribute('width')
            if (node.hasAttribute('height')) formats.height = node.getAttribute('height')
            if (node.hasAttribute('style')) formats.style = node.getAttribute('style')
            return formats
          }

          format(name: string, value: any) {
            if (name === 'width' || name === 'height') {
              if (value) {
                this.domNode.setAttribute(name, value)
              } else {
                this.domNode.removeAttribute(name)
              }
            } else if (name === 'style') {
              if (value) {
                this.domNode.setAttribute(name, value)
              } else {
                this.domNode.removeAttribute(name)
              }
            } else {
              super.format(name, value)
            }
          }
        }
        
        // 注册自定义格式和模块
        // 先检查是否已经注册，避免重复注册报错
        const formats = Quill.imports['formats/image']
        if (formats !== ImageBlot) {
             Quill.register('formats/image', ImageBlot, true)
        }
        Quill.register('modules/blotFormatter', BlotFormatter)
        
        isModuleRegistered = true
      } catch (error) {
        console.error('Error registering Quill modules:', error)
      }
    }
    setIsReady(true)
  }, [])

  // 如果还没准备好，可以渲染一个加载状态或者 null
  if (!isReady) {
    return <div className="rich-text-editor-loading">Loading editor...</div>
  }


  // 配置图片上传
  const imageHandler = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return

      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        return
      }

      // 验证文件大小（限制 5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过 5MB')
        return
      }

      try {
        // 创建 FormData
        const formData = new FormData()
        formData.append('image', file)

        // 上传到服务器
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('上传失败')
        }

        const data = await response.json()
        const imageUrl = data.url

        // 插入图片到编辑器
        const quill = quillRef.current?.getEditor()
        if (quill) {
          const range = quill.getSelection(true)
          if (range) {
            quill.insertEmbed(range.index, 'image', imageUrl)
            quill.setSelection(range.index + 1, 0)
          }
        }
      } catch (error) {
        console.error('图片上传失败:', error)
        alert('图片上传失败，请重试')
      }
    }
  }

  // 配置工具栏
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
      blotFormatter: {
        overlay: {
          style: {
            border: '2px solid #2196f3',
          }
        }
      }
    }),
    []
  )

  // URL 自动链接配置和图片点击事件
  useEffect(() => {
    const quill = quillRef.current?.getEditor()
    if (!quill) return

    // 监听文本变化，自动将 URL 转换为链接
    const handleTextChange = () => {
      const text = quill.getText()
      const urlRegex = /(https?:\/\/[^\s]+)/g
      const matches = text.match(urlRegex)

      if (matches) {
        let modified = false

        matches.forEach((url) => {
          const index = text.indexOf(url)
          if (index !== -1) {
            const format = quill.getFormat(index, url.length)
            // 如果还不是链接，则添加链接格式
            if (!format.link) {
              quill.formatText(index, url.length, 'link', url)
              modified = true
            }
          }
        })

        if (modified) {
          // 触发 onChange 以保存更改
          const html = quill.root.innerHTML
          onChange(html)
        }
      }
    }

    // 处理图片点击事件（改为双击查看大图，单击用于选中缩放）
    const handleImageDoubleClick = (e: MouseEvent) => {
      const target = e.target as HTMLImageElement
      if (target.tagName === 'IMG' && target.src) {
        e.preventDefault()
        setSelectedImage(target.src)
      }
    }

    quill.on('text-change', handleTextChange)
    quill.root.addEventListener('dblclick', handleImageDoubleClick)

    return () => {
      quill.off('text-change', handleTextChange)
      quill.root.removeEventListener('dblclick', handleImageDoubleClick)
    }
  }, [onChange])

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'color',
    'background',
    'align',
    'link',
    'image',
    'width',
    'height',
    'style'
  ]

  return (
    <>
      <div className="rich-text-editor">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder || '开始记录你的想法...'}
        />
      </div>
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  )
}

export default RichTextEditor

