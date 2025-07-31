const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// Routes for direct access to different interfaces
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'demo.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/teachers', (req, res) => {
    res.sendFile(path.join(__dirname, 'teachers.html'));
});

app.get('/parents', (req, res) => {
    res.sendFile(path.join(__dirname, 'parents.html'));
});

// API endpoint to get available URLs
app.get('/api/urls', (req, res) => {
    res.json({
        main: `http://localhost:${PORT}/`,
        admin: `http://localhost:${PORT}/admin`,
        teachers: `http://localhost:${PORT}/teachers`,
        parents: `http://localhost:${PORT}/parents`,
        demo: `http://localhost:${PORT}/demo.html`
    });
});

app.listen(PORT, () => {
    console.log(`🚀 School Management System Server running on port ${PORT}`);
    console.log('\n📋 Available URLs:');
    console.log(`   Main Demo: http://localhost:${PORT}/`);
    console.log(`   Admin Dashboard: http://localhost:${PORT}/admin`);
    console.log(`   Teachers UI: http://localhost:${PORT}/teachers`);
    console.log(`   Parents UI: http://localhost:${PORT}/parents`);
    console.log(`   Demo with Login: http://localhost:${PORT}/demo.html`);
    console.log('\n🔗 Direct URL Parameters:');
    console.log(`   Admin: http://localhost:${PORT}/demo.html?role=admin`);
    console.log(`   Teachers: http://localhost:${PORT}/demo.html?role=teacher`);
    console.log(`   Parents: http://localhost:${PORT}/demo.html?role=parent`);
    console.log('\n💡 Quick Start:');
    console.log('   1. Open any URL above in your browser');
    console.log('   2. For demo.html, use the quick login buttons');
    console.log('   3. For direct pages, you\'re already logged in!');
}); 