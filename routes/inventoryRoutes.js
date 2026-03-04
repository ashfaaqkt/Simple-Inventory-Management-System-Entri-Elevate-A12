const express = require('express');
const {
  getInventory,
  getInventoryById,
  createInventory,
  editInventory,
  removeInventory,
} = require('../controllers/inventoryController');
const { validateInventoryInput } = require('../middleware/validation');

const router = express.Router();

router.get('/', getInventory);
router.get('/:id', getInventoryById);
router.post('/', validateInventoryInput, createInventory);
router.put('/:id', validateInventoryInput, editInventory);
router.delete('/:id', removeInventory);

module.exports = router;
