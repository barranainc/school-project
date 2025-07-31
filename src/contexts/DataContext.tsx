import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  class: string;
  status: 'active' | 'pending' | 'inactive';
  lastReport: string;
  parentEmail: string;
  parentPhone: string;
  avatar: string;
  teacherId?: string;
  parentId?: string;
  enrollmentDate: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  medicalInfo: string;
  academicLevel: string;
  notes: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  grade: string;
  students: number;
  reportsGenerated: number;
  lastLogin: string;
  status: 'active' | 'inactive';
  avgTimePerReport: number;
  efficiency: number;
  avatar: string;
  hireDate: string;
  specialization: string;
  qualifications: string;
  bio: string;
  performanceScore: number;
  trainingCompleted: string[];
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  children: string[]; // Student IDs
  lastLogin: string;
  status: 'active' | 'inactive';
  avatar: string;
  address: string;
  emergencyContact: string;
  preferences: {
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

export interface Report {
  id: string;
  studentId: string;
  teacherId: string;
  title: string;
  content: string;
  status: 'draft' | 'completed' | 'sent';
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  template: string;
  voiceRecordingUrl?: string;
  aiGenerated: boolean;
  reviewedBy: string[];
  tags: string[];
  academicPeriod: string;
  subjects: string[];
  skills: {
    [key: string]: {
      score: number;
      level: string;
      comments: string;
    };
  };
}

export interface School {
  id: string;
  name: string;
  type: 'montessori' | 'daycare' | 'private' | 'public';
  address: string;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  subscription: {
    plan: 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'trial' | 'expired';
    startDate: string;
    endDate: string;
  };
  settings: {
    timezone: string;
    language: string;
    currency: string;
    academicYear: string;
  };
  usage: {
    totalStudents: number;
    totalTeachers: number;
    totalReports: number;
    storageUsed: number;
  };
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId: string;
  actionUrl?: string;
}

export interface Analytics {
  totalStudents: number;
  totalTeachers: number;
  totalReports: number;
  activeReports: number;
  pendingReports: number;
  avgReportTime: number;
  parentEngagement: number;
  teacherEfficiency: number;
  systemUptime: number;
  monthlyGrowth: number;
}

// Initial dummy data
const initialStudents: Student[] = [
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
    teacherId: 'T001',
    parentId: 'P001',
    enrollmentDate: '2023-09-01',
    dateOfBirth: '2018-03-15',
    address: '123 Main St, City, State',
    emergencyContact: '+1-555-9999',
    medicalInfo: 'No known allergies',
    academicLevel: 'Advanced',
    notes: 'Excellent problem-solving skills',
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
    teacherId: 'T002',
    parentId: 'P002',
    enrollmentDate: '2023-09-01',
    dateOfBirth: '2017-08-22',
    address: '456 Oak Ave, City, State',
    emergencyContact: '+1-555-8888',
    medicalInfo: 'Asthma - inhaler available',
    academicLevel: 'Standard',
    notes: 'Shows great creativity in art',
  },
  {
    id: 'ST003',
    firstName: 'Olivia',
    lastName: 'Davis',
    grade: 'Grade 3',
    class: '3B',
    status: 'pending',
    lastReport: '2024-01-10',
    parentEmail: 'parent3@email.com',
    parentPhone: '+1-555-0125',
    avatar: 'OD',
    teacherId: 'T001',
    parentId: 'P003',
    enrollmentDate: '2024-01-05',
    dateOfBirth: '2018-11-10',
    address: '789 Pine Rd, City, State',
    emergencyContact: '+1-555-7777',
    medicalInfo: 'No known allergies',
    academicLevel: 'Standard',
    notes: 'New student, adjusting well',
  },
];

const initialTeachers: Teacher[] = [
  {
    id: 'T001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@school.com',
    phone: '+1-555-0123',
    grade: 'Grade 3',
    students: 24,
    reportsGenerated: 156,
    lastLogin: '2024-07-30 14:30',
    status: 'active',
    avgTimePerReport: 8.5,
    efficiency: 92,
    avatar: 'SJ',
    hireDate: '2022-08-15',
    specialization: 'Early Childhood Education',
    qualifications: 'M.Ed in Elementary Education',
    bio: 'Experienced teacher with 8 years in early childhood education',
    performanceScore: 92,
    trainingCompleted: ['Voice Recording', 'AI Report Review', 'System Navigation'],
  },
  {
    id: 'T002',
    name: 'Michael Chen',
    email: 'michael.chen@school.com',
    phone: '+1-555-0124',
    grade: 'Grade 4',
    students: 22,
    reportsGenerated: 142,
    lastLogin: '2024-07-30 12:15',
    status: 'active',
    avgTimePerReport: 7.2,
    efficiency: 88,
    avatar: 'MC',
    hireDate: '2021-09-01',
    specialization: 'Mathematics Education',
    qualifications: 'B.Ed with Math Specialization',
    bio: 'Passionate about making math fun and accessible',
    performanceScore: 88,
    trainingCompleted: ['Voice Recording', 'System Navigation'],
  },
];

const initialParents: Parent[] = [
  {
    id: 'P001',
    name: 'Jennifer Johnson',
    email: 'parent1@email.com',
    phone: '+1-555-0123',
    children: ['ST001'],
    lastLogin: '2024-07-30 10:30',
    status: 'active',
    avatar: 'JJ',
    address: '123 Main St, City, State',
    emergencyContact: '+1-555-9999',
    preferences: {
      language: 'en',
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
    },
  },
  {
    id: 'P002',
    name: 'Robert Smith',
    email: 'parent2@email.com',
    phone: '+1-555-0124',
    children: ['ST002'],
    lastLogin: '2024-07-29 16:45',
    status: 'active',
    avatar: 'RS',
    address: '456 Oak Ave, City, State',
    emergencyContact: '+1-555-8888',
    preferences: {
      language: 'en',
      notifications: {
        email: true,
        sms: true,
        push: false,
      },
    },
  },
];

const initialReports: Report[] = [
  {
    id: 'R001',
    studentId: 'ST001',
    teacherId: 'T001',
    title: 'Progress Report - Q1 2024',
    content: 'Emma has shown excellent progress in all areas...',
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:45:00Z',
    sentAt: '2024-01-15T15:00:00Z',
    template: 'Standard Progress Report',
    aiGenerated: true,
    reviewedBy: ['T001'],
    tags: ['Q1', 'Progress'],
    academicPeriod: 'Q1 2024',
    subjects: ['Math', 'Language', 'Science'],
    skills: {
      'Problem Solving': { score: 85, level: 'Advanced', comments: 'Excellent analytical thinking' },
      'Communication': { score: 90, level: 'Advanced', comments: 'Clear and articulate' },
      'Creativity': { score: 88, level: 'Advanced', comments: 'Very imaginative' },
    },
  },
];

const initialSchool: School = {
  id: 'SCH001',
  name: 'Sunshine Montessori',
  type: 'montessori',
  address: '123 Education Blvd, Learning City, LC 12345',
  contactPerson: {
    name: 'Sarah Johnson',
    email: 'sarah@sunshine.edu',
    phone: '+1-555-0001',
  },
  subscription: {
    plan: 'premium',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
  },
  settings: {
    timezone: 'America/New_York',
    language: 'en',
    currency: 'USD',
    academicYear: '2024-2025',
  },
  usage: {
    totalStudents: 156,
    totalTeachers: 12,
    totalReports: 892,
    storageUsed: 2.5, // GB
  },
};

// Context interface
interface DataContextType {
  // Data
  students: Student[];
  teachers: Teacher[];
  parents: Parent[];
  reports: Report[];
  school: School;
  notifications: Notification[];
  analytics: Analytics;

  // Actions
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, updates: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  
  addParent: (parent: Omit<Parent, 'id'>) => void;
  updateParent: (id: string, updates: Partial<Parent>) => void;
  deleteParent: (id: string) => void;
  
  addReport: (report: Omit<Report, 'id'>) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  
  updateSchool: (updates: Partial<School>) => void;
  
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  
  // Queries
  getStudentById: (id: string) => Student | undefined;
  getTeacherById: (id: string) => Teacher | undefined;
  getParentById: (id: string) => Parent | undefined;
  getReportById: (id: string) => Report | undefined;
  
  getStudentsByTeacher: (teacherId: string) => Student[];
  getStudentsByParent: (parentId: string) => Student[];
  getReportsByStudent: (studentId: string) => Report[];
  getReportsByTeacher: (teacherId: string) => Report[];
  
  // Analytics
  updateAnalytics: () => void;
}

// Create context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [parents, setParents] = useState<Parent[]>(initialParents);
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [school, setSchool] = useState<School>(initialSchool);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalStudents: initialStudents.length,
    totalTeachers: initialTeachers.length,
    totalReports: initialReports.length,
    activeReports: initialReports.filter(r => r.status === 'completed').length,
    pendingReports: initialReports.filter(r => r.status === 'draft').length,
    avgReportTime: 8.5,
    parentEngagement: 85,
    teacherEfficiency: 90,
    systemUptime: 99.9,
    monthlyGrowth: 12,
  });

  // Update analytics whenever data changes
  useEffect(() => {
    updateAnalytics();
  }, [students, teachers, reports]);

  const updateAnalytics = () => {
    const totalStudents = students.length;
    const totalTeachers = teachers.length;
    const totalReports = reports.length;
    const activeReports = reports.filter(r => r.status === 'completed').length;
    const pendingReports = reports.filter(r => r.status === 'draft').length;
    const avgReportTime = teachers.length > 0 
      ? teachers.reduce((sum, t) => sum + t.avgTimePerReport, 0) / teachers.length 
      : 0;
    const teacherEfficiency = teachers.length > 0 
      ? teachers.reduce((sum, t) => sum + t.efficiency, 0) / teachers.length 
      : 0;

    setAnalytics({
      totalStudents,
      totalTeachers,
      totalReports,
      activeReports,
      pendingReports,
      avgReportTime,
      parentEngagement: 85, // This would be calculated from actual engagement data
      teacherEfficiency,
      systemUptime: 99.9,
      monthlyGrowth: 12,
    });
  };

  // Student actions
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `ST${String(students.length + 1).padStart(3, '0')}`,
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, ...updates } : student
    ));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  // Teacher actions
  const addTeacher = (teacherData: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: `T${String(teachers.length + 1).padStart(3, '0')}`,
    };
    setTeachers(prev => [...prev, newTeacher]);
  };

  const updateTeacher = (id: string, updates: Partial<Teacher>) => {
    setTeachers(prev => prev.map(teacher => 
      teacher.id === id ? { ...teacher, ...updates } : teacher
    ));
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(teacher => teacher.id !== id));
  };

  // Parent actions
  const addParent = (parentData: Omit<Parent, 'id'>) => {
    const newParent: Parent = {
      ...parentData,
      id: `P${String(parents.length + 1).padStart(3, '0')}`,
    };
    setParents(prev => [...prev, newParent]);
  };

  const updateParent = (id: string, updates: Partial<Parent>) => {
    setParents(prev => prev.map(parent => 
      parent.id === id ? { ...parent, ...updates } : parent
    ));
  };

  const deleteParent = (id: string) => {
    setParents(prev => prev.filter(parent => parent.id !== id));
  };

  // Report actions
  const addReport = (reportData: Omit<Report, 'id'>) => {
    const newReport: Report = {
      ...reportData,
      id: `R${String(reports.length + 1).padStart(3, '0')}`,
    };
    setReports(prev => [...prev, newReport]);
  };

  const updateReport = (id: string, updates: Partial<Report>) => {
    setReports(prev => prev.map(report => 
      report.id === id ? { ...report, ...updates } : report
    ));
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(report => report.id !== id));
  };

  // School actions
  const updateSchool = (updates: Partial<School>) => {
    setSchool(prev => ({ ...prev, ...updates }));
  };

  // Notification actions
  const addNotification = (notificationData: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `N${String(notifications.length + 1).padStart(3, '0')}`,
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Query functions
  const getStudentById = (id: string) => students.find(student => student.id === id);
  const getTeacherById = (id: string) => teachers.find(teacher => teacher.id === id);
  const getParentById = (id: string) => parents.find(parent => parent.id === id);
  const getReportById = (id: string) => reports.find(report => report.id === id);

  const getStudentsByTeacher = (teacherId: string) => 
    students.filter(student => student.teacherId === teacherId);
  
  const getStudentsByParent = (parentId: string) => 
    students.filter(student => student.parentId === parentId);
  
  const getReportsByStudent = (studentId: string) => 
    reports.filter(report => report.studentId === studentId);
  
  const getReportsByTeacher = (teacherId: string) => 
    reports.filter(report => report.teacherId === teacherId);

  const value: DataContextType = {
    // Data
    students,
    teachers,
    parents,
    reports,
    school,
    notifications,
    analytics,

    // Actions
    addStudent,
    updateStudent,
    deleteStudent,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    addParent,
    updateParent,
    deleteParent,
    addReport,
    updateReport,
    deleteReport,
    updateSchool,
    addNotification,
    markNotificationAsRead,
    deleteNotification,

    // Queries
    getStudentById,
    getTeacherById,
    getParentById,
    getReportById,
    getStudentsByTeacher,
    getStudentsByParent,
    getReportsByStudent,
    getReportsByTeacher,

    // Analytics
    updateAnalytics,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}; 