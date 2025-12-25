// Cloudflare Pages Function - 分类 API
// 处理分类的 CRUD 操作

export interface Env {
  DB: D1Database;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

// GET /api/categories - 获取所有分类
export async function onRequestGet(context: { env: Env; request: Request }): Promise<Response> {
  try {
    const { env } = context;

    if (!env.DB) {
      return new Response(JSON.stringify({ 
        error: '数据库未配置，请在 Cloudflare Dashboard 中绑定 D1 数据库'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const result = await env.DB.prepare('SELECT * FROM categories ORDER BY name ASC').all<Category>();

    const categories = result.results.map(cat => ({
      id: cat.id,
      name: cat.name,
      color: cat.color,
      createdAt: cat.created_at,
      updatedAt: cat.updated_at,
    }));

    return new Response(JSON.stringify(categories), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('获取分类失败:', error);
    return new Response(JSON.stringify({ error: '获取分类失败' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// POST /api/categories - 创建新分类
export async function onRequestPost(context: { env: Env; request: Request }): Promise<Response> {
  try {
    const { env, request } = context;

    if (!env.DB) {
      return new Response(JSON.stringify({ 
        error: '数据库未配置，请在 Cloudflare Dashboard 中绑定 D1 数据库'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const body = await request.json() as Partial<{ name: string; color: string }>;

    if (!body.name || !body.name.trim()) {
      return new Response(JSON.stringify({ error: '分类名称不能为空' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const id = Date.now().toString();
    const name = body.name.trim();
    const color = body.color || '#2196f3';
    const now = new Date().toISOString();

    try {
      await env.DB.prepare(
        'INSERT INTO categories (id, name, color, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
      ).bind(id, name, color, now, now).run();
    } catch (error: any) {
      if (error.message?.includes('UNIQUE constraint')) {
        return new Response(JSON.stringify({ error: '分类名称已存在' }), {
          status: 409,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
      throw error;
    }

    const category = {
      id,
      name,
      color,
      createdAt: now,
      updatedAt: now,
    };

    return new Response(JSON.stringify(category), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('创建分类失败:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return new Response(JSON.stringify({ 
      error: '创建分类失败',
      details: errorMessage
    }), {
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

