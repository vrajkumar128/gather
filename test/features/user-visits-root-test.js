const { assert } = require('chai');
const { seedItemToDatabase } = require('../test-utils');

const { connectDatabaseAndDropData, disconnectDatabase } = require('../setup-teardown-utils');

describe('User visits root', () => {

  beforeEach(connectDatabaseAndDropData);

  afterEach(disconnectDatabase);

  describe('without existing items', () => {
    it('starts blank', () => {
      browser.url('/');

      assert.equal(browser.getText('#items-container'), '');
    });
  });

  describe('with existing items', () => {
    it('can view a single item', async () => {
      const item = await seedItemToDatabase();
      browser.url('/');

      await browser.click(`.item-card a[href="/items/${item._id}"]`);
      const browserUrl = await browser.getUrl();

      assert.strictEqual(browserUrl.match(/\/[^\/]*\/[^\/]*$/)[0], `/items/${item._id}`); 
    });

    it('can delete a single item', async () => {
      const item = await seedItemToDatabase();
      browser.url('/');

      await browser.click(`.item-card a[href="/items/${item._id}/delete"]`);
    });
  });

  describe('and can navigate', () => {
    it('to create page', async () => {
      browser.url('/');

      await browser.click('a[href="/items/create"]');
      const browserUrl = await browser.getUrl();

      assert.strictEqual(browserUrl.match(/\/[^\/]*\/[^\/]*$/)[0], '/items/create');
    });
  });
});
