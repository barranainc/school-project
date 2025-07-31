import axios from 'axios';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId: string;
  recipientName: string;
  recipientRole: string;
  subject: string;
  content: string;
  attachments?: string[];
  status: 'sent' | 'delivered' | 'read' | 'failed';
  createdAt: string;
  readAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'report' | 'message' | 'system' | 'alert';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  category: 'report' | 'notification' | 'announcement' | 'reminder';
}

export interface CommunicationStats {
  totalMessages: number;
  unreadMessages: number;
  totalNotifications: number;
  unreadNotifications: number;
  emailDeliveryRate: number;
  averageResponseTime: number;
}

class CommunicationService {
  private baseURL = 'http://localhost:5001/api';

  // Send message
  async sendMessage(message: Omit<Message, 'id' | 'status' | 'createdAt'>): Promise<Message> {
    try {
      const response = await axios.post(`${this.baseURL}/communication/messages`, {
        ...message,
        timestamp: new Date().toISOString()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }

  // Get messages
  async getMessages(filters: {
    userId?: string;
    conversationId?: string;
    unreadOnly?: boolean;
    limit?: number;
  } = {}): Promise<Message[]> {
    try {
      const response = await axios.get(`${this.baseURL}/communication/messages`, {
        params: filters
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Return mock data for demo
      return [
        {
          id: 'MSG001',
          senderId: 'T001',
          senderName: 'Ms. Davis',
          senderRole: 'teacher',
          recipientId: 'P001',
          recipientName: 'Sarah Wilson',
          recipientRole: 'parent',
          subject: 'Emma\'s Progress Report',
          content: 'Emma has shown excellent progress in mathematics this month. I would like to discuss her recent achievements.',
          status: 'read',
          createdAt: '2024-01-15T10:30:00Z',
          readAt: '2024-01-15T11:15:00Z'
        },
        {
          id: 'MSG002',
          senderId: 'P001',
          senderName: 'Sarah Wilson',
          senderRole: 'parent',
          recipientId: 'T001',
          recipientName: 'Ms. Davis',
          recipientRole: 'teacher',
          subject: 'Re: Emma\'s Progress Report',
          content: 'Thank you for the update. I would be happy to discuss Emma\'s progress. When would be a good time?',
          status: 'delivered',
          createdAt: '2024-01-15T14:20:00Z'
        }
      ];
    }
  }

  // Mark message as read
  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      await axios.patch(`${this.baseURL}/communication/messages/${messageId}/read`);
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw new Error('Failed to mark message as read');
    }
  }

  // Get notifications
  async getNotifications(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    try {
      const response = await axios.get(`${this.baseURL}/communication/notifications`, {
        params: { userId, unreadOnly }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Return mock data for demo
      return [
        {
          id: 'NOT001',
          userId,
          type: 'report',
          title: 'New Progress Report Available',
          message: 'A new progress report for Emma Johnson is now available.',
          data: { studentId: 'ST001', reportId: 'R001' },
          isRead: false,
          createdAt: '2024-01-15T09:00:00Z'
        },
        {
          id: 'NOT002',
          userId,
          type: 'message',
          title: 'New Message from Teacher',
          message: 'You have received a new message from Ms. Davis.',
          data: { messageId: 'MSG001' },
          isRead: true,
          createdAt: '2024-01-15T10:30:00Z',
          readAt: '2024-01-15T11:15:00Z'
        }
      ];
    }
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await axios.patch(`${this.baseURL}/communication/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }

  // Send email
  async sendEmail(template: string, recipients: string[], data: any = {}): Promise<{
    success: boolean;
    messageId: string;
    deliveredCount: number;
  }> {
    try {
      const response = await axios.post(`${this.baseURL}/communication/email`, {
        template,
        recipients,
        data,
        timestamp: new Date().toISOString()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  // Get email templates
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    try {
      const response = await axios.get(`${this.baseURL}/communication/email-templates`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching email templates:', error);
      // Return mock data for demo
      return [
        {
          id: 'TPL001',
          name: 'Progress Report Notification',
          subject: 'New Progress Report Available for {{studentName}}',
          body: 'Dear {{parentName}},\n\nA new progress report for {{studentName}} is now available in your dashboard.\n\nPlease log in to view the complete report.\n\nBest regards,\n{{schoolName}}',
          variables: ['studentName', 'parentName', 'schoolName'],
          category: 'report'
        },
        {
          id: 'TPL002',
          name: 'System Announcement',
          subject: 'Important Update: {{announcementTitle}}',
          body: 'Dear {{userName}},\n\n{{announcementContent}}\n\nThank you for your attention.\n\nBest regards,\n{{schoolName}}',
          variables: ['userName', 'announcementTitle', 'announcementContent', 'schoolName'],
          category: 'announcement'
        }
      ];
    }
  }

  // Create email template
  async createEmailTemplate(template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate> {
    try {
      const response = await axios.post(`${this.baseURL}/communication/email-templates`, template);
      return response.data.data;
    } catch (error) {
      console.error('Error creating email template:', error);
      throw new Error('Failed to create email template');
    }
  }

  // Get communication statistics
  async getCommunicationStats(userId: string): Promise<CommunicationStats> {
    try {
      const response = await axios.get(`${this.baseURL}/communication/stats`, {
        params: { userId }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching communication stats:', error);
      // Return mock data for demo
      return {
        totalMessages: 45,
        unreadMessages: 3,
        totalNotifications: 12,
        unreadNotifications: 1,
        emailDeliveryRate: 98.5,
        averageResponseTime: 2.3
      };
    }
  }

  // Send bulk notification
  async sendBulkNotification(
    recipients: string[],
    notification: Omit<Notification, 'id' | 'userId' | 'isRead' | 'createdAt'>
  ): Promise<{
    success: boolean;
    sentCount: number;
    failedCount: number;
  }> {
    try {
      const response = await axios.post(`${this.baseURL}/communication/bulk-notification`, {
        recipients,
        notification,
        timestamp: new Date().toISOString()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error sending bulk notification:', error);
      throw new Error('Failed to send bulk notification');
    }
  }

  // Get conversation history
  async getConversationHistory(participant1: string, participant2: string): Promise<Message[]> {
    try {
      const response = await axios.get(`${this.baseURL}/communication/conversation`, {
        params: { participant1, participant2 }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      throw new Error('Failed to fetch conversation history');
    }
  }

  // Delete message
  async deleteMessage(messageId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/communication/messages/${messageId}`);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw new Error('Failed to delete message');
    }
  }

  // Get real-time updates (WebSocket simulation)
  async subscribeToUpdates(userId: string, callback: (update: any) => void): Promise<() => void> {
    // In a real implementation, this would use WebSocket
    // For demo purposes, we'll simulate with polling
    const interval = setInterval(async () => {
      try {
        const notifications = await this.getNotifications(userId, true);
        if (notifications.length > 0) {
          callback({ type: 'notification', data: notifications });
        }
      } catch (error) {
        console.error('Error polling for updates:', error);
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }
}

export const communicationService = new CommunicationService();
export default communicationService; 