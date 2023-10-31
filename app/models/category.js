const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    default: '',
   
  },
  description:{
    type:String,
    default:'',
  },
  postimage: [
    {
      type: String,
      set: (icon) => {
        if (icon) {
          return icon;
        }
        return undefined; // Use undefined instead of an empty return
      },
    },],
  couponcode:{
    type:String,
    default:'',
  },
  couponstatus:{
    type:String,default:'false'
  },
  categorys: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  discount: {
    type: String,
    
  },
  urlpath: {
    type: String,
    required: true,
  },
  status: {
    type: String,
     required:true,
  },
  maincategory:{
    type:String,required:true
  }
}, {
  timestamps: true, 
});

const category = mongoose.model('category', schema);
module.exports = category;
