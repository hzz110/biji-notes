// 分类 API 服务

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE = '/api/categories';

// 获取所有分类
export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(API_BASE);
  
  if (!response.ok) {
    throw new Error('获取分类失败');
  }
  
  return response.json();
}

// 创建新分类
export async function createCategory(name: string, color: string = '#2196f3'): Promise<Category> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, color }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || `创建分类失败 (${response.status})`;
    throw new Error(errorMessage);
  }
  
  return response.json();
}

// 删除分类
export async function deleteCategory(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || `删除分类失败 (${response.status})`;
    throw new Error(errorMessage);
  }
}

