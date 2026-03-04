const inventory = [];
let nextId = 1;

const getAllItems = () => inventory;

const getItemById = (id) => inventory.find((item) => item.id === id);

const addItem = ({ name, category, quantity }) => {
  const timestamp = new Date().toISOString();
  const newItem = {
    id: nextId,
    name: name.trim(),
    category: category.trim(),
    quantity,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  nextId += 1;
  inventory.push(newItem);
  return newItem;
};

const updateItem = (id, updates) => {
  const item = getItemById(id);
  if (!item) {
    return null;
  }

  if (typeof updates.name === 'string') {
    item.name = updates.name.trim();
  }

  if (typeof updates.category === 'string') {
    item.category = updates.category.trim();
  }

  if (typeof updates.quantity === 'number') {
    item.quantity = updates.quantity;
  }

  item.updatedAt = new Date().toISOString();
  return item;
};

const deleteItem = (id) => {
  const index = inventory.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  const [deletedItem] = inventory.splice(index, 1);
  return deletedItem;
};

module.exports = {
  getAllItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
};
