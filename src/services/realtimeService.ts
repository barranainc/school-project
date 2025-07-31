import axios from 'axios';

export interface RealtimeEvent {
  type: 'notification' | 'message' | 'report' | 'system' | 'user_activity';
  id: string;
  timestamp: string;
  data: any;
  userId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface UserActivity {
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  timestamp: string;
  details?: any;
}

export interface SystemStatus {
  status: 'online' | 'offline' | 'maintenance';
  uptime: number;
  activeUsers: number;
  systemLoad: number;
  lastUpdate: string;
}

export interface LiveUpdate {
  type: 'data_change' | 'status_update' | 'alert';
  entity: string;
  entityId: string;
  changes: any;
  timestamp: string;
}

class RealtimeService {
  private baseURL = 'http://localhost:5001/api';
  private pollingInterval: NodeJS.Timeout | null = null;
  private eventListeners: Map<string, ((event: RealtimeEvent) => void)[]> = new Map();
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  // Connect to real-time updates
  async connect(userId: string): Promise<void> {
    try {
      // Simulate WebSocket connection
      console.log('Connecting to real-time service...');
      
      // Start polling for updates
      this.startPolling(userId);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      console.log('Connected to real-time service');
    } catch (error) {
      console.error('Failed to connect to real-time service:', error);
      this.handleReconnect(userId);
    }
  }

  // Disconnect from real-time updates
  disconnect(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isConnected = false;
    console.log('Disconnected from real-time service');
  }

  // Start polling for updates (simulates WebSocket)
  private startPolling(userId: string): void {
    this.pollingInterval = setInterval(async () => {
      try {
        const updates = await this.fetchUpdates(userId);
        updates.forEach(update => {
          this.emitEvent(update.type, update);
        });
      } catch (error) {
        console.error('Error polling for updates:', error);
        this.handleReconnect(userId);
      }
    }, 5000); // Poll every 5 seconds
  }

  // Fetch updates from server
  private async fetchUpdates(userId: string): Promise<RealtimeEvent[]> {
    try {
      const response = await axios.get(`${this.baseURL}/realtime/updates`, {
        params: { userId, timestamp: Date.now() }
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching updates:', error);
      // Return mock data for demo
      return this.generateMockUpdates(userId);
    }
  }

  // Generate mock updates for demo
  private generateMockUpdates(userId: string): RealtimeEvent[] {
    const updates: RealtimeEvent[] = [];
    const now = new Date().toISOString();

    // Randomly generate some updates
    if (Math.random() > 0.7) {
      updates.push({
        type: 'notification',
        id: 'NOT' + Date.now(),
        timestamp: now,
        data: {
          title: 'New Report Available',
          message: 'A new progress report has been generated for Emma Johnson.',
          action: 'view_report'
        },
        userId,
        priority: 'medium'
      });
    }

    if (Math.random() > 0.8) {
      updates.push({
        type: 'message',
        id: 'MSG' + Date.now(),
        timestamp: now,
        data: {
          sender: 'Ms. Davis',
          subject: 'Quick Update',
          preview: 'I wanted to share some positive feedback about...'
        },
        userId,
        priority: 'low'
      });
    }

    return updates;
  }

  // Handle reconnection
  private handleReconnect(userId: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(userId);
      }, 5000 * this.reconnectAttempts); // Exponential backoff
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  // Subscribe to specific event types
  subscribe(eventType: string, callback: (event: RealtimeEvent) => void): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    
    this.eventListeners.get(eventType)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(eventType);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  // Emit event to all listeners
  private emitEvent(eventType: string, event: RealtimeEvent): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  // Send real-time message
  async sendMessage(message: any): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/realtime/message`, {
        ...message,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error sending real-time message:', error);
      throw new Error('Failed to send message');
    }
  }

  // Get current system status
  async getSystemStatus(): Promise<SystemStatus> {
    try {
      const response = await axios.get(`${this.baseURL}/realtime/status`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching system status:', error);
      // Return mock data for demo
      return {
        status: 'online',
        uptime: 86400, // 24 hours in seconds
        activeUsers: 23,
        systemLoad: 0.45,
        lastUpdate: new Date().toISOString()
      };
    }
  }

  // Get active users
  async getActiveUsers(): Promise<UserActivity[]> {
    try {
      const response = await axios.get(`${this.baseURL}/realtime/active-users`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching active users:', error);
      // Return mock data for demo
      return [
        {
          userId: 'T001',
          userName: 'Ms. Davis',
          userRole: 'teacher',
          action: 'Recording voice note',
          timestamp: new Date().toISOString(),
          details: { studentId: 'ST001' }
        },
        {
          userId: 'P001',
          userName: 'Sarah Wilson',
          userRole: 'parent',
          action: 'Viewing report',
          timestamp: new Date().toISOString(),
          details: { reportId: 'R001' }
        }
      ];
    }
  }

  // Join a room/channel
  async joinRoom(roomId: string, userId: string): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/realtime/rooms/${roomId}/join`, {
        userId,
        timestamp: new Date().toISOString()
      });
      console.log(`Joined room: ${roomId}`);
    } catch (error) {
      console.error('Error joining room:', error);
      throw new Error('Failed to join room');
    }
  }

  // Leave a room/channel
  async leaveRoom(roomId: string, userId: string): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/realtime/rooms/${roomId}/leave`, {
        userId,
        timestamp: new Date().toISOString()
      });
      console.log(`Left room: ${roomId}`);
    } catch (error) {
      console.error('Error leaving room:', error);
      throw new Error('Failed to leave room');
    }
  }

  // Send room message
  async sendRoomMessage(roomId: string, message: any): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/realtime/rooms/${roomId}/message`, {
        ...message,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error sending room message:', error);
      throw new Error('Failed to send room message');
    }
  }

  // Get room participants
  async getRoomParticipants(roomId: string): Promise<UserActivity[]> {
    try {
      const response = await axios.get(`${this.baseURL}/realtime/rooms/${roomId}/participants`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching room participants:', error);
      return [];
    }
  }

  // Broadcast to all users
  async broadcast(event: Omit<RealtimeEvent, 'id' | 'timestamp'>): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/realtime/broadcast`, {
        ...event,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error broadcasting event:', error);
      throw new Error('Failed to broadcast event');
    }
  }

  // Get connection status
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Get connection statistics
  async getConnectionStats(): Promise<{
    uptime: number;
    messagesSent: number;
    messagesReceived: number;
    reconnectAttempts: number;
    averageLatency: number;
  }> {
    try {
      const response = await axios.get(`${this.baseURL}/realtime/stats`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching connection stats:', error);
      // Return mock data for demo
      return {
        uptime: 3600, // 1 hour
        messagesSent: 45,
        messagesReceived: 67,
        reconnectAttempts: this.reconnectAttempts,
        averageLatency: 150 // milliseconds
      };
    }
  }
}

export const realtimeService = new RealtimeService();
export default realtimeService; 