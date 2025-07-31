const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const config = require('../production-config');

// Production server with advanced features
class ProductionServer {
  constructor() {
    this.port = config.server.port;
    this.host = config.server.host;
    this.environment = config.server.environment;
    this.startTime = new Date();
    this.requestCount = 0;
    this.errorCount = 0;
    this.activeConnections = 0;
    
    // Initialize server
    this.server = http.createServer(this.handleRequest.bind(this));
    this.setupServer();
  }

  setupServer() {
    // Handle server events
    this.server.on('connection', (socket) => {
      this.activeConnections++;
      socket.on('close', () => {
        this.activeConnections--;
      });
    });

    this.server.on('error', (error) => {
      console.error('Server error:', error);
      this.errorCount++;
    });

    // Graceful shutdown
    process.on('SIGTERM', () => this.gracefulShutdown());
    process.on('SIGINT', () => this.gracefulShutdown());
  }

  async handleRequest(req, res) {
    this.requestCount++;
    
    // Set CORS headers
    this.setCORSHeaders(res);
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    try {
      // Log request
      this.logRequest(req, res);

      // Route handling
      await this.routeRequest(req, res, path, method, parsedUrl);
      
    } catch (error) {
      console.error('Request error:', error);
      this.errorCount++;
      this.sendErrorResponse(res, 500, 'Internal Server Error');
    }
  }

  setCORSHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', config.server.cors.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  async routeRequest(req, res, path, method, parsedUrl) {
    // Health check
    if (path === '/api/health' && method === 'GET') {
      return this.handleHealthCheck(req, res);
    }

    // API routes
    if (path.startsWith('/api/')) {
      return this.handleAPIRoute(req, res, path, method, parsedUrl);
    }

    // Static files (for production build)
    if (method === 'GET' && !path.startsWith('/api/')) {
      return this.serveStaticFiles(req, res, path);
    }

    // 404 handler
    return this.sendErrorResponse(res, 404, 'Route not found');
  }

  async handleHealthCheck(req, res) {
    const healthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.environment,
      version: '1.0.0',
      startTime: this.startTime.toISOString(),
      requestCount: this.requestCount,
      errorCount: this.errorCount,
      activeConnections: this.activeConnections,
      memory: process.memoryUsage(),
      features: config.features
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(healthData));
  }

  async handleAPIRoute(req, res, path, method, parsedUrl) {
    const body = await this.parseBody(req);

    // Auth routes
    if (path === '/api/auth/login' && method === 'POST') {
      return this.handleLogin(req, res, body);
    }

    if (path === '/api/auth/register' && method === 'POST') {
      return this.handleRegister(req, res, body);
    }

    if (path === '/api/auth/me' && method === 'GET') {
      return this.handleGetCurrentUser(req, res);
    }

    // Data routes
    if (path === '/api/students' && method === 'GET') {
      return this.handleGetStudents(req, res);
    }

    if (path === '/api/teachers' && method === 'GET') {
      return this.handleGetTeachers(req, res);
    }

    if (path === '/api/schools' && method === 'GET') {
      return this.handleGetSchools(req, res);
    }

    // AI routes
    if (path === '/api/ai/generate-report' && method === 'POST') {
      return this.handleGenerateReport(req, res, body);
    }

    if (path === '/api/ai/process-voice' && method === 'POST') {
      return this.handleProcessVoice(req, res);
    }

    if (path === '/api/ai/insights' && method === 'GET') {
      return this.handleGetInsights(req, res);
    }

    // Analytics routes
    if (path === '/api/analytics/dashboard' && method === 'GET') {
      return this.handleGetAnalytics(req, res);
    }

    if (path === '/api/analytics/performance' && method === 'GET') {
      return this.handleGetPerformance(req, res);
    }

    if (path === '/api/analytics/predictive' && method === 'GET') {
      return this.handleGetPredictive(req, res);
    }

    // Communication routes
    if (path === '/api/communication/messages' && method === 'GET') {
      return this.handleGetMessages(req, res);
    }

    if (path === '/api/communication/notifications' && method === 'GET') {
      return this.handleGetNotifications(req, res);
    }

    // Real-time routes
    if (path === '/api/realtime/status' && method === 'GET') {
      return this.handleGetRealtimeStatus(req, res);
    }

    if (path === '/api/realtime/updates' && method === 'GET') {
      return this.handleGetRealtimeUpdates(req, res);
    }

    // 404 for API routes
    return this.sendErrorResponse(res, 404, 'API endpoint not found');
  }

  async parseBody(req) {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve({});
        }
      });
    });
  }

  // Mock data handlers
  handleLogin(req, res, body) {
    const { email, password } = body;
    const users = this.getMockUsers();
    const user = users.find(u => u.email === email);

    if (user && password === 'password') {
      const response = {
        success: true,
        message: 'Login successful',
        data: {
          user,
          token: 'mock-jwt-token-for-production'
        }
      };
      this.sendJSONResponse(res, 200, response);
    } else {
      this.sendErrorResponse(res, 401, 'Invalid credentials');
    }
  }

  handleRegister(req, res, body) {
    const { firstName, lastName, email, password, role } = body;
    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      role,
      schoolId: 'school1',
      isEmailVerified: false
    };

    const response = {
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser,
        token: 'mock-jwt-token-for-production'
      }
    };
    this.sendJSONResponse(res, 201, response);
  }

  handleGetCurrentUser(req, res) {
    const users = this.getMockUsers();
    const user = users[0]; // Return admin user
    this.sendJSONResponse(res, 200, { success: true, data: user });
  }

  handleGetStudents(req, res) {
    const students = this.getMockStudents();
    this.sendJSONResponse(res, 200, { success: true, data: students });
  }

  handleGetTeachers(req, res) {
    const teachers = this.getMockTeachers();
    this.sendJSONResponse(res, 200, { success: true, data: teachers });
  }

  handleGetSchools(req, res) {
    const schools = this.getMockSchools();
    this.sendJSONResponse(res, 200, { success: true, data: schools });
  }

  handleGenerateReport(req, res, body) {
    const reportData = {
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
        ],
        recommendations: [
          'Read for 20 minutes daily',
          'Practice math problems at home',
        ],
      },
      metadata: {
        aiModel: 'GPT-4',
        confidence: 0.94,
        processingTime: 2.3,
        language: 'en-US',
        generatedAt: new Date().toISOString()
      }
    };

    this.sendJSONResponse(res, 200, {
      success: true,
      message: 'Report generated successfully',
      data: reportData
    });
  }

  handleProcessVoice(req, res) {
    const voiceData = {
      transcription: 'Emma has shown excellent progress in mathematics this month. She demonstrates strong problem-solving skills and actively participates in class discussions.',
      confidence: 0.96,
      language: 'en-US',
      processingTime: 1.8,
      segments: [
        {
          start: 0,
          end: 2.5,
          text: 'Emma has shown excellent progress in mathematics this month.',
          confidence: 0.98
        }
      ],
      sentiment: 'positive',
      keywords: ['excellent', 'progress', 'mathematics', 'problem-solving']
    };

    this.sendJSONResponse(res, 200, {
      success: true,
      message: 'Voice processed successfully',
      data: voiceData
    });
  }

  handleGetInsights(req, res) {
    const insights = [
      {
        type: 'academic',
        title: 'Strong Mathematical Foundation',
        description: 'Emma demonstrates excellent mathematical reasoning and problem-solving abilities.',
        confidence: 0.92,
        evidence: ['Consistent high scores in math assessments', 'Strong performance in problem-solving tasks'],
        actionable: true,
        priority: 'high'
      }
    ];

    this.sendJSONResponse(res, 200, { success: true, data: insights });
  }

  handleGetAnalytics(req, res) {
    const analytics = {
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

    this.sendJSONResponse(res, 200, { success: true, data: analytics });
  }

  handleGetPerformance(req, res) {
    const performance = {
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
      ]
    };

    this.sendJSONResponse(res, 200, { success: true, data: performance });
  }

  handleGetPredictive(req, res) {
    const predictive = {
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
        }
      ],
      trends: [
        {
          metric: 'Student Performance',
          currentValue: 87.3,
          predictedValue: 89.1,
          confidence: 0.92,
          timeframe: 'Next Quarter'
        }
      ]
    };

    this.sendJSONResponse(res, 200, { success: true, data: predictive });
  }

  handleGetMessages(req, res) {
    const messages = [
      {
        id: 'MSG001',
        senderId: 'T001',
        senderName: 'Ms. Davis',
        senderRole: 'teacher',
        recipientId: 'P001',
        recipientName: 'Sarah Wilson',
        recipientRole: 'parent',
        subject: 'Emma\'s Progress Report',
        content: 'Emma has shown excellent progress in mathematics this month.',
        status: 'read',
        createdAt: '2024-01-15T10:30:00Z',
        readAt: '2024-01-15T11:15:00Z'
      }
    ];

    this.sendJSONResponse(res, 200, { success: true, data: messages });
  }

  handleGetNotifications(req, res) {
    const notifications = [
      {
        id: 'NOT001',
        userId: 'P001',
        type: 'report',
        title: 'New Progress Report Available',
        message: 'A new progress report for Emma Johnson is now available.',
        data: { studentId: 'ST001', reportId: 'R001' },
        isRead: false,
        createdAt: '2024-01-15T09:00:00Z'
      }
    ];

    this.sendJSONResponse(res, 200, { success: true, data: notifications });
  }

  handleGetRealtimeStatus(req, res) {
    const status = {
      status: 'online',
      uptime: 86400,
      activeUsers: 23,
      systemLoad: 0.45,
      lastUpdate: new Date().toISOString()
    };

    this.sendJSONResponse(res, 200, { success: true, data: status });
  }

  handleGetRealtimeUpdates(req, res) {
    const updates = [];
    // Generate random updates for demo
    if (Math.random() > 0.7) {
      updates.push({
        type: 'notification',
        id: 'NOT' + Date.now(),
        timestamp: new Date().toISOString(),
        data: {
          title: 'New Report Available',
          message: 'A new progress report has been generated.',
          action: 'view_report'
        },
        priority: 'medium'
      });
    }

    this.sendJSONResponse(res, 200, { success: true, data: updates });
  }

  serveStaticFiles(req, res, requestPath) {
    // For production, serve static files
    let filePath = requestPath === '/' ? '/index.html' : requestPath;
    
    // Try build directory first, then public directory
    let fullPath = require('path').join(__dirname, '../build', filePath);
    
    // If build doesn't exist, try public directory
    if (!require('fs').existsSync(fullPath)) {
      fullPath = require('path').join(__dirname, '../public', filePath);
    }

    fs.readFile(fullPath, (err, data) => {
      if (err) {
        // Try to serve index.html from public directory for SPA routing
        const indexPath = require('path').join(__dirname, '../public/index.html');
        fs.readFile(indexPath, (err, data) => {
          if (err) {
            this.sendErrorResponse(res, 404, 'File not found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
          }
        });
      } else {
        const ext = require('path').extname(fullPath);
        const contentType = this.getContentType(ext);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
  }

  getContentType(ext) {
    const types = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };
    return types[ext] || 'application/octet-stream';
  }

  // Mock data
  getMockUsers() {
    return [
      {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@school.com',
        role: 'school_admin',
        schoolId: 'school1',
        isEmailVerified: true
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Teacher',
        email: 'jane@school.com',
        role: 'teacher',
        schoolId: 'school1',
        isEmailVerified: true
      },
      {
        id: '3',
        firstName: 'Sarah',
        lastName: 'Parent',
        email: 'sarah@email.com',
        role: 'parent',
        schoolId: 'school1',
        isEmailVerified: true
      }
    ];
  }

  getMockStudents() {
    return [
      {
        id: 'ST001',
        firstName: 'Emma',
        lastName: 'Johnson',
        grade: 'Grade 3',
        class: '3A',
        status: 'active',
        lastReport: '2024-01-15',
        parentEmail: 'parent1@email.com',
        parentPhone: '+1-555-0123',
        avatar: 'EJ',
      },
      {
        id: 'ST002',
        firstName: 'Liam',
        lastName: 'Smith',
        grade: 'Grade 4',
        class: '4A',
        status: 'active',
        lastReport: '2024-01-14',
        parentEmail: 'parent2@email.com',
        parentPhone: '+1-555-0124',
        avatar: 'LS',
      }
    ];
  }

  getMockTeachers() {
    return [
      {
        id: 'teacher1',
        firstName: 'Jane',
        lastName: 'Teacher',
        email: 'jane@school.com',
        class: 'Grade 3A',
        students: 24,
        reportsGenerated: 96,
        performanceScore: 92
      },
      {
        id: 'teacher2',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike@school.com',
        class: 'Grade 4A',
        students: 22,
        reportsGenerated: 88,
        performanceScore: 88
      }
    ];
  }

  getMockSchools() {
    return [
      {
        id: 'school1',
        name: 'Sunshine Montessori',
        contactPerson: { name: 'Sarah Johnson', email: 'sarah@sunshine.edu' },
        schoolType: 'montessori',
        subscription: { plan: 'premium', status: 'active' },
        usage: { totalStudents: 156, totalTeachers: 12, totalReports: 892 }
      }
    ];
  }

  // Utility methods
  sendJSONResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }

  sendErrorResponse(res, statusCode, message) {
    const error = {
      success: false,
      message,
      statusCode,
      timestamp: new Date().toISOString()
    };
    this.sendJSONResponse(res, statusCode, error);
  }

  logRequest(req, res) {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    console.log(`[${timestamp}] ${method} ${url} - ${ip} - ${userAgent}`);
  }

  gracefulShutdown() {
    console.log('Received shutdown signal, gracefully closing server...');
    
    this.server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  }

  start() {
    this.server.listen(this.port, this.host, () => {
      console.log(`🚀 Barrana.ai Production Server running on ${this.host}:${this.port}`);
      console.log(`📊 Environment: ${this.environment}`);
      console.log(`🔗 Health Check: http://${this.host}:${this.port}/api/health`);
      console.log(`🔗 API Base: http://${this.host}:${this.port}/api`);
      console.log(`⏰ Started at: ${this.startTime.toISOString()}`);
      console.log(`🔧 Features enabled:`, Object.keys(config.features).filter(key => config.features[key]));
    });
  }
}

// Start the production server
const productionServer = new ProductionServer();
productionServer.start();

module.exports = productionServer; 