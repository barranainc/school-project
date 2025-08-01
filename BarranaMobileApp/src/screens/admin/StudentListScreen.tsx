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

const StudentListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const students = [
    {
      id: '1',
      name: 'Emma Johnson',
      grade: 'Grade 3',
      class: '3A',
      status: 'active',
      lastReport: '2024-01-15',
      parentEmail: 'parent1@email.com',
      avatar: 'EJ',
    },
    {
      id: '2',
      name: 'Liam Smith',
      grade: 'Grade 4',
      class: '4A',
      status: 'active',
      lastReport: '2024-01-14',
      parentEmail: 'parent2@email.com',
      avatar: 'LS',
    },
    {
      id: '3',
      name: 'Olivia Davis',
      grade: 'Grade 3',
      class: '3B',
      status: 'active',
      lastReport: '2024-01-13',
      parentEmail: 'parent3@email.com',
      avatar: 'OD',
    },
    {
      id: '4',
      name: 'Noah Wilson',
      grade: 'Grade 4',
      class: '4B',
      status: 'inactive',
      lastReport: '2024-01-10',
      parentEmail: 'parent4@email.com',
      avatar: 'NW',
    },
  ];

  const filters = [
    { key: 'all', label: 'All Students' },
    { key: 'active', label: 'Active' },
    { key: 'inactive', label: 'Inactive' },
    { key: 'grade3', label: 'Grade 3' },
    { key: 'grade4', label: 'Grade 4' },
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.grade.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' ||
                         (selectedFilter === 'active' && student.status === 'active') ||
                         (selectedFilter === 'inactive' && student.status === 'inactive') ||
                         (selectedFilter === 'grade3' && student.grade === 'Grade 3') ||
                         (selectedFilter === 'grade4' && student.grade === 'Grade 4');
    
    return matchesSearch && matchesFilter;
  });

  const renderStudent = ({ item }) => (
    <TouchableOpacity 
      style={styles.studentCard}
      onPress={() => Alert.alert('Student Details', `Viewing details for ${item.name}`)}
    >
      <View style={styles.studentHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{item.avatar}</Text>
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.studentGrade}>{item.grade} - {item.class}</Text>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: item.status === 'active' ? '#4caf50' : '#f44336' }
            ]} />
            <Text style={styles.statusText}>
              {item.status === 'active' ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.studentDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="mail-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.parentEmail}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="document-text-outline" size={16} color="#666" />
          <Text style={styles.detailText}>Last Report: {item.lastReport}</Text>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => Alert.alert('View Reports', `View reports for ${item.name}`)}
        >
          <Ionicons name="document-text" size={16} color="#1976d2" />
          <Text style={styles.actionButtonText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => Alert.alert('Contact Parent', `Contact parent of ${item.name}`)}
        >
          <Ionicons name="mail" size={16} color="#388e3c" />
          <Text style={styles.actionButtonText}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => Alert.alert('Edit Student', `Edit details for ${item.name}`)}
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
        <Text style={styles.headerTitle}>Students</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => Alert.alert('Add Student', 'Navigate to add student form')}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search students..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              selectedFilter === filter.key && styles.selectedFilterButton
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter.key && styles.selectedFilterText
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Student List */}
      <FlatList
        data={filteredStudents}
        renderItem={renderStudent}
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
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedFilterButton: {
    backgroundColor: '#1976d2',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  selectedFilterText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  studentCard: {
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
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  studentGrade: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  moreButton: {
    padding: 8,
  },
  studentDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
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

export default StudentListScreen; 