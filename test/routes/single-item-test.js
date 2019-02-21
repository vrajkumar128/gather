const { assert } = require('chai');
const request = require('supertest');

const app = require('../../app');

const { parseTextFromHTML, seedItemToDatabase, findImageElementBySource } = require('../test-utils');
const { connectDatabaseAndDropData, diconnectDatabase } = require('../setup-teardown-utils');

describe('Server path: /items/:id', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  // Write your test blocks below:
  describe('/GET', () => {
    it('renders the item`\s title', async () => {
      const item = await seedItemToDatabase();

      const response = await request(app)
        .get(`/items/${item._id}`);

      assert.include(parseTextFromHTML(response.text, '#item-title'), item.title);
    });

    it('renders the item`\s description', async () => {
      const item = await seedItemToDatabase();

      const response = await request(app)
        .get(`/items/${item._id}`);

      assert.include(parseTextFromHTML(response.text, '#item-description'), item.description);
    });

    it('renders the item`\s image', async () => {
      const item = await seedItemToDatabase();

      const response = await request(app)
        .get(`/items/${item._id}`);

      const imageElement = findImageElementBySource(response.text, item.imageUrl);
      assert.strictEqual(imageElement.src, item.imageUrl);
    });
  });
});
