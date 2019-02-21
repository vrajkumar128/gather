const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

// Add your tests below:
describe('User visits create page', () => {
  it('can post a new item', async () => {
    const newItem = buildItemObject();
    await browser.url('/items/create');

    await browser.setValue('#title-input', newItem.title);
    await browser.setValue('#description-input', newItem.description);
    await browser.setValue('#imageUrl-input', newItem.imageUrl);
    await browser.click('#submit-button');
    await browser.url('/');
    
    assert.include(await browser.getText('body'), newItem.title);
    assert.include(await browser.getAttribute('body img', 'src'), newItem.imageUrl);
  });
});
