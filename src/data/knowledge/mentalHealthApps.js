// MindCare EAP知识库 - 模块十四：主流心理App评测
// lastUpdated: 2026-07-25
// 来源：App Store/Google Play数据、各平台公开信息、用户体验研究
// 价值：为MindCare功能设计提供竞品参考和差异化定位

const mentalHealthApps = {
  overview: {
    description: '整合国内外主流心理健康App的核心功能、设计亮点和可借鉴点，为MindCare提供差异化定位参考',
    designPrinciple: '不复制任何App，而是吸收各家精华，结合EAP场景做出差异化'
  },

  // 国内心理App
  domestic: {
    // 壹点灵
    yiDianLing: {
      name: '壹点灵',
      platform: 'iOS/Android/Web',
      userScale: '3000万+用户',
      coreFeatures: [
        { feature: '心理咨询', desc: '在线1对1咨询，3000+咨询师', highlight: '咨询师分级体系（实习/初级/资深/督导）' },
        { feature: '即时倾诉', desc: '7×24小时电话倾诉', highlight: '低门槛入口，不需要预约' },
        { feature: '心理测评', desc: 'SCL-90、SDS、SAS等专业量表', highlight: '测评结果自动推荐咨询师' },
        { feature: '心理课堂', desc: '心理学课程和文章', highlight: '免费内容引流，付费课程变现' },
        { feature: '情感社区', desc: '匿名倾诉和互助', highlight: '标签化话题分类' }
      ],
      designHighlights: ['咨询师详情页展示资质和评价', '首次使用引导测评', '紧急热线一键拨打'],
      borrowableForMindCare: {
        feature: '咨询师分级+测评自动推荐',
        adaptation: 'MindCare可结合EAP场景，根据测评结果推荐合适的咨询师类型'
      },
      differentiation: 'MindCare有EAP企业场景，壹点灵是C端平台；MindCare强调循证方法，壹点灵偏情感陪伴'
    },

    // 心潮
    xinChao: {
      name: '心潮',
      platform: 'iOS/Android',
      userScale: '500万+用户',
      coreFeatures: [
        { feature: 'AI情绪陪伴', desc: 'AI对话式情绪疏导', highlight: '24小时即时响应' },
        { feature: '正念冥想', desc: '引导式冥想练习', highlight: '场景化冥想（通勤/睡前/午休）' },
        { feature: '情绪日记', desc: '记录每日情绪和触发事件', highlight: '情绪趋势图表分析' },
        { feature: '白噪音', desc: '助眠和专注音效', highlight: 'DIY混音功能' }
      ],
      designHighlights: ['情绪打卡一键完成', '冥想计时器简洁设计', '数据可视化做得好'],
      borrowableForMindCare: {
        feature: '场景化冥想+情绪趋势分析',
        adaptation: 'MindCare可增加"职场场景冥想"（会前减压/午后充电/下班放松）'
      },
      differentiation: 'MindCare有专业EAP体系支撑，心潮偏轻量自助；MindCare AI对话基于专业知识库'
    },

    // 冥想星球（壹心理旗下）
    mingXiangXingQiu: {
      name: '冥想星球',
      platform: 'iOS/Android',
      userScale: '壹心理4800万用户生态',
      coreFeatures: [
        { feature: '冥想练习', desc: '200+引导冥想', highlight: '按主题分类（睡眠/减压/专注/情绪）' },
        { feature: '白噪音', desc: '自然音效和环境音', highlight: '高品质录音' },
        { feature: '呼吸练习', desc: '4-7-8/腹式呼吸等', highlight: '动画引导+计时器' },
        { feature: '每日正念', desc: '每日推送正念小练习', highlight: '降低使用门槛' }
      ],
      designHighlights: ['冥想时长统计和连续打卡', '社区分享冥想体验', '专业冥想导师录制'],
      borrowableForMindCare: {
        feature: '每日正念推送+连续打卡激励',
        adaptation: 'MindCare可设计"每日心理练习"功能，结合CBT/正念/ACT等多元方法'
      },
      differentiation: 'MindCare是综合EAP平台，冥想星球是垂直冥想工具；MindCare有AI对话和测评体系'
    }
  },

  // 国际心理App
  international: {
    // Calm
    calm: {
      name: 'Calm',
      platform: 'iOS/Android/Web',
      userScale: '1亿+下载，估值$20亿',
      coreFeatures: [
        { feature: 'Sleep Stories', desc: '名人朗读的睡前故事', highlight: 'Matthew McConaughey等明星配音' },
        { feature: '冥想课程', desc: '3-25分钟引导冥想', highlight: '7天/21天/30天系统课程' },
        { feature: '音乐', desc: '专注和放松音乐', highlight: '独家音乐制作' },
        { feature: 'Body Scan', desc: '身体扫描放松', highlight: '动画引导' }
      ],
      designHighlights: ['自然场景首页动画（雨/海/山）', '极简UI，深色主题', '睡眠追踪集成'],
      borrowableForMindCare: {
        feature: '场景化首页+系统课程设计',
        adaptation: 'MindCare首页可根据时间/天气/用户状态动态变化'
      },
      differentiation: 'Calm是纯冥想/睡眠App，MindCare是EAP综合平台；Calm偏西方正念，MindCare融合东方智慧'
    },

    // Headspace
    headspace: {
      name: 'Headspace',
      platform: 'iOS/Android/Web',
      userScale: '7000万+下载',
      coreFeatures: [
        { feature: '冥想课程', desc: '主题化10天课程', highlight: '从入门到进阶的系统路径' },
        { feature: '专注音乐', desc: '专注模式音乐', highlight: 'Focus Music功能' },
        { feature: '运动', desc: '正念运动和瑜伽', highlight: '身体+心理结合' },
        { feature: '睡眠', desc: '睡前放松和风声', highlight: 'Wind Down功能' }
      ],
      designHighlights: ['可爱的插画风格', '进度可视化（天数/时长）', 'Buddy系统（和朋友一起冥想）'],
      borrowableForMindCare: {
        feature: '系统学习路径+Buddy社交系统',
        adaptation: 'MindCare可设计"心理成长路径"和"EAP伙伴"功能'
      },
      differentiation: 'Headspace偏冥想教育，MindCare有EAP企业场景和AI对话能力'
    },

    // Woebot
    woebot: {
      name: 'Woebot',
      platform: 'iOS/Android',
      userScale: '150万+用户',
      coreFeatures: [
        { feature: 'AI对话', desc: '基于CBT的AI心理助手', highlight: '临床验证的CBT对话系统' },
        { feature: '情绪追踪', desc: '每日情绪打卡', highlight: '与对话内容关联分析' },
        { feature: '结构化课程', desc: 'CBT/ACT等自助课程', highlight: '对话式学习，不是被动阅读' },
        { feature: '危机检测', desc: '自动识别危机信号', highlight: '紧急转介到热线' }
      ],
      designHighlights: ['对话界面友好，AI角色人格化', '循证方法（CBT为主）', '临床研究背书'],
      borrowableForMindCare: {
        feature: 'CBT对话系统+危机检测',
        adaptation: 'MindCare AI对话已基于CBT，可增加ACT/SFBT等多元方法切换'
      },
      differentiation: 'Woebot只做CBT，MindCare融合8大流派；Woebot是C端，MindCare有EAP企业场景'
    }
  },

  // 冥想/助眠类垂直App
  meditationApps: {
    // 潮汐
    chaoXi: {
      name: '潮汐',
      platform: 'iOS/Android',
      userScale: '1000万+下载',
      coreFeatures: ['自然白噪音', '专注计时器（番茄钟）', '冥想引导', '呼吸练习'],
      designHighlights: ['极简东方美学设计', '场景音效高质量', '专注模式与白噪音结合'],
      borrowableForMindCare: 'MindCare可借鉴东方美学设计语言，与西方心理学方法融合'
    },
    // 小睡眠
    xiaoShuiMian: {
      name: '小睡眠',
      platform: 'iOS/Android',
      userScale: '8000万+用户',
      coreFeatures: ['白噪音/ASMR', '睡眠监测', '梦话记录', '智能闹钟'],
      designHighlights: ['社交属性（双人白噪音）', '睡眠报告详细', '梦话录制有趣'],
      borrowableForMindCare: 'MindCare可增加睡眠质量评估和改善建议，与EAP工作倦怠分析联动'
    }
  },

  // MindCare差异化定位总结
  mindCarePositioning: {
    uniqueAdvantages: [
      'EAP企业场景——不是个人工具，而是企业心理健康基础设施',
      '8大流派融合——超越单一CBT，根据用户状态智能匹配',
      '专业知识库——不是泛泛的冥想引导，而是基于循证心理学',
      'AI+人工——AI即时响应+专业咨询师深度服务',
      '树洞社区——匿名互助，借鉴北师大"雪绒花"朋辈模式'
    ],
    competitiveMoat: 'EAP行业标准+循证心理学+AI对话+企业场景，这是任何C端App无法复制的',
    designPrinciples: [
      '专业性支撑——所有功能有心理学理论依据',
      '温暖感知——专业不等于冰冷，每个交互都有温度',
      '低门槛入口——5秒内开始使用，不需要学习',
      '隐私优先——企业场景下更严格的隐私保护'
    ]
  }
};

export default mentalHealthApps;