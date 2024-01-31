const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  position:{
    x:{
      type: Number
    },
    y: {
      type:Number
    }
  },
  imageUrl: {
    type: String,
    required: true
  }/*
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }*/
});

module.exports = mongoose.model('Token', tokenSchema);
