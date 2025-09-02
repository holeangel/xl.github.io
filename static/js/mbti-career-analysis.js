/**
 * MBTI职业分析模块
 * 用于增强MBTI报告中的职业匹配分析功能
 */
document.addEventListener('DOMContentLoaded', function() {
    // 确保mbtiProcessor存在
    if (typeof mbtiProcessor === 'undefined') {
        console.error('mbtiProcessor未加载，无法进行职业匹配分析');
        return;
    }
    
    // 检查是否是MBTI报告页面
    const mbtiReportContainer = document.querySelector('div[v-if="testType === \'mbti\'"]');
    if (!mbtiReportContainer) return;
    
    // 查找职业匹配模块
    const careerSectionContainer = document.querySelector('.mbti-career-section');
    if (!careerSectionContainer) {
        console.log('未找到职业匹配模块，将创建新模块');
        // 在这里可以添加创建新模块的代码
    } else {
        console.log('找到职业匹配模块，将增强其功能');
        // 访问Vue实例来获取personalityType
        const appElement = document.getElementById('app');
        if (appElement && appElement.__vue__) {
            const vue = appElement.__vue__;
            const personalityType = vue.personalityType;
            
            if (personalityType) {
                // 获取职业匹配列表
                const careers = mbtiProcessor.getCareerMatches(personalityType);
                
                // 创建职业列表HTML
                let careersHTML = '<div class="career-list" style="margin: 1rem 0; padding: 1.5rem; background: #f8f9fa; border-radius: 0.5rem;">';
                careersHTML += '<h4>专业版MBTI职业推荐</h4>';
                careersHTML += '<ul style="columns: 2; column-gap: 2rem; list-style-type: none; padding-left: 0;">';
                
                careers.forEach(career => {
                    careersHTML += `<li style="margin-bottom: 0.75rem; padding-left: 1.5rem; position: relative;">
                        <span style="position: absolute; left: 0; top: 0.3rem; color: #667eea;">•</span>
                        ${career}
                    </li>`;
                });
                
                careersHTML += '</ul></div>';
                
                // 添加到页面
                const careerContentDiv = careerSectionContainer.querySelector('.mbti-career-content');
                if (careerContentDiv) {
                    // 在最前面插入专业版职业推荐
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = careersHTML;
                    careerContentDiv.insertBefore(tempDiv, careerContentDiv.firstChild);
                }
            }
        }
    }
}); 