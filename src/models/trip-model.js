const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const tripSchema = Schema({
  name: {
    unique: true,
    required: true,
    type: String
  },
  users: {
    required: true,
    type: []
  },
  // users: [{name: String}],
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Trip', tripSchema)
