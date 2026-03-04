require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const inventoryRoutes = require('./routes/inventoryRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Simple Inventory Management System API is running.',
  });
});

app.use('/api/inventory', inventoryRoutes);

app.use((req, res, next) => {
  next({ status: 404, message: `Route not found: ${req.originalUrl}` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
