const Item = require('../../models/item');
const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../../database');

describe('Model: Item', () => {
  beforeEach(async () => {
    await mongoose.connect(databaseUrl, options);
    await mongoose.connection.db.dropDatabase();
  });

  afterEach(async () => {
    await mongoose.disconnect();
  });

  // Write your tests below:
  describe('#title', () => {
    it('is a String', () => {
      const titleAsNum = 4;

      const item = new Item({
        title: titleAsNum
      });

      assert.strictEqual(item.title, String(titleAsNum));
    });

    it('is required', () => {
      const item = new Item({
        title: ''
      });

      item.validateSync();

      assert.strictEqual(item.errors.title.message, 'Path `title` is required.');
    });
  });

  describe('#description', () => {
    it('is a String', () => {
      const descriptionAsNum = 4;

      const item = new Item({
        description: descriptionAsNum
      });

      assert.strictEqual(item.description, String(descriptionAsNum));
    });

    it('is required', () => {
      const item = new Item({
        description: ''
      });

      item.validateSync();

      assert.strictEqual(item.errors.description.message, 'Path `description` is required.');
    });
  });

  describe('#imageUrl', () => {
    it('is a String', () => {
      const imageUrlAsNum = 4;

      const item = new Item({
        imageUrl: imageUrlAsNum
      });

      assert.strictEqual(item.imageUrl, String(imageUrlAsNum));
    });

    it('is required', () => {
      const item = new Item({
        imageUrl: ''
      });

      item.validateSync();

      assert.strictEqual(item.errors.imageUrl.message, 'Path `imageUrl` is required.');
    });
  });
});
