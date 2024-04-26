const openvpnmanager = require('node-openvpn');
const { exec } = require('child_process');

const opts = {
  host: 'PH-SVPN.tcpvpn.com',
  port: 443, // SSL/TLS Port
  timeout: 1500, // Timeout for connection
};

const auth = {
  user: 'tcpvpn.com-ronron',
  pass: 'ronron',
};

const openvpn = openvpnmanager.connect(opts);

openvpn.on('connected', () => {
  openvpnmanager.authorize(auth);

  // Execute 'node b.js' after connecting to the VPN
  exec('node b.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running 'node b.js': ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`'node b.js' stderr: ${stderr}`);
      return;
    }
    console.log(`'node b.js' stdout: ${stdout}`);
  });
});

openvpn.on('console-output', output => {
  console.log(output);
});

openvpn.on('state-change', state => {
  console.log(state);
});

openvpn.on('error', error => {
  console.log(error);
});