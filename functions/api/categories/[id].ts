// Cloudflare Pages Function - 单个分类操作
// DELETE /api/categories/[id] - 删除分类

export interface Env {
  DB: D1Database;
}

// DELETE /api/categories/[id] - 删除分类
export async function onRequestDelete(
  context: { env: Env; params: { id: string } }
): Promise<Response> {
  try {
    const { env, params } = context;

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

    const { id } = params;

    // 检查是否是默认分类
    const category = await env.DB.prepare('SELECT name FROM categories WHERE id = ?').bind(id).first<{ name: string }>();
    
    if (category && category.name === '默认') {
      return new Response(JSON.stringify({ error: '不能删除默认分类' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const result = await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();

    if (result.meta.changes === 0) {
      return new Response(JSON.stringify({ error: '分类不存在' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('删除分类失败:', error);
    return new Response(JSON.stringify({ error: '删除分类失败' }), {
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

