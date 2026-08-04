// MindCare EAP知识库 - 网络心理文章结构化采集框架
// 来源分类：公众号/知乎/B站/学术期刊/书籍
// 设计原则：每篇文章提炼核心洞察+实用技巧+温暖话术，可直接被AI对话调用

const articleCollection = {
  // 采集框架元信息
  meta: {
    version: '2.0',
    lastUpdated: '2026-08-04',
    description: '从主流心理内容平台结构化采集高质量文章，为MindCare AI对话提供丰富素材',
    designPrinciple: '不是简单搬运，而是提炼精华——每篇文章提取3-5个核心洞察、1-3个实用技巧、1-2条温暖话术'
  },

  // ============================================================
  // 来源分类与采集指南
  // ============================================================
  sourceGuide: {
    wechat: {
      name: '微信公众号',
      platforms: ['KnowYourself', '壹心理', '简单心理', '北大心理健康中心', '华东师大心理中心', '京师心理大学堂'],
      collectionMethod: '复制文章全文→按模板结构化→填入对应主题',
      qualityStandard: '10万+阅读或专业机构出品，优先选择有研究引用的文章'
    },
    zhihu: {
      name: '知乎',
      platforms: ['心理学话题', '心理咨询话题', '心理健康话题'],
      collectionMethod: '筛选高赞回答（500+赞）→提炼核心观点→按模板结构化',
      qualityStandard: '高赞+专业背景认证答主，排除个人经验分享类'
    },
    bilibili: {
      name: 'B站',
      platforms: ['心理学科普UP主', '心理咨询师频道', '高校心理公开课'],
      collectionMethod: '观看视频→提取核心知识点→转化为文字模板',
      qualityStandard: '10万+播放或专业机构/认证咨询师出品'
    },
    academic: {
      name: '学术期刊',
      platforms: ['中国心理学会官网', '心理学报', '心理科学进展', '中国临床心理学杂志'],
      collectionMethod: '阅读摘要和结论→提取关键发现→用通俗语言重述',
      qualityStandard: 'CSSCI/核心期刊，近5年发表，有实证数据支撑'
    },
    books: {
      name: '心理学书籍',
      platforms: ['得到APP', '微信读书', '豆瓣阅读'],
      collectionMethod: '阅读章节→提取核心框架和金句→按模板结构化',
      qualityStandard: '豆瓣评分8.0+，专业领域经典或畅销'
    }
  },

  // ============================================================
  // 文章结构化模板
  // ============================================================
  template: {
    // 基础模板（所有文章必须填写）
    base: {
      articleTitle: '文章标题',
      source: { platform: '来源平台', author: '作者/账号名', url: '原文链接（如有）' },
      publishDate: '发布日期',
      readCount: '阅读量/播放量',
      tags: ['标签1', '标签2'],  // 用于AI匹配
      summary: '一句话摘要（20字以内）'
    },
    // 内容模板
    content: {
      coreInsights: [
        { insight: '核心洞察', evidence: '支撑证据（研究/案例）', practicalMeaning: '对普通人的意义' }
      ],
      practicalTips: [
        { tip: '实用技巧', steps: ['步骤1', '步骤2'], difficulty: '简单/中等/需要练习', estimatedTime: '预计用时' }
      ],
      warmPhrases: [
        { phrase: '温暖话术', scenario: '适用场景', tone: '语气（温和/坚定/共情）' }
      ]
    },
    // AI对话集成模板
    aiIntegration: {
      applicableScenarios: ['用户说……时使用', '用户处于……状态时使用'],
      relatedModules: ['cbt', 'mindfulness'],  // 关联知识库模块
      suggestedResponse: '基于此文章的AI回复模板'
    }
  },

  // ============================================================
  // 主题分类（扩展版）
  // ============================================================
  categories: {
    // 核心主题
    emotionManagement: {
      name: '情绪管理',
      subtopics: ['焦虑应对', '抑郁识别与自助', '愤怒管理', '情绪调节技巧', '情绪表达'],
      relatedTherapy: ['cbt', 'act', 'dbt'],
      articles: [
        {
          articleTitle: '焦虑不是你的敌人：学会与焦虑共处的5个方法',
          source: { platform: 'KnowYourself', author: 'KY主创们', url: '' },
          publishDate: '2024-06',
          readCount: '15万+',
          tags: ['焦虑', '情绪调节', 'ACT', '正念'],
          summary: '焦虑是身体的保护机制，学会与它共处比消除它更有效',
          coreInsights: [
            { insight: '焦虑是大脑的"烟雾报警器"，它的本意是保护你', evidence: '进化心理学研究：焦虑反应在人类进化中具有生存价值，帮助祖先预见危险', practicalMeaning: '你的焦虑不是故障，而是身体在努力保护你' },
            { insight: '试图消除焦虑反而会让它更强烈——"白熊效应"', evidence: 'Wegner(1987)思想抑制实验：越试图不去想某事，反而想得越多', practicalMeaning: '接纳焦虑的存在，比对抗它更有效' },
            { insight: '焦虑和兴奋的生理反应几乎相同，区别只在于你的解读', evidence: 'Brooks(2014)研究：将焦虑重新评估为兴奋的人，表现更好', practicalMeaning: '把"我好紧张"换成"我好兴奋"，可能真的有帮助' }
          ],
          practicalTips: [
            { tip: '认知解离：给焦虑起个名字', steps: ['当焦虑出现时，注意它', '给它起个名字，比如"小焦"', '说"小焦又来拜访了"而非"我好焦虑"'], difficulty: '简单', estimatedTime: '随时可用' },
            { tip: '5-4-3-2-1接地练习', steps: ['说出5个你看到的东西', '触摸4个你能碰到的东西', '聆听3种声音', '闻2种气味', '品尝1种味道'], difficulty: '简单', estimatedTime: '3-5分钟' }
          ],
          warmPhrases: [
            { phrase: '焦虑说明你在乎，在乎说明这件事对你很重要', scenario: '用户因焦虑而自责时', tone: '温和' },
            { phrase: '你不需要等到不焦虑了才开始行动，带着焦虑也可以往前走', scenario: '用户因焦虑而拖延时', tone: '坚定' }
          ],
          aiIntegration: {
            applicableScenarios: ['用户说"我好焦虑""我控制不住焦虑"时', '用户试图消除焦虑但失败时'],
            relatedModules: ['cbt', 'mindfulness'],
            suggestedResponse: '我听到你在和焦虑做斗争。其实，焦虑不是你的敌人——它是身体在努力保护你的信号。心理学研究发现，试图消除焦虑反而会让它更强烈。试试这个：给焦虑起个名字，当它出现时说"小焦又来了"，而不是"我好焦虑"。仅仅是这个小小的语言转换，就能帮你和焦虑拉开一点距离。'
          }
        },
        {
          articleTitle: '情绪低落时，这6件小事比"振作起来"更管用',
          source: { platform: '壹心理', author: '壹心理主创团', url: '' },
          publishDate: '2024-08',
          readCount: '12万+',
          tags: ['情绪低落', '抑郁自助', '行为激活', '自我关怀'],
          summary: '情绪低落时不需强行振作，微小行动比意志力更有效',
          coreInsights: [
            { insight: '行为激活比认知重构更能打破低落循环', evidence: 'Behavioral Activation研究：单纯增加愉悦活动就能显著改善抑郁症状', practicalMeaning: '不需要先"想通"再行动，行动本身就能改变情绪' },
            { insight: '意志力在低落时是稀缺资源，应依赖"微行动"', evidence: 'Baumeister意志力研究：情绪低落时自控力下降，需要降低行动门槛', practicalMeaning: '设定小到不可能失败的目标，比如"只喝一杯水"' }
          ],
          practicalTips: [
            { tip: '"2分钟法则"启动法', steps: ['选一件你平时喜欢的事', '告诉自己只做2分钟', '2分钟后如果不想继续就停下来', '大多数时候你会继续下去'], difficulty: '简单', estimatedTime: '2分钟启动' },
            { tip: '情绪低落急救清单', steps: ['在状态好时写下10件让你舒服的小事', '比如：喝热茶、听一首歌、看窗外', '低落时从清单上选一件做', '不需要做完，做一件就好'], difficulty: '需要提前准备', estimatedTime: '5-10分钟' }
          ],
          warmPhrases: [
            { phrase: '低落的时候不需要振作，只需要对自己温柔一点', scenario: '用户情绪低落、自我要求过高时', tone: '温和' },
            { phrase: '哪怕只是从床上坐起来，也是了不起的一步', scenario: '用户因低落而无法行动时', tone: '共情' }
          ],
          aiIntegration: {
            applicableScenarios: ['用户说"我什么都不想做""我提不起劲"时', '用户因情绪低落而自责时'],
            relatedModules: ['cbt', 'selfHelpToolkit'],
            suggestedResponse: '我理解你现在什么都不想做，这很正常。情绪低落的时候，意志力是稀缺资源，不需要逼自己"振作起来"。试试这个：选一件小到不可能失败的事，比如只喝一杯水，或者只听一首歌。心理学研究发现，行动本身就能改变情绪，不需要先"想通"。哪怕只是从床上坐起来，也是了不起的一步。'
          }
        },
        {
          articleTitle: '焦虑自助实用指南：7个经过科学验证的缓解方法',
          source: { platform: '壹心理', author: '临床心理学博士陈老师', url: '' },
          publishDate: '2026-07',
          readCount: '9万+',
          tags: ['焦虑', '自助技巧', '呼吸法', '渐进放松', '正念'],
          summary: '7个科学验证的焦虑自助方法，从即刻缓解到长期调节全覆盖',
          coreInsights: [
            { insight: '焦虑的生理基础是交感神经激活，所有有效方法都指向激活副交感神经', evidence: 'Porges(2011)多层迷走神经理论：调节自主神经系统是缓解焦虑的生理学路径', practicalMeaning: '呼吸、放松等身体方法不是"玄学"，而是有明确神经科学基础的' },
            { insight: '焦虑自助的关键是建立"工具箱"而非依赖单一方法', evidence: 'Barlow(2014)统一治疗方案：多种应对策略的组合比单一策略效果更好', practicalMeaning: '不同场景需要不同方法，准备越多工具越从容' },
            { insight: '规律练习比完美执行更重要——"足够好"的练习胜过"完美但不坚持"', evidence: '习惯养成研究：21天规律练习比1次完美练习更能建立神经通路', practicalMeaning: '每天练习3分钟比一周练1小时更有效' }
          ],
          practicalTips: [
            { tip: '4-7-8呼吸法（即刻缓解）', steps: ['用鼻子吸气4秒', '屏住呼吸7秒', '用嘴缓慢呼气8秒', '重复3-4个循环', '专注感受气息的流动'], difficulty: '简单', estimatedTime: '1-2分钟' },
            { tip: '渐进式肌肉放松（深度缓解）', steps: ['从脚趾开始，紧绷5秒', '突然放松，感受对比', '逐步向上：小腿→大腿→腹部→肩膀→脸部', '每个部位紧绷-放松一次', '最后感受全身放松的状态'], difficulty: '简单', estimatedTime: '10-15分钟' },
            { tip: '焦虑时间箱（长期调节）', steps: ['每天设定15分钟"焦虑时间"（如17:00-17:15）', '焦虑出现时记下来，告诉自己"到焦虑时间再想"', '在焦虑时间认真想这些担忧', '时间到了就停止，去做其他事', '逐步缩短焦虑时间'], difficulty: '中等', estimatedTime: '15分钟/天' }
          ],
          warmPhrases: [
            { phrase: '焦虑时你不需要"战胜"它，只需要给自己一个缓冲的空间', scenario: '用户焦虑发作急需缓解时', tone: '温和' },
            { phrase: '这些方法不是要消除焦虑，而是帮你和焦虑之间拉开一点距离', scenario: '用户对自助方法效果存疑时', tone: '坚定' }
          ],
          aiIntegration: {
            applicableScenarios: ['用户说"我现在很焦虑怎么办""焦虑发作了"时', '用户需要具体可操作的焦虑缓解方法时'],
            relatedModules: ['cbt', 'mindfulness', 'selfHelpToolkit'],
            suggestedResponse: '我理解你现在很焦虑。这里有几个经过科学验证的方法可以试试：最简单的是4-7-8呼吸法——用鼻子吸气4秒，屏住7秒，用嘴呼气8秒，重复3-4次。这个方法直接激活副交感神经，从生理层面缓解焦虑。如果时间充裕，可以试试渐进式肌肉放松——从脚趾开始，紧绷5秒然后放松，逐步向上。记住，这些方法不是要"战胜"焦虑，而是帮你和焦虑之间拉开一点距离。'
          }
        }
      ]
    },
    workplacePsychology: {
      name: '职场心理',
      subtopics: ['职业倦怠', '工作压力', '职场人际', '向上管理', '工作生活平衡', '职业转型'],
      relatedTherapy: ['sfbt', 'cbt'],
      articles: [
        {
          articleTitle: '职业倦怠的真相：不是你不够坚强，是你的"心理电池"没电了',
          source: { platform: '简单心理', author: '简单心理主创', url: '' },
          publishDate: '2024-05',
          readCount: '8万+',
          tags: ['职业倦怠', '心理能量', '自我关怀', '职场'],
          summary: '职业倦怠是心理能量耗尽的表现，充电比硬撑更重要',
          coreInsights: [
            { insight: '职业倦怠三维度：情绪耗竭、去人性化、成就感降低', evidence: 'Maslach职业倦怠量表(MBI)：全球最权威的倦怠评估工具', practicalMeaning: '倦怠不是"矫情"，而是有明确科学定义的心理状态' },
            { insight: '心理能量像电池，需要识别"耗电项"和"充电项"', evidence: 'Sonnentag(2018)恢复研究：工作后的心理恢复是防止倦怠的关键', practicalMeaning: '下班后的恢复质量，比工作时间长短更能预测倦怠' }
          ],
          practicalTips: [
            { tip: '心理能量审计', steps: ['列出本周所有活动', '标注每个活动是"充电"还是"耗电"', '增加充电活动，减少不必要的耗电活动', '每周回顾调整'], difficulty: '中等', estimatedTime: '20分钟/周' },
            { tip: '"心理断联"仪式', steps: ['下班时做一个小仪式（如关电脑、整理桌面）', '对自己说"今天的工作到此结束"', '换衣服或散步10分钟作为过渡', '避免下班后查看工作消息'], difficulty: '简单', estimatedTime: '5-10分钟/天' }
          ],
          warmPhrases: [
            { phrase: '倦怠不是你的错，是你的身体在告诉你需要休息', scenario: '用户因职业倦怠而自责时', tone: '温和' },
            { phrase: '承认自己累了，比硬撑着更需要勇气', scenario: '用户不愿承认倦怠时', tone: '坚定' }
          ],
          aiIntegration: {
            applicableScenarios: ['用户说"我太累了""不想上班""工作没意义"时', '用户怀疑自己职业倦怠时'],
            relatedModules: ['workplaceMentalHealth', 'cbt'],
            suggestedResponse: '我听到你很疲惫。职业倦怠不是你不够坚强，而是你的"心理电池"已经耗尽了。心理学研究发现，倦怠有三个维度：情绪耗竭、对人冷淡、成就感降低。你现在最困扰的是哪个？试试做一个"心理能量审计"——列出哪些事在充电，哪些在耗电，然后有意识地增加充电活动。承认自己累了，比硬撑着更需要勇气。'
          }
        },
        {
          articleTitle: '向上管理不是拍马屁：3个心理学技巧让领导成为你的资源',
          source: { platform: '知乎', author: '组织心理学博士陈老师', url: '' },
          publishDate: '2024-09',
          readCount: '6万+',
          tags: ['向上管理', '职场沟通', '领导关系', '职场心理'],
          summary: '向上管理是职场必备技能，核心是理解领导的需求和沟通风格',
          coreInsights: [
            { insight: '向上管理的本质是"管理期望"而非"讨好领导"', evidence: '组织行为学研究：期望管理是员工-上级关系的核心变量', practicalMeaning: '主动沟通进度和困难，比默默努力更有效' },
            { insight: '领导也有"心理安全感"需求，害怕被下属"surprise"', evidence: 'Edmondson心理安全感理论：安全感是双向的，领导也需要', practicalMeaning: '定期同步信息，减少领导的不确定感' }
          ],
          practicalTips: [
            { tip: '"5分钟周报"法', steps: ['每周五花5分钟写3句话', '第1句：本周完成了什么', '第2句：下周计划做什么', '第3句：需要领导支持什么', '用消息发给领导'], difficulty: '简单', estimatedTime: '5分钟/周' },
            { tip: 'STAR反馈法', steps: ['Situation：描述具体场景', 'Task：说明你的任务', 'Action：你做了什么', 'Result：结果是什么', '用这个框架向领导汇报，信息清晰高效'], difficulty: '中等', estimatedTime: '汇报时使用' }
          ],
          warmPhrases: [
            { phrase: '向上管理不是让你变成另一个人，而是让你被看见', scenario: '用户对向上管理有抵触时', tone: '温和' },
            { phrase: '好的职场关系是双向的，你也有权利表达自己的需求', scenario: '用户在领导面前不敢表达时', tone: '坚定' }
          ],
          aiIntegration: {
            applicableScenarios: ['用户说"领导不重视我""和领导关系不好"时', '用户想改善与上级的关系时'],
            relatedModules: ['workplaceMentalHealth', 'warmResponseTemplates'],
            suggestedResponse: '和领导的关系确实会影响工作体验。向上管理不是拍马屁，而是让领导了解你的价值和需求。试试"5分钟周报"——每周五花5分钟，告诉领导本周完成什么、下周计划什么、需要什么支持。这不需要拍马屁，只是让信息透明。好的职场关系是双向的，你也有权利被看见。'
          }
        },
        {
          articleTitle: '远程办公心理健康指南：在家工作不等于在家"消失"',
          source: { platform: 'KnowYourself', author: 'KY主创们', url: '' },
          publishDate: '2026-07',
          readCount: '11万+',
          tags: ['远程办公', '工作生活边界', '孤独感', '职场心理'],
          summary: '远程办公的隐形心理代价及科学应对策略，重建边界与连接',
          coreInsights: [
            { insight: '远程办公最大的心理风险不是效率下降，而是"边界消失"和"社交饥饿"', evidence: 'Wang(2021)大规模远程办公研究：孤独感上升67%，工作生活边界模糊是核心困扰', practicalMeaning: '在家办公的"自由"可能变成"无处可逃"，需要主动重建边界' },
            { insight: '"永远在线"的隐性压力比显性加班更消耗心理能量', evidence: 'Sull(2022)研究：远程工作者平均每天多工作48分钟，但自我感知效率更低', practicalMeaning: '你不是"不够自律"，而是缺少了通勤等自然边界信号' },
            { insight: '非正式社交的缺失（茶水间聊天、午餐）会逐步侵蚀归属感', evidence: 'Microsoft(2021)工作趋势指数：远程工作6个月后，团队内部社交资本下降约30%', practicalMeaning: '需要刻意创造"非正式连接"，不能只靠工作沟通维持关系' }
          ],
          practicalTips: [
            { tip: '"虚拟通勤"仪式', steps: ['工作前：换衣服、整理桌面、泡咖啡', '用10分钟做工作计划（代替通勤时的心里准备）', '工作后：关闭电脑、整理桌面、换衣服', '出门散步10分钟（模拟"下班路上"）'], difficulty: '简单', estimatedTime: '10分钟/次' },
            { tip: '工作生活物理分隔法', steps: ['尽量在独立房间工作（非卧室）', '如果只能在卧室，用屏风或桌布划分区域', '工作区不放个人休闲物品', '休息区不放工作物品', '下班后离开工作区，不再返回'], difficulty: '中等', estimatedTime: '一次性设置' },
            { tip: '"咖啡聊天"社交重建', steps: ['每周安排2次15分钟视频咖啡时间', '只聊非工作话题（和茶水间聊天一样）', '可以和同事，也可以和朋友', '不设议程，目的是连接而非效率'], difficulty: '简单', estimatedTime: '15分钟/次' }
          ],
          warmPhrases: [
            { phrase: '远程办公的孤独感不是你的问题，是环境缺少了自然的社交信号', scenario: '用户因远程办公感到孤独时', tone: '温和' },
            { phrase: '重建边界不是"不敬业"，而是让自己持续高效的前提', scenario: '用户因设定工作边界而内疚时', tone: '坚定' }
          ],
          aiIntegration: {
            applicableScenarios: ['用户说"在家工作好孤独""分不清工作和生活"时', '用户远程办公后出现倦怠或焦虑时'],
            relatedModules: ['workplaceMentalHealth', 'mindfulness', 'selfHelpToolkit'],
            suggestedResponse: '远程办公确实会带来一些隐形的心理挑战。研究发现，远程工作6个月后孤独感上升67%，工作生活边界模糊是最大的困扰。你不是"不够自律"——而是缺少了通勤、办公室等自然的边界信号。试试"虚拟通勤"：工作前换衣服、做计划，工作后关电脑、出门散步，用仪式感重建"上班"和"下班"的界限。重建边界不是"不敬业"，而是让自己持续高效的前提。'
          }
        }
      ]
    },
    interpersonalRelationships: {
      name: '人际关系',
      subtopics: ['社交焦虑', '沟通技巧', '边界设定', '冲突处理', '讨好型人格'],
      relatedTherapy: ['satir', 'familySystems'],
      articles: [
        {
          articleTitle: '讨好型人格自救指南：如何温柔地说"不"',
          source: { platform: 'KnowYourself', author: 'KY主创们', url: '' },
          publishDate: '2024-04',
          readCount: '20万+',
          tags: ['讨好型', '边界', '自我关怀', '沟通'],
          summary: '讨好不是善良，而是对冲突的恐惧；学会拒绝是爱自己的开始',
          coreInsights: [
            { insight: '讨好型人格的核心信念是"如果我拒绝，就会被抛弃"', evidence: 'Bowlby依恋理论：焦虑型依恋者倾向于通过讨好维持关系', practicalMeaning: '你的讨好不是性格缺陷，而是一种保护策略' },
            { insight: '说"不"不需要理由，"我不想"就是充分的理由', evidence: 'Assertiveness训练研究：清晰的边界反而赢得更多尊重', practicalMeaning: '拒绝不需要长篇解释，简洁反而更有力量' }
          ],
          practicalTips: [
            { tip: '"缓冲句"练习', steps: ['当别人提出请求时，不要立刻答应', '说"让我想想，晚点回复你"', '给自己时间考虑是否真的想做', '如果不想，用简洁的方式拒绝'], difficulty: '简单', estimatedTime: '每次对话' },
            { tip: '拒绝的三明治法', steps: ['第一层：肯定对方的请求（"谢谢你想到我"）', '中间：清晰拒绝（"这次我没办法帮忙"）', '第三层：表达善意（"希望下次有机会"）'], difficulty: '中等', estimatedTime: '1-2分钟' }
          ],
          warmPhrases: [
            { phrase: '你的善良值得被珍惜，但善良不等于有求必应', scenario: '用户因拒绝他人而内疚时', tone: '温和' },
            { phrase: '说"不"不会让你失去真正的朋友，只会帮你过滤掉不尊重你边界的人', scenario: '用户害怕拒绝会破坏关系时', tone: '坚定' }
          ],
          aiIntegration: {
            applicableScenarios: ['用户说"我不敢拒绝别人""我总是讨好别人"时', '用户因无法说"不"而疲惫时'],
            relatedModules: ['warmResponseTemplates', 'cbt'],
            suggestedResponse: '我理解你——总是照顾别人的感受，却忽略了自己的需要。讨好不是善良，而是对冲突的恐惧。心理学研究发现，焦虑型依恋的人更容易讨好，因为害怕被抛弃。但真正的善良包括对自己善良。试试"缓冲句"：当别人提请求时，不要立刻答应，说"让我想想"。给自己一个考虑的时间，你会发现，拒绝没有想象中那么可怕。'
          }
        },
        {
          articleTitle: '社交焦虑不是内向：理解并克服社交恐惧的4个关键',
          source: { platform: '壹心理', author: '心理咨询师李老师', url: '' },
          publishDate: '2024-07',
          readCount: '10万+',
          tags: ['社交焦虑', '内向', '认知偏差', '暴露疗法'],
          summary: '社交焦虑是对负面评价的恐惧，而非性格缺陷，可以通过科学方法改善',
          coreInsights: [
            { insight: '社交焦虑≠内向：内向是偏好独处，社交焦虑是害怕被评判', evidence: 'Clark & Wells(1995)社交焦虑模型：核心是"被他人负面评价"的恐惧', practicalMeaning: '你不是"性格有问题"，而是对社交场景有过度威胁评估' },
            { insight: '社交焦虑者高估了别人对自己的关注度——"聚光灯效应"', evidence: 'Gilovich(2000)聚光灯效应实验：人们高估他人注意自己的程度约2倍', practicalMeaning: '别人远没有你想象中那么在意你的表现' }
          ],
          practicalTips: [
            { tip: '注意力外移训练', steps: ['社交时注意力的3个方向：自己/他人/环境', '焦虑时注意力往往锁在自己身上', '有意识地将注意力转向外部：对方在说什么？环境有什么？', '从1分钟开始练习'], difficulty: '中等', estimatedTime: '社交场合中随时' },
            { tip: '"最坏结果"测试', steps: ['写下你担心的社交场景', '写出最坏的结果是什么', '评估最坏结果发生的概率(0-100%)', '写出最可能的结果', '对比两者差距'], difficulty: '简单', estimatedTime: '10分钟' }
          ],
          warmPhrases: [
            { phrase: '社交焦虑说明你在乎别人的感受，这份在乎本身是珍贵的', scenario: '用户因社交焦虑而自我否定时', tone: '温和' },
            { phrase: '别人没有你想象中那么在意你的表现，他们也在忙着担心自己', scenario: '用户担心被评判时', tone: '共情' }
          ],
          aiIntegration: {
            applicableScenarios: ['用户说"我害怕社交""在人前很紧张"时', '用户混淆内向和社交焦虑时'],
            relatedModules: ['cbt', 'selfHelpToolkit'],
            suggestedResponse: '我理解社交让你紧张。首先要说的是：社交焦虑不等于内向——内向是偏好独处，社交焦虑是害怕被评判。你可能在经历"聚光灯效应"：高估了别人对你的关注度。研究发现，人们高估他人注意自己的程度约2倍。换句话说，别人远没有你想象中那么在意你的表现。试试在社交时把注意力从自己身上移开，关注对方在说什么——这比"克服紧张"更有效。'
          }
        }
      ]
    },
    intimateRelationships: {
      name: '亲密关系',
      subtopics: ['依恋模式', '恋爱心理', '分手恢复', '婚姻经营', '原生家庭影响'],
      relatedTherapy: ['familySystems', 'psychoanalysis'],
      articles: [
        {
          articleTitle: '你的依恋类型决定了你的恋爱方式：3种依恋模式详解',
          source: { platform: '简单心理', author: '简单心理研究院', url: '' },
          publishDate: '2024-03',
          readCount: '18万+',
          tags: ['依恋模式', '亲密关系', '安全型', '焦虑型', '回避型'],
          summary: '了解依恋模式是理解亲密关系的第一步，模式可以改变',
          coreInsights: [
            { insight: '依恋模式形成于早年，但不是命运——它可以被"赚得的安全型"替代', evidence: 'Main & Goldwyn(1984)纵向研究：约30%的依恋模式在成年后发生转变', practicalMeaning: '你不是被童年锁定的，通过觉察和关系体验可以改变' },
            { insight: '焦虑型和回避型常常互相吸引，形成"追-逃"循环', evidence: 'Brennan(1998)研究：焦虑-回避配对是最常见的困扰组合', practicalMeaning: '你们不是"不合适"，而是陷入了可以打破的互动模式' }
          ],
          practicalTips: [
            { tip: '识别你的"依恋触发器"', steps: ['记录每次关系冲突时的感受和行为', '焦虑型：是否过度联系、害怕被抛弃？', '回避型：是否退缩、需要独处空间？', '安全型：是否能表达需求同时尊重对方？'], difficulty: '中等', estimatedTime: '持续觉察' },
            { tip: '"暂停-回归"协议', steps: ['和伴侣约定：冲突升级时任何一方可以喊暂停', '暂停时间20-30分钟（不是冷战）', '暂停时各自做情绪调节', '约定时间后回来继续沟通'], difficulty: '需要双方配合', estimatedTime: '30分钟' }
          ],
          warmPhrases: [
            { phrase: '了解依恋模式不是为了贴标签，而是为了更理解自己和对方', scenario: '用户给自己或伴侣贴标签时', tone: '温和' },
            { phrase: '你的依恋模式不是你的错，但改变它是你的责任和力量', scenario: '用户因依恋模式而自责时', tone: '坚定' }
          ],
          aiIntegration: {
            applicableScenarios: ['用户说"我总是害怕被抛弃""我需要很多安全感"时', '用户讨论恋爱模式或伴侣关系问题时'],
            relatedModules: ['warmResponseTemplates', 'psychologySchools'],
            suggestedResponse: '听起来你在亲密关系中有些困扰。了解"依恋模式"可能对你有帮助——它解释了为什么我们会在关系中表现出特定的模式。焦虑型的人容易害怕被抛弃，回避型的人容易需要过多空间。但重要的是：依恋模式不是命运，约30%的人可以在成年后转变。你愿意和我说说，你在关系中最常出现的感受是什么吗？'
          }
        },
        {
          articleTitle: '分手后如何真正走出来：不是"忘记"，而是"重新定义"',
          source: { platform: 'KnowYourself', author: 'KY主创们', url: '' },
          publishDate: '2024-02',
          readCount: '25万+',
          tags: ['分手', '失恋恢复', '意义重构', '自我成长'],
          summary: '分手恢复的关键不是忘记过去，而是重新定义这段经历对你的意义',
          coreInsights: [
            { insight: '"忘记前任"是个伪命题，真正需要的是"意义重构"', evidence: 'Park(2010)意义重构理论：创伤后成长的核心是重新建构事件意义', practicalMeaning: '不需要假装什么都没发生，而是找到这段经历的新意义' },
            { insight: '分手的痛苦程度与"自我扩张"程度正相关——你把多少自我投入了关系', evidence: 'Aron自我扩张模型：关系中的自我扩张越多，失去后痛苦越深', practicalMeaning: '痛苦说明你曾经真心投入，这份投入本身是有价值的' }
          ],
          practicalTips: [
            { tip: '"重新定义"写作练习', steps: ['写下这段关系让你学到了什么', '写下你因为这段关系而拥有的新能力', '写下你对未来关系的新期待', '不要求积极，真实就好'], difficulty: '中等', estimatedTime: '20-30分钟' },
            { tip: '自我扩张重建', steps: ['列出关系前你喜欢做的事', '每周尝试一个新活动或重拾一个旧爱好', '扩大社交圈，认识新的人', '把投入在关系中的能量重新投资给自己'], difficulty: '中等', estimatedTime: '持续进行' }
          ],
          warmPhrases: [
            { phrase: '痛苦说明你真心爱过，这份爱本身是有价值的', scenario: '用户因分手痛苦而自我否定时', tone: '温和' },
            { phrase: '你不是失去了自己，你是在重新找回自己', scenario: '用户感觉分手后迷失自我时', tone: '坚定' }
          ],
          aiIntegration: {
            applicableScenarios: ['用户说"分手了""走不出来""忘不了前任"时', '用户经历失恋痛苦时'],
            relatedModules: ['warmResponseTemplates', 'selfHelpToolkit'],
            suggestedResponse: '分手的痛苦我理解。但我想告诉你：走出来不是"忘记"，而是"重新定义"。心理学研究发现，真正有效的恢复方式是找到这段经历的新意义——它让你学到了什么？让你成为了怎样的自己？痛苦说明你真心爱过，这份爱本身是有价值的。你不是失去了自己，你是在重新找回自己。'
          }
        },
        {
          articleTitle: '从"追-逃"到"安全基地"：如何在亲密关系中建立安全感',
          source: { platform: '简单心理', author: '婚姻家庭治疗师林老师', url: '' },
          publishDate: '2026-07',
          readCount: '14万+',
          tags: ['依恋类型', '安全型依恋', '亲密关系', '情绪聚焦疗法', 'EFT'],
          summary: '依恋模式不是命运，通过觉察和练习可以发展出"赚得的安全型"依恋',
          coreInsights: [
            { insight: '依恋模式可以在成年后改变——"赚得的安全型依恋"(Earned Secure Attachment)是真实存在的', evidence: 'Roisman(2002)纵向研究：通过治疗关系或安全型伴侣关系，约30-40%的不安全依恋者发展为赚得的安全型', practicalMeaning: '你的依恋模式不是命中注定，安全型依恋可以"赚到"' },
            { insight: '亲密关系冲突的核心不是"问题本身"，而是"情感连接的中断"', evidence: 'Johnson(2019)情绪聚焦疗法(EFT)研究：70-75%的伴侣在EFT后恢复安全连接，是实证最有效的伴侣治疗', practicalMeaning: '吵架的表面是"谁对谁错"，深层是"你还不在乎我吗"' },
            { insight: '"追-逃"模式是最常见的依恋陷阱：焦虑型追→回避型逃→追得更猛→逃得更远', evidence: 'Gottman(2015)研究：追-逃模式占关系冲突的80%以上，打破它需要双方看到底层需求', practicalMeaning: '你们不是"不合适"，而是陷入了可以打破的互动循环' }
          ],
          practicalTips: [
            { tip: '识别你的"依恋报警信号"', steps: ['焦虑型信号：频繁联系、过度解读对方行为、害怕被抛弃', '回避型信号：需要大量独处、感到窒息、情感关闭', '安全型信号：能表达需求也能尊重对方空间', '当报警信号出现时，先暂停反应，觉察"我的依恋模式被触发了"'], difficulty: '中等', estimatedTime: '持续觉察' },
            { tip: '"软启动"沟通法（替代追-逃）', steps: ['用"我感受"而非"你总是"开头', '表达底层需求而非表面抱怨', '"当你不回消息时，我感到不安，因为我需要连接感"', '提出具体可执行的请求："你能不能忙的时候说一声？"', '避免：翻旧账、人身攻击、冷暴力'], difficulty: '需要练习', estimatedTime: '每次沟通' },
            { tip: '安全基地建设练习', steps: ['每天一次5分钟"情感核对"：今天你感觉怎么样？', '每周一次"感恩分享"：这周对方做了什么让你感动的事', '每月一次"关系体检"：我们哪里做得好？哪里可以改善？', '冲突后24小时内修复：不冷战，表达"我在乎你"'], difficulty: '简单', estimatedTime: '5-30分钟不等' }
          ],
          warmPhrases: [
            { phrase: '依恋模式不是你的错，但学会安全连接是你的力量', scenario: '用户因依恋模式困扰而自责时', tone: '温和' },
            { phrase: '吵架的表面是"谁对谁错"，深层是"你还不在乎我吗"——看到这一层，冲突就开始化解了', scenario: '用户陷入关系冲突时', tone: '坚定' }
          ],
          aiIntegration: {
            applicableScenarios: ['用户说"我总是害怕被抛弃""他/她总是逃避"时', '用户讨论亲密关系中的追-逃模式时'],
            relatedModules: ['warmResponseTemplates', 'psychologySchools'],
            suggestedResponse: '听起来你在亲密关系中遇到了一些困扰。很多人不知道的是：依恋模式不是命运——约30-40%的人可以在成年后发展出"赚得的安全型"依恋。如果你发现自己总是"追"而对方总是"逃"，这不是你们"不合适"，而是陷入了最常见的依恋陷阱。吵架的表面是"谁对谁错"，深层其实是"你还不在乎我吗"。试试"软启动"沟通：用"我感受"开头，表达底层需求而非表面抱怨。看到这一层，冲突就开始化解了。'
          }
        }
      ]
    },
    selfDevelopment: {
      name: '自我发展',
      subtopics: ['自我认知', '自尊与自信', '完美主义', '拖延症', '决策困难', '意义感寻找'],
      relatedTherapy: ['humanistic', 'act'],
      articles: [
        {
          articleTitle: '拖延不是懒：理解拖延的心理机制，用3步打破循环',
          source: { platform: '壹心理', author: '壹心理研究院', url: '' },
          publishDate: '2024-01',
          readCount: '14万+',
          tags: ['拖延', '情绪调节', '自我关怀', '行为激活'],
          summary: '拖延是情绪调节问题而非时间管理问题，自我关怀比自责更有效',
          coreInsights: [
            { insight: '拖延的本质是"对负面情绪的回避"，而非懒惰', evidence: 'Sirois & Pychyl(2013)研究：拖延者面对任务时产生焦虑等负面情绪，拖延是回避这些情绪的策略', practicalMeaning: '你不是懒，你是在回避任务带来的不舒服感受' },
            { insight: '自责会让拖延更严重——形成"拖延→自责→更焦虑→更拖延"的恶性循环', evidence: 'Sirois(2014)研究：自我关怀水平越低，拖延越严重', practicalMeaning: '对自己温柔一点，反而更能开始行动' }
          ],
          practicalTips: [
            { tip: '"5分钟启动"法', steps: ['告诉自己只做5分钟', '5分钟后如果不想继续就停下来', '大多数时候启动的阻力远大于持续的阻力', '关键是降低启动门槛'], difficulty: '简单', estimatedTime: '5分钟' },
            { tip: '自我关怀三步法', steps: ['觉察：我注意到自己在拖延', '共情：拖延时有负面情绪是正常的', '鼓励：我可以在不舒服的同时往前走一小步'], difficulty: '简单', estimatedTime: '2-3分钟' }
          ],
          warmPhrases: [
            { phrase: '拖延不是你的错，是你在用回避保护自己', scenario: '用户因拖延而自责时', tone: '温和' },
            { phrase: '不需要等到不焦虑了再开始，带着焦虑迈出一小步就好', scenario: '用户因焦虑而无法启动时', tone: '坚定' }
          ],
          aiIntegration: {
            applicableScenarios: ['用户说"我又拖延了""我总是拖延"时', '用户因拖延而自责时'],
            relatedModules: ['cbt', 'selfHelpToolkit'],
            suggestedResponse: '我理解你因为拖延而自责。但心理学研究发现：拖延不是懒，而是对负面情绪的回避——你在回避任务带来的焦虑、无聊或恐惧。更关键的是，自责会让拖延更严重，形成恶性循环。试试"5分钟启动法"：告诉自己只做5分钟，5分钟后可以停下来。大多数时候，一旦开始了就会继续。关键是：对自己温柔一点，反而更能开始行动。'
          }
        },
        {
          articleTitle: '完美主义的另一面：当"追求卓越"变成自我折磨',
          source: { platform: '简单心理', author: '简单心理主创', url: '' },
          publishDate: '2024-10',
          readCount: '9万+',
          tags: ['完美主义', '自我接纳', 'CBT', '自我批评'],
          summary: '健康追求卓越和病态完美主义的关键区别在于能否接纳不完美',
          coreInsights: [
            { insight: '完美主义者的内心有一个"严苛的内在批评者"，它的声音不是你的真实想法', evidence: 'Higgins自我差异理论：现实自我与"应该自我"的差距导致痛苦', practicalMeaning: '你内心的批评声音是被植入的，不是你本来的声音' },
            { insight: '"足够好"比"完美"更健康也更高效——完美是完成的敌人', evidence: 'Winnicott"足够好的母亲"理论延伸：追求"足够好"反而产出更高质量的结果', practicalMeaning: '80分的行动比0分的完美更有价值' }
          ],
          practicalTips: [
            { tip: '给内在批评者起个名字', steps: ['注意自我批评的声音', '给它起一个名字（如"严先生"）', '当它出现时说"严先生又来了"', '与它对话：你说的有证据吗？'], difficulty: '简单', estimatedTime: '随时可用' },
            { tip: '"80分就提交"练习', steps: ['选一件正在做的事', '设定80分标准而非100分', '到80分就提交/完成', '观察结果：世界没有崩塌', '逐步降低"完美"的门槛'], difficulty: '中等', estimatedTime: '每次任务' }
          ],
          warmPhrases: [
            { phrase: '你已经够好了，只是你的内在批评者不同意', scenario: '用户自我否定时', tone: '温和' },
            { phrase: '完成比完美更重要，80分的行动比0分的完美有价值得多', scenario: '用户因追求完美而无法行动时', tone: '坚定' }
          ],
          aiIntegration: {
            applicableScenarios: ['用户说"我必须做到完美""不够好就不做"时', '用户因完美主义而焦虑或拖延时'],
            relatedModules: ['cbt', 'selfHelpToolkit'],
            suggestedResponse: '我听到你对自己要求很高。追求卓越是好事，但当"不够完美"让你焦虑或停滞时，它可能变成了负担。华东师大的研究发现：健康追求卓越和病态完美主义的关键区别，在于你是否能接纳不完美。试试给内心的批评者起个名字——当它说"不够好"时，你可以说"严先生又来了"。你会发现，那个声音不是你的真实想法。80分的行动，比0分的完美有价值得多。'
          }
        }
      ]
    },
    familyOfOrigin: {
      name: '原生家庭',
      subtopics: ['代际创伤', '家庭角色', '与父母的关系', '家庭规则', '自我分化'],
      relatedTherapy: ['familySystems', 'psychoanalysis'],
      articles: [
        {
          articleTitle: '原生家庭不是命运：如何在理解中找到改变的力量',
          source: { platform: 'KnowYourself', author: 'KY主创们', url: '' },
          publishDate: '2024-05',
          readCount: '22万+',
          tags: ['原生家庭', '自我分化', '家庭系统', '代际传递'],
          summary: '理解原生家庭不是为了追责，而是为了打破无意识的重复模式',
          coreInsights: [
            { insight: '理解原生家庭不是为了追责，而是为了"看见模式"', evidence: 'Bowen家庭系统理论：自我分化水平决定一个人在关系中保持自我的能力', practicalMeaning: '看见模式的那一刻，你就有了选择不同回应的自由' },
            { insight: '代际传递不是命运——"中断传递"本身就是一种力量', evidence: '代际创伤研究：约50%的创伤后代不会重复模式，觉察是关键变量', practicalMeaning: '你已经在思考这些问题，说明你比上一代更有觉察力' }
          ],
          practicalTips: [
            { tip: '家庭模式绘制', steps: ['画出家庭关系图（谁和谁关系如何）', '标注重复的模式（如"妈妈也这样"）', '找出你在哪些模式中', '问自己：这是我的选择，还是我在重复？'], difficulty: '中等', estimatedTime: '30-45分钟' },
            { tip: '"暂停-选择"练习', steps: ['当家庭互动触发旧模式时，先暂停', '深呼吸3次', '问自己：我现在的反应是自动的还是选择的？', '选择一个不同的回应方式'], difficulty: '需要练习', estimatedTime: '每次互动' }
          ],
          warmPhrases: [
            { phrase: '理解原生家庭不是为了追责，而是为了看见——看见就是改变的开始', scenario: '用户对原生家庭愤怒时', tone: '温和' },
            { phrase: '你已经在思考这些问题了，这本身就说明你比上一代更有力量', scenario: '用户感觉被原生家庭束缚时', tone: '坚定' }
          ],
          aiIntegration: {
            applicableScenarios: ['用户说"我像我爸妈""原生家庭影响了我"时', '用户讨论家庭模式或代际传递时'],
            relatedModules: ['warmResponseTemplates', 'psychologySchools'],
            suggestedResponse: '我理解原生家庭对你的影响。但我想说：理解原生家庭不是为了追责，而是为了"看见模式"。Bowen家庭系统理论认为，自我分化水平决定我们能否在关系中保持自我。看见模式的那一刻，你就有了选择不同回应的自由。你已经在思考这些问题了，这本身就说明你比上一代更有觉察力。试试"暂停-选择"练习：当旧模式被触发时，先暂停，问自己"这是自动的还是选择的"，然后选择一个不同的回应。'
          }
        },
        {
          articleTitle: '与父母和解不等于认同：3种健康的亲子边界',
          source: { platform: '壹心理', author: '家庭治疗师王老师', url: '' },
          publishDate: '2024-08',
          readCount: '11万+',
          tags: ['亲子关系', '边界', '自我分化', '沟通'],
          summary: '与父母和解是理解而非认同，建立边界是爱自己的表现',
          coreInsights: [
            { insight: '"和解"≠"认同"——理解父母不等于同意他们的做法', evidence: '家庭治疗研究：情感和解与行为认同是两个独立维度', practicalMeaning: '你可以在理解父母的同时，坚持自己的边界' },
            { insight: '健康的亲子边界是"连结但不融合"', evidence: 'Bowen自我分化理论：分化越高，关系越健康——既能亲密又能独立', practicalMeaning: '爱和边界不矛盾，有边界的关系反而更持久' }
          ],
          practicalTips: [
            { tip: '"我感受"句式沟通', steps: ['不用"你总是……"开头', '用"当你……的时候，我感到……"表达', '加上"因为我需要……"说明需求', '以"你能否……"提出请求'], difficulty: '中等', estimatedTime: '每次沟通' },
            { tip: '边界三步法', steps: ['觉察：什么地方让你不舒服？', '表达：温和但坚定地说出你的边界', '坚持：边界被挑战时重复表达，不解释不道歉'], difficulty: '需要练习', estimatedTime: '持续练习' }
          ],
          warmPhrases: [
            { phrase: '理解父母不等于同意他们，和解是理解而非认同', scenario: '用户在理解与认同之间困惑时', tone: '温和' },
            { phrase: '设定边界不是不爱父母，而是用更健康的方式爱', scenario: '用户因设定边界而内疚时', tone: '坚定' }
          ],
          aiIntegration: {
            applicableScenarios: ['用户说"我和父母关系不好""不知道怎么和父母相处"时', '用户在亲子边界上困惑时'],
            relatedModules: ['warmResponseTemplates', 'psychologySchools'],
            suggestedResponse: '和父母的关系确实很复杂。但我想说：和解不等于认同——你可以在理解父母的同时，坚持自己的边界。家庭治疗研究发现，健康的亲子关系是"连结但不融合"：既能亲密，又能独立。试试用"我感受"句式沟通：当你……的时候，我感到……，因为我需要……。设定边界不是不爱父母，而是用更健康的方式爱。'
          }
        }
      ]
    },
    stressAndResilience: {
      name: '压力与韧性',
      subtopics: ['压力管理', '心理韧性', '创伤恢复', '倦怠预防', '正念减压'],
      relatedTherapy: ['mindfulness', 'cbt', 'act'],
      articles: [
        {
          articleTitle: '压力思维重构：把"压力有害"换成"压力有用"的科学依据',
          source: { platform: '知乎', author: '积极心理学研究者张博士', url: '' },
          publishDate: '2024-06',
          readCount: '7万+',
          tags: ['压力', '思维重构', 'Kelly McGonigal', '心理韧性'],
          summary: '相信"压力有害"比压力本身更危险，重构压力观能改善健康和表现',
          coreInsights: [
            { insight: '相信"压力有害"的人，死亡风险比高压但不认为压力有害的人高43%', evidence: 'Keller(2012)追踪3万人8年研究：压力观念比压力水平更能预测健康', practicalMeaning: '改变对压力的看法，可能比减少压力更有效' },
            { insight: '压力反应是身体在帮你应对挑战——心跳加速是为你提供更多能量', evidence: 'Kelly McGonigal(2013)研究：将压力反应重新解读为"身体在帮你"，心血管反应更健康', practicalMeaning: '心跳加速、手心出汗不是"出问题了"，而是"身体在准备战斗"' }
          ],
          practicalTips: [
            { tip: '压力重构三步法', steps: ['觉察压力反应（心跳加速、紧张等）', '对自己说"这是身体在帮我应对挑战"', '把"我压力好大"换成"这件事对我很重要"'], difficulty: '简单', estimatedTime: '1-2分钟' },
            { tip: '"压力日记"练习', steps: ['每天记录一个压力事件', '写下你的压力反应', '写下你对压力的看法', '尝试用"有用"的角度重新解读'], difficulty: '中等', estimatedTime: '10分钟/天' }
          ],
          warmPhrases: [
            { phrase: '压力说明你在乎，在乎说明这件事对你很重要', scenario: '用户因压力而焦虑时', tone: '温和' },
            { phrase: '你的身体正在帮你应对挑战，不是在和你作对', scenario: '用户被压力反应吓到时', tone: '坚定' }
          ],
          aiIntegration: {
            applicableScenarios: ['用户说"压力太大了""压力让我受不了"时', '用户因压力反应而恐惧时'],
            relatedModules: ['cbt', 'mindfulness'],
            suggestedResponse: '我理解压力让你很不舒服。但心理学研究发现一个反直觉的事实：相信"压力有害"比压力本身更危险。追踪3万人的研究显示，高压但不认为压力有害的人，比低压但恐惧压力的人更健康。试试这个重构：当你心跳加速时，告诉自己"这是身体在帮我应对挑战"，而不是"我出问题了"。压力说明你在乎，在乎说明这件事对你很重要。'
          }
        },
        {
          articleTitle: '心理韧性不是"扛得住"：5个科学方法帮你从逆境中成长',
          source: { platform: '简单心理', author: '简单心理研究院', url: '' },
          publishDate: '2024-11',
          readCount: '8万+',
          tags: ['心理韧性', '创伤后成长', '复原力', 'ACT'],
          summary: '心理韧性不是硬扛，而是灵活适应和从逆境中学习的能力',
          coreInsights: [
            { insight: '心理韧性≠硬扛，而是"弯曲但不折断"的灵活适应能力', evidence: 'Southwick & Charney韧性研究：韧性高的人不是不痛苦，而是恢复更快', practicalMeaning: '允许自己脆弱，也是韧性的表现' },
            { insight: '创伤后成长是真实存在的——约50-70%的创伤幸存者报告了积极变化', evidence: 'Tedeschi & Calhoun(1996)创伤后成长研究：新可能性、人际关系、个人力量、精神改变、生活欣赏', practicalMeaning: '痛苦和成长可以同时存在' }
          ],
          practicalTips: [
            { tip: '"韧性账户"储蓄法', steps: ['列出让你感到有力量的5件事', '每天至少做其中1件', '记录每天的小胜利', '定期回顾"我挺过了什么"'], difficulty: '简单', estimatedTime: '5-10分钟/天' },
            { tip: '意义寻找练习', steps: ['写下当前困境', '问自己：这件事教会了我什么？', '问自己：因为这件事，我发现了自己什么能力？', '不要求积极回答，真实就好'], difficulty: '中等', estimatedTime: '15-20分钟' }
          ],
          warmPhrases: [
            { phrase: '韧性不是不倒下，而是每次倒下都能再站起来', scenario: '用户因挫折而自我怀疑时', tone: '温和' },
            { phrase: '允许自己脆弱，也是韧性的表现', scenario: '用户觉得"应该扛得住"时', tone: '共情' }
          ],
          aiIntegration: {
            applicableScenarios: ['用户说"我扛不住了""我是不是不够坚强"时', '用户经历挫折后需要力量时'],
            relatedModules: ['mindfulness', 'selfHelpToolkit'],
            suggestedResponse: '我理解你现在很艰难。但我想告诉你：心理韧性不是"扛得住"，而是"弯曲但不折断"。韧性高的人不是不痛苦，而是恢复更快。允许自己脆弱，也是韧性的表现。试试"韧性账户"：列出让你感到有力量的5件事，每天至少做1件。你不需要一下子变强大，只需要每天存一点力量。'
          }
        }
      ]
    },
    sleepAndHealth: {
      name: '睡眠与身心健康',
      subtopics: ['失眠应对', '睡眠卫生', '身心连接', '慢性疼痛心理', '躯体化症状'],
      relatedTherapy: ['mindfulness', 'cbt'],
      articles: [
        {
          articleTitle: 'CBT-I：比安眠药更持久的失眠认知行为疗法',
          source: { platform: '壹心理', author: '睡眠医学专家刘医生', url: '' },
          publishDate: '2024-04',
          readCount: '13万+',
          tags: ['失眠', 'CBT-I', '睡眠卫生', '认知行为'],
          summary: 'CBT-I是国际推荐的失眠一线治疗，效果比药物更持久且无副作用',
          coreInsights: [
            { insight: 'CBT-I是国际公认的失眠一线治疗，效果比安眠药更持久', evidence: 'AASM(美国睡眠医学会)指南：CBT-I为慢性失眠首选治疗，6个月后效果维持率远超药物', practicalMeaning: '不用依赖药物，认知行为方法可以从根本上改善睡眠' },
            { insight: '失眠的核心维持因素是"睡眠努力"——越想睡着越睡不着', evidence: 'Harvey(2002)认知模型：对睡眠的过度关注和睡眠努力反而维持失眠', practicalMeaning: '放弃"努力入睡"反而更容易睡着' }
          ],
          practicalTips: [
            { tip: '刺激控制法', steps: ['只在困的时候上床', '床只用来睡觉（不看手机、不工作）', '20分钟睡不着就起来做放松的事', '困了再回床上', '固定起床时间（包括周末）'], difficulty: '需要坚持', estimatedTime: '2-4周见效' },
            { tip: '睡眠限制法', steps: ['记录1周实际睡眠时间', '将床上时间限制为实际睡眠时间+30分钟', '不低于5.5小时', '睡眠效率>85%时增加15分钟', '逐步调整到目标睡眠时间'], difficulty: '需要坚持', estimatedTime: '4-6周见效' }
          ],
          warmPhrases: [
            { phrase: '睡不着不是你的错，但"努力入睡"会让它更严重', scenario: '用户因失眠而焦虑时', tone: '温和' },
            { phrase: 'CBT-I比安眠药更持久，而且没有副作用', scenario: '用户考虑依赖药物时', tone: '坚定' }
          ],
          aiIntegration: {
            applicableScenarios: ['用户说"我失眠了""睡不着"时', '用户考虑用安眠药时'],
            relatedModules: ['cbt', 'mindfulness'],
            suggestedResponse: '我理解失眠的痛苦。但我想告诉你一个好消息：CBT-I（失眠认知行为疗法）是国际公认的失眠一线治疗，效果比安眠药更持久，而且没有副作用。失眠的核心维持因素是"睡眠努力"——越想睡着越睡不着。试试刺激控制法：20分钟睡不着就起来做放松的事，困了再回床上。关键是：床只用来睡觉，不要在床上看手机或工作。'
          }
        },
        {
          articleTitle: '身体从不说谎：7个被忽视的躯体化信号，你的身体在替你表达情绪',
          source: { platform: 'KnowYourself', author: 'KY主创们', url: '' },
          publishDate: '2024-09',
          readCount: '16万+',
          tags: ['躯体化', '身心连接', '情绪表达', '正念'],
          summary: '说不出口的情绪，身体会替你说——学会倾听身体的信号',
          coreInsights: [
            { insight: '无法表达的情绪会通过身体症状表达——"躯体化"是身体的语言', evidence: 'Schoenberg(2010)研究：约20-50%的初级保健就诊者有无法解释的躯体症状，与情绪困扰高度相关', practicalMeaning: '反复出现的身体不适，可能需要关注情绪层面' },
            { insight: '常见的躯体化信号：头痛、胃痛、肩颈僵硬、胸闷、皮疹、月经紊乱、慢性疲劳', evidence: '心身医学研究：这些症状与焦虑、抑郁、压力有显著相关性', practicalMeaning: '当身体反复出现这些症状且查不出器质性原因时，考虑情绪因素' }
          ],
          practicalTips: [
            { tip: '身体扫描冥想', steps: ['找个安静的地方坐下或躺下', '从脚趾开始，逐一感受每个部位', '不试图改变任何感受，只是观察', '注意哪个部位紧张或不适', '问自己：这个部位在替我表达什么？'], difficulty: '中等', estimatedTime: '10-15分钟' },
            { tip: '情绪-身体连接日记', steps: ['记录身体不适的时间', '同时记录当时的情绪和事件', '一周后回顾模式', '看看身体症状和情绪是否有关联'], difficulty: '简单', estimatedTime: '5分钟/天' }
          ],
          warmPhrases: [
            { phrase: '身体从不说谎，当嘴巴说不出口的时候，身体会替你表达', scenario: '用户反复出现查不出原因的身体不适时', tone: '温和' },
            { phrase: '倾听身体的信号不是"想太多"，而是对自己负责', scenario: '用户忽视身体信号时', tone: '坚定' }
          ],
          aiIntegration: {
            applicableScenarios: ['用户说"我总是头痛/胃痛/胸闷但查不出原因"时', '用户描述身体不适但可能与情绪有关时'],
            relatedModules: ['mindfulness', 'selfHelpToolkit'],
            suggestedResponse: '我听到你身体很不舒服。你知道吗，心理学研究发现，说不出口的情绪会通过身体症状表达——这叫"躯体化"。反复出现的头痛、胃痛、肩颈僵硬、胸闷，如果查不出器质性原因，可能是身体在替你表达情绪。试试身体扫描冥想：从脚趾到头顶，逐一感受每个部位，问问自己"这个部位在替我表达什么"。身体从不说谎，倾听它的信号不是"想太多"，而是对自己负责。'
          }
        }
      ]
    }
  },

  // ============================================================
  // 示例文章（展示模板用法）
  // ============================================================
  examples: [
    {
      articleTitle: '为什么你总是觉得自己不够好？',
      source: { platform: 'KnowYourself', author: 'KY主创们', url: '' },
      publishDate: '2024-03',
      readCount: '10万+',
      tags: ['自尊', '自我批评', '内在声音', 'CBT'],
      summary: '自我批评的根源与转化方法',
      coreInsights: [
        { insight: '自我批评往往来自内化的"严苛父母"声音', evidence: 'Higgins(1987)自我差异理论：现实自我与应该自我的差距导致痛苦', practicalMeaning: '你内心的批评声音不是你的真实想法，而是被植入的' },
        { insight: '自我关怀比自我批评更能促进改变', evidence: 'Neff(2011)研究：自我关怀组比自我批评组在任务表现上更好', practicalMeaning: '对自己温柔不是放纵，而是更有效的成长方式' }
      ],
      practicalTips: [
        { tip: '给内心批评者起个名字', steps: ['注意自我批评的声音', '给它起一个名字（如"严先生"）', '当它出现时说"严先生又来了"'], difficulty: '简单', estimatedTime: '随时可用' },
        { tip: '给好朋友写信法', steps: ['想象好朋友遇到同样的困境', '你会对TA说什么', '把那些话对自己说'], difficulty: '简单', estimatedTime: '5-10分钟' }
      ],
      warmPhrases: [
        { phrase: '你已经够好了，只是你的内心批评者不同意', scenario: '用户自我否定时', tone: '温和' },
        { phrase: '对自己温柔一点，你也在努力', scenario: '用户对自己要求过高时', tone: '共情' }
      ],
      aiIntegration: {
        applicableScenarios: ['用户说"我不够好""我总是做不好"时', '用户自我评价过低时'],
        relatedModules: ['cbt', 'humanistic'],
        suggestedResponse: '我听到你在对自己很严格。有时候我们内心的批评声音很响，但它说的不一定是事实。心理学研究发现，自我关怀比自我批评更能帮助我们成长。试试这个：如果你最好的朋友遇到同样的情况，你会对TA说什么？那些话，也值得对自己说。'
      }
    }
  ],

  // ============================================================
  // 采集工作流（供定时任务使用）
  // ============================================================
  collectionWorkflow: {
    steps: [
      { step: 1, name: '筛选', desc: '从来源平台筛选高质量文章（阅读量/专业度/时效性）' },
      { step: 2, name: '阅读', desc: '通读全文，标记核心观点和关键数据' },
      { step: 3, name: '提炼', desc: '按模板提取核心洞察、实用技巧、温暖话术' },
      { step: 4, name: '分类', desc: '归入对应主题分类，标注关联知识库模块' },
      { step: 5, name: 'AI集成', desc: '编写AI回复模板，确保对话系统可调用' },
      { step: 6, name: '审核', desc: '检查专业准确性、温暖度、可操作性' }
    ],
    qualityChecklist: [
      '是否有研究/数据支撑？',
      '是否给出了具体可操作的建议？',
      '温暖话术是否自然不生硬？',
      '是否避免了标签化和简单化？',
      'AI回复模板是否可直接使用？'
    ],
    updateFrequency: '每周更新2-3篇，优先补充高频主题（情绪管理/职场心理/亲密关系）'
  }
};

export default articleCollection;