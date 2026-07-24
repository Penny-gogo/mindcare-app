import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>💚 MindCare EAP</h3>
          <p className="footer-desc">融合CBT、MBSR与EAP行业标准，<br/>专业、私密、温暖的心理支持。</p>
          <div className="footer-academic">
            <span className="academic-label">学术支撑</span>
            <span className="academic-name">华东师大 · 北师大 · 北大</span>
          </div>
        </div>
        <div className="footer-section">
          <h3>📋 服务</h3>
          <ul>
            <li><Link to="/counselors">咨询师预约</Link></li>
            <li><Link to="/chat">AI心灵伙伴「小暖」</Link></li>
            <li><Link to="/assessment">心理测评</Link></li>
            <li><Link to="/treehole">匿名树洞</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>🆘 危机热线</h3>
          <ul className="hotline-list">
            <li><a href="tel:4001619995" className="hotline-link">400-161-9995</a> <span className="hotline-tag">全国24h</span></li>
            <li><a href="tel:01082951332" className="hotline-link">010-82951332</a> <span className="hotline-tag">回龙观</span></li>
            <li><a href="tel:12355" className="hotline-link">12355</a> <span className="hotline-tag">青少年24h</span></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>ℹ️ 关于</h3>
          <ul>
            <li><a href="#about">关于EAP</a></li>
            <li><a href="#privacy">隐私政策</a></li>
            <li><a href="#evidence">循证方法</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 MindCare EAP · 让每一颗心都被温柔以待</p>
        <p className="footer-note">本平台基于EAP行业标准与循证心理学方法，不替代专业医疗诊断</p>
      </div>
    </footer>
  );
}