import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import assessments, { keywordStressMap } from '../data/assessments';
import './Assessment.css';

export default function Assessment() {
  useAuth(); // 保持认证上下文连接
  const navigate = useNavigate();
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [currentStep, setCurrentStep] = useState(0); // 0=选择, 1=进行中, 2=结果
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [keywordInput, setKeywordInput] = useState('');
  const [result, setResult] = useState(null);

  // 选择测评
  const handleSelectAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setCurrentStep(1);
    setQuestionIndex(0);
    setAnswers({});
    setKeywordInput('');
    setResult(null);
  };

  // 返回列表
  const handleBack = () => {
    setSelectedAssessment(null);
    setCurrentStep(0);
    setQuestionIndex(0);
    setAnswers({});
    setKeywordInput('');
    setResult(null);
  };

  // 关键词分析
  const analyzeKeywords = () => {
    const input = keywordInput.trim();
    if (!input) return;

    const keywords = input.split(/[,，、\s]+/).filter(k => k.length > 0);
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;

    keywords.forEach(kw => {
      if (keywordStressMap.high.keywords.includes(kw)) highCount++;
      else if (keywordStressMap.medium.keywords.includes(kw)) mediumCount++;
      else if (keywordStressMap.low.keywords.includes(kw)) lowCount++;
    });

    let analysis;
    if (highCount > 0) {
      analysis = keywordStressMap.high.analysis;
    } else if (mediumCount > lowCount) {
      analysis = keywordStressMap.medium.analysis;
    } else if (lowCount > 0) {
      analysis = keywordStressMap.low.analysis;
    } else {
      analysis = {
        level: 'neutral',
        title: '需要更多信息 🤔',
        description: `你输入了"${input}"，这些关键词暂时无法精确匹配。你可以尝试输入更具体的情绪或状态词汇，比如：焦虑、疲惫、开心、忙碌等。`,
        suggestions: [
          '尝试输入更具体的情绪关键词',
          '也可以试试其他测评了解自己的状态',
          '如果感到不适，随时可以和AI心灵伙伴聊聊'
        ],
      };
    }

    setResult({
      ...analysis,
      inputKeywords: keywords,
      matched: { high: highCount, medium: mediumCount, low: lowCount }
    });
    setCurrentStep(2);
  };

  // 图片选择型回答
  const handleImageAnswer = (questionId, optionId) => {
    const newAnswers = { ...answers, [questionId]: optionId };
    setAnswers(newAnswers);

    // 检查是否还有下一题
    if (questionIndex < selectedAssessment.questions.length - 1) {
      setTimeout(() => setQuestionIndex(prev => prev + 1), 300);
    } else {
      // 计算结果
      setTimeout(() => calculateImageResult(newAnswers), 500);
    }
  };

  // 计算图片选择型结果
  const calculateImageResult = (ans) => {
    const tagCount = {};
    selectedAssessment.questions.forEach(q => {
      const selectedOptionId = ans[q.id];
      const option = q.options.find(o => o.id === selectedOptionId);
      if (option) {
        option.tags.forEach(tag => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      }
    });

    // 找出最多的标签
    const sortedTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]);
    const topTags = sortedTags.slice(0, 3).map(t => t[0]);

    // 根据标签组合生成结果
    let moodType, moodDescription, moodAdvice;
    const hasNegative = topTags.some(t => ['压力', '疲惫', '孤独', '忧郁', '情绪化', '需要休息', '需要宣泄'].includes(t));
    const hasPositive = topTags.some(t => ['平静', '温暖', '希望', '活力', '自由', '轻松', '愉悦', '平衡', '满足', '幸福', '稳定', '积极', '乐观', '韧性', '舒适'].includes(t));

    if (hasNegative && !hasPositive) {
      moodType = '需要关注';
      moodDescription = '从你的选择来看，你目前可能正承受一些压力或情绪波动。这是正常的，但值得关注。';
      moodAdvice = '建议尝试和AI心灵伙伴聊聊，或者给自己安排一些放松的活动。';
      
    } else if (hasPositive && !hasNegative) {
      moodType = '状态良好';
      moodDescription = '从你的选择来看，你目前的状态比较积极和平稳。继续保持这种好状态！';
      moodAdvice = '保持良好的生活节奏，也可以关注身边需要帮助的同事。';
      
    } else {
      moodType = '需要平衡';
      moodDescription = '你的选择反映出一种复杂的状态——既有积极的面向，也有一些需要关注的信号。';
      moodAdvice = '试着找到压力和放松之间的平衡点，给自己更多关注。';
      
    }

    setResult({
      level: hasNegative && !hasPositive ? 'attention' : hasPositive && !hasNegative ? 'good' : 'balanced',
      title: `情绪色彩：${moodType} 🎨`,
      description: moodDescription,
      suggestions: [
        moodAdvice,
        '定期做自我情绪检查',
        '保持社交连接，和信任的人交流',
        '如果持续感到不适，可以寻求EAP专业支持'
      ],
      topTags,
      tagCount,
    });
    setCurrentStep(2);
  };

  // 文字选择型回答
  const handleChoiceAnswer = (questionId, optionId, type) => {
    const newAnswers = { ...answers, [questionId]: { optionId, type } };
    setAnswers(newAnswers);

    if (questionIndex < selectedAssessment.questions.length - 1) {
      setTimeout(() => setQuestionIndex(prev => prev + 1), 300);
    } else {
      setTimeout(() => calculatePersonalityResult(newAnswers), 500);
    }
  };

  // 计算性格型结果
  const calculatePersonalityResult = (ans) => {
    const typeCount = { leader: 0, thinker: 0, connector: 0, doer: 0 };
    Object.values(ans).forEach(a => {
      typeCount[a.type] = (typeCount[a.type] || 0) + 1;
    });

    const maxType = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0][0];
    const personalityResult = selectedAssessment.resultTypes[maxType];

    setResult({
      ...personalityResult,
      typeCount,
      maxType,
    });
    setCurrentStep(2);
  };

  // 问答型回答
  const handleQuizAnswer = (questionId, optionId, score) => {
    const newAnswers = { ...answers, [questionId]: { optionId, score } };
    setAnswers(newAnswers);

    if (questionIndex < selectedAssessment.questions.length - 1) {
      setTimeout(() => setQuestionIndex(prev => prev + 1), 300);
    } else {
      setTimeout(() => calculateQuizResult(newAnswers), 500);
    }
  };

  // 计算问答型结果
  const calculateQuizResult = (ans) => {
    const totalScore = Object.values(ans).reduce((sum, a) => sum + a.score, 0);
    const resultItem = selectedAssessment.results.find(r => totalScore >= r.minScore && totalScore <= r.maxScore);

    setResult({
      ...resultItem,
      totalScore,
      maxPossibleScore: selectedAssessment.questions.length * 3,
    });
    setCurrentStep(2);
  };

  // 进度计算
  const getProgress = () => {
    if (!selectedAssessment || selectedAssessment.type === 'keyword') return 0;
    return Math.round(((questionIndex + 1) / selectedAssessment.questions.length) * 100);
  };

  // ===== 渲染：测评列表 =====
  if (currentStep === 0) {
    return (
      <div className="assessment-page">
        <div className="assessment-container">
          <div className="assessment-header">
            <h1>趣味测评</h1>
            <p>通过轻松有趣的方式，了解自己的状态</p>
          </div>
          <div className="assessment-grid">
            {assessments.map(a => (
              <div
                key={a.id}
                className="assessment-card"
                onClick={() => handleSelectAssessment(a)}
                style={{ '--accent': a.color }}
              >
                <span className="ac-icon">{a.icon}</span>
                <h3>{a.title}</h3>
                <p className="ac-subtitle">{a.subtitle}</p>
                <p className="ac-desc">{a.description}</p>
                <span className="ac-type-badge">
                  {a.type === 'keyword' ? '关键词输入' : a.type === 'image' ? '图片选择' : a.type === 'choice' ? '情景选择' : '问答测试'}
                </span>
                <span className="ac-start">开始测评 →</span>
              </div>
            ))}
          </div>
          <div className="assessment-notice">
            🔒 测评结果仅对你本人可见，不会关联到工作绩效或个人信息
          </div>
        </div>
      </div>
    );
  }

  // ===== 渲染：关键词输入型 =====
  if (currentStep === 1 && selectedAssessment.type === 'keyword') {
    return (
      <div className="assessment-page">
        <div className="assessment-active-container">
          <button className="back-btn" onClick={handleBack}>← 返回</button>
          <div className="keyword-assessment">
            <span className="ka-icon">{selectedAssessment.icon}</span>
            <h2>{selectedAssessment.title}</h2>
            <p>{selectedAssessment.description}</p>
            <div className="ka-input-area">
              <textarea
                value={keywordInput}
                onChange={e => setKeywordInput(e.target.value)}
                placeholder={selectedAssessment.placeholder}
                rows={4}
              />
              <div className="ka-input-footer">
                <span className="ka-hint">用逗号、顿号或空格分隔多个关键词</span>
                <button
                  className="ka-submit"
                  onClick={analyzeKeywords}
                  disabled={!keywordInput.trim()}
                  style={{ background: selectedAssessment.color }}
                >
                  分析我的状态
                </button>
              </div>
            </div>
            <div className="ka-examples">
              <p>常见关键词参考：</p>
              <div className="ka-example-tags">
                {['焦虑', '疲惫', '加班', '开心', '忙碌', '失眠', '压力', '迷茫', '充实', '烦躁'].map(kw => (
                  <span
                    key={kw}
                    className="ka-example-tag"
                    onClick={() => setKeywordInput(prev => prev ? prev + '、' + kw : kw)}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== 渲染：答题进行中 =====
  if (currentStep === 1 && selectedAssessment.type !== 'keyword') {
    const question = selectedAssessment.questions[questionIndex];
    return (
      <div className="assessment-page">
        <div className="assessment-active-container">
          <button className="back-btn" onClick={handleBack}>← 返回</button>
          <div className="quiz-progress">
            <div className="quiz-progress-bar" style={{ width: `${getProgress()}%`, background: selectedAssessment.color }}></div>
          </div>
          <div className="quiz-step">{questionIndex + 1} / {selectedAssessment.questions.length}</div>
          <div className="quiz-question">
            <h2>{question.question}</h2>
            <div className="quiz-options">
              {selectedAssessment.type === 'image' && question.options.map(opt => (
                <button
                  key={opt.id}
                  className={`quiz-option image-option ${answers[question.id] === opt.id ? 'selected' : ''}`}
                  onClick={() => handleImageAnswer(question.id, opt.id)}
                  disabled={answers[question.id] !== undefined}
                >
                  <span className="io-emoji">{opt.emoji}</span>
                  <span className="io-label">{opt.label}</span>
                  <span className="io-desc">{opt.description}</span>
                </button>
              ))}
              {selectedAssessment.type === 'choice' && question.options.map(opt => (
                <button
                  key={opt.id}
                  className={`quiz-option choice-option ${answers[question.id]?.optionId === opt.id ? 'selected' : ''}`}
                  onClick={() => handleChoiceAnswer(question.id, opt.id, opt.type)}
                  disabled={answers[question.id] !== undefined}
                >
                  <span className="co-text">{opt.text}</span>
                  <span className="co-label">{opt.label}</span>
                </button>
              ))}
              {selectedAssessment.type === 'quiz' && question.options.map(opt => (
                <button
                  key={opt.id}
                  className={`quiz-option quiz-option-btn ${answers[question.id]?.optionId === opt.id ? 'selected' : ''}`}
                  onClick={() => handleQuizAnswer(question.id, opt.id, opt.score)}
                  disabled={answers[question.id] !== undefined}
                  style={{ '--accent': selectedAssessment.color }}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== 渲染：结果页 =====
  if (currentStep === 2 && result) {
    return (
      <div className="assessment-page">
        <div className="assessment-active-container">
          <button className="back-btn" onClick={handleBack}>← 返回测评列表</button>
          <div className="result-card" style={{ '--result-color': result.color || selectedAssessment.color }}>
            <div className="result-icon">{selectedAssessment.icon}</div>
            <h2 className="result-title">{result.title}</h2>
            <p className="result-description">{result.description}</p>

            {result.totalScore !== undefined && (
              <div className="result-score-bar">
                <div className="rsb-label">得分：{result.totalScore} / {result.maxPossibleScore}</div>
                <div className="rsb-track">
                  <div
                    className="rsb-fill"
                    style={{
                      width: `${(result.totalScore / result.maxPossibleScore) * 100}%`,
                      background: result.color
                    }}
                  ></div>
                </div>
              </div>
            )}

            {result.typeCount && (
              <div className="result-type-chart">
                {Object.entries(result.typeCount).map(([type, count]) => (
                  <div key={type} className="rtc-item">
                    <span className="rtc-label">{selectedAssessment.resultTypes[type].title.split(' ')[1]}</span>
                    <div className="rtc-bar">
                      <div
                        className="rtc-fill"
                        style={{
                          width: `${(count / selectedAssessment.questions.length) * 100}%`,
                          background: selectedAssessment.resultTypes[type].color
                        }}
                      ></div>
                    </div>
                    <span className="rtc-count">{count}题</span>
                  </div>
                ))}
              </div>
            )}

            {result.topTags && (
              <div className="result-tags">
                <p>你的情绪关键词：</p>
                <div className="rt-list">
                  {result.topTags.map(tag => (
                    <span key={tag} className="rt-tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {result.inputKeywords && (
              <div className="result-keywords">
                <p>你输入的关键词：</p>
                <div className="rk-list">
                  {result.inputKeywords.map(kw => (
                    <span key={kw} className="rk-keyword">{kw}</span>
                  ))}
                </div>
              </div>
            )}

            {result.suggestions && (
              <div className="result-suggestions">
                <h3>💡 建议与行动</h3>
                <ul>
                  {result.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="result-actions">
              <button className="ra-retry" onClick={handleBack}>重新测评</button>
              <button className="ra-chat" onClick={() => navigate('/chat')}>和AI伙伴聊聊</button>
            </div>

            <p className="result-privacy">🔒 测评结果完全保密，不会影响你的工作</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}