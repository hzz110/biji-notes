# 🗄️ R2 对象存储设置指南

本指南将帮助你配置 Cloudflare R2 对象存储，用于存储笔记中的图片。

## 📋 步骤概览

1. ✅ 创建 R2 存储桶
2. ✅ 配置公共访问或自定义域名
3. ✅ 绑定 R2 存储桶到 Pages 项目
4. ✅ 更新上传 API 配置

---

## 步骤 1：创建 R2 存储桶

1. **登录 Cloudflare Dashboard**
   - 访问：https://dash.cloudflare.com/
   - 使用你的账号登录

2. **进入 R2 页面**
   - 在左侧菜单中找到 **Workers & Pages**
   - 点击 **R2 对象存储**（R2 Object Storage）

3. **创建存储桶**
   - 点击右上角的 **Create bucket** 按钮
   - 在弹出窗口中：
     - **Bucket name**: 输入 `biji-images`
     - 选择区域（建议选择离你最近的区域）
   - 点击 **Create bucket**

---

## 步骤 2：配置公共访问

R2 存储桶默认是私有的，需要配置公共访问才能通过 URL 直接访问图片。

### 方法一：配置公共访问（简单但安全性较低）

1. **进入存储桶设置**
   - 在 R2 列表中，点击 `biji-images` 存储桶

2. **配置公共访问**
   - 点击 **Settings** 标签
   - 找到 **Public access** 部分
   - 点击 **Allow Access** 或启用公共访问
   - 保存设置

3. **获取公共 URL**
   - 在存储桶设置中，找到 **Public URL** 或 **Custom Domain**
   - 记录这个 URL，格式类似：`https://pub-<account-id>.r2.dev`

### 方法二：使用自定义域名（推荐，更安全）

1. **添加自定义域名**
   - 在存储桶设置中，找到 **Custom Domains** 部分
   - 点击 **Add domain**
   - 输入你的域名（例如：`images.yourdomain.com`）
   - 按照提示添加 DNS 记录（CNAME）

2. **配置 DNS**
   - 在你的域名 DNS 设置中添加 CNAME 记录
   - 名称：`images`（或你想要的子域名）
   - 目标：Cloudflare 提供的目标地址

3. **等待生效**
   - DNS 记录通常几分钟内生效
   - 验证域名可以访问

---

## 步骤 3：绑定 R2 存储桶到 Pages 项目

1. **进入 Pages 项目设置**
   - 在 Cloudflare Dashboard 中，进入 **Workers & Pages** > **Pages**
   - 点击你的项目（`biji-notes`）

2. **打开绑定设置**
   - 在项目页面，点击左侧的 **Settings**
   - 点击 **Functions** 标签（或直接点击 **Bindings**）

3. **添加 R2 绑定**
   - 向下滚动到 **R2 bucket bindings** 部分
   - 点击 **Add binding** 按钮
   - 在弹出窗口中：
     - **Variable name**: 输入 `R2_BUCKET`（必须完全一致，区分大小写）
     - **R2 bucket**: 从下拉菜单选择 `biji-images`
   - 点击 **Save**

---

## 步骤 4：更新上传 API 配置

绑定完成后，需要更新上传 API 中的 URL 配置。

### 编辑 `functions/api/upload.ts`

找到以下代码：

```typescript
const publicUrl = `https://pub-${accountId}.r2.dev/${fileName}`;
```

根据你的配置方式，修改为：

**如果使用公共访问：**
```typescript
// 替换 YOUR_ACCOUNT_ID 为你的 Cloudflare Account ID
const accountId = 'YOUR_ACCOUNT_ID';
const publicUrl = `https://pub-${accountId}.r2.dev/${fileName}`;
```

**如果使用自定义域名（推荐）：**
```typescript
const publicUrl = `https://images.yourdomain.com/${fileName}`;
```

### 获取 Account ID

1. 在 Cloudflare Dashboard 右侧栏找到 **Account ID**
2. 复制这个 ID
3. 替换代码中的 `YOUR_ACCOUNT_ID`

---

## 步骤 5：重新部署项目

配置完成后，必须重新部署项目：

1. 在 Pages 项目页面，点击 **Deployments** 标签
2. 找到最新部署，点击 **...** 菜单
3. 选择 **Retry deployment**
4. 等待部署完成

---

## ✅ 验证设置

完成所有步骤后，验证是否成功：

1. **检查 R2 绑定**
   - 在 Pages 项目 > Settings > Functions
   - 确认 `R2_BUCKET` 绑定存在

2. **测试图片上传**
   - 访问你的网站
   - 创建一个新笔记
   - 在富文本编辑器中点击图片图标
   - 选择一张图片上传
   - 如果成功，图片应该显示在编辑器中

---

## 🐛 常见问题

### Q: 上传图片后显示 403 错误

**A**: 说明 R2 存储桶没有配置公共访问。请完成步骤 2。

### Q: 图片 URL 无法访问

**A**: 检查以下几点：
1. R2 存储桶是否配置了公共访问或自定义域名
2. 上传 API 中的 URL 配置是否正确
3. DNS 记录是否正确（如果使用自定义域名）

### Q: 如何找到 Account ID？

**A**: 
1. 在 Cloudflare Dashboard 右侧栏
2. 或者进入 **Workers & Pages** > **Overview**
3. Account ID 会显示在页面顶部

### Q: 图片上传大小限制是多少？

**A**: 当前代码限制为 5MB。可以在 `functions/api/upload.ts` 中修改：

```typescript
if (file.size > 5 * 1024 * 1024) {
  // 修改这里的 5 为你想要的大小（MB）
}
```

---

## 💡 提示

- R2 免费计划提供：
  - 10 GB 存储空间
  - 每月 100 万次 Class A 操作（写入）
  - 每月 1000 万次 Class B 操作（读取）
- 使用自定义域名可以更好地控制访问权限
- 建议定期清理不需要的图片以节省存储空间

---

## 📚 更多资源

- [Cloudflare R2 文档](https://developers.cloudflare.com/r2/)
- [R2 公共访问配置](https://developers.cloudflare.com/r2/buckets/public-buckets/)
- [R2 自定义域名](https://developers.cloudflare.com/r2/buckets/custom-domains/)

---

完成以上步骤后，你的应用就可以上传和显示图片了！🎉

