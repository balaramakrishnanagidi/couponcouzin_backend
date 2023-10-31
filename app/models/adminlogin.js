const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
     
    },
    password: {
        type: String,   
        default: ''
    },
    
});
const users = new mongoose.model('adminlogin', schema);
module.exports = users;