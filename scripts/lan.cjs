const os = require('os');
const {execFileSync} = require('child_process');

function localHostname({platform = process.platform, hostname = os.hostname, exec = execFileSync} = {}) {
  // macOS's Bonjour name can differ from its system hostname.
  const name = platform === 'darwin'
    ? exec('/usr/sbin/scutil', ['--get', 'LocalHostName'], {encoding: 'utf8'}).trim()
    : hostname().replace(/\.$/, '');
  if (!name) throw new Error('Local hostname is unavailable');
  return (name.toLowerCase().endsWith('.local') ? name : `${name.split('.')[0]}.local`).toLowerCase();
}

function lanInfo() {
  const addresses = Object.values(os.networkInterfaces()).flat()
    .filter(a => a.family === 'IPv4' && !a.internal).map(a => a.address);
  let host;
  try { host = localHostname(); }
  catch { host = addresses[0] || 'localhost'; }
  const url = `http://${host}:3000`;
  return {url, origins: [...new Set(['http://localhost:3000', url, ...addresses.map(a => `http://${a}:3000`)])]};
}

module.exports = {localHostname, lanInfo};
