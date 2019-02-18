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
});
