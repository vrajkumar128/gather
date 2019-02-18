const router = require('express').Router();

const Item = require('../models/item');

router.get('/', async (req, res) => {
  const items = await Item.find({});
  res.render('index', { items });
});

// Add additional routes below:
router.get('/items/create', (req, res) => {
  res.render('create');
});

router.post('/items/create', async (req, res) => {
  const { title, description, imageUrl } = req.body;
  const newItem = new Item({
    title,
    description,
    imageUrl
  });
  newItem.validateSync();

  if (newItem.errors) {
    res.status(400).render('create', { newItem });
  }

  await newItem.save();
  res.redirect('/');
});

module.exports = router;
