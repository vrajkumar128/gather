const { jsdom } = require('jsdom');

const Item = require('../models/item');
const { getCounter } = require('../database');

// Create and return a sample Item object
const buildItemObject = async (options = {}) => {
  const title = options.title || 'My favorite item';
  const imageUrl = options.imageUrl || 'http://placebear.com/g/200/300';
  const description = options.description || 'Just the best item';
  const _id = await getCounter("items");
  return { title, imageUrl, description, _id };
};

// Add a sample Item object to mongodb
const seedItemToDatabase = async (options = {}) => {
  const item = await Item.create(await buildItemObject(options));
  return item;
};

// extract text from an Element by selector.
const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

// find an image element by its source
const findImageElementBySource = (htmlAsString, src) => {
  const image = jsdom(htmlAsString).querySelector(`img[src="${src}"]`);
  if (image !== null) {
    return image;
  } else {
    throw new Error(`Image with src "${src}" not found in HTML string`);
  }
};

module.exports = {
  buildItemObject,
  seedItemToDatabase,
  parseTextFromHTML,
  findImageElementBySource
};
