const {
  getAllItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
} = require('../model/inventoryData');

const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const parseNumberQuery = (value, label) => {
  if (value === undefined) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    return { error: `${label} must be a non-negative integer.` };
  }

  return parsed;
};

const getInventory = (req, res, next) => {
  const { category, quantity, minQuantity, maxQuantity, search } = req.query;

  const quantityParsed = parseNumberQuery(quantity, 'quantity');
  if (quantityParsed && typeof quantityParsed === 'object') {
    return next({ status: 400, message: quantityParsed.error });
  }

  const minParsed = parseNumberQuery(minQuantity, 'minQuantity');
  if (minParsed && typeof minParsed === 'object') {
    return next({ status: 400, message: minParsed.error });
  }

  const maxParsed = parseNumberQuery(maxQuantity, 'maxQuantity');
  if (maxParsed && typeof maxParsed === 'object') {
    return next({ status: 400, message: maxParsed.error });
  }

  if (minParsed !== undefined && maxParsed !== undefined && minParsed > maxParsed) {
    return next({ status: 400, message: 'minQuantity cannot be greater than maxQuantity.' });
  }

  let results = [...getAllItems()];

  if (category) {
    const normalizedCategory = category.toLowerCase();
    results = results.filter(
      (item) => item.category.toLowerCase() === normalizedCategory
    );
  }

  if (quantityParsed !== undefined) {
    results = results.filter((item) => item.quantity === quantityParsed);
  }

  if (minParsed !== undefined) {
    results = results.filter((item) => item.quantity >= minParsed);
  }

  if (maxParsed !== undefined) {
    results = results.filter((item) => item.quantity <= maxParsed);
  }

  if (search) {
    const term = search.toLowerCase();
    results = results.filter((item) => item.name.toLowerCase().includes(term));
  }

  return res.status(200).json({
    success: true,
    count: results.length,
    data: results,
  });
};

const getInventoryById = (req, res, next) => {
  const id = parseId(req.params.id);
  if (!id) {
    return next({ status: 400, message: 'Invalid item id.' });
  }

  const item = getItemById(id);
  if (!item) {
    return next({ status: 404, message: 'Item not found.' });
  }

  return res.status(200).json({ success: true, data: item });
};

const createInventory = (req, res) => {
  const { name, category, quantity } = req.body;
  const item = addItem({ name, category, quantity });

  return res.status(201).json({
    success: true,
    message: 'Item created successfully.',
    data: item,
  });
};

const editInventory = (req, res, next) => {
  const id = parseId(req.params.id);
  if (!id) {
    return next({ status: 400, message: 'Invalid item id.' });
  }

  const updated = updateItem(id, req.body);
  if (!updated) {
    return next({ status: 404, message: 'Item not found.' });
  }

  return res.status(200).json({
    success: true,
    message: 'Item updated successfully.',
    data: updated,
  });
};

const removeInventory = (req, res, next) => {
  const id = parseId(req.params.id);
  if (!id) {
    return next({ status: 400, message: 'Invalid item id.' });
  }

  const deleted = deleteItem(id);
  if (!deleted) {
    return next({ status: 404, message: 'Item not found.' });
  }

  return res.status(200).json({
    success: true,
    message: 'Item deleted successfully.',
    data: deleted,
  });
};

module.exports = {
  getInventory,
  getInventoryById,
  createInventory,
  editInventory,
  removeInventory,
};
