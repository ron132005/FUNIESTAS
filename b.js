const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'tmux_script.log');

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

function logError(error) {
  const errorMessage = `[${new Date().toISOString()}] Error: ${error}`;
  fs.appendFileSync(logFilePath, errorMessage + '\n');
}

async function runTmuxLoop() {
  const sessionName = 'mysession';
  try {
    await executeCommand(`tmux new-session -d -s ${sessionName}`);
    await executeCommand(`tmux send-keys -t ${sessionName} "cd project && node index" C-m`);
    await new Promise(resolve => setTimeout(resolve, 10 * 60 * 1000)); // 15 minutes in milliseconds
    await executeCommand(`tmux kill-session -t ${sessionName}`);
    const logMessage = `[${new Date().toISOString()}] Session ${sessionName} closed, restarting tmux...`;
    fs.appendFileSync(logFilePath, logMessage + '\n');
    runTmuxLoop();
  } catch (error) {
    logError(error);
    setTimeout(runTmuxLoop, 10000); // Retry after 10 seconds
  }
}

runTmuxLoop();
