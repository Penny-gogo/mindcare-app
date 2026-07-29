import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import knowledgeBase from '../data/knowledge/index';
import './Knowledge.css';

const TABS = [
  { key: 'academic', label: '高校学术资源', icon: '🎓' },
  { key: 'articles', label: '心理科普文章', icon: '📖' },
];

// 高校数据映射
const academicSchools = [
  { key: 'ecnu', source: 'core', label: '华东师大', tag: '科普趣文' },
  { key: 'bnu', source: 'core', label: '北师大', tag: '朋辈互助' },
  { key: 'pku', source: 'core', label: '北大', tag: '24h热线' },
  { key: 'tsinghua', source: 'expansion', label: '清华', tag: '必修课' },
  { key: 'fudan', source: 'expansion', label: '复旦', tag: '积极心理' },
  { key: 'zju', source: 'expansion', label: '浙大', tag: '数字化' },
  { key: 'whu', source: 'expansion', label: '武大', tag: '人文关怀' },
  { key: 'scnu', source: 'expansion', label: '华南师大', tag: 'A+学科' },
  { key: 'ccnu', source: 'expansion', label: '华中师大', tag: '团体咨询' },
];

function getSchoolData(school) {
  if (school.source === 'core') {
    return knowledgeBase.academicResources?.[school.key];
  }
  return knowledgeBase.academicExpansion?.[school.key];
}

// 文章分类图标映射
const categoryIcons = {
  emotionManagement: '💧',
  workplacePsychology: '💼',
  interpersonalRelationships: '👥',
  intimateRelationships: '💕',
  selfDevelopment: '🌱',
  familyOfOrigin: '🏠',
  stressAndResilience: '💪',
  sleepAndHealth: '🌙',
};

export default function Knowledge() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('academic');
  const [expandedSchool, setExpandedSchool] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedArticle, setExpandedArticle] = useState(null);

  if (!user) {
    return (
      <div className="knowledge-login-prompt">
        <span className="prompt-icon">📚</span>
        <h2>请先登录</h2>
        <p>登录后即可浏览知识库</p>
        <button onClick={() => navigate('/login')} className="btn-primary">去登录</button>
      </div>
    );
  }

  const toggleSchool = (key) => {
    setExpandedSchool(expandedSchool === key ? null : key);
  };

  const toggleCategory = (key) => {
    setExpandedCategory(expandedCategory === key ? null : key);
  };

  const toggleArticle = (catKey, artIdx) => {
    const id = `${catKey}-${artIdx}`;
    setExpandedArticle(expandedArticle === id ? null : id);
  };

  return (
    <div className="knowledge">
      <div className="knowledge-header">
        <h1>📚 知识库</h1>
        <p>融合9所顶尖高校资源与精选心理科普，为你提供专业、温暖的心理健康知识</p>
      </div>

      {/* Tab 切换 */}
      <div className="knowledge-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`knowledge-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.key); setExpandedSchool(null); setExpandedCategory(null); }}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 高校学术资源 Tab */}
      {activeTab === 'academic' && (
        <div className="knowledge-content">
          <div className="academic-intro">
            <div className="intro-badge">9所顶尖高校心理健康中心</div>
            <p>整合国内顶尖高校心理健康服务中心的权威资源与最佳实践，为EAP服务设计提供学术支撑</p>
          </div>

          <div className="school-grid">
            {academicSchools.map(school => {
              const data = getSchoolData(school);
              if (!data) return null;
              const info = data.centerInfo;
              return (
                <div
                  key={school.key}
                  className={`school-card ${expandedSchool === school.key ? 'expanded' : ''}`}
                  onClick={() => toggleSchool(school.key)}
                >
                  <div className="school-card-header">
                    <div className="school-info">
                      <span className="school-tag">{school.tag}</span>
                      <h3>{school.label}</h3>
                    </div>
                    <span className="expand-icon">{expandedSchool === school.key ? '收起' : '展开'}</span>
                  </div>
                  <p className="school-position">{info?.position}</p>

                  {expandedSchool === school.key && (
                    <div className="school-detail" onClick={e => e.stopPropagation()}>
                      {/* 特色 */}
                      {info?.features && (
                        <div className="detail-section">
                          <h4>✨ 核心特色</h4>
                          <ul className="feature-list">
                            {info.features.map((f, i) => <li key={i}>{f}</li>)}
                          </ul>
                        </div>
                      )}

                      {/* 核心项目 */}
                      {data.corePrograms && (
                        <div className="detail-section">
                          <h4>🎯 核心项目</h4>
                          <div className="program-list">
                            {data.corePrograms.map((p, i) => (
                              <div key={i} className="program-item">
                                <div className="program-title">
                                  <span className="program-type">{p.type}</span>
                                  {p.program}
                                </div>
                                <p className="program-desc">{p.desc}</p>
                                {p.mindCareMapping && (
                                  <p className="program-mapping">💡 MindCare借鉴：{p.mindCareMapping}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 关键洞察 */}
                      {data.keyInsights && (
                        <div className="detail-section">
                          <h4>💡 关键洞察</h4>
                          <div className="insight-list">
                            {data.keyInsights.map((ins, i) => (
                              <div key={i} className="insight-item">
                                <strong>{ins.insight}</strong>
                                <p>{ins.desc}</p>
                                {ins.eapApplication && (
                                  <p className="insight-eap">🏢 EAP应用：{ins.eapApplication}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 华东师大特有：科普文章 */}
                      {data.popularScienceTopics && (
                        <div className="detail-section">
                          <h4>📝 科普趣文</h4>
                          <div className="science-list">
                            {data.popularScienceTopics.map((t, i) => (
                              <div key={i} className="science-item">
                                <h5>{t.title}</h5>
                                <span className="science-theme">{t.theme}</span>
                                <p className="science-insight">💡 {t.coreInsight}</p>
                                {t.practicalTip && <p className="science-tip">🔧 {t.practicalTip}</p>}
                                {t.warmPhrase && <p className="science-warm">💛 {t.warmPhrase}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 北师大特有：朋辈体系 */}
                      {data.snowflakePeerSupport && (
                        <div className="detail-section">
                          <h4>❄️ 雪绒花朋辈互助体系</h4>
                          <p className="section-desc">{data.snowflakePeerSupport.concept}</p>
                          <div className="peer-elements">
                            {data.snowflakePeerSupport.coreElements.map((e, i) => (
                              <div key={i} className="peer-element">
                                <strong>{e.element}</strong>
                                <p>{e.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 北大特有：课程体系 */}
                      {data.mentalHealthCourse && (
                        <div className="detail-section">
                          <h4>📚 心理健康课程体系</h4>
                          <p className="section-desc">{data.mentalHealthCourse.structure} · {data.mentalHealthCourse.designPrinciple}</p>
                          <div className="course-topics">
                            {data.mentalHealthCourse.topics.map((t, i) => (
                              <div key={i} className="course-topic">
                                <strong>{t.topic}</strong>
                                <div className="course-modules">
                                  {t.modules.map((m, j) => <span key={j} className="module-tag">{m}</span>)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 九校共同最佳实践 */}
          {knowledgeBase.academicExpansion?.expandedBestPractices && (
            <div className="best-practices">
              <h2>🏆 九校共同最佳实践</h2>
              <div className="practice-list">
                {knowledgeBase.academicExpansion.expandedBestPractices.newInsights.map((ins, i) => (
                  <div key={i} className="practice-item">
                    <div className="practice-header">
                      <strong>{ins.insight}</strong>
                      <div className="practice-schools">{ins.schools.join(' · ')}</div>
                    </div>
                    <p>{ins.desc}</p>
                    <p className="practice-eap">🏢 EAP应用：{ins.eapApplication}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 三校最佳实践 */}
          {knowledgeBase.academicResources?.sharedBestPractices && (
            <div className="best-practices">
              <h2>🤝 三校共识最佳实践</h2>
              {knowledgeBase.academicResources.sharedBestPractices.crisisInterventionFlow && (
                <div className="shared-section">
                  <h3>🆘 危机干预转介流程</h3>
                  <div className="flow-steps">
                    {knowledgeBase.academicResources.sharedBestPractices.crisisInterventionFlow.steps.map((s, i) => (
                      <div key={i} className="flow-step">
                        <div className="step-num">{s.step}</div>
                        <div className="step-content">
                          <strong>{s.name}</strong>
                          <p>{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {knowledgeBase.academicResources.sharedBestPractices.peerSupportModel && (
                <div className="shared-section">
                  <h3>🤝 朋辈互助三级模型</h3>
                  <div className="peer-levels">
                    {knowledgeBase.academicResources.sharedBestPractices.peerSupportModel.levels.map((l, i) => (
                      <div key={i} className="peer-level">
                        <div className="level-badge">Level {l.level}</div>
                        <div className="level-content">
                          <strong>{l.name}</strong>
                          <p>{l.desc}</p>
                          <span className="level-examples">{l.examples}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 心理科普文章 Tab */}
      {activeTab === 'articles' && (
        <div className="knowledge-content">
          <div className="academic-intro">
            <div className="intro-badge">8大主题 · 精选心理科普</div>
            <p>从主流心理内容平台结构化采集高质量文章，每篇提炼核心洞察+实用技巧+温暖话术</p>
          </div>

          <div className="category-list">
            {Object.entries(knowledgeBase.articleCollection?.categories || {}).map(([catKey, cat]) => {
              const hasArticles = cat.articles && cat.articles.length > 0;
              return (
                <div key={catKey} className={`category-card ${expandedCategory === catKey ? 'expanded' : ''}`}>
                  <div className="category-header" onClick={() => toggleCategory(catKey)}>
                    <div className="category-info">
                      <span className="category-icon">{categoryIcons[catKey] || '📄'}</span>
                      <h3>{cat.name}</h3>
                      <span className="article-count">{hasArticles ? `${cat.articles.length}篇` : '即将更新'}</span>
                    </div>
                    <span className="expand-icon">{expandedCategory === catKey ? '收起' : '展开'}</span>
                  </div>
                  <div className="category-subtopics">
                    {cat.subtopics.map((st, i) => <span key={i} className="subtopic-tag">{st}</span>)}
                  </div>

                  {expandedCategory === catKey && (
                    <div className="category-articles">
                      {hasArticles ? (
                        cat.articles.map((art, i) => (
                          <div key={i} className="article-card">
                            <div className="article-header" onClick={() => toggleArticle(catKey, i)}>
                              <h4>{art.articleTitle}</h4>
                              <div className="article-meta">
                                <span className="article-source">{art.source.platform} · {art.source.author}</span>
                                <span className="article-date">{art.publishDate}</span>
                              </div>
                              <p className="article-summary">{art.summary}</p>
                              <div className="article-tags">
                                {art.tags.map((t, j) => <span key={j} className="article-tag">{t}</span>)}
                              </div>
                            </div>

                            {expandedArticle === `${catKey}-${i}` && (
                              <div className="article-detail">
                                {/* 核心洞察 */}
                                {art.coreInsights && (
                                  <div className="detail-section">
                                    <h4>💡 核心洞察</h4>
                                    {art.coreInsights.map((ci, j) => (
                                      <div key={j} className="insight-item">
                                        <strong>{ci.insight}</strong>
                                        <p>{ci.practicalMeaning || ci.evidence}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {/* 实用技巧 */}
                                {art.practicalTips && (
                                  <div className="detail-section">
                                    <h4>🔧 实用技巧</h4>
                                    {art.practicalTips.map((pt, j) => (
                                      <div key={j} className="tip-item">
                                        <strong>{pt.tip}</strong>
                                        {pt.steps && (
                                          <ol className="tip-steps">
                                            {pt.steps.map((s, k) => <li key={k}>{s}</li>)}
                                          </ol>
                                        )}
                                        <span className="tip-meta">{pt.difficulty} · {pt.estimatedTime}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {/* 温暖话术 */}
                                {art.warmPhrases && (
                                  <div className="detail-section">
                                    <h4>💛 温暖话术</h4>
                                    {art.warmPhrases.map((wp, j) => (
                                      <div key={j} className="warm-item">
                                        <p className="warm-phrase">"{wp.phrase}"</p>
                                        <span className="warm-scenario">适用：{wp.scenario} · 语气：{wp.tone}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="no-articles">
                          <p>📝 该主题文章正在采集中，敬请期待</p>
                          <p className="no-articles-hint">采集来源：{knowledgeBase.articleCollection?.sourceGuide && 
                            Object.values(knowledgeBase.articleCollection.sourceGuide).map(s => s.name).join('、')
                          }</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 示例文章展示 */}
          {knowledgeBase.articleCollection?.examples && knowledgeBase.articleCollection.examples.length > 0 && (
            <div className="examples-section">
              <h2>📝 文章样例</h2>
              <p className="examples-desc">以下展示文章结构化模板的效果</p>
              {knowledgeBase.articleCollection.examples.map((ex, i) => (
                <div key={i} className="example-card">
                  <h3>{ex.articleTitle}</h3>
                  <div className="article-meta">
                    <span className="article-source">{ex.source.platform} · {ex.source.author}</span>
                    <span className="article-date">{ex.publishDate}</span>
                    <span className="article-read">{ex.readCount}</span>
                  </div>
                  <p className="article-summary">{ex.summary}</p>
                  <div className="article-tags">
                    {ex.tags.map((t, j) => <span key={j} className="article-tag">{t}</span>)}
                  </div>

                  {ex.coreInsights && (
                    <div className="detail-section">
                      <h4>💡 核心洞察</h4>
                      {ex.coreInsights.map((ci, j) => (
                        <div key={j} className="insight-item">
                          <strong>{ci.insight}</strong>
                          <p>{ci.practicalMeaning}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {ex.practicalTips && (
                    <div className="detail-section">
                      <h4>🔧 实用技巧</h4>
                      {ex.practicalTips.map((pt, j) => (
                        <div key={j} className="tip-item">
                          <strong>{pt.tip}</strong>
                          {pt.steps && (
                            <ol className="tip-steps">
                              {pt.steps.map((s, k) => <li key={k}>{s}</li>)}
                            </ol>
                          )}
                          <span className="tip-meta">{pt.difficulty} · {pt.estimatedTime}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {ex.warmPhrases && (
                    <div className="detail-section">
                      <h4>💛 温暖话术</h4>
                      {ex.warmPhrases.map((wp, j) => (
                        <div key={j} className="warm-item">
                          <p className="warm-phrase">"{wp.phrase}"</p>
                          <span className="warm-scenario">适用：{wp.scenario} · 语气：{wp.tone}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}