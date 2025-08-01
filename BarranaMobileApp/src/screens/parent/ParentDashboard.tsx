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

const ParentDashboard = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [children, setChildren] = useState([
    {
      id: '1',
      name: 'Emma Johnson',
      grade: 'Grade 3',
      teacher: 'Jane Teacher',
      lastReport: '2024-01-15',
      performance: 'Excellent',
      avatar: 'EJ',
    },
    {
      id: '2',
      name: 'Liam Smith',
      grade: 'Grade 4',
      teacher: 'Mike Johnson',
      lastReport: '2024-01-14',
      performance: 'Good',
      avatar: 'LS',
    },
  ]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const quickActions = [
    {
      title: 'View Reports',
      icon: 'document-text',
      color: '#1976d2',
      onPress: () => navigation.navigate('Reports'),
    },
    {
      title: 'Contact Teacher',
      icon: 'mail',
      color: '#388e3c',
      onPress: () => Alert.alert('Contact Teacher', 'Navigate to messaging'),
    },
    {
      title: 'School Calendar',
      icon: 'calendar',
      color: '#f57c00',
      onPress: () => Alert.alert('School Calendar', 'View school events'),
    },
    {
      title: 'Payment History',
      icon: 'card',
      color: '#7b1fa2',
      onPress: () => Alert.alert('Payment History', 'View payment records'),
    },
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'report',
      title: 'New progress report for Emma',
      time: '2 days ago',
      icon: 'document-text',
      color: '#1976d2',
    },
    {
      id: '2',
      type: 'message',
      title: 'Message from Liam\'s teacher',
      time: '3 days ago',
      icon: 'mail',
      color: '#388e3c',
    },
    {
      id: '3',
      type: 'event',
      title: 'Parent-teacher conference scheduled',
      time: '1 week ago',
      icon: 'calendar',
      color: '#f57c00',
    },
  ];

  const ChildCard = ({ child }) => (
    <TouchableOpacity 
      style={styles.childCard}
      onPress={() => Alert.alert('Child Details', `View details for ${child.name}`)}
    >
      <View style={styles.childHeader}>
        <View style={styles.childAvatar}>
          <Text style={styles.childInitials}>{child.avatar}</Text>
        </View>
        <View style={styles.childInfo}>
          <Text style={styles.childName}>{child.name}</Text>
          <Text style={styles.childGrade}>{child.grade}</Text>
          <Text style={styles.childTeacher}>Teacher: {child.teacher}</Text>
        </View>
        <View style={styles.performanceBadge}>
          <Text style={styles.performanceText}>{child.performance}</Text>
        </View>
      </View>
      
      <View style={styles.childDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="document-text-outline" size={16} color="#666" />
          <Text style={styles.detailText}>Last Report: {child.lastReport}</Text>
        </View>
      </View>
      
      <View style={styles.childActions}>
        <TouchableOpacity 
          style={styles.childActionButton}
          onPress={() => Alert.alert('View Reports', `View reports for ${child.name}`)}
        >
          <Ionicons name="document-text" size={16} color="#1976d2" />
          <Text style={styles.childActionText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.childActionButton}
          onPress={() => Alert.alert('Contact Teacher', `Contact ${child.teacher}`)}
        >
          <Ionicons name="mail" size={16} color="#388e3c" />
          <Text style={styles.childActionText}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.childActionButton}
          onPress={() => Alert.alert('Progress', `View progress for ${child.name}`)}
        >
          <Ionicons name="trending-up" size={16} color="#f57c00" />
          <Text style={styles.childActionText}>Progress</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Parent Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome back, Sarah!</Text>
      </View>

      {/* Children Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Children</Text>
        <View style={styles.childrenList}>
          {children.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
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

      {/* Upcoming Events */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        <View style={styles.eventsList}>
          <View style={styles.eventItem}>
            <View style={styles.eventDate}>
              <Text style={styles.eventDay}>15</Text>
              <Text style={styles.eventMonth}>JAN</Text>
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>Parent-Teacher Conference</Text>
              <Text style={styles.eventSubtitle}>Emma Johnson - 2:00 PM</Text>
            </View>
          </View>
          <View style={styles.eventItem}>
            <View style={styles.eventDate}>
              <Text style={styles.eventDay}>20</Text>
              <Text style={styles.eventMonth}>JAN</Text>
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>School Assembly</Text>
              <Text style={styles.eventSubtitle}>All students - 9:00 AM</Text>
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
  childrenList: {
    gap: 12,
  },
  childCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  childHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  childAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  childInitials: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  childGrade: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  childTeacher: {
    fontSize: 12,
    color: '#999',
  },
  performanceBadge: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  performanceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  childDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  childActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  childActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  childActionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
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
  eventsList: {
    gap: 12,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  eventDate: {
    width: 50,
    alignItems: 'center',
    marginRight: 12,
  },
  eventDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  eventMonth: {
    fontSize: 12,
    color: '#666',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  eventSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default ParentDashboard; 