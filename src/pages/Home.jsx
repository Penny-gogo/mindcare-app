import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import psychologistQuotesData from '../data/knowledge/psychologistQuotes';
import './Home.css';

// 根据日期获取每日寄语
function getDailyQuote() {
  const quotes = psychologistQuotesData.dailyQuotes;
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  return quotes[dayOfYear % quotes.length];
}

export default function Home() {
  const { user } = useAuth();
  const dailyQuote = getDailyQuote();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>嘿，你还好吗？<br/>这里有人想听你说</h1>
          <p className="hero-desc">
            生活有时候挺难的，工作压力、情绪低落、睡不好觉……
            这些都不是矫情，而是你值得被认真对待的感受。
            <span className="hero-highlight">小暖在这里，随时陪你聊聊。</span>
          </p>
          <div className="hero-actions">
            {user ? (
              <>
                <Link to="/chat" className="btn-primary">和小暖聊聊</Link>
                <Link to="/assessment" className="btn-secondary">了解自己的状态</Link>
              </>
            ) : (
              <>
                <Link to="/chat" className="btn-primary">和小暖聊聊</Link>
                <Link to="/assessment" className="btn-secondary">测一测心理状态</Link>
              </>
            )}
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">🔒</span>
              <span className="stat-label">你的心事只有你知道</span>
            </div>
            <div className="stat">
              <span className="stat-number">🌙</span>
              <span className="stat-label">任何时候都在</span>
            </div>
            <div className="stat">
              <span className="stat-number">💚</span>
              <span className="stat-label">不带评判地倾听</span>
            </div>
          </div>
          <div className="daily-quote">
            <span className="quote-icon">💡</span>
            <p className="quote-text">"{dailyQuote.quote}"</p>
            <span className="quote-author">—— {dailyQuote.author}</span>
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

      {/* Two Core Modules */}
      <section className="modules-section">
        <div className="section-header">
          <h2>当你需要的时候，我们都在</h2>
          <p>两个温暖的角落，随时等你来</p>
        </div>
        <div className="modules-grid">
          <Link to="/chat" className="module-card">
            <div className="module-icon" style={{ background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)' }}>
              🤗
            </div>
            <h3>和小暖聊天</h3>
            <p>焦虑了、压力大了、睡不着了，或者就是心里有点堵——和小暖说说，ta会认真听你讲，陪你理一理思绪，给你一些暖暖的建议。</p>
            <div className="module-features">
              <span className="feature-tag">随时倾听</span>
              <span className="feature-tag">帮你放松</span>
              <span className="feature-tag">温暖陪伴</span>
            </div>
            <span className="module-arrow">→</span>
          </Link>

          <Link to="/assessment" className="module-card">
            <div className="module-icon" style={{ background: 'linear-gradient(135deg, #00b894, #55efc4)' }}>
              🎯
            </div>
            <h3>测一测心理状态</h3>
            <p>最近压力有多大？情绪怎么样？不是考试，没有对错，只是帮你更了解自己，看看哪里需要多一点关心。</p>
            <div className="module-features">
              <span className="feature-tag">简单几步</span>
              <span className="feature-tag">了解自己</span>
              <span className="feature-tag">贴心建议</span>
            </div>
            <span className="module-arrow">→</span>
          </Link>
        </div>
      </section>

      {/* Why Trust Us - warmer version */}
      <section className="professional-section">
        <div className="section-header">
          <h2>你可以放心地打开自己</h2>
          <p>我们认真对待你说的每一句话</p>
        </div>
        <div className="professional-grid">
          <div className="pro-card">
            <div className="pro-icon">🤝</div>
            <h3>真的在听你说话</h3>
            <p>小暖不是冷冰冰的机器人，ta会记住你说过的话，关心你之前提到的困扰，在你需要的时候主动问候。</p>
            <span className="pro-tag">有温度的陪伴</span>
          </div>
          <div className="pro-card">
            <div className="pro-icon">🧠</div>
            <h3>方法是有用的</h3>
            <p>呼吸放松、情绪梳理、压力管理……小暖给你的建议都来自经过验证的心理学方法，真的能帮到你。</p>
            <span className="pro-tag">不只是安慰</span>
          </div>
          <div className="pro-card">
            <div className="pro-icon">🔐</div>
            <h3>你的秘密只有你知道</h3>
            <p>聊天记录只存在你的手机上，不会传到任何服务器，没有人能看到你说了什么。</p>
            <span className="pro-tag">完全私密</span>
          </div>
          <div className="pro-card">
            <div className="pro-icon">🆘</div>
            <h3>困难时刻，有人守候</h3>
            <p>如果你提到了伤害自己的想法，小暖会立刻给你专业的求助热线，24小时都有人接听。</p>
            <span className="pro-tag">安全底线</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="steps-section">
        <div className="section-header">
          <h2>很简单，三步就好</h2>
          <p>不需要准备什么，随时可以开始</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-icon">✨</div>
            <h3>注册一下</h3>
            <p>很快的，就填个基本信息</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-icon">💬</div>
            <h3>选个方式</h3>
            <p>和小暖聊天，或者先测一测自己的状态</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-icon">🌿</div>
            <h3>感觉好一点</h3>
            <p>被理解、被陪伴，心里会轻松一些</p>
          </div>
        </div>
      </section>

      {/* Privacy Promise */}
      <section className="privacy-section">
        <div className="privacy-card">
          <div className="privacy-icon">🛡️</div>
          <h2>你的隐私，我们很认真</h2>
          <p>
            我们知道，只有你感到安全，才愿意打开自己。
          </p>
          <div className="privacy-items">
            <div className="privacy-item">
              <span className="privacy-check">✓</span>
              <span>聊天记录只存在你的设备上，别人看不到</span>
            </div>
            <div className="privacy-item">
              <span className="privacy-check">✓</span>
              <span>测评结果只有你自己知道</span>
            </div>
            <div className="privacy-item">
              <span className="privacy-check">✓</span>
              <span>不会和你的工作表现挂钩</span>
            </div>
            <div className="privacy-item">
              <span className="privacy-check">✓</span>
              <span>你的名字和信息，我们替你守着</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>给自己几分钟，和心里那个人聊聊</h2>
        <p>无论什么时候，小暖都在</p>
        {user ? (
          <Link to="/chat" className="btn-primary btn-lg">和小暖聊聊</Link>
        ) : (
          <Link to="/chat" className="btn-primary btn-lg">试试和小暖聊聊</Link>
        )}
      </section>
    </div>
  );
}