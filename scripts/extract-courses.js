const fs = require('fs');
const path = require('path');

const extractCourses = () => {
    const tsFilePath = path.join(__dirname, '../../SUKUDHA-ACADEMY-FRONTEND/src/data/courses.ts');
    const targetPath = path.join(__dirname, '../data-seed/courses.js');

    console.log('Reading courses.ts from:', tsFilePath);
    const content = fs.readFileSync(tsFilePath, 'utf8');

    // Find the start of the courses array
    const startMarker = 'export const courses: Course[] =';
    const startIndex = content.indexOf(startMarker);

    if (startIndex === -1) {
        console.error('Could not find courses array in TS file');
        return;
    }

    // Extract everything from the bracket onwards
    let dataPart = content.substring(startIndex + startMarker.length).trim();

    // The data ends with ];
    // We want to convert this into a Node.js module
    // We can just replace the starting part and the ending part if it's clean
    // Or we can just use a regex to find the last ];

    const lastBracketIndex = dataPart.lastIndexOf('];');
    if (lastBracketIndex !== -1) {
        dataPart = dataPart.substring(0, lastBracketIndex + 1);
    }

    const output = `const courses = ${dataPart};\n\nmodule.exports = courses;`;

    if (!fs.existsSync(path.dirname(targetPath))) {
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    }

    fs.writeFileSync(targetPath, output);
    console.log('Courses data extracted successfully to:', targetPath);
};

extractCourses();
