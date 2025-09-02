/**
 * 焦虑自评量表(SAS)数据
 * 作者：Zung, 1971
 * 中文版由王征宇等人修订
 */

const sasData = {
    questions: [
        { id: 1, text: "我感到比平常更加紧张和焦虑", dimension: "主观感受", options: ["没有或很少时间", "小部分时间", "相当多时间", "绝大部分或全部时间"] },
        { id: 2, text: "我无缘无故地感到害怕", dimension: "主观感受" },
        { id: 3, text: "我容易心里烦乱或感到惊恐", dimension: "主观感受" },
        { id: 4, text: "我感到我好像快要发疯了", dimension: "主观感受" },
        { id: 5, text: "我感到一切都很好，也不会发生什么不幸", dimension: "主观感受", reverse: true },
        { id: 6, text: "我手脚发抖打颤", dimension: "躯体症状" },
        { id: 7, text: "我因为头痛、颈痛和背痛而苦恼", dimension: "躯体症状" },
        { id: 8, text: "我感到容易衰弱和疲乏", dimension: "躯体症状" },
        { id: 9, text: "我感到心平气和，并且容易安静坐着", dimension: "主观感受", reverse: true },
        { id: 10, text: "我感到我的心跳很快", dimension: "躯体症状" },
        { id: 11, text: "我因为一阵阵头晕而苦恼", dimension: "躯体症状" },
        { id: 12, text: "我有晕倒发作，或觉得要晕倒似的", dimension: "躯体症状" },
        { id: 13, text: "我呼气呼吸都感到很容易", dimension: "躯体症状", reverse: true },
        { id: 14, text: "我的手脚麻木和刺痛", dimension: "躯体症状" },
        { id: 15, text: "我因为胃痛和消化不良而苦恼", dimension: "躯体症状" },
        { id: 16, text: "我常常要小便", dimension: "躯体症状" },
        { id: 17, text: "我的手常常是干燥温暖的", dimension: "躯体症状", reverse: true },
        { id: 18, text: "我脸红发热", dimension: "躯体症状" },
        { id: 19, text: "我容易入睡并且一夜睡得很好", dimension: "躯体症状", reverse: true },
        { id: 20, text: "我做恶梦", dimension: "主观感受" }
    ],
    dimensions: [
        "主观感受",
        "躯体症状"
    ],
    interpretations: {
        "总分": {
            "<50": "正常范围",
            "50-59": "轻度焦虑",
            "60-69": "中度焦虑",
            ">=70": "重度焦虑"
        }
    }
};