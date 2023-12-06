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

