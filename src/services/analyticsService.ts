import axios from 'axios';

export interface AnalyticsData {
  students: {
    total: number;
    active: number;
    newThisMonth: number;
    growthRate: number;
  };
  teachers: {
    total: number;
    active: number;
    averageReportsPerTeacher: number;
  };
  reports: {
    total: number;
    thisMonth: number;
    averageGenerationTime: number;
    aiAccuracy: number;
  };
  engagement: {
    parentLoginRate: number;
    averageSessionDuration: number;
    reportViewRate: number;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    fill?: boolean;
  }[];
}

export interface PerformanceMetrics {
  academicProgress: {
    subject: string;
    averageScore: number;
    improvement: number;
  }[];
  socialDevelopment: {
    skill: string;
    averageRating: string;
    trend: 'improving' | 'stable' | 'declining';
  }[];
  teacherPerformance: {
    teacherId: string;
    teacherName: string;
    reportsGenerated: number;
    averageQuality: number;
    studentSatisfaction: number;
  }[];
}

export interface PredictiveInsights {
  atRiskStudents: {
    studentId: string;
    studentName: string;
    riskFactors: string[];
    confidence: number;
  }[];
  recommendedActions: {
    category: string;
    action: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'high' | 'medium' | 'low';
  }[];
  trends: {
    metric: string;
    currentValue: number;
    predictedValue: number;
    confidence: number;
    timeframe: string;
  }[];
}

class AnalyticsService {
  private baseURL = 'http://localhost:5001/api';

  // Get dashboard analytics
  async getDashboardAnalytics(): Promise<AnalyticsData> {
    try {
      const response = await axios.get(`${this.baseURL}/analytics/dashboard`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      // Return mock data for demo
      return {
        students: {
          total: 1247,
          active: 1189,
          newThisMonth: 23,
          growthRate: 12.5
        },
        teachers: {
          total: 89,
          active: 87,
          averageReportsPerTeacher: 38.7
        },
        reports: {
          total: 3456,
          thisMonth: 234,
          averageGenerationTime: 2.3,
          aiAccuracy: 96.2
        },
        engagement: {
          parentLoginRate: 94.2,
          averageSessionDuration: 8.5,
          reportViewRate: 87.3
        }
      };
    }
  }

  // Get chart data for specific metric
  async getChartData(metric: string, timeframe: string = 'month'): Promise<ChartData> {
    try {
      const response = await axios.get(`${this.baseURL}/analytics/chart`, {
        params: { metric, timeframe }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching chart data:', error);
      // Return mock data for demo
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: metric,
          data: [65, 72, 68, 75, 82, 79],
          backgroundColor: 'rgba(25, 118, 210, 0.2)',
          borderColor: 'rgba(25, 118, 210, 1)',
          fill: true
        }]
      };
    }
  }

  // Get performance metrics
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    try {
      const response = await axios.get(`${this.baseURL}/analytics/performance`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      // Return mock data for demo
      return {
        academicProgress: [
          { subject: 'Mathematics', averageScore: 87.3, improvement: 5.2 },
          { subject: 'Reading', averageScore: 91.8, improvement: 3.1 },
          { subject: 'Science', averageScore: 84.7, improvement: 7.8 },
          { subject: 'Social Studies', averageScore: 89.2, improvement: 4.5 }
        ],
        socialDevelopment: [
          { skill: 'Collaboration', averageRating: 'Excellent', trend: 'improving' },
          { skill: 'Communication', averageRating: 'Good', trend: 'stable' },
          { skill: 'Leadership', averageRating: 'Developing', trend: 'improving' }
        ],
        teacherPerformance: [
          {
            teacherId: 'T001',
            teacherName: 'Ms. Davis',
            reportsGenerated: 96,
            averageQuality: 4.8,
            studentSatisfaction: 4.9
          },
          {
            teacherId: 'T002',
            teacherName: 'Mr. Wilson',
            reportsGenerated: 88,
            averageQuality: 4.6,
            studentSatisfaction: 4.7
          }
        ]
      };
    }
  }

  // Get predictive insights
  async getPredictiveInsights(): Promise<PredictiveInsights> {
    try {
      const response = await axios.get(`${this.baseURL}/analytics/predictive`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching predictive insights:', error);
      // Return mock data for demo
      return {
        atRiskStudents: [
          {
            studentId: 'ST003',
            studentName: 'Olivia Davis',
            riskFactors: ['Declining math scores', 'Reduced engagement'],
            confidence: 0.87
          }
        ],
        recommendedActions: [
          {
            category: 'Academic Support',
            action: 'Schedule additional math tutoring for Olivia Davis',
            impact: 'high',
            effort: 'medium'
          },
          {
            category: 'Engagement',
            action: 'Implement interactive learning activities',
            impact: 'medium',
            effort: 'low'
          }
        ],
        trends: [
          {
            metric: 'Student Performance',
            currentValue: 87.3,
            predictedValue: 89.1,
            confidence: 0.92,
            timeframe: 'Next Quarter'
          },
          {
            metric: 'Parent Engagement',
            currentValue: 94.2,
            predictedValue: 96.8,
            confidence: 0.88,
            timeframe: 'Next Month'
          }
        ]
      };
    }
  }

  // Get comparative analytics
  async getComparativeAnalytics(compareWith: string = 'previous_period'): Promise<{
    current: AnalyticsData;
    comparison: AnalyticsData;
    changes: {
      students: number;
      teachers: number;
      reports: number;
      engagement: number;
    };
  }> {
    try {
      const response = await axios.get(`${this.baseURL}/analytics/comparative`, {
        params: { compareWith }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching comparative analytics:', error);
      throw new Error('Failed to fetch comparative analytics');
    }
  }

  // Export analytics report
  async exportReport(format: 'pdf' | 'excel' | 'csv', filters: any = {}): Promise<Blob> {
    try {
      const response = await axios.post(`${this.baseURL}/analytics/export`, filters, {
        responseType: 'blob',
        params: { format }
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting report:', error);
      throw new Error('Failed to export report');
    }
  }

  // Get real-time analytics
  async getRealTimeAnalytics(): Promise<{
    activeUsers: number;
    currentRecordings: number;
    reportsGeneratedToday: number;
    systemHealth: 'excellent' | 'good' | 'fair' | 'poor';
  }> {
    try {
      const response = await axios.get(`${this.baseURL}/analytics/realtime`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching real-time analytics:', error);
      // Return mock data for demo
      return {
        activeUsers: 23,
        currentRecordings: 3,
        reportsGeneratedToday: 12,
        systemHealth: 'excellent'
      };
    }
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService; 