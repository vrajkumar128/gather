const { assert } = require('chai');
const request = require('supertest');

const app = require('../../app');
const Item = require('../../models/item');

const { parseTextFromHTML, seedItemToDatabase } = require('../test-utils');
const { connectDatabaseAndDropData, disconnectDatabase } = require('../setup-teardown-utils');


describe('Server path: /items/:itemId/update', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(disconnectDatabase);

  // Write your test blocks below:
  describe('/GET', () => {
    it('renders pre-filled input fields', async () => {
      const item = await seedItemToDatabase();

      const response = await request(app)
        .get(`/items/${item._id}/update`);

      assert.exists(parseTextFromHTML(response.text, `#title-input[value="${item.title}"]`));
      assert.include(parseTextFromHTML(response.text, '#description-input'), item.description);
      assert.exists(parseTextFromHTML(response.text, `#imageUrl-input[value="${item.imageUrl}"]`));
    });
  });

  describe('/POST', () => {
    it('updates the item in the database', async () => {
      const itemToUpdate = await seedItemToDatabase();
      const updatedTitle = "updated title";

      const response = await request(app)
        .post(`/items/${itemToUpdate._id}/update`)
        .type('form')
        .send({
          title: updatedTitle,
          description: itemToUpdate.description,
          imageUrl: itemToUpdate.imageUrl
        });
      const updatedItem = await Item.findById(itemToUpdate.id);

      assert.strictEqual(updatedItem.title, updatedTitle);
    });

    it('redirects to the single item view', async () => {
      const item = await seedItemToDatabase();
      const response = await request(app)
        .post(`/items/${item._id}/update`)
        .type('form')
        .send({
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl
        });

      assert.strictEqual(response.status, 302);
      assert.strictEqual(response.headers.location, `/items/${item._id}`);
    });
  });
});
