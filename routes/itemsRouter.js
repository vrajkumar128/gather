const itemsRouter = require('express').Router();

const Item = require('../models/item');
const { getCounter } = require('../database');

// Handle :itemId URL parameter
itemsRouter.param('itemId', async (req, res, next, itemId) => {

  // Try to find the item with itemId in the database and attach it to the request object
  try {
    const item = await Item.findById(itemId);

    if (item) {
      req.item = item;
      next();
    } else {
      res.status(404).render('error', { 
        message: "Item not found", 
        error: { status: "404" } 
      });
    }
  } catch (err) {
    res.status(404).render('error', {
      message: "Item not found",
      error: { status: "404" }
    });
  }
});

// Ensure that a received item is valid
const validateItem = (req, res, next) => {
  const { title, description, imageUrl } = req.body;
  const receivedItem = new Item({
    title,
    description,
    imageUrl
  });
  receivedItem.validateSync();

  // If validateSync() finds any errors, send a 400 code and reload the appropriate page; otherwise proceed
  if (receivedItem.errors) {
    if (req.route.path === '/create') {
      res.status(400).render('create', { newItem: receivedItem });
    } else if (req.route.path === '/:itemId/update') {
      res.status(400).render('update', { 
        originalItem: req.item, 
        item: receivedItem
      });
    }
  } else {
    req.receivedItem = receivedItem;
    next();
  }
};

// Render item creation page
itemsRouter.get('/create', (req, res) => {
  res.render('create');
});

// Create a new item
itemsRouter.post('/create', validateItem, async (req, res, next) => {
  const newItem = req.receivedItem;
  newItem._id = await getCounter("items");

  try {
    await newItem.save();
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

// Render single item view
itemsRouter.get('/:itemId', (req, res) => {
  const item = req.item;
  res.render('single', { item });
});

// Render item update page
itemsRouter.get('/:itemId/update', (req, res) => {
  const item = req.item;
  res.render('update', { item });
});

// Update an individual item
itemsRouter.post('/:itemId/update', validateItem, async (req, res, next) => {
  const itemToUpdate = req.item;
  const updatedItem = req.receivedItem;

  try {
    await Item.updateOne(itemToUpdate, { $set: {
      title: updatedItem.title,
      description: updatedItem.description,
      imageUrl: updatedItem.imageUrl
    }});
    res.redirect(`/items/${itemToUpdate._id}`);
  } catch (err) {
    next(err);
  }
});

// Delete an individual item

module.exports = itemsRouter;