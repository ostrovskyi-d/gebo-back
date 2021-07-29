const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const catSchema = new Schema({
    name: String,
    slug: {type: String, index: true},

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: 'Category'
    },
    ancestors: [{
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        index: true
      },
      name: String,
      slug: String
    }],
    catId: {
      type: String,
      unique: true
    },
  },
  {
    timestamps: {
      created_at: new Date().toDateString()
    }
  }
)

catSchema.set('toJSON', {
  virtuals: true
});

// const Ad = ;

module.exports = mongoose.model('Category', catSchema);
// export default Ad;
