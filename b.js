const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

// Function to start the Node process
async function startNodeProcess() {
  console.log('Starting Node process...');
  try {
    exec('node index.js');
    console.log('Node process started successfully.');
  } catch (error) {
    console.error(`Error starting Node process: ${error}`);
  }
}

// Function to restart Node process
async function restartNodeProcess() {
  console.log('Restarting Node process...');
  try {
    await exec('pkill node');
    startNodeProcess(); // Restart Node process
  } catch (error) {
    console.error(`Error restarting Node process: ${error}`);
  }
}

// Start Node process initially
startNodeProcess();

// Restart Node process every 3 hours
setInterval(restartNodeProcess, 3 * 60 * 60 * 1000);
