const mongoose = require('mongoose');

const userSchemas = new mongoose.Schema({
 
    Name: {
        type: String,
        required: true,
      },
    
      postimage: [
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
      urlpath: {
        type: String,
        required: true,
      }
     
    }, {
      timestamps: true, 
    });
    



const websites = mongoose.model('website', userSchemas);

module.exports = websites;
