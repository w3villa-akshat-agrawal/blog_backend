const mongoose = require('mongoose');

const followingSchema = new mongoose.Schema({
  userId: {
    type: Number, 
    required: true,
    unique: true,
    index: true
  },
  follower: [
    {
      userId: {
        type: Number, 
        required: true,
        index: true
      },
      username: String,
      followedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});
module.exports = mongoose.model('Follower', followingSchema);
