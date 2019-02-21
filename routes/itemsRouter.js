const itemsRouter = require('express').Router();

const Item = require('../models/item');

// Handle :itemId URL parameter
itemsRouter.param('itemId', async (req, res, next, itemId) => {
  
  // Try to find the item with itemId in the database and attach it to the request object
  try {
    const item = await Item.findById(itemId);

    if (item) {
      req.item = item;
      next();
    } else {
      res.status(404).send("Item not found");
    }
  } catch (err) {
    next(err);
  }
});

// Ensure that a received item is valid
const validateItem = (req, res, next) => {
  const { title, description, imageUrl } = req.body;
  const newItem = new Item({
    title,
    description,
    imageUrl
  });
  newItem.validateSync();

  // If validateSync() finds any errors, send a 400 code and reload the create page; otherwise proceed
  if (newItem.errors) {
    res.status(400).render('create', { newItem });
  } else {
    req.newItem = newItem;
    next();
  }
};

// Render item creation page
itemsRouter.get('/create', (req, res) => {
  res.render('create');
});

// Create a new item
itemsRouter.post('/create', validateItem, async (req, res) => {
  const newItem = req.newItem;

  try {
    await newItem.save();
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

// View an individual item
itemsRouter.get('/:itemId', (req, res) => {
  const item = req.item;
  res.render('single', { item });
});

module.exports = itemsRouter;