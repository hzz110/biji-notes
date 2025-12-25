// API 服务 - 处理与后端的所有通信

import { Note } from '../types'

const API_BASE = '/api/notes';

// 获取所有笔记
export async function fetchNotes(query?: string): Promise<Note[]> {
  const url = query ? `${API_BASE}?q=${encodeURIComponent(query)}` : API_BASE;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('获取笔记失败');
  }
  
  return response.json();
}

// 创建新笔记
export async function createNote(note: Partial<Note>): Promise<Note> {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `创建笔记失败 (${response.status})`;
      console.error('API 错误:', errorMessage, response.status);
      throw new Error(errorMessage);
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('网络错误，请检查连接');
  }
}

// 更新笔记
export async function updateNote(id: string, updates: Partial<Note>): Promise<Note> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error('更新笔记失败');
  }
  
  return response.json();
}

// 删除笔记
export async function deleteNote(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('删除笔记失败');
  }
}

