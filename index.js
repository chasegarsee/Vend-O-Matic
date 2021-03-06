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

let in_use = beverage_vending.in_use;
let coins_in_use = beverage_vending.coins_in_use;

app.put("/", (req, res) => {
  if (in_use === false) {
    in_use = true;
  }
  req.body = { coin: 1 };
  coins_in_use += 1;
  res.set({
    "Content-Type": "application/json",
    "X-Coins": coins_in_use,
  });
  res.status(204).json(coins_in_use);
});

// 4: PUT request to handle beverage purchase. Including error handling if item is out of stock, or insufficient coins.
app.put("/inventory/:id", (req, res) => {
  let beverage = beverage_vending.inventory.filter((item) => {
    return item.id == req.params.id;
  });
  // If there are no coins in the coins_in_use, the vending machine isnt in_use. Promp to incert coins.
  if (in_use === false) {
    res.set({
      "Content-Type": "application/json",
      "X-Message": `Beverages are $0.50 each. Please insert 2 quarters to purchase beverage.`,
    });
    res.sendStatus(400);
    // ERROR HANDLING: If there is only 1 Quarter, prompt to incert 1 additional.
  } else if (coins_in_use < 2) {
    res.set({
      "Content-Type": "application/json",
      "X-Message": `Beverages are $0.50 each. Please insert 1 additional quarter`,
      "X-Coins": coins_in_use,
    });
    res.sendStatus(403);
    //ERROR HANDLING: If there are enough coins, but the beverage is unavailable - Notify
  } else if (coins_in_use > 1 && beverage[0].quantity === 0) {
    res.set({
      "Content-Type": "application/json",
      "X-Message": `${beverage[0].item} is no longer in stock.`,
      "X-Coins": coins_in_use,
    });
    res.sendStatus(404);
  } else {
    // successful transaction
    let beverage_new_quantity = beverage[0].quantity - 1;
    let new_beverage_data = {
      id: beverage[0].id,
      item: beverage[0].item,
      quantity: beverage_new_quantity,
    };

    let selected_beverage = beverage_vending.inventory.indexOf(beverage[0]);
    beverage_vending.inventory.splice(selected_beverage, 1, new_beverage_data);

    // Math for quarters
    beverage_vending.coin_total += 2;
    coins_in_use -= 2;
    let customer_remaining_coins = coins_in_use;
    coins_in_use = 0;

    in_use = false;
    let body = { quantity: 1 };
    res.set({
      "Content-Type": "application/json",
      "X-Coins": `${customer_remaining_coins}`,
      "X-Message": `${beverage[0].item}`,
      "X-Inventory-Remaining": beverage_new_quantity,
    });
    res.status(200).send(body);
  }
});

// 5: DELETE request to handle coin returns if the Customer decides not to buy anything at all.

app.delete("/", (req, res) => {
  if (in_use) {
    in_use = false;
    customer_remaining_coins = coins_in_use;
    coins_in_use = 0;
    res.set({
      "Content-Type": "application/json",
      "X-Coins": customer_remaining_coins,
    });
    res.sendStatus(204);
  }
  // Add edge case that customers try to refund money but no quarters have been inserted. (Vending Machine in_use = false)
  else {
    res.set({
      "Content-Type": "application/json",
      "X-Message": `${coins_in_use} quarters to return`,
    });
    res.sendStatus(204);
  }
});

const testServer = http.createServer(app);
testServer.listen(4040);
console.log(`Test Server running on http://localhost:4040`);
