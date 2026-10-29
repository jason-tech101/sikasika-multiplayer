const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: true } });
const rooms = new Map();
app.use(express.static(__dirname));
app.get('/health', (_req, res) => res.json({ ok: true, service: 'Sikasika multiplayer MVP' }));
function publicPlayers(room) { return [...room.players.values()].map(p => ({ id: p.id, name: p.name })); }
function publishPlayers(code) { const room = rooms.get(code); if (room) io.to(code).emit('room-users', { players: publicPlayers(room) }); }
io.on('connection', socket => {
  socket.on('join-room', ({ room: rawCode, name: rawName } = {}) => {
    const code = String(rawCode || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 24);
    const name = String(rawName || 'Player').trim().slice(0, 18) || 'Player';
    if (!code) return socket.emit('room-error', 'Enter a valid room code.');
    let room = rooms.get(code);
    if (!room) { room = { hostId: socket.id, players: new Map(), state: null }; rooms.set(code, room); }
    if (room.players.size >= 8 && !room.players.has(socket.id)) return socket.emit('room-error', 'This room is full (maximum 8 connected players).');
    const oldCode = socket.data.roomCode;
    if (oldCode && oldCode !== code) { const oldRoom = rooms.get(oldCode); if (oldRoom) { oldRoom.players.delete(socket.id); publishPlayers(oldCode); } socket.leave(oldCode); }
    room.players.set(socket.id, { id: socket.id, name }); socket.join(code); socket.data.roomCode = code;
    socket.emit('room-joined', { room: code, playerId: socket.id, isHost: room.hostId === socket.id, players: publicPlayers(room), state: room.state });
    publishPlayers(code);
  });
  socket.on('game-state', ({ room: rawCode, state } = {}) => {
    const code = String(rawCode || '').toUpperCase(); const room = rooms.get(code);
    if (!room || room.hostId !== socket.id || socket.data.roomCode !== code || !state || typeof state !== 'object') return;
    room.state = state; socket.to(code).emit('game-state', state);
  });
  socket.on('disconnect', () => {
    const code = socket.data.roomCode; if (!code) return; const room = rooms.get(code); if (!room) return;
    room.players.delete(socket.id);
    if (room.hostId === socket.id) { const next = room.players.keys().next(); if (!next.done) { room.hostId = next.value; io.to(code).emit('host-left'); } else { rooms.delete(code); return; } }
    publishPlayers(code);
  });
});
const port = process.env.PORT || 3000;
server.listen(port, '0.0.0.0', () => console.log(`Sikasika server listening on port ${port}`));
