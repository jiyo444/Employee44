import { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Container, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Alert, TextField, Grid, Card, CardContent,
  Avatar, Chip, Stack
} from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const onDashboard = location.pathname === '/';
  return (
    <AppBar position="static" elevation={0} className="topbar">
      <Toolbar className="toolbar">
        <Box className="brand">
          <Box className="brand-icon"><PeopleAltOutlinedIcon /></Box>
          <Typography variant="h6" component="span" className="brand-name">PeopleDesk</Typography>
        </Box>
        <Box className="nav-links">
          <Button
            component={Link}
            to="/"
            startIcon={<DashboardOutlinedIcon />}
            className={onDashboard ? 'nav-button active' : 'nav-button'}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/employee-form"
            startIcon={<PersonAddAlt1OutlinedIcon />}
            className={location.pathname === '/employee-form' ? 'nav-button active' : 'nav-button'}
          >
            Employee Form
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch('https://jsonplaceholder.typicode.com/users', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Could not load employee data.');
        return response.json();
      })
      .then((data) => {
        setEmployees(data);
        setError('');
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError('Unable to load users. Please check your internet connection and try again.');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <Container maxWidth="lg" className="page-container">
      <Box className="page-heading">
        <Box>
          <Typography variant="overline" className="eyebrow">PEOPLE MANAGEMENT</Typography>
          <Typography variant="h4" className="page-title">Employee Dashboard</Typography>
          <Typography className="page-subtitle">View and manage your employee directory.</Typography>
        </Box>
        <Button component={Link} to="/employee-form" variant="contained" startIcon={<PersonAddAlt1OutlinedIcon />}>
          Add Employee
        </Button>
      </Box>

      <Grid container spacing={2} className="stats-row">
        <Grid item xs={12} sm={6} md={4}>
          <Card className="stat-card" elevation={0}>
            <CardContent className="stat-content">
              <Avatar className="stat-avatar"><PeopleAltOutlinedIcon /></Avatar>
              <Box>
                <Typography className="stat-label">Total users</Typography>
                <Typography variant="h5" className="stat-number">{loading ? '—' : employees.length}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="stat-card" elevation={0}>
            <CardContent className="stat-content">
              <Avatar className="stat-avatar email-avatar"><EmailOutlinedIcon /></Avatar>
              <Box>
                <Typography className="stat-label">Data source</Typography>
                <Typography variant="h6" className="stat-source">JSONPlaceholder API</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={0} className="table-paper">
        <Box className="table-heading">
          <Box>
            <Typography variant="h6" className="section-title">Employee Directory</Typography>
            <Typography variant="body2" className="muted">User details loaded from the external API</Typography>
          </Box>
          <Chip label={`${loading ? 'Loading…' : employees.length + ' records'}`} className="count-chip" />
        </Box>

        {loading && <Box className="loading"><CircularProgress size={30} /><Typography>Loading employees…</Typography></Box>}
        {error && <Alert severity="error" className="message">{error}</Alert>}

        {!loading && !error && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>NAME</TableCell>
                  <TableCell>EMAIL ADDRESS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id} hover>
                    <TableCell><span className="id-pill">{employee.id}</span></TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar className="employee-avatar">{employee.name.charAt(0)}</Avatar>
                        <Typography className="employee-name">{employee.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell className="email-cell">{employee.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      <Typography className="footer-note">Employee Dashboard · Demo data provided by JSONPlaceholder</Typography>
    </Container>
  );
}

function EmployeeForm() {
  const [form, setForm] = useState({ name: '', designation: '', location: '', salary: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Please enter the employee name.';
    if (!form.designation.trim()) nextErrors.designation = 'Please enter a designation.';
    if (!form.location.trim()) nextErrors.location = 'Please enter a location.';
    if (!form.salary || Number(form.salary) < 0) nextErrors.salary = 'Enter a valid salary.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
      // Demo form: data is confirmed on screen but is not saved to a backend.
    }
  };

  return (
    <Container maxWidth="md" className="page-container">
      <Box className="page-heading">
        <Box>
          <Typography variant="overline" className="eyebrow">PEOPLE MANAGEMENT</Typography>
          <Typography variant="h4" className="page-title">Employee Form</Typography>
          <Typography className="page-subtitle">Enter the details of a new employee.</Typography>
        </Box>
        <Button component={Link} to="/" variant="outlined" startIcon={<DashboardOutlinedIcon />}>Back to Home</Button>
      </Box>

      <Paper elevation={0} className="form-paper">
        <Box className="form-banner">
          <Avatar className="form-banner-icon"><PersonAddAlt1OutlinedIcon /></Avatar>
          <Box>
            <Typography variant="h6" className="section-title">Employee information</Typography>
            <Typography variant="body2" className="muted">Fields marked with * are required.</Typography>
          </Box>
        </Box>
        {submitted && (
          <Alert severity="success" className="message">
            Form submitted successfully! This demo does not save data to a server.
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required label="Name" name="name" value={form.name} onChange={handleChange}
                error={Boolean(errors.name)} helperText={errors.name} placeholder="Enter full name" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required label="Designation" name="designation" value={form.designation} onChange={handleChange}
                error={Boolean(errors.designation)} helperText={errors.designation} placeholder="e.g. Software Developer" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required label="Location" name="location" value={form.location} onChange={handleChange}
                error={Boolean(errors.location)} helperText={errors.location} placeholder="e.g. Kochi" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required type="number" label="Salary" name="salary" value={form.salary} onChange={handleChange}
                error={Boolean(errors.salary)} helperText={errors.salary} placeholder="Enter salary" inputProps={{ min: 0 }} />
            </Grid>
          </Grid>
          <Box className="form-actions">
            <Button type="button" variant="outlined" color="inherit" onClick={() => {
              setForm({ name: '', designation: '', location: '', salary: '' });
              setErrors({});
              setSubmitted(false);
            }}>Clear</Button>
            <Button type="submit" variant="contained" startIcon={<PersonAddAlt1OutlinedIcon />}>Submit Employee</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employee-form" element={<EmployeeForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}