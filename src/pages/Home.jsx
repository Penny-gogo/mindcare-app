import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">EAP 员工心理援助计划 · 循证实践</div>
          <h1>每一份心事，<br/>都值得被温柔以待</h1>
          <p className="hero-desc">
            MindCare 融合认知行为疗法（CBT）、正念减压（MBSR）与EAP行业标准，
            为你提供专业、私密、温暖的心理支持。
            <span className="hero-highlight">不是教条式的说教，而是懂你的陪伴。</span>
          </p>
          <div className="hero-actions">
            {user ? (
              <>
                <Link to="/chat" className="btn-primary">和小暖聊聊</Link>
                <Link to="/treehole" className="btn-secondary">进入树洞</Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary">免费加入</Link>
                <Link to="/login" className="btn-secondary">登录账号</Link>
              </>
            )}
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">隐私保密</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">随时陪伴</span>
            </div>
            <div className="stat">
              <span className="stat-number">11+</span>
              <span className="stat-label">专业知识模块</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-illustration">
            <div className="floating-card card-1">🧘</div>
            <div className="floating-card card-2">💬</div>
            <div className="floating-card card-3">🌿</div>
            <div className="floating-card card-4">💙</div>
          </div>
        </div>
      </section>

      {/* Warm Quote Banner */}
      <section className="quote-banner">
        <div className="quote-content">
          <span className="quote-mark">"</span>
          <p>每个人的痛苦都值得被看见，无关痛苦的命名。</p>
          <span className="quote-source">—— 华东师范大学心理健康中心</span>
        </div>
      </section>

      {/* Three Modules */}
      <section className="modules-section">
        <div className="section-header">
          <h2>三大核心模块</h2>
          <p>基于EAP行业标准，全方位守护你的心理健康</p>
        </div>
        <div className="modules-grid">
          <Link to="/treehole" className="module-card">
            <div className="module-icon" style={{ background: 'linear-gradient(135deg, #4a6cf7, #6c5ce7)' }}>
              🌳
            </div>
            <h3>匿名树洞</h3>
            <p>借鉴北师大"雪绒花"朋辈互助模式，匿名倾诉、安全释放。你的心事只有树洞知道，主管和HRBP可以关注团队情绪趋势，但永远不知道是谁说的。</p>
            <div className="module-features">
              <span className="feature-tag">匿名发帖</span>
              <span className="feature-tag">朋辈支持</span>
              <span className="feature-tag">情绪洞察</span>
            </div>
            <span className="module-arrow">→</span>
          </Link>

          <Link to="/chat" className="module-card">
            <div className="module-icon" style={{ background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)' }}>
              🤗
            </div>
            <h3>AI 心灵伙伴「小暖」</h3>
            <p>融合CBT认知重构、正念呼吸、焦虑自救等专业技巧，当你感到焦虑、压力、迷茫时，小暖会倾听、理解、温暖你——用专业的方式。</p>
            <div className="module-features">
              <span className="feature-tag">CBT技巧</span>
              <span className="feature-tag">正念引导</span>
              <span className="feature-tag">情绪急救</span>
            </div>
            <span className="module-arrow">→</span>
          </Link>

          <Link to="/assessment" className="module-card">
            <div className="module-icon" style={{ background: 'linear-gradient(135deg, #00b894, #55efc4)' }}>
              🎯
            </div>
            <h3>心理测评</h3>
            <p>参考北大《学生心理健康》课程体系，从认知自我、探索自我到发展自我，用科学的方式了解你的心理状态。</p>
            <div className="module-features">
              <span className="feature-tag">压力评估</span>
              <span className="feature-tag">情绪画像</span>
              <span className="feature-tag">专业建议</span>
            </div>
            <span className="module-arrow">→</span>
          </Link>
        </div>
      </section>

      {/* Professional Backing */}
      <section className="professional-section">
        <div className="section-header">
          <h2>专业，是我们守护你的底气</h2>
          <p>融合EAP行业标准与国内顶尖高校心理服务体系最佳实践</p>
        </div>
        <div className="professional-grid">
          <div className="pro-card">
            <div className="pro-icon">📋</div>
            <h3>EAP 六步标准流程</h3>
            <p>调查分析 → 心理普及 → 培训教育 → 心理咨询 → 转介干预 → 效果评估</p>
            <span className="pro-tag">国际EAP协会标准</span>
          </div>
          <div className="pro-card">
            <div className="pro-icon">🧠</div>
            <h3>循证心理方法</h3>
            <p>CBT认知行为疗法 · MBSR正念减压 · SFBT焦点解决 · 叙事治疗</p>
            <span className="pro-tag">经临床验证有效</span>
          </div>
          <div className="pro-card">
            <div className="pro-icon">🎓</div>
            <h3>高校体系借鉴</h3>
            <p>北师大朋辈互助 · 北大24小时热线 · 华东师大科普创作 · 三校危机干预流程</p>
            <span className="pro-tag">学术权威支撑</span>
          </div>
          <div className="pro-card">
            <div className="pro-icon">🛡️</div>
            <h3>三级支持体系</h3>
            <p>朋辈倾听（树洞）→ 专业咨询（AI+咨询师）→ 医疗转介（危机热线）</p>
            <span className="pro-tag">分层响应机制</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="steps-section">
        <div className="section-header">
          <h2>如何开始</h2>
          <p>三步开启你的心灵守护之旅</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-icon">🔐</div>
            <h3>安全登录</h3>
            <p>使用公司邮箱注册，你的信息完全保密，EAP标准保障</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-icon">💬</div>
            <h3>选择方式</h3>
            <p>树洞匿名倾诉、AI专业疏导、或科学测评，随你选择</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-icon">🌿</div>
            <h3>获得支持</h3>
            <p>收获理解、专业建议和温暖陪伴，让心灵重获力量</p>
          </div>
        </div>
      </section>

      {/* Privacy Promise */}
      <section className="privacy-section">
        <div className="privacy-card">
          <div className="privacy-icon">🛡️</div>
          <h2>隐私保护承诺</h2>
          <p>
            我们深知隐私对你的重要性。MindCare EAP 严格遵守以下原则：
          </p>
          <div className="privacy-items">
            <div className="privacy-item">
              <span className="privacy-check">✓</span>
              <span>树洞发言完全匿名，无法追溯至个人</span>
            </div>
            <div className="privacy-item">
              <span className="privacy-check">✓</span>
              <span>AI对话记录加密存储，仅你可见</span>
            </div>
            <div className="privacy-item">
              <span className="privacy-check">✓</span>
              <span>测评结果不会与绩效评估关联</span>
            </div>
            <div className="privacy-item">
              <span className="privacy-check">✓</span>
              <span>主管和HRBP仅能看到团队整体趋势</span>
            </div>
          </div>
        </div>
      </section>

      {/* Crisis Hotline */}
      <section className="crisis-section">
        <div className="section-header">
          <h2>如果你正经历困难时刻</h2>
          <p>这些专业热线24小时为你守候</p>
        </div>
        <div className="crisis-grid">
          <div className="crisis-card">
            <div className="crisis-icon">📞</div>
            <h3>全国心理援助热线</h3>
            <p className="crisis-number">400-161-9995</p>
            <span className="crisis-tag">24小时</span>
          </div>
          <div className="crisis-card">
            <div className="crisis-icon">🏥</div>
            <h3>北京回龙观医院</h3>
            <p className="crisis-number">010-82951332</p>
            <span className="crisis-tag">心理危机干预</span>
          </div>
          <div className="crisis-card">
            <div className="crisis-icon">💛</div>
            <h3>12355 青少年热线</h3>
            <p className="crisis-number">12355</p>
            <span className="crisis-tag">24小时</span>
          </div>
        </div>
        <p className="crisis-note">如果你或身边的人正在经历心理危机，请立即拨打以上热线或前往最近的三甲医院精神科。</p>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>现在就开始，给自己一份关怀</h2>
        <p>无论何时何地，MindCare 都在这里等你</p>
        {user ? (
          <Link to="/chat" className="btn-primary btn-lg">和小暖聊聊</Link>
        ) : (
          <Link to="/register" className="btn-primary btn-lg">免费注册</Link>
        )}
      </section>
    </div>
  );
}