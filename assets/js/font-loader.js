/**
 * 字体加载状态优化脚本
 * 监控中文字体加载完成情况，优化用户体验
 */

(function() {
    'use strict';
    
    // 配置
    const FONT_FAMILY = 'LXGWNeoXiHeiPlus';
    const FALLBACK_FONTS = ['Sora', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'];
    
    // 字体加载状态
    let fontLoaded = false;
    let fontLoadTimeout = null;
    
    // 日志函数
    function log(message) {
        console.log(`[字体加载] ${message}`);
    }
    
    // 检测字体是否可用
    function isFontAvailable(fontFamily) {
        const testString = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const testSize = '72px';
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // 测试目标字体
        context.font = `${testSize} ${fontFamily}`;
        const targetWidth = context.measureText(testString).width;
        
        // 测试后备字体
        context.font = `${testSize} ${FALLBACK_FONTS.join(', ')}`;
        const fallbackWidth = context.measureText(testString).width;
        
        return targetWidth !== fallbackWidth;
    }
    
    // 字体加载完成处理
    function onFontLoaded() {
        if (fontLoaded) return; // 防止重复执行
        
        fontLoaded = true;
        log('中文字体加载完成！');
        
        // 清除超时
        if (fontLoadTimeout) {
            clearTimeout(fontLoadTimeout);
            fontLoadTimeout = null;
        }
        
        // 添加字体加载完成类名
        document.documentElement.classList.add('font-loaded');
        document.body.classList.add('font-loaded');
        
        // 触发自定义事件
        const event = new CustomEvent('fontLoaded', {
            detail: { fontFamily: FONT_FAMILY }
        });
        document.dispatchEvent(event);
        
        // 优化：移除加载中的样式
        const loadingElements = document.querySelectorAll('.font-loading');
        loadingElements.forEach(el => {
            el.classList.remove('font-loading');
        });
    }
    
    // 字体加载超时处理
    function onFontLoadTimeout() {
        log('字体加载超时，使用后备字体');
        document.documentElement.classList.add('font-fallback');
        document.body.classList.add('font-fallback');
    }
    
    // 开始监控字体加载
    function startFontMonitoring() {
        log('开始监控字体加载状态...');
        
        // 设置超时（5秒）
        fontLoadTimeout = setTimeout(() => {
            if (!fontLoaded) {
                onFontLoadTimeout();
            }
        }, 5000);
        
        // 定期检查字体是否可用
        const checkInterval = setInterval(() => {
            if (isFontAvailable(FONT_FAMILY)) {
                clearInterval(checkInterval);
                onFontLoaded();
            }
        }, 100);
        
        // 备用方案：监听字体加载事件
        if ('fonts' in document) {
            document.fonts.ready.then(() => {
                log('Font Loading API 完成');
                if (isFontAvailable(FONT_FAMILY)) {
                    onFontLoaded();
                }
            });
        }
    }
    
    // 页面加载完成后开始监控
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startFontMonitoring);
    } else {
        startFontMonitoring();
    }
    
    // 导出到全局作用域（可选）
    window.FontLoader = {
        isLoaded: () => fontLoaded,
        onLoad: (callback) => {
            if (fontLoaded) {
                callback();
            } else {
                document.addEventListener('fontLoaded', callback);
            }
        }
    };
    
})(); 