// Cloudflare Pages Function - 笔记 API
// 处理所有笔记相关的 CRUD 操作

export interface Env {
  DB: D1Database;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// GET /api/notes - 获取所有笔记
export async function onRequestGet(context: { env: Env; request: Request }): Promise<Response> {
  try {
    const { env } = context;
    const { searchParams } = new URL(context.request.url);
    const query = searchParams.get('q') || '';

    let result;
    
    if (query) {
      result = await env.DB.prepare(
        'SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY updated_at DESC'
      ).bind(`%${query}%`, `%${query}%`).all<Note>();
    } else {
      result = await env.DB.prepare('SELECT * FROM notes ORDER BY updated_at DESC').all<Note>();
    }
    
    // 转换字段名以匹配前端期望的格式
    const notes = result.results.map(note => ({
      id: note.id,
      title: note.title,
      content: note.content,
      createdAt: note.created_at,
      updatedAt: note.updated_at,
    }));

    return new Response(JSON.stringify(notes), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('获取笔记失败:', error);
    return new Response(JSON.stringify({ error: '获取笔记失败' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// POST /api/notes - 创建新笔记
export async function onRequestPost(context: { env: Env; request: Request }): Promise<Response> {
  try {
    const { env, request } = context;
    const body = await request.json() as Partial<Note>;

    const id = body.id || Date.now().toString();
    const title = body.title || '新笔记';
    const content = body.content || '';
    const now = new Date().toISOString();

    await env.DB.prepare(
      'INSERT INTO notes (id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(id, title, content, now, now).run();

    const note = {
      id,
      title,
      content,
      createdAt: now,
      updatedAt: now,
    };

    return new Response(JSON.stringify(note), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('创建笔记失败:', error);
    return new Response(JSON.stringify({ error: '创建笔记失败' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// OPTIONS - 处理 CORS 预检请求
export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

