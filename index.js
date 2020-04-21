const http = require("http");
const express = require("express");

const app = express();
app.use(express.json());

/* THE PLAN */

// 1: Initialize the Vending Machine Data.

//  add different US coins for invalid coin error handling later on?

let penny = {
  diameter: "19.05mm",
  thickness: "1.52mm",
};
let nickel = {
  diameter: "21.21mm",
  thickness: "1.95mm",
};

let dime = {
  diameter: "17.91mm",
  thickness: "1.35mm",
};

let quarter = {
  diameter: 24.26,
  thickness: 1.75,
};

let beverage_vending = {
  coin_slot_dimentions: quarter,
  in_use: false,
  coins_in_use: 0,
  coin_total: 0, // <-- for total coins accrued endpoint posibility.
  inventory: [
    {
      id: 1,
      item: "Powerade",
      quantity: 5,
    },
    {
      id: 2,
      item: "Gatorade",
      quantity: 5,
    },
    {
      id: 3,
      item: "Vitamin Water",
      quantity: 5,
    },
  ],
};

// 2: Both GET requests to allow data visualization (maybe add a bonus request in to see how many coins/¢ have been accrued?).

// GET inventory. Array of remaining item quantities. Integers.
app.get("/inventory", (req, res) => {
  let total_inventory = [];
  beverage_vending.inventory.forEach((item) => {
    total_inventory.push(item.quantity);
  });
  res.status(200).json(total_inventory);
});

// GET inventory for single item. Integer

app.get("/inventory/:id", (req, res) => {
  let beverage = beverage_vending.inventory.filter((item) => {
    return item.id == req.params.id;
  });
  let response_body = {
    quantity: beverage[0].quantity,
  };
  res.status(200).json(response_body);
});

// 3: PUT request to handle coin insertion.
// 4: PUT request to handle beverage purchase. Including error handling if item is out of stock, or insufficient coins.
// 5: DELETE request to handle coin returns.

const testServer = http.createServer(app);
testServer.listen(4040);
console.log(`Test Server running on http://localhost:4040`);
