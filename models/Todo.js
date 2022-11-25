const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/** Todo create schema */
const TodoSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: String
  },
  complete: {
    type: Boolean
  },
  image: {
    type: String
  },
});

const TodoModel = mongoose.model('todos', TodoSchema);

module.exports = TodoModel;