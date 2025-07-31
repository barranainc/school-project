import axios from 'axios';

export interface AIReportRequest {
  studentId: string;
  voiceTranscription: string;
  template: string;
  context?: {
    previousReports?: any[];
    studentProfile?: any;
    academicHistory?: any;
  };
}

export interface AIReportResponse {
  reportId: string;
  content: {
    academicProgress: {
      math: number;
      reading: number;
      science: number;
      socialStudies: number;
    };
    socialDevelopment: {
      collaboration: string;
      communication: string;
      leadership: string;
    };
    areasForGrowth: string[];
    recommendations: string[];
    personalizedInsights: string[];
  };
  metadata: {
    aiModel: string;
    confidence: number;
    processingTime: number;
    language: string;
    generatedAt: string;
  };
}

export interface VoiceProcessingResult {
  transcription: string;
  confidence: number;
  language: string;
  processingTime: number;
  segments: {
    start: number;
    end: number;
    text: string;
    confidence: number;
  }[];
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
}

export interface AIInsight {
  type: 'academic' | 'social' | 'behavioral' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  evidence: string[];
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface AIPrediction {
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  timeframe: string;
  factors: string[];
  recommendations: string[];
}

class AIService {
  private baseURL = 'http://localhost:5001/api';

  // Generate AI-powered report
  async generateReport(request: AIReportRequest): Promise<AIReportResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/ai/generate-report`, {
        ...request,
        timestamp: new Date().toISOString()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error generating AI report:', error);
      // Return mock data for demo
      return {
        reportId: 'R' + Date.now(),
        content: {
          academicProgress: {
            math: 88,
            reading: 92,
            science: 85,
            socialStudies: 90,
          },
          socialDevelopment: {
            collaboration: 'Excellent',
            communication: 'Good',
            leadership: 'Developing',
          },
          areasForGrowth: [
            'Continue practicing multiplication tables',
            'Work on reading comprehension strategies',
            'Develop more confidence in group discussions'
          ],
          recommendations: [
            'Read for 20 minutes daily',
            'Practice math problems at home',
            'Encourage participation in class activities'
          ],
          personalizedInsights: [
            'Emma shows strong analytical thinking in mathematics',
            'Her reading fluency has improved significantly this month',
            'She demonstrates excellent teamwork skills during group projects'
          ]
        },
        metadata: {
          aiModel: 'GPT-4',
          confidence: 0.94,
          processingTime: 2.3,
          language: 'en-US',
          generatedAt: new Date().toISOString()
        }
      };
    }
  }

  // Process voice recording
  async processVoice(audioBlob: Blob, language: string = 'en-US'): Promise<VoiceProcessingResult> {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('language', language);
      formData.append('timestamp', new Date().toISOString());

      const response = await axios.post(`${this.baseURL}/ai/process-voice`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data;
    } catch (error) {
      console.error('Error processing voice:', error);
      // Return mock data for demo
      return {
        transcription: 'Emma has shown excellent progress in mathematics this month. She demonstrates strong problem-solving skills and actively participates in class discussions. Her reading comprehension has improved significantly, and she shows great enthusiasm for science experiments.',
        confidence: 0.96,
        language: 'en-US',
        processingTime: 1.8,
        segments: [
          {
            start: 0,
            end: 2.5,
            text: 'Emma has shown excellent progress in mathematics this month.',
            confidence: 0.98
          },
          {
            start: 2.5,
            end: 5.2,
            text: 'She demonstrates strong problem-solving skills and actively participates in class discussions.',
            confidence: 0.95
          }
        ],
        sentiment: 'positive',
        keywords: ['excellent', 'progress', 'mathematics', 'problem-solving', 'participation']
      };
    }
  }

  // Get AI insights for student
  async getStudentInsights(studentId: string): Promise<AIInsight[]> {
    try {
      const response = await axios.get(`${this.baseURL}/ai/insights/${studentId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      // Return mock data for demo
      return [
        {
          type: 'academic',
          title: 'Strong Mathematical Foundation',
          description: 'Emma demonstrates excellent mathematical reasoning and problem-solving abilities.',
          confidence: 0.92,
          evidence: ['Consistent high scores in math assessments', 'Strong performance in problem-solving tasks'],
          actionable: true,
          priority: 'high'
        },
        {
          type: 'social',
          title: 'Leadership Potential',
          description: 'Emma shows natural leadership qualities in group activities.',
          confidence: 0.87,
          evidence: ['Frequently takes initiative in group projects', 'Peers often follow her suggestions'],
          actionable: true,
          priority: 'medium'
        },
        {
          type: 'recommendation',
          title: 'Advanced Reading Program',
          description: 'Consider enrolling Emma in an advanced reading program to further develop her comprehension skills.',
          confidence: 0.89,
          evidence: ['Above-grade reading level', 'Strong comprehension scores'],
          actionable: true,
          priority: 'medium'
        }
      ];
    }
  }

  // Get AI predictions
  async getPredictions(studentId: string, timeframe: string = 'quarter'): Promise<AIPrediction[]> {
    try {
      const response = await axios.get(`${this.baseURL}/ai/predictions/${studentId}`, {
        params: { timeframe }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching AI predictions:', error);
      // Return mock data for demo
      return [
        {
          metric: 'Mathematics Performance',
          currentValue: 88,
          predictedValue: 92,
          confidence: 0.91,
          timeframe: 'Next Quarter',
          factors: ['Consistent study habits', 'Strong foundation', 'Active participation'],
          recommendations: ['Continue current study routine', 'Practice advanced problems']
        },
        {
          metric: 'Reading Comprehension',
          currentValue: 92,
          predictedValue: 95,
          confidence: 0.88,
          timeframe: 'Next Quarter',
          factors: ['Regular reading practice', 'Improved vocabulary', 'Better focus'],
          recommendations: ['Read diverse materials', 'Practice critical thinking questions']
        }
      ];
    }
  }

  // Analyze report quality
  async analyzeReportQuality(reportId: string): Promise<{
    overallScore: number;
    completeness: number;
    clarity: number;
    personalization: number;
    suggestions: string[];
  }> {
    try {
      const response = await axios.get(`${this.baseURL}/ai/analyze-report/${reportId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error analyzing report quality:', error);
      // Return mock data for demo
      return {
        overallScore: 4.7,
        completeness: 0.95,
        clarity: 0.92,
        personalization: 0.89,
        suggestions: [
          'Include more specific examples of student work',
          'Add more detailed recommendations for improvement',
          'Consider including parent feedback section'
        ]
      };
    }
  }

  // Generate personalized recommendations
  async generateRecommendations(
    studentId: string,
    context: {
      academicPerformance?: any;
      socialBehavior?: any;
      interests?: string[];
      goals?: string[];
    }
  ): Promise<{
    academic: string[];
    social: string[];
    personal: string[];
    priority: 'high' | 'medium' | 'low';
  }> {
    try {
      const response = await axios.post(`${this.baseURL}/ai/recommendations`, {
        studentId,
        context,
        timestamp: new Date().toISOString()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Return mock data for demo
      return {
        academic: [
          'Practice multiplication tables daily for 10 minutes',
          'Read chapter books for 20 minutes each day',
          'Complete additional math problems for reinforcement'
        ],
        social: [
          'Participate in more group discussions',
          'Take on leadership roles in class projects',
          'Practice active listening during conversations'
        ],
        personal: [
          'Set weekly reading goals',
          'Keep a learning journal',
          'Practice time management skills'
        ],
        priority: 'medium'
      };
    }
  }

  // Get AI model performance metrics
  async getModelPerformance(): Promise<{
    accuracy: number;
    processingTime: number;
    errorRate: number;
    modelVersion: string;
    lastUpdated: string;
  }> {
    try {
      const response = await axios.get(`${this.baseURL}/ai/model-performance`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching model performance:', error);
      // Return mock data for demo
      return {
        accuracy: 0.96,
        processingTime: 2.3,
        errorRate: 0.04,
        modelVersion: 'GPT-4-v1.2',
        lastUpdated: '2024-01-15T10:00:00Z'
      };
    }
  }

  // Optimize AI prompts
  async optimizePrompt(prompt: string, context: any): Promise<{
    optimizedPrompt: string;
    confidence: number;
    reasoning: string;
  }> {
    try {
      const response = await axios.post(`${this.baseURL}/ai/optimize-prompt`, {
        prompt,
        context,
        timestamp: new Date().toISOString()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error optimizing prompt:', error);
      throw new Error('Failed to optimize prompt');
    }
  }
}

export const aiService = new AIService();
export default aiService; 