const http = require("http");
const express = require("express");

const app = express();
app.use(express.json());

/* THE PLAN */

// 1: Initialize the Vending Machine Data.
// 2: Both GET requests to allow data visualization (maybe add a bonus request in to see how many coins/¢ have been accrued?).
// 3: PUT request to handle coin insertion.
// 4: PUT request to handle beverage purchase. Including error handling if item is out of stock, or insufficient coins.
// 5: DELETE request to handle coin returns.

const testServer = http.createServer(app);
testServer.listen(4040);
console.log(`Test Server running on http://localhost:4040`);
