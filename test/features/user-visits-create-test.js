const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

// Add your tests below:
describe('User visits create page', () => {
  it('can post a new item', () => {
    const newItem = buildItemObject();
    browser.url('/items/create');

    browser.setValue('#title-input', newItem.title);
    browser.setValue('#description-input', newItem.description);
    browser.setValue('#imageUrl-input', newItem.imageUrl);
    browser.click('#submit-button');

    browser.url('/');
    assert.include(browser.getText('body'), newItem.title);
    assert.include(browser.getAttribute('body img', 'src'), newItem.imageUrl);
  });
});
