const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Item = require('../../models/item');

const {parseTextFromHTML, buildItemObject} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

const findImageElementBySource = (htmlAsString, src) => {
  const image = jsdom(htmlAsString).querySelector(`img[src="${src}"]`);
  if (image !== null) {
    return image;
  } else {
    throw new Error(`Image with src "${src}" not found in HTML string`);
  }
};

describe('Server path: /items/create', () => {
  const itemToCreate = buildItemObject();

  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  // Write your describe blocks below:
  describe('GET', () => {
    it('renders empty input fields', async () => {
      const response = await request(app)
        .get('/items/create');

      assert.strictEqual(parseTextFromHTML(response.text, '#title-input'), '');
      assert.strictEqual(parseTextFromHTML(response.text, '#description-input'), '');
      assert.strictEqual(parseTextFromHTML(response.text, '#imageUrl-input'), '');
    });
  });

  describe('POST', () => {
    it('creates a new item in the database', async () => {
     const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreate);

      const createdItem = await Item.findOne(itemToCreate);
      assert.exists(createdItem);
    });

    it('redirects to /', async () => {
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreate);

      assert.strictEqual(response.status, 302);
      assert.strictEqual(response.headers.location, '/');
    });

    it('displays an error message when no title is supplied', async () => {
      const newItem = {
        description: "description",
        imageUrl: "imageUrl"
      };

      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(newItem);

      const createdItem = await Item.findOne(newItem);
      assert.notExists(createdItem);
      assert.strictEqual(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });
  });
});
