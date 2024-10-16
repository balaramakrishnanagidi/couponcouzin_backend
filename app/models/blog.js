const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  coupon: {
    type: Boolean,
    required: true
  },
  itemUrl: {
    type: String,
    required: true
  },
  contents: [
    {
      subheading: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
    },
  ],
  image: [{
    type: String,
    set: (icon) => {
      if (icon) {
        return icon;
      }
      return undefined;
    },
  }],
  metaTitle: {
    type: String,
    required: true,
  },
  metaDescription: {
    type: String,
    required: true,
  },
  primaryKeyword: {
    type: String,
    required: true,
  },
  secondaryKeyword: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;

