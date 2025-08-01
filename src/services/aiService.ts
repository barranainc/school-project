// AI Service for Barrana.ai
// This service handles voice-to-text transcription and AI report generation

export interface TranscriptionRequest {
  audioBlob: Blob;
  language?: string;
  studentName?: string;
}

export interface ReportGenerationRequest {
  transcription: string;
  studentName: string;
  grade: string;
  template?: string;
}

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface AIInsight {
  id: string;
  type: 'academic' | 'behavioral' | 'social' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  studentId: string;
  createdAt: Date;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
}

class AIService {
  private apiKey: string | null = null;
  private baseUrl: string = 'https://api.openai.com/v1';

  // Initialize with API key
  initialize(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Voice to Text Transcription
  async transcribeAudio(request: TranscriptionRequest): Promise<AIResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'API key not configured. Please add your OpenAI API key in settings.'
      };
    }

    try {
      // Convert blob to base64
      const base64Audio = await this.blobToBase64(request.audioBlob);
      
      const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: base64Audio,
          model: 'whisper-1',
          language: request.language || 'en',
          prompt: `This is a teacher's voice note about student ${request.studentName}. Please transcribe it clearly.`
        })
      });

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.text
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transcription failed'
      };
    }
  }

  // AI Report Generation
  async generateReport(request: ReportGenerationRequest): Promise<AIResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'API key not configured. Please add your OpenAI API key in settings.'
      };
    }

    try {
      const prompt = this.buildReportPrompt(request);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert educational assistant that creates professional student progress reports. Generate clear, constructive, and detailed reports based on teacher observations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`Report generation failed: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.choices[0].message.content
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Report generation failed'
      };
    }
  }

  // Build comprehensive report prompt
  private buildReportPrompt(request: ReportGenerationRequest): string {
    return `
Create a comprehensive student progress report for ${request.studentName} (${request.grade}) based on the following teacher observations:

TEACHER OBSERVATIONS:
${request.transcription}

Please structure the report with the following sections:

1. **Academic Performance Summary**
   - Key achievements and progress
   - Areas of strength
   - Areas for growth

2. **Social-Emotional Development**
   - Peer interactions
   - Emotional regulation
   - Confidence and participation

3. **Learning Habits & Skills**
   - Work habits
   - Problem-solving abilities
   - Creativity and critical thinking

4. **Specific Recommendations**
   - Actionable suggestions for continued growth
   - Home support strategies
   - Next steps for development

5. **Overall Assessment**
   - Brief summary of current progress
   - Positive reinforcement

Please make the report:
- Professional and constructive
- Specific to the observations provided
- Age-appropriate for ${request.grade}
- Encouraging and supportive
- Actionable for parents and teachers

Format the report in markdown with clear headings and bullet points where appropriate.
    `;
  }

  // Convert blob to base64
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data URL prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Test API connection
  async testConnection(): Promise<AIResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'API key not configured'
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      });

      if (!response.ok) {
        throw new Error(`API test failed: ${response.statusText}`);
      }

      return {
        success: true,
        data: 'API connection successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'API test failed'
      };
    }
  }

  // Get usage statistics
  async getUsage(): Promise<AIResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'API key not configured'
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/usage`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Usage fetch failed: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Usage fetch failed'
      };
    }
  }

  // Get AI insights for a student
  async getStudentInsights(studentId: string): Promise<AIInsight[]> {
    // Mock implementation for demo
    return [
      {
        id: 'insight-1',
        type: 'academic',
        title: 'Strong Mathematical Foundation',
        description: 'Student shows excellent problem-solving skills in mathematics. Consider advanced placement opportunities.',
        confidence: 0.92,
        studentId,
        createdAt: new Date(),
        actionable: true,
        priority: 'high'
      },
      {
        id: 'insight-2',
        type: 'behavioral',
        title: 'Improved Classroom Engagement',
        description: 'Student has shown significant improvement in classroom participation over the last month.',
        confidence: 0.87,
        studentId,
        createdAt: new Date(),
        actionable: true,
        priority: 'medium'
      },
      {
        id: 'insight-3',
        type: 'social',
        title: 'Leadership Potential',
        description: 'Student demonstrates natural leadership qualities in group activities.',
        confidence: 0.78,
        studentId,
        createdAt: new Date(),
        actionable: true,
        priority: 'medium'
      },
      {
        id: 'insight-4',
        type: 'recommendation',
        title: 'Reading Enhancement Opportunity',
        description: 'Consider introducing more challenging reading materials to further develop comprehension skills.',
        confidence: 0.85,
        studentId,
        createdAt: new Date(),
        actionable: true,
        priority: 'low'
      }
    ];
  }
}

// Export singleton instance
export const aiService = new AIService();
export default aiService; 