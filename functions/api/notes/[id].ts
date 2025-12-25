// Cloudflare Pages Function - 单个笔记操作
// PUT /api/notes/[id] - 更新笔记
// DELETE /api/notes/[id] - 删除笔记

export interface Env {
  DB: D1Database;
}

// PUT /api/notes/[id] - 更新笔记
export async function onRequestPut(
  context: { env: Env; request: Request; params: { id: string } }
): Promise<Response> {
  try {
    const { env, request, params } = context;
    
    // 检查数据库绑定
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
    const body = await request.json() as Partial<{ title: string; content: string; category: string; categoryColor: string }>;

    const updates: string[] = [];
    const values: any[] = [];

    if (body.title !== undefined) {
      updates.push('title = ?');
      values.push(body.title);
    }

    if (body.content !== undefined) {
      updates.push('content = ?');
      values.push(body.content);
    }

    if (body.category !== undefined) {
      updates.push('category = ?');
      values.push(body.category);
    }

    if (body.categoryColor !== undefined) {
      updates.push('category_color = ?');
      values.push(body.categoryColor);
    }

    if (updates.length === 0) {
      return new Response(JSON.stringify({ error: '没有要更新的字段' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    await env.DB.prepare(
      `UPDATE notes SET ${updates.join(', ')} WHERE id = ?`
    ).bind(...values).run();

    // 获取更新后的笔记
    const result = await env.DB.prepare('SELECT * FROM notes WHERE id = ?').bind(id).first<{
      id: string;
      title: string;
      content: string;
      category?: string;
      category_color?: string;
      created_at: string;
      updated_at: string;
    }>();

    if (!result) {
      return new Response(JSON.stringify({ error: '笔记不存在' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const note = {
      id: result.id,
      title: result.title,
      content: result.content,
      category: result.category || '默认',
      categoryColor: result.category_color || '#2196f3',
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };

    return new Response(JSON.stringify(note), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('更新笔记失败:', error);
    return new Response(JSON.stringify({ error: '更新笔记失败' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// DELETE /api/notes/[id] - 删除笔记
export async function onRequestDelete(
  context: { env: Env; params: { id: string } }
): Promise<Response> {
  try {
    const { env, params } = context;
    
    // 检查数据库绑定
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

    const result = await env.DB.prepare('DELETE FROM notes WHERE id = ?').bind(id).run();

    if (result.meta.changes === 0) {
      return new Response(JSON.stringify({ error: '笔记不存在' }), {
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
    console.error('删除笔记失败:', error);
    return new Response(JSON.stringify({ error: '删除笔记失败' }), {
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

