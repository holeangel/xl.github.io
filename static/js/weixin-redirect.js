/**
 * 微信网页授权重定向处理
 * 解决微信内打开时的安全提示问题
 */

// 检测是否在微信环境中
function isWechatBrowser() {
    return /MicroMessenger/i.test(navigator.userAgent);
}

// 处理微信内的页面跳转
function handleWechatRedirect() {

    // 如果在微信浏览器内
    if (isWechatBrowser()) {
        console.log('检测到微信浏览器环境，启用安全跳转');
        
        // 监听所有点击事件，处理跨域链接
        document.addEventListener('click', function(e) {
            // 如果点击的是链接
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                const link = e.target.tagName === 'A' ? e.target : e.target.closest('a');
                const href = link.getAttribute('href');
                
                // 如果链接为空或是锚点，不处理
                if (!href || href === '#' || href.startsWith('javascript:')) {
                    return;
                }
                
                // 如果是外部链接或absolute链接，且不是微信域的链接
                if (href.indexOf('http') === 0 && href.indexOf('weixin') === -1) {
                    // 阻止默认行为
                    e.preventDefault();
                    console.log('处理外部链接跳转: ' + href);
                    
                    // 使用window.location跳转，而不是用超链接直接跳转
                    window.location.href = href;
                } else if (href.indexOf('http') !== 0 && !href.startsWith('#')) {
                    // 内部链接处理（相对路径）
                    e.preventDefault();
                    console.log('处理内部链接跳转: ' + href);
                    
                    // 对内部链接，使用window.location处理
                    window.location.href = href;
                }
            }
        });
        
        // 监听表单提交，确保在微信内正常处理
        document.addEventListener('submit', function(e) {
            // 如果表单没有指定target="_blank"，则处理
            if (e.target.tagName === 'FORM' && (!e.target.target || e.target.target !== '_blank')) {
                // 获取表单action
                const action = e.target.getAttribute('action');
                
                // 如果是外部链接，需要特殊处理
                if (action && action.indexOf('http') === 0 && action.indexOf('weixin') === -1) {
                    e.preventDefault();
                    console.log('处理表单提交到外部地址: ' + action);
                    
                    // 手动构建FormData并提交
                    const formData = new FormData(e.target);
                    const method = e.target.method.toUpperCase() === 'POST' ? 'POST' : 'GET';
                    
                    if (method === 'GET') {
                        // 对于GET请求，构建查询字符串
                        const params = new URLSearchParams();
                        for (let pair of formData.entries()) {
                            params.append(pair[0], pair[1]);
                        }
                        window.location.href = action + '?' + params.toString();
                    } else {
                        // 对于POST请求，使用fetch API
                        fetch(action, {
                            method: 'POST',
                            body: formData
                        }).then(response => {
                            if (response.redirected) {
                                window.location.href = response.url;
                            }
                        }).catch(error => {
                            console.error('表单提交失败:', error);
                        });
                    }
                }
            }
        });
        
        // 处理微信返回时的页面刷新问题
        window.addEventListener('pageshow', function(e) {
            if (e.persisted) {
                // 页面从缓存加载，需要刷新以保证状态正确
                window.location.reload();
            }
        });
        
        // 监听页面visibility变化，处理微信切换问题
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                // 从后台切换到前台，检查是否需要刷新
                const lastTime = sessionStorage.getItem('wx_last_visible_time');
                const now = Date.now();
                
                if (lastTime && (now - parseInt(lastTime)) > 60000) {
                    // 超过1分钟，刷新页面确保数据最新
                    window.location.reload();
                }
                
                sessionStorage.setItem('wx_last_visible_time', now.toString());
            }
        });
        
        // 初次记录时间
        sessionStorage.setItem('wx_last_visible_time', Date.now().toString());
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    handleWechatRedirect();
}); 