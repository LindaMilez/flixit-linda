const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tokenSchema = new Schema({
    _userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user'
    },
    token: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: { expires: '24h' }
    }
})

module.exports = mongoose.model('tokens', tokenSchema)
