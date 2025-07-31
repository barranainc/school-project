import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Button,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  School,
  Assessment,
  Notifications,
  CheckCircle,
  Warning,
  Info,
} from '@mui/icons-material';

const ExecutiveSummary: React.FC = () => {
  // Mock data - in real app, this would come from API
  const kpis = [
    {
      title: 'Total Students',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: <People />,
      color: '#1976d2',
    },
    {
      title: 'Active Teachers',
      value: '89',
      change: '+5%',
      trend: 'up',
      icon: <School />,
      color: '#2e7d32',
    },
    {
      title: 'Reports Generated',
      value: '3,456',
      change: '+23%',
      trend: 'up',
      icon: <Assessment />,
      color: '#ed6c02',
    },
    {
      title: 'Parent Engagement',
      value: '94%',
      change: '+8%',
      trend: 'up',
      icon: <Notifications />,
      color: '#9c27b0',
    },
  ];

  const insights = [
    {
      type: 'success',
      title: 'High Parent Engagement',
      description: '94% of parents are actively viewing reports, up 8% from last month.',
      icon: <CheckCircle />,
    },
    {
      type: 'warning',
      title: 'Teacher Workload Alert',
      description: '3 teachers have generated over 50 reports this week. Consider workload distribution.',
      icon: <Warning />,
    },
    {
      type: 'info',
      title: 'AI Accuracy Improving',
      description: 'Voice-to-text accuracy has improved to 96.2% this month.',
      icon: <Info />,
    },
  ];

  const recentActivity = [
    {
      action: 'New student enrolled',
      details: 'Emma Johnson joined Grade 3A',
      time: '2 hours ago',
      user: 'Admin User',
    },
    {
      action: 'Report generated',
      details: 'Progress report for Liam Smith (Grade 4)',
      time: '4 hours ago',
      user: 'Ms. Davis',
    },
    {
      action: 'Parent login',
      details: 'Sarah Wilson viewed her child\'s report',
      time: '6 hours ago',
      user: 'Parent',
    },
    {
      action: 'Teacher training completed',
      details: 'Voice recording best practices workshop',
      time: '1 day ago',
      user: 'Training System',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Executive Summary
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of your school's performance and key metrics
        </Typography>
      </Box>

      {/* KPIs Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: kpi.color, mr: 2 }}>
                    {kpi.icon}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" component="div">
                      {kpi.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {kpi.title}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {kpi.trend === 'up' ? (
                    <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                  ) : (
                    <TrendingDown sx={{ color: 'error.main', mr: 1 }} />
                  )}
                  <Typography
                    variant="body2"
                    color={kpi.trend === 'up' ? 'success.main' : 'error.main'}
                  >
                    {kpi.change} from last month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Insights and Activity */}
      <Grid container spacing={3}>
        {/* Key Insights */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Key Insights
              </Typography>
              <List>
                {insights.map((insight, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: `${insight.type}.main` }}>
                          {insight.icon}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" color="text.primary">
                            {insight.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {insight.description}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < insights.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {recentActivity.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" color="text.primary">
                            {activity.action}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {activity.details}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                {activity.user}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {activity.time}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button variant="contained" startIcon={<People />}>
              Add New Student
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" startIcon={<School />}>
              Invite Teacher
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" startIcon={<Assessment />}>
              Generate Report
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" startIcon={<Notifications />}>
              Send Announcement
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ExecutiveSummary; 