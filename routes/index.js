const router = require('express').Router();

const Item = require('../models/item');

// Render index page with all items from database
router.get('/', async (req, res) => {
  const items = await Item.find({});
  res.render('index', { items });
});

// Import and mount itemsRouter
const itemsRouter = require('./itemsRouter');
router.use('/items', itemsRouter);

module.exports = router;
