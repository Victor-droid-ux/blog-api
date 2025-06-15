const http = require('http');
const app = require('./app');

const { port } = require('./config/kyes');

// Create an HTTP server using the Express app
const server = http.createServer(app);

// listen on the specified port
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
server.on('error', (error) => {
  console.error(`Server error: ${ error.message }`);
});
// server.on('close', () => {
//   console.log('Server is closing');
// });
// server.on('listening', () => {
//   console.log(`Server is listening on port ${port}`);
// });
// server.on('connection', (socket) => {
//   console.log(`New connection established: ${socket.remoteAddress}:${socket.remotePort}`);
// });
// server.on('upgrade', (request, socket, head) => {
//   console.log(`Upgrade request received: ${request.url}`);
//   // Handle WebSocket upgrade here if needed
// }); 
// server.on('clientError', (error, socket) => {
//   console.error(`Client error: ${error.message}`);
//   socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
// });
// server.on('timeout', () => {
//   console.log('Server timeout');
// });
// server.on('request', (req, res) => {
//   console.log(`Request received: ${req.method} ${req.url}`);
//   // Handle request here if needed
//   res.on('finish', () => {
//     console.log(`Response sent: ${res.statusCode}`);
//   });
// });
// server.on('disconnect', () => {
//   console.log('Client disconnected');
// });
