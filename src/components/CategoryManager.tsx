import { useState } from 'react'
import './CategoryManager.css'

interface CategoryManagerProps {
  categories: string[]
  onAddCategory: (name: string) => void
  onDeleteCategory: (name: string) => void
  onClose: () => void
}

function CategoryManager({ categories, onAddCategory, onDeleteCategory, onClose }: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState('')

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
      onAddCategory(newCategoryName.trim())
      setNewCategoryName('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCategory()
    }
  }

  return (
    <div className="category-manager-overlay" onClick={onClose}>
      <div className="category-manager" onClick={(e) => e.stopPropagation()}>
        <div className="category-manager-header">
          <h3>分类管理</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="category-manager-content">
          <div className="add-category-section">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入新分类名称..."
              className="category-input"
            />
            <button onClick={handleAddCategory} className="add-category-btn">
              添加分类
            </button>
          </div>
          <div className="categories-list">
            <h4>现有分类：</h4>
            <ul>
              {categories.map((category) => (
                <li key={category}>
                  <span>{category}</span>
                  {category !== '默认' && (
                    <button
                      onClick={() => onDeleteCategory(category)}
                      className="delete-category-btn"
                      title="删除分类"
                    >
                      删除
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryManager

