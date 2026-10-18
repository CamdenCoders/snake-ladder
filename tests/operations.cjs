const {test}=require('node:test');
const assert=require('node:assert/strict');
const http=require('node:http');
const {io}=require('socket.io-client');
const {createServer}=require('../../snake-ladder_backend/server');
const ask=(socket,event,payload)=>new Promise((resolve,reject)=>socket.timeout(2000).emit(event,payload,(err,result)=>err?reject(err):resolve(result)));
function request(url) {return new Promise((resolve,reject)=>http.get(url,{headers:{Connection:'close'}},response=>{
 let body='';response.on('data',chunk=>body+=chunk);response.on('end',()=>resolve({status:response.statusCode,headers:response.headers,body:JSON.parse(body)}));
}).on('error',reject));}
async function setup(t,options={}) {
 const records=[],clients=[];
 const server=createServer({port:0,animationMs:0,logger:record=>records.push(record),...options});
 await new Promise((resolve,reject)=>{server.io.httpServer.once('listening',resolve);server.io.httpServer.once('error',reject);});
 const url=`http://localhost:${server.io.httpServer.address().port}`;
 async function connect() {
  const socket=io(url,{transports:['websocket'],reconnection:false});clients.push(socket);
  await new Promise((resolve,reject)=>{socket.once('connect',resolve);socket.once('connect_error',reject);});return socket;
 }
 t.after(async()=>{clients.forEach(socket=>socket.disconnect());await new Promise(resolve=>server.io.close(resolve));});
 return {...server,url,connect,records};
}
test('health reports availability and counts without room/player credentials',async t=>{
 const s=await setup(t);let health=await request(`${s.url}/health`);
 assert.equal(health.status,200);assert.deepEqual(health.body,{status:'ok',uptimeSeconds:0,rooms:0,connections:0});
 assert.equal(health.headers['cache-control'],'no-store');
 const a=await s.connect(),created=await ask(a,'create-room',{capacity:3});
 health=await request(`${s.url}/health`);assert.equal(health.body.rooms,1);assert.equal(health.body.connections,1);
 const text=JSON.stringify(health.body);assert.ok(!text.includes(created.token));assert.ok(!text.includes(created.state.roomId));
 assert.equal((await request(`${s.url}/missing`)).status,404);
 await ask(a,'leave-room',{roomId:created.state.roomId});assert.equal((await request(`${s.url}/health`)).body.rooms,0);
});
test('socket spam is rejected without mutating state, logged once, and allowed after expiry',async t=>{
 const s=await setup(t,{rateLimit:{perSocket:2,perAddress:100,windowMs:150}}),a=await s.connect();
 const created=await ask(a,'create-room',{capacity:2});await ask(a,'join-room',{roomId:'FFFFFF'});
 const game=s.rooms.get(created.state.roomId),version=game.version;
 for(let i=0;i<3;i++) {const result=await ask(a,'leave-room',{roomId:game.roomId});assert.equal(result.ok,false);assert.match(result.error,/Too many requests/);assert.ok(result.retryAfterMs>0);}
 assert.equal(game.version,version);assert.equal(s.records.filter(r=>r.event==='rate_limited').length,1);
 await new Promise(resolve=>setTimeout(resolve,160));assert.ok((await ask(a,'leave-room',{roomId:game.roomId})).ok);
});
test('address budget is shared across connections, preventing reconnect bypass',async t=>{
 const s=await setup(t,{rateLimit:{perSocket:100,perAddress:2,windowMs:10000}});
 const a=await s.connect(),created=await ask(a,'create-room',{capacity:3});
 const b=await s.connect();assert.ok((await ask(b,'join-room',{roomId:created.state.roomId})).ok);
 const c=await s.connect(),result=await ask(c,'join-room',{roomId:created.state.roomId});
 assert.equal(result.ok,false);assert.match(result.error,/Too many requests/);assert.equal(s.rooms.get(created.state.roomId).players.length,2);
});
test('malformed requests and unexpected failures have safe responses and token-free logs',async t=>{
 const s=await setup(t,{dice:()=>{throw Error('private-internal-detail');}}),a=await s.connect();
 assert.equal((await ask(a,'create-room',null)).error,'Invalid request.');
 const created=await ask(a,'create-room',{capacity:2}),b=await s.connect();await ask(b,'join-room',{roomId:created.state.roomId});
 const version=s.rooms.get(created.state.roomId).version;
 const result=await ask(a,'roll',{roomId:created.state.roomId,version});
 assert.equal(result.ok,false);assert.match(result.error,/server could not complete/);
 assert.equal(s.rooms.get(created.state.roomId).version,version);
 assert.ok(s.records.some(r=>r.event==='request_failed'&&r.level==='error'));
 const records=JSON.stringify(s.records);assert.ok(!records.includes(created.token));assert.ok(!records.includes('private-internal-detail'));
 assert.equal((await request(`${s.url}/health`)).status,200);
});
test('requests without acknowledgments still consume the budget without creating rooms',async t=>{
 const s=await setup(t,{rateLimit:{perSocket:1,perAddress:100,windowMs:10000}}),a=await s.connect();
 a.emit('create-room',{capacity:2});const result=await ask(a,'create-room',{capacity:2});
 assert.equal(result.ok,false);assert.match(result.error,/Too many requests/);assert.equal(s.rooms.size,0);
});
