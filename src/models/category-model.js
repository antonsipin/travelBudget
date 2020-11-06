const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const categorySchema = Schema({
  name: {
    required: true,
    type: String
  },
  cost: {
    required: true,
    type: Number
  },
  users: {
    required: true,
    type: Array
  },
  trip: String,
  createdAt: {type: Date, default: Date.now},
  updatedAt: { type: Date, default: Date.now },
  tripModel: { type: Schema.Types.ObjectId, ref: 'Trip' }
})

module.exports = mongoose.model('Category', categorySchema)
