export interface Note {
  id: string
  title: string
  content: string
  category?: string
  categoryColor?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  name: string
  color: string
}

