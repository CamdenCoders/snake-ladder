const {spawn} = require('child_process');
const {networkInterfaces} = require('os');
const {writeFileSync,unlinkSync} = require('fs');
const path = require('path');
const root=path.resolve(__dirname,'..');
const addresses=Object.values(networkInterfaces()).flat().filter(a=>a.family==='IPv4'&&!a.internal).map(a=>a.address);
const url=`http://${addresses[0] || 'localhost'}:3000`;
const info=path.join(root,'public/lan-info.json');
writeFileSync(info,JSON.stringify({url}));
console.log(`\nComputer: http://localhost:3000\nPhone (same Wi-Fi): ${url}\n`);
const children=[
 spawn(process.execPath,['server.js'],{cwd:path.resolve(root,'../snake-ladder_backend'),stdio:'inherit',detached:process.platform!=='win32',env:{...process.env,PORT:'3500',FRONTEND_ORIGINS:['http://localhost:3000',...addresses.map(a=>`http://${a}:3000`)].join(',')}}),
 spawn('npm',['start'],{cwd:root,stdio:'inherit',detached:process.platform!=='win32',env:{...process.env,BROWSER:'none',HOST:'0.0.0.0',PORT:'3000'}})
];
let stopping=false;
function stop(code=0) {if(stopping)return;stopping=true;children.forEach(c=>{try{if(process.platform!=='win32'&&c.pid)process.kill(-c.pid,'SIGTERM');else c.kill('SIGTERM');}catch{}});try{unlinkSync(info);}catch{};process.exitCode=code;}
process.on('SIGINT',()=>stop());process.on('SIGTERM',()=>stop());
children.forEach(c=>{c.on('error',e=>{console.error(e.message);stop(1);});c.on('exit',code=>stop(code||0));});
