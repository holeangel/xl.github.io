/**
 * 抑郁自评量表(SDS)数据
 * 作者：Zung, 1965
 * 中文版由王征宇等人修订
 */

const sdsData = {
    questions: [
        { id: 1, text: "我感到情绪沮丧，郁闷", dimension: "情感症状", options: ["没有或很少时间", "小部分时间", "相当多时间", "绝大部分或全部时间"] },
        { id: 2, text: "我感到早晨心情最好", dimension: "情感症状", reverse: true },
        { id: 3, text: "我要哭或想哭", dimension: "情感症状" },
        { id: 4, text: "我夜间睡眠不好", dimension: "躯体症状" },
        { id: 5, text: "我吃得跟平常一样多", dimension: "躯体症状", reverse: true },
        { id: 6, text: "我与异性接触时和以往一样感到愉快", dimension: "心理症状", reverse: true },
        { id: 7, text: "我发觉我的体重在下降", dimension: "躯体症状" },
        { id: 8, text: "我有便秘的苦恼", dimension: "躯体症状" },
        { id: 9, text: "我的心跳比平时快", dimension: "躯体症状" },
        { id: 10, text: "我无缘无故感到疲乏", dimension: "躯体症状" },
        { id: 11, text: "我的头脑跟平常一样清楚", dimension: "心理症状", reverse: true },
        { id: 12, text: "我做事情跟平常一样不感到困难", dimension: "心理症状", reverse: true },
        { id: 13, text: "我坐卧不安，难以保持平静", dimension: "心理症状" },
        { id: 14, text: "我对未来感到有希望", dimension: "心理症状", reverse: true },
        { id: 15, text: "我比平常更容易激动", dimension: "心理症状" },
        { id: 16, text: "我觉得做决定很容易", dimension: "心理症状", reverse: true },
        { id: 17, text: "我感到自己是有用的和不可缺少的人", dimension: "心理症状", reverse: true },
        { id: 18, text: "我的生活很有意义", dimension: "心理症状", reverse: true },
        { id: 19, text: "假若我死了别人会过得更好", dimension: "情感症状" },
        { id: 20, text: "我仍旧喜爱自己平常喜爱的东西", dimension: "情感症状", reverse: true }
    ],
    dimensions: [
        "情感症状",
        "躯体症状",
        "心理症状"
    ],
    interpretations: {
        "总分": {
            "<50": "正常范围",
            "50-59": "轻度抑郁",
            "60-69": "中度抑郁",
            ">=70": "重度抑郁"
        },
        "情感症状": {
            "<2": "情感症状无明显异常。",
            "2-3": "情感症状轻度异常，建议关注情绪变化。",
            ">=4": "情感症状明显异常，建议及时调整心态或寻求帮助。"
        },
        "躯体症状": {
            "<2": "躯体症状无明显异常。",
            "2-3": "躯体症状轻度异常，建议注意身体健康。",
            ">=4": "躯体症状明显异常，建议关注身体状况并适当就医。"
        },
        "心理症状": {
            "<2": "心理症状无明显异常。",
            "2-3": "心理症状轻度异常，建议关注心理状态。",
            ">=4": "心理症状明显异常，建议及时调整心态或寻求心理支持。"
        }
    }
};