// MindCare EAP知识库 - 统一入口
// 整合所有知识模块，提供统一访问接口

import knowledgeBase from '../knowledgeBase';
import psychologySchools from './psychologySchools';
import psychologistQuotes from './psychologistQuotes';
import mentalHealthApps from './mentalHealthApps';

// 将新模块合并到知识库
const enhancedKnowledgeBase = {
  ...knowledgeBase,
  psychologySchools,
  psychologistQuotes,
  mentalHealthApps,
};

export default enhancedKnowledgeBase;

// 模块清单（供AI对话系统引用）
export const moduleList = [
  { key: 'eap', name: 'EAP行业标准与最佳实践', type: 'core' },
  { key: 'crisisIntervention', name: '心理危机干预话术与沟通技巧', type: 'core' },
  { key: 'cbt', name: 'CBT认知行为疗法自助技巧', type: 'therapy' },
  { key: 'mindfulness', name: '正念减压MBSR核心练习', type: 'therapy' },
  { key: 'workplaceMentalHealth', name: '职场心理健康常见问题与应对', type: 'core' },
  { key: 'warmResponseTemplates', name: '温暖话术模板', type: 'core' },
  { key: 'kyInsights', name: 'KY专业洞察', type: 'platform' },
  { key: 'platformInsights', name: '专业平台精华', type: 'platform' },
  { key: 'userContributed', name: '用户供稿区', type: 'community' },
  { key: 'selfHelpToolkit', name: '专业自助技巧体系', type: 'toolkit' },
  { key: 'academicResources', name: '高校学术权威资源', type: 'academic' },
  { key: 'psychologySchools', name: '主流心理学技术流派', type: 'therapy' },
  { key: 'psychologistQuotes', name: '心理学家名人名言', type: 'reference' },
  { key: 'mentalHealthApps', name: '主流心理App评测', type: 'reference' },
];