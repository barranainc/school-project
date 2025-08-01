import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
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
  children: string[];
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

// Mock data for mobile app
const mockStudents: Student[] = [
  {
    id: 'ST001',
    firstName: 'Emma',
    lastName: 'Johnson',
    name: 'Emma Johnson',
    grade: '1A',
    class: 'Grade 1A - STEM',
    status: 'active',
    lastReport: '2024-01-15T08:00:00Z',
    parentEmail: 'jennifer.smith@email.com',
    parentPhone: '+1 (555) 100-0001',
    avatar: 'EJ',
    teacherId: 'T001',
    parentId: 'P001',
    enrollmentDate: '2023-09-01T00:00:00Z',
    dateOfBirth: '2017-03-15T00:00:00Z',
    address: '123 Oak Street, Tech Valley, CA 94001',
    emergencyContact: '+1 (555) 200-0001',
    medicalInfo: 'None',
    academicLevel: 'Advanced',
    notes: 'Excellent student with strong leadership qualities'
  },
  {
    id: 'ST002',
    firstName: 'Liam',
    lastName: 'Chen',
    name: 'Liam Chen',
    grade: '1B',
    class: 'Grade 1B',
    status: 'active',
    lastReport: '2024-01-14T09:30:00Z',
    parentEmail: 'carlos.rodriguez@email.com',
    parentPhone: '+1 (555) 100-0002',
    avatar: 'LC',
    teacherId: 'T002',
    parentId: 'P002',
    enrollmentDate: '2023-09-01T00:00:00Z',
    dateOfBirth: '2017-07-22T00:00:00Z',
    address: '456 Pine Avenue, Tech Valley, CA 94002',
    emergencyContact: '+1 (555) 200-0002',
    medicalInfo: 'None',
    academicLevel: 'Proficient',
    notes: 'Good student with strong social skills'
  }
];

const mockTeachers: Teacher[] = [
  {
    id: 'T001',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@barranaischool.edu',
    phone: '+1 (555) 100-0001',
    grade: '1A, STEM',
    avatar: 'ER',
    students: 15,
    reportsGenerated: 45,
    lastLogin: '2024-01-15T07:30:00Z',
    status: 'active',
    avgTimePerReport: 5.2,
    efficiency: 95,
    performanceScore: 98,
    hireDate: '2020-08-15',
    specialization: 'Mathematics',
    qualifications: 'M.Ed. Mathematics Education',
    bio: 'Experienced mathematics teacher with expertise in STEM education and innovative teaching methods.',
    trainingCompleted: ['ai_basics', 'voice_recording', 'report_writing']
  },
  {
    id: 'T002',
    name: 'Michael Chen',
    email: 'michael.chen@barranaischool.edu',
    phone: '+1 (555) 100-0002',
    grade: '1B',
    avatar: 'MC',
    students: 12,
    reportsGenerated: 38,
    lastLogin: '2024-01-15T08:00:00Z',
    status: 'active',
    avgTimePerReport: 6.1,
    efficiency: 88,
    performanceScore: 91,
    hireDate: '2021-01-10',
    specialization: 'English Literature',
    qualifications: 'M.A. English Literature',
    bio: 'Passionate English teacher focused on developing critical thinking and communication skills.',
    trainingCompleted: ['ai_basics', 'voice_recording']
  }
];

const mockParents: Parent[] = [
  {
    id: 'P001',
    name: 'Jennifer Smith',
    email: 'jennifer.smith@email.com',
    phone: '+1 (555) 200-0001',
    children: ['ST001'],
    lastLogin: '2024-01-15T08:00:00Z',
    status: 'active',
    avatar: 'JS',
    address: '123 Oak Street, Tech Valley, CA 94001',
    emergencyContact: '+1 (555) 200-0001',
    preferences: {
      language: 'en',
      notifications: {
        email: true,
        sms: true,
        push: true
      }
    }
  },
  {
    id: 'P002',
    name: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@email.com',
    phone: '+1 (555) 200-0002',
    children: ['ST002'],
    lastLogin: '2024-01-15T09:30:00Z',
    status: 'active',
    avatar: 'CR',
    address: '456 Pine Avenue, Tech Valley, CA 94002',
    emergencyContact: '+1 (555) 200-0002',
    preferences: {
      language: 'es',
      notifications: {
        email: true,
        sms: true,
        push: true
      }
    }
  }
];

const mockReports: Report[] = [
  {
    id: 'R001',
    studentId: 'ST001',
    teacherId: 'T001',
    title: 'Monthly Progress Report - Emma Johnson',
    content: 'Emma is showing excellent progress in mathematics and science. She demonstrates strong problem-solving skills and enjoys participating in STEM activities.',
    status: 'completed',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
    template: 'monthly_progress',
    aiGenerated: true,
    reviewedBy: ['T001'],
    tags: ['progress_report', 'mathematics', 'science'],
    academicPeriod: '2023-2024',
    subjects: ['Mathematics', 'Science', 'English'],
    skills: {
      'Mathematics': {
        score: 95,
        level: 'Excellent',
        comments: 'Shows strong problem-solving abilities'
      },
      'Science': {
        score: 92,
        level: 'Excellent',
        comments: 'Demonstrates curiosity and analytical thinking'
      },
      'English': {
        score: 88,
        level: 'Good',
        comments: 'Good reading comprehension and writing skills'
      }
    }
  },
  {
    id: 'R002',
    studentId: 'ST002',
    teacherId: 'T002',
    title: 'Monthly Progress Report - Liam Chen',
    content: 'Liam is making good progress in English literature. He shows strong reading comprehension and enjoys creative writing activities.',
    status: 'completed',
    createdAt: '2024-01-14T09:30:00Z',
    updatedAt: '2024-01-14T09:30:00Z',
    template: 'monthly_progress',
    aiGenerated: true,
    reviewedBy: ['T002'],
    tags: ['progress_report', 'english', 'literature'],
    academicPeriod: '2023-2024',
    subjects: ['English', 'Mathematics', 'Science'],
    skills: {
      'English': {
        score: 90,
        level: 'Excellent',
        comments: 'Strong reading and writing skills'
      },
      'Mathematics': {
        score: 85,
        level: 'Good',
        comments: 'Shows good understanding of basic concepts'
      },
      'Science': {
        score: 87,
        level: 'Good',
        comments: 'Demonstrates curiosity in scientific topics'
      }
    }
  }
];

// Context interface
interface DataContextType {
  students: Student[];
  teachers: Teacher[];
  parents: Parent[];
  reports: Report[];
  getStudentsByTeacher: (teacherId: string) => Student[];
  getStudentsByParent: (parentId: string) => Student[];
  getReportsByStudent: (studentId: string) => Report[];
  getReportsByTeacher: (teacherId: string) => Report[];
}

// Create context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students] = useState<Student[]>(mockStudents);
  const [teachers] = useState<Teacher[]>(mockTeachers);
  const [parents] = useState<Parent[]>(mockParents);
  const [reports] = useState<Report[]>(mockReports);

  const getStudentsByTeacher = (teacherId: string) => 
    students.filter(student => student.teacherId === teacherId);

  const getStudentsByParent = (parentId: string) => 
    students.filter(student => student.parentId === parentId);

  const getReportsByStudent = (studentId: string) => 
    reports.filter(report => report.studentId === studentId);

  const getReportsByTeacher = (teacherId: string) => 
    reports.filter(report => report.teacherId === teacherId);

  const value: DataContextType = {
    students,
    teachers,
    parents,
    reports,
    getStudentsByTeacher,
    getStudentsByParent,
    getReportsByStudent,
    getReportsByTeacher,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Hook
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}; 