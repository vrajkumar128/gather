const itemsRouter = require('express').Router();

const Item = require('../models/item');
const mongoose = require('../database');

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

// Render item update page
itemsRouter.get('/:itemId/update', (req, res) => {
  const item = req.item;
  res.render('update', { item });
});

// Update an individual item
itemsRouter.post('/:itemId/update', validateItem, async (req, res, next) => {
  const item = req.item;
  const updatedItem = req.newItem;

  try {
    await Item.updateOne({ _id: item._id }, { $set: {
      title: updatedItem.title,
      description: updatedItem.description,
      imageUrl: updatedItem.imageUrl
    }});
    res.redirect(`/items/${item._id}`);
  } catch (err) {
    next(err);
  }
});

// Delete an individual item

module.exports = itemsRouter;