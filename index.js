const http = require("http");
const express = require("express");

const app = express();
app.use(express.json());

const testServer = http.createServer(app);
testServer.listen(4040);
console.log(`Test Server running on http://localhost:4040`);
