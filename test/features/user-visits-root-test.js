const { assert } = require('chai');
const { seedItemToDatabase } = require('../test-utils');

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

      await browser.click('a[href="/items/create"]');
      const browserUrl = await browser.getUrl();

      assert.strictEqual(browserUrl.match(/\/[^\/]*\/[^\/]*$/)[0], '/items/create');
    });

    it('to single item view', async () => {
      const item = await seedItemToDatabase();
      browser.url('/');

      await browser.click(`.item-card a[href="/items/${item._id}"]`);
      const browserUrl = await browser.getUrl();

      assert.strictEqual(browserUrl.match(/\/[^\/]*\/[^\/]*$/)[0], `/items/${item._id}`); 
    });
  });
});
