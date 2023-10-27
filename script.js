const { exec } = require('child_process'); // install this dependacies

// Function to execute a command and handle errors
const executeCommand = (command, options = {}) => {
  return new Promise((resolve, reject) => {
    const child = exec(command, options);

    child.on('error', (error) => {
      reject(error);
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Command failed with code ${code}`);
      }
    });
  });
};

async function run() {
  try {
    // Run commands in the back-end folder
    await executeCommand('docker-compose up -d', { cwd: 'back-end' });
    await executeCommand('npx prisma migrate dev', { cwd: 'back-end' });
    await executeCommand('npx prisma studio', { cwd: 'back-end' });
    await executeCommand('npm run start:dev', { cwd: 'back-end' });

    // Run the command in the front-end folder
    await executeCommand('npm run dev', { cwd: 'front-end' });

    console.log('All commands have been executed successfully.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1); // Exit the script with an error code
  }
}

run();
