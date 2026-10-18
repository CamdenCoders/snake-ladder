const {test} = require('node:test');
const assert = require('node:assert/strict');
const {localHostname, lanInfo} = require('../scripts/lan.cjs');

test('macOS uses the Bonjour name rather than the system hostname', () => {
  assert.equal(localHostname({platform:'darwin', hostname:()=> 'different.example', exec:(file, args) => {
    assert.equal(file, '/usr/sbin/scutil');
    assert.deepEqual(args, ['--get', 'LocalHostName']);
    return 'Game-Host\n';
  }}), 'game-host.local');
});
test('other hosts normalize the local suffix', () => {
  for (const name of ['GAME-HOST.LOCAL', 'game-host', 'game-host.local', 'game-host.example.org', 'game-host.local.']) {
    assert.equal(localHostname({platform:'linux', hostname:()=>name}), 'game-host.local');
  }
});
test('the shared hostname origin is allowed by the backend', () => {
  const info = lanInfo();
  assert.ok(info.origins.includes(info.url));
  assert.ok(info.origins.includes('http://localhost:3000'));
});
