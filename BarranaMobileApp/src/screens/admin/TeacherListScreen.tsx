import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TeacherListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const teachers = [
    {
      id: '1',
      name: 'Jane Teacher',
      email: 'jane@school.com',
      class: 'Grade 3A',
      students: 24,
      reportsGenerated: 96,
      performanceScore: 92,
      avatar: 'JT',
    },
    {
      id: '2',
      name: 'Mike Johnson',
      email: 'mike@school.com',
      class: 'Grade 4A',
      students: 22,
      reportsGenerated: 88,
      performanceScore: 88,
      avatar: 'MJ',
    },
    {
      id: '3',
      name: 'Sarah Wilson',
      email: 'sarah@school.com',
      class: 'Grade 3B',
      students: 26,
      reportsGenerated: 104,
      performanceScore: 95,
      avatar: 'SW',
    },
  ];

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTeacher = ({ item }) => (
    <TouchableOpacity 
      style={styles.teacherCard}
      onPress={() => Alert.alert('Teacher Details', `Viewing details for ${item.name}`)}
    >
      <View style={styles.teacherHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{item.avatar}</Text>
        </View>
        <View style={styles.teacherInfo}>
          <Text style={styles.teacherName}>{item.name}</Text>
          <Text style={styles.teacherEmail}>{item.email}</Text>
          <Text style={styles.teacherClass}>{item.class}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.students}</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.reportsGenerated}</Text>
          <Text style={styles.statLabel}>Reports</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.performanceScore}%</Text>
          <Text style={styles.statLabel}>Performance</Text>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => Alert.alert('View Reports', `View reports by ${item.name}`)}
        >
          <Ionicons name="document-text" size={16} color="#1976d2" />
          <Text style={styles.actionButtonText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => Alert.alert('Contact Teacher', `Contact ${item.name}`)}
        >
          <Ionicons name="mail" size={16} color="#388e3c" />
          <Text style={styles.actionButtonText}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => Alert.alert('Edit Teacher', `Edit details for ${item.name}`)}
        >
          <Ionicons name="create" size={16} color="#f57c00" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Teachers</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => Alert.alert('Add Teacher', 'Navigate to add teacher form')}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search teachers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredTeachers}
        renderItem={renderTeacher}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    backgroundColor: '#1976d2',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    padding: 16,
  },
  teacherCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teacherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#388e3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  teacherEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  teacherClass: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: 'bold',
  },
  moreButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
});

export default TeacherListScreen; 