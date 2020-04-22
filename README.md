# Vend-O-Matic

Beverage vending machine - Tested Via HTTP before production environment

## Getting Started

- Clone Repository to local device
- Open terminal and navigate to root directory
- Start local server

```bash
node index.js
```

## API Endpoints

| Method | Endpoint                              | Request Body | Response Code | Response Headers                                                           | Response Body                        |
| ------ | ------------------------------------- | ------------ | ------------- | -------------------------------------------------------------------------- | ------------------------------------ |
| GET    | `http://localhost:4040/inventory`     |              | 200           |                                                                            | Array of item Quantities. (Integers) |
| GET    | `http://localhost:4040/inventory:id`  |              | 200           |                                                                            | Remaining Item Quantities (Integer)  |
| PUT    | `http://localhost:4040/`              | {"coin":1}   | 204           | X-Coins: \${# of coins accepted}                                           |                                      |
| PUT    | `http://localhost:4040/inventory/:id` |              | 200           | X-Coins: \${# of coins returned } X-Inventory-Remaining: \${item quantity} | {"Quantity": \${# Of Items Vended}}  |
| PUT    | `http://localhost:4040/inventory/:id` |              | 404           | X-Coins: \${# of coins accepted}                                           |                                      |
| PUT    | `http://localhost:4040/inventory/:id` |              | 403           | X-Coins: \${# of coins accepted}                                           |                                      |
| DELETE | `http://localhost:4040/`              |              | 204           | X-Coins: \${# of coins to be returned}                                     |                                      |
