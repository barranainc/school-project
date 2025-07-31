import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  ColorLens,
  FormatSize,
  Email,
  Description,
  School,
  Assessment,
} from '@mui/icons-material';

const ReportConfiguration: React.FC = () => {
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
  const [openFieldDialog, setOpenFieldDialog] = useState(false);
  const [openBrandingDialog, setOpenBrandingDialog] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  // Mock data
  const reportTemplates = [
    {
      id: 1,
      name: 'Daycare Progress Report',
      category: 'Daycare',
      standards: ['Social Development', 'Physical Development', 'Language Skills'],
      isActive: true,
      lastModified: '2024-07-30',
    },
    {
      id: 2,
      name: 'Montessori Assessment',
      category: 'Montessori',
      standards: ['Practical Life', 'Sensorial', 'Mathematics', 'Language'],
      isActive: true,
      lastModified: '2024-07-29',
    },
    {
      id: 3,
      name: 'Private School Report',
      category: 'Private School',
      standards: ['Academic Performance', 'Social Skills', 'Extracurricular'],
      isActive: false,
      lastModified: '2024-07-28',
    },
  ];

  const customFields = [
    {
      id: 1,
      name: 'Adherence to School Values',
      type: 'rating',
      category: 'Character Development',
      isRequired: true,
    },
    {
      id: 2,
      name: 'Participation in Extracurriculars',
      type: 'text',
      category: 'Activities',
      isRequired: false,
    },
    {
      id: 3,
      name: 'Homework Completion',
      type: 'percentage',
      category: 'Academic',
      isRequired: true,
    },
  ];

  const emailTemplates = [
    {
      id: 1,
      name: 'Standard Progress Report',
      subject: 'Progress Report for {studentName}',
      isDefault: true,
      lastModified: '2024-07-30',
    },
    {
      id: 2,
      name: 'Monthly Update',
      subject: 'Monthly Update - {studentName}',
      isDefault: false,
      lastModified: '2024-07-29',
    },
  ];

  const brandingSettings = {
    schoolName: 'Bright Future Academy',
    primaryColor: '#1976d2',
    secondaryColor: '#dc004e',
    logo: '/logo.png',
    fontFamily: 'Segoe UI',
    fontSize: '14px',
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Report & Template Configuration
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body1">
          Configure report templates, custom fields, branding, and email templates for your school.
        </Typography>
      </Alert>

      {/* Report Templates */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Description sx={{ mr: 1 }} />
                  Report Templates
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenTemplateDialog(true)}
                >
                  Add Template
                </Button>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Template Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Standards</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last Modified</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell>
                          <Typography variant="body1" fontWeight="bold">
                            {template.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={template.category} color="primary" size="small" />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {template.standards.slice(0, 2).map((standard, index) => (
                              <Chip
                                key={index}
                                label={standard}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                            {template.standards.length > 2 && (
                              <Chip
                                label={`+${template.standards.length - 2} more`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={template.isActive ? 'Active' : 'Inactive'}
                            color={template.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{template.lastModified}</TableCell>
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Custom Report Fields */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Assessment sx={{ mr: 1 }} />
                  Custom Report Fields
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenFieldDialog(true)}
                >
                  Add Field
                </Button>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Field Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Required</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customFields.map((field) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <Typography variant="body1" fontWeight="bold">
                            {field.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={field.type} color="secondary" size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip label={field.category} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={field.isRequired ? 'Yes' : 'No'}
                            color={field.isRequired ? 'error' : 'default'}
                            size="small"
                          />
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Branding & Formatting */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                  <ColorLens sx={{ mr: 1 }} />
                  Branding & Formatting
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setOpenBrandingDialog(true)}
                >
                  Edit
                </Button>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">School Name</Typography>
                <Typography variant="body1">{brandingSettings.schoolName}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Primary Color</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: brandingSettings.primaryColor,
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body1">{brandingSettings.primaryColor}</Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Secondary Color</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: brandingSettings.secondaryColor,
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body1">{brandingSettings.secondaryColor}</Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Font Family</Typography>
                <Typography variant="body1">{brandingSettings.fontFamily}</Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">Font Size</Typography>
                <Typography variant="body1">{brandingSettings.fontSize}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Email Templates */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email sx={{ mr: 1 }} />
                  Email Templates
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenEmailDialog(true)}
                >
                  Add Template
                </Button>
              </Box>

              <List>
                {emailTemplates.map((template) => (
                  <React.Fragment key={template.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" fontWeight="bold">
                              {template.name}
                            </Typography>
                            {template.isDefault && (
                              <Chip label="Default" color="primary" size="small" />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Subject: {template.subject}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Modified: {template.lastModified}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Template Dialog */}
      <Dialog open={openTemplateDialog} onClose={() => setOpenTemplateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Report Template</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Template Name" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select label="Category">
                  <MenuItem value="daycare">Daycare</MenuItem>
                  <MenuItem value="montessori">Montessori</MenuItem>
                  <MenuItem value="private_school">Private School</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Active"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Standards (comma-separated)"
                multiline
                rows={3}
                placeholder="Social Development, Physical Development, Language Skills"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTemplateDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenTemplateDialog(false)}>
            Save Template
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Field Dialog */}
      <Dialog open={openFieldDialog} onClose={() => setOpenFieldDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Custom Field</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Field Name" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Field Type</InputLabel>
                <Select label="Field Type">
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="checkbox">Checkbox</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select label="Category">
                  <MenuItem value="academic">Academic</MenuItem>
                  <MenuItem value="social">Social</MenuItem>
                  <MenuItem value="character">Character Development</MenuItem>
                  <MenuItem value="activities">Activities</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch />}
                label="Required Field"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFieldDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenFieldDialog(false)}>
            Add Field
          </Button>
        </DialogActions>
      </Dialog>

      {/* Branding Dialog */}
      <Dialog open={openBrandingDialog} onClose={() => setOpenBrandingDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Branding & Formatting</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="School Name" defaultValue={brandingSettings.schoolName} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Primary Color" defaultValue={brandingSettings.primaryColor} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Secondary Color" defaultValue={brandingSettings.secondaryColor} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Font Family</InputLabel>
                <Select label="Font Family" defaultValue={brandingSettings.fontFamily}>
                  <MenuItem value="Segoe UI">Segoe UI</MenuItem>
                  <MenuItem value="Arial">Arial</MenuItem>
                  <MenuItem value="Helvetica">Helvetica</MenuItem>
                  <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Font Size" defaultValue={brandingSettings.fontSize} />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label">
                Upload Logo
                <input type="file" hidden accept="image/*" />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBrandingDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenBrandingDialog(false)}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email Template Dialog */}
      <Dialog open={openEmailDialog} onClose={() => setOpenEmailDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Email Template</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Template Name" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Subject Line" placeholder="Progress Report for {studentName}" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Body"
                multiline
                rows={6}
                placeholder="Dear {parentName},&#10;&#10;Please find attached the progress report for {studentName}..."
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch />}
                label="Set as Default Template"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEmailDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenEmailDialog(false)}>
            Save Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportConfiguration; 