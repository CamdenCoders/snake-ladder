const assert=require('node:assert/strict');
const {createServer}=require('../../snake-ladder_backend/server');
const {io}=require('socket.io-client');
(async()=>{
 const server=createServer({port:0,logger:()=>{},animationMs:0,dice:()=>5}); const clients=[];
 await new Promise(r=>server.io.httpServer.listening?r():server.io.httpServer.once('listening',r));
 const url=`http://localhost:${server.io.httpServer.address().port}`;
 const ask=(s,e,p)=>new Promise((resolve,reject)=>s.timeout(2000).emit(e,p,(err,res)=>err?reject(err):resolve(res)));
 try {
  for(let i=0;i<5;i++) { const s=io(url,{transports:['websocket'],reconnection:false}); clients.push(s); await new Promise((r,j)=>{s.once('connect',r);s.once('connect_error',j)}); }
  const created=await ask(clients[0],'create-room',{capacity:4}); assert.ok(created.ok);const roomId=created.state.roomId;
  assert.equal((await ask(clients[0],'join-room',{roomId})).ok,false);
  assert.equal((await ask(clients[1],'join-room',{roomId:'FFFFFF'})).ok,false);
  for(let i=1;i<4;i++) assert.ok((await ask(clients[i],'join-room',{roomId})).ok);
  assert.equal((await ask(clients[4],'join-room',{roomId})).ok,false);
  const views=clients.slice(0,4).map(()=>null); clients.slice(0,4).forEach((s,i)=>s.on('game-state',v=>views[i]=v));
  assert.equal((await ask(clients[4],'roll',{roomId,version:4})).ok,false);
  assert.equal((await ask(clients[1],'roll',{roomId,version:4})).ok,false);
  assert.ok((await ask(clients[0],'roll',{roomId,version:4})).ok);
  assert.equal((await ask(clients[0],'roll',{roomId,version:4})).ok,false);
  await new Promise(r=>setTimeout(r,30));
  views.forEach(v=>{assert.equal(v.players[0].position,24);assert.equal(v.turn,1);assert.equal(v.version,5);assert.equal(v.players.length,4)});
  views.forEach(v=>assert.deepEqual(v,views[0]));
  for(let i=1;i<4;i++) assert.ok((await ask(clients[i],'roll',{roomId,version:4+i})).ok);
  assert.equal(server.rooms.get(roomId).turn,0);
  server.rooms.get(roomId).players[0].position=95;
  assert.ok((await ask(clients[0],'roll',{roomId,version:8})).ok);
  await new Promise(r=>setTimeout(r,30));
  views.forEach(v=>{assert.equal(v.phase,'finished');assert.equal(v.winnerId,created.playerId);assert.equal(v.players[0].position,100)});
  views.forEach(v=>assert.deepEqual(v,views[0]));
  assert.equal((await ask(clients[1],'roll',{roomId,version:9})).ok,false);
  console.log('PASS: four clients synchronize, admission and rolls enforced, all four turns rotate, winner synchronized and further rolls blocked.');
 } finally {clients.forEach(s=>s.disconnect());await new Promise(r=>server.io.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
