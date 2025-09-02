/**
 * 微信JS-SDK配置文件
 * 用于解决微信内访问网页时的安全提示
 */

// 判断是否在微信环境中
function isWeixinBrowser() {
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('micromessenger') !== -1;
}

// 微信内环境处理
if (isWeixinBrowser()) {
    // 页面加载完成后执行
    document.addEventListener('DOMContentLoaded', function() {
        console.log('检测到微信环境，初始化微信JS-SDK');
        
        // 获取当前页面URL (去除hash部分)
        const currentUrl = window.location.href.split('#')[0];
        console.log('当前页面URL: ' + currentUrl);
        
        // 从服务器获取签名配置
        initWxConfig(currentUrl);
    });
}

/**
 * 初始化微信JS-SDK配置
 * @param {string} url - 当前页面的URL
 * @param {number} retryCount - 重试次数（内部使用）
 */
function initWxConfig(url, retryCount = 0) {
    const maxRetries = 3; // 最大重试次数
    
    fetch('/api/wx_sign.php?url=' + encodeURIComponent(url))
        .then(response => {
            
        })
        .then(data => {
            console.log('获取签名结果:', data);
            
            if (data.success && typeof wx !== 'undefined') {
                // 配置微信JS-SDK
                wx.config({
                    debug: false, // 开发阶段可以开启debug模式
                    appId: data.appId,
                    timestamp: data.timestamp,
                    nonceStr: data.nonceStr,
                    signature: data.signature,
                    jsApiList: [
                        'updateAppMessageShareData',
                        'updateTimelineShareData',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'hideAllNonBaseMenuItem',
                        'showMenuItems'
                    ]
                });

                // 微信JS-SDK准备就绪
                wx.ready(function() {
                    console.log('微信JS-SDK准备就绪');
                    
                    // 获取页面标题和描述
                    const title = document.title || '心理测试';
                    const desc = document.querySelector('meta[property="og:description"]')?.content || '专业心理测评工具，帮助您了解自己的心理状态';
                    const imgUrl = document.querySelector('meta[property="og:image"]')?.content || window.location.origin + '/images/logo.png';
                    
                    // 自定义"分享给朋友"及"分享到QQ"按钮的分享内容
                    wx.updateAppMessageShareData({ 
                        title: title, 
                        desc: desc, 
                        link: window.location.href, 
                        imgUrl: imgUrl,
                        success: function () {
                            console.log('分享设置成功');
                        }
                    });
                    
                    // 自定义"分享到朋友圈"及"分享到QQ空间"按钮的分享内容
                    wx.updateTimelineShareData({ 
                        title: title, 
                        link: window.location.href, 
                        imgUrl: imgUrl,
                        success: function () {
                            console.log('朋友圈分享设置成功');
                        }
                    });
                    
                    // 隐藏不需要的菜单项，减少干扰
                    wx.hideAllNonBaseMenuItem();
                    
                    // 显示需要的菜单项
                    wx.showMenuItems({
                        menuList: [
                            'menuItem:share:appMessage', // 分享给朋友
                            'menuItem:share:timeline'    // 分享到朋友圈
                        ]
                    });
                });
                
                // 微信JS-SDK错误处理
                wx.error(function(res) {
                    console.error('微信JS-SDK配置错误:', res);
                    
                    // 如果是签名错误且未超过最大重试次数，则重试
                    if (res.errMsg.indexOf('signature') !== -1 && retryCount < maxRetries) {
                        console.log(`签名错误，第${retryCount + 1}次重试中...`);
                        // 重试时添加随机参数，避免缓存
                        const retryUrl = url + (url.indexOf('?') !== -1 ? '&' : '?') + 'retry=' + new Date().getTime();
                        setTimeout(() => {
                            initWxConfig(retryUrl, retryCount + 1);
                        }, 1000);
                    }
                });
            } else {
                console.error('获取微信签名失败:', data.message || '未知错误');
            }
        })
        .catch(error => {
            console.error('获取微信签名请求失败:', error);
            
            // 如果未超过最大重试次数，则重试
            if (retryCount < maxRetries) {
                console.log(`网络错误，第${retryCount + 1}次重试中...`);
                setTimeout(() => {
                    initWxConfig(url, retryCount + 1);
                }, 1000);
            }
        });
}

// 生成随机字符串
function generateNonceStr(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
} 