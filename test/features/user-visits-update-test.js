const { assert } = require('chai');
const { seedItemToDatabase } = require('../test-utils');

const { connectDatabaseAndDropData, disconnectDatabase } = require('../setup-teardown-utils');

describe('User visits update page', () => {

  beforeEach(connectDatabaseAndDropData);

  afterEach(disconnectDatabase);

  it('can update an item', async () => {
    const itemToUpdate = await seedItemToDatabase();
    const updatedTitle = "updated title";
    const updatedDescription = "updated description";
    await browser.url(`/items/${itemToUpdate._id}/update`);

    await browser.setValue('#title-input', updatedTitle);
    await browser.setValue('#description-input', updatedDescription);
    await browser.click('#submit-button');
    await browser.url(`/items/${itemToUpdate._id}`);

    assert.include(await browser.getText('body'), updatedTitle);
    assert.include(await browser.getText('body'), updatedDescription);
  });

  describe('and can navigate', () => {
    it('back to the single item view', async () => {
      const item = await seedItemToDatabase();
      await browser.url(`/items/${item._id}`);
      const singleItemUrl = await browser.getUrl();
      await browser.url(`/items/${item._id}/update`);

      await browser.click(`a[href="/items/${item._id}"]`);

      assert.strictEqual(await browser.getUrl(), singleItemUrl);
    });
  });
});