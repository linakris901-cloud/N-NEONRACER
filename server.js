'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer, WebSocket } = require('ws');
const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);
const rooms = new Map();
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.json':'application/json; charset=utf-8','.ico':'image/x-icon'};
const server = http.createServer((req,res)=>{
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname); } catch { res.writeHead(400); return res.end('Bad request'); }
  if (pathname === '/') pathname = '/index.html';
  const target = path.resolve(ROOT, '.' + pathname);
  if (!target.startsWith(ROOT + path.sep) && target !== path.join(ROOT,'index.html')) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(target,(err,data)=>{ if(err){res.writeHead(err.code==='ENOENT'?404:500);return res.end('Not found');} res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});res.end(data); });
});
const wss = new WebSocketServer({server, maxPayload: 16 * 1024});
function safeText(v,max,fallback=''){return String(v??fallback).replace(/[<>\u0000-\u001f]/g,'').trim().slice(0,max)||fallback;}
function send(ws,obj){if(ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify(obj));}
function playersIn(room){return [...(rooms.get(room)||[])].filter(c=>c.readyState===WebSocket.OPEN&&c.player).map(c=>({id:c.player.id,name:c.player.name,car:c.player.car,color:c.player.color,shape:c.player.shape,lane:c.player.lane||1,score:c.player.score||0,speed:c.player.speed||0,boosting:!!c.player.boosting,running:!!c.player.running}));}
function broadcast(room,obj,except=null){for(const c of rooms.get(room)||[])if(c!==except)send(c,obj);}
function remove(ws){const room=ws.room;if(!room)return;const set=rooms.get(room);if(set){set.delete(ws);if(!set.size)rooms.delete(room);else broadcast(room,{type:'players',players:playersIn(room)});}ws.room=null;ws.player=null;}
wss.on('connection',(ws)=>{
 ws.on('message',(raw)=>{
  let msg;try{msg=JSON.parse(raw.toString())}catch{return send(ws,{type:'error',message:'Некорректное сообщение'});}
  if(msg.type==='join'){
   const room=safeText(msg.room,6).toUpperCase().replace(/[^A-Z0-9]/g,'');if(room.length<3)return send(ws,{type:'error',message:'Код комнаты должен содержать минимум 3 символа'});
   remove(ws);let set=rooms.get(room);if(!set){set=new Set();rooms.set(room,set)}if(set.size>=8)return send(ws,{type:'error',message:'Комната заполнена (максимум 8 гонщиков)'});
   ws.room=room;ws.player={id:Math.random().toString(36).slice(2,10),name:safeText(msg.name,18,'NIGHT PILOT'),car:safeText(msg.car,32,'VOLT GT'),color:/^#[0-9a-f]{6}$/i.test(msg.color)?msg.color:'#43f5e4',shape:['sport','hyper','suv','drag'].includes(msg.shape)?msg.shape:'sport',lane:1,score:0,speed:0,boosting:false,running:false};set.add(ws);
   send(ws,{type:'joined',room,id:ws.player.id,players:playersIn(room)});broadcast(room,{type:'players',players:playersIn(room)},ws);return;
  }
  if(msg.type==='leave'){remove(ws);return;}
  if(msg.type==='state'&&ws.room&&ws.player){const s=msg.state||{};ws.player.lane=Math.max(0,Math.min(2,Math.round(Number(s.lane)||0)));ws.player.score=Math.max(0,Math.min(1e9,Number(s.score)||0));ws.player.speed=Math.max(0,Math.min(1000,Number(s.speed)||0));ws.player.boosting=!!s.boosting;ws.player.running=!!s.running;ws.player.car=safeText(s.car,32,ws.player.car);ws.player.color=/^#[0-9a-f]{6}$/i.test(s.color)?s.color:ws.player.color;ws.player.shape=['sport','hyper','suv','drag'].includes(s.shape)?s.shape:ws.player.shape;broadcast(ws.room,{type:'state',players:playersIn(ws.room)},ws);}
 });
 ws.on('close',()=>remove(ws));ws.on('error',()=>remove(ws));
});
server.listen(PORT,'0.0.0.0',()=>{console.log(`NEON RACER ULTIMATE: http://localhost:${PORT}`);console.log('WebSocket multiplayer enabled; share the server address with friends on the same network.');});
