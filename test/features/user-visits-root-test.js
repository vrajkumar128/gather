const { assert } = require('chai');
const { seedItemToDatabase } = require('../test-utils');

const { connectDatabaseAndDropData, disconnectDatabase } = require('../setup-teardown-utils');

describe('User visits root', () => {
  describe('without existing items', () => {
    it('starts blank', async () => {
      await browser.url('/');

      const itemsContainerText = await browser.getText('#items-container');

      assert.strictEqual(itemsContainerText, '');
    });
  });

  describe('with existing items', () => {
    it('can view a single item', async () => {
      const item = await seedItemToDatabase();
      await browser.url(`/items/${item._id}`);
      const itemUrl = await browser.getUrl();
      await browser.url('/');

      await browser.click(`.item-card a[href="/items/${item._id}"]`);
      const browserUrl = await browser.getUrl();

      assert.strictEqual(browserUrl, itemUrl); 
    });

    it('can delete a single item', async () => {
      const item = await seedItemToDatabase();
      await browser.url('/');

      await browser.click(`.item-card .delete`);
      await browser.click('.confirm-delete-button');
      const bodyText = await browser.getText('body');
      
      assert.notInclude(bodyText, item.title, `${bodyText} does not include ${item.title}`);
    });
  });

  describe('and can navigate', () => {
    it('to create page', async () => {
      await browser.url('/items/create');
      const createUrl = await browser.getUrl();
      await browser.url('/');

      await browser.click('a[href="/items/create"]');
      const browserUrl = await browser.getUrl();

      assert.strictEqual(browserUrl, createUrl);
    });
  });
});
