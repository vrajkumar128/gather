const { assert } = require('chai');
const { buildItemObject } = require('../test-utils');

const { connectDatabaseAndDropData, disconnectDatabase } = require('../setup-teardown-utils');

// Add your tests below:
describe('User visits create page', () => {

  beforeEach(connectDatabaseAndDropData);

  afterEach(disconnectDatabase);

  it('can post a new item', async () => {
    const newItem = await buildItemObject();
    await browser.url('/items/create');

    await browser.setValue('#title-input', newItem.title);
    await browser.setValue('#description-input', newItem.description);
    await browser.setValue('#imageUrl-input', newItem.imageUrl);
    await browser.click('#submit-button');
    await browser.url('/');
    
    assert.include(await browser.getText('body'), newItem.title);
    assert.include(await browser.getAttribute('body img', 'src'), newItem.imageUrl);
  });

  describe('and can navigate', () => {
    it('back to index page', async () => {
      browser.url('/');
      const indexUrl = await browser.getUrl();
      await browser.url('/items/create');

      await browser.click('a[href="/"]');

      assert.strictEqual(await browser.getUrl(), indexUrl);
    });
  });
});
