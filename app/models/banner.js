const mongoose = require('mongoose');

const userSchemas = new mongoose.Schema({
 
    
  url: {
    type: String,
    required: true,
  },
      bannerimage: [
        {
          type: String,
          set: (icon) => {
            if (icon) {
              return icon;
            }
            return undefined; 
          },
        },
      ],
      
     
    }, {
      timestamps: true, 
    });
    



const banner = mongoose.model('banner', userSchemas);

module.exports = banner;
