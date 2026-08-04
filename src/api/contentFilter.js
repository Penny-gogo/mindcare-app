/**
 * MindCare 内容安全预检 - 客户端层
 * 在发送API请求前进行本地安全检查，减少不必要请求和风险
 * 
 * 三层防护：客户端预检 → 云函数审核 → DeepSeek内置安全
 */

// ===== 危险内容模式 =====
const DANGEROUS_PATTERNS = [
  {
    pattern: /如何.*制作.*[炸弹|武器|毒药|毒品]/,
    category: 'violence',
    severity: 'high',
  },
  {
    pattern: /怎么.*[买|获取|弄到].*[枪|刀|毒]/,
    category: 'violence',
    severity: 'high',
  },
  {
    pattern: /如何.*[入侵|黑入|破解].*[系统|账户|密码]/,
    category: 'cybercrime',
    severity: 'high',
  },
  {
    pattern: /怎么.*自杀.*[最快|最不痛|方法|方式]/,
    category: 'selfharm_method',
    severity: 'high',
    note: '与危机检测不同：危机检测提供热线支持，这里阻止AI给出方法',
  },
  {
    pattern: /什么.*[死法|方式].*最[快|不痛|舒服]/,
    category: 'selfharm_method',
    severity: 'high',
  },
];

// ===== 隐私信息模式（已在aiService.js脱敏，此处做二次确认） =====
const PRIVACY_PATTERNS = {
  phone: /1[3-9]\d{9}/,
  idCard: /\d{6}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]/,
  email: /[\w.-]+@[\w.-]+\.\w+/,
  bankCard: /\d{16,19}/,
};

/**
 * 内容安全检查
 * @param {string} message - 用户消息
 * @returns {{ safe: boolean, category?: string, severity?: string, fallback?: string }}
 */
export function checkContentSafety(message) {
  if (!message || typeof message !== 'string') return { safe: true };

  // 检查危险内容模式
  for (const rule of DANGEROUS_PATTERNS) {
    if (rule.pattern.test(message)) {
      return {
        safe: false,
        category: rule.category,
        severity: rule.severity,
        fallback: getSafetyFallback(rule.category),
      };
    }
  }

  return { safe: true };
}

/**
 * 隐私信息检测（二次确认）
 * @param {string} message - 已脱敏的消息
 * @returns {{ hasPrivacy: boolean, types: string[] }}
 */
export function detectPrivacyLeaks(message) {
  if (!message) return { hasPrivacy: false, types: [] };

  const detected = [];
  if (PRIVACY_PATTERNS.phone.test(message)) detected.push('phone');
  if (PRIVACY_PATTERNS.idCard.test(message)) detected.push('idCard');
  if (PRIVACY_PATTERNS.email.test(message)) detected.push('email');
  if (PRIVACY_PATTERNS.bankCard.test(message)) detected.push('bankCard');

  return {
    hasPrivacy: detected.length > 0,
    types: detected,
  };
}

/**
 * 获取安全拦截的兜底回复
 */
function getSafetyFallback(category) {
  const fallbacks = {
    violence: '我理解你可能有很多疑问，但我无法提供可能造成伤害的信息。如果你正在经历困难，我愿意陪你聊聊，一起找到更安全的方式应对。',
    cybercrime: '这个问题我帮不了你。如果你对技术感兴趣，我们可以聊聊如何用技术做有意义的事情。',
    selfharm_method: '我听到了你的痛苦，你的感受是真实的。但我无法提供这方面的信息。\n\n请现在拨打：\n📞 全国心理援助热线：400-161-9995（24小时）\n📞 北京回龙观医院危机干预：010-82951332\n\n你不是一个人，让专业的人帮助你。',
  };
  return fallbacks[category] || '我无法回应这个请求。如果你需要心理支持，我很愿意帮助你。';
}

/**
 * 综合安全检查（供aiService调用）
 * @param {string} message - 用户原始消息
 * @param {string} sanitizedMessage - 脱敏后的消息
 * @returns {{ safe: boolean, fallback?: string, privacyWarning?: string[] }}
 */
export function comprehensiveSafetyCheck(message, sanitizedMessage) {
  // 1. 内容安全检查
  const safetyResult = checkContentSafety(message);
  if (!safetyResult.safe) {
    return { safe: false, fallback: safetyResult.fallback };
  }

  // 2. 隐私二次确认
  const privacyResult = detectPrivacyLeaks(sanitizedMessage);
  if (privacyResult.hasPrivacy) {
    // 发现未脱敏的隐私信息，记录但不阻止（脱敏已在aiService完成）
    console.warn('[ContentFilter] 检测到可能的隐私信息未完全脱敏:', privacyResult.types);
  }

  return { safe: true };
}