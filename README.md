# Simple Inventory Management System

Inventory Management System built with Node.js + Express (in-memory array storage) and a lightweight frontend UI.

## Assignment Context

- Program: Entri Elevate
- Assignment: Assignment 12
- Purpose: This project is created for study and learning purposes.
- Credit: Ashfaaq Feroz Muhammad

## Features

- Light-themed frontend design to manage inventory from browser
- Full inventory CRUD operations
- Query support for category and quantity filters
- Search inventory by item name
- In-memory runtime data store (`let inventory = []` style)
- Request validation middleware
- Centralized error handling middleware
- Modular project architecture (controllers, routes, middleware, model)

## Tech Stack

- Node.js
- Express
- dotenv
- cors
- Vanilla HTML/CSS/JavaScript frontend

## Project Structure

```text
inventory-backend/
├── index.js
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── Screenshot/
│   ├── Simple front end.png
│   └── server runing sucsfly on terminal.png
├── controllers/
│   └── inventoryController.js
├── routes/
│   └── inventoryRoutes.js
├── middleware/
│   ├── validation.js
│   └── errorHandler.js
├── model/
│   └── inventoryData.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run in development mode:

```bash
npm run dev
```

3. Production mode:

```bash
npm start
```

Server default URL: `http://localhost:5000`

Frontend URL: `http://localhost:5000`

## Frontend Preview

- The project includes a light, responsive frontend served from `/`.
- Use the UI to add, filter, search, update, and delete inventory items.

## Screenshots

- Frontend UI: [Simple front end.png](./Screenshot/Simple%20front%20end.png)
- Server Running in Terminal: [server runing sucsfly on terminal.png](./Screenshot/server%20runing%20sucsfly%20on%20terminal.png)

## API Endpoints

### Health

- `GET /api/health`

### Inventory

- `POST /api/inventory` - Create an item
- `GET /api/inventory` - Get all items (supports filtering/search)
- `GET /api/inventory/:id` - Get single item by ID
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item

## Query Parameters

For `GET /api/inventory`:

- `category` (string) - exact category filter (case-insensitive)
- `quantity` (number) - exact quantity filter
- `minQuantity` (number) - minimum quantity filter
- `maxQuantity` (number) - maximum quantity filter
- `search` (string) - case-insensitive name search

Example:

```http
GET /api/inventory?category=electronics&minQuantity=5&search=mouse
```

## Request Body Validation

### Create (`POST /api/inventory`)

Required fields:

```json
{
  "name": "Wireless Mouse",
  "category": "Electronics",
  "quantity": 15
}
```

### Update (`PUT /api/inventory/:id`)

At least one of:

- `name`
- `category`
- `quantity`

## Response Format

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error details"
}
```

## Notes

- Data is stored in-memory and resets whenever the server restarts.
- No database or file-based storage is used.
- This repository is maintained as a study-purpose assignment project.
