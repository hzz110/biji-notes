// Cloudflare Pages Function - 图片代理访问
// GET /api/images/[path] - 从 R2 获取图片并代理返回

export interface Env {
  R2_BUCKET: R2Bucket;
}

export async function onRequestGet(
  context: { env: Env; params: { path: string } }
): Promise<Response> {
  try {
    const { env, params } = context;
    const { path } = params;

    // 检查 R2 绑定
    if (!env.R2_BUCKET) {
      return new Response('R2 存储未配置', {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // 从 R2 获取文件
    const object = await env.R2_BUCKET.get(`images/${path}`);

    if (!object) {
      return new Response('图片不存在', {
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // 获取文件类型
    const contentType = object.httpMetadata?.contentType || 'image/jpeg';

    // 返回图片
    return new Response(object.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('获取图片失败:', error);
    return new Response('获取图片失败', {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

