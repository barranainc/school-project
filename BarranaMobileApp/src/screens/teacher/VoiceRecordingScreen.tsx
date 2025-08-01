import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const VoiceRecordingScreen = ({ navigation }) => {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [reportText, setReportText] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [recordings, setRecordings] = useState([]);

  const students = [
    { id: '1', name: 'Emma Johnson', grade: 'Grade 3' },
    { id: '2', name: 'Liam Smith', grade: 'Grade 4' },
    { id: '3', name: 'Olivia Davis', grade: 'Grade 3' },
    { id: '4', name: 'Noah Wilson', grade: 'Grade 4' },
  ];

  const startRecording = async () => {
    try {
      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant microphone permissions to record voice notes.');
        return;
      }

      // Configure audio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      Alert.alert('Recording failed', 'Could not start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);

    // Add to recordings list
    const newRecording = {
      id: Date.now().toString(),
      uri,
      timestamp: new Date().toISOString(),
      studentName: selectedStudent,
      duration: '00:30', // Mock duration
    };
    setRecordings([newRecording, ...recordings]);

    Alert.alert('Recording saved', 'Your voice note has been saved successfully!');
  };

  const transcribeRecording = async (recordingUri) => {
    if (!selectedStudent) {
      Alert.alert('Select Student', 'Please select a student before transcribing.');
      return;
    }

    setIsTranscribing(true);
    
    // Simulate transcription process
    setTimeout(() => {
      const mockTranscription = `Emma has shown excellent progress in mathematics this week. She completed all her homework assignments on time and participated actively in class discussions. Her problem-solving skills have improved significantly, and she's helping other students understand difficult concepts. Emma demonstrates strong leadership qualities and maintains a positive attitude throughout the day.`;
      
      setTranscription(mockTranscription);
      setIsTranscribing(false);
      Alert.alert('Transcription Complete', 'Your voice note has been transcribed successfully!');
    }, 3000);
  };

  const generateAIReport = async () => {
    if (!transcription) {
      Alert.alert('No Transcription', 'Please transcribe a recording first.');
      return;
    }

    setIsGeneratingReport(true);
    
    // Simulate AI report generation
    setTimeout(() => {
      const mockReport = `Academic Progress Report for ${selectedStudent}

Student Performance Summary:
Emma Johnson has demonstrated exceptional academic growth this quarter. Her mathematical reasoning skills have shown remarkable improvement, with consistent completion of homework assignments and active classroom participation.

Key Achievements:
• Completed all mathematics assignments with 95% accuracy
• Actively participated in class discussions and group activities
• Demonstrated strong problem-solving abilities
• Helped peers understand complex mathematical concepts

Areas of Strength:
• Mathematical reasoning and problem-solving
• Classroom participation and engagement
• Leadership and peer collaboration
• Time management and organization

Recommendations:
• Continue challenging Emma with advanced mathematical concepts
• Encourage her to take on leadership roles in group projects
• Provide opportunities for peer tutoring activities

Overall Assessment: Excellent progress with strong potential for continued academic excellence.`;
      
      setReportText(mockReport);
      setIsGeneratingReport(false);
      Alert.alert('Report Generated', 'AI report has been generated successfully!');
    }, 4000);
  };

  const RecordingItem = ({ recording }) => (
    <View style={styles.recordingItem}>
      <View style={styles.recordingInfo}>
        <Text style={styles.recordingTitle}>
          Voice Note for {recording.studentName || 'Unknown Student'}
        </Text>
        <Text style={styles.recordingTime}>
          {new Date(recording.timestamp).toLocaleString()}
        </Text>
        <Text style={styles.recordingDuration}>Duration: {recording.duration}</Text>
      </View>
      <View style={styles.recordingActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => transcribeRecording(recording.uri)}
        >
          <Ionicons name="text" size={20} color="#1976d2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="play" size={20} color="#388e3c" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="trash" size={20} color="#d32f2f" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Voice Recording</Text>
        <Text style={styles.headerSubtitle}>Record voice notes for student reports</Text>
      </View>

      {/* Student Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Student</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {students.map((student) => (
            <TouchableOpacity
              key={student.id}
              style={[
                styles.studentCard,
                selectedStudent === student.name && styles.selectedStudentCard
              ]}
              onPress={() => setSelectedStudent(student.name)}
            >
              <Text style={[
                styles.studentName,
                selectedStudent === student.name && styles.selectedStudentName
              ]}>
                {student.name}
              </Text>
              <Text style={styles.studentGrade}>{student.grade}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recording Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Record Voice Note</Text>
        <View style={styles.recordingControls}>
          <TouchableOpacity
            style={[styles.recordButton, isRecording && styles.recordingButton]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Ionicons 
              name={isRecording ? "stop" : "mic"} 
              size={32} 
              color="white" 
            />
          </TouchableOpacity>
          <Text style={styles.recordingStatus}>
            {isRecording ? 'Recording... Tap to stop' : 'Tap to start recording'}
          </Text>
        </View>
      </View>

      {/* Transcription */}
      {transcription && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transcription</Text>
          <TextInput
            style={styles.transcriptionInput}
            value={transcription}
            onChangeText={setTranscription}
            multiline
            placeholder="Transcription will appear here..."
          />
          <TouchableOpacity
            style={styles.generateButton}
            onPress={generateAIReport}
            disabled={isGeneratingReport}
          >
            {isGeneratingReport ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="sparkles" size={20} color="white" />
                <Text style={styles.generateButtonText}>Generate AI Report</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* AI Generated Report */}
      {reportText && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Generated Report</Text>
          <TextInput
            style={styles.reportInput}
            value={reportText}
            onChangeText={setReportText}
            multiline
            placeholder="AI report will appear here..."
          />
          <View style={styles.reportActions}>
            <TouchableOpacity style={styles.reportActionButton}>
              <Ionicons name="share" size={20} color="#1976d2" />
              <Text style={styles.reportActionText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportActionButton}>
              <Ionicons name="download" size={20} color="#388e3c" />
              <Text style={styles.reportActionText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportActionButton}>
              <Ionicons name="mail" size={20} color="#f57c00" />
              <Text style={styles.reportActionText}>Email</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Recent Recordings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Recordings</Text>
        {recordings.length === 0 ? (
          <Text style={styles.emptyText}>No recordings yet. Start recording to see them here.</Text>
        ) : (
          recordings.map((recording) => (
            <RecordingItem key={recording.id} recording={recording} />
          ))
        )}
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
  studentCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  selectedStudentCard: {
    backgroundColor: '#1976d2',
  },
  studentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedStudentName: {
    color: 'white',
  },
  studentGrade: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  recordingControls: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  recordingButton: {
    backgroundColor: '#d32f2f',
  },
  recordingStatus: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  transcriptionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#fafafa',
  },
  generateButton: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  reportInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 200,
    textAlignVertical: 'top',
    backgroundColor: '#fafafa',
  },
  reportActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  reportActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  reportActionText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
  recordingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recordingInfo: {
    flex: 1,
  },
  recordingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  recordingTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  recordingDuration: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  recordingActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
});

export default VoiceRecordingScreen; 