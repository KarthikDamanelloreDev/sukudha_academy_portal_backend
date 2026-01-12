require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./db/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================

// CORS - Allow all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// ============================================
// SWAGGER DOCUMENTATION
// ============================================

let swaggerDocument;
try {
    swaggerDocument = require('./swagger-output.json');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Sukudha Academy API Docs'
    }));
    console.log('✓ Swagger documentation available at /api-docs');
} catch (error) {
    console.log('⚠ Swagger documentation not found. Run "npm run swagger" to generate it.');
}

// ============================================
// API ROUTES
// ============================================

app.use('/api', routes);

// ============================================
// ROOT ROUTE
// ============================================

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Sukudha Academy API Server',
        version: '1.0.0',
        status: 'Running',
        endpoints: {
            api: '/api',
            docs: '/api-docs',
            health: '/api/health'
        }
    });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ============================================
// DATABASE CONNECTION & SERVER START
// ============================================

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start server
        app.listen(PORT, () => {
            console.log('');
            console.log('═══════════════════════════════════════════════════════');
            console.log('  🚀 SUKUDHA ACADEMY API SERVER');
            console.log('═══════════════════════════════════════════════════════');
            console.log(`  ✓ Server running on port: ${PORT}`);
            console.log(`  ✓ Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`  ✓ API Base URL: http://localhost:${PORT}/api`);
            console.log(`  ✓ API Docs: http://localhost:${PORT}/api-docs`);
            console.log('═══════════════════════════════════════════════════════');
            console.log('');
            console.log('  Available Endpoints:');
            console.log(`  • GET    /api/courses`);
            console.log(`  • POST   /api/courses`);
            console.log(`  • GET    /api/courses/:id`);
            console.log(`  • PUT    /api/courses/:id`);
            console.log(`  • DELETE /api/courses/:id`);
            console.log(`  • GET    /api/courses/stats`);
            console.log('');
            console.log(`  • GET    /api/instructors`);
            console.log(`  • POST   /api/instructors`);
            console.log(`  • GET    /api/instructors/:id`);
            console.log(`  • PUT    /api/instructors/:id`);
            console.log(`  • DELETE /api/instructors/:id`);
            console.log(`  • GET    /api/instructors/stats`);
            console.log('');
            console.log(`  • GET    /api/contact-info`);
            console.log(`  • PUT    /api/contact-info`);
            console.log('');
            console.log(`  • GET    /api/overview`);
            console.log(`  • GET    /api/health`);
            console.log('═══════════════════════════════════════════════════════');
            console.log('');
        });
    } catch (error) {
        console.error('✗ Failed to start server:', error.message);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('✗ Unhandled Promise Rejection:', err.message);
    process.exit(1);
});

// Start the server
startServer();

module.exports = app;
