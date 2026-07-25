// MindCare EAP知识库 - 高校学术资源扩展
// 新增：清华大学、复旦大学、浙江大学、武汉大学、华南师大、华中师大
// 与knowledgeBase.js中的academicResources（华东师大/北师大/北大）互补

const academicExpansion = {
  // 清华大学心理健康教育与咨询中心
  tsinghua: {
    centerInfo: {
      name: '清华大学学生心理发展指导中心',
      position: '国内顶尖高校心理健康服务标杆，以科研驱动服务创新',
      features: [
        '心理健康课程纳入必修：全校本科生必修《大学生心理健康》',
        '清心热线：朋辈心理支持热线，学生志愿者经专业培训后值班',
        '心理危机三级预防体系：普遍预防→针对性干预→危机处理',
        '与清华-伯克利心理学研究中心深度合作，循证实践'
      ]
    },
    corePrograms: [
      { program: '清心热线', type: '朋辈支持', desc: '学生志愿者运营的心理支持热线，经专业培训和督导', mindCareMapping: 'MindCare树洞功能可借鉴朋辈热线模式' },
      { program: '《大学生心理健康》必修课', type: '课程体系', desc: '覆盖自我认知、情绪管理、人际关系、生涯规划四大模块', mindCareMapping: 'MindCare测评模块可参考课程结构设计' },
      { program: '心理危机三级预防', type: '危机干预', desc: '一级普遍预防（教育普及）→二级针对性干预（高危群体）→三级危机处理（紧急响应）', mindCareMapping: 'MindCare危机干预可参考三级预防架构' }
    ],
    keyInsights: [
      { insight: '心理健康必修课模式', desc: '将心理健康教育从"可选"变为"必选"，降低求助污名化', eapApplication: 'EAP可推动企业将心理健康培训纳入新员工必修' },
      { insight: '科研驱动服务', desc: '所有干预措施都有研究数据支撑，定期评估效果', eapApplication: 'EAP服务应建立效果评估体系，用数据说话' },
      { insight: '朋辈热线专业化', desc: '朋辈志愿者需完成40小时培训和10小时督导才能上岗', eapApplication: '企业"部门关怀员"应接受系统培训，不能仅凭热情' }
    ]
  },

  // 复旦大学心理健康教育中心
  fudan: {
    centerInfo: {
      name: '复旦大学心理健康教育中心',
      position: '以"助人自助"为核心理念，注重积极心理学导向',
      features: [
        '积极心理学特色：不只解决问题，更关注优势培养和幸福感提升',
        '五维心理健康模型：情绪/认知/社交/身体/意义五个维度',
        '"心灵之约"系列讲座：每学期10+场，覆盖常见心理话题',
        '与复旦-哈佛医学人类学合作，跨文化心理健康研究'
      ]
    },
    corePrograms: [
      { program: '五维心理健康模型', type: '评估体系', desc: '从情绪、认知、社交、身体、意义五个维度评估心理健康', mindCareMapping: 'MindCare测评可参考五维模型设计综合评估' },
      { program: '"心灵之约"讲座系列', type: '教育普及', desc: '每学期10+场主题讲座，从压力管理到亲密关系', mindCareMapping: 'MindCare可设计"心理课堂"模块，定期推送主题内容' },
      { program: '积极心理学工作坊', type: '团体活动', desc: '基于PERMA模型（积极情绪/投入/关系/意义/成就）', mindCareMapping: 'MindCare可增加"优势发现"功能，帮助用户识别和发挥优势' }
    ],
    keyInsights: [
      { insight: '积极心理学转向', desc: '从"治病理"转向"促健康"，关注人的优势和潜能', eapApplication: 'EAP不应只在问题出现时介入，也要关注员工优势发展和幸福感' },
      { insight: '五维模型', desc: '心理健康不是单一维度，而是情绪/认知/社交/身体/意义的综合', eapApplication: 'EAP测评应多维度评估，而非只关注症状' },
      { insight: '跨文化视角', desc: '心理健康受文化背景影响，不能简单套用西方模式', eapApplication: 'EAP在中国企业落地需考虑本土文化因素' }
    ]
  },

  // 浙江大学心理健康教育与咨询中心
  zju: {
    centerInfo: {
      name: '浙江大学心理健康教育与咨询中心',
      position: '多校区协同服务典范，数字化心理健康先行者',
      features: [
        '五校区协同服务：紫金港/玉泉/西溪/华家池/之江',
        '数字化心理健康平台：在线预约、在线测评、在线咨询',
        '"心之桥"朋辈互助品牌：跨校区朋辈支持网络',
        '与浙大医学院附属精神卫生中心合作，医疗转介绿色通道'
      ]
    },
    corePrograms: [
      { program: '数字化心理平台', type: '技术驱动', desc: '全流程线上化：预约→测评→咨询→随访，数据驱动决策', mindCareMapping: 'MindCare本身就是数字化平台，可借鉴浙大的全流程设计' },
      { program: '"心之桥"朋辈互助', type: '朋辈支持', desc: '跨校区朋辈支持网络，线上线下结合', mindCareMapping: 'MindCare树洞可借鉴跨部门朋辈支持模式' },
      { program: '医疗转介绿色通道', type: '危机干预', desc: '与精神卫生中心直连，危机情况快速转介', mindCareMapping: 'MindCare危机干预模块应内置医疗转介通道' }
    ],
    keyInsights: [
      { insight: '数字化全流程', desc: '从预约到随访全线上化，提高可及性和效率', eapApplication: 'EAP服务应尽量线上化，降低员工使用门槛' },
      { insight: '数据驱动决策', desc: '通过测评数据趋势分析，提前识别高风险群体', eapApplication: 'EAP可利用匿名汇总数据做组织级心理健康趋势分析' },
      { insight: '多校区协同', desc: '统一平台+分布式服务，兼顾标准化和本地化', eapApplication: '多分支机构企业EAP可参考：统一平台+各站点本地服务' }
    ]
  },

  // 武汉大学心理健康教育中心
  whu: {
    centerInfo: {
      name: '武汉大学心理健康教育中心',
      position: '以"温润如玉"的服务风格著称，注重人文关怀',
      features: [
        '"珞珈心源"品牌：以珞珈山为象征，营造温暖包容的心理服务氛围',
        '四季主题活动：春（成长）/夏（激情）/秋（收获）/冬（温暖）',
        '与武汉大学哲学学院合作，存在主义心理学特色',
        '湖北省心理危机干预中心挂靠单位'
      ]
    },
    corePrograms: [
      { program: '四季主题活动', type: '教育普及', desc: '春季成长工作坊/夏季激情释放/秋季收获感恩/冬季温暖陪伴', mindCareMapping: 'MindCare可根据季节推送不同主题内容' },
      { program: '存在主义心理学特色', type: '理论取向', desc: '关注生命意义、自由选择、存在焦虑等深层议题', mindCareMapping: 'MindCare可借鉴弗兰克尔意义疗法，帮助用户找到意义感' },
      { program: '省级危机干预中心', type: '危机干预', desc: '服务全省高校心理危机干预指导和培训', mindCareMapping: 'MindCare危机干预可参考省级中心的标准化流程' }
    ],
    keyInsights: [
      { insight: '人文关怀风格', desc: '心理服务不只是技术，更是人与人之间的温暖连接', eapApplication: 'EAP服务设计应注重"温度感"，避免过于工具化' },
      { insight: '季节性心理关怀', desc: '不同季节心理需求不同，春季易躁动、冬季易抑郁', eapApplication: 'EAP可根据季节推送针对性内容，如冬季防抑郁提醒' },
      { insight: '存在主义视角', desc: '职场倦怠的本质可能是意义感缺失，而非简单的工作压力', eapApplication: 'EAP处理职业倦怠时，应关注员工的意义感需求' }
    ]
  },

  // 华南师范大学心理学院/心理咨询研究中心
  scnu: {
    centerInfo: {
      name: '华南师范大学心理健康教育与咨询中心',
      position: '心理学A+学科支撑，研究与实践深度融合',
      features: [
        '心理学科全国A+评级，学术实力顶尖',
        '眼动追踪、脑电等实验设备用于心理咨询研究',
        '"心晴"朋辈互助团队：经严格筛选和培训的朋辈支持',
        '与广东省精神卫生中心合作，大湾区心理健康服务网络'
      ]
    },
    corePrograms: [
      { program: '研究驱动实践', type: '学术支撑', desc: '所有服务方法都有研究数据支撑，定期发表服务效果论文', mindCareMapping: 'MindCare应建立效果评估体系，用数据证明服务价值' },
      { program: '"心晴"朋辈团队', type: '朋辈支持', desc: '严格筛选（面试+培训+考核）的朋辈支持队伍', mindCareMapping: 'MindCare树洞"温暖使者"可参考筛选培训机制' },
      { program: '大湾区服务网络', type: '区域协同', desc: '连接粤港澳三地心理健康资源', mindCareMapping: 'EAP可建立跨区域服务网络，统一标准+本地资源' }
    ],
    keyInsights: [
      { insight: 'A+学科支撑', desc: '顶尖学术资源直接服务于心理健康实践', eapApplication: 'EAP应与高校心理学院建立合作，获取最新研究成果' },
      { insight: '实验方法应用', desc: '眼动追踪、脑电等技术用于研究咨询效果', eapApplication: 'EAP效果评估可引入客观指标，而非仅靠主观反馈' },
      { insight: '区域协同', desc: '大湾区心理健康服务网络实现资源互通', eapApplication: '跨地区企业EAP可建立区域服务网络' }
    ]
  },

  // 华中师范大学心理健康教育中心
  ccnu: {
    centerInfo: {
      name: '华中师范大学心理健康教育中心',
      position: '中部地区高校心理健康服务领头羊，团体咨询特色鲜明',
      features: [
        '团体心理咨询全国领先：多种主题团体持续运行',
        '与华师心理学院深度合作，临床与咨询心理学博士点',
        '"阳光伙伴"朋辈互助体系：覆盖全校的朋辈支持网络',
        '湖北省高校心理健康教育与咨询示范中心'
      ]
    },
    corePrograms: [
      { program: '团体心理咨询', type: '团体辅导', desc: '人际关系团体/情绪管理团体/正念减压团体/生涯探索团体等多种主题', mindCareMapping: 'MindCare可设计"团体支持"功能，按主题组织线上团体' },
      { program: '"阳光伙伴"体系', type: '朋辈支持', desc: '覆盖全校的朋辈支持网络，每栋宿舍楼都有阳光伙伴', mindCareMapping: 'EAP可借鉴"每栋宿舍楼"模式，在企业各部门设关怀员' },
      { program: '临床咨询培训', type: '专业培养', desc: '咨询心理学博士点，培养高水平心理咨询师', mindCareMapping: 'EAP咨询师资质认证可参考高校培养标准' }
    ],
    keyInsights: [
      { insight: '团体咨询优势', desc: '团体咨询效率高、效果好，8-12人团体可同时服务多人', eapApplication: 'EAP应大力发展团体辅导，性价比高于个体咨询' },
      { insight: '朋辈网络密度', desc: '覆盖到宿舍楼的朋辈网络，确保心理支持触达每个角落', eapApplication: '企业EAP应确保每个部门/楼层都有心理健康联络人' },
      { insight: '专业人才培养', desc: '自培咨询师确保服务质量和理论一致性', eapApplication: 'EAP应重视咨询师持续培训和督导' }
    ]
  },

  // 九校共同最佳实践扩展
  expandedBestPractices: {
    title: '九校共同最佳实践（扩展版）',
    newInsights: [
      {
        insight: '数字化全流程服务',
        schools: ['浙大', '清华'],
        desc: '从预约到随访全线上化，降低使用门槛',
        eapApplication: 'EAP服务应尽量线上化、自助化，减少人工环节'
      },
      {
        insight: '积极心理学转向',
        schools: ['复旦', '武大'],
        desc: '不只治病，更要促健康；不只解决问题，更要培养优势',
        eapApplication: 'EAP从"问题导向"转向"发展导向"，增加优势发现和幸福感提升功能'
      },
      {
        insight: '季节性心理关怀',
        schools: ['武大', '浙大'],
        desc: '不同季节心理需求不同，应针对性调整服务内容',
        eapApplication: 'EAP可根据季节推送不同主题：春季成长/夏季减压/秋季感恩/冬季温暖'
      },
      {
        insight: '团体辅导规模化',
        schools: ['华师', '复旦'],
        desc: '团体咨询效率高效果好，应大力发展',
        eapApplication: 'EAP应将团体辅导作为核心服务形式，主题化、系列化运营'
      },
      {
        insight: '朋辈支持专业化',
        schools: ['清华', '华师', '华南师大'],
        desc: '朋辈支持需系统培训（40小时+督导），不能仅凭热情',
        eapApplication: '企业"部门关怀员"应接受至少20小时培训+定期督导'
      },
      {
        insight: '科研驱动实践',
        schools: ['华南师大', '清华'],
        desc: '所有干预措施都应有研究数据支撑',
        eapApplication: 'EAP应建立效果评估体系，定期收集和分析服务数据'
      }
    ]
  }
};

export default academicExpansion;