import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Badge,
  ListItemAvatar,
  Switch,
  FormControlLabel,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Business,
  People,
  Payment,
  Analytics,
  Support,
  Settings,
  AccountCircle,
  Notifications,
  School,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Warning,
  Schedule,
  Email,
  Phone,
  LocationOn,
  Edit,
  Delete,
  Visibility,
  Send,
  Archive,
  Star,
  StarBorder,
  Logout,
  Person,
  MonetizationOn,
  Assessment,
  Security,
  Cloud,
  Storage,
  Speed,
  Add,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const drawerWidth = 280;

const menuItems = [
  { text: 'Global Overview', icon: <Dashboard />, section: 'overview' },
  { text: 'School Management', icon: <Business />, section: 'schools' },
  { text: 'User Management', icon: <People />, section: 'users' },
  { text: 'Billing & Subscriptions', icon: <Payment />, section: 'billing' },
  { text: 'Advanced Analytics', icon: <Analytics />, section: 'analytics' },
  { text: 'Support Center', icon: <Support />, section: 'support' },
  { text: 'System Settings', icon: <Settings />, section: 'settings' },
];

const SuperAdminDashboard: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('overview');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openSchoolDialog, setOpenSchoolDialog] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const { user, logout } = useAuth();
  const { analytics, students, teachers, reports, school } = useData();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  // Calculate global metrics from data
  const globalMetrics = {
    totalSchools: 156, // This would come from a schools array in DataContext
    totalStudents: analytics.totalStudents,
    totalReports: analytics.totalReports,
    mrr: 125000, // This would be calculated from subscription data
    arr: 1500000,
    churnRate: 2.3,
    activeUsers: analytics.totalTeachers + analytics.totalStudents,
  };

  // Mock schools data (this would come from DataContext in a real implementation)
  const schools = [
    {
      id: 1,
      name: 'Bright Future Academy',
      status: 'active',
      students: 450,
      teachers: 28,
      reports: 2340,
      subscription: 'Premium',
      renewalDate: '2024-12-15',
      contact: 'Sarah Johnson',
      email: 'sarah@brightfuture.edu',
      phone: '+1-555-0123',
      location: 'New York, NY',
    },
    {
      id: 2,
      name: 'Montessori Learning Center',
      status: 'active',
      students: 320,
      teachers: 22,
      reports: 1890,
      subscription: 'Standard',
      renewalDate: '2024-11-20',
      contact: 'Michael Chen',
      email: 'michael@montessori.edu',
      phone: '+1-555-0124',
      location: 'San Francisco, CA',
    },
    {
      id: 3,
      name: 'Little Explorers Daycare',
      status: 'trial',
      students: 180,
      teachers: 15,
      reports: 890,
      subscription: 'Trial',
      renewalDate: '2024-10-30',
      contact: 'Emily Davis',
      email: 'emily@littleexplorers.edu',
      phone: '+1-555-0125',
      location: 'Chicago, IL',
    },
  ];

  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@barrana.ai',
      role: 'Super Admin',
      status: 'active',
      lastLogin: '2024-07-30 14:30',
      permissions: ['Full Access'],
    },
    {
      id: 2,
      name: 'Lisa Wang',
      email: 'lisa@barrana.ai',
      role: 'Support Manager',
      status: 'active',
      lastLogin: '2024-07-30 12:15',
      permissions: ['Support Access', 'School Management'],
    },
    {
      id: 3,
      name: 'David Brown',
      email: 'david@barrana.ai',
      role: 'Sales Manager',
      status: 'active',
      lastLogin: '2024-07-29 16:45',
      permissions: ['Sales Access', 'Analytics'],
    },
  ];

  const billingData = [
    {
      school: 'Bright Future Academy',
      plan: 'Premium',
      amount: 2500,
      status: 'paid',
      dueDate: '2024-08-01',
      students: 450,
    },
    {
      school: 'Montessori Learning Center',
      plan: 'Standard',
      amount: 1500,
      status: 'pending',
      dueDate: '2024-08-15',
      students: 320,
    },
    {
      school: 'Little Explorers Daycare',
      plan: 'Trial',
      amount: 0,
      status: 'trial',
      dueDate: '2024-09-01',
      students: 180,
    },
  ];

  const renderSection = () => {
    switch (currentSection) {
      case 'overview':
        return <GlobalOverview />;
      case 'schools':
        return <SchoolManagement />;
      case 'users':
        return <UserManagement />;
      case 'billing':
        return <BillingManagement />;
      case 'analytics':
        return <AdvancedAnalytics />;
      case 'support':
        return <SupportCenter />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <GlobalOverview />;
    }
  };

  const GlobalOverview = () => (
    <Box>
      <Typography variant="h4" gutterBottom>
        Global Overview
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body1">
          <strong>Platform Status:</strong> All systems operational. 156 schools actively using Barrana.ai 
          with 45,230 students and 234,567 reports generated this year.
        </Typography>
      </Alert>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4">{globalMetrics.totalSchools}</Typography>
                  <Typography variant="body2" color="text.secondary">Active Schools</Typography>
                </Box>
              </Box>
              <Chip label="+12 this month" color="success" size="small" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4">{globalMetrics.totalStudents.toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">Students Managed</Typography>
                </Box>
              </Box>
              <Chip label="+2,340 this month" color="success" size="small" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4">{globalMetrics.totalReports.toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">Reports Generated</Typography>
                </Box>
              </Box>
              <Chip label="+15,670 this month" color="success" size="small" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MonetizationOn sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4">${(globalMetrics.mrr / 1000).toFixed(0)}k</Typography>
                  <Typography variant="body2" color="text.secondary">Monthly Revenue</Typography>
                </Box>
              </Box>
              <Chip label="+8% this month" color="success" size="small" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Revenue Metrics</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Monthly Recurring Revenue (MRR)</Typography>
                <Typography variant="h4">${globalMetrics.mrr.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Annual Recurring Revenue (ARR)</Typography>
                <Typography variant="h4">${globalMetrics.arr.toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Churn Rate</Typography>
                <Typography variant="h4" color="error">{globalMetrics.churnRate}%</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>System Health</Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">API Performance</Typography>
                  <Typography variant="body2" color="success.main">99.9%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={99.9} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Database Performance</Typography>
                  <Typography variant="body2" color="success.main">99.8%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={99.8} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">AI Service Uptime</Typography>
                  <Typography variant="body2" color="success.main">99.7%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={99.7} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const SchoolManagement = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">School Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenSchoolDialog(true)}
        >
          Add School
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>School Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Students</TableCell>
              <TableCell>Teachers</TableCell>
              <TableCell>Reports</TableCell>
              <TableCell>Subscription</TableCell>
              <TableCell>Renewal Date</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schools.map((school) => (
              <TableRow key={school.id}>
                <TableCell>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">{school.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{school.location}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={school.status}
                    color={school.status === 'active' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{school.students}</TableCell>
                <TableCell>{school.teachers}</TableCell>
                <TableCell>{school.reports.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={school.subscription}
                    color={school.subscription === 'Premium' ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{school.renewalDate}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{school.contact}</Typography>
                    <Typography variant="body2" color="text.secondary">{school.email}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="primary">
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const UserManagement = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">User Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenUserDialog(true)}
        >
          Add User
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                      {user.name.charAt(0)}
                    </Avatar>
                    {user.name}
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role === 'Super Admin' ? 'error' : 'primary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    color="success"
                    size="small"
                  />
                </TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {user.permissions.map((permission, index) => (
                      <Chip
                        key={index}
                        label={permission}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const BillingManagement = () => (
    <Box>
      <Typography variant="h4" gutterBottom>Billing & Subscriptions</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total Revenue</Typography>
              <Typography variant="h4">${globalMetrics.arr.toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">Annual Recurring Revenue</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Active Subscriptions</Typography>
              <Typography variant="h4">{globalMetrics.totalSchools}</Typography>
              <Typography variant="body2" color="text.secondary">Schools</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Pending Payments</Typography>
              <Typography variant="h4" color="warning.main">$12,500</Typography>
              <Typography variant="body2" color="text.secondary">Due this month</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Churn Rate</Typography>
              <Typography variant="h4" color="error">{globalMetrics.churnRate}%</Typography>
              <Typography variant="body2" color="text.secondary">Monthly average</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>School</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Students</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billingData.map((billing, index) => (
              <TableRow key={index}>
                <TableCell>{billing.school}</TableCell>
                <TableCell>
                  <Chip
                    label={billing.plan}
                    color={billing.plan === 'Premium' ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>${billing.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={billing.status}
                    color={billing.status === 'paid' ? 'success' : billing.status === 'pending' ? 'warning' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{billing.dueDate}</TableCell>
                <TableCell>{billing.students}</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const AdvancedAnalytics = () => (
    <Box>
      <Typography variant="h4" gutterBottom>Advanced Analytics</Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body1">
          Comprehensive business intelligence and analytics for platform performance, 
          school engagement, and revenue optimization.
        </Typography>
      </Alert>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Geographic Distribution</Typography>
              <Typography variant="body2" color="text.secondary">
                Schools by region and performance metrics
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Feature Adoption</Typography>
              <Typography variant="body2" color="text.secondary">
                Usage analytics for different platform features
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const SupportCenter = () => (
    <Box>
      <Typography variant="h4" gutterBottom>Support Center</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Open Tickets</Typography>
              <Typography variant="h4" color="warning.main">23</Typography>
              <Typography variant="body2" color="text.secondary">Requiring attention</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Average Response Time</Typography>
              <Typography variant="h4" color="success.main">2.3h</Typography>
              <Typography variant="body2" color="text.secondary">Last 30 days</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Customer Satisfaction</Typography>
              <Typography variant="h4" color="success.main">4.8/5</Typography>
              <Typography variant="body2" color="text.secondary">Based on 156 reviews</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const SystemSettings = () => (
    <Box>
      <Typography variant="h4" gutterBottom>System Settings</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>API Configuration</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage API keys and integrations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Security Settings</Typography>
              <Typography variant="body2" color="text.secondary">
                Configure security policies and access controls
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Barrana.ai Super Admin Dashboard
          </Typography>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleMenuOpen}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <AccountCircle sx={{ mr: 2 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Settings sx={{ mr: 2 }} />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={currentSection === item.section}
                  onClick={() => setCurrentSection(item.section)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          mt: 8,
        }}
      >
        {renderSection()}
      </Box>

      {/* Add School Dialog */}
      <Dialog open={openSchoolDialog} onClose={() => setOpenSchoolDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New School</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="School Name" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Contact Person" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Email" type="email" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Phone" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Address" multiline rows={2} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Subscription Plan</InputLabel>
                <Select label="Subscription Plan">
                  <MenuItem value="trial">Trial</MenuItem>
                  <MenuItem value="standard">Standard</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Estimated Students" type="number" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSchoolDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenSchoolDialog(false)}>
            Add School
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Full Name" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Email" type="email" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select label="Role">
                  <MenuItem value="super_admin">Super Admin</MenuItem>
                  <MenuItem value="support_manager">Support Manager</MenuItem>
                  <MenuItem value="sales_manager">Sales Manager</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Password" type="password" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenUserDialog(false)}>
            Add User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuperAdminDashboard; 