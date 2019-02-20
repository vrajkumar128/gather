const { assert } = require('chai');
const { buildItemObject } = require('../test-utils');
const request = require('supertest');

const app = require('../../app');
const Item = require('../../models/item');

describe('User visits single item view', () => {
  it('the item\'s description appears on the page', async () => {
    const itemToCreate = buildItemObject();
    browser.url('/items/create');
    browser.setValue('#title-input', itemToCreate.title);
    browser.setValue('#description-input', itemToCreate.description);
    browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
    browser.click('#submit-button');
    const createdItem = await Item.findOne(itemToCreate);
    browser.url('/');
    const browserUrl1 = await browser.getUrl();
    console.log("************* BROWSER URL 1 *************", browserUrl1);

    browser.click(`.item-card a[href="/items/${createdItem._id}"]`);
    const browserUrl2 = await browser.getUrl();
    console.log("************* BROWSER URL 2 *************", browserUrl2);

    assert.include(browser.getText('body'), createdItem.description); 
  });
});