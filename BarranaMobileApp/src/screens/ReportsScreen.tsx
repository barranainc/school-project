import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReportsScreen = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const reports = [
    {
      id: '1',
      studentName: 'Emma Johnson',
      teacherName: 'Jane Teacher',
      date: '2024-01-15',
      type: 'Progress Report',
      status: 'completed',
      grade: 'Grade 3',
    },
    {
      id: '2',
      studentName: 'Liam Smith',
      teacherName: 'Mike Johnson',
      date: '2024-01-14',
      type: 'Behavior Report',
      status: 'pending',
      grade: 'Grade 4',
    },
    {
      id: '3',
      studentName: 'Olivia Davis',
      teacherName: 'Sarah Wilson',
      date: '2024-01-13',
      type: 'Academic Report',
      status: 'completed',
      grade: 'Grade 3',
    },
  ];

  const filters = [
    { key: 'all', label: 'All Reports' },
    { key: 'completed', label: 'Completed' },
    { key: 'pending', label: 'Pending' },
  ];

  const filteredReports = reports.filter(report => 
    selectedFilter === 'all' || report.status === selectedFilter
  );

  const renderReport = ({ item }) => (
    <TouchableOpacity 
      style={styles.reportCard}
      onPress={() => Alert.alert('View Report', `Viewing report for ${item.studentName}`)}
    >
      <View style={styles.reportHeader}>
        <View style={styles.reportInfo}>
          <Text style={styles.studentName}>{item.studentName}</Text>
          <Text style={styles.reportType}>{item.type}</Text>
          <Text style={styles.teacherName}>By: {item.teacherName}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: item.status === 'completed' ? '#4caf50' : '#ff9800' }
          ]} />
          <Text style={styles.statusText}>
            {item.status === 'completed' ? 'Completed' : 'Pending'}
          </Text>
        </View>
      </View>
      
      <View style={styles.reportDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="school-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.grade}</Text>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => Alert.alert('View Report', `View full report for ${item.studentName}`)}
        >
          <Ionicons name="eye" size={16} color="#1976d2" />
          <Text style={styles.actionButtonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => Alert.alert('Download Report', `Download report for ${item.studentName}`)}
        >
          <Ionicons name="download" size={16} color="#388e3c" />
          <Text style={styles.actionButtonText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => Alert.alert('Share Report', `Share report for ${item.studentName}`)}
        >
          <Ionicons name="share" size={16} color="#f57c00" />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => Alert.alert('Generate Report', 'Navigate to report generation')}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
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
      </View>

      <FlatList
        data={filteredReports}
        renderItem={renderReport}
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
  filtersContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  reportCard: {
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
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reportInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  reportType: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  teacherName: {
    fontSize: 12,
    color: '#666',
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
  reportDetails: {
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

export default ReportsScreen; 