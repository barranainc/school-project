const http = require('http');
const url = require('url');
const PORT = process.env.PORT || 5001;

// Mock data
const mockData = {
  users: [
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
  ],
  students: [
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
  ],
  teachers: [
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
  ],
  schools: [
    {
      id: 'school1',
      name: 'Sunshine Montessori',
      contactPerson: { name: 'Sarah Johnson', email: 'sarah@sunshine.edu' },
      schoolType: 'montessori',
      subscription: { plan: 'premium', status: 'active' },
      usage: { totalStudents: 156, totalTeachers: 12, totalReports: 892 }
    }
  ]
};

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// Helper function to parse JSON body
function parseBody(req) {
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

// Create server
const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    // Health check
    if (path === '/api/health' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        message: 'Barrana.ai Backend is running!'
      }));
      return;
    }

    // Auth routes
    if (path === '/api/auth/login' && method === 'POST') {
      const body = await parseBody(req);
      const { email, password } = body;

      // Mock authentication
      const user = mockData.users.find(u => u.email === email);
      if (user && password === 'password') {
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          message: 'Login successful',
          data: {
            user,
            token: 'mock-jwt-token-for-demo'
          }
        }));
      } else {
        res.writeHead(401);
        res.end(JSON.stringify({
          success: false,
          message: 'Invalid credentials'
        }));
      }
      return;
    }

    if (path === '/api/auth/register' && method === 'POST') {
      const body = await parseBody(req);
      const { firstName, lastName, email, password, role } = body;

      // Mock registration
      const newUser = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        role,
        schoolId: 'school1',
        isEmailVerified: false
      };

      res.writeHead(201);
      res.end(JSON.stringify({
        success: true,
        message: 'User registered successfully',
        data: {
          user: newUser,
          token: 'mock-jwt-token-for-demo'
        }
      }));
      return;
    }

    if (path === '/api/auth/me' && method === 'GET') {
      // Mock current user (you would normally verify JWT token)
      const user = mockData.users[0]; // Return admin user for demo
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: user
      }));
      return;
    }

    // Data routes
    if (path === '/api/students' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: mockData.students
      }));
      return;
    }

    if (path === '/api/teachers' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: mockData.teachers
      }));
      return;
    }

    if (path === '/api/schools' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: mockData.schools
      }));
      return;
    }

    // Voice recording endpoint
    if (path === '/api/voice/upload' && method === 'POST') {
      // Mock voice processing
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: 'Voice recording processed successfully',
        data: {
          transcription: 'Emma has shown excellent progress in mathematics this month. She demonstrates strong problem-solving skills and actively participates in class discussions.',
          reportId: 'R' + Date.now(),
          processingTime: '2.3s'
        }
      }));
      return;
    }

    // Report generation endpoint
    if (path === '/api/reports/generate' && method === 'POST') {
      const body = await parseBody(req);
      const { studentId, voiceData, template } = body;

      // Mock AI report generation
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: 'Report generated successfully',
        data: {
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
          generatedAt: new Date().toISOString(),
          aiModel: 'GPT-4',
          confidence: 0.94
        }
      }));
      return;
    }

    // 404 handler
    res.writeHead(404);
    res.end(JSON.stringify({
      success: false,
      message: 'Route not found',
      path: req.url,
    }));

  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({
      success: false,
      message: 'Internal server error'
    }));
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Barrana.ai Backend Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
});

module.exports = server; 