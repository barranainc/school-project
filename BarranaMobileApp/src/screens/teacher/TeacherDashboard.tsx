import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TeacherDashboard = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 24,
    reportsGenerated: 96,
    pendingReports: 3,
    averageScore: 92,
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setStats({
        totalStudents: 24,
        reportsGenerated: 96,
        pendingReports: 3,
        averageScore: 92,
      });
      setRefreshing(false);
    }, 1000);
  }, []);

  const quickActions = [
    {
      title: 'Record Voice Note',
      icon: 'mic',
      color: '#1976d2',
      onPress: () => navigation.navigate('Record'),
    },
    {
      title: 'Generate Report',
      icon: 'document-text',
      color: '#388e3c',
      onPress: () => Alert.alert('Generate Report', 'Navigate to report generation'),
    },
    {
      title: 'View Students',
      icon: 'people',
      color: '#f57c00',
      onPress: () => navigation.navigate('Students'),
    },
    {
      title: 'Send Message',
      icon: 'mail',
      color: '#7b1fa2',
      onPress: () => Alert.alert('Send Message', 'Navigate to messaging'),
    },
  ];

  const recentStudents = [
    { id: '1', name: 'Emma Johnson', grade: 'Grade 3', lastReport: '2 days ago' },
    { id: '2', name: 'Liam Smith', grade: 'Grade 4', lastReport: '3 days ago' },
    { id: '3', name: 'Olivia Davis', grade: 'Grade 3', lastReport: '1 week ago' },
  ];

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="white" />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  const QuickActionCard = ({ title, icon, color, onPress }) => (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="white" />
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Teacher Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome back, Jane!</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Class Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon="people"
            color="#1976d2"
            subtitle="In your class"
          />
          <StatCard
            title="Reports Generated"
            value={stats.reportsGenerated}
            icon="document-text"
            color="#388e3c"
            subtitle="This year"
          />
          <StatCard
            title="Pending Reports"
            value={stats.pendingReports}
            icon="time"
            color="#f57c00"
            subtitle="Need attention"
          />
          <StatCard
            title="Average Score"
            value={`${stats.averageScore}%`}
            icon="trending-up"
            color="#7b1fa2"
            subtitle="Class performance"
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <QuickActionCard
              key={index}
              title={action.title}
              icon={action.icon}
              color={action.color}
              onPress={action.onPress}
            />
          ))}
        </View>
      </View>

      {/* Recent Students */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Students</Text>
        <View style={styles.studentsList}>
          {recentStudents.map((student) => (
            <TouchableOpacity 
              key={student.id}
              style={styles.studentItem}
              onPress={() => Alert.alert('Student Details', `View ${student.name}`)}
            >
              <View style={styles.studentAvatar}>
                <Text style={styles.studentInitials}>
                  {student.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentGrade}>{student.grade}</Text>
                <Text style={styles.lastReport}>Last report: {student.lastReport}</Text>
              </View>
              <TouchableOpacity style={styles.studentAction}>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Today's Schedule */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        <View style={styles.scheduleList}>
          <View style={styles.scheduleItem}>
            <View style={styles.scheduleTime}>
              <Text style={styles.timeText}>9:00 AM</Text>
            </View>
            <View style={styles.scheduleContent}>
              <Text style={styles.scheduleTitle}>Mathematics Class</Text>
              <Text style={styles.scheduleSubtitle}>Grade 3A - Room 101</Text>
            </View>
          </View>
          <View style={styles.scheduleItem}>
            <View style={styles.scheduleTime}>
              <Text style={styles.timeText}>11:00 AM</Text>
            </View>
            <View style={styles.scheduleContent}>
              <Text style={styles.scheduleTitle}>Science Class</Text>
              <Text style={styles.scheduleSubtitle}>Grade 4A - Lab 2</Text>
            </View>
          </View>
          <View style={styles.scheduleItem}>
            <View style={styles.scheduleTime}>
              <Text style={styles.timeText}>2:00 PM</Text>
            </View>
            <View style={styles.scheduleContent}>
              <Text style={styles.scheduleTitle}>Parent Meeting</Text>
              <Text style={styles.scheduleSubtitle}>Conference Room</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  section: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statSubtitle: {
    fontSize: 10,
    color: '#999',
    marginTop: 1,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  studentsList: {
    gap: 12,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  studentInitials: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  studentGrade: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  lastReport: {
    fontSize: 12,
    color: '#999',
  },
  studentAction: {
    padding: 8,
  },
  scheduleList: {
    gap: 12,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  scheduleTime: {
    width: 60,
    alignItems: 'center',
    marginRight: 12,
  },
  timeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  scheduleSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default TeacherDashboard; 