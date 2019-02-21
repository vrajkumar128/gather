const { assert } = require('chai');
const { seedItemToDatabase, findImageElementBySource } = require('../test-utils');
const { jsdom } = require('jsdom');

describe('User visits single item view', () => {
  it('the item appears on the page', async () => {
    const item = await seedItemToDatabase();

    await browser.url(`/items/${item._id}`);
    const bodyText = await browser.getText('body');

    assert.include(bodyText, item.title);
    assert.include(bodyText, item.description);
    assert.strictEqual(await browser.getAttribute('.single-item-img img', 'src'), item.imageUrl);
  });
});