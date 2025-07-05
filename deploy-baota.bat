@echo off
chcp 65001 >nul
echo ========================================
echo 宝塔面板快速部署脚本
echo ========================================
echo.

:: 配置信息 - 请修改为你的服务器信息
set SERVER_IP=你的服务器IP
set DOMAIN=yourdomain.com
set USERNAME=root

echo 当前配置：
echo 服务器IP: %SERVER_IP%
echo 域名: %DOMAIN%
echo 用户名: %USERNAME%
echo.

:: 检查配置
set /p CONFIRM=请确认以上配置是否正确？(y/n): 
if /i not "%CONFIRM%"=="y" (
    echo 请修改脚本中的配置信息后重新运行
    pause
    exit /b 1
)

echo.
echo 开始部署...

:: 1. 创建远程目录（如果不存在）
echo [1/5] 创建远程目录...
ssh %USERNAME%@%SERVER_IP% "mkdir -p /www/wwwroot/%DOMAIN%"

:: 2. 上传文件
echo [2/5] 上传文件到服务器...
scp -r ./* %USERNAME%@%SERVER_IP%:/www/wwwroot/%DOMAIN%/

:: 3. 设置文件权限
echo [3/5] 设置文件权限...
ssh %USERNAME%@%SERVER_IP% "chown -R www:www /www/wwwroot/%DOMAIN%"
ssh %USERNAME%@%SERVER_IP% "chmod -R 755 /www/wwwroot/%DOMAIN%"
ssh %USERNAME%@%SERVER_IP% "chmod 644 /www/wwwroot/%DOMAIN%/assets/fonts/*"

:: 4. 检查字体文件
echo [4/5] 检查字体文件...
ssh %USERNAME%@%SERVER_IP% "ls -la /www/wwwroot/%DOMAIN%/assets/fonts/"

:: 5. 重启Nginx
echo [5/5] 重启Nginx服务...
ssh %USERNAME%@%SERVER_IP% "systemctl restart nginx"

echo.
echo ========================================
echo 部署完成！
echo ========================================
echo.
echo 请访问: http://%DOMAIN%
echo.
echo 下一步操作：
echo 1. 在宝塔面板中配置SSL证书
echo 2. 开启Gzip压缩
echo 3. 配置静态文件缓存
echo.
pause 