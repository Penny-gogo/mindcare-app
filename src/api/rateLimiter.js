/**
 * MindCare 客户端限流器
 * 同时提供短时令牌桶与按身份区分的每日免费额度。
 */

const BUCKET_CONFIG = {
  maxTokens: 10,
  refillInterval: 6000,
};

// 对话次数限制已移除，保留常量定义供服务端使用
export const DAILY_QUOTA = {
  guest: Infinity,
  authenticated: Infinity,
};

let tokens = BUCKET_CONFIG.maxTokens;
let lastRefillTime = Date.now();

const sessionStats = {
  totalRequests: 0,
  totalTokensUsed: 0,
  startTime: Date.now(),
};

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
 * 对话次数限制已移除，仅保留令牌桶防突发流量。
 * @param {object|null} user 当前登录用户；为空时按游客额度计算
 */
export function tryConsumeToken() {
  refillTokens();

  // 令牌桶：防止短时间内大量并发请求
  if (tokens < 1) {
    const retryAfterMs = Math.ceil((1 - tokens) * BUCKET_CONFIG.refillInterval);
    return {
      allowed: false,
      reason: 'rate_limit',
      remaining: 0,
      dailyRemaining: Infinity,
      dailyLimit: Infinity,
      retryAfterMs,
    };
  }

  tokens -= 1;
  sessionStats.totalRequests++;

  return {
    allowed: true,
    reason: null,
    remaining: Math.floor(tokens),
    dailyRemaining: Infinity,
    dailyLimit: Infinity,
    retryAfterMs: 0,
  };
}

export function getRateLimitStatus() {
  refillTokens();

  return {
    remaining: Math.floor(tokens),
    maxRequests: BUCKET_CONFIG.maxTokens,
    resetInMs: tokens < BUCKET_CONFIG.maxTokens
      ? Math.ceil((BUCKET_CONFIG.maxTokens - tokens) * BUCKET_CONFIG.refillInterval)
      : 0,
    dailyRemaining: Infinity,
    dailyLimit: Infinity,
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