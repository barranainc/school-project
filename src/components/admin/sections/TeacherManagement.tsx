import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
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
  Switch,
  FormControlLabel,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  LinearProgress,
  Badge,
} from '@mui/material';
import {
  People,
  School,
  Assessment,
  Timer,
  TrendingUp,
  TrendingDown,
  Add,
  Edit,
  Delete,
  Visibility,
  Email,
  Phone,
  CalendarToday,
  Star,
  CheckCircle,
  Warning,
  Info,
  Book,
  VideoLibrary,
  Help,
} from '@mui/icons-material';
import { useData } from '../../../contexts/DataContext';

const TeacherManagement: React.FC = () => {
  const [openTeacherDialog, setOpenTeacherDialog] = useState(false);
  const [openTrainingDialog, setOpenTrainingDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'view'>('add');
  const [teacherToDelete, setTeacherToDelete] = useState<any>(null);

  // State for teacher form
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    email: '',
    phone: '',
    grade: '',
    password: '',
    sendWelcomeEmail: true,
    hireDate: '',
    specialization: '',
    qualifications: '',
    bio: '',
  });

  const { teachers, addTeacher, updateTeacher, deleteTeacher, analytics } = useData();

  const performanceMetrics = {
    totalTeachers: teachers.length,
    activeTeachers: teachers.filter(t => t.status === 'active').length,
    totalReports: teachers.reduce((sum, t) => sum + t.reportsGenerated, 0),
    avgReportsPerTeacher: Math.round(teachers.reduce((sum, t) => sum + t.reportsGenerated, 0) / teachers.length) || 0,
    avgEfficiency: Math.round(teachers.reduce((sum, t) => sum + t.efficiency, 0) / teachers.length) || 0,
    trainingNeeded: 3,
  };

  const trainingResources = [
    {
      id: 1,
      title: 'Voice Recording Best Practices',
      type: 'video',
      duration: '15 min',
      description: 'Learn how to record clear voice notes for optimal AI processing',
      completed: 24,
      total: 28,
    },
    {
      id: 2,
      title: 'Report Review and Editing',
      type: 'guide',
      duration: '20 min',
      description: 'How to effectively review and edit AI-generated reports',
      completed: 18,
      total: 28,
    },
    {
      id: 3,
      title: 'System Navigation Tutorial',
      type: 'interactive',
      duration: '10 min',
      description: 'Complete walkthrough of the teacher interface',
      completed: 28,
      total: 28,
    },
  ];

  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'];

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'success';
    if (efficiency >= 80) return 'warning';
    return 'error';
  };

  const getEfficiencyIcon = (efficiency: number) => {
    if (efficiency >= 90) return <TrendingUp color="success" />;
    if (efficiency >= 80) return <TrendingDown color="warning" />;
    return <TrendingDown color="error" />;
  };

  const handleOpenTeacherDialog = (type: 'add' | 'edit' | 'view', teacherId?: string) => {
    setDialogType(type);
    setOpenTeacherDialog(true);
    
    if (type === 'add') {
      setTeacherForm({
        name: '',
        email: '',
        phone: '',
        grade: '',
        password: '',
        sendWelcomeEmail: true,
        hireDate: '',
        specialization: '',
        qualifications: '',
        bio: '',
      });
      setSelectedTeacher(null);
    } else if (teacherId) {
      const teacher = teachers.find(t => t.id === teacherId);
      if (teacher) {
        setSelectedTeacher(teacher);
        setTeacherForm({
          name: teacher.name,
          email: teacher.email,
          phone: teacher.phone,
          grade: teacher.grade,
          password: '',
          sendWelcomeEmail: false,
          hireDate: teacher.hireDate,
          specialization: teacher.specialization,
          qualifications: teacher.qualifications,
          bio: teacher.bio,
        });
      }
    }
  };

  const handleCloseTeacherDialog = () => {
    setOpenTeacherDialog(false);
    setTeacherForm({
      name: '',
      email: '',
      phone: '',
      grade: '',
      password: '',
      sendWelcomeEmail: true,
      hireDate: '',
      specialization: '',
      qualifications: '',
      bio: '',
    });
    setSelectedTeacher(null);
  };

  const handleFormChange = (field: string, value: string | boolean) => {
    setTeacherForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveTeacher = () => {
    if (dialogType === 'add') {
      // Generate avatar initials from name
      const nameParts = teacherForm.name.split(' ');
      const avatar = nameParts.length >= 2 
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : teacherForm.name.substring(0, 2).toUpperCase();

      addTeacher({
        name: teacherForm.name,
        email: teacherForm.email,
        phone: teacherForm.phone,
        grade: teacherForm.grade,
        students: 0,
        reportsGenerated: 0,
        lastLogin: 'Never',
        status: 'active' as const,
        avgTimePerReport: 0,
        efficiency: 0,
        avatar,
        hireDate: teacherForm.hireDate,
        specialization: teacherForm.specialization,
        qualifications: teacherForm.qualifications,
        bio: teacherForm.bio,
        performanceScore: 0,
        trainingCompleted: [],
      });
      alert('Teacher added successfully!');
    } else if (dialogType === 'edit' && selectedTeacher) {
      updateTeacher(selectedTeacher.id, {
        name: teacherForm.name,
        email: teacherForm.email,
        phone: teacherForm.phone,
        grade: teacherForm.grade,
        hireDate: teacherForm.hireDate,
        specialization: teacherForm.specialization,
        qualifications: teacherForm.qualifications,
        bio: teacherForm.bio,
      });
      alert('Teacher updated successfully!');
    }
    
    handleCloseTeacherDialog();
  };

  const handleDeleteTeacher = (teacher: any) => {
    setTeacherToDelete(teacher);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteTeacher = () => {
    if (teacherToDelete) {
      deleteTeacher(teacherToDelete.id);
      alert('Teacher deleted successfully!');
      setTeacherToDelete(null);
      setOpenDeleteDialog(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Teacher & Staff Management
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body1">
          Manage teacher accounts, track performance metrics, and provide training resources.
        </Typography>
      </Alert>

      {/* Performance Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {performanceMetrics.totalTeachers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Teachers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {performanceMetrics.activeTeachers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Teachers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {performanceMetrics.totalReports.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Reports
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {performanceMetrics.avgReportsPerTeacher}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Reports/Teacher
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {performanceMetrics.avgEfficiency}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Efficiency
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Training</Typography>
                <Badge badgeContent={performanceMetrics.trainingNeeded} color="error">
                  <Book />
                </Badge>
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenTrainingDialog(true)}
                fullWidth
                size="small"
              >
                Add Resource
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Teacher List */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                  <People sx={{ mr: 1 }} />
                  Teacher Directory
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenTeacherDialog('add')}
                >
                  Add Teacher
                </Button>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Teacher</TableCell>
                      <TableCell>Grade</TableCell>
                      <TableCell>Students</TableCell>
                      <TableCell>Reports Generated</TableCell>
                      <TableCell>Avg Time/Report</TableCell>
                      <TableCell>Efficiency</TableCell>
                      <TableCell>Last Login</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                              {teacher.avatar}
                            </Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight="bold">
                                {teacher.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {teacher.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={teacher.grade} color="primary" size="small" />
                        </TableCell>
                        <TableCell>{teacher.students}</TableCell>
                        <TableCell>{teacher.reportsGenerated}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Timer sx={{ fontSize: 16 }} />
                            <Typography variant="body2">
                              {teacher.avgTimePerReport} min
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getEfficiencyIcon(teacher.efficiency)}
                            <Chip
                              label={`${teacher.efficiency}%`}
                              color={getEfficiencyColor(teacher.efficiency) as any}
                              size="small"
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {teacher.lastLogin}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={teacher.status}
                            color={teacher.status === 'active' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleOpenTeacherDialog('view', teacher.id)}
                            >
                              <Visibility />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleOpenTeacherDialog('edit', teacher.id)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteTeacher(teacher)}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Assessment sx={{ mr: 1 }} />
                Reports Generated Per Teacher
              </Typography>
              <List>
                {teachers.slice(0, 4).map((teacher) => (
                  <ListItem key={teacher.id}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {teacher.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={teacher.name}
                      secondary={`${teacher.reportsGenerated} reports generated`}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(teacher.reportsGenerated / 200) * 100}
                        sx={{ width: 60, height: 6, borderRadius: 3 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {teacher.reportsGenerated}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Timer sx={{ mr: 1 }} />
                Average Time per Voice Note
              </Typography>
              <List>
                {teachers.slice(0, 4).map((teacher) => (
                  <ListItem key={teacher.id}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {teacher.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={teacher.name}
                      secondary={`${teacher.avgTimePerReport} minutes average`}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {teacher.avgTimePerReport <= 8 ? (
                        <CheckCircle color="success" />
                      ) : teacher.avgTimePerReport <= 10 ? (
                        <Warning color="warning" />
                      ) : (
                        <Info color="error" />
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {teacher.avgTimePerReport} min
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Training & Resources */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Book sx={{ mr: 1 }} />
                Training & Resources
              </Typography>

              <Grid container spacing={3}>
                {trainingResources.map((resource) => (
                  <Grid item xs={12} md={4} key={resource.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          {resource.type === 'video' && <VideoLibrary color="primary" />}
                          {resource.type === 'guide' && <Book color="primary" />}
                          {resource.type === 'interactive' && <Help color="primary" />}
                          <Typography variant="h6" sx={{ ml: 1 }}>
                            {resource.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {resource.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Duration: {resource.duration}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {resource.completed}/{resource.total} completed
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(resource.completed / resource.total) * 100}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{ mt: 2 }}
                          startIcon={<Visibility />}
                        >
                          View Resource
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Teacher Dialog */}
      <Dialog open={openTeacherDialog} onClose={handleCloseTeacherDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogType === 'add' && 'Add New Teacher'}
          {dialogType === 'edit' && 'Edit Teacher'}
          {dialogType === 'view' && 'Teacher Details'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'view' ? (
            <Box>
              {selectedTeacher && (
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Teacher Information</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Name</Typography>
                      <Typography variant="body1">{selectedTeacher.name}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{selectedTeacher.email}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Phone</Typography>
                      <Typography variant="body1">{selectedTeacher.phone}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Grade</Typography>
                      <Typography variant="body1">{selectedTeacher.grade}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Status</Typography>
                      <Chip
                        label={selectedTeacher.status}
                        color={selectedTeacher.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Hire Date</Typography>
                      <Typography variant="body1">{selectedTeacher.hireDate}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Specialization</Typography>
                      <Typography variant="body1">{selectedTeacher.specialization}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Students</Typography>
                      <Typography variant="body1">{selectedTeacher.students}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Reports Generated</Typography>
                      <Typography variant="body1">{selectedTeacher.reportsGenerated}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Average Time per Report</Typography>
                      <Typography variant="body1">{selectedTeacher.avgTimePerReport} minutes</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Efficiency</Typography>
                      <Chip
                        label={`${selectedTeacher.efficiency}%`}
                        color={getEfficiencyColor(selectedTeacher.efficiency) as any}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Performance Score</Typography>
                      <Typography variant="body1">{selectedTeacher.performanceScore}%</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Last Login</Typography>
                      <Typography variant="body1">{selectedTeacher.lastLogin}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Qualifications</Typography>
                      <Typography variant="body1">{selectedTeacher.qualifications}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Bio</Typography>
                      <Typography variant="body1">{selectedTeacher.bio}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Box>
          ) : (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Full Name" 
                  value={teacherForm.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Email" 
                  type="email" 
                  value={teacherForm.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Phone" 
                  value={teacherForm.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Grade Level</InputLabel>
                  <Select 
                    label="Grade Level"
                    value={teacherForm.grade}
                    onChange={(e) => handleFormChange('grade', e.target.value)}
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
                  label="Hire Date" 
                  type="date"
                  value={teacherForm.hireDate}
                  onChange={(e) => handleFormChange('hireDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Specialization" 
                  value={teacherForm.specialization}
                  onChange={(e) => handleFormChange('specialization', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Qualifications" 
                  value={teacherForm.qualifications}
                  onChange={(e) => handleFormChange('qualifications', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Bio" 
                  value={teacherForm.bio}
                  onChange={(e) => handleFormChange('bio', e.target.value)}
                />
              </Grid>
              {dialogType === 'add' && (
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    label="Password" 
                    type="password" 
                    value={teacherForm.password}
                    onChange={(e) => handleFormChange('password', e.target.value)}
                    required
                  />
                </Grid>
              )}
              {dialogType === 'add' && (
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={teacherForm.sendWelcomeEmail}
                        onChange={(e) => handleFormChange('sendWelcomeEmail', e.target.checked)}
                      />
                    }
                    label="Send welcome email with login credentials"
                  />
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTeacherDialog}>Cancel</Button>
          {dialogType !== 'view' && (
            <Button 
              variant="contained" 
              onClick={handleSaveTeacher}
              disabled={!teacherForm.name || !teacherForm.email || !teacherForm.phone || !teacherForm.grade || (dialogType === 'add' && !teacherForm.password)}
            >
              {dialogType === 'add' ? 'Add Teacher' : 'Save Changes'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete {teacherToDelete?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={confirmDeleteTeacher}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Training Resource Dialog */}
      <Dialog open={openTrainingDialog} onClose={() => setOpenTrainingDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Training Resource</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Resource Title" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Resource Type</InputLabel>
                <Select label="Resource Type">
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="guide">Guide</MenuItem>
                  <MenuItem value="interactive">Interactive Tutorial</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Duration (e.g., 15 min)" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                placeholder="Describe what this resource covers..."
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Resource File
                <input type="file" hidden />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTrainingDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenTrainingDialog(false)}>
            Add Resource
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherManagement; 