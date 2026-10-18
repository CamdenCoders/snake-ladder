const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createServer}=require('../../snake-ladder_backend/server');
const {io}=require('socket.io-client');
const ask=(s,event,payload)=>new Promise((resolve,reject)=>s.timeout(2000).emit(event,payload,(err,result)=>err?reject(err):resolve(result)));
async function until(predicate) {for(let i=0;i<100;i++){if(predicate())return;await new Promise(r=>setTimeout(r,10));}throw Error('Timed out waiting for state');}
async function setup(t, options={}) {
 const server=createServer({port:0,logger:()=>{},animationMs:0,graceMs:150,dice:()=>1,...options});
 await new Promise(r=>server.io.httpServer.listening?r():server.io.httpServer.once('listening',r));
 const clients=[];
 async function connect(){const c=io(`http://localhost:${server.io.httpServer.address().port}`,{transports:['websocket'],reconnection:false});clients.push(c);await new Promise((r,j)=>{c.once('connect',r);c.once('connect_error',j)});return c;}
 t.after(async()=>{clients.forEach(c=>c.disconnect());await new Promise(r=>server.io.close(r));});
 const a=await connect(), b=await connect();
 const created=await ask(a,'create-room',{capacity:2});const roomId=created.state.roomId;
 const joined=await ask(b,'join-room',{roomId});const game=server.rooms.get(roomId);
 return {...server,connect,a,b,created,joined,game,roomId};
}
test('refresh restores identity, position and turn; invalid token fails; stale socket loses access',async t=>{
 const s=await setup(t,{graceMs:1500});
 await ask(s.a,'roll',{roomId:s.roomId,version:s.game.version});
 s.a.disconnect(); await until(()=>!s.game.players[0].connected);
 assert.equal((await ask(s.b,'roll',{roomId:s.roomId,version:s.game.version})).ok,false);
 const c=await s.connect();
 assert.equal((await ask(c,'resume-room',{roomId:s.roomId,token:'wrong'})).ok,false);
 const resumed=await ask(c,'resume-room',{roomId:s.roomId,token:s.created.token});
 assert.ok(resumed.ok);assert.ok((await ask(c,'resume-room',{roomId:s.roomId,token:s.created.token})).ok);assert.equal(resumed.playerId,s.created.playerId);assert.equal(resumed.state.players[0].position,2);assert.equal(resumed.state.turn,1);
 assert.ok(resumed.state.players.every(p=>!('token' in p)&&!('socketId' in p)));
 const replacement=await s.connect();assert.ok((await ask(replacement,'resume-room',{roomId:s.roomId,token:s.created.token})).ok);
 await until(()=>!c.connected);assert.equal(s.game.players[0].connected,true);
 assert.ok((await ask(s.b,'roll',{roomId:s.roomId,version:s.game.version})).ok);
});
test('timeout forfeits, declares surviving winner, and expired token cannot resume',async t=>{
 const s=await setup(t);s.b.disconnect();await until(()=>s.game.phase==='finished');
 assert.equal(s.game.winnerId,s.created.playerId);
 const c=await s.connect();assert.equal((await ask(c,'resume-room',{roomId:s.roomId,token:s.joined.token})).ok,false);
 await ask(s.a,'leave-room',{roomId:s.roomId});assert.equal(s.rooms.has(s.roomId),false);
});
test('rematch needs every vote, resets shared state; explicit leave forfeits and frees membership',async t=>{
 const s=await setup(t);s.game.players[0].position=99;
 await ask(s.a,'roll',{roomId:s.roomId,version:s.game.version});assert.equal(s.game.phase,'finished');
 assert.ok((await ask(s.a,'rematch',{roomId:s.roomId})).ok);assert.equal(s.game.phase,'finished');
 await ask(s.a,'rematch',{roomId:s.roomId});assert.equal(s.game.rematchVotes.length,1);
 await ask(s.b,'rematch',{roomId:s.roomId});assert.equal(s.game.phase,'playing');assert.equal(s.game.turn,0);
 assert.deepEqual(s.game.players.map(p=>p.position),[1,1]);assert.equal(s.game.lastMove,null);
 await ask(s.a,'leave-room',{roomId:s.roomId});assert.equal(s.game.winnerId,s.joined.playerId);
 assert.ok((await ask(s.a,'create-room',{capacity:3})).ok);
});
test('waiting slots are released and animation lock rejects early next turns',async t=>{
 const s=await setup(t,{animationMs:1000});
 assert.ok((await ask(s.a,'roll',{roomId:s.roomId,version:s.game.version})).ok);
 assert.equal((await ask(s.b,'roll',{roomId:s.roomId,version:s.game.version})).ok,false);
 const a=await s.connect(),b=await s.connect();const created=await ask(a,'create-room',{capacity:3});
 await ask(b,'join-room',{roomId:created.state.roomId});await ask(b,'leave-room',{roomId:created.state.roomId});
 assert.equal(s.rooms.get(created.state.roomId).players.length,1);
 assert.ok((await ask(b,'join-room',{roomId:created.state.roomId})).ok);
});
test('three-player turns skip leavers and abandoned rooms expire',async t=>{
 const s=await setup(t);const c=await s.connect(),d=await s.connect(),e=await s.connect();
 const created=await ask(c,'create-room',{capacity:3}),roomId=created.state.roomId;
 await ask(d,'join-room',{roomId});await ask(e,'join-room',{roomId});
 const game=s.rooms.get(roomId);await ask(c,'roll',{roomId,version:game.version});
 await ask(d,'leave-room',{roomId});assert.equal(game.turn,2);assert.equal(game.phase,'playing');
 assert.ok((await ask(e,'roll',{roomId,version:game.version})).ok);assert.equal(game.turn,0);
 c.disconnect();e.disconnect();await until(()=>!s.rooms.has(roomId));
});
test('normal server reserves time for the original dice spin before token movement',async t=>{
 const s=await setup(t,{animationMs:undefined});
 const result=await ask(s.a,'roll',{roomId:s.roomId,version:s.game.version});
 assert.ok(result.ok);assert.equal(result.state.lastMove.diceMs,1500);assert.equal(result.state.lastMove.duration,1840);
 assert.equal(result.state.busyUntil,result.state.lastMove.startedAt+1840);
 assert.equal((await ask(s.b,'roll',{roomId:s.roomId,version:s.game.version})).ok,false);
});
