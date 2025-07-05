# 宝塔面板部署指南

## 🎯 部署方案
使用宝塔面板 + Nginx + 本地字体文件，保持原字体效果。

## 🚀 部署步骤

### 1. 宝塔面板配置

#### 创建网站
1. **登录宝塔面板**
   - 访问：`http://你的服务器IP:8888`
   - 使用宝塔面板账号登录

2. **添加站点**
   - 点击"网站" → "添加站点"
   - 域名：填写你的域名（如：`yourdomain.com`）
   - 根目录：`/www/wwwroot/yourdomain.com`
   - PHP版本：纯静态，选择"纯静态"
   - 数据库：不创建
   - FTP：可选
   - SSL：稍后配置

### 2. 上传文件

#### 方法一：宝塔文件管理器
1. **进入文件管理**
   - 点击"文件" → 找到你的网站目录
   - 路径：`/www/wwwroot/yourdomain.com`

2. **上传文件**
   - 点击"上传"按钮
   - 选择你的项目文件夹中的所有文件
   - 包括：
     - `index.html`
     - `assets/` 文件夹（包含字体文件）
     - `README.md`
     - 其他配置文件

#### 方法二：使用FTP
```bash
# 使用FileZilla等FTP工具
主机：你的服务器IP
用户名：宝塔面板FTP账号
密码：宝塔面板FTP密码
端口：21
```

#### 方法三：使用SCP（推荐）
```bash
# 从本地上传到服务器
scp -r ./resumewebsite/* root@你的服务器IP:/www/wwwroot/yourdomain.com/

# 设置权限
ssh root@你的服务器IP "chown -R www:www /www/wwwroot/yourdomain.com"
```

### 3. Nginx配置优化

#### 在宝塔面板中配置
1. **进入网站设置**
   - 点击"网站" → 找到你的网站 → "设置"

2. **配置伪静态**
   - 点击"伪静态" → 选择"自定义"
   - 添加以下规则：
   ```nginx
   # 静态文件缓存
   location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   
   # 字体文件特殊处理
   location ~* \.(woff|woff2|ttf|eot)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
       add_header Access-Control-Allow-Origin "*";
   }
   
   # 安全头
   add_header X-Frame-Options "SAMEORIGIN" always;
   add_header X-XSS-Protection "1; mode=block" always;
   add_header X-Content-Type-Options "nosniff" always;
   ```

3. **配置反向代理**（如果需要）
   - 通常不需要，纯静态网站

### 4. 启用HTTPS

#### 使用宝塔SSL
1. **申请SSL证书**
   - 点击"SSL" → "Let's Encrypt"
   - 选择你的域名
   - 点击"申请"

2. **强制HTTPS**
   - 申请成功后，点击"强制HTTPS"
   - 自动跳转到HTTPS

### 5. 性能优化

#### 开启Gzip压缩
1. **在宝塔面板中**
   - 点击"网站" → "设置" → "配置文件"
   - 找到以下配置并确保开启：
   ```nginx
   gzip on;
   gzip_vary on;
   gzip_min_length 1024;
   gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
   ```

#### 开启HTTP/2
1. **在SSL设置中**
   - 确保"HTTP/2"已开启
   - 这会显著提升加载速度

### 6. 字体文件优化

#### 检查字体文件
```bash
# 在宝塔终端中检查
ls -la /www/wwwroot/yourdomain.com/assets/fonts/
# 应该看到 LXGWNeoXiHeiPlus.ttf 等字体文件
```

#### 字体文件权限
```bash
# 确保字体文件权限正确
chmod 644 /www/wwwroot/yourdomain.com/assets/fonts/*.ttf
chmod 644 /www/wwwroot/yourdomain.com/assets/fonts/*.woff*
chown www:www /www/wwwroot/yourdomain.com/assets/fonts/*
```

## 📊 性能优化建议

### 1. 图片优化
```bash
# 在宝塔面板中安装图片优化工具
# 或者使用在线工具压缩图片
```

### 2. 缓存策略
- **浏览器缓存**：已通过Nginx配置
- **CDN加速**：可考虑使用阿里云CDN

### 3. 监控设置
- **开启访问日志**：在宝塔面板中查看
- **性能监控**：使用宝塔面板的监控功能

## 🚨 常见问题解决

### 1. 字体文件不显示
```bash
# 检查字体文件路径
ls -la /www/wwwroot/yourdomain.com/assets/fonts/

# 检查Nginx配置
nginx -t

# 重启Nginx
systemctl restart nginx
```

### 2. 页面加载慢
- 检查Gzip是否开启
- 检查静态文件缓存是否生效
- 考虑使用CDN加速

### 3. HTTPS证书问题
- 在宝塔面板中重新申请SSL证书
- 检查域名解析是否正确
- 确保80和443端口开放

### 4. 权限问题
```bash
# 修复文件权限
chown -R www:www /www/wwwroot/yourdomain.com
chmod -R 755 /www/wwwroot/yourdomain.com
chmod 644 /www/wwwroot/yourdomain.com/assets/fonts/*
```

## 📞 宝塔面板常用命令

```bash
# 重启Nginx
systemctl restart nginx

# 重启宝塔面板
bt restart

# 查看Nginx状态
systemctl status nginx

# 查看网站日志
tail -f /www/wwwlogs/yourdomain.com.log
```

## 🎉 部署完成检查

### 检查清单
- [ ] 网站可以正常访问
- [ ] 字体文件正常显示
- [ ] HTTPS证书生效
- [ ] 移动端响应式正常
- [ ] 图片和资源加载正常
- [ ] 性能测试通过

### 性能测试
- 使用Google PageSpeed Insights测试
- 使用GTmetrix测试
- 检查Lighthouse评分

---

**总结**：使用宝塔面板部署非常简单，主要步骤是创建网站、上传文件、配置Nginx、启用HTTPS。字体文件会正常加载，性能也会很好！🎉 