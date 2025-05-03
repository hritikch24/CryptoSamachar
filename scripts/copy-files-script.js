const fs = require('fs-extra');
const path = require('path');

async function copyFiles() {
    console.log('Copying files to dist directory...');
    
    try {
        // Ensure dist directory exists
        const distDir = path.join(__dirname, '../dist');
        await fs.ensureDir(distDir);
        
        // Copy index.html
        await fs.copy(
            path.join(__dirname, '../index.html'),
            path.join(distDir, 'index.html')
        );
        
        // Copy data directory
        await fs.copy(
            path.join(__dirname, '../data'),
            path.join(distDir, 'data')
        );
        
        console.log('Files copied successfully');
    } catch (error) {
        console.error('Error copying files:', error);
        process.exit(1);
    }
}

copyFiles();