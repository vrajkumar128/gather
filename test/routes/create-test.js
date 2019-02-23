const { assert } = require('chai');
const request = require('supertest');

const app = require('../../app');
const Item = require('../../models/item');

const { parseTextFromHTML, buildItemObject} = require('../test-utils');
const { connectDatabaseAndDropData, disconnectDatabase } = require('../setup-teardown-utils');

describe('Server path: /items/create', async () => {
  const itemToCreate = await buildItemObject();

  beforeEach(connectDatabaseAndDropData);

  afterEach(disconnectDatabase);

  // Write your describe blocks below:
  describe('GET', () => {
    it('renders empty input fields', async () => {
      const response = await request(app)
        .get('/items/create');

      assert.exists(parseTextFromHTML(response.text, `#title-input[value=""]`));
      assert.include(parseTextFromHTML(response.text, '#description-input'), '');
      assert.exists(parseTextFromHTML(response.text, `#imageUrl-input[value=""]`));
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

    it('redirects to index', async () => {
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

    it('displays an error message when no description is supplied', async () => {
      const newItem = {
        title: "title",
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

    it('displays an error message when no imageUrl is supplied', async () => {
      const newItem = {
        title: "title",
        description: "description"
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
