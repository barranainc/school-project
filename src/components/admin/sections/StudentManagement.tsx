import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Checkbox,
  Tooltip,
  Badge,
  Alert,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  FilterList,
  Download,
  Upload,
  MoreVert,
  School,
  Person,
  Email,
  Phone,
} from '@mui/icons-material';
import { useData } from '../../../contexts/DataContext';

const StudentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedStudentData, setSelectedStudentData] = useState<any>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    grade: '',
    class: '',
    status: 'active' as 'active' | 'pending' | 'inactive',
    parentEmail: '',
    parentPhone: '',
    enrollmentDate: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    medicalInfo: '',
    academicLevel: '',
    notes: '',
  });

  const { students, addStudent, updateStudent, deleteStudent } = useData();

  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'];
  const statuses = ['active', 'pending', 'inactive'];

  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = filterGrade === '' || student.grade === filterGrade;
    const matchesStatus = filterStatus === '' || student.status === filterStatus;
    
    return matchesSearch && matchesGrade && matchesStatus;
  });

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedStudents(filteredStudents.map(student => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleOpenDialog = (type: 'add' | 'edit' | 'view', studentId?: string) => {
    setDialogType(type);
    setOpenDialog(true);
    
    if (type === 'add') {
      setFormData({
        firstName: '',
        lastName: '',
        grade: '',
        class: '',
        status: 'active' as 'active' | 'pending' | 'inactive',
        parentEmail: '',
        parentPhone: '',
        enrollmentDate: '',
        dateOfBirth: '',
        address: '',
        emergencyContact: '',
        medicalInfo: '',
        academicLevel: '',
        notes: '',
      });
      setSelectedStudentData(null);
    } else if (studentId) {
      const student = students.find(s => s.id === studentId);
      if (student) {
        setSelectedStudentData(student);
        setFormData({
          firstName: student.firstName,
          lastName: student.lastName,
          grade: student.grade,
          class: student.class,
          status: student.status,
          parentEmail: student.parentEmail,
          parentPhone: student.parentPhone,
          enrollmentDate: student.enrollmentDate,
          dateOfBirth: student.dateOfBirth,
          address: student.address,
          emergencyContact: student.emergencyContact,
          medicalInfo: student.medicalInfo,
          academicLevel: student.academicLevel,
          notes: student.notes,
        });
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      firstName: '',
      lastName: '',
      grade: '',
      class: '',
      status: 'active' as 'active' | 'pending' | 'inactive',
      parentEmail: '',
      parentPhone: '',
      enrollmentDate: '',
      dateOfBirth: '',
      address: '',
      emergencyContact: '',
      medicalInfo: '',
      academicLevel: '',
      notes: '',
    });
    setSelectedStudentData(null);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveStudent = () => {
    if (dialogType === 'add') {
      // Generate avatar initials from name
      const nameParts = formData.firstName.split(' ');
      const avatar = nameParts.length >= 2 
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : formData.firstName.substring(0, 2).toUpperCase();

      addStudent({
        ...formData,
        avatar,
        lastReport: 'Never',
        teacherId: undefined,
        parentId: undefined,
      });
      alert('Student added successfully!');
    } else if (dialogType === 'edit' && selectedStudentData) {
      updateStudent(selectedStudentData.id, formData);
      alert('Student updated successfully!');
    }
    
    handleCloseDialog();
  };

  const handleDeleteStudents = () => {
    if (selectedStudents.length === 0) {
      alert('Please select students to delete');
      return;
    }
    
    setOpenDeleteDialog(true);
  };

  const confirmDeleteStudents = () => {
    selectedStudents.forEach(studentId => {
      deleteStudent(studentId);
    });
    alert('Students deleted successfully!');
    setSelectedStudents([]);
    setOpenDeleteDialog(false);
  };

  const handleExportStudents = () => {
    const dataToExport = selectedStudents.length > 0 
      ? students.filter(s => selectedStudents.includes(s.id))
      : students;
    
    // In a real app, this would generate and download a CSV/Excel file
    console.log('Exporting students:', dataToExport);
    alert('Student data exported successfully!');
  };

  const handleImportStudents = () => {
    // In a real app, this would open a file picker and process the file
    alert('Import functionality will be implemented here');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Student Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage student records, enrollment, and academic progress
        </Typography>
      </Box>

      {/* Search and Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Grade</InputLabel>
                <Select
                  value={filterGrade}
                  onChange={(e) => setFilterGrade(e.target.value)}
                  label="Grade"
                >
                  <MenuItem value="">All Grades</MenuItem>
                  {grades.map(grade => (
                    <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  {statuses.map(status => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenDialog('add')}
                >
                  Add Student
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Upload />}
                  onClick={handleImportStudents}
                >
                  Import
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleExportStudents}
                >
                  Export
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedStudents.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">
                {selectedStudents.length} student(s) selected
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleDeleteStudents}
              >
                Delete Selected
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleExportStudents}
              >
                Export Selected
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Student Directory Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                      indeterminate={selectedStudents.length > 0 && selectedStudents.length < filteredStudents.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Student</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Report</TableCell>
                  <TableCell>Parent Contact</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleSelectStudent(student.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {student.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {student.firstName} {student.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {student.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>
                      <Chip
                        label={student.status}
                        color={getStatusColor(student.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{student.lastReport}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{student.parentEmail}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {student.parentPhone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog('view', student.id)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Student">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog('edit', student.id)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Student">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              setSelectedStudents([student.id]);
                              handleDeleteStudents();
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {filteredStudents.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No students found matching your criteria
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Student Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogType === 'add' && 'Add New Student'}
          {dialogType === 'edit' && 'Edit Student'}
          {dialogType === 'view' && 'Student Details'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'view' ? (
            <Box>
              {selectedStudentData && (
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Student Information</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Name</Typography>
                      <Typography variant="body1">{selectedStudentData.firstName} {selectedStudentData.lastName}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Student ID</Typography>
                      <Typography variant="body1">{selectedStudentData.id}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Grade</Typography>
                      <Typography variant="body1">{selectedStudentData.grade}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Class</Typography>
                      <Typography variant="body1">{selectedStudentData.class}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Status</Typography>
                      <Chip
                        label={selectedStudentData.status}
                        color={getStatusColor(selectedStudentData.status) as any}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Enrollment Date</Typography>
                      <Typography variant="body1">{selectedStudentData.enrollmentDate}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                      <Typography variant="body1">{selectedStudentData.dateOfBirth}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Contact Information</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Parent Email</Typography>
                      <Typography variant="body1">{selectedStudentData.parentEmail}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Parent Phone</Typography>
                      <Typography variant="body1">{selectedStudentData.parentPhone}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Address</Typography>
                      <Typography variant="body1">{selectedStudentData.address}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Emergency Contact</Typography>
                      <Typography variant="body1">{selectedStudentData.emergencyContact}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Medical Info</Typography>
                      <Typography variant="body1">{selectedStudentData.medicalInfo}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Academic Level</Typography>
                      <Typography variant="body1">{selectedStudentData.academicLevel}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Notes</Typography>
                      <Typography variant="body1">{selectedStudentData.notes}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleFormChange('firstName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleFormChange('lastName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Grade</InputLabel>
                  <Select
                    value={formData.grade}
                    onChange={(e) => handleFormChange('grade', e.target.value)}
                    label="Grade"
                  >
                    {grades.map(grade => (
                      <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Class"
                  value={formData.class}
                  onChange={(e) => handleFormChange('class', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    label="Status"
                  >
                    {statuses.map(status => (
                      <MenuItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Parent Email"
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => handleFormChange('parentEmail', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Parent Phone"
                  value={formData.parentPhone}
                  onChange={(e) => handleFormChange('parentPhone', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Enrollment Date"
                  type="date"
                  value={formData.enrollmentDate}
                  onChange={(e) => handleFormChange('enrollmentDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleFormChange('dateOfBirth', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={(e) => handleFormChange('address', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Emergency Contact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleFormChange('emergencyContact', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Medical Info"
                  value={formData.medicalInfo}
                  onChange={(e) => handleFormChange('medicalInfo', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Academic Level"
                  value={formData.academicLevel}
                  onChange={(e) => handleFormChange('academicLevel', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Notes"
                  value={formData.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {dialogType !== 'view' && (
            <Button 
              variant="contained" 
              onClick={handleSaveStudent}
              disabled={!formData.firstName || !formData.lastName || !formData.grade || !formData.class}
            >
              {dialogType === 'add' ? 'Add Student' : 'Save Changes'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete {selectedStudents.length} student(s)? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={confirmDeleteStudents}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentManagement; 