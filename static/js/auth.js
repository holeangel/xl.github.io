/**
 * 授权码管理系统
 * 实现授权码验证、生成和有效期控制功能以及管理员登录验证
 */

// 管理员账号信息
const adminCredentials = {
    username: "admin",
    password: "admin123"
};

// 从localStorage加载授权码数据，如果没有则使用默认数据
let authCodes = JSON.parse(localStorage.getItem('authCodes')) || {
    // 格式: 授权码: {expireDate: 过期日期, used: 是否已使用, createdAt: 创建时间}
    "12345": {expireDate: "2025-12-31", used: false, createdAt: "2024-01-01"},
    "67890": {expireDate: "2025-12-31", used: false, createdAt: "2024-01-01"}
};

// 初始化时保存到localStorage
if (!localStorage.getItem('authCodes')) {
    localStorage.setItem('authCodes', JSON.stringify(authCodes));
}

/**
 * 验证授权码
 * @param {string} code - 用户输入的授权码
 * @returns {Object} - 验证结果，包含是否有效和消息
 */
function validateAuthCode(code) {
    // 检查授权码是否存在
    if (!authCodes[code]) {
        return {
            valid: false,
            message: "授权码无效，请检查后重试"
        };
    }

    const authInfo = authCodes[code];
    const now = new Date();
    const expireDate = new Date(authInfo.expireDate);

    // 检查授权码是否过期
    if (now > expireDate) {
        return {
            valid: false,
            message: "授权码已过期"
        };
    }

    // 检查授权码是否已使用（如果需要一次性授权码）
    // 注释掉以下代码可以允许重复使用授权码
    /*
    if (authInfo.used) {
        return {
            valid: false,
            message: "授权码已被使用"
        };
    }
    */

    // 标记授权码为已使用（如果需要一次性授权码）
    // authInfo.used = true;
    // 更新localStorage
    // localStorage.setItem('authCodes', JSON.stringify(authCodes));

    // 记录授权码使用
    recordAuthCodeUsage(code);

    return {
        valid: true,
        message: "授权成功"
    };
}

/**
 * 记录授权码使用情况
 * @param {string} code - 使用的授权码
 */
function recordAuthCodeUsage(code) {
    // 在实际应用中，这里应该将使用记录发送到后端服务器
    console.log(`授权码 ${code} 使用于 ${new Date().toLocaleString()}`);
    
    // 存储到本地存储，用于演示
    const usageHistory = JSON.parse(localStorage.getItem('authCodeUsage') || '[]');
    usageHistory.push({
        code: code,
        usedAt: new Date().toISOString()
    });
    localStorage.setItem('authCodeUsage', JSON.stringify(usageHistory));
}

/**
 * 生成新的授权码
 * @param {number} count - 需要生成的授权码数量
 * @param {string} expireDate - 过期日期 (YYYY-MM-DD)
 * @returns {Array} - 生成的授权码列表
 */
function generateAuthCodes(count, expireDate) {
    const newCodes = [];
    
    for (let i = 0; i < count; i++) {
        // 生成5位随机数字
        const code = Math.floor(10000 + Math.random() * 90000).toString();
        
        // 添加到授权码数据库
        authCodes[code] = {
            expireDate: expireDate,
            used: false,
            createdAt: new Date().toISOString()
        };
        
        newCodes.push(code);
    }
    
    // 保存到localStorage
    localStorage.setItem('authCodes', JSON.stringify(authCodes));
    
    return newCodes;
}

/**
 * 获取所有授权码
 * @returns {Object} - 所有授权码及其信息
 */
function getAllAuthCodes() {
    return authCodes;
}

/**
 * 验证管理员登录
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {boolean} - 是否登录成功
 */
function adminLogin(username, password) {
    if (username === adminCredentials.username && password === adminCredentials.password) {
        // 登录成功，设置登录状态
        localStorage.setItem('adminLoggedIn', 'true');
        return true;
    }
    return false;
}

/**
 * 管理员登出
 */
function adminLogout() {
    localStorage.removeItem('adminLoggedIn');
}

/**
 * 检查管理员是否已登录
 * @returns {boolean} - 是否已登录
 */
function isAdminLoggedIn() {
    return localStorage.getItem('adminLoggedIn') === 'true';
}

/**
 * 检查用户是否已通过授权
 * @returns {boolean} - 是否已授权
 * 检查sessionStorage中的授权状态
 */
function isAuthorized() {
    // 从sessionStorage中获取授权状态
    const authStatus = sessionStorage.getItem('isAuthorized');
    console.log("当前授权状态: " + authStatus);
    // 如果authStatus为'true'则返回true，否则返回false
    return authStatus === 'true';
}

/**
 * 设置用户授权状态
 * @param {boolean} status - 授权状态
 * 使用sessionStorage存储授权状态，确保页面跳转后仍然有效
 */
function setAuthorized(status) {
    // 使用sessionStorage存储授权状态，这样页面跳转后仍然有效
    // 但浏览器关闭后会自动清除，保证安全性
    sessionStorage.setItem('isAuthorized', status ? 'true' : 'false');
    console.log("授权状态已设置为: " + status);
}

// 授权码系统
const authSystem = {
    // 验证授权码
    async verifyAuthCode(code, userInfo = {}) {
        try {
            // 创建表单数据
            const formData = new FormData();
            formData.append('code', code);
            
            if (userInfo.name) formData.append('user_name', userInfo.name);
            if (userInfo.phone) formData.append('user_phone', userInfo.phone);
            
            console.log('发送验证请求:', {
                code: code,
                url: '/api/auth_code.php?action=verify'
            });

            const response = await fetch('/api/auth_code.php?action=verify', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            // 如果验证成功，设置授权状态
            if (data.success) {
                this.setAuthorized(true);
                console.log('授权成功，已设置授权状态');
            } else {
                console.log('授权失败:', data.message);
            }
            
            return data;
        } catch (error) {
            console.error('验证授权码失败:', error);
            return {
                success: false,
                message: '系统错误，请稍后重试'
            };
        }
    },

    // 检查是否已授权
    isAuthorized() {
        const authStatus = localStorage.getItem('auth_verified');
        console.log("当前本地存储授权状态: " + authStatus);
        return authStatus === 'true';
    },

    // 设置授权状态
    setAuthorized(value) {
        localStorage.setItem('auth_verified', value ? 'true' : 'false');
        console.log("授权状态已设置为: " + value);
    },

    // 清除授权状态
    clearAuthorization() {
        localStorage.removeItem('auth_verified');
        console.log("授权状态已清除");
    }
};

// 导出授权系统
window.authSystem = authSystem;