// Cloudflare Pages Function - 图片上传到 R2
// POST /api/upload

export interface Env {
  R2_BUCKET: R2Bucket;
}

export async function onRequestPost(context: { env: Env; request: Request }): Promise<Response> {
  try {
    const { env, request } = context;

    // 检查 R2 绑定
    if (!env.R2_BUCKET) {
      return new Response(JSON.stringify({ 
        error: 'R2 存储未配置，请在 Cloudflare Dashboard 中绑定 R2 存储桶'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // 获取上传的文件
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: '没有上传文件' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      return new Response(JSON.stringify({ error: '只支持图片文件' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // 验证文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: '文件大小不能超过 5MB' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `images/${timestamp}-${randomStr}.${fileExt}`;

    // 上传到 R2
    await env.R2_BUCKET.put(fileName, file.stream(), {
      httpMetadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000',
      },
    });

    // 生成图片 URL
    // 使用代理 API 访问图片（推荐，更安全）
    // 这样不需要配置 R2 公共访问，通过 Workers 代理访问
    const filePath = fileName.replace('images/', '');
    const publicUrl = `/api/images/${filePath}`;
    
    // 或者如果配置了自定义域名，直接使用：
    // const customDomain = 'images.yourdomain.com';
    // const publicUrl = `https://${customDomain}/${fileName}`;

    return new Response(JSON.stringify({ 
      url: publicUrl,
      fileName: fileName,
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('上传失败:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return new Response(JSON.stringify({ 
      error: '上传失败',
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

