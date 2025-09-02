/**
 * MBTI测试处理器
 * 用于处理专业版MBTI 93道测试题目的结果计算
 */

// MBTI维度处理对象
const mbtiProcessor = {
    /**
     * 计算MBTI测试结果
     * @param {Object} answers - 题目答案，格式为 {questionId: selectedOption}
     * @param {Object} questions - 测试题目数组
     * @returns {Object} 返回MBTI分析结果对象
     */
    calculateResults: function(answers, questions) {
        if (!answers || !questions) {
            console.warn('无效的MBTI测试答案或问题');
            return this.getDefaultResults();
        }
        
        try {
            // 初始化四个维度的计数
            const dimensions = {
                'E-I': { e: 0, i: 0, total: 0 },
                'S-N': { s: 0, n: 0, total: 0 },
                'T-F': { t: 0, f: 0, total: 0 },
                'J-P': { j: 0, p: 0, total: 0 }
            };
            
            // 遍历所有问题的答案
            Object.keys(answers).forEach(key => {
                const questionId = parseInt(key) + 1; // 因为答案是以0为起始索引存储的
                const answer = answers[key];
                
                // 查找对应的问题
                const question = questions.find(q => q.id === questionId);
                if (!question) return;
                
                const dimension = question.dimension;
                
                // 根据问题的维度和答案更新维度计数
                if (dimension === 'E-I') {
                    if (answer === 1) dimensions['E-I'].e++;
                    else if (answer === 2) dimensions['E-I'].i++;
                    dimensions['E-I'].total++;
                } else if (dimension === 'S-N') {
                    if (answer === 1) dimensions['S-N'].s++;
                    else if (answer === 2) dimensions['S-N'].n++;
                    dimensions['S-N'].total++;
                } else if (dimension === 'T-F') {
                    if (answer === 1) dimensions['T-F'].t++;
                    else if (answer === 2) dimensions['T-F'].f++;
                    dimensions['T-F'].total++;
                } else if (dimension === 'J-P') {
                    if (answer === 1) dimensions['J-P'].j++;
                    else if (answer === 2) dimensions['J-P'].p++;
                    dimensions['J-P'].total++;
                }
            });
            
            // 计算各维度的百分比
            const percentages = {
                'E-I': {
                    e: this.calculatePercentage(dimensions['E-I'].e, dimensions['E-I'].total),
                    i: this.calculatePercentage(dimensions['E-I'].i, dimensions['E-I'].total)
                },
                'S-N': {
                    s: this.calculatePercentage(dimensions['S-N'].s, dimensions['S-N'].total),
                    n: this.calculatePercentage(dimensions['S-N'].n, dimensions['S-N'].total)
                },
                'T-F': {
                    t: this.calculatePercentage(dimensions['T-F'].t, dimensions['T-F'].total),
                    f: this.calculatePercentage(dimensions['T-F'].f, dimensions['T-F'].total)
                },
                'J-P': {
                    j: this.calculatePercentage(dimensions['J-P'].j, dimensions['J-P'].total),
                    p: this.calculatePercentage(dimensions['J-P'].p, dimensions['J-P'].total)
                }
            };
            
            // 确定MBTI类型
            let personalityType = '';
            personalityType += dimensions['E-I'].e > dimensions['E-I'].i ? 'E' : 'I';
            personalityType += dimensions['S-N'].s > dimensions['S-N'].n ? 'S' : 'N';
            personalityType += dimensions['T-F'].t > dimensions['T-F'].f ? 'T' : 'F';
            personalityType += dimensions['J-P'].j > dimensions['J-P'].p ? 'J' : 'P';
            
            // 生成详细的维度分析
            const dimensionAnalysis = {
                'E-I': this.getDimensionAnalysis('E-I', percentages['E-I']),
                'S-N': this.getDimensionAnalysis('S-N', percentages['S-N']),
                'T-F': this.getDimensionAnalysis('T-F', percentages['T-F']),
                'J-P': this.getDimensionAnalysis('J-P', percentages['J-P'])
            };
            
            return {
                personalityType: personalityType,
                dimensions: dimensions,
                percentages: percentages,
                analysis: dimensionAnalysis
            };
        } catch (error) {
            console.error('计算MBTI结果时出错:', error);
            return this.getDefaultResults();
        }
    },
    
    /**
     * 计算百分比
     * @param {Number} value - 当前值
     * @param {Number} total - 总值
     * @returns {Number} 百分比，四舍五入到整数
     */
    calculatePercentage: function(value, total) {
        if (total === 0) return 50; // 防止除以零
        return Math.round((value / total) * 100);
    },
    
    /**
     * 获取默认结果
     * @returns {Object} 默认MBTI结果对象
     */
    getDefaultResults: function() {
        return {
            personalityType: 'ISTJ',
            dimensions: {
                'E-I': { e: 3, i: 7, total: 10 },
                'S-N': { s: 6, n: 4, total: 10 },
                'T-F': { t: 7, f: 3, total: 10 },
                'J-P': { j: 8, p: 2, total: 10 }
            },
            percentages: {
                'E-I': { e: 30, i: 70 },
                'S-N': { s: 60, n: 40 },
                'T-F': { t: 70, f: 30 },
                'J-P': { j: 80, p: 20 }
            },
            analysis: {
                'E-I': '您偏向内向(I)型人格(70%)，相比外向(E)型人格(30%)。内向型的人倾向于从内心世界获取能量，喜欢独处和深度思考，通常先思考后行动，珍视私人空间。',
                'S-N': '您偏向感觉(S)型人格(60%)，相比直觉(N)型人格(40%)。感觉型的人注重具体事实和细节，依靠感官感知世界，关注实际和当下的体验，倾向于循序渐进地解决问题。',
                'T-F': '您偏向思考(T)型人格(70%)，相比情感(F)型人格(30%)。思考型的人在决策时注重逻辑和客观分析，追求公平和一致性，可能表现得理性和直接。',
                'J-P': '您偏向判断(J)型人格(80%)，相比感知(P)型人格(20%)。判断型的人喜欢有计划和组织的生活，追求确定性和结构，喜欢做决定并完成任务。您可能喜欢按计划行事，有序完成工作，注重截止日期，喜欢提前做决定并坚持执行。'
            }
        };
    },
    
    /**
     * 获取MBTI类型描述
     * @param {String} type - MBTI类型代码
     * @param {Object} types - MBTI类型描述对象
     * @returns {String} MBTI类型描述
     */
    getTypeDescription: function(type, types) {
        if (!type || !types || !types[type]) {
            return '';
        }
        return types[type];
    },
    
    /**
     * 获取MBTI类型名称
     * @param {String} type - MBTI类型代码
     * @returns {String} MBTI类型名称
     */
    getTypeName: function(type) {
        const names = {
            'ISTJ': '尽责的检查者',
            'ISFJ': '尽职的护卫者',
            'INFJ': '神秘的智者',
            'INTJ': '独立的战略家',
            'ISTP': '灵巧的工匠',
            'ISFP': '敏感的艺术家',
            'INFP': '理想的调停者',
            'INTP': '逻辑的思想家',
            'ESTP': '活力的挑战者',
            'ESFP': '自由的表演者',
            'ENFP': '热情的梦想家',
            'ENTP': '大胆的思想家',
            'ESTJ': '高效的管理者',
            'ESFJ': '热心的守护者',
            'ENFJ': '热情的教导者',
            'ENTJ': '果断的指挥官'
        };
        return names[type] || '';
    },
    
    /**
     * 获取维度分析
     * @param {String} dimension - 维度代码
     * @param {Object} data - 维度数据
     * @returns {String} 维度分析说明
     */
    getDimensionAnalysis: function(dimension, data) {
        if (!dimension || !data) {
            return '';
        }
        
        switch (dimension) {
            case 'E-I':
                if (data.e > data.i) {
                    return `您偏向外向(E)型人格(${data.e}%)，相比内向(I)型人格(${data.i}%)。外向型的人倾向于从外部世界获取能量，喜欢社交活动，乐于与他人互动，通常表现得开朗、健谈。您可能喜欢团队合作，在人多的环境中感到舒适，通过与他人交流来梳理自己的想法。`;
                } else {
                    return `您偏向内向(I)型人格(${data.i}%)，相比外向(E)型人格(${data.e}%)。内向型的人倾向于从内心世界获取能量，喜欢独处和深度思考，通常先思考后行动，珍视私人空间。您可能更偏好一对一的深入交流，需要安静的环境恢复精力，并在行动前充分考虑。`;
                }
            case 'S-N':
                if (data.s > data.n) {
                    return `您偏向感觉(S)型人格(${data.s}%)，相比直觉(N)型人格(${data.n}%)。感觉型的人注重具体事实和细节，依靠感官感知世界，关注实际和当下的体验，倾向于循序渐进地解决问题。您可能喜欢明确的指导和具体的例子，重视经验和实用性，关注现实情况。`;
                } else {
                    return `您偏向直觉(N)型人格(${data.n}%)，相比感觉(S)型人格(${data.s}%)。直觉型的人注重概念和可能性，寻找模式和关联，关注未来和潜力，倾向于用创新的方式解决问题。您可能善于把握大局，对新想法充满热情，喜欢探索多种可能性和理论概念。`;
                }
            case 'T-F':
                if (data.t > data.f) {
                    return `您偏向思考(T)型人格(${data.t}%)，相比情感(F)型人格(${data.f}%)。思考型的人在决策时注重逻辑和客观分析，追求公平和一致性，可能表现得理性和直接。您在做决定时可能更重视事实和逻辑，追求客观标准，能够进行批判性思考，重视效率和真相。`;
                } else {
                    return `您偏向情感(F)型人格(${data.f}%)，相比思考(T)型人格(${data.t}%)。情感型的人在决策时注重个人价值观和他人感受，追求和谐和共识，通常表现得有同理心和温和。您在做决定时可能更考虑人际关系和价值取向，重视人情味，注重团队和谐，善于理解他人需求。`;
                }
            case 'J-P':
                if (data.j > data.p) {
                    return `您偏向判断(J)型人格(${data.j}%)，相比感知(P)型人格(${data.p}%)。判断型的人喜欢有计划和组织的生活，追求确定性和结构，喜欢做决定并完成任务。您可能喜欢按计划行事，有序完成工作，注重截止日期，喜欢提前做决定并坚持执行。`;
                } else {
                    return `您偏向感知(P)型人格(${data.p}%)，相比判断(J)型人格(${data.j}%)。感知型的人喜欢灵活和自发的生活，追求新的体验和选择，保持开放的态度，适应变化的能力强。您可能享受即兴发挥的自由，对新信息持开放态度，适应变化能力强，喜欢保持选择的灵活性。`;
                }
            default:
                return '';
        }
    },
    
    /**
     * 获取职业匹配信息
     * @param {String} type - MBTI类型代码
     * @returns {Array} 匹配职业列表
     */
    getCareerMatches: function(type) {
        const careers = {
            'ISTJ': ['会计师', '审计师', '银行职员', '财务分析师', '项目经理', '行政管理人员', '数据分析师', '系统管理员', '质量检验员', '法律顾问'],
            'ISFJ': ['护士', '医疗助理', '社会工作者', '行政秘书', '客户服务代表', '图书管理员', '初级教师', '人力资源专员', '保险代理人', '药剂师'],
            'INFJ': ['咨询师', '心理治疗师', '作家', '编辑', '艺术总监', '人力资源发展顾问', '教育家', '环保活动家', '社会服务总监', '职业规划师'],
            'INTJ': ['战略规划师', '科学家', '系统分析师', '工程师', '投资银行家', '法官', '企业家', 'IT顾问', '商业分析师', '大学教授'],
            'ISTP': ['机械师', '软件开发员', '飞行员', '电子技术员', '应急医疗技术员', '警察', '法医调查员', '电气工程师', '建筑师', '工艺师'],
            'ISFP': ['艺术家', '音乐家', '室内设计师', '珠宝设计师', '时装设计师', '厨师', '园艺师', '治疗师', '美容师', '摄影师'],
            'INFP': ['作家', '诗人', '心理学家', '艺术家', '设计师', '教育顾问', '社会工作者', '人道主义工作者', '音乐家', '人员培训师'],
            'INTP': ['软件开发员', '数据科学家', '系统分析师', '大学教授', '法律顾问', '建筑师', '经济学家', '发明家', '研究员', '技术作家'],
            'ESTP': ['企业家', '营销人员', '销售代表', '股票经纪人', '运动员', '娱乐人员', '保险代理人', '消防员', '警察', '建筑经理'],
            'ESFP': ['演员', '舞者', '销售人员', '活动策划师', '旅游顾问', '公关专员', '运动教练', '初级医疗保健人员', '儿童看护人员', '美容师'],
            'ENFP': ['创意总监', '营销顾问', '企业家', '演艺人员', '记者', '政治家', '培训师', '教育家', '活动策划师', '公关专员'],
            'ENTP': ['企业家', '律师', '营销总监', '项目经理', '创业投资家', '政治家', '创新顾问', '发明家', '广告创意总监', '社论作家'],
            'ESTJ': ['高管', '商业管理者', '项目协调员', '保险代理人', '警察/军官', '法官', '财务主管', '销售经理', '审计师', '政府雇员'],
            'ESFJ': ['护士', '教师', '销售代表', '社会工作者', '公关专员', '客户服务经理', '活动策划师', '办公室经理', '预算分析师', '餐饮服务经理'],
            'ENFJ': ['教师', '咨询师', '销售经理', '培训师', '人力资源经理', '营销经理', '非营利组织总监', '政治顾问', '客户关系经理', '公共关系主管'],
            'ENTJ': ['企业高管', '管理顾问', '律师', '企业家', '项目经理', '大学教授', '政治家', '研究科学家', '投资银行家', '市场营销总监']
        };
        
        return careers[type] || [];
    }
}; 