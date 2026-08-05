/**
 * MindCare 客户端限流器
 * 同时提供短时令牌桶与按身份区分的每日免费额度。
 */

const BUCKET_CONFIG = {
  maxTokens: 10,
  refillInterval: 6000,
};

export const DAILY_QUOTA = {
  guest: 5,
  authenticated: 20,
};

const DAILY_USAGE_KEY = 'mindcare_daily_ai_usage';

let tokens = BUCKET_CONFIG.maxTokens;
let lastRefillTime = Date.now();

const sessionStats = {
  totalRequests: 0,
  totalTokensUsed: 0,
  startTime: Date.now(),
};

function getLocalDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getIdentity(user) {
  return user?.id ? `user:${user.id}` : 'guest';
}

function getDailyLimit(user) {
  return user?.id ? DAILY_QUOTA.authenticated : DAILY_QUOTA.guest;
}

function loadDailyUsage() {
  try {
    const saved = JSON.parse(localStorage.getItem(DAILY_USAGE_KEY) || '{}');
    if (saved.date === getLocalDateKey() && saved.usage) return saved;
  } catch (error) {
    console.warn('读取每日AI额度失败:', error);
  }
  return { date: getLocalDateKey(), usage: {} };
}

function saveDailyUsage(record) {
  localStorage.setItem(DAILY_USAGE_KEY, JSON.stringify(record));
}

function refillTokens() {
  const now = Date.now();
  const elapsed = now - lastRefillTime;
  const tokensToAdd = Math.floor(elapsed / BUCKET_CONFIG.refillInterval);

  if (tokensToAdd > 0) {
    tokens = Math.min(BUCKET_CONFIG.maxTokens, tokens + tokensToAdd);
    lastRefillTime = now;
  }
}

/**
 * 尝试消费一次AI调用额度。
 * @param {object|null} user 当前登录用户；为空时按游客额度计算
 */
export function tryConsumeToken(user = null) {
  refillTokens();

  const record = loadDailyUsage();
  const identity = getIdentity(user);
  const used = record.usage[identity] || 0;
  const dailyLimit = getDailyLimit(user);

  if (used >= dailyLimit) {
    return {
      allowed: false,
      reason: 'daily_quota',
      remaining: 0,
      dailyRemaining: 0,
      dailyLimit,
      retryAfterMs: 0,
    };
  }

  if (tokens < 1) {
    const retryAfterMs = Math.ceil((1 - tokens) * BUCKET_CONFIG.refillInterval);
    return {
      allowed: false,
      reason: 'rate_limit',
      remaining: 0,
      dailyRemaining: dailyLimit - used,
      dailyLimit,
      retryAfterMs,
    };
  }

  tokens -= 1;
  record.usage[identity] = used + 1;
  saveDailyUsage(record);
  sessionStats.totalRequests++;

  return {
    allowed: true,
    reason: null,
    remaining: Math.floor(tokens),
    dailyRemaining: dailyLimit - used - 1,
    dailyLimit,
    retryAfterMs: 0,
  };
}

export function getRateLimitStatus(user = null) {
  refillTokens();
  const record = loadDailyUsage();
  const used = record.usage[getIdentity(user)] || 0;
  const dailyLimit = getDailyLimit(user);

  return {
    remaining: Math.floor(tokens),
    maxRequests: BUCKET_CONFIG.maxTokens,
    resetInMs: tokens < BUCKET_CONFIG.maxTokens
      ? Math.ceil((BUCKET_CONFIG.maxTokens - tokens) * BUCKET_CONFIG.refillInterval)
      : 0,
    dailyRemaining: Math.max(0, dailyLimit - used),
    dailyLimit,
  };
}

export function getSessionStats() {
  return {
    ...sessionStats,
    durationMinutes: Math.round((Date.now() - sessionStats.startTime) / 60000),
  };
}

export function resetRateLimiter() {
  tokens = BUCKET_CONFIG.maxTokens;
  lastRefillTime = Date.now();
  sessionStats.totalRequests = 0;
  sessionStats.totalTokensUsed = 0;
  sessionStats.startTime = Date.now();
}