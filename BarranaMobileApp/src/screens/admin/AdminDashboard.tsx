import React, { useState, useEffect } from 'react';
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

const AdminDashboard = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 156,
    totalTeachers: 12,
    totalReports: 892,
    activeReports: 45,
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setStats({
        totalStudents: 156,
        totalTeachers: 12,
        totalReports: 892,
        activeReports: 45,
      });
      setRefreshing(false);
    }, 1000);
  }, []);

  const quickActions = [
    {
      title: 'Add Student',
      icon: 'person-add',
      color: '#1976d2',
      onPress: () => Alert.alert('Add Student', 'Navigate to student management'),
    },
    {
      title: 'Add Teacher',
      icon: 'school',
      color: '#388e3c',
      onPress: () => Alert.alert('Add Teacher', 'Navigate to teacher management'),
    },
    {
      title: 'Generate Report',
      icon: 'document-text',
      color: '#f57c00',
      onPress: () => Alert.alert('Generate Report', 'Navigate to report generation'),
    },
    {
      title: 'Send Message',
      icon: 'mail',
      color: '#7b1fa2',
      onPress: () => Alert.alert('Send Message', 'Navigate to communication center'),
    },
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'report',
      title: 'New report generated for Emma Johnson',
      time: '2 hours ago',
      icon: 'document-text',
      color: '#1976d2',
    },
    {
      id: '2',
      type: 'student',
      title: 'New student registered: Liam Smith',
      time: '4 hours ago',
      icon: 'person-add',
      color: '#388e3c',
    },
    {
      id: '3',
      type: 'teacher',
      title: 'Teacher performance review completed',
      time: '6 hours ago',
      icon: 'school',
      color: '#f57c00',
    },
    {
      id: '4',
      type: 'message',
      title: 'Parent message received from Sarah Parent',
      time: '8 hours ago',
      icon: 'mail',
      color: '#7b1fa2',
    },
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

  const ActivityItem = ({ title, time, icon, color }) => (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={16} color="white" />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome back, Admin!</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>School Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon="people"
            color="#1976d2"
            subtitle="Active enrollment"
          />
          <StatCard
            title="Total Teachers"
            value={stats.totalTeachers}
            icon="school"
            color="#388e3c"
            subtitle="Staff members"
          />
          <StatCard
            title="Total Reports"
            value={stats.totalReports}
            icon="document-text"
            color="#f57c00"
            subtitle="Generated this year"
          />
          <StatCard
            title="Active Reports"
            value={stats.activeReports}
            icon="time"
            color="#7b1fa2"
            subtitle="Pending review"
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

      {/* Recent Activities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        <View style={styles.activitiesList}>
          {recentActivities.map((activity) => (
            <ActivityItem
              key={activity.id}
              title={activity.title}
              time={activity.time}
              icon={activity.icon}
              color={activity.color}
            />
          ))}
        </View>
      </View>

      {/* Quick Navigation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Navigation</Text>
        <View style={styles.navigationGrid}>
          <TouchableOpacity 
            style={styles.navCard}
            onPress={() => navigation.navigate('Students')}
          >
            <Ionicons name="people" size={24} color="#1976d2" />
            <Text style={styles.navTitle}>Students</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navCard}
            onPress={() => navigation.navigate('Teachers')}
          >
            <Ionicons name="school" size={24} color="#388e3c" />
            <Text style={styles.navTitle}>Teachers</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navCard}
            onPress={() => navigation.navigate('Reports')}
          >
            <Ionicons name="analytics" size={24} color="#f57c00" />
            <Text style={styles.navTitle}>Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navCard}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings" size={24} color="#7b1fa2" />
            <Text style={styles.navTitle}>Settings</Text>
          </TouchableOpacity>
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
  activitiesList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  navigationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  navCard: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  navTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default AdminDashboard; 