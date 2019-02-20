const { assert } = require('chai');
const { buildItemObject } = require('../test-utils');
const request = require('supertest');

const app = require('../../app');
const Item = require('../../models/item');

describe('User visits root', () => {
  describe('without existing items', () => {
    it('starts blank', () => {
      browser.url('/');
      assert.equal(browser.getText('#items-container'), '');
    });
  });

  describe('and can navigate', () => {
    it('to create page', async () => {
      browser.url('/');

      browser.click('a[href="/items/create"]');
      const browserUrl = await browser.getUrl();

      assert.strictEqual(browserUrl.match(/\/[^\/]*\/[^\/]*$/)[0], '/items/create');
    });

    it('to single item view', async () => {
      const itemToCreate = buildItemObject();
      browser.url('/items/create');
      browser.setValue('#title-input', itemToCreate.title);
      browser.setValue('#description-input', itemToCreate.description);
      browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
      browser.click('#submit-button');
      const createdItem = await Item.findOne(itemToCreate);
      browser.url('/');

      browser.click(`.item-card a[href="/items/${createdItem._id}"]`);
      const browserUrl = await browser.getUrl();

      assert.strictEqual(browserUrl.match(/\/[^\/]*\/[^\/]*$/)[0], `/items/${createdItem._id}`); 
    });
  });
});
