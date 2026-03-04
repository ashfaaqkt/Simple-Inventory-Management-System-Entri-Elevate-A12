const validateStringField = (value, field) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return `${field} must be a non-empty string.`;
  }
  return null;
};

const validateQuantityField = (value) => {
  if (!Number.isInteger(value) || value < 0) {
    return 'quantity must be a non-negative integer.';
  }
  return null;
};

const validateInventoryInput = (req, res, next) => {
  const { name, category, quantity } = req.body;
  const isCreate = req.method === 'POST';
  const isUpdate = req.method === 'PUT';

  if (isUpdate) {
    const allowedFields = ['name', 'category', 'quantity'];
    const incomingFields = Object.keys(req.body);

    if (incomingFields.length === 0) {
      return next({
        status: 400,
        message: 'At least one field (name, category, quantity) is required for update.',
      });
    }

    const hasInvalidField = incomingFields.some((field) => !allowedFields.includes(field));
    if (hasInvalidField) {
      return next({
        status: 400,
        message: 'Only name, category, and quantity can be updated.',
      });
    }
  }

  if (isCreate) {
    if (name === undefined || category === undefined || quantity === undefined) {
      return next({
        status: 400,
        message: 'name, category, and quantity are required.',
      });
    }
  }

  if (name !== undefined) {
    const nameError = validateStringField(name, 'name');
    if (nameError) {
      return next({ status: 400, message: nameError });
    }
  }

  if (category !== undefined) {
    const categoryError = validateStringField(category, 'category');
    if (categoryError) {
      return next({ status: 400, message: categoryError });
    }
  }

  if (quantity !== undefined) {
    const quantityError = validateQuantityField(quantity);
    if (quantityError) {
      return next({ status: 400, message: quantityError });
    }
  }

  return next();
};

module.exports = {
  validateInventoryInput,
};
