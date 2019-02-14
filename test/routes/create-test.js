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
    it('creates and renders a new item', async () => {
      const newItem = buildItemObject();

      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(newItem);

      assert.include(parseTextFromHTML(response.text, '.item-title'), newItem.title);
      const imageElement = findImageElementBySource(response.text, newItem.imageUrl);
      assert.exists(imageElement);
    });
  });
});
