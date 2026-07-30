import { View, Text, Input, Textarea, ScrollView, Progress } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import assessments, { keywordStressMap } from '../../data/assessments';
import './index.scss';

export default function Assessment() {
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0); // 0=选择, 1=进行中, 2=结果
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [keywordInput, setKeywordInput] = useState('');
  const [result, setResult] = useState<any>(null);

  // 选择测评
  const handleSelectAssessment = (assessment: any) => {
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

    const keywords = input.split(/[,，、\s]+/).filter((k: string) => k.length > 0);
    let highCount = 0, mediumCount = 0, lowCount = 0;

    keywords.forEach((kw: string) => {
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
        description: `你输入了"${input}"，这些关键词暂时无法精确匹配。你可以尝试输入更具体的情绪或状态词汇。`,
        suggestions: ['尝试输入更具体的情绪关键词', '也可以试试其他测评了解自己的状态', '如果感到不适，随时可以和小暖聊聊'],
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
  const handleImageAnswer = (questionId: string, optionId: string) => {
    const newAnswers = { ...answers, [questionId]: optionId };
    setAnswers(newAnswers);
    if (questionIndex < selectedAssessment.questions.length - 1) {
      setTimeout(() => setQuestionIndex(prev => prev + 1), 300);
    } else {
      setTimeout(() => calculateImageResult(newAnswers), 500);
    }
  };

  // 计算图片选择型结果
  const calculateImageResult = (ans: any) => {
    const tagCount: any = {};
    selectedAssessment.questions.forEach((q: any) => {
      const selectedOptionId = ans[q.id];
      const option = q.options.find((o: any) => o.id === selectedOptionId);
      if (option) {
        option.tags.forEach((tag: string) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      }
    });

    const sortedTags = Object.entries(tagCount).sort((a: any, b: any) => b[1] - a[1]);
    const topTags = sortedTags.slice(0, 3).map((t: any) => t[0]);

    const hasNegative = topTags.some((t: string) => ['压力', '疲惫', '孤独', '忧郁', '情绪化', '需要休息', '需要宣泄'].includes(t));
    const hasPositive = topTags.some((t: string) => ['平静', '温暖', '希望', '活力', '自由', '轻松', '愉悦', '平衡', '满足', '幸福', '稳定', '积极', '乐观', '韧性', '舒适'].includes(t));

    let moodType, moodDescription, moodAdvice;
    if (hasNegative && !hasPositive) {
      moodType = '需要关注';
      moodDescription = '从你的选择来看，你目前可能正承受一些压力或情绪波动。这是正常的，但值得关注。';
      moodAdvice = '建议尝试和小暖聊聊，或者给自己安排一些放松的活动。';
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
      suggestions: [moodAdvice, '定期做自我情绪检查', '保持社交连接，和信任的人交流', '如果持续感到不适，可以寻求EAP专业支持'],
      topTags,
      tagCount,
    });
    setCurrentStep(2);
  };

  // 问答型回答
  const handleQuizAnswer = (questionId: string, optionId: string, score: number) => {
    const newAnswers = { ...answers, [questionId]: { optionId, score } };
    setAnswers(newAnswers);
    if (questionIndex < selectedAssessment.questions.length - 1) {
      setTimeout(() => setQuestionIndex(prev => prev + 1), 300);
    } else {
      setTimeout(() => calculateQuizResult(newAnswers), 500);
    }
  };

  // 计算问答型结果
  const calculateQuizResult = (ans: any) => {
    const totalScore = Object.values(ans).reduce((sum: number, a: any) => sum + a.score, 0);
    const resultItem = selectedAssessment.results.find((r: any) => totalScore >= r.minScore && totalScore <= r.maxScore);
    setResult({
      ...resultItem,
      totalScore,
      maxPossibleScore: selectedAssessment.questions.length * 3,
    });
    setCurrentStep(2);
  };

  // 选择型回答
  const handleChoiceAnswer = (questionId: string, optionId: string, type: string) => {
    const newAnswers = { ...answers, [questionId]: { optionId, type } };
    setAnswers(newAnswers);
    if (questionIndex < selectedAssessment.questions.length - 1) {
      setTimeout(() => setQuestionIndex(prev => prev + 1), 300);
    } else {
      setTimeout(() => calculatePersonalityResult(newAnswers), 500);
    }
  };

  // 计算性格型结果
  const calculatePersonalityResult = (ans: any) => {
    const typeCount: any = { leader: 0, thinker: 0, connector: 0, doer: 0 };
    Object.values(ans).forEach((a: any) => {
      typeCount[a.type] = (typeCount[a.type] || 0) + 1;
    });
    const maxType = Object.entries(typeCount).sort((a: any, b: any) => b[1] - a[1])[0][0];
    const personalityResult = selectedAssessment.resultTypes[maxType];
    setResult({ ...personalityResult, typeCount, maxType });
    setCurrentStep(2);
  };

  // 进度
  const getProgress = () => {
    if (!selectedAssessment || selectedAssessment.type === 'keyword') return 0;
    return Math.round(((questionIndex + 1) / selectedAssessment.questions.length) * 100);
  };

  // ===== 渲染：测评列表 =====
  if (currentStep === 0) {
    return (
      <View className="assessment-page">
        <View className="assessment-header">
          <Text className="assessment-title">趣味测评</Text>
          <Text className="assessment-subtitle">通过轻松有趣的方式，了解自己的状态</Text>
        </View>
        <ScrollView scrollY className="assessment-list">
          {assessments.map((a: any) => (
            <View key={a.id} className="assessment-card" onClick={() => handleSelectAssessment(a)}>
              <Text className="ac-icon">{a.icon}</Text>
              <Text className="ac-title">{a.title}</Text>
              <Text className="ac-subtitle">{a.subtitle}</Text>
              <Text className="ac-desc">{a.description}</Text>
              <View className="ac-footer">
                <Text className="ac-type-badge">
                  {a.type === 'keyword' ? '关键词输入' : a.type === 'image' ? '图片选择' : a.type === 'choice' ? '情景选择' : '问答测试'}
                </Text>
                <Text className="ac-start">开始测评 →</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View className="assessment-notice">
          <Text>🔒 测评结果仅对你本人可见，不会关联到工作绩效</Text>
        </View>
      </View>
    );
  }

  // ===== 渲染：关键词输入型 =====
  if (currentStep === 1 && selectedAssessment.type === 'keyword') {
    return (
      <View className="assessment-page">
        <View className="assessment-active">
          <Text className="back-btn" onClick={handleBack}>← 返回</Text>
          <View className="keyword-assessment">
            <Text className="ka-icon">{selectedAssessment.icon}</Text>
            <Text className="ka-title">{selectedAssessment.title}</Text>
            <Text className="ka-desc">{selectedAssessment.description}</Text>
            <Textarea
              className="ka-input"
              value={keywordInput}
              onInput={(e) => setKeywordInput(e.detail.value)}
              placeholder={selectedAssessment.placeholder}
              maxlength={200}
            />
            <Text className="ka-hint">用逗号、顿号或空格分隔多个关键词</Text>
            <View
              className="ka-submit"
              onClick={analyzeKeywords}
              style={{ background: keywordInput.trim() ? selectedAssessment.color : '#ccc' }}
            >
              <Text>分析我的状态</Text>
            </View>
            <View className="ka-examples">
              <Text className="ka-examples-title">常见关键词参考：</Text>
              <View className="ka-example-tags">
                {['焦虑', '疲惫', '加班', '开心', '忙碌', '失眠', '压力', '迷茫', '充实', '烦躁'].map((kw) => (
                  <View key={kw} className="ka-example-tag" onClick={() => setKeywordInput(prev => prev ? prev + '、' + kw : kw)}>
                    <Text>{kw}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // ===== 渲染：答题进行中 =====
  if (currentStep === 1 && selectedAssessment.type !== 'keyword') {
    const question = selectedAssessment.questions[questionIndex];
    return (
      <View className="assessment-page">
        <View className="assessment-active">
          <Text className="back-btn" onClick={handleBack}>← 返回</Text>
          <View className="quiz-progress">
            <View className="quiz-progress-bar" style={{ width: `${getProgress()}%`, background: selectedAssessment.color }} />
          </View>
          <Text className="quiz-step">{questionIndex + 1} / {selectedAssessment.questions.length}</Text>
          <Text className="quiz-question">{question.question}</Text>
          <View className="quiz-options">
            {selectedAssessment.type === 'image' && question.options.map((opt: any) => (
              <View
                key={opt.id}
                className={`quiz-option image-option ${answers[question.id] === opt.id ? 'selected' : ''}`}
                onClick={() => answers[question.id] === undefined && handleImageAnswer(question.id, opt.id)}
              >
                <Text className="io-emoji">{opt.emoji}</Text>
                <Text className="io-label">{opt.label}</Text>
                <Text className="io-desc">{opt.description}</Text>
              </View>
            ))}
            {selectedAssessment.type === 'choice' && question.options.map((opt: any) => (
              <View
                key={opt.id}
                className={`quiz-option choice-option ${answers[question.id]?.optionId === opt.id ? 'selected' : ''}`}
                onClick={() => answers[question.id] === undefined && handleChoiceAnswer(question.id, opt.id, opt.type)}
              >
                <Text className="co-text">{opt.text}</Text>
                <Text className="co-label">{opt.label}</Text>
              </View>
            ))}
            {selectedAssessment.type === 'quiz' && question.options.map((opt: any) => (
              <View
                key={opt.id}
                className={`quiz-option quiz-option-btn ${answers[question.id]?.optionId === opt.id ? 'selected' : ''}`}
                onClick={() => answers[question.id] === undefined && handleQuizAnswer(question.id, opt.id, opt.score)}
              >
                <Text>{opt.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  // ===== 渲染：结果 =====
  if (currentStep === 2 && result) {
    return (
      <View className="assessment-page">
        <View className="assessment-active">
          <Text className="back-btn" onClick={handleBack}>← 重新测评</Text>
          <View className="result-card">
            <Text className="result-title">{result.title}</Text>
            <Text className="result-desc">{result.description}</Text>
            {result.suggestions && (
              <View className="result-suggestions">
                <Text className="suggestions-title">💡 建议</Text>
                {result.suggestions.map((s: string, i: number) => (
                  <View key={i} className="suggestion-item">
                    <Text className="suggestion-bullet">•</Text>
                    <Text className="suggestion-text">{s}</Text>
                  </View>
                ))}
              </View>
            )}
            <View className="result-actions">
              <View className="btn-primary" onClick={() => Taro.switchTab({ url: '/pages/chat/index' })}>
                <Text>和小暖聊聊</Text>
              </View>
              <View className="btn-secondary" onClick={handleBack}>
                <Text>再做一次测评</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return null;
}