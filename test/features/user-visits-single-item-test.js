const { assert } = require('chai');
const { seedItemToDatabase } = require('../test-utils');

const { connectDatabaseAndDropData, disconnectDatabase } = require('../setup-teardown-utils');

describe('User visits single item view', () => {

  beforeEach(connectDatabaseAndDropData);

  afterEach(disconnectDatabase);

  it('the item appears on the page', async () => {
    const item = await seedItemToDatabase();

    await browser.url(`/items/${item._id}`);

    assert.strictEqual(await browser.getAttribute('.single-item-img img', 'src'), item.imageUrl);
  });

  describe('and can navigate', () => {
    it('back to index page', async () => {
      browser.url('/');
      const indexUrl = await browser.getUrl();
      const item = await seedItemToDatabase();
      await browser.url(`/items/${item._id}`);

      await browser.click('a[href="/"]');

      assert.strictEqual(await browser.getUrl(), indexUrl);
    });

    it('to update page', async () => {
      const item = await seedItemToDatabase();
      await browser.url(`/items/${item._id}/update`);
      const updateUrl = await browser.getUrl();
      await browser.url(`/items/${item._id}`);

      await browser.click(`a[href="${item._id}/update"]`);

      assert.strictEqual(await browser.getUrl(), updateUrl);
    });
  })
});