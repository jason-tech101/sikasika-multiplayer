SIKASIKA — TECHNOVA iGAMES (MULTIPLAYER MVP STARTER)

FILES
- index.html: Existing Sikasika interface and card-game logic, updated to connect to a room server.
- server.js: Node.js + Socket.IO room/presence and host state-relay server.
- package.json: Server dependencies and start command.

RUN LOCALLY
1. Install Node.js 18 or newer.
2. Extract this folder.
3. Open a terminal in this folder and run: npm install
4. Run: npm start
5. Open http://localhost:3000 on the computer running the server.
6. For testing across devices on the same Wi-Fi, open http://YOUR-COMPUTER-LAN-IP:3000 on the other device. Allow the port through the computer firewall if prompted.
7. For internet play, deploy this folder to a Node.js host that supports WebSockets and HTTPS, then share the hosted URL.
8. Select “Play With Friends” or “Play Online” and use the same room code. The first person to create/join an empty room is host.

WHAT IS CONNECTED
- Server-backed room presence (names and connected-player list).
- Room state is relayed from the host to other connected browsers.
- Host controls the card call/deal; guests receive host-synchronized game state.
- Demo balances remain browser-local in localStorage; they are NOT a shared wallet.

IMPORTANT LIMITATIONS — NOT A FINISHED PRODUCTION MULTIPLAYER GAME
- This is an MVP starter for testing, not a production-ready release.
- Room/game state is held in server memory and resets when the server restarts.
- The original game logic was designed for local demo opponents. Full server-authoritative multiplayer turn/deal/settlement logic still needs dedicated implementation and multi-device testing; state relay is not tamper-proof.
- Voice controls currently test the local microphone only. Remote voice chat and speaking-player audio detection are NOT implemented; these require WebRTC/signalling and HTTPS.
- Player accounts and balances are not stored in a database and are not synchronized across devices.
- Demo credits only. No deposits, withdrawals, real money or prizes.

TROUBLESHOOTING
- If Socket.IO is unavailable, run the game through `npm start` and open the server URL, not by double-clicking index.html.
- Check server availability at /health.
- Use HTTPS for microphone permission and any future WebRTC voice implementation.
