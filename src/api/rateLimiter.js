/**
 * MindCare 客户端限流器 - 令牌桶算法
 * 防止用户过度调用API，保护免费额度
 * 
 * 配置：每分钟最多10次请求，突发允许3次
 */

const BUCKET_CONFIG = {
  maxTokens: 10,        // 桶容量：最多10个令牌
  refillRate: 1,        // 每秒补充1个令牌
  refillInterval: 6000, // 每6秒补充1个令牌（10次/分钟）
};

// 限流状态
let tokens = BUCKET_CONFIG.maxTokens;
let lastRefillTime = Date.now();

// 会话统计
const sessionStats = {
  totalRequests: 0,
  totalTokensUsed: 0,
  startTime: Date.now(),
};

/**
 * 尝试消费一个令牌
 * @returns {{ allowed: boolean, remaining: number, retryAfterMs: number }}
 */
export function tryConsumeToken() {
  refillTokens();

  if (tokens >= 1) {
    tokens -= 1;
    sessionStats.totalRequests++;
    return { allowed: true, remaining: Math.floor(tokens), retryAfterMs: 0 };
  }

  // 计算需要等待的时间
  const retryAfterMs = Math.ceil((1 - tokens) * BUCKET_CONFIG.refillInterval);
  return { allowed: false, remaining: 0, retryAfterMs };
}

/**
 * 补充令牌
 */
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
 * 获取当前限流状态
 */
export function getRateLimitStatus() {
  refillTokens();
  return {
    remaining: Math.floor(tokens),
    maxRequests: BUCKET_CONFIG.maxTokens,
    resetInMs: tokens < BUCKET_CONFIG.maxTokens
      ? Math.ceil((BUCKET_CONFIG.maxTokens - tokens) * BUCKET_CONFIG.refillInterval)
      : 0,
  };
}

/**
 * 获取会话统计
 */
export function getSessionStats() {
  return {
    ...sessionStats,
    durationMinutes: Math.round((Date.now() - sessionStats.startTime) / 60000),
  };
}

/**
 * 重置限流状态（用于调试或新会话）
 */
export function resetRateLimiter() {
  tokens = BUCKET_CONFIG.maxTokens;
  lastRefillTime = Date.now();
  sessionStats.totalRequests = 0;
  sessionStats.totalTokensUsed = 0;
  sessionStats.startTime = Date.now();
}