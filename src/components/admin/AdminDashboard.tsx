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
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  People,
  Message,
  Settings,
  AccountCircle,
  Notifications,
  School,
  Logout,
  Assessment,
  Analytics,
  Business,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from '../common/LanguageSelector';
import ExecutiveSummary from './sections/ExecutiveSummary';
import StudentManagement from './sections/StudentManagement';
import TeacherManagement from './sections/TeacherManagement';
import ReportConfiguration from './sections/ReportConfiguration';
import CommunicationCenter from './sections/CommunicationCenter';
import AdvancedAnalytics from './sections/AdvancedAnalytics';
import SystemSettings from './sections/SystemSettings';

const drawerWidth = 280;

const menuItems = [
  { text: 'Executive Summary', icon: <Dashboard />, section: 'dashboard' },
  { text: 'Student Management', icon: <People />, section: 'students' },
  { text: 'Teacher Management', icon: <School />, section: 'teachers' },
  { text: 'Report Configuration', icon: <Assessment />, section: 'reports' },
  { text: 'Communication Center', icon: <Message />, section: 'communication' },
  { text: 'Advanced Analytics', icon: <Analytics />, section: 'analytics' },
  { text: 'System Settings', icon: <Settings />, section: 'settings' },
];

const AdminDashboard: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();

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

  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <ExecutiveSummary />;
      case 'students':
        return <StudentManagement />;
      case 'teachers':
        return <TeacherManagement />;
      case 'reports':
        return <ReportConfiguration />;
      case 'communication':
        return <CommunicationCenter />;
      case 'analytics':
        return <AdvancedAnalytics />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <ExecutiveSummary />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.section === currentSection)?.text || 'Admin Dashboard'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Notifications */}
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            
            {/* User Menu */}
            <IconButton onClick={handleMenuOpen} color="inherit">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {user?.firstName?.charAt(0)}
              </Avatar>
            </IconButton>

            {/* Language Selector */}
            <LanguageSelector />
          </Box>
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
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid #e0e0e0',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar sx={{ height: 64 }} />
        
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Business sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Barrana.ai
              </Typography>
              <Typography variant="caption" color="text.secondary">
                School Management
              </Typography>
            </Box>
          </Box>
          
          <Chip
            label={`${user?.firstName} ${user?.lastName}`}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />
        </Box>

        <Divider />

        <List sx={{ px: 2 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.section}
              button
              onClick={() => setCurrentSection(item.section)}
              sx={{
                mb: 1,
                borderRadius: 2,
                backgroundColor: currentSection === item.section ? 'primary.main' : 'transparent',
                color: currentSection === item.section ? 'white' : 'text.primary',
                '&:hover': {
                  backgroundColor: currentSection === item.section ? 'primary.dark' : 'rgba(25, 118, 210, 0.08)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: currentSection === item.section ? 'white' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          {renderSection()}
        </Box>
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AdminDashboard; 