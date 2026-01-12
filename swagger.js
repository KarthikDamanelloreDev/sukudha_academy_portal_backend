const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Sukudha Academy API',
        description: 'Backend API for Sukudha Academy - Course Management System',
        version: '1.0.0',
    },
    host: 'localhost:5000',
    basePath: '/api',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            name: 'Courses',
            description: 'Course management endpoints'
        },
        {
            name: 'Instructors',
            description: 'Instructor management endpoints'
        },
        {
            name: 'Contact Info',
            description: 'Contact information endpoints'
        },
        {
            name: 'Overview',
            description: 'Dashboard overview and statistics'
        }
    ],
    definitions: {
        Course: {
            id: 'web-dev-bootcamp',
            title: 'Complete Web Development Bootcamp',
            category: 'Web Development',
            level: 'Beginner',
            rating: 4.8,
            reviews: 1500,
            students: 5000,
            price: 34460,
            originalPrice: 51580,
            instructor: 'John Doe',
            instructorId: 'instructor-001',
            duration: '42h 30m',
            lectures: 156,
            description: 'Learn web development from scratch',
            highlights: ['HTML & CSS', 'JavaScript', 'React'],
            bestseller: true,
            free: false
        },
        Instructor: {
            id: 'instructor-001',
            name: 'Dr. Suresh Gangavarapu',
            role: 'Full Stack Developer',
            bio: 'Experienced professional with 10+ years',
            color: 'bg-blue-600',
            rating: 4.7,
            courses: 22,
            students: 259554,
            specializations: ['Web Development', 'Marketing'],
            social: {
                linkedin: '#',
                twitter: '#',
                website: '#'
            }
        },
        ContactInfo: {
            companyName: 'SukudhaEdu',
            companyLegalName: 'SUKUDHA SOFTWARE SOLUTIONS PRIVATE LIMITED',
            email: 'Info@sukudhaedu.com',
            phone: '8886648491',
            address: '6-13-14A, 13/3 Arundelpet',
            city: 'Guntur',
            state: 'Andhra Pradesh',
            zip: '522002'
        }
    }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('✓ Swagger documentation generated successfully');
});
