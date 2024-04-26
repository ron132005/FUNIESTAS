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

function runTmuxLoop() {
  let sessionName = 'mysession';
  executeCommand(`tmux new-session -d -s ${sessionName}`)
    .then(() => executeCommand(`tmux send-keys -t ${sessionName} "cd project && node index" C-m`))
    .then(() => {
      setTimeout(() => {
        executeCommand(`tmux kill-session -t ${sessionName}`)
          .then(() => {
            const logMessage = `[${new Date().toISOString()}] Session ${sessionName} closed, restarting tmux...`;
            fs.appendFileSync(logFilePath, logMessage + '\n');
            runTmuxLoop();
          })
          .catch((error) => {
            logError(error);
            setTimeout(runTmuxLoop, 10000); // Retry after 10 seconds
          });
      }, 2 * 60 * 60 * 1000); // 15 seconds in milliseconds
    })
    .catch((error) => {
      logError(error);
      setTimeout(runTmuxLoop, 10000); // Retry after 10 seconds
    });
}

// Main function wrapped in try-catch block to restart in case of error
function startScript() {
  try {
    runTmuxLoop();
  } catch (error) {
    logError(error);
    setTimeout(runTmuxLoop, 10000); // Retry after 10 seconds
  }
}